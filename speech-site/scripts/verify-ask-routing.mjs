// Read-only production regression check. No enquiry submission or database writes.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const output=process.argv[2]||'deployment/ask-route-live-20261003.json';
const paths=['/ask','/ask/','/ask/search?q=speech+delay','/ask/what-is-abilityscore-and-how-does-it-help-my-child','/ask/lens/condition/autism','/ask/te','/ask/sitemap.xml','/ask/m.js','/ask/logo.png'];
const checks=[];
async function get(url,method='GET',headers={}){return fetch(url,{method,redirect:'manual',headers:{'User-Agent':'PinnacleWebsiteQualityAudit/1.0',...headers},signal:AbortSignal.timeout(30000)});}
for(const p of paths){
 const redirected=await get('https://www.pinnacleblooms.org'+p);
 assert.equal(redirected.status,308,'www must redirect: '+p);
 assert.equal(redirected.headers.get('location'),'https://pinnacleblooms.org'+p,'Preserve exact path and query: '+p);
 const final=await get(redirected.headers.get('location'));
 const bytes=Buffer.from(await final.arrayBuffer());
 assert.equal(final.status,200,'Existing Ask resource must load: '+p);
 const title=bytes.toString().match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
 if(final.headers.get('content-type')?.includes('text/html'))assert(title&&!title.includes('Not found'),'Must return actual Ask content');
 checks.push({path:p,redirectStatus:redirected.status,location:redirected.headers.get('location'),status:final.status,type:final.headers.get('content-type'),bytes:bytes.length,title});
}
for(const p of ['/ask','/ask/','/ask/search?q=speech%20delay&source=route-check','/ask/what-is-abilityscore-and-how-does-it-help-my-child']){
 const r=await get('https://www.pinnacleblooms.org'+p,'HEAD');assert.equal(r.status,308);assert.equal(r.headers.get('location'),'https://pinnacleblooms.org'+p);assert.equal(await r.text(),'');checks.push({path:p,method:'HEAD',status:r.status,location:r.headers.get('location')});
}
const cookie=await get('https://www.pinnacleblooms.org/ask','GET',{cookie:'pinnacle_route_check=1'});assert.equal(cookie.status,308);checks.push({variant:'cookie',status:cookie.status});
const controls=JSON.parse(await fs.readFile('deployment/ask-control-before-20261003.json','utf8'));
for(const before of controls){
 const r=await get('https://www.pinnacleblooms.org'+before.path);const body=await r.text();const after={path:before.path,status:r.status,location:r.headers.get('location'),sha256:crypto.createHash('sha256').update(body).digest('hex')};
 assert.equal(after.status,before.status,'Protected status changed: '+before.path);assert.equal(after.location,before.location,'Protected redirect changed: '+before.path);
 // Dynamic legacy error HTML may include per-request values; managed pages are exact.
 if(before.status===200)assert.equal(after.sha256,before.sha256,'Protected page bytes changed: '+before.path);
 checks.push({...after,preserved:true});
}
await fs.writeFile(output,JSON.stringify({at:new Date().toISOString(),passed:checks.length,checks,scope:'Host routing, representative app resources, HEAD/query/cookie variants, four protected page hashes and adjacent legacy 404. Search results and UI require separate functional review.'},null,2)+'\n');
console.log(JSON.stringify({output,passed:checks.length}));
