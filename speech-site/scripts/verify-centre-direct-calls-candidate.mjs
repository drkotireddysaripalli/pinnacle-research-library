import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {sha,assetBody} from './qa-measurement-patch.mjs';
const out=path.resolve(process.argv[2]),site=path.resolve(import.meta.dirname,'..'),proof=JSON.parse(await fs.readFile(out+'/candidate-proof.json','utf8'));
assert.equal(sha(await fs.readFile(site+'/public/pinnacle-pages-scripts/speech-measurement.js')),proof.sourceSHA256);
for(const [w,ms]of Object.entries(proof.hashes))for(const[n,h]of Object.entries(ms))assert.equal(sha(await fs.readFile(out+'/candidate/'+w+'/'+n)),h);
const portal=out+'/candidate/pinnacle-verify-route/',shared=await fs.readFile(portal+'shared-clearance-runtime.mjs','utf8'),body=assetBody(shared,'/pinnacle-pages-scripts/speech-measurement.js');assert.equal(sha(body),proof.sourceSHA256);
assert.equal(await fs.readFile(portal+'book-attribution-assets.mjs','utf8'),await fs.readFile(site+'/deployment/book-attribution-assets.mjs','utf8'),'Current generated source matches the candidate');
const extracted=out+'/candidate-collector.js';await fs.writeFile(extracted,body);
const attribution=await import('file://'+portal+'book-attribution-assets.mjs');for(const key of ['/pinnacle-pages-scripts/speech-measurement.js','/books/resources/measurement-v1.js'])assert.equal(sha(attribution.attributionScripts[key].text),proof.sourceSHA256);
console.log(execFileSync(process.execPath,['--test','scripts/test-centre-direct-calls.mjs'],{cwd:site,env:{...process.env,PINNACLE_DIRECT_CALL_SOURCE:extracted},encoding:'utf8'}).trim());
const fixture=JSON.parse(await fs.readFile(out+'/fixture-record.json','utf8')),tester=site+'/scripts/check-centre-direct-calls-browser.mjs';
for(const[name,h]of Object.entries(fixture.hashes))assert.equal(sha(await fs.readFile(fixture.folder+'/'+name)),h);
const previous=JSON.parse(await fs.readFile(out+'/browser-acceptance.json','utf8').catch(()=> 'null'));
if(!(previous?.status==='PASS'&&previous.sourceSHA256===proof.sourceSHA256&&previous.testerSHA256===sha(await fs.readFile(tester))&&previous.records.length===2&&previous.records.reduce((n,r)=>n+r.records.length,0)===55&&previous.records.every(r=>fixture.hashes[r.fixture]===r.fixtureSHA256))){
 console.log(execFileSync(process.execPath,[tester,extracted,fixture.folder,out+'/browser-acceptance.json'],{cwd:site,encoding:'utf8'}).trim());
}else console.log('Reused identical successful offline DOM acceptance.');
console.log(JSON.stringify({status:'passed',sourceSHA256:proof.sourceSHA256,changed:proof.changed}));
