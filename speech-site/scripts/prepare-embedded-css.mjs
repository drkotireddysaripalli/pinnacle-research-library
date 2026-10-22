import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {sha,assertEmbeddedCssDelta,cssPath} from './embedded-css-patch.mjs';
const [folder,priorFolder]=process.argv.slice(2);assert(folder&&priorFolder);
const out=path.resolve(folder),prior=path.resolve(priorFolder),site=path.resolve(import.meta.dirname,'..');
await fs.mkdir(out,{recursive:true});assert(!(await fs.stat(path.join(out,'release.json')).catch(()=>null)),'Preserve existing release checkpoint');
const release=JSON.parse(await fs.readFile(path.join(prior,'release.json'),'utf8'));assert.equal(release.phase,'verified-configuration');
const oldProof=JSON.parse(await fs.readFile(path.join(prior,'acceptance.json'),'utf8'));
const manifest=JSON.parse(await fs.readFile(path.join(prior,'preimage/manifest.json'),'utf8'));
manifest.at=new Date().toISOString();manifest.reusedFrom={folder:prior,commit:release.commit,verifiedAt:release.verifiedAt};
const hashes={},changed={},modules={};
for(const w of manifest.workers){
 const released=release.workers[w.name];hashes[w.name]={};changed[w.name]=[];modules[w.name]={};
 if(released.promoted)w.deployment={...w.deployment,id:released.deployment,created_on:released.promotedAt,versions:[{version_id:released.version,percentage:100}]};
 for(const m of w.modules){const b=await fs.readFile(path.join(prior,'candidate',w.name,m.name));assert.equal(sha(b),oldProof.candidateHashes[w.name][m.name]);m.sha256=sha(b);m.bytes=b.length;modules[w.name][m.name]=b;
 const dir=path.join(out,'preimage',w.name);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,m.name),b,{mode:0o600});}
}
const before=modules['pinnacle-verify-route']['enrolment-assets.mjs'].toString(),after=await fs.readFile(path.join(site,'deployment/enrolment-assets.mjs'),'utf8'),css=await fs.readFile(path.join(site,'public'+cssPath));
const guard=assertEmbeddedCssDelta(before,after,css);modules['pinnacle-verify-route']['enrolment-assets.mjs']=Buffer.from(after);changed['pinnacle-verify-route']=['enrolment-assets.mjs'];
for(const [worker,ms]of Object.entries(modules))for(const [name,b]of Object.entries(ms)){const dir=path.join(out,'candidate',worker);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,name),b,{mode:0o600});hashes[worker][name]=sha(b);}
await fs.writeFile(path.join(out,'preimage/manifest.json'),JSON.stringify(manifest,null,2)+'\n',{mode:0o600});
await fs.writeFile(path.join(out,'candidate-proof.json'),JSON.stringify({at:new Date().toISOString(),guard,changed,hashes},null,2)+'\n',{mode:0o600});
console.log(JSON.stringify({guard,changed}));
