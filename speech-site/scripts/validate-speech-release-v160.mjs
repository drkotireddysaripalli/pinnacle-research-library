import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const c=JSON.parse(await fs.readFile('deployment/speech-v160-staged-20261001.json','utf8'));
const origin='https://www.pinnacleblooms.org',sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const owned=t=>t.replace('<script async src="https://www.googletagmanager.com/gtag/js?id=AW-10810823199"></script>','').replace('<script src="https://www.pinnacleblooms.org/pinnacle-pages-scripts/google-ads-call.js"></script>','');
async function get(path,options={}){const r=await fetch(new URL(path,origin),{redirect:'manual',signal:AbortSignal.timeout(45000),...options}),bytes=Buffer.from(await r.arrayBuffer());return{r,bytes,text:bytes.toString('utf8')};}
async function limited(list,fn){let i=0;const out=[];await Promise.all(Array.from({length:4},async()=>{while(i<list.length){const j=i++;out[j]=await fn(list[j]);}}));return out;}
const rows=(await fs.readdir(c.stage+'/pinnacle-pages-html')).filter(x=>x.endsWith('.html')&&!x.includes('preview'));
const receipt={at:new Date().toISOString(),stage:c.stage};
receipt.pages=await limited(rows,async file=>{
 const html=await fs.readFile(c.stage+'/pinnacle-pages-html/'+file,'utf8'),path=new URL(html.match(/rel="canonical" href="([^"]+)"/)[1]).pathname;
 const live=await get(path);assert.equal(live.r.status,200,path);assert.equal(sha(owned(live.text)),sha(html),path+' public owned HTML');
 return{path,matched:true};
});
const cookie='unknown=fixture; _gcl_au=fixture';
receipt.delivery=await limited(Object.keys(c.pages),async id=>{
 const html=await fs.readFile(c.stage+'/pinnacle-pages-html/'+id+'.html','utf8'),path=new URL(html.match(/rel="canonical" href="([^"]+)"/)[1]).pathname;
 for(const headers of [{cookie},{cookie,authorization:'Bearer fixture',range:'bytes=0-1','cache-control':'no-transform'}]){
 const o=await get(path,{headers});assert.equal(o.r.status,200);assert.equal(sha(owned(o.text)),sha(html));}
 const head=await get(path,{method:'HEAD'});assert.equal(head.r.status,200);assert.equal(head.bytes.length,0);
 const mdIds=['abilityscore','seven-readiness-indexes','fusion-module'];
 if(mdIds.includes(id)){const md=await get(path,{headers:{accept:'text/markdown'}});assert.equal(sha(md.bytes),sha(await fs.readFile(c.stage+'/pinnacle-pages-data/'+id+'-reading.md')));}
 const og=new URL(html.match(/property="og:image" content="([^"]+)"/)[1]);const bytes=await get(og.href);assert.equal(bytes.r.status,200);assert.equal(sha(bytes.bytes),sha(await fs.readFile(c.stage+og.pathname)));assert(bytes.r.headers.get('content-type').includes('image/jpeg'));
 return{path,cookieAndCredentialVariants:true,head:true,ogBytes:true,markdown:mdIds.includes(id)?true:'Explicit text/JSON exports used'};
});
receipt.files=await limited([...c.added,...c.changed.filter(x=>!x.startsWith('pinnacle-pages-html/'))],async file=>{const o=await get('/'+file);assert.equal(o.r.status,200,file);assert.equal(sha(o.bytes),sha(await fs.readFile(c.stage+'/'+file)),file);return{file,sha256:sha(o.bytes)};});
const canonical='/top-speech-therapy-center-india-proven-improvement-rate';
receipt.aliases=await limited(['/speech-therapy','/speech-therapy/',canonical+'/'],async path=>{const o=await get(path+'?utm_source=release-check');assert.equal(o.r.status,301);assert.equal(o.r.headers.get('location'),origin+canonical+'?utm_source=release-check');return{path,status:301};});
const before=JSON.parse(await fs.readFile('deployment/voice-delivery-protected-before-v137-20261001.json','utf8'));
const external=JSON.parse(await fs.readFile('deployment/protected-external-source-v152-20261001.json','utf8'));
receipt.protected=await limited(before.rows.filter(r=>!r.path.startsWith('https://books.')),async row=>{
 const o=await get(row.path);assert.equal(o.r.status,row.status,row.path);assert.equal(o.r.headers.get('location'),row.location,row.path);
 const reviewed=external.rows.find(x=>x.path===row.path),actual=row.path==='/epass'?sha(o.text.replace(/<meta http-equiv="last-modified" content="[^"]+"\s*\/>/,'')):sha(o.bytes);
 assert.equal(actual,reviewed?.currentSha256||(row.path==='/epass'?row.normalisedSha256:row.sha256),row.path+' protected');return{path:row.path,status:row.status,unchanged:true};
});
const books=await get('https://books.pinnacleblooms.org/payment-and-billing');assert.equal(books.r.status,301);assert.equal(books.r.headers.get('location'),origin+'/payment-and-billing');
for(const path of ['/Leadership/Maheshwari','/leadership/Prudhvi%2dMatsa','/Images/LeadershipImages/shoban_big_image.png'])assert.equal((await get(path)).r.status,410);
receipt.booksBillingRetained=true;receipt.retiredProfilesRetained=true;receipt.noEnquirySubmitted=true;
await fs.writeFile('deployment/speech-v160-live-20261001.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({passed:true,pages:receipt.pages.length,files:receipt.files.length,protected:receipt.protected.length}));
