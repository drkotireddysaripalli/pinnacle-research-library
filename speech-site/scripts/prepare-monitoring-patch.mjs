// Two diagnosed common defects over the accepted union; no content/layout rebuild enters this patch.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = process.cwd();
const names = process.argv.slice(2);
assert.equal(names.length, 4, 'Explicit prior/new stage and upload names required');
const dirs = names.map(name => {
  const absolute = path.resolve(root, name), relative = path.relative(root, absolute);
  assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative), 'Path must remain inside this project');
  return absolute;
});
assert.equal(new Set(dirs).size, 4);
const [prior, priorUpload, next, nextUpload] = dirs;
await fs.access(path.join(prior, 'index.html'));
await fs.access(path.join(priorUpload, 'wrangler.jsonc'));
await fs.mkdir(next);
await fs.cp(prior, next, {recursive: true});
await fs.mkdir(nextUpload);
await fs.cp(priorUpload, nextUpload, {recursive: true});
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const main = path.join(nextUpload, 'pinnacle-route-v12.mjs');
let worker = await fs.readFile(main, 'utf8');
const inventoryMatch = worker.match(/const SPEECH_INVENTORY ?= ?(\{[^\n]+\});/);
assert(inventoryMatch, 'Existing complete Worker inventory required');
const inventory = JSON.parse(inventoryMatch[1]);
const html = Object.keys(inventory).filter(p => p.startsWith('/pinnacle-pages-html/') && p.endsWith('.html') && !p.includes('preview'));
assert.equal(html.length, 48, 'Only the currently accepted 48-page portfolio');
const removed = [' aria-label="About the National Autism Helpline"', ' aria-label="Find a Pinnacle centre"'];
for (const file of html) {
  const body = await fs.readFile(path.join(prior, file), 'utf8');
  let corrected = body;
  for (const attribute of removed) {
    assert.equal(corrected.split(attribute).length, 2, file + ': one instance of each shared label expected');
    corrected = corrected.replace(attribute, '');
  }
  await fs.writeFile(path.join(next, file), corrected);
  inventory[file] = sha(corrected).slice(0, 16);
}
worker = worker.replace(inventoryMatch[0], 'const SPEECH_INVENTORY=' + JSON.stringify(inventory) + ';');
await fs.writeFile(main, worker);
const before = "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;";
const after = before.replace(';', ' https://static.cloudflareinsights.com;');
const runtime = await fs.readFile(path.join(priorUpload, 'speech-handler.mjs'), 'utf8');
assert.equal(runtime.split(before).length, 2);
const correctedRuntime = runtime.replace(before, after);
const source = await fs.readFile('deployment/speech-handler.mjs', 'utf8');
assert.equal(source.replaceAll('\r\n', '\n'), correctedRuntime.replaceAll('\r\n', '\n'), 'Committed common runtime source must match this sole policy change');
await fs.writeFile(path.join(nextUpload, 'speech-handler.mjs'), correctedRuntime);
const config = JSON.parse(await fs.readFile(path.join(nextUpload, 'wrangler.jsonc'), 'utf8'));
config.assets.directory = path.relative(nextUpload, next).replaceAll('\\', '/');
await fs.writeFile(path.join(nextUpload, 'wrangler.jsonc'), JSON.stringify(config, null, 2) + '\n');

async function files(directory, prefix = '') {
  const output = [];
  for (const entry of await fs.readdir(directory, {withFileTypes: true})) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) output.push(...await files(path.join(directory, entry.name), relative));
    else output.push(relative);
  }
  return output.sort();
}
assert.deepEqual(await files(prior), await files(next), 'Complete union file set retained');
const changed = new Set(html.map(file => file.slice(1).split('/').join(path.sep)));
let unchanged = 0;
for (const file of await files(prior)) {
  if (changed.has(file)) continue;
  assert.equal(sha(await fs.readFile(path.join(prior, file))), sha(await fs.readFile(path.join(next, file))), file + ' retained');
  unchanged++;
}
for (const file of ['discovery-handler.mjs', 'speech-enquiry-handler.mjs', 'centre-facilities.mjs', 'enrolment-handler.mjs']) {
  assert.equal(sha(await fs.readFile(path.join(priorUpload, file))), sha(await fs.readFile(path.join(nextUpload, file))), file + ' runtime retained');
}
const receipt = {at: new Date().toISOString(), prior: names[0], priorUpload: names[1], stage: names[2], upload: names[3],
  changedHtml: html, htmlChange: 'Remove redundant common helpline and centre-link aria-labels only', unchangedUnionFiles: unchanged,
  runtimeChange: 'Allow existing Cloudflare auto-injected beacon host in public HTML script-src; strict preview preserved',
  otherRuntimeModulesRetained: 4, verifyAssetsRetained: true, routingAndBindingsChange: false};
await fs.writeFile('deployment/monitoring-v151-staged-20261001.json', JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({stage: names[2], changedHtml: html.length, unchangedUnionFiles: unchanged, otherRuntimeModulesRetained: 4}));
