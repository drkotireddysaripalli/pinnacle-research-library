import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {chromium} from '@playwright/test';

const stage = process.argv[2];
assert(stage, 'Explicit published stage required');
const origin = 'https://www.pinnacleblooms.org';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const owned = text => text.replace('<script async src="https://www.googletagmanager.com/gtag/js?id=AW-10810823199"></script>', '')
  .replace('<script src="https://www.pinnacleblooms.org/pinnacle-pages-scripts/google-ads-call.js"></script>', '');
const record = {at: new Date().toISOString(), stage, pages: [], controls: [], monitoring: []};
async function read(route, options = {}) {
  const response = await fetch(origin + route, {redirect: 'manual', ...options});
  return {status: response.status, bytes: Buffer.from(await response.arrayBuffer()), headers: response.headers};
}
const files = (await fs.readdir(stage + '/pinnacle-pages-html')).filter(file => file.endsWith('.html') && !file.includes('preview'));
let index = 0;
await Promise.all(Array.from({length: 4}, async () => {
  while (index < files.length) {
    const file = files[index++], expected = await fs.readFile(stage + '/pinnacle-pages-html/' + file, 'utf8');
    const route = new URL(expected.match(/rel="canonical" href="([^"]+)"/)[1]).pathname;
    const response = await read(route);
    assert.equal(response.status, 200, route);
    assert.equal(sha(owned(response.bytes.toString('utf8'))), sha(expected), route + ': expected public body');
    assert(response.headers.get('content-security-policy').includes('https://static.cloudflareinsights.com'), route + ': common public policy');
    record.pages.push({path: route, matched: true, monitoringPolicy: true});
  }
}));
for (const route of ['/best-occupational-therapy-center-india-proven-improvement-rate', '/enroll-autism-speech-aba-therapies-india']) {
  const regular = await read(route), variant = await read(route, {headers: {cookie: 'unknown=fixture; _gcl_au=fixture', authorization: 'Bearer fixture', range: 'bytes=0-1', 'cache-control': 'no-transform'}});
  assert.equal(variant.status, 200); assert.equal(sha(regular.bytes), sha(variant.bytes));
  record.controls.push({path: route, returningVisitorRetained: true});
}
const preview = await read('/pinnacle-pages-preview/enrolment');
assert.equal(preview.status, 301);
assert.equal(preview.headers.get('location'), origin + '/enroll-autism-speech-aba-therapies-india');
record.controls.push({path: '/pinnacle-pages-preview/enrolment', retiredPreviewRedirectRetained: true});
const frozen = await fs.readFile(stage.replace(/^release-/, '.worker-upload-') + '/pinnacle-route-v12.mjs', 'utf8');
const mapping = frozen.split('\n').find(line => line.startsWith('function publicBody('));
const mapVerify = vm.runInNewContext(mapping + '; publicBody', {ORIGIN: 'https://pinnacle-verify.saripalli.chatgpt.site', PUBLIC: origin + '/verify'});
const verify = await read('/verify/');
assert.equal(verify.status, 200);
assert.equal(sha(owned(verify.bytes.toString('utf8'))), sha(mapVerify(await fs.readFile(stage + '/index.html', 'utf8'))));
for (const [route, status] of [['/api/enrolment', 405], ['/Leadership/Maheshwari', 410], ['/leadership/Prudhvi%2dMatsa', 410], ['/national-autism-helpline', 200], ['/epass', 200], ['/', 200]]) {
  assert.equal((await read(route)).status, status); record.controls.push({path: route, status});
}
const browser = await chromium.launch({headless: true});
try {
  for (const route of ['/best-occupational-therapy-center-india-proven-improvement-rate', '/enroll-autism-speech-aba-therapies-india']) {
    const page = await browser.newPage();
    const errors = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    const beacon = page.waitForResponse(response => new URL(response.url()).pathname.replace(/\/$/, '') === '/cdn-cgi/rum' && response.request().method() === 'POST', {timeout: 15000});
    await page.goto(origin + route, {waitUntil: 'load'});
    const response = await beacon;
    assert([200, 204].includes(response.status()), 'Same-origin Cloudflare performance beacon accepted');
    assert.deepEqual(errors, [], 'No console errors after the policy correction');
    assert.equal(await page.locator('.portal-national-label').getAttribute('aria-label'), null);
    assert.equal(await page.locator('.portal-location').getAttribute('aria-label'), 'Find a centre');
    record.monitoring.push({path: route, beaconStatus: response.status(), sameOrigin: true, consoleErrors: 0, visibleAccessibleName: true});
    await page.close();
  }
} finally { await browser.close(); }
record.verifyRetained = true; record.liveEnrolmentSubmissions = 0; record.passed = true;
await fs.writeFile('deployment/monitoring-v151-live-20261001.json', JSON.stringify(record, null, 2) + '\n');
console.log(JSON.stringify({pages: record.pages.length, controls: record.controls.length, monitoring: record.monitoring.length, verifyRetained: true, passed: true}));
