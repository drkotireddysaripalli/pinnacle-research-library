import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {build} from 'esbuild';import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {urlHealthAlias,healthLinkTarget} from '../deployment/url-health-repair.mjs';
import {repairSidebarBreadcrumb} from '../deployment/legacy-social-metadata/schema.mjs';
import {isMissingMedia} from '../deployment/legacy-social-metadata/media.mjs';
import {createMirraclesLibrary,PAGE_SIZE,detailSeoTitle,detailSeoDescription} from '../deployment/mirracles-library.mjs';

test('new Guru directory links all restored articles and every page from the shared portal',async()=>{
 const data=JSON.parse(await fs.readFile('deployment/guru-recovery-20261009/data/articles.json','utf8'));
 const {createGuruRecovery}=await import('../deployment/guru-recovery.mjs');
 const shell={head:'<meta name="test" content="shell">',header:'<header>Pinnacle</header>',footer:'<footer>Existing</footer>'};
 const h=createGuruRecovery({loadJson:async()=>data,shell});const seen=new Set();
 for(let page=1;page<=21;page++){const r=await h(new Request(origin+'/guru'+(page===1?'':'?page='+page)));assert.equal(r.status,200);const html=await r.text();for(const m of html.matchAll(/href="(\/guru\/\d+\/[^"]+)"/g))seen.add(m[1]);assert(html.includes('href="/guru?page=21"'));assert(html.includes('tel:+919100181181'));}
 for(const record of Object.values(data.records))assert(seen.has(record.canonicalPath.replaceAll('&','&amp;').replaceAll('"','&quot;')));
 assert.equal(seen.size,499);assert.equal((await h(new Request(origin+'/guru?page=22'))).status,404);
 const {serveSpeech}=await import('../deployment/speech-handler.mjs');
 const r=await serveSpeech(new Request(origin+'/guru'),{ASSETS:{fetch:async req=>new Response(JSON.stringify(new URL(req.url).pathname.includes('articles.json')?data:shell))}},{});
 assert.equal(r.status,200);assert((await r.text()).includes('<h1>Pinnacle Guru articles</h1>'));
});

const origin='https://www.pinnacleblooms.org';
test('known dead image repair covers both real site hosts and excludes lookalike hosts',()=>{
 for(const host of ['www.pinnacleblooms.org','pinnacleblooms.org'])assert(isMissingMedia('https://'+host+'/images/therapysphere-room.jpg'));
 for(const url of ['https://other.example/images/therapysphere-room.jpg','https://pinnacleblooms.org.other.example/images/therapysphere-room.jpg','https://pinnacleblooms.org:444/images/therapysphere-room.jpg','https://pinnacleblooms.org/images/not-in-the-record.jpg'])assert(!isMissingMedia(url));
});
test('shared repairs cover the exact Semrush route, language and legacy-media families',async()=>{
 const aliases={
  '/centers/best-autism-speech-aba-occupational-therapy-center-srikakulkam-ap-india':'/centers/best-autism-speech-aba-occupational-therapy-center-srikakulam-ap-india',
  '/b/activities-of-daily-living':'/c/activities-of-daily-living',
  '/autism-therapy-centers/kukatpally':'/centers/best-autism-speech-aba-occupational-therapy-center-kukatpally-hyderabad-telangana-india'
 };
 for(const [source,target] of Object.entries(aliases))assert.equal(urlHealthAlias(new Request(origin+source+'?utm_source=test')).headers.get('location'),origin+target+'?utm_source=test');
 const source=`import {repairUrlHealth} from './deployment/url-health-repair.mjs';export default{fetch(request){return repairUrlHealth(request,new Response('<html lang="en"><head><meta property="og:image" content="/Assets/Materials/305.jpg"></head><body><img src="/Assets/Materials/305.jpg" alt="Old"></body></html>',{headers:{'content-type':'text/html'}}));}}`;
 const b=await build({stdin:{contents:source,resolveDir:process.cwd()},bundle:true,format:'esm',write:false});const mf=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-04',script:b.outputFiles[0].text}));
 try{const te=await(await mf.dispatchFetch(origin+'/faq/telugu/speech-therapy/example')).text();assert(te.includes('<html lang="te">'));assert(te.includes('/Assets/Materials/305.jpg'));
 const material=await(await mf.dispatchFetch(origin+'/ma/yellow-color-baskets-therapy')).text();assert(material.includes('data-pinnacle-brand-fallback="true"'));assert(!material.includes('src="/Assets/Materials/305.jpg"'));assert(!material.includes('content="/Assets/Materials/305.jpg"'));
 }finally{await mf.dispose();}
});
test('Mirracles detail metadata stays unique and within search-safe lengths',()=>{
 const first={id:'104251',title:'A very long published video title that would otherwise create the same oversized title warning on every generated detail page'};
 const second={...first,id:'104252'};
 assert.notEqual(detailSeoTitle(first),detailSeoTitle(second));assert(detailSeoTitle(first).length+' | Pinnacle Blooms Network®'.length<=60);
 const longId={...first,id:'20710890947'};assert(detailSeoTitle(longId).length+' | Pinnacle Blooms Network®'.length<=60);
 assert.notEqual(detailSeoDescription(first),detailSeoDescription(second));assert(detailSeoDescription(first).length<=156);assert(detailSeoDescription(first).includes(first.id));
});
test('precise malformed service and sitemap aliases preserve attribution and refuse unrelated routes',()=>{
 const url=origin+'/ABA%20/%20Behavioral%20Therapy?gclid=test&utm_source=google';
 const r=urlHealthAlias(new Request(url));assert.equal(r.status,301);assert.equal(r.headers.get('location'),origin+'/best-aba-therapy-center-india-proven-improvement-rate?gclid=test&utm_source=google');
 assert.equal(healthLinkTarget('/Special%20Education%20/%20Cognitive%20Therapy#next'),origin+'/best-special-education-center-call-9100181181#next');
 assert.equal(urlHealthAlias(new Request(origin+'/allmirracles-sitemap.xml')).headers.get('location'),origin+'/sitemaps/miracles.xml');
 assert.equal(urlHealthAlias(new Request(origin+'/verify')).headers.get('location'),origin+'/verify/');
 assert.equal(urlHealthAlias(new Request(origin+'/verify/')),null);
 assert.equal(healthLinkTarget('/innovation'),origin+'/pinnacle-ai-innovations-revolutionizing-autism-history');
 assert.equal(healthLinkTarget('/franchises?utm_source=internal'),origin+'/franchise-autism-therapy-center?utm_source=internal');
 assert.equal(healthLinkTarget('/verify/evidence/operating-metrics.html#source-pinpoints'),origin+'/verify/evidence/records/operating-metrics.html#source-pinpoints');
 const aliases={
  '/child-psychologist':'/child-psychological-counseling',
  '/child-psychologist-near-me':'/child-psychological-counseling',
  '/child-counselor-near-me':'/child-psychological-counseling',
  '/speech-therapist-near-me':'/top-speech-therapy-center-india-proven-improvement-rate',
  '/occupational-therapist-near-me':'/best-occupational-therapy-center-india-proven-improvement-rate',
  '/autism-center-near-me':'/centers'
 };
 for(const [source,target] of Object.entries(aliases))assert.equal(urlHealthAlias(new Request(origin+source+'?utm_source=google')).headers.get('location'),origin+target+'?utm_source=google');
 for(const [u,options] of [[url,{method:'POST'}],[url,{headers:{authorization:'Bearer private'}}],[origin+'/api/ABA%20/%20Behavioral%20Therapy',{}],['https://example.com/ABA%20/%20Behavioral%20Therapy',{}]])assert.equal(urlHealthAlias(new Request(u,options)),null);
});
test('only duplicated sidebar identity graphs are omitted; true breadcrumbs and content remain',()=>{
 const raw=JSON.stringify({'@context':'http://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,item:{'@id':origin+'/',name:'Home'}},{'@type':'ListItem',position:2,item:{'@id':'http://www.pinnacleblooms.org/t/sound-identification-therapy',name:'Paediatric Therapy Techniques'}}]});
 assert.equal(repairSidebarBreadcrumb(raw,origin+'/t/sound-identification-therapy'),null);
 assert.equal(repairSidebarBreadcrumb(raw,origin+'/other'),raw);
 const correct=raw.replace('http://www.pinnacleblooms.org/t/sound-identification-therapy',origin+'/t/');assert.equal(repairSidebarBreadcrumb(correct,origin+'/t/sound-identification-therapy'),correct);
});
test('all approved catalogue pages are reachable from the root without adding archive-only records',async()=>{
 const c=JSON.parse(await fs.readFile('deployment/mirracles-library-20261008/data/catalogue.json','utf8'));
 const handle=createMirraclesLibrary({loadJson:async()=>c});
 const body=await(await handle(new Request(origin+'/allmirracles'))).text();
 const pages=Math.ceil(c.order.length/PAGE_SIZE);assert.equal(pages,804);
 for(let n=2;n<=pages;n++)assert(body.includes('href="/allmirracles?page='+n+'"'),'missing direct page '+n);
 const page400=await(await handle(new Request(origin+'/allmirracles?page=400'))).text();
 for(const id of c.order.slice(399*PAGE_SIZE,400*PAGE_SIZE)){const r=c.records.find(r=>r.id===id);assert(page400.includes(r.path.replaceAll('&','&amp;').replaceAll('"','&quot;')));}
 assert(!page400.includes('aria-label="All video library pages"'));assert(page400.includes('href="/allmirracles"'));
 const search=await(await handle(new Request(origin+'/allmirracles?q=therapy'))).text();assert(!search.includes('aria-label="All video library pages"'));assert(search.includes('noindex'));
});
test('actual edge HTML rewrite fixes child-psychology identity and conversion path while keeping privacy headers',async()=>{
 const source=String.raw`import {repairUrlHealth} from './deployment/url-health-repair.mjs';export default{fetch(request){return repairUrlHealth(request,new Response('<html><head><title>Old title</title><meta name="description" content="Old description"><link rel="canonical" data-m="2" href="https://www.pinnacleblooms.org/child-psychological-counseling?gclid=test"><meta property="og:url" content="https://www.pinnacleblooms.org/child-psychological-counseling?gclid=test"></head><body><h1>Child counselling</h1><a href="/assets/abilityscore-summary.pdf" download>Download Summary</a><a href="/ABA%20/%20Behavioral%20Therapy?utm_source=google">ABA</a><a href="/" rel="nofollow noopener">Home</a><a href="/verify">Verify</a><a href="/innovation">Innovation</a><a href="/franchises">Franchise</a><img src="/Assets/OG/495.jpg" alt="Broken"></body></html>',{headers:{'content-type':'text/html','cache-control':'private, no-store','set-cookie':'session=retained; Secure; HttpOnly','etag':'"old"'}}));}}`;
 const b=await build({stdin:{contents:source,resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-04',script:b.outputFiles[0].text}));
 try{const r=await mf.dispatchFetch(origin+'/child-psychological-counseling?gclid=test'),s=await r.text();
 assert(s.includes('href="'+origin+'/child-psychological-counseling"'));assert(!s.includes('canonical" data-m="2" href="'+origin+'/child-psychological-counseling?'));assert(s.includes('<title>Child Psychologist &amp; Psychological Counselling | Pinnacle Blooms</title>'));assert(s.includes('Child psychology and counselling support for children and families'));assert(s.includes('data-cta="child-psychology-call"'));assert(s.includes('data-cta="child-psychology-assessment"'));assert(s.includes('Read study evidence'));assert(!s.includes('download>'));assert(s.includes('href="/" rel="noopener"'));assert(!s.includes('nofollow'));assert(s.includes('href="'+origin+'/verify/"'));assert(s.includes('href="'+origin+'/pinnacle-ai-innovations-revolutionizing-autism-history"'));assert(s.includes('href="'+origin+'/franchise-autism-therapy-center"'));assert(!s.includes('src="/Assets/OG/495.jpg"'));assert(s.includes('Pinnacle Blooms Network logo'));assert(s.includes('tel:+919100181181'));assert.equal(r.headers.get('cache-control'),'private, no-store');assert(r.headers.get('set-cookie').includes('session=retained'));assert.equal(r.headers.get('etag'),null);
 }finally{await mf.dispose();}
});

