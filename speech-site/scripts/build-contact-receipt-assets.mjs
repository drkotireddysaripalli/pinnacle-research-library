import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import './refresh-enquiry-referrer.mjs';

const names = [
  'contact-receipt.js',
  'contact-api.mjs',
  'contact-options.mjs',
  'enrolment-api.mjs',
  'enrolment-source.mjs',
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
