// Page-scoped assets take precedence over the earlier Autism handoff patch.
import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),dist=path.join(root,'dist');
const file='enroll-autism-speech-aba-therapies-india.html',html=await fs.readFile(path.join(dist,file),'utf8');
assert(html.includes('enrol-start-steps')&&html.includes('data-preview="false"')&&html.includes('value="autism"'));
const keys=new Set(['/pinnacle-pages-html/enrolment.html','/pinnacle-pages-data/speech-sitemap.xml',...['evidence.json','evidence.txt','machine.md'].map(x=>'/pinnacle-pages-data/enrolment-'+x)]);
for(const m of html.matchAll(/\/pinnacle-pages-assets\/[A-Za-z0-9_./-]+/g))keys.add(m[0]);
const main=await fs.readFile(path.join(root,'deployment/pinnacle-route-v12.mjs'),'utf8'),inventory=JSON.parse(main.match(/const SPEECH_INVENTORY=(\{[^\n]+\});/)[1]),records={};let reused=0;
for(const key of keys){const b=await fs.readFile(path.join(dist,key==='/pinnacle-pages-html/enrolment.html'?file:key.slice(1))),hash=crypto.createHash('sha256').update(b).digest('hex').slice(0,16);if(key.startsWith('/pinnacle-pages-assets/')&&inventory[key]===hash){reused++;continue;}records[key]={hash,body:b.toString('base64')};}
await fs.writeFile(path.join(root,'deployment/enrolment-assets.mjs'),'// Generated from the production Astro build.\nconst records='+JSON.stringify(records)+';\nexport const enrolmentHash=key=>records[key]?.hash;\nexport function enrolmentAsset(key,method){const r=records[key];return r?new Response(method==="HEAD"?null:Uint8Array.from(atob(r.body),c=>c.charCodeAt(0)),{status:200}):null;}\n');
console.log(JSON.stringify({enrolmentAssets:Object.keys(records).length,reused}));
