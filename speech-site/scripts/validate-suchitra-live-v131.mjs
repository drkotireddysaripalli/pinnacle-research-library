import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {suchitraPath} from '../src/data/suchitra-content.ts';
const origin='https://www.pinnacleblooms.org',release='release-suchitra-v131-final-20260930';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const controls=['/verify/','/verify/evidence/records/fsc.html','/verify/evidence/fsc.pdf','/national-autism-helpline','/robots.txt','/sitemap.xml','/sitemaps/core.xml','/pinnacle-ai-innovations-revolutionizing-autism-history','/abilityscore-global-study','/therapeuticai-effectiveness-study','/centers/best-autism-speech-aba-occupational-therapy-center-suchitra2-hyderabad-telangana-india','/centers/best-autism-speech-aba-occupational-therapy-center-nizampet-hyderabad-telangana-india'];
async function get(path,opts={}){const r=await fetch(origin+path,{redirect:'manual',...opts,headers:{'cache-control':'no-cache',...(opts.headers||{})}});const bytes=Buffer.from(await r.arrayBuffer());return {r,bytes,text:bytes.toString('utf8')};}
const baseline='deployment/suchitra-protected-before-v131-20260930.json';
if(process.argv.includes('--before')){
 const results=[];for(const path of controls){const o=await get(path);results.push({path,status:o.r.status,bytes:o.bytes.length,sha256:sha(o.bytes)});}
 await fs.writeFile(baseline,JSON.stringify({checkedAt:new Date().toISOString(),results},null,2)+'\n');console.log(JSON.stringify({baseline,count:results.length}));process.exit(0);
}
const results=[];
async function match(publicPath,file){const o=await get(publicPath);assert.equal(o.r.status,200,publicPath);assert.equal(sha(o.bytes),sha(await fs.readFile(release+'/'+file)),publicPath);results.push({path:publicPath,status:o.r.status,bytes:o.bytes.length,sha256:sha(o.bytes)});return o;}
const page=await match(suchitraPath+'?release=suchitra-v131','pinnacle-pages-html/suchitra.html');
assert(page.r.headers.get('vary').toLowerCase().split(',').map(s=>s.trim()).includes('accept'));assert(page.text.includes('Query Raised'));assert(page.text.includes('service=help&amp;centre=suchitra'));
for(const ext of ['json','txt'])await match('/pinnacle-pages-data/suchitra-evidence.'+ext,'pinnacle-pages-data/suchitra-evidence.'+ext);
await match('/pinnacle-pages-data/suchitra-machine.md','pinnacle-pages-data/suchitra-machine.md');
await match('/pinnacle-pages-scripts/speech-measurement.js','pinnacle-pages-scripts/speech-measurement.js');
const image=new URL(page.text.match(/property="og:image" content="([^"]+)"/)[1]);await match(image.pathname+image.search,image.pathname.slice(1));
const hero=page.text.match(/class="local-hero-photo"[\s\S]*?src="([^"]+)"/)[1];await match(hero,hero.slice(1));
const markdown=await get(suchitraPath,{headers:{accept:'text/markdown'}});assert.equal(markdown.r.status,200);assert(markdown.r.headers.get('content-type').startsWith('text/markdown'));assert.equal(sha(markdown.bytes),sha(await fs.readFile(release+'/pinnacle-pages-data/suchitra-machine.md')));
const head=await get(suchitraPath,{method:'HEAD'});assert.equal(head.r.status,200);assert.equal(head.bytes.length,0);
const alias=await get(suchitraPath+'/?campaign=checked');assert.equal(alias.r.status,301);assert.equal(alias.r.headers.get('location'),origin+suchitraPath+'?campaign=checked');
const sitemap=await get('/sitemaps/centres.xml');assert.equal(sitemap.r.status,200);assert.equal(sitemap.text.split('<loc>'+origin+suchitraPath+'</loc>').length-1,1);assert(sitemap.text.includes('<loc>'+origin+suchitraPath+'</loc><lastmod>2026-09-30</lastmod>'));
const llms=await get('/llms.txt');assert.equal(llms.r.status,200);assert(llms.text.includes(origin+suchitraPath));
const previous=JSON.parse(await fs.readFile(baseline,'utf8')),protectedResults=[];
for(const old of previous.results){const o=await get(old.path);assert.equal(o.r.status,old.status,old.path);assert.equal(sha(o.bytes),old.sha256,old.path);protectedResults.push({path:old.path,status:o.r.status,unchanged:true,sha256:sha(o.bytes)});}
const mapping={
 '/top-speech-therapy-center-india-proven-improvement-rate':'speech',
 '/enroll-autism-speech-aba-therapies-india':'enrolment',
 '/best-occupational-therapy-center-india-proven-improvement-rate':'occupational-therapy',
 '/best-aba-therapy-center-india-proven-improvement-rate':'aba-therapy',
 '/best-special-education-center-call-9100181181':'special-education',
 '/autism-therapy':'autism-therapy','/centers':'centers','/speech-aba-autism-assessments':'assessment',
 '/speech-therapy/service-information':'service-information','/speech-therapy/first-visit-guide':'first-visit-guide','/speech-therapy/teacher-observation-guide':'teacher-observation-guide',
 ...Object.fromEntries(['pinnacleai','abilityscore','seven-readiness-indexes','personal-development-kernel','prognose','therapeuticai','everyday-therapy','fusion-module','reassess-review-repeat'].map(slug=>['/'+slug,slug])),
 [suchitraPath]:'suchitra'
};
const shells=[];let firstHeader,firstFooter;
for(const [path,file]of Object.entries(mapping)){
 const o=await get(path);assert.equal(o.r.status,200,path);assert.equal(sha(o.bytes),sha(await fs.readFile(release+'/pinnacle-pages-html/'+file+'.html')),path);
 const header=o.text.match(/<header\b[\s\S]*?<\/header>/)[0].replace(/ aria-current="page"/g,'').replace(/ is-current/g,'');
 const footer=o.text.match(/<footer\b[\s\S]*?<\/footer>/)[0];assert(footer.includes('verify-footer'));
 firstHeader??=header;firstFooter??=footer;assert.equal(header,firstHeader,path+'header');assert.equal(footer,firstFooter,path+'footer');shells.push({path,status:200,stagedHtmlMatched:true,commonHeader:true,commonFooter:true});
}
const output='deployment/suchitra-live-v131-20260930.json';await fs.writeFile(output,JSON.stringify({checkedAt:new Date().toISOString(),canonical:suchitraPath,results,markdown:true,head:true,queryPreservingAlias:true,singleCentreSitemapEntry:true,rootReadingAid:true,protectedResults,shells},null,2)+'\n');console.log(JSON.stringify({output,matchedAssets:results.length,protectedUnchanged:protectedResults.length,matchedSharedPages:shells.length}));
