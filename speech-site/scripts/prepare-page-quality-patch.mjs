// Preserve the accepted union and overlay one reviewed page plus its reading files and new immutable assets.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const [prior,priorUpload,next,nextUpload,id,canonical]=process.argv.slice(2);
assert([prior,priorUpload,next,nextUpload,id,canonical].every(Boolean),'Explicit release boundaries required');
for(const dir of [prior,priorUpload,next,nextUpload]){const rel=path.relative(process.cwd(),path.resolve(dir));assert(rel&&!rel.startsWith('..')&&!path.isAbsolute(rel),'Workspace-only stage');}
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
await fs.mkdir(next);await fs.cp(prior,next,{recursive:true});
await fs.mkdir(nextUpload);await fs.cp(priorUpload,nextUpload,{recursive:true});
const changed=new Set(),added=[];
const priorHtml=await fs.readFile(`${prior}/pinnacle-pages-html/${id}.html`,'utf8');
const html=await fs.readFile('dist'+canonical+'.html','utf8');
for(const tag of ['header','footer'])assert.equal(html.match(new RegExp('<'+tag+'\\b[\\s\\S]*?</'+tag+'>'))[0],priorHtml.match(new RegExp('<'+tag+'\\b[\\s\\S]*?</'+tag+'>'))[0],tag+' common source retained');
assert(html.includes('https://www.pinnacleblooms.org'+canonical));
await fs.writeFile(`${next}/pinnacle-pages-html/${id}.html`,html);changed.add(`pinnacle-pages-html/${id}.html`);
for(const suffix of ['evidence.json','evidence.txt','machine.md']){const file=`pinnacle-pages-data/${id}-${suffix}`;await fs.copyFile('dist/'+file,next+'/'+file);changed.add(file);}
async function files(dir,prefix=''){const list=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=prefix+entry.name;if(entry.isDirectory())list.push(...await files(path.join(dir,entry.name),file+'/'));else list.push(file);}return list.sort();}
for(const file of await files('dist/pinnacle-pages-assets')){const dest=`${next}/pinnacle-pages-assets/${file}`;if(await fs.access(dest).then(()=>true).catch(()=>false))continue;await fs.copyFile('dist/pinnacle-pages-assets/'+file,dest);added.push('pinnacle-pages-assets/'+file);}
const workerFile=nextUpload+'/pinnacle-route-v12.mjs';let worker=await fs.readFile(workerFile,'utf8');
const match=worker.match(/const SPEECH_INVENTORY ?= ?(\{[^\n]+\});/);assert(match,'Complete existing asset inventory');
const inventory=JSON.parse(match[1]);for(const file of [...changed,...added])inventory['/'+file]=sha(await fs.readFile(next+'/'+file)).slice(0,16);
worker=worker.replace(match[0],'const SPEECH_INVENTORY='+JSON.stringify(inventory)+';');await fs.writeFile(workerFile,worker);
const config=JSON.parse(await fs.readFile(nextUpload+'/wrangler.jsonc','utf8'));config.assets.directory=path.relative(path.resolve(nextUpload),path.resolve(next)).replaceAll('\\','/');await fs.writeFile(nextUpload+'/wrangler.jsonc',JSON.stringify(config,null,2)+'\n');
let unchanged=0;for(const file of await files(prior)){if(changed.has(file))continue;assert.equal(sha(await fs.readFile(prior+'/'+file)),sha(await fs.readFile(next+'/'+file)),file+' retained');unchanged++;}
for(const file of ['speech-handler.mjs','discovery-handler.mjs','speech-enquiry-handler.mjs','centre-facilities.mjs','enrolment-handler.mjs'])assert.equal(sha(await fs.readFile(priorUpload+'/'+file)),sha(await fs.readFile(nextUpload+'/'+file)),file+' runtime retained');
const receipt={at:new Date().toISOString(),prior,priorUpload,stage:next,upload:nextUpload,id,canonical,changed:[...changed],addedAssets:added,unchangedUnionFiles:unchanged,runtimeRoutingUnchanged:true,commonShellsUnchanged:true};
await fs.writeFile(`deployment/page-quality-${id}-v152-staged-20261001.json`,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({changed:changed.size,newAssets:added.length,unchanged,stage:next}));
