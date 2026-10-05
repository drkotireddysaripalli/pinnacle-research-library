// Notify only changed URLs already verified in this release; never resubmit an old receipt.
import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const output='deployment/site-health-indexnow-20261005.json';
assert(!(await fs.stat(output).catch(()=>null)),'Existing receipt: reconcile instead of resubmitting');
const proof=JSON.parse(await fs.readFile('deployment/site-health-public-20261005.json','utf8'));assert(proof.passed);
const urlList=[...new Set(proof.records.filter(x=>x.retired||x.url.endsWith('/franchise-autism-therapy-center')).map(x=>x.url))];
assert.equal(urlList.length,137);
const host='www.pinnacleblooms.org',key='9eccddfeede58a1e7db0a8a2aa8286ab',keyLocation='https://'+host+'/'+key+'.txt';
const verification=await fetch(keyLocation);assert.equal(verification.status,200);assert.equal((await verification.text()).trim(),key);
const r=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({host,key,keyLocation,urlList}),signal:AbortSignal.timeout(30000)});
const receipt={at:new Date().toISOString(),status:r.status,count:urlList.length,urlList,response:await r.text(),meaning:'Notification accepted, not proof of crawling or indexing.'};
await fs.writeFile(output,JSON.stringify(receipt,null,2));assert([200,202].includes(r.status));console.log(JSON.stringify({count:urlList.length,status:r.status,receipt:output}));
