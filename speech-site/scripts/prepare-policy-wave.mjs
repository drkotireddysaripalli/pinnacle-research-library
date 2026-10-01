// Overlay current policies and the common footer on the accepted complete asset union.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import policies from '../src/data/policy-presentation.ts';
const prior='release-delhi-status-v152-20261001',priorUpload='.worker-upload-delhi-status-v152-20261001';
const stage='release-policies-v153-20261001',upload='.worker-upload-policies-v153-20261001';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const part=(html,tag)=>html.match(new RegExp('<'+tag+'\\b[\\s\\S]*?</'+tag+'>'))[0];
const changed=new Set(),added=[];
async function files(dir,prefix=''){const out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const file=prefix+e.name;if(e.isDirectory())out.push(...await files(path.join(dir,e.name),file+'/'));else out.push(file);}return out.sort();}
const built=new Map();for(const file of await files('dist'))if(file.endsWith('.html')){const html=await fs.readFile('dist/'+file,'utf8'),m=html.match(/rel="canonical" href="([^"]+)"/);if(m&&html.includes('index, follow, max-image-preview:large'))built.set(new URL(m[1]).pathname,html);}
const priorReceipt=await fs.readFile('deployment/policy-wave-v153-staged-20261001.json','utf8').then(JSON.parse).catch(e=>{if(e.code==='ENOENT')return null;throw e;});
for(const dir of [stage,upload]){const exists=await fs.access(dir).then(()=>true).catch(()=>false);if(exists)assert(priorReceipt?.stage===stage&&priorReceipt?.upload===upload&&priorReceipt?.prior===prior,'Only this recorded generated stage may be refreshed');else await fs.mkdir(dir);}
await fs.cp(prior,stage,{recursive:true});await fs.cp(priorUpload,upload,{recursive:true});
const policyIds=new Set(policies.map(p=>p.slug));let retainedBodies=0,footer;
const existing=(await fs.readdir(prior+'/pinnacle-pages-html')).filter(f=>f.endsWith('.html')&&!f.includes('preview'));
assert.equal(existing.length,48);
for(const file of existing){const previous=await fs.readFile(prior+'/pinnacle-pages-html/'+file,'utf8'),canonical=new URL(previous.match(/rel="canonical" href="([^"]+)"/)[1]).pathname,html=built.get(canonical),id=file.slice(0,-5);assert(html,'Built canonical '+canonical);assert.equal(part(html,'header'),part(previous,'header'),id+' header retained');if(!policyIds.has(id)){assert.equal(part(html,'main'),part(previous,'main'),id+' non-policy body retained');retainedBodies++;}footer??=part(html,'footer');assert.equal(part(html,'footer'),footer,'One common footer');await fs.writeFile(stage+'/pinnacle-pages-html/'+file,html);changed.add('pinnacle-pages-html/'+file);}
assert.equal(retainedBodies,34);
for(const id of ['policies','payment-and-billing']){const html=built.get('/'+id);assert(html&&part(html,'footer')===footer);const file='pinnacle-pages-html/'+id+'.html';await fs.writeFile(stage+'/'+file,html);changed.add(file);added.push(file);}
for(const id of [...policyIds,'policies'])for(const suffix of ['policy-source.json','policy.md']){const file='pinnacle-pages-data/'+id+'-'+suffix;if(!await fs.access(prior+'/'+file).then(()=>true).catch(()=>false))added.push(file);await fs.copyFile('dist/'+file,stage+'/'+file);changed.add(file);}
for(const file of ['pinnacle-pages-data/public-documents-sitemap.xml','pinnacle-pages-scripts/speech-measurement.js']){await fs.copyFile('dist/'+file,stage+'/'+file);changed.add(file);}
for(const file of await files('dist/pinnacle-pages-assets')){const key='pinnacle-pages-assets/'+file;if(await fs.access(prior+'/'+key).then(()=>true).catch(()=>false))continue;await fs.copyFile('dist/'+key,stage+'/'+key);added.push(key);}
let retainedUnion=0;for(const file of await files(prior)){if(changed.has(file))continue;assert.equal(sha(await fs.readFile(prior+'/'+file)),sha(await fs.readFile(stage+'/'+file)),file+' retained');retainedUnion++;}
const workerFile=upload+'/pinnacle-route-v12.mjs';let worker=await fs.readFile(workerFile,'utf8');const match=worker.match(/const SPEECH_INVENTORY ?= ?(\{[^\n]+\});/);assert(match);const inventory=JSON.parse(match[1]);for(const file of [...changed,...added])inventory['/'+file]=sha(await fs.readFile(stage+'/'+file)).slice(0,16);worker=worker.replace(match[0],'const SPEECH_INVENTORY='+JSON.stringify(inventory)+';');await fs.writeFile(workerFile,worker);
for(const file of ['speech-handler.mjs','discovery-handler.mjs'])await fs.copyFile('deployment/'+file,upload+'/'+file);
for(const file of ['speech-enquiry-handler.mjs','centre-facilities.mjs','enrolment-handler.mjs'])assert.equal(sha(await fs.readFile(priorUpload+'/'+file)),sha(await fs.readFile(upload+'/'+file)),file+' retained');
const config=JSON.parse(await fs.readFile(upload+'/wrangler.jsonc','utf8'));config.assets.directory=path.relative(path.resolve(upload),path.resolve(stage)).replaceAll('\\','/');await fs.writeFile(upload+'/wrangler.jsonc',JSON.stringify(config,null,2)+'\n');
const receipt={at:new Date().toISOString(),prior,priorUpload,stage,upload,pages:50,policies:15,retainedBodies,retainedUnion,changed:[...changed],added,commonHeaderRetained:true,commonFooterUpdatedOnce:true,verifyUnionRetained:true,runtimeChanges:['speech-handler.mjs','discovery-handler.mjs'],plannedNewRoutes:['www.pinnacleblooms.org/policies*','www.pinnacleblooms.org/payment-and-billing*','books.pinnacleblooms.org/payment-and-billing*']};
await fs.writeFile('deployment/policy-wave-v153-staged-20261001.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({pages:50,policies:15,retainedBodies,retainedUnion,changed:changed.size,added:added.length,stage}));
