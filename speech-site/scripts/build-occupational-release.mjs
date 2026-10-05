// Page-scoped release compiled from the shared Astro source. All other modules
// and the active static-assets binding are retained by release-occupational.mjs.
import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),dist=path.join(root,'dist');
const file='best-occupational-therapy-center-india-proven-improvement-rate.html';
const html=await fs.readFile(path.join(dist,file),'utf8');
assert(html.includes('index, follow, max-image-preview:large')&&html.includes('ot-observation')&&!html.includes('Design preview'));
const keys=new Set(['/pinnacle-pages-html/occupational-therapy.html',...['evidence.json','evidence.txt','machine.md'].map(x=>'/pinnacle-pages-data/occupational-therapy-'+x),'/pinnacle-pages-data/speech-sitemap.xml']);
for(const m of html.matchAll(/\/pinnacle-pages-assets\/[A-Za-z0-9_./-]+/g))keys.add(m[0]);
const records={};
const main=await fs.readFile(path.join(root,'deployment/pinnacle-route-v12.mjs'),'utf8');
const inventory=JSON.parse(main.match(/const SPEECH_INVENTORY=(\{[^\n]+\});/)[1]);
let reused=0;
for(const key of keys){const f=key==='/pinnacle-pages-html/occupational-therapy.html'?file:key.slice(1),b=await fs.readFile(path.join(dist,f)),hash=crypto.createHash('sha256').update(b).digest('hex').slice(0,16);
 // Hash-identical assets already present in the preserved binding need no copy.
 if(key.startsWith('/pinnacle-pages-assets/')&&inventory[key]===hash){reused++;continue;}
 records[key]={hash,body:b.toString('base64')};}
const code='// Generated from production Astro build by scripts/build-occupational-release.mjs.\nconst records='+JSON.stringify(records)+';\nexport const occupationalHash=key=>records[key]?.hash;\nexport function occupationalAsset(key,method){const r=records[key];return r?new Response(method===\'HEAD\'?null:Uint8Array.from(atob(r.body),c=>c.charCodeAt(0)),{status:200}):null;}\n';
await fs.writeFile(path.join(root,'deployment/occupational-assets.mjs'),code);
console.log(JSON.stringify({page:'occupational-therapy',compiledAssets:Object.keys(records).length,reusedAssets:reused,moduleBytes:Buffer.byteLength(code)}));
