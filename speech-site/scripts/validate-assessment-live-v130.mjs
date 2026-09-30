import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const origin='https://www.pinnacleblooms.org',canonical='/speech-aba-autism-assessments',release='release-assessment-v130-20260930';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const results=[];
async function get(path,options={}){const response=await fetch(origin+path,{redirect:'manual',...options,headers:{'cache-control':'no-cache',...(options.headers||{})}});const bytes=Buffer.from(await response.arrayBuffer());return {response,bytes,text:bytes.toString('utf8')};}
async function match(path,file){const live=await get(path),expected=await fs.readFile(release+'/'+file);assert.equal(live.response.status,200,path);assert.equal(sha(live.bytes),sha(expected),path);results.push({path,status:live.response.status,sha256:sha(live.bytes),bytes:live.bytes.length});return live;}
const page=await match(canonical+'?release=assessment-v130','pinnacle-pages-html/assessment.html');
assert(page.text.includes('index, follow, max-image-preview:large'));assert.equal(page.response.headers.get('content-signal'),'search=yes, ai-input=yes');assert(page.response.headers.get('vary').split(',').map(value=>value.trim().toLowerCase()).includes('accept'));assert(page.response.headers.get('link').includes(canonical));
const markdown=await get(canonical,{headers:{accept:'text/markdown'}});assert.equal(markdown.response.status,200);assert.equal(markdown.response.headers.get('content-type'),'text/markdown; charset=utf-8');assert.equal(sha(markdown.bytes),sha(await fs.readFile(release+'/pinnacle-pages-data/assessment-machine.md')));
const head=await get(canonical,{method:'HEAD'});assert.equal(head.response.status,200);assert.equal(head.bytes.length,0);
const alias=await get(canonical+'/?entry=assessment');assert.equal(alias.response.status,301);assert.equal(alias.response.headers.get('location'),origin+canonical+'?entry=assessment');
for(const ext of ['json','txt'])await match('/pinnacle-pages-data/assessment-evidence.'+ext,'pinnacle-pages-data/assessment-evidence.'+ext);await match('/pinnacle-pages-data/assessment-machine.md','pinnacle-pages-data/assessment-machine.md');
const image=new URL(page.text.match(/property="og:image" content="([^"]+)"/)[1]);await match(image.pathname+image.search,image.pathname.slice(1));
const hero=page.text.match(/src="([^"]*assessment-hero[^\"]+\.webp)"/)[1];await match(hero,hero.slice(1));
await match('/pinnacle-pages-scripts/enrolment.js','pinnacle-pages-scripts/enrolment.js');
await match('/enroll-autism-speech-aba-therapies-india?entry=speech-assessment','pinnacle-pages-html/enrolment.html');
await match('/autism-therapy','pinnacle-pages-html/autism-therapy.html');
const llms=await get('/llms.txt');assert.equal(llms.response.status,200);assert(llms.text.includes(origin+canonical));
const serviceGuide=await get('/speech-therapy/llms.txt');assert.equal(serviceGuide.response.status,200);assert(serviceGuide.text.includes(origin+canonical));
const core=await get('/sitemaps/core.xml');assert.equal(core.response.status,200);assert.equal((core.text.match(/speech-aba-autism-assessments/g)||[]).length,1);
const serviceMap=await get('/speech-therapy/sitemap.xml');assert.equal(serviceMap.response.status,200);assert(!serviceMap.text.includes(canonical));
const before=JSON.parse(await fs.readFile('deployment/assessment-protected-before-v130-20260930.json','utf8')),protectedResults=[];
for(const old of before.results){const live=await get(old.path);assert.equal(live.response.status,old.status,old.path);assert.equal(sha(live.bytes),old.sha256,old.path);protectedResults.push({path:old.path,status:live.response.status,unchanged:true,sha256:sha(live.bytes)});}
const output='deployment/assessment-live-v130-20260930.json';await fs.writeFile(output,JSON.stringify({checkedAt:new Date().toISOString(),sourceCommit:'850968e2ae4e758594c810e8c4eb9c6f7ad3cd87',canonical,results,markdown:true,head:true,alias:true,rootReadingGuide:true,serviceReadingGuide:true,singleCoreSitemapEntry:true,noDuplicateServiceSitemapEntry:true,protectedResults},null,2)+'\n');console.log(JSON.stringify({output,matchedPublicAssets:results.length,protectedUnchanged:protectedResults.length,markdown:true,singleSitemapEntry:true}));
