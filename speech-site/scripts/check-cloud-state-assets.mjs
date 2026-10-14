import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const receipt=JSON.parse(await fs.readFile(process.argv[2],'utf8'));
assert.equal(receipt.phase,'verified_complete');
const assets=JSON.parse(await fs.readFile(path.join('ask-private',receipt.id,'manifest.json'),'utf8'));
const blake=createRequire(path.resolve('package.json'))('blake3-wasm');
for(const [name,record] of Object.entries(assets)){
 const b=await fs.readFile(path.join(receipt.fullUnion,name));
 assert.equal(b.length,record.size,'Asset size mismatch');
 assert.equal(blake.hash(b.toString('base64')+path.extname(name).slice(1)).toString('hex').slice(0,32),record.hash,'Asset fingerprint mismatch');
}
console.log(JSON.stringify({verifiedAssetCount:Object.keys(assets).length}));
