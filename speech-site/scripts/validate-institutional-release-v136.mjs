import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {PUBLIC_DOCUMENT_ROUTES} from '../deployment/speech-handler.mjs';
const release=process.argv[2],mode=process.argv[3]||'--staged';
assert(release,'Pass the full staged union directory');
const origin='https://www.pinnacleblooms.org',oldRelease='release-policy-life-v135-ready-20261001';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const ads=['<script async src="https://www.googletagmanager.com/gtag/js?id=AW-10810823199"></script>','<script src="https://www.pinnacleblooms.org/pinnacle-pages-scripts/google-ads-call.js"></script>'];
const owned=t=>ads.reduce((a,b)=>a.replace(b,''),t);
const main=t=>t.match(/<main\b[^>]*>[\s\S]*?<\/main>/)[0];
const header=t=>t.match(/<header\b[\s\S]*?<\/header>/)[0].replace(/ aria-current="page"/g,'').replace(/ is-current/g,'');
const footer=t=>t.match(/<footer\b[\s\S]*?<\/footer>/)[0];
const files=(await fs.readdir(release+'/pinnacle-pages-html')).filter(f=>f.endsWith('.html')&&!f.includes('preview'));
assert.equal(files.length,48);
const pages=await Promise.all(files.map(async file=>{const html=await fs.readFile(release+'/pinnacle-pages-html/'+file,'utf8');const canonical=html.match(/rel="canonical" href="([^"]+)"/)[1];return {file,html,path:new URL(canonical).pathname};}));
const controls=['/verify/','/verify/evidence/records/fsc.html','/verify/evidence/fsc.pdf','/national-autism-helpline','/robots.txt','/sitemaps/core.xml','/pinnacle-ai-innovations-revolutionizing-autism-history','/abilityscore-global-study','/therapeuticai-effectiveness-study','/centers/best-autism-speech-aba-occupational-therapy-center-suchitra2-hyderabad-telangana-india','/centers/best-autism-speech-aba-occupational-therapy-center-jntu-hyderabad-telangana-india','/epass','/payonline','https://books.pinnacleblooms.org/payment-and-billing'];
const beforeFile='deployment/institutional-protected-before-v136-20261001.json';
async function get(path,options={}){const r=await fetch(path.startsWith('https:')?path:origin+path,{redirect:'manual',signal:AbortSignal.timeout(45000),...options,headers:{'cache-control':'no-cache',...(options.headers||{})}});const bytes=Buffer.from(await r.arrayBuffer());return {r,bytes,text:bytes.toString('utf8')};}
async function limited(list,fn,n=3){let i=0;const result=[];await Promise.all(Array.from({length:n},async()=>{while(i<list.length){const k=i++;result[k]=await fn(list[k]);}}));return result;}
if(mode==='--before'){
 const rows=await limited(controls,async path=>{const o=await get(path);assert([200,301,302].includes(o.r.status),path);return {path,status:o.r.status,location:o.r.headers.get('location'),sha256:sha(o.bytes),bytes:o.bytes.length};});
 const sitemap=await get('/sitemap.xml');assert.equal(sitemap.r.status,200);
 await fs.writeFile(beforeFile,JSON.stringify({at:new Date().toISOString(),rows,oldSitemapLocs:[...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1])},null,2)+'\n');
 console.log(JSON.stringify({beforeFile,protected:rows.length}));process.exit(0);
}
const accepted=[];
for(const p of pages){
 assert.equal(header(p.html),header(pages[0].html),p.path+' shared header');
 assert.equal(footer(p.html),footer(pages[0].html),p.path+' shared footer');
 assert(p.html.includes('verify-footer'));
 if(!['about','leadership','framework'].includes(PUBLIC_DOCUMENT_ROUTES[p.path])){
  const old=await fs.readFile(oldRelease+'/pinnacle-pages-html/'+p.file,'utf8');
  const oldMain=main(old),allowed=oldMain;
  assert.equal(sha(main(p.html)),sha(allowed),p.path+' accepted body');
  accepted.push({path:p.path,unchanged:oldMain===main(p.html),onlyIdentityLink:oldMain!==main(p.html)});
 }
}
assert.equal(accepted.length,45);
if(mode==='--staged'){await fs.writeFile('deployment/institutional-staged-v136-20261001.json',JSON.stringify({at:new Date().toISOString(),pages:48,commonHeader:true,commonFooter:true,accepted},null,2)+'\n');console.log(JSON.stringify({staged:48,priorBodies:45,identityLinkCorrections:accepted.filter(p=>p.onlyIdentityLink).length}));process.exit(0);}
assert.equal(mode,'--live');
const matchedAssets=new Map(),shells=await limited(pages,async p=>{const o=await get(p.path);assert.equal(o.r.status,200,p.path);assert.equal(sha(owned(o.text)),sha(p.html),p.path+' public HTML');assert.equal(header(o.text),header(p.html));assert.equal(footer(o.text),footer(p.html));return {path:p.path,ownedHtmlMatched:true,knownAdsTags:ads.filter(t=>o.text.includes(t)).length,commonHeader:true,commonFooter:true};});
const newPages=await limited(Object.entries(PUBLIC_DOCUMENT_ROUTES).filter(([path,id])=>['about','leadership','framework'].includes(id)),async([path,id])=>{
 const p=pages.find(p=>p.path===path),policy=false;
 const md=id+(policy?'-policy.md':'-machine.md');
 const doc=await get(path,{headers:{accept:'text/markdown'}});assert.equal(doc.r.status,200);assert(doc.r.headers.get('content-type').startsWith('text/markdown'));assert.equal(sha(doc.bytes),sha(await fs.readFile(release+'/pinnacle-pages-data/'+md)));
 const head=await get(path,{method:'HEAD'});assert.equal(head.r.status,200);assert.equal(head.bytes.length,0);
 const alias=await get(path+'/?review=v136');assert.equal(alias.r.status,301,path+' alias');assert.equal(alias.r.headers.get('location'),origin+path+'?review=v136');
 const cookie=await get(path,{headers:{cookie:'ps_ga=test-public-static'}});assert.equal(sha(owned(cookie.text)),sha(p.html),path+' public cookie');
 const assets=[...p.html.matchAll(/(?:src|href|content)="(\/pinnacle-pages-(?:assets|fonts|scripts|data)\/[^"]+|https:\/\/www.pinnacleblooms.org\/pinnacle-pages-assets\/[^"]+)"/g)].map(m=>new URL(m[1],origin).pathname);
 for(const asset of [...new Set(assets)])if(!matchedAssets.has(asset)){matchedAssets.set(asset,await (async()=>{const o=await get(asset);assert.equal(o.r.status,200,asset);assert.equal(sha(o.bytes),sha(await fs.readFile(release+asset)),asset);return {path:asset,status:200,bytes:o.bytes.length,sha256:sha(o.bytes)};})());}
 return {id,path,markdown:true,head:true,queryPreservingAlias:true,publicAnalyticsCookie:true};
});
const previous=JSON.parse(await fs.readFile(beforeFile,'utf8'));
const protectedRows=await limited(previous.rows,async row=>{const o=await get(row.path);assert.equal(o.r.status,row.status,row.path);assert.equal(o.r.headers.get('location'),row.location,row.path);if(row.path==='/epass'){const baseline=await fs.readFile('audits/navigation-scope-v135-20261001/epass.html','utf8');const normalise=text=>text.replace(/<meta http-equiv="last-modified" content="[^"]+"\s*\/>/,'');assert.equal(sha(normalise(o.text)),sha(normalise(baseline)),'epass saved origin response apart from dynamic timestamp');return {...row,unchangedExceptOriginTimestamp:true,comparisonSource:'audits/navigation-scope-v136-20261001/epass.html',normalisedSha256:sha(normalise(o.text))};}assert.equal(sha(o.bytes),row.sha256,row.path+' protected bytes');return {...row,unchanged:true};});
const sitemap=await get('/sitemap.xml');assert.equal(sitemap.r.status,200);
for(const url of previous.oldSitemapLocs)assert(sitemap.text.includes('<loc>'+url+'</loc>'),url+' retained child');
assert(sitemap.text.includes(origin+'/pinnacle-pages-data/public-documents-sitemap.xml'));
const child=await get('/pinnacle-pages-data/public-documents-sitemap.xml');assert.equal(sha(child.bytes),sha(await fs.readFile(release+'/pinnacle-pages-data/public-documents-sitemap.xml')));
const exports=await limited(['about','leadership','framework'].flatMap(id=>['-evidence.json','-evidence.txt','-machine.md'].map(suffix=>'/pinnacle-pages-data/'+id+suffix)),async path=>{const o=await get(path);assert.equal(o.r.status,200);assert.equal(sha(o.bytes),sha(await fs.readFile(release+path)));return {path,matched:true,sha256:sha(o.bytes)};});
const llms=await get('/llms.txt');assert.equal(llms.r.status,200);assert(llms.text.includes(origin+'/self-sufficient')&&llms.text.includes(origin+'/mainstream'));
const output='deployment/institutional-public-v136-20261001.json';await fs.writeFile(output,JSON.stringify({at:new Date().toISOString(),release,shells,newPages,exports,matchedAssets:[...matchedAssets.values()],accepted,protectedRows,rootSitemapPreservesChildren:true,readingAidUpdated:true,advertisingConsentValidated:false},null,2)+'\n');
console.log(JSON.stringify({output,managed:48,newPages:newPages.length,assets:matchedAssets.size,protectedUnchanged:protectedRows.length}));
