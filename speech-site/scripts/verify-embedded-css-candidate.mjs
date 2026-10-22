import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
import {sha,cssPath,cssSHA,assertEmbeddedCssDelta} from './embedded-css-patch.mjs';
const out=path.resolve(process.argv[2]),dir=path.join(out,'candidate/pinnacle-verify-route'),site=path.resolve(import.meta.dirname,'..');
const before=await fs.readFile(path.join(out,'preimage/pinnacle-verify-route/enrolment-assets.mjs'),'utf8'),after=await fs.readFile(path.join(dir,'enrolment-assets.mjs'),'utf8');
assertEmbeddedCssDelta(before,after,await fs.readFile(path.join(site,'public'+cssPath)));
const proof=JSON.parse(await fs.readFile(path.join(out,'candidate-proof.json'),'utf8'));for(const [name,h]of Object.entries(proof.hashes['pinnacle-verify-route']))assert.equal(sha(await fs.readFile(path.join(dir,name))),h);
const main=await fs.readFile(path.join(dir,'pinnacle-route-v12.mjs'),'utf8'),inventory=JSON.parse(main.match(/const SPEECH_INVENTORY=(\{[^\n]+\});/)[1]);
let network=0;const oldFetch=globalThis.fetch,blocked=async()=>{network++;throw Error('Unexpected external CSS fixture request');};globalThis.fetch=blocked;
try{
 const {serveSpeech}=await import(pathToFileURL(path.join(dir,'speech-handler.mjs')));const env={ASSETS:{fetch:blocked}},host='https://www.pinnacleblooms.org',etag='"speech-'+cssSHA.slice(0,16)+'"';
 const get=await serveSpeech(new Request(host+cssPath),env,inventory);assert.equal(get.status,200);assert.equal(get.headers.get('content-type'),'text/css; charset=utf-8');assert.equal(get.headers.get('cache-control'),'public, max-age=31536000, immutable');assert.equal(get.headers.get('etag'),etag);assert.equal(sha(Buffer.from(await get.arrayBuffer())),cssSHA);
 const head=await serveSpeech(new Request(host+cssPath,{method:'HEAD'}),env,inventory);assert.equal(head.status,200);assert.equal(await head.text(),'');assert.equal(head.headers.get('etag'),etag);
 const conditional=await serveSpeech(new Request(host+cssPath,{headers:{'if-none-match':etag}}),env,inventory);assert.equal(conditional.status,304);assert.equal(await conditional.text(),'');
 const priv=await serveSpeech(new Request(host+cssPath,{headers:{cookie:'fixture=1'}}),env,inventory);assert.equal(priv.headers.get('cache-control'),'private, no-store');
 for(const req of [new Request('https://other.invalid'+cssPath),new Request(host+'/unowned-css-fixture'),new Request(host+'/pinnacle-pages-assets/UnknownFixture.css'),new Request(host+cssPath,{method:'POST'})])assert.equal(await serveSpeech(req,env,inventory),null);
 assert.equal(network,0);console.log(JSON.stringify({status:'passed',cases:6,cssPath,cssSHA,moduleCount:Object.keys(proof.hashes['pinnacle-verify-route']).length,networkRequests:network,productionWrites:0}));
}finally{globalThis.fetch=oldFetch;}
