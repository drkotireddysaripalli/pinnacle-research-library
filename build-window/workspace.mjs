// Development entry point. Reuses the portal's existing builders and tests.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn, spawnSync} from 'node:child_process';
import {browserTestFingerprint, generatedHashes, inputFingerprint, makeSnapshots, requireCandidate} from './candidate.mjs';
import {pageContracts} from '../speech-site/scripts/page-quality-contracts.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(here);
const site = path.join(root, 'speech-site');
const results = path.join(here, 'results');
const action = process.argv[2] || 'doctor';
const previewPort = process.env.PINNACLE_PREVIEW_PORT || '4340';
if (!/^\d+$/.test(previewPort) || Number(previewPort)<1024 || Number(previewPort)>65535) throw new Error('PINNACLE_PREVIEW_PORT must be an unprivileged local port.');
const previewURL = 'http://127.0.0.1:' + previewPort;
const localNode = path.join(here, '.toolchain', 'node_modules', 'node', 'bin', process.platform === 'win32' ? 'node.exe' : 'node');
const expectedNode = fs.readFileSync(path.join(here, '.node-version'), 'utf8').trim();
const expectedNpm = fs.readFileSync(path.join(here, '.npm-version'), 'utf8').trim();
if (process.versions.node !== expectedNode && fs.existsSync(localNode) && fs.realpathSync(localNode) !== fs.realpathSync(process.execPath)) {
  const run = spawnSync(localNode, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {stdio: 'inherit', env: process.env});
  if (run.error) throw run.error;
  process.exit(run.status ?? 1);
}

function git(...args) {
  const run = spawnSync('git', args, {cwd: root, encoding: 'utf8', windowsHide: true});
  if (run.error || run.status !== 0) throw new Error(run.error?.message || run.stderr.trim());
  return run.stdout.trim();
}
function npmCli() {
  if (process.env.npm_execpath && fs.existsSync(process.env.npm_execpath)) return process.env.npm_execpath;
  for (const dir of (process.env.PATH || '').split(path.delimiter)) {
    for (const name of ['npm', 'npm.cmd']) {
      const candidate = path.join(dir, name);
      if (!fs.existsSync(candidate)) continue;
      const real = fs.realpathSync(candidate);
      if (real.endsWith('npm-cli.js')) return real;
      for (const cli of [path.join(dir, 'node_modules', 'npm', 'bin', 'npm-cli.js'), path.resolve(dir, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js')]) {
        if (fs.existsSync(cli)) return cli;
      }
    }
  }
  throw new Error('npm CLI not found. Add the installed npm runtime to PATH.');
}

const recipes = {
  install: ['npm', 'ci', '--no-audit', '--no-fund'],
  build: ['npm', 'run', 'build'],
  unit: ['npm', 'run', 'test:unit'],
  contracts: ['npm', 'run', 'test:testingbot-contract'],
  types: ['npm', 'run', 'check:types'],
  'ask-auth': ['npm', 'run', 'test:ask-auth'],
  'ask-content': ['npm', 'run', 'test:ask-content'],
  'centre-contract': ['node', 'scripts/validate-centre-network.mjs'],
  'evidence-contract': ['python', 'scripts/test-growth-evidence-profile.py'],
  seo: ['node', '../build-window/seo-evidence.mjs'],
  'frog-local': ['node', '../build-window/frog-local.mjs'],
  'ask-build': ['npm', 'run', 'build:ask'],
  'ci-focused': ['node', '../build-window/ci-focused.mjs'],
  'ci-local': ['node', '../build-window/ci-local.mjs', ...(process.argv[3] ? [process.argv[3]] : [])],
  browser: ['npm', 'exec', '--', 'playwright', 'test', 'tests/browser/portal-smoke.spec.mjs', 'tests/browser/pinnacleai-layout.spec.mjs', '--project=phone-320', '--project=phone-390', '--project=tablet-768', '--project=desktop-1440'],
  'browser-webkit': ['npm', 'exec', '--', 'playwright', 'test', 'tests/browser/portal-smoke.spec.mjs', 'tests/browser/pinnacleai-layout.spec.mjs', '--project=webkit'],
  'browser-all': ['npm', 'exec', '--', 'playwright', 'test', '--project=phone-320', '--project=phone-390', '--project=tablet-768', '--project=desktop-1440'],
  'browser-firefox': ['npm', 'exec', '--', 'playwright', 'test', '--project=firefox'],
  'browser-webkit-all': ['npm', 'exec', '--', 'playwright', 'test', '--project=webkit'],
  'browser-edge': ['npm', 'exec', '--', 'playwright', 'test', '--project=edge'],
  'browser-enrolment': ['npm', 'exec', '--', 'playwright', 'test', 'tests/browser/enrolment.spec.mjs', '--project=phone-320', '--project=phone-390', '--project=tablet-768', '--project=desktop-1440'],
  'browser-shop': ['npm', 'exec', '--', 'playwright', 'test', 'tests/browser/shop.spec.mjs', 'tests/browser/book-languages.spec.mjs', 'tests/browser/portal-smoke.spec.mjs', '--project=phone-320', '--project=phone-390', '--project=tablet-768', '--project=desktop-1440'],
  speed: ['npm', 'run', 'check:speed', '--', process.argv[3] || 'enrolment', '--enforce'],
  preview: ['node', 'scripts/serve-quality-preview.mjs']
};
const selectedPage = action.startsWith('browser') && !['browser', 'browser-webkit'].includes(action) ? (process.argv[3] || 'enrolment') : action === 'speed' ? (process.argv[3] || 'enrolment') : undefined;
if (selectedPage && !pageContracts[selectedPage]) throw new Error('Choose a registered page: ' + Object.keys(pageContracts).join(', '));
const branch = git('branch', '--show-current');
const source = git('rev-parse', 'HEAD');
const siteSourceTree = git('rev-parse', 'HEAD:speech-site');
if (action === 'doctor') {
  const pkg = JSON.parse(fs.readFileSync(path.join(site, 'package.json'), 'utf8'));
  const npmVersion = spawnSync(process.execPath, [npmCli(), '--version'], {encoding:'utf8',windowsHide:true});
  console.log(JSON.stringify({root, site, branch: branch || '(detached)', source,
    originMain: git('rev-parse', 'origin/main'), node: process.version,
    expectedNode, expectedNpm, nodeMatchesCI: process.versions.node === expectedNode,
    npm: npmVersion.status === 0 ? npmVersion.stdout.trim() : 'unavailable',
    npmMatchesCI: npmVersion.status === 0 && npmVersion.stdout.trim() === expectedNpm,
    dependenciesInstalled: fs.existsSync(path.join(site, 'node_modules', 'astro', 'package.json')),
    npmCli: npmCli(), scripts: Object.keys(pkg.scripts), commands: ['doctor', 'sync', ...Object.keys(recipes)],
    pages: Object.keys(pageContracts), localWorkers: 2,
    screamingFrogInstalled: fs.existsSync('/Applications/Screaming Frog SEO Spider.app/Contents/MacOS/ScreamingFrogSEOSpiderLauncher'),
    previewURL: previewURL + '/',
    cloudTests: 'Use existing trusted CI / Windows coordinator. Local launcher starts no cloud sessions.'}, null, 2));
  process.exit(0);
}
if (action === 'sync') {
  const run = spawnSync('git', ['fetch', '--no-tags', 'origin', 'main'], {cwd: root, stdio: 'inherit'});
  if (run.error) throw run.error;
  if (run.status !== 0) process.exit(run.status ?? 1);
  console.log('Fetched main. Review the diff and reconcile your branch explicitly; no merge or rebase was performed.');
  process.exit(0);
}
if (!recipes[action]) throw new Error('Choose: doctor, sync, ' + Object.keys(recipes).join(', '));
if (!branch || ['main', 'master'].includes(branch)) throw new Error('Use a dedicated feature branch for this development launcher.');
if (process.versions.node !== expectedNode) throw new Error('Use Node '+expectedNode+' to match CI. See build-window/README.md.');
const npmVersion = spawnSync(process.execPath, [npmCli(), '--version'], {encoding:'utf8',windowsHide:true});
if (npmVersion.status !== 0 || npmVersion.stdout.trim() !== expectedNpm) throw new Error('Use npm '+expectedNpm+' to match CI. See build-window/README.md.');

fs.mkdirSync(results, {recursive: true});
const verifiedCandidate = action === 'preview' || action === 'speed' || action.startsWith('browser') ? requireCandidate(root, results) : undefined;
const generatedBefore = action === 'build' ? generatedHashes(root) : undefined;
const fingerprintBefore = action === 'build' ? inputFingerprint(root, makeSnapshots(generatedBefore, generatedBefore)) : undefined;
const [kind, ...args] = recipes[action];
const env = {...process.env, PINNACLE_RELEASE: 'production'};
env.PATH = path.dirname(process.execPath) + path.delimiter + (process.env.PATH || '');
// Always use the loopback candidate. Ambient shell configuration cannot select production.
delete env.PORTAL_ORIGIN;
env.QUALITY_PREVIEW_PORT = previewPort;
if (selectedPage) {
  env.PAGE_PATH = pageContracts[selectedPage].path;
  env.CANONICAL_PATH = pageContracts[selectedPage].canonical;
}
if (action.startsWith('browser')) {
  if (!fs.existsSync(path.join(site, 'dist', 'index.html'))) throw new Error('Build the static candidate first.');
  const previewRecord = path.join(results, 'preview.json');
  if (fs.existsSync(previewRecord)) {
    const record = JSON.parse(fs.readFileSync(previewRecord, 'utf8'));
    try {
      process.kill(record.childPid, 0);
      if (record.candidateFingerprint ? record.candidateFingerprint !== verifiedCandidate.fingerprint : record.siteSourceTree !== siteSourceTree) throw new Error('Running preview belongs to another candidate; restart it.');
      if (record.previewURL && record.previewURL!==previewURL) throw new Error('Set PINNACLE_PREVIEW_PORT to the port owned by this checkout preview.');
      env.PORTAL_ORIGIN = previewURL;
    } catch (error) {
      if (error.code !== 'ESRCH') throw error;
    }
  }
  if (previewPort!=='4340' && !env.PORTAL_ORIGIN) throw new Error('Start this checkout preview before testing a custom local port.');
}
if (action === 'preview' && !fs.existsSync(path.join(site, 'dist', 'index.html'))) throw new Error('Build the static candidate first.');
const actualArgs = kind === 'npm' ? [npmCli(), ...args] : args;
const startedAt = new Date().toISOString();
let browserEvidence;
if (action.startsWith('browser')) {
  browserEvidence = path.join(results, 'browser-evidence', action + '-' + (selectedPage || 'default') + '-' + startedAt.replace(/[:.]/g,'-'));
  fs.mkdirSync(browserEvidence,{recursive:true});
  actualArgs.push('--output',path.join(browserEvidence,'artifacts'));
  env.PLAYWRIGHT_HTML_OUTPUT_DIR=path.join(browserEvidence,'report');
}
const trackedSiteChangesBefore = git('status', '--porcelain', '--', 'speech-site');
// These byte-parity fixtures must be regenerated from this checkout's source,
// including its actual line endings. Reuse the existing small builders.
if (action === 'unit') {
  for (const script of ['build-public-ad-call.mjs', 'build-ad-call-bootstrap.mjs', 'build-book-attribution.mjs']) {
    const prep = spawnSync(process.execPath, ['scripts/' + script], {cwd: site, stdio: 'inherit', env});
    if (prep.error) throw prep.error;
    if (prep.status !== 0) throw new Error(script + ' failed before unit execution.');
  }
}
const executable = kind === 'python' ? (process.env.PINNACLE_PYTHON || 'python3') : process.execPath;
const log = fs.createWriteStream(path.join(results, action + (selectedPage ? '-' + selectedPage : '') + '.log'));
const child = spawn(executable, actualArgs, {cwd: site, stdio: ['inherit', 'pipe', 'pipe'], env});
child.stdout.on('data', bytes => {process.stdout.write(bytes); log.write(bytes);});
child.stderr.on('data', bytes => {process.stderr.write(bytes); log.write(bytes);});
const record = {action, branch, source, siteSourceTree, node: process.version, startedAt, childPid: child.pid,
  executable, args: actualArgs, selectedPage,
  previewURL,
  ...(verifiedCandidate ? {candidateFingerprint:verifiedCandidate.fingerprint,builtSource:verifiedCandidate.source} : {}),
  ...(browserEvidence ? {browserEvidence} : {}),
  ...(action.startsWith('browser') ? {browserTestFingerprint:browserTestFingerprint(root)} : {}),
  trackedSiteChangesBefore,
  scope: action.startsWith('browser') ? (['browser', 'browser-webkit'].includes(action) ? 'Existing static portal smoke + PinnacleAI layout cases on selected emulated projects' : action==='browser-enrolment' ? 'Existing enrolment response, receipt/reload and duplicate-submit cases at four Chromium sizes' : action==='browser-shop' ? 'Shop, Hindi/Telugu editions and shared-shell cases at four Chromium sizes; live digital cart, no purchase' : 'All registered local browser cases; inspect explicit skips and chosen page contract') : action,
  establishedByThisRun: 'Only the selected local command; no cloud, physical-device, deployment or business result is implied'};
const save = data => fs.writeFileSync(path.join(results, action + (selectedPage ? '-' + selectedPage : '') + '.json'), JSON.stringify({...record, ...data}, null, 2) + '\n');
save({status: 'running'});
let receivedSignal;
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {receivedSignal = signal; child.kill(signal);});
child.on('error', error => {save({status: 'failed', error: error.message, completedAt: new Date().toISOString()}); process.exitCode = 1;});
child.on('close', (code, signal) => {
  log.end();
  if (action.startsWith('browser') && record.browserTestFingerprint !== browserTestFingerprint(root)) {
    code=1; console.error('Browser tests changed during execution; this run cannot establish the final test source.');
  }
  if (action === 'build' && code === 0) {
    const generatedSnapshots = makeSnapshots(generatedBefore, generatedHashes(root));
    const fingerprint = inputFingerprint(root, generatedSnapshots);
    if (fingerprint !== fingerprintBefore) {code = 1; console.error('Build inputs changed during the build. Inspect the changes before rebuilding.');}
    fs.writeFileSync(path.join(results, 'candidate.json'), JSON.stringify({status: code === 0 ? 'passed' : 'failed', source, siteSourceTree,
      fingerprint, generatedSnapshots, builtAt: new Date().toISOString()}, null, 2) + '\n');
  }
  save({status: action === 'preview' && (signal || receivedSignal) ? 'stopped' : code === 0 ? 'passed' : 'failed',
    exitCode: code, signal: signal || receivedSignal || null, completedAt: new Date().toISOString(),
    trackedSiteChangesAfter: git('status', '--porcelain', '--', 'speech-site')});
  process.exitCode = action === 'preview' && (signal || receivedSignal) ? 0 : code ?? 1;
});
