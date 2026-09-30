import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const origin='https://www.pinnacleblooms.org';
const canonical='/best-aba-therapy-center-india-proven-improvement-rate';
const stage=path.resolve('release-aba-v126-publish-20260930');
const managed=[
  '/top-speech-therapy-center-india-proven-improvement-rate',
  '/enroll-autism-speech-aba-therapies-india',
  '/best-occupational-therapy-center-india-proven-improvement-rate',
  canonical,
  '/best-special-education-center-call-9100181181',
  '/autism-therapy','/centers',
  '/speech-therapy/service-information',
  '/speech-therapy/first-visit-guide',
  '/speech-therapy/teacher-observation-guide'
];
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const fetchResource=async (resource,options={})=>{const response=await fetch(origin+resource,{headers:{'cache-control':'no-cache',...options.headers},redirect:options.redirect||'follow'});const bytes=Buffer.from(await response.arrayBuffer());return {response,bytes,body:bytes.toString('utf8')};};
const pages=await Promise.all(managed.map(async resource=>{
  const {response,body}=await fetchResource(resource);
  const header=body.match(/<header class="portal-header">[\s\S]*?<\/header>/)?.[0];
  const footer=body.match(/<footer class="portal-site-footer">[\s\S]*?<\/footer>/)?.[0];
  return {path:resource,status:response.status,headerHash:header?hash(header.replaceAll(' aria-current="page"','')):null,footerHash:footer?hash(footer):null,body};
}));
const aba=pages.find(page=>page.path===canonical);
assert(pages.every(page=>page.status===200&&page.headerHash&&page.footerHash),'All managed pages must serve the common shell');
assert.equal(new Set(pages.map(page=>page.headerHash)).size,1,'Common header differs across managed pages');
assert.equal(new Set(pages.map(page=>page.footerHash)).size,1,'Common Verify footer differs across managed pages');
assert.equal(aba.body.match(/<link rel="canonical" href="([^"]+)"/)?.[1],origin+canonical);
assert(aba.body.includes('index, follow, max-image-preview:large'));
assert(aba.body.includes('Understand what is happening.')&&aba.body.includes('directory-service-notice'));
assert(aba.body.includes('tel:+919100181181')&&aba.body.includes('aba-therapy-evidence.json'));
assert.equal((aba.body.match(/<h1\b/g)||[]).length,1);
const schema=JSON.parse(aba.body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'{}')['@graph'];
const faq=schema.find(item=>item['@type']==='FAQPage');
const service=schema.find(item=>item['@type']==='Service'&&item['@id']?.endsWith('#service'));
assert.equal(faq?.mainEntity?.length,11);
assert.equal(service?.areaServed,undefined);
assert(!schema.some(item=>['AggregateRating','Review','Offer'].includes(item['@type'])));

const aliases=[];
for(const resource of ['/aba-therapy','/t/aba-therapy']){const {response}=await fetchResource(resource,{redirect:'manual'});aliases.push({path:resource,status:response.status,location:response.headers.get('location')});assert.equal(response.status,301);assert.equal(response.headers.get('location'),origin+canonical);}
const exact=[];
for(const resource of ['/pinnacle-pages-data/aba-therapy-evidence.json','/pinnacle-pages-data/aba-therapy-evidence.txt','/pinnacle-pages-data/aba-therapy-machine.md','/pinnacle-pages-data/speech-sitemap.xml']){
  const {response,bytes}=await fetchResource(resource);
  const staged=await fs.readFile(path.join(stage,...resource.split('/').filter(Boolean)));
  const match=response.status===200&&hash(bytes)===hash(staged);
  exact.push({path:resource,status:response.status,sha256:hash(bytes),matchesStaged:match});
  assert(match,`Public file differs from staged source: ${resource}`);
}
const imageUrl=aba.body.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
assert(imageUrl?.includes('?v=20260930-aba-life-first'));
assert(aba.body.includes(`<meta name="twitter:image" content="${imageUrl}"`));
const imagePath=new URL(imageUrl).pathname;
const {response:imageResponse,bytes:imageBytes}=await fetchResource(imagePath);
const stagedImage=await fs.readFile(path.join(stage,...imagePath.split('/').filter(Boolean)));
assert.equal(imageResponse.status,200);assert(imageResponse.headers.get('content-type')?.startsWith('image/jpeg'));assert.equal(hash(imageBytes),hash(stagedImage));
const markdown=await fetchResource(canonical,{headers:{accept:'text/markdown'}});
assert.equal(markdown.response.status,200);assert(markdown.response.headers.get('content-type')?.startsWith('text/markdown'));assert.equal(markdown.response.headers.get('content-signal'),'search=yes, ai-input=yes');assert(markdown.body.includes('Related support when appropriate'));
const protectedPaths=['/verify/','/verify/evidence/records/fsc.html','/verify/evidence/pinnacleai-regulatory-journey.html','/national-autism-helpline','/sitemap.xml','/speech-therapy/sitemap.xml','/llms.txt'];
const protectedResults=await Promise.all(protectedPaths.map(async resource=>{const {response,body}=await fetchResource(resource);return {path:resource,status:response.status,hasAba:body.includes(canonical),hasPhone:body.includes('9100 181 181')};}));
assert(protectedResults.every(item=>item.status===200));
assert(protectedResults.find(item=>item.path==='/speech-therapy/sitemap.xml')?.hasAba);
assert(protectedResults.find(item=>item.path==='/llms.txt')?.hasAba);
const report={checkedAt:new Date().toISOString(),canonical,managedPages:pages.length,sharedHeaderHash:pages[0].headerHash,sharedFooterHash:pages[0].footerHash,aliases,exact,og:{url:imageUrl,status:imageResponse.status,bytes:imageBytes.length,sha256:hash(imageBytes),matchesStaged:true},faqCount:faq.mainEntity.length,serviceAreaServed:false,markdown:{status:markdown.response.status,type:markdown.response.headers.get('content-type'),contentSignal:markdown.response.headers.get('content-signal')},protectedResults};
await fs.writeFile('deployment/aba-live-v126-20260930.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
