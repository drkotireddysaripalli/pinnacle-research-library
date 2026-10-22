import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
import {sha,patchReceipt,patchAnalytics,patchPublicHandler,patchSharedHandler,patchAsset,addAsset,patchAttribution,patchHelpline} from './qa-provenance-patch.mjs';
import {assertReceiverPublication} from './receiver-publication-guard.mjs';
const [folder]=process.argv.slice(2);assert(folder);const out=path.resolve(folder),site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site);
const manifest=JSON.parse(await fs.readFile(path.join(out,'preimage/manifest.json'),'utf8'));
const baseline='c2a01da6057d0dd1ff37e86ad92a3900d386a4a7';
const read=name=>fs.readFile(path.join(site,name),'utf8');
const old=name=>execFileSync('git',['show',baseline+':speech-site/'+name],{cwd:repo,maxBuffer:16*1024*1024,encoding:'utf8'});
const modules={};for(const w of manifest.workers){modules[w.name]={};for(const m of w.modules){const bytes=await fs.readFile(path.join(out,'preimage',w.name,m.name));assert.equal(sha(bytes),m.sha256);modules[w.name][m.name]=bytes;}}
const update=(worker,name,fn)=>{assert(modules[worker]?.[name]);modules[worker][name]=Buffer.from(fn(modules[worker][name].toString()));};
update('pbn-planetscale','website-enrolment-receipt.mjs',patchReceipt);
update('pbn-planetscale','website-enrolment-analytics.mjs',patchAnalytics);
const collector=await read('public/pinnacle-pages-scripts/speech-measurement.js');
update('pinnacle-verify-route','book-attribution-assets.mjs',s=>patchAttribution(s,collector));
let shared=patchSharedHandler(modules['pinnacle-verify-route']['shared-clearance-runtime.mjs'].toString());
for(const name of ['contact-api.mjs','enrolment-api.mjs','enrolment-source.mjs','speech-measurement.js'])shared=patchAsset(shared,'/pinnacle-pages-scripts/'+name,old('public/pinnacle-pages-scripts/'+name),await read('public/pinnacle-pages-scripts/'+name));
shared=addAsset(shared,'/pinnacle-pages-scripts/enquiry-validation.mjs',await read('public/pinnacle-pages-scripts/enquiry-validation.mjs'));
modules['pinnacle-verify-route']['shared-clearance-runtime.mjs']=Buffer.from(shared);
update('pinnacle-verify-route','enrolment-handler.mjs',patchPublicHandler);
const phone=await fs.readFile(path.join(repo,'helpline-site/phone-analytics.js'),'utf8');update('pinnacle-helpline','worker.mjs',s=>patchHelpline(s,phone));
const guard=await assertReceiverPublication(Object.entries(modules['pbn-planetscale']).map(([name,bytes])=>({name,bytes})),await fs.readFile(path.join(out,'preimage/pbn-planetscale/index.js')));
const changed={};for(const w of manifest.workers){changed[w.name]=[];for(const [name,bytes]of Object.entries(modules[w.name])){
 const dir=path.join(out,'candidate',w.name);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,name),bytes,{mode:0o600});
 if(sha(bytes)!==w.modules.find(m=>m.name===name)?.sha256)changed[w.name].push(name);
}}
const receiver=modules['pbn-planetscale'];await fs.writeFile(path.join(out,'candidate/pbn-planetscale/receipt.json'),JSON.stringify({modules:Object.entries(receiver).map(([name,b])=>({name,bytes:b.length,sha256:sha(b)}))},null,2)+'\n');
const proof={at:new Date().toISOString(),baseline,guard,changed,hashes:Object.fromEntries(Object.entries(modules).map(([worker,ms])=>[worker,Object.fromEntries(Object.entries(ms).map(([n,b])=>[n,sha(b)]))]))};
await fs.writeFile(path.join(out,'candidate-proof.json'),JSON.stringify(proof,null,2)+'\n',{mode:0o600});console.log(JSON.stringify({guard,changed}));
