// Bounded production acceptance for the released root-cause repairs.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {retiredStaffIds,currentStaffPaths} from '../deployment/legacy-social-metadata/staff-records.mjs';
const source='../../pinnacle-growth-system/faq-sunshine-20261005/';
const sample=JSON.parse(await fs.readFile(source+'staff-reconciliation.json','utf8')).staffSample;
const records=[];const origin='https://www.pinnacleblooms.org';
async function get(path,{method='GET',headers={}}={}){
 const url=new URL(path,origin).href;const r=await fetch(url,{method,headers,redirect:'manual',signal:AbortSignal.timeout(30000)});
 const html=method==='HEAD'?'':await r.text();
 const result={url,status:r.status,location:r.headers.get('location'),bytes:Buffer.byteLength(html),retired:r.headers.get('x-pinnacle-profile-status'),canonical:[...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)].map(x=>x[0].match(/href=["']([^"']+)/i)?.[1]),og:[...html.matchAll(/<meta\b[^>]*property=["']og:url["'][^>]*>/gi)].map(x=>x[0].match(/content=["']([^"']+)/i)?.[1])};
 records.push(result);return {result,html};
}
const queue=sample.filter(x=>retiredStaffIds.has(Number(new URL(x.url).pathname.split('/').pop())));
assert.equal(queue.length,132);
await Promise.all(Array.from({length:3},async()=>{while(queue.length){const item=queue.shift();const {result}=await get(item.url,{method:'HEAD'});assert.equal(result.status,410,item.url);assert.equal(result.retired,'retired-20261005');}}));
for(const path of ['/staff/Gudaparathi-Jayaraj/4944','/staff/Kudikala-Venkata-Sai-Ramakrishna-Prasad/4931','/staff/Mohammad-Haneef/4882']){const {result,html}=await get(path);assert.equal(result.status,410);assert(html.includes('tel:+919100181181'));assert(html.includes('Browse professional profiles'));}
for(const path of [currentStaffPaths['45748'],'/staff/Sonia-honey/1954',currentStaffPaths['72543']]){assert(path);const {result}=await get(path);assert.equal(result.status,200,path);assert.equal(result.retired,null);}
const {result:alias}=await get('/staff/-B-Naveen-Harshavardhan-/72543');assert.equal(alias.status,301);assert.equal(alias.location,origin+currentStaffPaths['72543']);
for(const headers of [{},{'if-none-match':'"old-validator"','if-modified-since':'Mon, 05 Oct 2026 23:00:00 GMT'}]){const {result}=await get('/franchise-autism-therapy-center',{headers});assert.equal(result.status,200);assert.deepEqual(result.canonical,[origin+'/franchise-autism-therapy-center']);assert.deepEqual(result.og,[origin+'/franchise-autism-therapy-center']);}
const {html:sitemap,result:sm}=await get('/sitemaps/core.xml');assert.equal(sm.status,200);const locs=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);assert.equal(locs.length,47);for(const path of ['/faq','/sunshine','/physiotherapy'])assert(locs.includes(origin+path));assert(!locs.includes(origin+'/physio-therapy'));
for(const path of ['/faq','/sunshine','/allmirracles','/verify/','https://pinnacleblooms.org/ask']){const {result}=await get(path);assert.equal(result.status,200,path);}
const report={at:new Date().toISOString(),retiredProfilesConfigured:retiredStaffIds.size,retiredSamplePassed:132,currentProfileMapCount:Object.keys(currentStaffPaths).length,knownRetired404sNowGone:3,protectedSamplePassed:5,coreSitemapUrls:locs.length,checks:records.length,passed:true,records};
await fs.writeFile('deployment/site-health-public-20261005.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,records:undefined}));
