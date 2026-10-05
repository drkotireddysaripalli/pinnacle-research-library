// Isolated Lighthouse lab runs; never attaches to the owner's browser or submits a form.
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import net from 'node:net';
import {setTimeout as delay} from 'node:timers/promises';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import {chromium} from '@playwright/test';
import {pageContracts} from './page-quality-contracts.mjs';

const args = process.argv.slice(2);
const id = args[0] || 'occupational';
const knowledgeContracts = {
  'faq-answer': {path:'/faq/english/speech-therapy/autism-speech-therapy',canonical:'/faq/english/speech-therapy/autism-speech-therapy'},
  'faq-directory': {path:'/faq',canonical:'/faq'},
  'sunshine-directory': {path:'/sunshine',canonical:'/sunshine'},
  'mirracles-directory': {path:'/allmirracles',canonical:'/allmirracles'}
};
const contract = pageContracts[id] || knowledgeContracts[id];
if (!contract) throw Error('Choose a registered page: ' + Object.keys(pageContracts).join(', '));
const production = args.includes('--production');
const originArg = args.indexOf('--origin');
const requestedOrigin = originArg >= 0 ? args[originArg + 1] : process.env.PORTAL_ORIGIN;
if (originArg >= 0 && !requestedOrigin) throw Error('--origin requires an HTTP(S) origin.');
const origin = production ? 'https://www.pinnacleblooms.org' : requestedOrigin || 'http://127.0.0.1:4341';
const base = new URL(origin);
if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash || base.pathname !== '/') {
  throw Error('Use an HTTP(S) origin without credentials, a path or query.');
}
const url = new URL(production ? contract.canonical : contract.path, base).href;
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const output = path.resolve('audits/lighthouse', `${id}-${production ? 'production' : 'preview'}-${stamp}`);
await fs.mkdir(output, {recursive: true});
const summary = {at: new Date().toISOString(), id, url, kind: 'simulated lab measurements, not field Core Web Vitals', reports: []};
let server, serverError, browser;

async function availablePort() {
  const socket = net.createServer();
  await new Promise((resolve, reject) => { socket.once('error', reject); socket.listen(0, '127.0.0.1', resolve); });
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  return port;
}

async function ready() {
  for (let i = 0; i < 40; i++) {
    if (serverError) throw serverError;
    if (server.exitCode !== null) throw Error('The isolated quality preview could not start.');
    try {
      const response = await fetch(url, {signal: AbortSignal.timeout(1000)});
      if (response.status === 200) return;
    } catch { /* Wait only for the server owned by this command. */ }
    await delay(200);
  }
  throw Error('Build the production page first; the quality preview did not return HTTP 200.');
}

try {
  if (!production && !requestedOrigin) {
    server = spawn(process.execPath, ['scripts/serve-quality-preview.mjs'], {
      env: {...process.env, QUALITY_PREVIEW_PORT: '4341'}, stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true
    });
    server.once('error', error => { serverError = error; });
    server.stderr.on('data', bytes => { serverError = Error(bytes.toString().trim()); });
    await ready();
  }
  const port = await availablePort();
  browser = await chromium.launch({
    headless: true, ...(process.env.CHROME_PATH ? {executablePath: process.env.CHROME_PATH} : {}),
    args: [`--remote-debugging-port=${port}`, '--remote-debugging-address=127.0.0.1']
  });
  for (const device of ['mobile', 'desktop']) {
    const result = await lighthouse(url, {
      port, hostname: '127.0.0.1', logLevel: 'error', output: ['html', 'json'],
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      enableErrorReporting: false
    }, device === 'desktop' ? desktopConfig : undefined);
    if (!result) throw Error('Lighthouse returned no report.');
    const {lhr} = result;
    const reports = Array.isArray(result.report) ? result.report : [result.report];
    await fs.writeFile(path.join(output, `${device}.html`), reports[0]);
    await fs.writeFile(path.join(output, `${device}.json`), reports[1] || JSON.stringify(lhr, null, 2));
    if (lhr.runtimeError) throw Error(lhr.runtimeError.message);
    const scores = Object.fromEntries(Object.entries(lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)]));
    const metrics = Object.fromEntries([
      ['fcpMs', 'first-contentful-paint'], ['lcpMs', 'largest-contentful-paint'],
      ['tbtMs', 'total-blocking-time'], ['cls', 'cumulative-layout-shift'], ['speedIndexMs', 'speed-index']
    ].map(([key, audit]) => [key, lhr.audits[audit]?.numericValue ?? null]));
    const targets = {performance: 90, lcpMs: 2500, tbtMs: 200, cls: 0.1};
    const targetWarnings = [];
    if (scores.performance < targets.performance) targetWarnings.push('Performance below 90');
    for (const key of ['lcpMs', 'tbtMs', 'cls']) if (metrics[key] === null || metrics[key] > targets[key]) targetWarnings.push(`${key} exceeds target or is unavailable`);
    const findings = Object.values(lhr.audits).filter(a => a.score !== null && a.score < 1 && !['manual', 'informative', 'notApplicable'].includes(a.scoreDisplayMode))
      .map(a => ({id: a.id, title: a.title, displayValue: a.displayValue, savingsMs: a.details?.overallSavingsMs}));
    const report = {device, lighthouseVersion: lhr.lighthouseVersion, browser: lhr.environment.hostUserAgent,
      finalUrl: lhr.finalDisplayedUrl, scores, metrics, targets, targetWarnings, warnings: lhr.runWarnings, findings};
    summary.reports.push(report);
    console.log(JSON.stringify({device, scores, metrics, targetWarnings}));
  }
  if (args.includes('--enforce') && summary.reports.some(r => r.targetWarnings.length)) process.exitCode = 1;
} catch (error) {
  summary.error = error.message;
  process.exitCode = 1;
  console.error(error.message);
} finally {
  if (browser) await browser.close();
  if (server && server.exitCode === null) {
    const closed = new Promise(resolve => server.once('exit', resolve));
    server.kill();
    await closed;
  }
  await fs.writeFile(path.join(output, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  console.log('Lighthouse reports: ' + output);
}
