import test from 'node:test';import assert from 'node:assert/strict';
import {KUKATPALLY_URL,KUKATPALLY_MARKUP,reviseKukatpallyHtml,transformKukatpally} from '../deployment/centre-search-repair/kukatpally.mjs';
import {handle} from '../deployment/centre-search-repair/entry.mjs';
const fixture='<!doctype html><html><head><title>Old title</title><meta name="description" content="Old description"><meta property="og:title" content="Old title"><meta property="og:description" content="Old description"><link rel="canonical" href="'+KUKATPALLY_URL+'"></head><body><header>Existing menu</header><img src="/Images/ProfileImages/3062523056.jpg"><div class="center-about-description"><h1>Autism and Therapy Support in Kukatpally, Hyderabad</h1><p>Old copy.</p></div><section>Keep people, media and reviews</section><footer>Existing footer</footer></body></html>';
const response=(html=fixture,headers={})=>new Response(html,{headers:{'content-type':'text/html','cache-control':'public, max-age=14400',...headers}});
test('new local journey replaces only intro and declared metadata',()=>{
 const next=reviseKukatpallyHtml(fixture);assert(next.includes(KUKATPALLY_MARKUP));assert(next.includes('Speech Therapy in Kukatpally, Hyderabad | Pinnacle Blooms'));assert(next.includes('<header>Existing menu</header>'));assert(next.endsWith('<section>Keep people, media and reviews</section><footer>Existing footer</footer></body></html>'));
 assert.equal(reviseKukatpallyHtml(next),next);assert.equal((next.match(/<h1>/g)||[]).length,1);
 assert(next.includes('service=speech&amp;centre=kukatpally'));assert(!next.includes('entry=speech-assessment'));
 assert(next.includes('tel:+919100181181'));assert(next.includes('speech-and-language-therapy-sessions'));
});
for(const [name,html]of [['other identity',fixture.replace('3062523056','other')],['unknown canonical',fixture.replace(KUKATPALLY_URL,KUKATPALLY_URL+'-other')],['ambiguous intro',fixture.replace('<footer>','<div class="center-about-description"><h1>Kukatpally</h1></div><footer>')],['noindex',fixture.replace('</head>','<meta name="robots" content="noindex"></head>')]])test(name+' remains untouched',()=>assert.equal(reviseKukatpallyHtml(html),null));
for(const headers of [{'cache-control':'private, no-store'},{'set-cookie':'session=private'},{vary:'Cookie'},{'x-robots-tag':'noindex'}])test('private/excluded response preserved '+JSON.stringify(headers),async()=>{const r=response(fixture,headers);assert.equal(await transformKukatpally(new Request(KUKATPALLY_URL),r),r)});
for(const [label,headers]of [['ordinary',{}],['analytics cookie',{cookie:'_ga=known-test'}],['stale validator',{'if-none-match':'old'}]])test(label+' sees updated GET and matching bodyless HEAD',async()=>{
 let sent;const fetcher=async request=>{sent=request;return response(fixture,{'content-length':String(fixture.length),etag:'old'})};
 const result=await handle(new Request(KUKATPALLY_URL,{headers}),fetcher);assert((await result.text()).includes('pinnacle-kukatpally-start'));assert.equal(result.headers.get('etag'),null);assert.equal(sent.headers.get('if-none-match'),null);
 assert.equal(result.headers.get('cache-control'),headers.cookie?'private, no-store, max-age=0':'public, max-age=60');
 const head=await handle(new Request(KUKATPALLY_URL,{method:'HEAD',headers}),fetcher);assert.equal(await head.text(),'');assert.equal(head.headers.get('x-pinnacle-local-journey'),'kukatpally-parent-journey-20261004');
});
test('tracking query receives the same public content without dropping URL',async()=>{let sent;const result=await handle(new Request(KUKATPALLY_URL+'?utm_source=qa'),async r=>{sent=r;return response()});assert((await result.text()).includes(KUKATPALLY_MARKUP));assert(sent.url.endsWith('?utm_source=qa'))});
test('legacy tracking canonical becomes clean, functional query remains untouched',()=>{const tagged=fixture.replace('href="'+KUKATPALLY_URL+'"','href="'+KUKATPALLY_URL+'?utm_source=qa&amp;gclid=test"');const out=reviseKukatpallyHtml(tagged);assert(out.includes('<link rel="canonical" href="'+KUKATPALLY_URL+'">'));assert(out.includes(KUKATPALLY_MARKUP));assert.equal(reviseKukatpallyHtml(fixture.replace('href="'+KUKATPALLY_URL+'"','href="'+KUKATPALLY_URL+'?account=1"')),null);});
test('functional query passes through unchanged',async()=>{const r=response();assert.equal(await handle(new Request(KUKATPALLY_URL+'?account=1'),async()=>r),r)});
for(const request of [new Request(KUKATPALLY_URL,{method:'POST',body:'do not submit'}),new Request(KUKATPALLY_URL,{headers:{authorization:'Bearer fixture'}}),new Request(KUKATPALLY_URL,{headers:{range:'bytes=0-30'}}),new Request(KUKATPALLY_URL,{headers:{'cache-control':'no-transform'}}),new Request(KUKATPALLY_URL+'-other')])test('unsupported request passes through '+request.method+' '+request.url+' '+[...request.headers.keys()].join(','),async()=>{const r=response();const out=await handle(request,async()=>r);assert.equal(out,r)});

// The origin serves a nested introduction to mobile user agents. Viewport alone is insufficient.
test('actual mobile template gets the approved journey and retains original video',()=>{
 const video='<div class="youtube-container" style="padding-bottom: 57%;"><iframe src="https://www.youtube.com/embed/UakQCuEIjQY" allowfullscreen></iframe></div>';
 const mobile=fixture.replace(/<div class="center-about-description">[\s\S]*?<\/div>/,'<div class="center-about-description"><h1>Kukatpally</h1><div class="pinncle-round">'+video+'<p>Original mobile introduction.</p></div></div>');
 const out=reviseKukatpallyHtml(mobile);assert(out?.includes(KUKATPALLY_MARKUP));assert(out.includes('data-preserved-centre-video="UakQCuEIjQY"'));assert(out.includes('loading="lazy"'));assert(out.includes('allowfullscreen'));assert.equal((out.match(/<iframe/g)||[]).length,1);assert.equal(reviseKukatpallyHtml(out),out);
 assert.equal(reviseKukatpallyHtml(mobile.replace('UakQCuEIjQY','wrong000000')),null);
});
