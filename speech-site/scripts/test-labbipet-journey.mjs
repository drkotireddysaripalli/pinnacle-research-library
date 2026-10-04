import test from 'node:test';import assert from 'node:assert/strict';
import {LABBIPET_URL,LABBIPET_MARKUP,alignLabbipetPostalCode,reviseLabbipetHtml,transformLabbipet} from '../deployment/centre-search-repair/labbipet.mjs';
import {handle} from '../deployment/centre-search-repair/entry.mjs';
const fixture='<!doctype html><html><head><title>Old title</title><meta name="twitter:title" content="Old title"><meta name="twitter:description" content="Old description"><meta name="description" content="Old description"><meta property="og:title" content="Old title"><meta property="og:description" content="Old description"><link rel="canonical" href="'+LABBIPET_URL+'"></head><body><header>Existing menu</header><img src="/Images/ProfileImages/3062523180.jpg"><div class="center-about-description"><h1>Autism and Therapy Support in Labbipet, Vijayawada</h1><p>Old copy.</p></div><section>Keep people, media and reviews</section><footer>Existing footer</footer></body></html>';
const response=(html=fixture,headers={})=>new Response(html,{headers:{'content-type':'text/html','cache-control':'public, max-age=14400',...headers}});
test('new local journey replaces only intro and declared metadata',()=>{
 const next=reviseLabbipetHtml(fixture);assert(next.includes(LABBIPET_MARKUP));assert(next.includes('Autism &amp; Speech Therapy in Labbipet, Vijayawada | Pinnacle Blooms'));assert(next.includes('<header>Existing menu</header>'));assert(next.endsWith('<section>Keep people, media and reviews</section><footer>Existing footer</footer></body></html>'));
 assert.equal(reviseLabbipetHtml(next),next);assert.equal((next.match(/<h1>/g)||[]).length,1);
 assert(next.includes('service=help&amp;centre=labbipet'));assert(!next.includes('entry=speech-assessment'));
 assert(next.includes('<meta name="twitter:title" content="Autism &amp; Speech Therapy in Labbipet, Vijayawada | Pinnacle Blooms">'));assert(!next.includes('Old description'));assert(next.includes('tel:+919100181181'));assert(next.includes('speech-and-language-therapy-sessions'));
});
for(const [name,html]of [['other identity',fixture.replace('3062523180','other')],['unknown canonical',fixture.replace(LABBIPET_URL,LABBIPET_URL+'-other')],['ambiguous intro',fixture.replace('<footer>','<div class="center-about-description"><h1>Labbipet</h1></div><footer>')],['noindex',fixture.replace('</head>','<meta name="robots" content="noindex"></head>')]])test(name+' remains untouched',()=>assert.equal(reviseLabbipetHtml(html),null));
for(const headers of [{'cache-control':'private, no-store'},{'set-cookie':'session=private'},{vary:'Cookie'},{'x-robots-tag':'noindex'}])test('private/excluded response preserved '+JSON.stringify(headers),async()=>{const r=response(fixture,headers);assert.equal(await transformLabbipet(new Request(LABBIPET_URL),r),r)});
for(const [label,headers]of [['ordinary',{}],['analytics cookie',{cookie:'_ga=known-test'}],['stale validator',{'if-none-match':'old'}]])test(label+' sees updated GET and matching bodyless HEAD',async()=>{
 let sent;const fetcher=async request=>{sent=request;return response(fixture,{'content-length':String(fixture.length),etag:'old'})};
 const result=await handle(new Request(LABBIPET_URL,{headers}),fetcher);assert((await result.text()).includes('pinnacle-labbipet-start'));assert.equal(result.headers.get('etag'),null);assert.equal(sent.headers.get('if-none-match'),null);
 assert.equal(result.headers.get('cache-control'),headers.cookie?'private, no-store, max-age=0':'public, max-age=60');
 const head=await handle(new Request(LABBIPET_URL,{method:'HEAD',headers}),fetcher);assert.equal(await head.text(),'');assert.equal(head.headers.get('x-pinnacle-local-journey'),'labbipet-parent-journey-20261004');
});
test('tracking query receives the same public content without dropping URL',async()=>{let sent;const result=await handle(new Request(LABBIPET_URL+'?utm_source=qa'),async r=>{sent=r;return response()});assert((await result.text()).includes(LABBIPET_MARKUP));assert(sent.url.endsWith('?utm_source=qa'))});
test('legacy tracking canonical becomes clean, functional query remains untouched',()=>{const tagged=fixture.replace('href="'+LABBIPET_URL+'"','href="'+LABBIPET_URL+'?utm_source=qa&amp;gclid=test"');const out=reviseLabbipetHtml(tagged);assert(out.includes('<link rel="canonical" href="'+LABBIPET_URL+'">'));assert(out.includes(LABBIPET_MARKUP));assert.equal(reviseLabbipetHtml(fixture.replace('href="'+LABBIPET_URL+'"','href="'+LABBIPET_URL+'?account=1"')),null);});
test('functional query passes through unchanged',async()=>{const r=response();assert.equal(await handle(new Request(LABBIPET_URL+'?account=1'),async()=>r),r)});
for(const request of [new Request(LABBIPET_URL,{method:'POST',body:'do not submit'}),new Request(LABBIPET_URL,{headers:{authorization:'Bearer fixture'}}),new Request(LABBIPET_URL,{headers:{range:'bytes=0-30'}}),new Request(LABBIPET_URL,{headers:{'cache-control':'no-transform'}}),new Request(LABBIPET_URL+'-other')])test('unsupported request passes through '+request.method+' '+request.url+' '+[...request.headers.keys()].join(','),async()=>{const r=response();const out=await handle(request,async()=>r);assert.equal(out,r)});

test('parent-facing punctuation and brand marks are intact UTF-8',()=>{assert(LABBIPET_MARKUP.includes('child\u2019s'));assert(LABBIPET_MARKUP.includes('PinnacleAI\u00ae'));assert(!/[\u00c2\u00c3\u00e2][\u0080-\u00ff\u2000-\u2122]/.test(LABBIPET_MARKUP));});

const localSchema={"@context":"https://schema.org","@type":"LocalBusiness","@id":LABBIPET_URL,url:LABBIPET_URL,address:{"@type":"PostalAddress",streetAddress:"Door No 39-9-7, Temple Street, Labbi Pet, Vijayawada, Andhra pradesh-520007",postalCode:"520010"}};
const script=data=>'<script type="application/ld+json">'+JSON.stringify(data)+'</script>';
test('only the exact Labbipet entity and Temple Street postcode reconcile',()=>{
 const expected=script({...localSchema,address:{...localSchema.address,postalCode:'520007'}});
 assert.equal(alignLabbipetPostalCode(script(localSchema)),expected);
 assert.equal(alignLabbipetPostalCode(expected),expected);
 for(const other of [{...localSchema,'@id':LABBIPET_URL+'-other'},{...localSchema,address:{...localSchema.address,streetAddress:'Other centre'}},{...localSchema,'@type':'Organization'}])assert.equal(alignLabbipetPostalCode(script(other)),script(other));
});
