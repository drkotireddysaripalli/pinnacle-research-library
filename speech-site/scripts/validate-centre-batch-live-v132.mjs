import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {centreDetails} from '../src/data/centre-detail-content.ts';
import {suchitraPath} from '../src/data/suchitra-content.ts';
const origin='https://www.pinnacleblooms.org',release='release-centre-batch-v132-20261001';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const knownAdsTags=['<script async src="https://www.googletagmanager.com/gtag/js?id=AW-10810823199"></script>','<script src="https://www.pinnacleblooms.org/pinnacle-pages-scripts/google-ads-call.js"></script>'];
const owned=text=>knownAdsTags.reduce((v,tag)=>v.replace(tag,''),text);
const controls=['/verify/','/verify/evidence/records/fsc.html','/verify/evidence/fsc.pdf','/national-autism-helpline','/robots.txt','/sitemap.xml','/sitemaps/core.xml','/pinnacle-ai-innovations-revolutionizing-autism-history','/abilityscore-global-study','/therapeuticai-effectiveness-study','/centers/best-autism-speech-aba-occupational-therapy-center-suchitra2-hyderabad-telangana-india','/centers/best-autism-speech-aba-occupational-therapy-center-jntu-hyderabad-telangana-india'];
const baseline='deployment/centre-batch-protected-before-v132-20261001.json';
async function get(path,opts={}){const r=await fetch(origin+path,{redirect:'manual',signal:AbortSignal.timeout(45000),...opts,headers:{'cache-control':'no-cache',...(opts.headers||{})}});const bytes=Buffer.from(await r.arrayBuffer());return {r,bytes,text:bytes.toString('utf8')};}
if(process.argv.includes('--before')){
 const results=[];for(const path of controls){const o=await get(path);assert.equal(o.r.status,200,path);results.push({path,status:o.r.status,bytes:o.bytes.length,sha256:sha(o.bytes)});}
 const planned=[];for(const p of centreDetails){const o=await get(p.path);assert.equal(o.r.status,200,p.path);planned.push({id:p.id,path:p.path,status:o.r.status,bytes:o.bytes.length,sha256:sha(o.bytes)});}
 await fs.writeFile(baseline,JSON.stringify({checkedAt:new Date().toISOString(),results,planned},null,2)+'\n');console.log(JSON.stringify({baseline,protected:results.length,planned:planned.length}));process.exit(0);
}
const matches=[],pages=[];
async function match(path,file,{html=false}={}){const o=await get(path);assert.equal(o.r.status,200,path);const bytes=html?Buffer.from(owned(o.text)):o.bytes;assert.equal(sha(bytes),sha(await fs.readFile(release+'/'+file)),path);matches.push({path,status:o.r.status,bytes:o.bytes.length,ownedHtml:html,sha256:sha(bytes),knownExternalAdsTags:html?knownAdsTags.filter(tag=>o.text.includes(tag)).length:0});return o;}
for(const p of centreDetails){
 const page=await match(p.path+'?release=centre-v132','pinnacle-pages-html/'+p.id+'.html',{html:true});assert(page.r.headers.get('vary').toLowerCase().split(',').map(x=>x.trim()).includes('accept'));assert(page.text.includes('centre='+p.id));
 for(const file of [p.id+'-evidence.json',p.id+'-evidence.txt',p.id+'-machine.md'])await match('/pinnacle-pages-data/'+file,'pinnacle-pages-data/'+file);
 const image=new URL(page.text.match(/property="og:image" content="([^"]+)"/)[1]);const social=await match(image.pathname+image.search,image.pathname.slice(1));
 const hero=page.text.match(/class="local-hero-photo"[\s\S]*?src="([^"]+)"/)[1];await match(hero,hero.slice(1));
 const markdown=await get(p.path,{headers:{accept:'text/markdown'}});assert.equal(markdown.r.status,200);assert(markdown.r.headers.get('content-type').startsWith('text/markdown'));assert.equal(sha(markdown.bytes),sha(await fs.readFile(release+'/pinnacle-pages-data/'+p.id+'-machine.md')));
 const head=await get(p.path,{method:'HEAD'});assert.equal(head.r.status,200);assert.equal(head.bytes.length,0);
 const alias=await get(p.path+'/?campaign=checked');assert.equal(alias.r.status,301);assert.equal(alias.r.headers.get('location'),origin+p.path+'?campaign=checked');
 const cookie=await get(p.path,{headers:{cookie:'ps_ga=test-public-static; ps_ga_test=test-public-static'}});assert.equal(cookie.r.status,200);assert.equal(sha(Buffer.from(owned(cookie.text))),sha(await fs.readFile(release+'/pinnacle-pages-html/'+p.id+'.html')));
 pages.push({id:p.id,path:p.path,markdown:true,head:true,queryPreservingAlias:true,ownedAnalyticsCookie:true,socialBytes:social.bytes.length});
}
await match('/pinnacle-pages-scripts/speech-measurement.js','pinnacle-pages-scripts/speech-measurement.js');
const suchitraCookie=await get(suchitraPath,{headers:{cookie:'ps_ga=test-public-static'}});assert.equal(suchitraCookie.r.status,200);assert.equal(sha(Buffer.from(owned(suchitraCookie.text))),sha(await fs.readFile(release+'/pinnacle-pages-html/suchitra.html')));
const sitemap=await get('/sitemaps/centres.xml');assert.equal(sitemap.r.status,200);assert.equal(sha(sitemap.bytes),sha(await fs.readFile(release+'/pinnacle-pages-data/centres-sitemap.xml')));for(const p of centreDetails){assert.equal(sitemap.text.split('<loc>'+origin+p.path+'</loc>').length-1,1);assert(sitemap.text.includes('<loc>'+origin+p.path+'</loc><lastmod>2026-10-01</lastmod>'));}
const llms=await get('/llms.txt');assert.equal(llms.r.status,200);for(const p of centreDetails)assert(llms.text.includes(origin+p.path));
const previous=JSON.parse(await fs.readFile(baseline,'utf8')),protectedResults=[];
for(const old of previous.results){const o=await get(old.path);assert.equal(o.r.status,old.status,old.path);assert.equal(sha(o.bytes),old.sha256,old.path);protectedResults.push({path:old.path,status:o.r.status,unchanged:true,sha256:sha(o.bytes)});}
const mapping={
 '/top-speech-therapy-center-india-proven-improvement-rate':'speech','/enroll-autism-speech-aba-therapies-india':'enrolment','/best-occupational-therapy-center-india-proven-improvement-rate':'occupational-therapy','/best-aba-therapy-center-india-proven-improvement-rate':'aba-therapy','/best-special-education-center-call-9100181181':'special-education','/autism-therapy':'autism-therapy','/centers':'centers','/speech-aba-autism-assessments':'assessment',
 '/speech-therapy/service-information':'service-information','/speech-therapy/first-visit-guide':'first-visit-guide','/speech-therapy/teacher-observation-guide':'teacher-observation-guide',
 ...Object.fromEntries(['pinnacleai','abilityscore','seven-readiness-indexes','personal-development-kernel','prognose','therapeuticai','everyday-therapy','fusion-module','reassess-review-repeat'].map(slug=>['/'+slug,slug])),[suchitraPath]:'suchitra',...Object.fromEntries(centreDetails.map(p=>[p.path,p.id]))
};
const shells=[];let firstHeader,firstFooter;
for(const [path,file]of Object.entries(mapping)){
 const o=await get(path);assert.equal(o.r.status,200,path);assert.equal(sha(Buffer.from(owned(o.text))),sha(await fs.readFile(release+'/pinnacle-pages-html/'+file+'.html')),path);
 const header=o.text.match(/<header\b[\s\S]*?<\/header>/)[0].replace(/ aria-current="page"/g,'').replace(/ is-current/g,'');const footer=o.text.match(/<footer\b[\s\S]*?<\/footer>/)[0];assert(footer.includes('verify-footer'));
 firstHeader??=header;firstFooter??=footer;assert.equal(header,firstHeader,path+' header');assert.equal(footer,firstFooter,path+' footer');shells.push({path,status:200,ownedStagedHtmlMatched:true,knownExternalAdsTags:knownAdsTags.filter(tag=>o.text.includes(tag)).length,commonHeader:true,commonFooter:true});
}
const output='deployment/centre-batch-live-v132-20261001.json';await fs.writeFile(output,JSON.stringify({checkedAt:new Date().toISOString(),pages,matches,protectedResults,shells,suchitraOwnedCookieFixed:true,singleCentreSitemapEntries:true,rootReadingAid:true,advertisingConsentVerified:false},null,2)+'\n');
console.log(JSON.stringify({output,newPages:pages.length,matchedAssets:matches.length,protectedUnchanged:protectedResults.length,matchedSharedPages:shells.length,suchitraOwnedCookieFixed:true}));
