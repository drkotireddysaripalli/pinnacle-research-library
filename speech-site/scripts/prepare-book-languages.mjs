// Add the multilingual book release to the accepted complete production union.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {BOOK_ROUTES} from '../deployment/speech-handler.mjs';
const prior='release-book-languages-20261002',priorUpload='.worker-upload-book-languages-20261002';
const stage='release-book-languages-activation-20261003',upload='.worker-upload-book-languages-activation-20261003';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
async function files(dir){const result=[];async function walk(base){for(const d of await fs.readdir(base,{withFileTypes:true})){const f=path.join(base,d.name);if(d.isDirectory())await walk(f);else result.push(path.relative(dir,f));}}await walk(dir);return result;}
await fs.mkdir(stage,{recursive:true});await fs.cp(prior,stage,{recursive:true});
await fs.mkdir(upload,{recursive:true});await fs.cp(priorUpload,upload,{recursive:true});
const changed=[],added=[];
for(const [route,id] of Object.entries(BOOK_ROUTES)){
 const html=await fs.readFile('dist'+route+'.html','utf8');assert(html.includes('index, follow, max-image-preview:large'),route);assert(!html.includes('private-digital-delivery')&&!html.includes('/publication/'),route+' paid files private');
 const file='pinnacle-pages-html/'+id+'.html';await fs.writeFile(stage+'/'+file,html);changed.push(file);
}
for(const dir of ['pinnacle-pages-assets','pinnacle-pages-fonts','pinnacle-pages-scripts','pinnacle-pages-data'])for(const relative of await files('dist/'+dir)){
 const file=dir+'/'+relative,newData=await fs.readFile('dist/'+file),old=await fs.readFile(prior+'/'+file).catch(()=>null);
 if(old&&sha(old)===sha(newData))continue;
 assert(newData.length<25*1024*1024,file+' exceeds Cloudflare per-asset ceiling');
 await fs.mkdir(path.dirname(stage+'/'+file),{recursive:true});await fs.writeFile(stage+'/'+file,newData);(old?changed:added).push(file);
}
let retained=0;for(const file of await files(prior)){if(changed.includes(file))continue;assert.equal(sha(await fs.readFile(prior+'/'+file)),sha(await fs.readFile(stage+'/'+file)),file+' retained');retained++;}
const workerFile=upload+'/pinnacle-route-v12.mjs';let worker=await fs.readFile(workerFile,'utf8');const m=worker.match(/const SPEECH_INVENTORY ?= ?(\{[^\n]+\});/);assert(m);const inv=JSON.parse(m[1]);for(const file of [...changed,...added])inv['/'+file]=sha(await fs.readFile(stage+'/'+file)).slice(0,16);worker=worker.replace(m[0],'const SPEECH_INVENTORY='+JSON.stringify(inv)+';');await fs.writeFile(workerFile,worker);
await fs.copyFile('deployment/speech-handler.mjs',upload+'/speech-handler.mjs');
const config=JSON.parse(await fs.readFile(upload+'/wrangler.jsonc','utf8'));config.assets.directory='../'+stage;await fs.writeFile(upload+'/wrangler.jsonc',JSON.stringify(config,null,2)+'\n');
const receipt={at:new Date().toISOString(),prior,priorUpload,stage,upload,bookRoutes:Object.keys(BOOK_ROUTES).length,changed,added,retainedFiles:retained};await fs.writeFile('deployment/books-languages-activation-stage-20261003.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({stage,routes:receipt.bookRoutes,changed:changed.length,added:added.length,retained}));
