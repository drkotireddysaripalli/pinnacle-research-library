import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createMirraclesLibrary,videoObject,playerURL,displayTitle,ORIGIN,PAGE_SIZE} from './library.mjs';
const loadJson = async name => JSON.parse(await fs.readFile(new URL('./data/'+name+'.json',import.meta.url),'utf8'));
const catalogue = await loadJson('catalogue');
const provenance = await loadJson('provenance');
const handler = createMirraclesLibrary({loadJson});
const get = (path,options) => handler(new Request(ORIGIN+path,options));
const cards = html => (html.match(/<article class="card">/g)||[]).length;
test('hashtag source titles have readable headings while original titles remain available',async()=>{
 assert.equal(displayTitle({title:'#BeanBag#pinnaclemirracles #1autismtherapycentresnetwork'}),'Bean Bag');
 assert.equal(displayTitle({title:'A parent explains everyday practice'}),'A parent explains everyday practice');
 assert.equal(displayTitle({title:'#ADHD #SpeechDelay'}),'ADHD Speech Delay');
 const row=catalogue.records.find(r=>r.path==='/mirracles/20708156700/-BeanBag-pinnaclemirracles-1autismtherapycentresnetwork');
 const html=await (await get(row.path)).text();assert(html.includes('<h1>Bean Bag</h1>'));assert(html.includes('Published source title'));assert(html.includes('#BeanBag#pinnaclemirracles #1autismtherapycentresnetwork'));
});

test('actual source inventory preserves sitemap pages and every older public archive URL',async()=>{
  assert.equal(catalogue.order.length,19292);
  assert.equal(provenance.sourceVideoEntries,19163);
  const paths = new Set([...catalogue.records.map(r=>r.path),...Object.keys(catalogue.aliasPaths)]);
  let count=0;
  for(let n=0;n<=28;n++) for(const r of JSON.parse(await fs.readFile(new URL('../../ask-public/knowledge-data/mirracles-'+n+'.json',import.meta.url),'utf8'))) {
    assert(paths.has(r.url),r.url);count++;
  }
  assert.equal(count,28334);
  assert(catalogue.categories.some(c=>c.key==='Techniques'));
  assert(catalogue.categories.some(c=>c.key==='techniques'));
  assert(!catalogue.categories.some(c=>c.key==='null'));
  assert.equal(catalogue.categories.find(c=>c.key==='Materials').count,4317);
});
test('server-rendered main and category pages contain24 cards and correct nonoverlapping pagination',async()=>{
  const first=await get('/allmirracles'),second=await get('/allmirracles?page=2');
  assert.equal(first.status,200);const one=await first.text(),two=await second.text();
  assert.equal(cards(one),PAGE_SIZE);assert.equal(cards(two),PAGE_SIZE);
  assert(one.includes(catalogue.records.find(r=>r.id===catalogue.order[0]).path));
  assert(!two.includes('href="'+catalogue.records.find(r=>r.id===catalogue.order[0]).path+'"'));
  const category=await get('/allmirracles/category/Materials');const html=await category.text();
  assert.equal(cards(html),24);assert(html.includes('4,317 published records'));
  const last=await get('/allmirracles?page=804');assert.equal(cards(await last.text()),20);
  assert.equal((await get('/allmirracles?page=805')).status,404);
});
test('known category variants and malformed pagination fail safely',async()=>{
  assert.equal((await get('/allmirracles?category=Conditions')).status,200);
  assert.equal((await get('/allmirracles/Conditions')).status,200);
  assert.equal((await get('/allmirracles/category/INVENTED')).status,404);
  for(const page of ['0','-1','NaN','1.1','999999','']) {
    if(page==='')continue;
    assert.equal((await get('/allmirracles?page='+page)).status,404,page);
  }
});
test('search input is escaped, uncached, noindexed and absent from metadata and JSON-LD',async()=>{
  const marker='INVENTED </script><img src=x onerror=alert(1)>';
  const r=await get('/allmirracles?q='+encodeURIComponent(marker));const html=await r.text();
  assert.match(r.headers.get('cache-control'),/private, no-store/);assert.match(r.headers.get('x-robots-tag'),/noindex/);
  assert(!html.includes('<img src=x'));assert(html.includes('&lt;/script&gt;'));
  const ld=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  assert(!ld.includes('INVENTED'));JSON.parse(ld);
  assert.match(html,/<link rel="canonical" href="https:\/\/www.pinnacleblooms.org\/allmirracles">/);
  assert.equal(r.headers.get('referrer-policy'),'strict-origin');
});
test('detail and older alias preserve identity without eager external players',async()=>{
  const record=catalogue.records.find(r=>r.id===catalogue.order[0]);
  const r=await get(record.path);const html=await r.text();
  assert.equal(r.status,200);assert(!/<iframe\b/i.test(html));assert(html.includes('data-mirracles-player="https://www.youtube-nocookie.com/embed/'));
  assert(html.includes('loading="eager" fetchpriority="high"'));assert.equal(cards(html),6);
  assert(html.includes('tel:+919100181181'));
  const aliasPath=Object.keys(catalogue.aliasPaths)[0];
  assert.equal((await get(aliasPath)).status,200);
  const wrongSlug=await get('/mirracles/'+record.id+'/INVENTED?q=retain');assert.equal(wrongSlug.status,308);
  assert.equal(new URL(wrongSlug.headers.get('location')).pathname,new URL(record.path,ORIGIN).pathname);
  const empty=catalogue.records.find(r=>r.inSitemap&&!r.poster);
  const emptyHTML=await(await get(empty.path)).text();assert(!emptyHTML.includes('data-mirracles-player='));assert(!emptyHTML.includes('"@type":"VideoObject"'));
});
test('VideoObject requires source fields, trustworthy dates and safe source descriptions',()=>{
  const r={id:'123',path:'/mirracles/123/INVENTED',title:'Invented public fixture',description:'A published activity explanation.',poster:'https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg',published:'2026-01-01T12:00:00+05:30',player:'https://www.youtube.com/embed/abcdefghijk'};
  assert.equal(videoObject(r).embedUrl,'https://www.youtube-nocookie.com/embed/abcdefghijk');
  for(const k of ['title','description','poster','published','player'])assert.equal(videoObject({...r,[k]:null}),null,k);
  assert.equal(videoObject({...r,description:'97% proven improvement'}),null);
  assert.equal(playerURL('https://evil.test/embed/abcdefghijk'),null);
  assert.equal(playerURL('javascript:alert(1)'),null);
});
test('protected hosts, methods, app routes and unknown neighbors pass through without reading data',async()=>{
  let reads=0;const isolated=createMirraclesLibrary({loadJson:async()=>{reads++;return catalogue;}});
  for(const path of ['/epass','/api/enrolment','/payonline','/reports/123','/ask/auth/callback','/allmirracles-other','/mirracle']) assert.equal(await isolated(new Request(ORIGIN+path)),null,path);
  assert.equal(await isolated(new Request(ORIGIN+'/allmirracles',{method:'POST',body:'INVENTED'})),null);
  assert.equal(await isolated(new Request(ORIGIN+'/allmirracles',{headers:{authorization:'INVENTED'}})),null);
  assert.equal(await isolated(new Request('https://mirracle.pinnacleblooms.org/allmirracles')),null);
  assert.equal(reads,0);
  for(const path of ['/allmirracles/api','/allmirracles/account','/allmirracles/auth'])assert.equal(await get(path),null,path);
  assert.equal(await get('/mirracles/999999999999999999/unknown'),null);
});
test('HEAD, missing-source503 and shared-shell integration retain safe response semantics',async()=>{
  const head=await get('/allmirracles',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
  const broken=createMirraclesLibrary({loadJson:async()=>{throw Error('INVENTED_PRIVATE_SECRET');}});
  const r=await broken(new Request(ORIGIN+'/allmirracles'));assert.equal(r.status,503);assert(!(await r.text()).includes('INVENTED_PRIVATE_SECRET'));
  const custom=createMirraclesLibrary({loadJson,shell:{head:'<meta name="fixture" content="shared-shell">',header:'<header>INVENTED_SHARED_HEADER</header>',footer:'<footer>INVENTED_SHARED_FOOTER</footer>'}});
  const html=await(await custom(new Request(ORIGIN+'/allmirracles'))).text();assert(html.includes('INVENTED_SHARED_HEADER'));assert(html.includes('INVENTED_SHARED_FOOTER'));assert(html.includes('name="fixture"'));
});
test('common-shell response policy overrides CSP while cookie/search HTML stays private',async()=>{
  const policy="default-src 'self'; script-src 'self' https://static.example.test";
  const custom=createMirraclesLibrary({loadJson,responseHeaders:{'Content-Security-Policy':policy,'Cache-Control':'public, max-age=86400','X-Common-Shell':'INVENTED'}});
  const detail=catalogue.records.find(r=>r.id===catalogue.order[0]).path;
  for(const path of ['/allmirracles','/allmirracles/category/Materials',detail]) {
    const response=await custom(new Request(ORIGIN+path,{headers:{cookie:'fixture=INVENTED'}}));
    assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'private, no-store');
    assert.equal(response.headers.get('content-security-policy'),policy);assert.equal(response.headers.get('x-common-shell'),'INVENTED');
  }
  const search=await custom(new Request(ORIGIN+'/allmirracles?q=INVENTED'));
  assert.equal(search.headers.get('cache-control'),'private, no-store');assert.match(search.headers.get('x-robots-tag'),/noindex/);
  const anonymous=await custom(new Request(ORIGIN+'/allmirracles'));
  assert.equal(anonymous.headers.get('cache-control'),'public, max-age=0, s-maxage=300');
});
test('flat runtime is equivalent and transient catalogue/shell failures recover',async()=>{
  const deployed=await import('../mirracles-library.mjs');
  const flat=deployed.createMirraclesLibrary({loadJson});
  assert.equal(await(await flat(new Request(ORIGIN+'/allmirracles'))).text(),await(await get('/allmirracles')).text());
  let reads=0;
  const retry=createMirraclesLibrary({loadJson:async name=>{if(++reads===1)throw Error('INVENTED_TRANSIENT');return loadJson(name);}});
  assert.equal((await retry(new Request(ORIGIN+'/allmirracles'))).status,503);
  assert.equal((await retry(new Request(ORIGIN+'/allmirracles'))).status,200);
  let shells=0;
  const shellRetry=createMirraclesLibrary({loadJson,shell:async()=>{if(++shells===1)throw Error('INVENTED_SHELL_TRANSIENT');return {};}});
  assert.equal((await shellRetry(new Request(ORIGIN+'/allmirracles'))).status,503);
  assert.equal((await shellRetry(new Request(ORIGIN+'/allmirracles'))).status,200);
});
