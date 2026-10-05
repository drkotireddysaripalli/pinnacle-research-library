// A bounded asset update compiled from the shared Astro sources. Existing live
// asset binding and every unrelated Worker module remain attached unchanged.
import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),dist=path.join(root,'dist');
const html=await fs.readFile(path.join(dist,'abilityscore.html'),'utf8');
assert(html.includes('index, follow, max-image-preview:large')&&!html.includes('Design preview'));
const keys=new Set(['/pinnacle-pages-html/abilityscore.html',...['sources.json','sources.txt','reading.md'].map(x=>'/pinnacle-pages-data/abilityscore-'+x),'/pinnacle-pages-data/pinnacleai-sitemap.xml','/pinnacle-pages-data/pinnacleai-llms.txt']);
for(const m of html.matchAll(/\/pinnacle-pages-assets\/[A-Za-z0-9_.-]+/g))keys.add(m[0]);
const records={};
for(const key of keys){const f=key==='/pinnacle-pages-html/abilityscore.html'?'abilityscore.html':key.slice(1),b=await fs.readFile(path.join(dist,f));records[key]={hash:crypto.createHash('sha256').update(b).digest('hex').slice(0,16),body:b.toString('base64')};}
const code='// Generated from production Astro build by scripts/build-abilityscore-release.mjs.\nconst records='+JSON.stringify(records)+';\nexport const abilityscoreHash=key=>records[key]?.hash;\nexport function abilityscoreAsset(key,method){const r=records[key];return r?new Response(method===\'HEAD\'?null:Uint8Array.from(atob(r.body),c=>c.charCodeAt(0)),{status:200}):null;}\n';
await fs.writeFile(path.join(root,'deployment/abilityscore-assets.mjs'),code);
console.log(JSON.stringify({page:'abilityscore',compiledAssets:keys.size,moduleBytes:Buffer.byteLength(code)}));
