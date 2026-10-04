import test from 'node:test';import assert from 'node:assert/strict';
import {ANNANAGAR_URL,ANNANAGAR_MARKUP,alignAnnaNagarIdentity,reviseAnnaNagarHtml,transformAnnaNagar} from '../deployment/centre-search-repair/annanagar.mjs';
import {handle} from '../deployment/centre-search-repair/entry.mjs';
const fixture='<!doctype html><html><head><title>Old title</title><meta name="twitter:title" content="Old title"><meta name="twitter:description" content="Old description"><meta name="description" content="Old description"><meta property="og:title" content="Old title"><meta property="og:description" content="Old description"><link rel="canonical" href="'+ANNANAGAR_URL+'"></head><body><header>Existing menu</header><img src="/Images/ProfileImages/20708282153.jpg"><div class="center-about-description"><h1>Autism and Therapy Support in Anna Nagar, Chennai</h1><p>Old copy.</p></div><section>Keep people, media and reviews</section><footer>Existing footer</footer></body></html>';
const response=(html=fixture,headers={})=>new Response(html,{headers:{'content-type':'text/html','cache-control':'public, max-age=14400',...headers}});
test('new local journey replaces only intro and declared metadata',()=>{
 const next=reviseAnnaNagarHtml(fixture);assert(next.includes(ANNANAGAR_MARKUP));assert(next.includes('Autism &amp; Speech Therapy in Anna Nagar, Chennai | Pinnacle Blooms'));assert(next.includes('<header>Existing menu</header>'));assert(next.endsWith('<section>Keep people, media and reviews</section><footer>Existing footer</footer></body></html>'));
 assert.equal(reviseAnnaNagarHtml(next),next);assert.equal((next.match(/<h1>/g)||[]).length,1);
 assert(next.includes('service=help&amp;centre=annanagar'));assert(!next.includes('entry=speech-assessment'));
 assert(next.includes('<meta name="twitter:title" content="Autism &amp; Speech Therapy in Anna Nagar, Chennai | Pinnacle Blooms">'));assert(!next.includes('Old description'));assert(next.includes('tel:+919100181181'));assert(next.includes('speech-and-language-therapy-sessions'));
});
for(const [name,html]of [['other identity',fixture.replace('20708282153','other')],['unknown canonical',fixture.replace(ANNANAGAR_URL,ANNANAGAR_URL+'-other')],['ambiguous intro',fixture.replace('<footer>','<div class="center-about-description"><h1>AnnaNagar</h1></div><footer>')],['noindex',fixture.replace('</head>','<meta name="robots" content="noindex"></head>')]])test(name+' remains untouched',()=>assert.equal(reviseAnnaNagarHtml(html),null));
for(const headers of [{'cache-control':'private, no-store'},{'set-cookie':'session=private'},{vary:'Cookie'},{'x-robots-tag':'noindex'}])test('private/excluded response preserved '+JSON.stringify(headers),async()=>{const r=response(fixture,headers);assert.equal(await transformAnnaNagar(new Request(ANNANAGAR_URL),r),r)});
for(const [label,headers]of [['ordinary',{}],['analytics cookie',{cookie:'_ga=known-test'}],['stale validator',{'if-none-match':'old'}]])test(label+' sees updated GET and matching bodyless HEAD',async()=>{
 let sent;const fetcher=async request=>{sent=request;return response(fixture,{'content-length':String(fixture.length),etag:'old'})};
 const result=await handle(new Request(ANNANAGAR_URL,{headers}),fetcher);assert((await result.text()).includes('pinnacle-annanagar-start'));assert.equal(result.headers.get('etag'),null);assert.equal(sent.headers.get('if-none-match'),null);
 assert.equal(result.headers.get('cache-control'),headers.cookie?'private, no-store, max-age=0':'public, max-age=60');
 const head=await handle(new Request(ANNANAGAR_URL,{method:'HEAD',headers}),fetcher);assert.equal(await head.text(),'');assert.equal(head.headers.get('x-pinnacle-local-journey'),'annanagar-parent-journey-20261004');
});
test('tracking query receives the same public content without dropping URL',async()=>{let sent;const result=await handle(new Request(ANNANAGAR_URL+'?utm_source=qa'),async r=>{sent=r;return response()});assert((await result.text()).includes(ANNANAGAR_MARKUP));assert(sent.url.endsWith('?utm_source=qa'))});
test('legacy tracking canonical becomes clean, functional query remains untouched',()=>{const tagged=fixture.replace('href="'+ANNANAGAR_URL+'"','href="'+ANNANAGAR_URL+'?utm_source=qa&amp;gclid=test"');const out=reviseAnnaNagarHtml(tagged);assert(out.includes('<link rel="canonical" href="'+ANNANAGAR_URL+'">'));assert(out.includes(ANNANAGAR_MARKUP));assert.equal(reviseAnnaNagarHtml(fixture.replace('href="'+ANNANAGAR_URL+'"','href="'+ANNANAGAR_URL+'?account=1"')),null);});
test('functional query passes through unchanged',async()=>{const r=response();assert.equal(await handle(new Request(ANNANAGAR_URL+'?account=1'),async()=>r),r)});
for(const request of [new Request(ANNANAGAR_URL,{method:'POST',body:'do not submit'}),new Request(ANNANAGAR_URL,{headers:{authorization:'Bearer fixture'}}),new Request(ANNANAGAR_URL,{headers:{range:'bytes=0-30'}}),new Request(ANNANAGAR_URL,{headers:{'cache-control':'no-transform'}}),new Request(ANNANAGAR_URL+'-other')])test('unsupported request passes through '+request.method+' '+request.url+' '+[...request.headers.keys()].join(','),async()=>{const r=response();const out=await handle(request,async()=>r);assert.equal(out,r)});

test('parent-facing punctuation and brand marks are intact UTF-8',()=>{assert(ANNANAGAR_MARKUP.includes('child\u2019s'));assert(ANNANAGAR_MARKUP.includes('PinnacleAI\u00ae'));assert(!/[\u00c2\u00c3\u00e2][\u0080-\u00ff\u2000-\u2122]/.test(ANNANAGAR_MARKUP));});


test('only the matched Anna Nagar entity is corrected; copied review and credentials removed',()=>{
 const node={'@type':'LocalBusiness','@id':ANNANAGAR_URL,url:ANNANAGAR_URL,name:'Pinnacle Autism Therapy – Begumpet II',image:'https://www.pinnacleblooms.org/Images/ProfileImages/20708282153.jpg',address:{streetAddress:'Gokulam Sabari, Anna Nagar',addressLocality:'Begumpet II',postalCode:'600040'},review:[{reviewBody:'Suchitra review'}],hasCredential:[{name:'copied credential'}]};
 const script=n=>'<script type="application/ld+json">'+JSON.stringify(n)+'</script>';
 const foreign=script({...node,'@id':'https://example.org/other'});
 const result=alignAnnaNagarIdentity(script(node)+foreign);
 const fixed=JSON.parse(result.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]);
 assert.equal(fixed.name,'Pinnacle Blooms Network — Anna Nagar, Chennai');assert.equal(fixed.address.addressLocality,'Anna Nagar, Chennai');assert.equal(fixed.telephone,'+919100181181');assert(!fixed.review);assert(!fixed.hasCredential);assert(result.endsWith(foreign));
 assert.equal(alignAnnaNagarIdentity(script({...node,image:'other.jpg'})),script({...node,image:'other.jpg'}));
});
test('legacy WebPage agrees with canonical; existing matching map has accessible anchor',()=>{
 const page='<script type="application/ld+json">'+JSON.stringify({'@type':'WebPage',url:ANNANAGAR_URL.replace('https:','http:'),name:'old'})+'</script>';
 const map='<iframe src="https://www.google.com/maps/embed?pb=13.085229590781427"></iframe>';
 const other='<iframe src="https://www.google.com/maps/embed?other"></iframe>';
 const out=alignAnnaNagarIdentity(page+map+other);assert(out.includes('"url":"'+ANNANAGAR_URL+'"'));assert(out.includes('id="annanagar-centre-map"'));assert(out.includes('title="Anna Nagar centre location map"'));assert(out.endsWith(other));assert.equal(alignAnnaNagarIdentity(out),out);assert(ANNANAGAR_MARKUP.includes('href="#annanagar-centre-map"'));
});

// The origin serves a nested introduction to mobile user agents. Viewport alone is insufficient.
test('actual mobile template gets the approved journey and retains original video',()=>{
 const video='<div class="youtube-container" style="padding-bottom: 57%;"><iframe src="https://www.youtube.com/embed/71610XG2tPM" allowfullscreen></iframe></div>';
 const mobile=fixture.replace(/<div class="center-about-description">[\s\S]*?<\/div>/,'<div class="center-about-description"><h1>Anna Nagar</h1><div class="pinncle-round">'+video+'<p>Original mobile introduction.</p></div></div>');
 const out=reviseAnnaNagarHtml(mobile);assert(out?.includes(ANNANAGAR_MARKUP));assert(out.includes('data-preserved-centre-video="71610XG2tPM"'));assert(out.includes('loading="lazy"'));assert(out.includes('allowfullscreen'));assert.equal((out.match(/<iframe/g)||[]).length,1);assert.equal(reviseAnnaNagarHtml(out),out);
 assert.equal(reviseAnnaNagarHtml(mobile.replace('71610XG2tPM','wrong000000')),null);
});
