// Compose only approved origin changes onto the previously verified production modules.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
import {sha,patchAcquisition,patchAnalytics,patchShared,patchAsset,addAsset,patchAttribution,patchHelpline} from './referrer-origin-patch.mjs';
import {assertReceiverPublication} from './receiver-publication-guard.mjs';
const [folder,priorFolder]=process.argv.slice(2);assert(folder&&priorFolder);const out=path.resolve(folder),prior=path.resolve(priorFolder),site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site);
const baseline='a9475fe569a22d00abaca95cc93282cf212ab49f';
const read=name=>fs.readFile(path.join(site,name),'utf8');
const old=name=>execFileSync('git',['show',baseline+':'+name],{cwd:repo,maxBuffer:16*1024*1024,encoding:'utf8'});
await fs.mkdir(out,{recursive:true});
assert(!(await fs.stat(path.join(out,'release.json')).catch(()=>null)),'Preserve existing release checkpoint');
const receipt=JSON.parse(await fs.readFile(path.join(prior,'release.json'),'utf8'));assert.equal(receipt.phase,'verified-configuration');assert.equal(receipt.commit,baseline);
const proof=JSON.parse(await fs.readFile(path.join(prior,'candidate-proof.json'),'utf8'));
const priorAcceptance=JSON.parse(await fs.readFile(path.join(prior,'ACCEPTANCE.json'),'utf8'));assert.equal(priorAcceptance.commit,baseline);assert.equal(priorAcceptance.status,'DEPLOYED_AND_VERIFIED');
const manifest=JSON.parse(await fs.readFile(path.join(prior,'preimage/manifest.json'),'utf8'));manifest.at=new Date().toISOString();manifest.reusedFrom={folder:prior,verifiedAt:receipt.verifiedAt,commit:baseline};
const modules={};
for(const w of manifest.workers){
 const released=receipt.workers[w.name];modules[w.name]={};
 if(released.promoted)w.deployment={...w.deployment,id:released.deployment,created_on:released.promotedAt,versions:[{version_id:released.version,percentage:100}]};
 for(const m of w.modules){const bytes=await fs.readFile(path.join(prior,'candidate',w.name,m.name));assert.equal(sha(bytes),proof.hashes[w.name][m.name]);m.sha256=sha(bytes);m.bytes=bytes.length;modules[w.name][m.name]=bytes;
  const dir=path.join(out,'preimage',w.name);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,m.name),bytes,{mode:0o600});}
}
await fs.writeFile(path.join(out,'preimage/manifest.json'),JSON.stringify(manifest,null,2)+'\n',{mode:0o600});
const update=(worker,name,fn)=>{assert(modules[worker]?.[name]);modules[worker][name]=Buffer.from(fn(modules[worker][name].toString()));};
update('pbn-planetscale','website-enrolment-receipt.mjs',s=>patchAcquisition(s));
update('pbn-planetscale','website-enrolment-analytics.mjs',patchAnalytics);
const collector=await read('public/pinnacle-pages-scripts/speech-measurement.js');
update('pinnacle-verify-route','book-attribution-assets.mjs',s=>patchAttribution(s,old('speech-site/public/pinnacle-pages-scripts/speech-measurement.js'),collector));
let shared=patchShared(modules['pinnacle-verify-route']['shared-clearance-runtime.mjs'].toString());
for(const name of ['enrolment-source.mjs','speech-measurement.js'])shared=patchAsset(shared,'/pinnacle-pages-scripts/'+name,old('speech-site/public/pinnacle-pages-scripts/'+name),await read('public/pinnacle-pages-scripts/'+name));
shared=addAsset(shared,'/pinnacle-pages-scripts/enquiry-referrer.mjs',await read('public/pinnacle-pages-scripts/enquiry-referrer.mjs'));
modules['pinnacle-verify-route']['shared-clearance-runtime.mjs']=Buffer.from(shared);
update('pinnacle-verify-route','enrolment-handler.mjs',s=>patchAcquisition(s,'value',{helpline:true}));
const phone=await fs.readFile(path.join(repo,'helpline-site/phone-analytics.js'),'utf8');
update('pinnacle-helpline','worker.mjs',s=>patchHelpline(s,old('helpline-site/phone-analytics.js'),phone));
const guard=await assertReceiverPublication(Object.entries(modules['pbn-planetscale']).map(([name,bytes])=>({name,bytes})),await fs.readFile(path.join(out,'preimage/pbn-planetscale/index.js')));
const changed={};for(const w of manifest.workers){changed[w.name]=[];for(const [name,bytes]of Object.entries(modules[w.name])){
 const dir=path.join(out,'candidate',w.name);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,name),bytes,{mode:0o600});
 if(sha(bytes)!==w.modules.find(m=>m.name===name)?.sha256)changed[w.name].push(name);
}}
await fs.writeFile(path.join(out,'candidate/pbn-planetscale/receipt.json'),JSON.stringify({modules:Object.entries(modules['pbn-planetscale']).map(([name,b])=>({name,bytes:b.length,sha256:sha(b)}))},null,2)+'\n');
const candidateProof={at:new Date().toISOString(),baseline,guard,changed,hashes:Object.fromEntries(Object.entries(modules).map(([worker,ms])=>[worker,Object.fromEntries(Object.entries(ms).map(([n,b])=>[n,sha(b)]))]))};
await fs.writeFile(path.join(out,'candidate-proof.json'),JSON.stringify(candidateProof,null,2)+'\n',{mode:0o600});console.log(JSON.stringify({guard,changed}));
