import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const origin='https://www.pinnacleblooms.org';
const contract=JSON.parse(await fs.readFile('deployment/shared-shell-v157-staged-20261001.json','utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const ads=['<script async src="https://www.googletagmanager.com/gtag/js?id=AW-10810823199"></script>','<script src="https://www.pinnacleblooms.org/pinnacle-pages-scripts/google-ads-call.js"></script>'];
const owned=t=>ads.reduce((value,tag)=>value.replace(tag,''),t);
const part=(t,tag)=>t.match(new RegExp('<'+tag+'\\b[\\s\\S]*?</'+tag+'>'))[0];
async function limited(list,fn){let i=0;const out=[];await Promise.all(Array.from({length:4},async()=>{while(i<list.length){const j=i++;out[j]=await fn(list[j]);}}));return out;}
async function get(path,options={}){const r=await fetch(new URL(path,origin),{redirect:'manual',signal:AbortSignal.timeout(45000),...options}),bytes=Buffer.from(await r.arrayBuffer());return{r,bytes,text:bytes.toString('utf8')};}
const receipt={at:new Date().toISOString(),stage:contract.stage,prior:contract.prior};
receipt.pages=await limited(contract.rows,async row=>{
  const local=await fs.readFile(contract.stage+'/'+row.file,'utf8'),live=await get(row.canonical);
  assert.equal(live.r.status,200,row.canonical);assert.equal(sha(owned(live.text)),sha(local),row.canonical+' deployed owned HTML');
  assert.equal(sha(part(live.text,'main')),row.mainSha256,row.canonical+' accepted main retained');
  assert.equal(sha(part(live.text,'header').replaceAll(' aria-current="page"','')),contract.commonHeaderSha256);
  assert.equal(sha(part(live.text,'footer')),contract.commonFooterSha256);
  return {path:row.canonical,status:200,stagedHtmlMatched:true,mainRetained:true,commonShell:true};
});
receipt.assets=await limited(contract.added,async file=>{const o=await get('/'+file);assert.equal(o.r.status,200);assert.equal(sha(o.bytes),sha(await fs.readFile(contract.stage+'/'+file)));return{path:'/'+file,sha256:sha(o.bytes)};});
const cookie='unknown=fixture; _gcl_au=fixture';
receipt.delivery=await limited(contract.rows.filter(r=>['/top-speech-therapy-center-india-proven-improvement-rate','/best-occupational-therapy-center-india-proven-improvement-rate','/enroll-autism-speech-aba-therapies-india','/policies','/pinnacleai'].includes(r.canonical)),async row=>{
  const local=await fs.readFile(contract.stage+'/'+row.file,'utf8');
  for(const headers of [{cookie},{authorization:'Bearer fixture',range:'bytes=0-1','cache-control':'no-transform'}]){const o=await get(row.canonical,{headers});assert.equal(o.r.status,200);assert.equal(sha(owned(o.text)),sha(local));}
  return{path:row.canonical,cookieAndCredentialDelivery:true};
});
const before=JSON.parse(await fs.readFile('deployment/voice-delivery-protected-before-v137-20261001.json','utf8'));
const external=JSON.parse(await fs.readFile('deployment/protected-external-source-v152-20261001.json','utf8'));
receipt.protected=await limited(before.rows.filter(r=>!r.path.startsWith('https://books.')),async row=>{
  const o=await get(row.path);assert.equal(o.r.status,row.status,row.path);assert.equal(o.r.headers.get('location'),row.location,row.path);
  const reviewed=external.rows.find(x=>x.path===row.path),actual=row.path==='/epass'?sha(o.text.replace(/<meta http-equiv="last-modified" content="[^"]+"\s*\/>/,'')):sha(o.bytes);
  assert.equal(actual,reviewed?.currentSha256||(row.path==='/epass'?row.normalisedSha256:row.sha256),row.path+' protected representation');
  return{path:row.path,status:row.status,unchanged:true};
});
for(const path of ['/Leadership/Maheshwari','/leadership/Prudhvi%2dMatsa','/Images/LeadershipImages/shoban_big_image.png'])assert.equal((await get(path)).r.status,410);
const books=await get('https://books.pinnacleblooms.org/payment-and-billing');assert.equal(books.r.status,301);assert.equal(books.r.headers.get('location'),origin+'/payment-and-billing');
receipt.booksBillingRetained=true;receipt.retiredProfilesRetained=true;receipt.noEnquirySubmitted=true;receipt.noIndexingRepeat=true;
await fs.writeFile('deployment/shared-shell-v157-live-release-20261001.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({pages:receipt.pages.length,assets:receipt.assets.length,protected:receipt.protected.length,deliveryVariants:receipt.delivery.length,passed:true}));
