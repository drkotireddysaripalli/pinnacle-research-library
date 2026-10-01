import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const prior='release-speech-v160-20261001',priorUpload='.worker-upload-speech-v160-20261001';
const next='release-pinnacleai-v161-20261001',nextUpload='.worker-upload-pinnacleai-v161-20261001';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const pages={pinnacleai:'pinnacleai.html'};
await fs.mkdir(next,{recursive:true});await fs.cp(prior,next,{recursive:true});
await fs.mkdir(nextUpload,{recursive:true});await fs.cp(priorUpload,nextUpload,{recursive:true});
const changed=[],added=[];
for(const [id,source]of Object.entries(pages)){
 const html=await fs.readFile('dist/'+source,'utf8'),old=await fs.readFile(prior+'/pinnacle-pages-html/'+id+'.html','utf8');
 for(const tag of ['header','footer'])assert.equal(html.match(new RegExp('<'+tag+'\\b[\\s\\S]*?</'+tag+'>'))[0],old.match(new RegExp('<'+tag+'\\b[\\s\\S]*?</'+tag+'>'))[0],id+' common '+tag);
 const dest='pinnacle-pages-html/'+id+'.html';await fs.writeFile(next+'/'+dest,html);changed.push(dest);
}
const exports=['pinnacleai-sources.json','pinnacleai-sources.txt','pinnacleai-reading.md','pinnacleai-sitemap.xml','pinnacleai-llms.txt'];
for(const name of exports){const dest='pinnacle-pages-data/'+name;await fs.copyFile('dist/'+dest,next+'/'+dest);changed.push(dest);}
async function files(dir,prefix=''){let out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const file=prefix+e.name;if(e.isDirectory())out.push(...await files(path.join(dir,e.name),file+'/'));else out.push(file);}return out.sort();}
for(const file of await files('dist/pinnacle-pages-assets')){
 if(await fs.access(next+'/pinnacle-pages-assets/'+file).then(()=>true).catch(()=>false))continue;
 // Only new files referenced by the changed pages or their newly generated CSS/JS.
 const used=await Promise.all(Object.keys(pages).map(id=>fs.readFile(next+'/pinnacle-pages-html/'+id+'.html','utf8')));
 if(!used.some(html=>html.includes(file)))continue;
 await fs.copyFile('dist/pinnacle-pages-assets/'+file,next+'/pinnacle-pages-assets/'+file);added.push('pinnacle-pages-assets/'+file);
}
const workerFile=nextUpload+'/pinnacle-route-v12.mjs';let worker=await fs.readFile(workerFile,'utf8');
const match=worker.match(/const SPEECH_INVENTORY ?= ?(\{[^\n]+\});/);assert(match);
const inventory=JSON.parse(match[1]);
for(const file of [...changed,...added])inventory['/'+file]=sha(await fs.readFile(next+'/'+file)).slice(0,16);
worker=worker.replace(match[0],'const SPEECH_INVENTORY='+JSON.stringify(inventory)+';');await fs.writeFile(workerFile,worker);
const config=JSON.parse(await fs.readFile(nextUpload+'/wrangler.jsonc','utf8'));config.assets.directory='../'+next;await fs.writeFile(nextUpload+'/wrangler.jsonc',JSON.stringify(config,null,2)+'\n');
let unchanged=0;for(const file of await files(prior)){if(changed.includes(file))continue;assert.equal(sha(await fs.readFile(prior+'/'+file)),sha(await fs.readFile(next+'/'+file)),file);unchanged++;}
for(const file of ['speech-handler.mjs','discovery-handler.mjs','speech-enquiry-handler.mjs','centre-facilities.mjs','enrolment-handler.mjs'])assert.equal(sha(await fs.readFile(priorUpload+'/'+file)),sha(await fs.readFile(nextUpload+'/'+file)),file);
assert.equal(worker.replace(/const SPEECH_INVENTORY ?= ?(\{[^\n]+\});/,'INVENTORY'),(await fs.readFile(priorUpload+'/pinnacle-route-v12.mjs','utf8')).replace(/const SPEECH_INVENTORY ?= ?(\{[^\n]+\});/,'INVENTORY'));
const receipt={at:new Date().toISOString(),prior,priorUpload,stage:next,upload:nextUpload,pages,changed,added,unchangedUnionFiles:unchanged,runtimeRoutingUnchanged:true,commonShellsUnchanged:true};
await fs.writeFile('deployment/pinnacleai-v161-staged-20261001.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({changed:changed.length,added:added.length,unchanged,stage:next}));
