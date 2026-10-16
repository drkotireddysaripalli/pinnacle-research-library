import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import{createRequire}from'node:module';import{createHash}from'node:crypto';
const asset='/pinnacle-pages-html/policies.html';
export async function retainedPublisherTemplate(previous,manifest,changedInputs){
 assert.equal(previous.phase,'verified_complete');assert.equal(changedInputs.trim(),'','Common template inputs changed; build the current template');
 const record=manifest[asset];assert(record&&previous.fullUnion,'Verified live policy-shell asset unavailable');
 const file=path.join(previous.fullUnion,asset),bytes=await fs.readFile(file),blake=createRequire(path.resolve('package.json'))('blake3-wasm');
 assert.equal(bytes.length,record.size);assert.equal(blake.hash(bytes.toString('base64')+'html').toString('hex').slice(0,32),record.hash,'Accepted template bytes changed');
 return{path:file,source:previous.source,asset,sha256:createHash('sha256').update(bytes).digest('hex'),verifiedLiveTemplate:true};
}
