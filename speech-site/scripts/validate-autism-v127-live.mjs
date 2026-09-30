import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const origin='https://www.pinnacleblooms.org';
const canonical='/autism-therapy';
const stage=path.resolve('release-autism-v127-hotfix');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const fetchResource=async (resource,options={})=>{
  const response=await fetch(origin+resource,{headers:{'cache-control':'no-cache',...options.headers},redirect:options.redirect||'follow'});
  const bytes=Buffer.from(await response.arrayBuffer());
  return {response,bytes,body:bytes.toString('utf8')};
};
const managed=[
  '/top-speech-therapy-center-india-proven-improvement-rate',
  '/enroll-autism-speech-aba-therapies-india',
  '/best-occupational-therapy-center-india-proven-improvement-rate',
  '/best-aba-therapy-center-india-proven-improvement-rate',
  '/best-special-education-center-call-9100181181',
  canonical,'/centers',
  '/speech-therapy/service-information',
  '/speech-therapy/first-visit-guide',
  '/speech-therapy/teacher-observation-guide'
];
const pages=await Promise.all(managed.map(async resource=>{
  const {response,body}=await fetchResource(resource);
  const header=body.match(/<header class="portal-header">[\s\S]*?<\/header>/)?.[0];
  const footer=body.match(/<footer class="portal-site-footer">[\s\S]*?<\/footer>/)?.[0];
  return {path:resource,status:response.status,headerHash:header?hash(header.replaceAll(' aria-current="page"','')):null,footerHash:footer?hash(footer):null,body};
}));
assert(pages.every(page=>page.status===200&&page.headerHash&&page.footerHash),'All managed pages must serve the shared shell');
assert.equal(new Set(pages.map(page=>page.headerHash)).size,1,'The common header differs');
assert.equal(new Set(pages.map(page=>page.footerHash)).size,1,'The common footer differs');
const autism=pages.find(page=>page.path===canonical);
assert.equal(autism.body.match(/<link rel="canonical" href="([^"]+)"/)?.[1],origin+canonical);
assert(autism.body.includes('index, follow, max-image-preview:large'));
assert(autism.body.includes('Autism therapy is not one fixed programme'));
assert(autism.body.includes('Every autistic child does not need every therapy'));
assert(autism.body.includes('tel:+919100181181'));
assert(autism.body.includes('directory-service-notice'));
assert.equal((autism.body.match(/<h1\b/g)||[]).length,1);
const schema=JSON.parse(autism.body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'{}')['@graph'];
const faq=schema.find(item=>item['@type']==='FAQPage');
const service=schema.find(item=>item['@type']==='Service'&&item['@id']?.endsWith('#service'));
assert.equal(faq?.mainEntity?.length,15);
assert.equal(service?.areaServed,undefined);
assert(!schema.some(item=>['AggregateRating','Review','Offer'].includes(item['@type'])));
const aliases=[];
for(const resource of ['/autism-therapy/','/t/autism-therapy','/t/autism-therapy/']){
  const {response}=await fetchResource(resource,{redirect:'manual'});
  aliases.push({path:resource,status:response.status,location:response.headers.get('location')});
  assert.equal(response.status,301);
  assert.equal(response.headers.get('location'),origin+canonical);
}
const exact=[];
for(const resource of ['/pinnacle-pages-data/autism-therapy-evidence.json','/pinnacle-pages-data/autism-therapy-evidence.txt','/pinnacle-pages-data/autism-therapy-machine.md','/pinnacle-pages-data/speech-sitemap.xml']){
  const {response,bytes}=await fetchResource(resource);
  const staged=await fs.readFile(path.join(stage,...resource.split('/').filter(Boolean)));
  const match=response.status===200&&hash(bytes)===hash(staged);
  exact.push({path:resource,status:response.status,sha256:hash(bytes),matchesStaged:match});
  assert(match,`Public file differs from staged source: ${resource}`);
}
const imageUrl=autism.body.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
assert(imageUrl?.includes('autism-social-integrated-20260930')&&imageUrl.includes('?v=2026-09-30-autism-life-first'));
assert(autism.body.includes(`<meta name="twitter:image" content="${imageUrl}"`));
const imagePath=new URL(imageUrl).pathname;
const {response:imageResponse,bytes:imageBytes}=await fetchResource(imagePath);
const stagedImage=await fs.readFile(path.join(stage,...imagePath.split('/').filter(Boolean)));
assert.equal(imageResponse.status,200);
assert(imageResponse.headers.get('content-type')?.startsWith('image/jpeg'));
assert.equal(hash(imageBytes),hash(stagedImage));
const markdown=await fetchResource(canonical,{headers:{accept:'text/markdown'}});
assert.equal(markdown.response.status,200);
assert(markdown.response.headers.get('content-type')?.startsWith('text/markdown'));
assert.equal(markdown.response.headers.get('content-signal'),'search=yes, ai-input=yes');
assert(markdown.body.includes('Autism therapy'));
const protectedPaths=['/verify/','/verify/evidence/records/fsc.html','/verify/evidence/pinnacleai-regulatory-journey.html','/national-autism-helpline','/sitemap.xml','/speech-therapy/sitemap.xml','/llms.txt'];
const protectedResults=await Promise.all(protectedPaths.map(async resource=>{const {response,body}=await fetchResource(resource);return {path:resource,status:response.status,hasAutism:body.includes(canonical)};}));
assert(protectedResults.every(item=>item.status===200));
assert(protectedResults.find(item=>item.path==='/speech-therapy/sitemap.xml')?.hasAutism);
assert(protectedResults.find(item=>item.path==='/llms.txt')?.hasAutism);
const report={checkedAt:new Date().toISOString(),canonical,workerVersion:'ddd4aea5-caa8-4fde-b2c4-f4f064463ce7',managedPages:pages.length,sharedHeaderHash:pages[0].headerHash,sharedFooterHash:pages[0].footerHash,aliases,exact,og:{url:imageUrl,status:imageResponse.status,bytes:imageBytes.length,sha256:hash(imageBytes),matchesStaged:true},faqCount:faq.mainEntity.length,serviceAreaServed:false,markdown:{status:markdown.response.status,type:markdown.response.headers.get('content-type'),contentSignal:markdown.response.headers.get('content-signal')},protectedResults};
await fs.writeFile('deployment/autism-live-v127-20260930.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
