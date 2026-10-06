import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {build} from 'esbuild';
import {Miniflare, convertV4MiniflareOptions} from 'miniflare';
import {isEligible} from '../deployment/legacy-social-metadata/entry.mjs';

const origin = 'https://www.pinnacleblooms.org';
const html = (path='/physiotherapy') => `<!doctype html><html><head><title>Parent guidance</title><meta property="og:url" content="http://www.pinnacleblooms.org${path}" /><link rel="canonical" href="${origin}${path}" /></head><body><header>Approved header</header><main>తెలుగు · 中文 · Family 🌸 <a href="tel:+919100181181">9100 181 181</a></main><footer>Approved footer</footer></body></html>`;

test('only named www legacy families and GET enter the transform', () => {
  for (const path of ['/physiotherapy','/physiotherapy/','/faq','/faq/telugu/example','/t/interactive-song-therapy','/mirracles/123/published-story','/allmirracles','/teacher-training/']) assert(isEligible(new Request(origin+path)));
  for (const path of ['/verify/','/ask','/pinnacleai','/api/enrolment','/physiotherapy-other','/physiotherapy/data','/faq-other','/allmirracles-other','/allmirracles/api','/t','/mirracles','/teacher-training-other']) assert(!isEligible(new Request(origin+path)));
  for (const method of ['HEAD','POST','OPTIONS']) assert(!isEligible(new Request(origin+'/physiotherapy',{method})));
  for (const url of ['https://pinnacleblooms.org/physiotherapy','http://www.pinnacleblooms.org/physiotherapy']) assert(!isEligible(new Request(url)));
});

test('Cloudflare runtime preserves body, guards and response semantics', async t => {
  let fixture={body:html(),headers:{}}, forwarded;
  const bundled=await build({stdin:{contents:`import {handle} from './deployment/legacy-social-metadata/entry.mjs';export default {fetch(request,env){return handle(request,r=>env.ORIGIN.fetch(r));}}`,resolveDir:process.cwd()},bundle:true,format:'esm',platform:'browser',write:false});
  const runtime=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-04',script:bundled.outputFiles[0].text,serviceBindings:{ORIGIN:async request=>{
    forwarded=request;
    const bytes=new TextEncoder().encode(fixture.body);let offset=0;
    const body=new ReadableStream({pull(controller){if(offset===bytes.length){controller.close();return;}const end=Math.min(bytes.length,offset+(fixture.chunk||bytes.length));controller.enqueue(bytes.slice(offset,end));offset=end;}});
    return new Response(request.method==='HEAD'?null:body,{status:fixture.status||200,headers:{'content-type':'text/html; charset=utf-8','cache-control':'private, max-age=60','vary':'*, accept-encoding','etag':'"old"','last-modified':'Sun, 04 Oct 2026 10:00:00 GMT',...fixture.headers}});
  }}}));
  const run=async (f={},path='/physiotherapy',options={})=>{fixture={body:html(),...f};const r=await runtime.dispatchFetch(origin+path,options);const bytes=Buffer.from(await r.arrayBuffer());return {r,bytes,body:bytes.toString('utf8')};};
  try {
    await t.test('franchise canonical cycle is removed with one canonical and preserved content',async()=>{
      const path='/franchise-autism-therapy-center',input=html(path).replace('http://www.pinnacleblooms.org'+path,origin+'/franchises').replaceAll(origin+path,origin+'/franchises').replace('</head>','<link rel="canonical" href="https://mobile.pinnacleblooms.org/franchises"></head>');
      const {r,body}=await run({body:input},path,{headers:{'if-none-match':'"old"','if-modified-since':'Sun, 04 Oct 2026 10:00:00 GMT'}});
      assert(!forwarded.headers.has('if-none-match'));assert(!forwarded.headers.has('if-modified-since'));
      assert.equal(r.status,200);assert.equal((body.match(/rel="canonical"/g)||[]).length,1);assert(body.includes('href="'+origin+path+'"'));assert(body.includes('content="'+origin+path+'"'));assert(body.includes('Approved header'));assert(body.includes('Approved footer'));
    });
    await t.test('all newly covered public templates use the same exact correction and preserve body',async()=>{
      for(const path of ['/t/interactive-song-therapy','/mirracles/123/published-story','/allmirracles','/yoga-therapy','/teachertraining','/teacher-training']){
        const input=html(path);const {body}=await run({body:input,chunk:37},path);assert.equal(body,input.replace('content="http:','content="https:'));
      }
    });
    await t.test('changes only one social URL; Unicode and all body bytes identical',async()=>{
      const {r,body}=await run();assert.equal(body,html().replace('content="http:','content="https:'));assert.equal(r.headers.get('cache-control'),'private, max-age=60');assert.equal(r.headers.get('vary'),'*, accept-encoding');assert.equal(r.headers.get('etag'),null);assert.equal(r.headers.get('last-modified'),null);assert(r.headers.has('x-pinnacle-social-metadata'));
    });
    await t.test('split head and UTF-8 stream boundaries preserve bytes',async()=>{
      const {body}=await run({chunk:7});assert.equal(body,html().replace('content="http:','content="https:'));
    });
    await t.test('BOM-bearing origin bypass preserves every byte',async()=>{
      const input='\ufeff'+html();const {bytes,r}=await run({body:input});assert.deepEqual(bytes,Buffer.from(input));assert.equal(r.headers.get('x-pinnacle-social-metadata'),null);
    });
    await t.test('attribute order/case/quotes and canonical after og:url',async()=>{
      const input=html().replace('<meta property="og:url" content="http://www.pinnacleblooms.org/physiotherapy" />',"<META content='http://www.pinnacleblooms.org/physiotherapy' PROPERTY='OG:URL'>").replace('rel="canonical"','REL="CANONICAL"');
      const {body}=await run({body:input});assert(body.includes('https://www.pinnacleblooms.org/physiotherapy'));assert(!body.includes('http://www'));assert.equal(body.slice(body.indexOf('<body>')),input.slice(input.indexOf('<body>')));
    });
    await t.test('cookie/campaign traffic keeps origin privacy and clean canonical',async()=>{
      const {r,body}=await run({},'/physiotherapy?utm_source=fixture',{headers:{cookie:'consent=1','if-none-match':'"old"','if-modified-since':'Sun, 04 Oct 2026 10:00:00 GMT'}});assert(body.includes('content="https://'));assert.equal(forwarded.headers.get('cookie'),'consent=1');assert.equal(forwarded.headers.get('if-none-match'),null);assert.equal(forwarded.headers.get('if-modified-since'),null);assert.equal(r.headers.get('cache-control'),'private, max-age=60');
    });
    const unchanged=[
      ['already correct',{body:html().replace('content="http:','content="https:')}],
      ['different canonical',{body:html().replace('href="https://www.pinnacleblooms.org/physiotherapy"','href="https://www.pinnacleblooms.org/other"')}],
      ['external canonical',{body:html().replace('href="https://www.pinnacleblooms.org/','href="https://example.org/')}],
      ['duplicate canonical',{body:html().replace('</head>','<link rel="canonical" href="https://www.pinnacleblooms.org/physiotherapy"></head>')}],
      ['duplicate social',{body:html().replace('</head>','<meta property="og:url" content="http://www.pinnacleblooms.org/physiotherapy"></head>')}],
      ['noindex',{body:html().replace('</head>','<meta name="robots" content="noindex"></head>')}],
      ['header noindex',{headers:{'x-robots-tag':'noindex'}}],
      ['set-cookie',{headers:{'set-cookie':'private=1; Secure'}}],
      ['no-store',{headers:{'cache-control':'private, no-store'}}],
      ['no-transform',{headers:{'cache-control':'no-transform'}}],
      ['JSON response',{headers:{'content-type':'application/json'}}],
      ['different charset',{headers:{'content-type':'text/html; charset=iso-8859-1'}}],
      ['404',{status:404}],['500',{status:500}],
      ['missing head',{body:'<html><body>Unchanged</body></html>'}],
      ['oversized head',{body:html().replace('<title>','<!--'+ 'x'.repeat(66000)+'--><title>')}],
      ['lookalike comment',{body:html().replace('<link rel="canonical"','<!-- <link rel="canonical"').replace('/physiotherapy" /></head>','/physiotherapy" /> --></head>')}]
    ];
    for(const [name,f] of unchanged) await t.test('pass-through: '+name,async()=>{const {body,r}=await run(f);assert.equal(body,f.body||html());assert.equal(r.headers.get('x-pinnacle-social-metadata'),null);assert.equal(r.status,f.status||200);});
    for(const headers of [{authorization:'Bearer fixture'},{range:'bytes=0-99'}]) await t.test('sensitive request bypass '+Object.keys(headers)[0],async()=>{const {body}=await run({},'/physiotherapy',{headers});assert.equal(body,html());});
    await t.test('unknown neighboring URL is untouched',async()=>{const {body}=await run({},'/physiotherapy-other');assert.equal(body,html());});
    await t.test('captured mixed-case course identity keeps its lowercase canonical and repairs its exact image',async()=>{
      const input=html('/courses/466/afraid').replace('</main>','<img src="/Assets/Materials/20707165343.jpg"></main>');
      for(const path of ['/courses/466/Afraid','/courses/466/afraid']){const {body}=await run({body:input},path);assert(body.includes('content="https://www.pinnacleblooms.org/courses/466/afraid"'));assert(body.includes('data-pinnacle-brand-fallback'));assert(body.includes('href="https://www.pinnacleblooms.org/courses/466/afraid"'));}
      const {body}=await run({body:input},'/courses/999/Afraid');assert.equal(body,input);
    });
    await t.test('campaign-copied metadata is repaired across the existing families without losing attribution',async()=>{
      for(const path of ['/physiotherapy','/t/interactive-song-therapy','/skills/communication','/staff/k-anusree/4767','/top-autism-therapy-services-india-proven-improvement-rate']){
        const query='?utm_source=pitchbox&utm_medium=email&utm_campaign=parent-guide&gclid=sample';
        const input=html(path+query), {body,r}=await run({body:input},path+query,{headers:{cookie:'consent=1'}});
        assert(body.includes('href="'+origin+path+'"'));assert(body.includes('content="'+origin+path+'"'));
        assert.equal(body.slice(body.indexOf('<body>')),input.slice(input.indexOf('<body>')));
        assert.equal(new URL(forwarded.url).search,query);assert.equal(forwarded.headers.get('cookie'),'consent=1');
        assert.equal(r.headers.get('cache-control'),'private, max-age=60');
      }
    });
    await t.test('unknown, functional and mismatched canonical query choices remain untouched',async()=>{
      for(const query of ['?page=2','?q=child','?utm_source=pitchbox&page=2','?utm_custom=unknown']){
        const input=html('/physiotherapy'+query),{body}=await run({body:input},'/physiotherapy'+query);assert.equal(body,input);
      }
      const input=html('/physiotherapy?utm_source=other');
      assert.equal((await run({body:input},'/physiotherapy?utm_source=pitchbox')).body,input);
    });
    await t.test('HEAD/POST retain origin method and body behavior',async()=>{
      const head=await run({},'/physiotherapy',{method:'HEAD'});assert.equal(head.body,'');assert.equal(forwarded.method,'HEAD');
      const post=await run({},'/faq',{method:'POST',body:'fixture'});assert.equal(post.body,html());assert.equal(forwarded.method,'POST');
    });
    await t.test('mixed-case numeric staff URLs retain their recorded lowercase identity and repair missing media',async()=>{
      const path='/staff/K-Anusree/4767',canonical='/staff/k-anusree/4767';
      const input=html(canonical).replace('</main>','<img src="/Images/ProfileImages/3549649944.jpg"></main>');
      const {r,body}=await run({body:input},path);assert.equal(r.status,200);assert(body.includes('content="'+origin+canonical+'"'));assert(body.includes('data-pinnacle-brand-fallback'));assert(body.includes('Approved header'));assert(body.includes('Approved footer'));
      for(const other of ['/staff/different-person/4767','/staff/k-anusree/999999']){const unknown=input.replaceAll(canonical,other);const result=await run({body:unknown},path);assert.equal(result.body,unknown);}
    });
    await t.test('linked physiotherapy aliases redirect to canonical with exact query retained',async()=>{
      for(const path of ['/physio-therapy','/physio-therapy/','/physio-therapy?utm_source=site&x=%2F']){
        const {r,body}=await run({},path,{redirect:'manual'});
        assert.equal(r.status,301);assert.equal(body,'');assert.equal(r.headers.get('location'),origin+'/physiotherapy'+new URL(origin+path).search);
      }
      const {r}=await run({},'/physio-therapy',{method:'HEAD',redirect:'manual'});assert.equal(r.status,301);
    });
    await t.test('alias redirect preserves unknown paths and protected request behavior',async()=>{
      for(const [path,options]of [['/physio-therapy-other',{}],['/physio-therapy/subpage',{}],['/physio-therapy',{method:'POST',body:'retain'}],['/physio-therapy',{headers:{authorization:'Bearer fixture'}}],['/physio-therapy',{headers:{range:'bytes=0-10'}}]]){
        const {r,body}=await run({},path,options);assert.equal(r.status,200);assert.equal(body,html());assert.equal(r.headers.get('location'),null);
      }
    });
    const servicesPath='/top-autism-therapy-services-india-proven-improvement-rate';
    const serviceHtml=()=>html(servicesPath).replaceAll('www.pinnacleblooms.org','books.pinnacleblooms.org').replace('</main>','<a href="/physio-therapy">Movement</a><a href="/physio-therapy/#why-section">Why</a><a href="/physio-therapy?from=services#why-section">More</a><a href="/physio-therapy-other">Unchanged</a></main>');
    await t.test('services hub repairs only known host identity and existing physiotherapy hrefs',async()=>{
      const input=serviceHtml();const {r,body}=await run({body:input,chunk:7},servicesPath);
      assert.equal(body,input.replace('content="http://books.pinnacleblooms.org','content="https://www.pinnacleblooms.org').replace('href="https://books.pinnacleblooms.org','href="https://www.pinnacleblooms.org').replace('href="/physio-therapy"','href="/physiotherapy"').replace('href="/physio-therapy/#','href="/physiotherapy#').replace('href="/physio-therapy?','href="/physiotherapy?'));
      assert.equal(r.headers.get('x-pinnacle-legacy-payload'),null);
    });
    await t.test('services ignores unrecognised canonical and protected responses',async()=>{
      for(const f of [{body:serviceHtml().replaceAll('books.pinnacleblooms.org','unknown.pinnacleblooms.org')},{body:serviceHtml(),status:500},{body:serviceHtml(),headers:{'cache-control':'no-store'}},{body:serviceHtml(),headers:{'set-cookie':'session=fixture'}}]){
        const {body,r}=await run(f,servicesPath);assert.equal(body,f.body);assert.equal(r.headers.get('x-pinnacle-social-metadata'),null);
      }
    });
    if(process.env.LEGACY_SOCIAL_FIXTURE) await t.test('captured live origin changes only the intended metadata value',async()=>{
      const input=await fs.readFile(process.env.LEGACY_SOCIAL_FIXTURE,'utf8');const {body}=await run({body:input});assert.equal(body,input.replace('content="http://www.pinnacleblooms.org/physiotherapy"','content="https://www.pinnacleblooms.org/physiotherapy"'));
    });
  } finally {await runtime.dispose();}
});
