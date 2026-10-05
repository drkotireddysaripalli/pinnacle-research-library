// One post-release notification for the changed knowledge templates, not old story pages.
import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const origin='https://www.pinnacleblooms.org',key='9eccddfeede58a1e7db0a8a2aa8286ab';
const keyLocation=origin+'/'+key+'.txt',output='deployment/knowledge-indexnow-20261005.json';
assert(!(await fs.stat(output).catch(()=>null)),'Existing receipt: reconcile before any repeat submission');
const verification=await fetch(keyLocation);assert.equal(verification.status,200);assert.equal((await verification.text()).trim(),key);
const sources=['/faq/sitemap.xml','/sunshine/sitemap.xml','/allmirracles-sitemap.xml'];
const urls=[];for(const source of sources){const r=await fetch(origin+source);assert.equal(r.status,200);const xml=await r.text();for(const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)){const url=new URL(m[1].replaceAll('&amp;','&'));if(url.origin===origin&&/^\/(?:faq|sunshine)(?:\/|$)|^\/allmirracles$/.test(url.pathname))urls.push(url.href);}}
const unique=[...new Set(urls)];assert(unique.length>4564&&unique.length<=10000);
const response=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({host:'www.pinnacleblooms.org',key,keyLocation,urlList:unique}),signal:AbortSignal.timeout(30000)});
const receipt={at:new Date().toISOString(),keyFileStatus:verification.status,httpStatus:response.status,count:unique.length,urlList:unique,response:await response.text(),meaning:'Notification only. Search engines choose crawling and indexing.'};
await fs.writeFile(output,JSON.stringify(receipt,null,2));assert([200,202].includes(response.status));console.log(JSON.stringify({count:unique.length,status:response.status,receipt:output}));
