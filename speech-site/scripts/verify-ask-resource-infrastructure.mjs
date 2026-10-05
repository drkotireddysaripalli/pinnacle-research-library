import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const release='ask-resource-shape-20261005';
const before=JSON.parse(await fs.readFile('ask-private/'+release+'/before.json','utf8'));
const candidate=JSON.parse(await fs.readFile('ask-private/'+release+'/candidate.json','utf8'));
for(const binding of before.settings.bindings){
 const after=candidate.resources.bindings.find(b=>b.name===binding.name);assert(after,binding.name);assert.equal(after.type,binding.type);
 // Compare actual configuration without writing credentials into the receipt.
 for(const key of ['text','namespace_id','bucket_name','service','environment'])if(binding[key]!==undefined)assert.equal(after[key],binding[key],binding.name+' changed');
}
const checks=[];
for(const path of ['/pinnacleai','/verify/','/enroll-autism-speech-aba-therapies-india']){
 const r=await fetch('https://www.pinnacleblooms.org'+path);await r.arrayBuffer();assert.equal(r.status,200);checks.push({path,status:r.status});
}
const slug='how-can-i-work-on-eye-contact-engagement-with-my-child-at-home';
const alias=await fetch('https://www.pinnacleblooms.org/ask/'+slug,{redirect:'manual'});assert.equal(alias.status,308);assert.equal(alias.headers.get('location'),'https://pinnacleblooms.org/ask/'+slug);
checks.push({alias:alias.url,status:alias.status,location:alias.headers.get('location')});
const og=await fetch('https://pinnacleblooms.org/ask/'+slug+'.png');const bytes=Buffer.from(await og.arrayBuffer());assert.equal(og.status,200);assert.equal(bytes.subarray(1,4).toString(),'PNG');
checks.push({og:og.url,status:og.status,bytes:bytes.length});
await fs.writeFile('deployment/ask-resource-infrastructure-20261005.json',JSON.stringify({at:new Date().toISOString(),candidateBindingsMatch:true,bindings:before.settings.bindings.length,routeCount:before.routes.length,checks},null,2)+'\n');
console.log(JSON.stringify({bindings:before.settings.bindings.length,checked:checks.length}));
