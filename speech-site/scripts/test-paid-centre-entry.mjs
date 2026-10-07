import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {isPaidCentreRequest,paidCentreConfig,paidCentreMarkup,PAID_CENTRES} from '../deployment/centre-search-repair/paid-centre-entry.mjs';
const path=Object.keys(PAID_CENTRES)[0],url='https://www.pinnacleblooms.org'+path;
const fixture='<html><head><script type="application/ld+json">{"@type":"Place","name":"Guntur"}</script></head><body><header>Approved navigation</header><section class="center-holder"><section class="video-section"><img src="/Images/ProfileImages/3062527489.jpg"></section><div class="center-about-description"><h1>Old Guntur heading</h1><iframe src="https://www.youtube.com/embed/uhiaPvi0ljI"></iframe><p>Original centre narrative</p></div><form><input name="phone"></form></section><footer>Approved footer</footer><script>originalTag()</script></body></html>';
test('only exact public paid centre routes and recognised tracking keys qualify',()=>{
 for(const method of ['GET','HEAD'])assert.ok(isPaidCentreRequest(new Request(url+'?utm_content=speech&gclid=example&gad_source=1&gad_campaignid=123',{method})));
 for(const candidate of [url+'/','https://pinnacleblooms.org'+path,url+'?private=1',url.replace('guntur','delhi')])assert.equal(isPaidCentreRequest(new Request(candidate)),false);
 for(const init of [{method:'POST'},{headers:{authorization:'Bearer example'}},{headers:{range:'bytes=0-10'}}])assert.equal(isPaidCentreRequest(new Request(url,init)),false);
});
test('service values are exact allowlisted constants and malicious/prototype input stays general',()=>{
 for(const value of ['<script>bad</script>','__proto__','constructor','not-speech'])assert.equal(paidCentreConfig(new Request(url+'?utm_content='+encodeURIComponent(value))).service,'help');
 const c=paidCentreConfig(new Request(url+'?utm_content=speech'));assert.equal(c.service,'speech');const html=paidCentreMarkup(c);assert.match(html,/Speech therapy in Guntur/);assert.match(html,/service=speech&amp;centre=guntur/);assert.doesNotMatch(html,/gclid|utm_content/);
});
const source=fs.readFileSync(new URL('../deployment/centre-search-repair/paid-centre-entry.mjs',import.meta.url),'utf8');
const mf=new Miniflare(convertV4MiniflareOptions({modules:[{type:'ESModule',path:'worker.mjs',contents:`import {transformPaidCentre} from './paid.mjs';export default{async fetch(req){const html=await req.text();const headers=JSON.parse(req.headers.get('x-fixture-headers')||'{}');const init=JSON.parse(req.headers.get('x-request-init')||'{}');const request=new Request('${url}',init);return transformPaidCentre(request,new Response(html,{status:Number(req.headers.get('x-fixture-status')||200),headers:{'content-type':'text/html',...headers}}));}}`},{type:'ESModule',path:'paid.mjs',contents:source}],compatibilityDate:'2026-09-22'}));
test.after(()=>mf.dispose());
const run=(html=fixture,headers={},init={},status=200)=>mf.dispatchFetch('http://fixture/',{method:'POST',headers:{'x-fixture-headers':JSON.stringify(headers),'x-request-init':JSON.stringify(init),'x-fixture-status':String(status)},body:html});
test('real Worker parser inserts before video, preserves body/form/schema/tags and defers YouTube',async()=>{
 const r=await run();const html=await r.text();assert.match(r.headers.get('x-pinnacle-paid-centre-entry'),/20261007/);assert.ok(html.indexOf('id="pinnacle-centre-entry"')<html.indexOf('class="video-section"'));assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.match(html,/<h2>About Pinnacle Guntur<\/h2>/);assert.match(html,/Original centre narrative/);assert.match(html,/<form><input name="phone"><\/form>/);assert.match(html,/Approved navigation/);assert.match(html,/Approved footer/);assert.match(html,/originalTag\(\)/);assert.match(html,/"@type":"Place"/);assert.match(html,/data-paid-centre-video="uhiaPvi0ljI"/);assert.doesNotMatch(html,/<iframe[^>]*youtube/);
});
test('real Worker keeps unknown/private/error/non-HTML responses and changed source untouched',async()=>{
 for(const headers of [{'set-cookie':'private=yes'},{'cache-control':'private, no-store'},{'cache-control':'no-transform'},{vary:'Cookie'},{'x-robots-tag':'noindex'},{'content-type':'application/json'}])assert.equal(await(await run(fixture,headers)).text(),fixture);
 for(const changed of [fixture.replace('3062527489','different'),fixture.replace('class="center-holder"','class="unknown"'),fixture.replace('<h1>','<h1>duplicate</h1><h1>'),fixture.replace('<body>','<body><section id="pinnacle-centre-entry"></section>')])assert.equal(await(await run(changed)).text(),changed);
 assert.equal(await(await run(fixture,{}, {},503)).text(),fixture);
});
test('cookie-bearing transformed responses remain private and stale validators are removed',async()=>{
 const r=await run(fixture,{etag:'old','content-length':'1'},{headers:{cookie:'returning=yes'}});assert.equal(r.headers.get('cache-control'),'private, no-store');assert.equal(r.headers.get('etag'),null);assert.equal(r.headers.get('content-length'),null);
});
