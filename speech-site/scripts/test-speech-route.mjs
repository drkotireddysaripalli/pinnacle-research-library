import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BOOK_ROUTES} from '../deployment/speech-handler.mjs';
import {serveSpeech,ASSESSMENT_CANONICAL as assessment,SPEECH_CANONICAL as canonical,ENROLMENT_CANONICAL as enrolment,OCCUPATIONAL_CANONICAL as occupational,ABA_CANONICAL as aba,SPECIAL_EDUCATION_CANONICAL as specialEducation,AUTISM_CANONICAL as autism,CENTERS_CANONICAL as centers,PINNACLEAI_PATHS} from '../deployment/speech-handler.mjs';
const inventory={'/pinnacle-pages-html/speech.html':'abc','/pinnacle-pages-html/enrolment.html':'enrol','/pinnacle-pages-html/occupational-therapy.html':'ot','/pinnacle-pages-html/aba-therapy.html':'aba','/pinnacle-pages-html/special-education.html':'special','/pinnacle-pages-html/autism-therapy.html':'autism','/pinnacle-pages-html/centers.html':'centers','/pinnacle-pages-html/service-information.html':'def','/pinnacle-pages-assets/app.abc.css':'ghi','/pinnacle-pages-assets/share.abc.jpg':'jpg','/pinnacle-pages-scripts/speech-measurement.js':'jkl','/pinnacle-pages-data/speech-sitemap.xml':'mno','/pinnacle-pages-data/enrolment-machine.md':'enrol-md','/pinnacle-pages-data/occupational-therapy-machine.md':'ot-md','/pinnacle-pages-data/aba-therapy-machine.md':'aba-md','/pinnacle-pages-data/special-education-machine.md':'special-md','/pinnacle-pages-data/autism-therapy-machine.md':'autism-md','/pinnacle-pages-data/centers-machine.md':'centers-md'};
inventory['/pinnacle-pages-html/assessment.html']='assessment-html';
inventory['/pinnacle-pages-data/assessment-machine.md']='assessment-md';
for(const path of PINNACLEAI_PATHS){inventory['/pinnacle-pages-html/'+path.slice(1)+'.html']='product-html';inventory['/pinnacle-pages-data/'+path.slice(1)+'-reading.md']='product-md';}
inventory['/pinnacle-pages-data/pinnacleai-sitemap.xml']='product-map';
inventory['/pinnacle-pages-data/pinnacleai-llms.txt']='product-guide';
const request=(path,options)=>new Request('https://www.pinnacleblooms.org'+path,options);
const calls=[];
const env={ASSETS:{fetch:async r=>{calls.push({url:r.url,method:r.method});return new Response(r.method==='HEAD'?null:'<a href="/enroll">Speech page</a>',{headers:{'content-type':'text/html'}});}}};
test('shop and existing book routes retain exact mapping and isolate Shopify connectivity',async()=>{
 const stock={...inventory,...Object.fromEntries(Object.values(BOOK_ROUTES).map(id=>['/pinnacle-pages-html/'+id+'.html',id]))};
 assert.equal(Object.keys(BOOK_ROUTES).length,81);
 for(const [path,id] of Object.entries(BOOK_ROUTES))for(const method of ['GET','HEAD']){
  const response=await serveSpeech(request(path,{method}),env,stock);
  assert.equal(response.status,200);assert.equal(calls.at(-1).url,'https://assets.local/pinnacle-pages-html/'+id+'.html');
  assert(response.headers.get('content-security-policy').includes('https://pinnacleblooms.myshopify.com'));
  if(method==='HEAD')assert.equal(await response.text(),'');
 }
 const alias=await serveSpeech(request('/shop/?ref=sample'),env,stock);assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),'https://www.pinnacleblooms.org/shop?ref=sample');
 for(const headers of [{cookie:'fixture=1'},{authorization:'Bearer fixture'}])assert.equal((await serveSpeech(request('/shop',{headers}),env,stock)).headers.get('cache-control'),'private, no-store');
 assert(!(await serveSpeech(request(canonical),env,stock)).headers.get('content-security-policy').includes('myshopify.com'));
 assert.equal(await serveSpeech(request('/shop-other'),env,stock),null);
 assert.equal((await serveSpeech(request('/shop'),{ASSETS:{fetch:async()=>new Response('missing',{status:404})}},stock)).status,503);
});
test('canonical serves exact asset; links are never Verify-prefixed',async()=>{const r=await serveSpeech(request(canonical+'?utm_source=review'),env,inventory);assert.equal(r.status,200);assert((await r.text()).includes('href="/enroll"'));assert.equal(calls.at(-1).url,'https://assets.local/pinnacle-pages-html/speech.html');assert(r.headers.get('link').includes(canonical+'>'));assert.equal(r.headers.get('vary'),'Accept');});
test('GET and HEAD aliases preserve query and converge on existing canonical',async()=>{for(const method of ['GET','HEAD'])for(const p of ['/speech-therapy','/speech-therapy/',canonical+'/']){const r=await serveSpeech(request(p+'?utm_source=x',{method}),env,inventory);assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://www.pinnacleblooms.org'+canonical+'?utm_source=x');}});
test('HEAD returns metadata without body',async()=>{const r=await serveSpeech(request(canonical,{method:'HEAD'}),env,inventory);assert.equal(await r.text(),'');assert.equal(r.headers.get('x-robots-tag'),'index, follow, max-image-preview:large');});
test('POST and OPTIONS retain existing origin handling',async()=>{for(const options of [{method:'POST',body:'test-fixture'},{method:'OPTIONS'}])assert.equal(await serveSpeech(request(canonical,options),env,inventory),null);});
test('live enrolment serves the new page and simple aliases converge on its canonical',async()=>{const r=await serveSpeech(request(enrolment+'?entry=speech-assessment'),env,inventory);assert.equal(r.status,200);assert.match(await r.text(),/value="autism"/);for(const p of ['/enroll','/enroll/',enrolment+'/']){const alias=await serveSpeech(request(p+'?service=speech'),env,inventory);assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),'https://www.pinnacleblooms.org'+enrolment+'?service=speech');}assert.equal((await serveSpeech(request(enrolment,{method:'POST',body:'x'}),env,inventory)).status,405);});
test('occupational canonical serves its page and legacy routes converge',async()=>{const r=await serveSpeech(request(occupational),env,inventory);assert.equal(r.status,200);assert.match(await r.text(),/ot-observation/);for(const p of ['/occupational-therapy','/occupational-therapy/','/t/occupational-therapy',occupational+'/']){const alias=await serveSpeech(request(p+'?from=legacy'),env,inventory);assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),'https://www.pinnacleblooms.org'+occupational+'?from=legacy');}});
test('ABA canonical serves its page and duplicate legacy routes converge',async()=>{const r=await serveSpeech(request(aba),env,inventory);assert.equal(r.status,200);assert.match(await r.text(),/aba-next-decision/);for(const p of ['/aba-therapy','/aba-therapy/','/t/aba-therapy','/t/aba-therapy/',aba+'/']){const alias=await serveSpeech(request(p+'?from=legacy'),env,inventory);assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),'https://www.pinnacleblooms.org'+aba+'?from=legacy');}});
test('Special Education canonical serves its page and every known duplicate converges',async()=>{const r=await serveSpeech(request(specialEducation),env,inventory);assert.equal(r.status,200);assert.match(await r.text(),/special-chosen-step/);for(const p of ['/special-education','/special-education/','/Special-Education','/Special-Education/','/t/special-education','/t/special-education/',specialEducation+'/']){const alias=await serveSpeech(request(p+'?from=legacy'),env,inventory);assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),'https://www.pinnacleblooms.org'+specialEducation+'?from=legacy');}});
test('Autism canonical serves the integration hub and legacy variants converge',async()=>{const r=await serveSpeech(request(autism),env,inventory);assert.equal(r.status,200);assert.match(await r.text(),/autism-morning-steps/);for(const p of ['/autism-therapy/','/t/autism-therapy','/t/autism-therapy/']){const alias=await serveSpeech(request(p+'?from=legacy'),env,inventory);assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),'https://www.pinnacleblooms.org'+autism+'?from=legacy');}});
test('centre directory canonical serves one page while every known alias converges',async()=>{const r=await serveSpeech(request(centers),env,inventory);assert.equal(r.status,200);assert.equal(calls.at(-1).url,'https://assets.local/pinnacle-pages-html/centers.html');for(const p of ['/centers/','/Centers','/Centers/','/centres','/centres/','/Centres','/Centres/','/locations','/locations/','/Locations','/Locations/']){const alias=await serveSpeech(request(p+'?region=telangana'),env,inventory);assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),'https://www.pinnacleblooms.org'+centers+'?region=telangana');}assert.equal(await serveSpeech(request('/centers/existing-profile'),env,inventory),null);});
test('nine product pages serve exact HTML and Markdown with canonical links',async()=>{
 for(const path of PINNACLEAI_PATHS){
  const before=calls.length,html=await serveSpeech(request(path),env,inventory);assert.equal(html.status,200);
  if(path==='/seven-readiness-indexes'){assert.equal(calls.length,before);assert.match(await html.text(),/7 Readiness Indexes<\/span>Understand today/);}
  else if(path==='/everyday-therapy'){assert.equal(calls.length,before);assert.match(await html.text(),/Small moments/);}
  else if(path==='/therapeuticai'){assert.equal(calls.length,before);assert.match(await html.text(),/therapeuticai-observations/);}
  else if(path==='/fusion-module'){assert.equal(calls.length,before);assert.match(await html.text(),/fusion-observations/);}
  else if(path==='/prognose'){assert.equal(calls.length,before);assert.match(await html.text(),/prognose-observations/);}
  else if(path==='/personal-development-kernel'){assert.equal(calls.length,before);assert.match(await html.text(),/pdk-record-pair/);}
  else if(path==='/abilityscore'){assert.equal(calls.length,before);assert.match(await html.text(),/Give the next step a reason/);}
  else assert.equal(calls.at(-1).url,'https://assets.local/pinnacle-pages-html/'+path.slice(1)+'.html');
  assert(html.headers.get('link').includes(path+'>'));
  const beforeMarkdown=calls.length,markdown=await serveSpeech(request(path,{headers:{accept:'text/markdown'}}),env,inventory);assert.equal(markdown.status,200);
  if(path==='/seven-readiness-indexes'){assert.equal(calls.length,beforeMarkdown);assert.equal(await markdown.text(),readFileSync(new URL('../public/pinnacle-pages-data/seven-readiness-indexes-reading.md',import.meta.url),'utf8'));}
  else if(path==='/everyday-therapy'){assert.equal(calls.length,beforeMarkdown);assert.equal(await markdown.text(),readFileSync(new URL('../public/pinnacle-pages-data/everyday-therapy-reading.md',import.meta.url),'utf8'));}
  else if(path==='/therapeuticai'){assert.equal(calls.length,beforeMarkdown);assert.equal(await markdown.text(),readFileSync(new URL('../public/pinnacle-pages-data/therapeuticai-reading.md',import.meta.url),'utf8'));}
  else if(path==='/fusion-module'){assert.equal(calls.length,beforeMarkdown);assert.equal(await markdown.text(),readFileSync(new URL('../public/pinnacle-pages-data/fusion-module-reading.md',import.meta.url),'utf8'));}
  else if(path==='/prognose'){assert.equal(calls.length,beforeMarkdown);assert.equal(await markdown.text(),readFileSync(new URL('../public/pinnacle-pages-data/prognose-reading.md',import.meta.url),'utf8'));}
  else if(path==='/personal-development-kernel'){assert.equal(calls.length,beforeMarkdown);assert.equal(await markdown.text(),readFileSync(new URL('../public/pinnacle-pages-data/personal-development-kernel-reading.md',import.meta.url),'utf8'));}
  else if(path==='/abilityscore'){assert.equal(calls.length,beforeMarkdown);assert.equal(await markdown.text(),readFileSync(new URL('../public/pinnacle-pages-data/abilityscore-reading.md',import.meta.url),'utf8'));}
  else assert.equal(calls.at(-1).url,'https://assets.local/pinnacle-pages-data/'+path.slice(1)+'-reading.md');
  assert.equal(markdown.headers.get('content-type'),'text/markdown; charset=utf-8');
  const alias=await serveSpeech(request(path+'/?from=share'),env,inventory);assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),'https://www.pinnacleblooms.org'+path+'?from=share');
 }
});
test('product aliases and discovery files have exact destinations',async()=>{
 for(const [alias,path] of [['/pinnacle-ai','/pinnacleai'],['/ability-score','/abilityscore']]){const response=await serveSpeech(request(alias+'?ref=old'),env,inventory);assert.equal(response.status,301);assert.equal(response.headers.get('location'),'https://www.pinnacleblooms.org'+path+'?ref=old');}
 for(const [path,key] of [['/pinnacleai/sitemap.xml','/pinnacle-pages-data/pinnacleai-sitemap.xml'],['/pinnacleai/llms.txt','/pinnacle-pages-data/pinnacleai-llms.txt']]){const before=calls.length,response=await serveSpeech(request(path),env,inventory);assert.equal(response.status,200);assert.equal(calls.length,before);assert.equal(await response.text(),readFileSync(new URL('../public'+key,import.meta.url),'utf8'));}
 assert.equal(await serveSpeech(request('/pinnacleai/other'),env,inventory),null);
});
test('enrolment, managed therapy pages and centre directory expose first-party Markdown for answer engines',async()=>{for(const [path,key] of [[enrolment,'/pinnacle-pages-data/enrolment-machine.md'],[occupational,'/pinnacle-pages-data/occupational-therapy-machine.md'],[aba,'/pinnacle-pages-data/aba-therapy-machine.md'],[specialEducation,'/pinnacle-pages-data/special-education-machine.md'],[autism,'/pinnacle-pages-data/autism-therapy-machine.md'],[centers,'/pinnacle-pages-data/centers-machine.md']]){const r=await serveSpeech(request(path,{headers:{accept:'text/markdown'}}),env,inventory);assert.equal(r.status,200);if(path===enrolment)assert.equal(await r.text(),readFileSync(new URL('../public/pinnacle-pages-data/enrolment-machine.md',import.meta.url),'utf8'));else if(path===occupational)assert.match(await r.text(),/Illustrative example: getting ready to join play/);else if(path===aba)assert.match(await r.text(),/Still to be observed/);else if(path===specialEducation)assert.match(await r.text(),/The next response is not yet observed/);else if(path===autism)assert.match(await r.text(),/has not yet been observed/);else assert.equal(calls.at(-1).url,'https://assets.local'+key);assert.equal(r.headers.get('content-type'),'text/markdown; charset=utf-8');assert.equal(r.headers.get('content-signal'),'search=yes, ai-input=yes');assert.equal(r.headers.get('vary'),'Accept');assert(r.headers.get('link').includes(path+'>'));}});
test('a zero-quality Markdown preference receives HTML',async()=>{const r=await serveSpeech(request(specialEducation,{headers:{accept:'text/markdown;q=0, text/html'}}),env,inventory);assert.equal(r.status,200);assert.match(await r.text(),/special-chosen-step/);assert.equal(r.headers.get('content-type'),'text/html; charset=utf-8');assert.equal(r.headers.get('vary'),'Accept');});
test('other hosts, unknown suffixes, application and private paths retain existing handling',async()=>{for(const p of ['/payonline','/api/sendotp','/verify/','/national-autism-helpline',canonical+'-other',canonical+'/other','/speech-therapy/other','/pinnacle-pages-assets/unknown.css','/pinnacle-pages-html/speech.html','/abilityscore-global-study','/therapeuticai-effectiveness-study','/pinnacle-ai-innovations-revolutionizing-autism-history','/pinnacleai-other'])assert.equal(await serveSpeech(request(p),env,inventory),null);assert.equal(await serveSpeech(new Request('https://pinnacleblooms.org'+canonical),env,inventory),null);});
test('public HTML remains current for Range, no-transform and credentials',async()=>{for(const headers of [{range:'bytes=0-1'},{'cache-control':'no-transform'},{authorization:'Bearer fixture'},{cookie:'session=fixture'}]){const r=await serveSpeech(request(canonical,{headers}),env,inventory);assert.equal(r.status,200);if(headers.cookie||headers.authorization)assert.equal(r.headers.get('cache-control'),'private, no-store');}});
test('stable measurement script is revalidated; hashed assets immutable',async()=>{const script=await serveSpeech(request('/pinnacle-pages-scripts/speech-measurement.js'),env,inventory);assert(!script.headers.get('cache-control').includes('immutable'));const css=await serveSpeech(request('/pinnacle-pages-assets/app.abc.css'),env,inventory);assert(css.headers.get('cache-control').includes('immutable'));assert.equal(css.headers.get('content-type'),'text/css; charset=utf-8');});
test('JPEG social cards use the exact image MIME type',async()=>{const jpg=await serveSpeech(request('/pinnacle-pages-assets/share.abc.jpg'),env,inventory);assert.equal(jpg.headers.get('content-type'),'image/jpeg');});
test('conditional cache response is bodyless and retains current ETag',async()=>{const first=await serveSpeech(request(canonical),env,inventory);const etag=first.headers.get('etag');const r=await serveSpeech(request(canonical,{headers:{'if-none-match':etag}}),env,inventory);assert.equal(r.status,304);assert.equal(await r.text(),'');assert.equal(r.headers.get('etag'),etag);});
test('missing deployed asset fails closed without swapping to another page',async()=>{const r=await serveSpeech(request(canonical),{ASSETS:{fetch:async()=>new Response('missing',{status:404})}},inventory);assert.equal(r.status,503);assert.equal(r.headers.get('cache-control'),'no-store');});
test('source record and sitemap get independent exact mappings',async()=>{await serveSpeech(request('/speech-therapy/service-information'),env,inventory);assert(calls.at(-1).url.endsWith('/pinnacle-pages-html/service-information.html'));const r=await serveSpeech(request('/speech-therapy/sitemap.xml'),env,inventory);assert.equal(r.headers.get('content-type'),'application/xml; charset=utf-8');});

test('stale If-Range on an asset yields complete content, not partial mixed bytes',async()=>{let incoming;const assetEnv={ASSETS:{fetch:async r=>{incoming=r;return new Response('whole-new-file')}}};const r=await serveSpeech(request('/pinnacle-pages-assets/app.abc.css',{headers:{range:'bytes=0-1','if-range':'"old-version"'}}),assetEnv,inventory);assert.equal(r.status,200);assert.equal(await r.text(),'whole-new-file');assert.equal(incoming.headers.has('range'),false);});

test('assessment exact route, HEAD, Markdown and trailing alias preserve adjacent origin routes',async()=>{
 for(const method of ['GET','HEAD']){const html=await serveSpeech(request(assessment,{method}),env,inventory);assert.equal(html.status,200);assert.equal(html.headers.get('content-type'),'text/html; charset=utf-8');assert.equal(calls.at(-1).url,'https://assets.local/pinnacle-pages-html/assessment.html');assert(html.headers.get('link').includes(assessment+'>'));if(method==='HEAD')assert.equal(await html.text(),'');const alias=await serveSpeech(request(assessment+'/?ref=old',{method}),env,inventory);assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),'https://www.pinnacleblooms.org'+assessment+'?ref=old');}
 const md=await serveSpeech(request(assessment,{headers:{accept:'text/markdown'}}),env,inventory);assert.equal(md.status,200);assert.equal(md.headers.get('content-type'),'text/markdown; charset=utf-8');assert.equal(calls.at(-1).url,'https://assets.local/pinnacle-pages-data/assessment-machine.md');
 const zero=await serveSpeech(request(assessment,{headers:{accept:'text/markdown;q=0, text/html'}}),env,inventory);assert.equal(zero.headers.get('content-type'),'text/html; charset=utf-8');
 for(const path of [assessment+'/private',assessment+'-other','/assessmentlead'])assert.equal(await serveSpeech(request(path),env,inventory),null);
 for(const headers of [{authorization:'Bearer fixture'},{range:'bytes=0-5'},{'cache-control':'no-transform'}])assert.equal((await serveSpeech(request(assessment,{headers}),env,inventory)).status,200);
 assert.equal(await serveSpeech(request(assessment,{method:'POST',body:'fixture'}),env,inventory),null);
});

test('book PDF previews serve PDF MIME for browser readers on GET and HEAD',async()=>{
 const path='/pinnacle-pages-assets/books-languages-20261002/hi/speech-sample.pdf';
 const sampleInventory={...inventory,[path]:'sample-pdf'};
 const sampleEnv={ASSETS:{fetch:async r=>new Response(r.method==='HEAD'?null:'%PDF-fixture',{headers:{'content-type':'application/octet-stream'}})}};
 for(const method of ['GET','HEAD']){const response=await serveSpeech(request(path,{method}),sampleEnv,sampleInventory);assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'application/pdf');assert.equal(response.headers.get('x-content-type-options'),'nosniff');assert.equal(await response.text(),method==='HEAD'?'':'%PDF-fixture');}
});

test('common sitemap and analytics use the live union rather than bundled therapy snapshots',async()=>{
 const bodies={'/pinnacle-pages-data/speech-sitemap.xml':'<urlset><url><loc>https://www.pinnacleblooms.org/centers/current-centre</loc></url></urlset>','/pinnacle-pages-scripts/speech-measurement.js':'/* current common analytics */'};
 const current={ASSETS:{fetch:async r=>new Response(r.method==='HEAD'?null:bodies[new URL(r.url).pathname])}};
 for(const [key,body]of Object.entries(bodies)){
  const response=await serveSpeech(request(key),current,inventory);
  assert.equal(await response.text(),body);
  assert.equal(response.headers.get('etag'),'"speech-'+inventory[key]+'"');
  const alias=key.endsWith('.xml')?await serveSpeech(request('/speech-therapy/sitemap.xml'),current,inventory):null;
  if(alias)assert.equal(await alias.text(),body);
 }
 const missing=await serveSpeech(request('/pinnacle-pages-data/speech-sitemap.xml'),{ASSETS:{fetch:async()=>new Response('missing',{status:404})}},inventory);
 assert.equal(missing.status,503,'Do not disguise a missing live sitemap with an old snapshot');
});
test('the approved CHEQ diagnostic can create its browser worker without broad external worker access',async()=>{
 const response=await serveSpeech(request(canonical),env,inventory);
 assert.match(response.headers.get('content-security-policy'),/worker-src 'self' blob:;/);
});
