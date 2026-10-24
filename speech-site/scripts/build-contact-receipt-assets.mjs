import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {CENTRE_OPERATING_HOLDS} from '../public/pinnacle-pages-scripts/centre-operating-holds.mjs';
// Both refreshers write the same collectors; finish each before starting the next.
await import('./refresh-enquiry-validation.mjs');
await import('./refresh-enquiry-referrer.mjs');

// Reuse the published centre identities, excluding every held direct number.
// This lookup carries public IDs and paths only; telephone values never enter it.
const directory=JSON.parse(await fs.readFile(new URL('../src/data/centre-directory.json',import.meta.url),'utf8'));
const heldIds=new Set(CENTRE_OPERATING_HOLDS.map(c=>c.id)),heldPhones=new Set(CENTRE_OPERATING_HOLDS.map(c=>c.directTelephone));
const directPages=Object.fromEntries(directory.filter(c=>/^\+[1-9][0-9]{7,14}$/.test(c.directTelephone||'')&&!heldIds.has(c.id)&&!heldPhones.has(c.directTelephone)).map(c=>{
  const url=new URL(c.profileUrl);assert.equal(url.origin,'https://www.pinnacleblooms.org');assert(/^[a-z][a-z0-9_-]{1,63}$/.test(c.id));return[url.pathname,c.id];
}).sort(([a],[b])=>a.localeCompare(b)));
const collectorFile=new URL('../public/pinnacle-pages-scripts/speech-measurement.js',import.meta.url);
let collector=await fs.readFile(collectorFile,'utf8');
const directMarker=/\/\* PINNACLE_DIRECT_CENTRES_START \*\/[\s\S]*?\/\* PINNACLE_DIRECT_CENTRES_END \*\//g;
assert.equal((collector.match(directMarker)||[]).length,1,'One direct-centre lookup boundary');
collector=collector.replace(directMarker,'/* PINNACLE_DIRECT_CENTRES_START */\n  const directCentrePages='+JSON.stringify(directPages)+';\n  /* PINNACLE_DIRECT_CENTRES_END */');
await fs.writeFile(collectorFile,collector);

const names = [
  'contact-receipt.js',
  'contact-api.mjs',
  'contact-options.mjs',
  'enrolment-api.mjs',
  'enrolment-source.mjs',
  'enquiry-validation.mjs',
  'enquiry-referrer.mjs',
  'speech-measurement.js',
  'protection-consumer.mjs'
];
const sources = {};
for (const name of names) {
  const pathname = '/pinnacle-pages-scripts/' + name;
  const body = await fs.readFile(new URL('../public' + pathname, import.meta.url), 'utf8');
  sources[pathname] = {body, sha256: createHash('sha256').update(body).digest('hex')};
}
const output = '// Generated deterministically from the maintained contact dependency closure.\n' +
  'export const contactReceiptAssetSources=' + JSON.stringify(sources) + ';\n';
await fs.writeFile(new URL('../deployment/contact-receipt-assets.mjs', import.meta.url), output);
console.log(JSON.stringify({generated: 'deployment/contact-receipt-assets.mjs', assets: Object.keys(sources).length,
  hashes: Object.fromEntries(Object.entries(sources).map(([pathname, value]) => [pathname, value.sha256]))}, null, 2));
