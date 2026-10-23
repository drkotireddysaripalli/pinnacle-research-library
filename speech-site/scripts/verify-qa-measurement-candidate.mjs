import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {sha,assetBody,exportedLiteral,qaGate} from './qa-measurement-patch.mjs';
const out=path.resolve(process.argv[2]),site=path.resolve(import.meta.dirname,'..');
const proof=JSON.parse(await fs.readFile(out+'/candidate-proof.json','utf8'));
const canonical={'speech-measurement.js':'public/pinnacle-pages-scripts/speech-measurement.js','protection-consumer.mjs':'public/pinnacle-pages-scripts/protection-consumer.mjs','google-ads-call-consent.mjs':'src/lib/google-ads-call-consent.mjs','phone-analytics.js':'../helpline-site/phone-analytics.js'};
for(const [name,file]of Object.entries(canonical))assert.equal(sha(await fs.readFile(path.resolve(site,file))),proof.sourceHashes[name],'Candidate must match current canonical source: '+name);
assert.equal(sha(await fs.readFile(site+'/workers/google-ads-call-measurement/index.mjs')),proof.bootstrapSourceHash,'Candidate call bootstrap must match current source');
for(const [w,ms]of Object.entries(proof.hashes))for(const[n,h]of Object.entries(ms))assert.equal(sha(await fs.readFile(out+'/candidate/'+w+'/'+n)),h);
const root=out+'/extracted',portal=out+'/candidate/pinnacle-verify-route/';
for(const name of ['book-attribution-assets.mjs','public-ad-call.mjs'])assert.equal(await fs.readFile(portal+name,'utf8'),await fs.readFile(site+'/deployment/'+name,'utf8'),'Candidate generated module must match current source: '+name);
await fs.mkdir(root+'/speech-site/public/pinnacle-pages-scripts',{recursive:true});await fs.mkdir(root+'/speech-site/src/lib',{recursive:true});await fs.mkdir(root+'/helpline-site',{recursive:true});
const shared=await fs.readFile(portal+'shared-clearance-runtime.mjs','utf8');
for(const name of ['speech-measurement.js','protection-consumer.mjs']){
 const body=assetBody(shared,'/pinnacle-pages-scripts/'+name);assert.equal(sha(body),proof.sourceHashes[name]);await fs.writeFile(root+'/speech-site/public/pinnacle-pages-scripts/'+name,body);
}
const attribution=await import('file://'+portal+'book-attribution-assets.mjs');
for(const key of ['/pinnacle-pages-scripts/speech-measurement.js','/books/resources/measurement-v1.js','/pinnacle-pages-scripts/protection-consumer.mjs']){const name=key.includes('protection')?'protection-consumer.mjs':'speech-measurement.js';assert.equal(sha(attribution.attributionScripts[key].text),proof.sourceHashes[name]);}
const call=await import('file://'+portal+'public-ad-call.mjs'),response=call.servePublicAdCall(new Request('https://www.pinnacleblooms.org'+call.PUBLIC_AD_CALL_PATH));assert.equal(response.status,200);const callBody=await response.text();assert.equal(sha(callBody),proof.sourceHashes['google-ads-call-consent.mjs']);assert(call.PUBLIC_AD_CALL_PATH.includes(sha(callBody).slice(0,16)));await fs.writeFile(root+'/speech-site/src/lib/google-ads-call-consent.mjs',callBody);
const old='/pinnacle-pages-scripts/portal-ad-call-b195ad3cfeaad488.mjs';const redirect=call.servePublicAdCall(new Request('https://www.pinnacleblooms.org'+old+'?utm_source=google'));assert.equal(redirect.status,308);assert.equal(redirect.headers.get('location'),call.PUBLIC_AD_CALL_PATH+'?utm_source=google');
const bootstrap=await import('file://'+out+'/candidate/pinnacle-google-ads-call-measurement/index.mjs');
const bootResponse=await bootstrap.default.fetch(new Request('https://www.pinnacleblooms.org/pinnacle-pages-scripts/google-ads-call.js'),{});assert.equal(bootResponse.status,200);assert.equal(qaGate(await bootResponse.text()),qaGate(callBody));
for(const w of ['pinnacle-verify-route','pinnacle-legacy-social-metadata']){const m=await import('file://'+out+'/candidate/'+w+'/legacy-measurement.runtime.mjs');assert.equal(await m.serveLegacyMeasurementCall(new Request('https://www.pinnacleblooms.org'+call.PUBLIC_AD_CALL_PATH)).text(),callBody);}
const helpline=await fs.readFile(out+'/candidate/pinnacle-helpline/worker.mjs','utf8'),html=exportedLiteral(helpline,'HELPLINE_HTML');
const blocks=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(s=>s.includes("const id = 'G-H9CLX1WJ7R'"));assert.equal(blocks.length,1);
const body=[blocks[0],blocks[0].replace(/^\n/,'').replace(/\n$/,'')].find(s=>sha(s)===proof.sourceHashes['phone-analytics.js']);assert(body);assert.equal(exportedLiteral(helpline,'ANALYTICS_CSP_HASH'),createHash('sha256').update(body).digest('base64'));await fs.writeFile(root+'/helpline-site/phone-analytics.js',body);
const log=execFileSync(process.execPath,['--test','scripts/test-measurement-qa-gates.mjs'],{cwd:site,encoding:'utf8',env:{...process.env,QA_GATE_SOURCE_ROOT:root}});console.log(log.trim());console.log(JSON.stringify({status:'passed',callPath:call.PUBLIC_AD_CALL_PATH,sourceHashes:proof.sourceHashes,networkRequests:0,providerEvents:0}));
