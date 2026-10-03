import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
const base='https://pinnacleblooms.org';
const results=[];
async function read(url){const r=await fetch(url,{signal:AbortSignal.timeout(20000)});assert.equal(r.status,200,url);const text=await r.text();results.push({url,status:r.status,bytes:Buffer.byteLength(text)});return text;}
const locs=s=>[...s.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&'));
const index=await read(base+'/ask/sitemap.xml');const maps=locs(index),urls=[];const groups=[];
for(const u of maps){const list=locs(await read(u));groups.push({sitemap:u,count:list.length});urls.push(...list);}
assert(urls.length>40000);const duplicates=urls.filter((u,i)=>urls.indexOf(u)!==i);assert(urls.every(u=>u.startsWith(base+'/ask')&&!u.includes('?')));
const home=await read(base+'/ask');function nodes(n,out=[]){if(n.tagName)out.push(n);for(const c of n.childNodes||[])nodes(c,out);return out;}const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;const dom=nodes(parse(home));
const css=dom.filter(n=>n.tagName==='link'&&attr(n,'rel')==='stylesheet').map(n=>new URL(attr(n,'href'),base).href);
const fonts=new Set();for(const u of css){for(const m of (await read(u)).matchAll(/url\(([^)]*sintony[^)]*woff2)\)/g))fonts.add(new URL(m[1].replaceAll('"','').replaceAll("'",''),base).href);}
assert.equal(fonts.size,2);for(const u of fonts){assert(new URL(u).origin===base);const r=await fetch(u);assert.equal(r.status,200);assert((await r.arrayBuffer()).byteLength>1000);results.push({url:u,status:r.status,type:r.headers.get('content-type')});}
for(const p of ['/','/pinnacleai','/verify/','/national-autism-helpline','/enroll-autism-speech-aba-therapies-india','/top-speech-therapy-center-india-proven-improvement-rate','/books'])await read('https://www.pinnacleblooms.org'+p);
const alias=await fetch('https://www.pinnacleblooms.org/ask',{redirect:'manual'});assert.equal(alias.status,308);assert.equal(alias.headers.get('location'),base+'/ask');
const report={at:new Date().toISOString(),groups,sitemapUrls:urls.length,duplicates,protectedPages:7,alias:{status:alias.status,location:alias.headers.get('location')},fonts:[...fonts],results};
await fs.writeFile('deployment/ask-delivery-checks-20261003.json',JSON.stringify(report,null,2));
await fs.writeFile('deployment/ask-canonical-url-manifest-20261003.json',JSON.stringify({at:report.at,urls},null,2));
console.log(JSON.stringify({...report,results:undefined},null,2));
assert.equal(duplicates.length,0,'Sitemap has duplicate canonicals');
