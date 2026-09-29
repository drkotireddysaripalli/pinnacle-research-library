import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const origin = 'https://www.pinnacleblooms.org';
const endpoint = 'https://api.indexnow.org/indexnow';
const releaseRoot = path.resolve(process.argv[2] || 'release-current');
const outputPath = path.resolve(process.argv[3] || 'deployment/indexnow-navigation-v103-20260929.json');
const urls = process.argv.slice(4);
assert(urls.length > 0, 'At least one materially changed URL is required');

const keyFile = (await fs.readdir(releaseRoot)).find((name) => /^[a-f0-9]{32}\.txt$/i.test(name));
assert(keyFile, 'IndexNow key file is missing from the staged release');
const key = (await fs.readFile(path.join(releaseRoot, keyFile), 'utf8')).trim();
assert.equal(key.length, 32, 'IndexNow key must be 32 characters');

const keyLocation = `${origin}/${keyFile}`;
const keyResponse = await fetch(keyLocation, {headers: {'cache-control': 'no-cache'}});
assert.equal(keyResponse.status, 200, 'Public IndexNow key file must return 200');
assert.equal((await keyResponse.text()).trim(), key, 'Public IndexNow key file must match the staged key');

const response = await fetch(endpoint, {
  method: 'POST',
  headers: {'content-type': 'application/json'},
  body: JSON.stringify({host: 'www.pinnacleblooms.org', key, keyLocation, urlList: urls})
});
const responseText = await response.text();
assert([200, 202].includes(response.status), `IndexNow returned HTTP ${response.status}: ${responseText}`);

const receipt = {
  submittedAt: new Date().toISOString(),
  rootKeyResponseStatus: keyResponse.status,
  urlList: urls,
  endpoint,
  httpStatus: response.status,
  response: responseText,
  meaning: 'Updated URL notification received; this confirms submission only, not discovery, indexing, ranking, AI citation or conversion.'
};
await fs.writeFile(outputPath, JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({submittedAt: receipt.submittedAt, urls: urls.length, httpStatus: response.status, output: path.relative(process.cwd(), outputPath).replaceAll('\\', '/')}, null, 2));
