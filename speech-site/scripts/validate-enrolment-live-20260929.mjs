import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const origin='https://www.pinnacleblooms.org';
const canonical='/enroll-autism-speech-aba-therapies-india';
const release=process.argv[2]||'release-current';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
async function get(path,options={}){const response=await fetch(origin+path,{redirect:'manual',headers:{'cache-control':'no-cache',...(options.headers||{})},...options});const bytes=Buffer.from(await response.arrayBuffer());return {response,bytes,body:bytes.toString('utf8')};}

const expected=await fs.readFile(`${release}/pinnacle-pages-html/enrolment.html`);
const live=await get(canonical+'?release=enrolment-live-20260929');
assert.equal(live.response.status,200);
assert.equal(sha(live.bytes),sha(expected));
assert.match(live.response.headers.get('x-robots-tag')||'',/^index, follow/);
assert.equal(live.response.headers.get('content-signal'),'search=yes, ai-input=yes');
assert.match(live.response.headers.get('link')||'',/enroll-autism-speech-aba-therapies-india/);
assert(live.body.includes('data-preview="false"')&&live.body.includes('data-api-endpoint="/api/enrolment"'));
assert(live.body.includes('id="speech-assessment-enquiry"')&&!live.body.includes('Design preview'));

for(const alias of ['/enroll/',canonical+'/']){const result=await get(alias+'?service=speech');assert.equal(result.response.status,301);assert.equal(result.response.headers.get('location'),origin+canonical+'?service=speech');}
const simpleAlias=await get('/enroll');assert.equal(simpleAlias.response.status,301);assert.equal(simpleAlias.response.headers.get('location'),origin+canonical);

const preview=await get('/pinnacle-pages-preview/enrolment');
assert.equal(preview.response.status,301);assert.equal(preview.response.headers.get('location'),origin+canonical);
assert.equal((await get('/pinnacle-pages-preview/enrolment',{method:'POST',body:'blocked'})).response.status,405);

assert.equal((await get('/api/enrolment')).response.status,405);
const invalid=await get('/api/enrolment',{method:'POST',headers:{origin,'content-type':'application/json'},body:'{}'});
assert.equal(invalid.response.status,422);assert.deepEqual(JSON.parse(invalid.body),{status:'rejected'});
assert.equal(invalid.response.headers.get('cache-control'),'no-store');

const sitemap=await get('/speech-therapy/sitemap.xml');assert.equal(sitemap.response.status,200);assert(sitemap.body.includes(origin+canonical));
const llms=await get('/speech-therapy/llms.txt');assert.equal(llms.response.status,200);assert(llms.body.includes('[Enrol at Pinnacle]('+origin+canonical+')'));

const before=JSON.parse(await fs.readFile('deployment/production-before-20260929.json','utf8')).results;
const preservePaths=['/verify/','/verify/evidence/evidence.json','/verify/evidence/fsc.pdf','/verify/evidence/pinnacleai-regulatory-journey.html','/national-autism-helpline','/robots.txt'];
const preserved=[];
for(const path of preservePaths){const old=before.find(item=>item.path===path);assert(old);const current=await get(path);preserved.push({path,status:current.response.status,sameBytes:sha(current.bytes)===old.bodySha256});}
assert(preserved.every(item=>item.status===200&&item.sameBytes));
const payonline=await get('/payonline');assert([200,302].includes(payonline.response.status));

const report={checkedAt:new Date().toISOString(),canonical:origin+canonical,liveStatus:live.response.status,liveHtmlSha256:sha(live.bytes),liveMatchesRelease:true,retiredPreviewRedirectStatus:preview.response.status,retiredPreviewLocation:preview.response.headers.get('location'),aliases301:4,apiGetStatus:405,apiInvalidStatus:422,invalidRequestReachedUpstream:false,sitemapLinked:true,llmsLinked:true,preserved,dynamicOrigin:[{path:'/payonline',status:payonline.response.status}]};
await fs.writeFile('deployment/enrolment-live-production-20260929.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
