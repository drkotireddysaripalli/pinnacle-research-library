// Compile only the PDK release from the shared Astro source; retain the live union.
import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),dist=path.join(root,'dist'),file='personal-development-kernel.html';
const html=await fs.readFile(path.join(dist,file),'utf8');assert(html.includes('index, follow, max-image-preview:large')&&html.includes('pdk-record-pair')&&!html.includes('Design preview'));
const keys=new Set(['/pinnacle-pages-html/personal-development-kernel.html',...['sources.json','sources.txt','reading.md'].map(x=>'/pinnacle-pages-data/personal-development-kernel-'+x),'/pinnacle-pages-data/pinnacleai-sitemap.xml','/pinnacle-pages-data/pinnacleai-llms.txt']);
for(const m of html.matchAll(/\/pinnacle-pages-assets\/[A-Za-z0-9_./-]+/g))keys.add(m[0]);
const inventory=JSON.parse((await fs.readFile(path.join(root,'deployment/pinnacle-route-v12.mjs'),'utf8')).match(/const SPEECH_INVENTORY=(\{[^\n]+\});/)[1]),records={};let reused=0;
for(const key of keys){const f=key==='/pinnacle-pages-html/personal-development-kernel.html'?file:key.slice(1),b=await fs.readFile(path.join(dist,f)),hash=crypto.createHash('sha256').update(b).digest('hex').slice(0,16);if(key.startsWith('/pinnacle-pages-assets/')&&inventory[key]===hash){reused++;continue;}records[key]={hash,body:b.toString('base64')};}
await fs.writeFile(path.join(root,'deployment/pdk-assets.mjs'),'// Generated from production Astro build by scripts/build-pdk-release.mjs.\nconst records='+JSON.stringify(records)+';\nexport const pdkHash=key=>records[key]?.hash;\nexport function pdkAsset(key,method){const r=records[key];return r?new Response(method===\'HEAD\'?null:Uint8Array.from(atob(r.body),c=>c.charCodeAt(0)),{status:200}):null;}\n');
console.log(JSON.stringify({page:'personal-development-kernel',compiledAssets:Object.keys(records).length,reusedAssets:reused}));
