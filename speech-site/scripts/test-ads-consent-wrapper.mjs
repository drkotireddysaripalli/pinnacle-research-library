import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import worker from '../workers/google-ads-call-measurement/index.mjs';
const origin='https://www.pinnacleblooms.org',script='/pinnacle-pages-scripts/google-ads-call.js?v=4';
const html='<html><head><title>Unchanged</title></head><body><header>Header</header><main><a href="tel:+919100181181">9100 181 181</a></main><footer>Footer</footer></body></html>';
const env={PINNACLE_VERIFY:{fetch:async()=>new Response(html,{headers:{'content-type':'text/html'}})}};
test('served bootstrap is exactly the shared module without exports',async()=>{
 const source=await(await worker.fetch(new Request(origin+script),env)).text();
 const canonical=(await fs.readFile('src/lib/google-ads-call-consent.mjs','utf8')).replace(/^export /gm,'');
 assert.equal(source,canonical);assert(!source.includes('__name('));
});
test('five measured pages retain content and receive one automatic bootstrap without controls',async()=>{
 for(const p of ['/top-speech-therapy-center-india-proven-improvement-rate','/speech-therapy/service-information','/verify/guides/everyday-practice.html','/verify/guides/abilityscore.html','/verify/evidence/pinnacle-paradigm-shift.html']){
  const r=await worker.fetch(new Request(origin+p),env),t=await r.text();
  assert.equal(r.headers.get('x-pinnacle-google-ads-call-measurement'),'v4-call-measurement');
  assert.equal((t.match(/google-ads-call.js\?v=4/g)||[]).length,1);assert(!t.includes('gtag/js?id='));
  assert(t.includes('<main><a href="tel:+919100181181">9100 181 181</a></main><footer>Footer'));
  assert.equal((t.match(/data-ad-call-preferences/g)||[]).length,0);
  assert.equal(t.includes('data-pinnacle-mobile-call-cta'),p.startsWith('/verify/'));
  const again={PINNACLE_VERIFY:{fetch:async()=>new Response(t,{headers:{'content-type':'text/html'}})}};
  const twice=await(await worker.fetch(new Request(origin+p),again)).text();assert.equal(twice,t);
 }
});
test('unrelated paths, non-HTML, non-success and POST pass through',async()=>{
 assert.equal(await(await worker.fetch(new Request(origin+'/untouched'),env)).text(),html);
 for(const [method,status,type] of [['POST',200,'text/html'],['GET',404,'text/html'],['GET',200,'application/json']]){
  const e={PINNACLE_VERIFY:{fetch:async()=>new Response('original',{status,headers:{'content-type':type}})}};
  const r=await worker.fetch(new Request(origin+'/speech-therapy/service-information',{method}),e);assert.equal(r.status,status);assert.equal(await r.text(),'original');
 }
});
test('bootstrap HEAD and method controls retained',async()=>{
 assert.equal(await(await worker.fetch(new Request(origin+script,{method:'HEAD'}),env)).text(),'');
 assert.equal((await worker.fetch(new Request(origin+script,{method:'POST'}),env)).status,405);
});
test('Verify reader uses the current independent consent source on the three wrapper pages',async()=>{
 const reader=await(await worker.fetch(new Request(origin+script+'&module=verify-reader'),env)).text();
 assert.equal(reader,await fs.readFile('../verify-site/dist/reader-extras.js','utf8'));
 const withReader=html.replace('</head>','<script defer src="/verify/_assets/reader-extras.9c5444bd34caead9.js"></script></head>').replace('</footer>','<button type="button" data-analytics-settings hidden>Analytics choices</button></footer><aside class="analytics-choice" hidden><button data-analytics-choice="accepted">Allow analytics</button><button data-analytics-choice="declined">No thanks</button></aside><p class="analytics-choice-status visually-hidden"></p>');
 const environment={PINNACLE_VERIFY:{fetch:async()=>new Response(withReader,{headers:{'content-type':'text/html'}})}};
 const output=await(await worker.fetch(new Request(origin+'/verify/guides/abilityscore.html'),environment)).text();
 assert(output.includes('google-ads-call.js?module=verify-reader&v=4'));assert(!output.includes('reader-extras.9c5444bd34caead9.js'));
 assert(!output.includes('analytics-choice'));assert(!output.includes('data-analytics-settings'));
 assert.equal((output.match(/google-ads-call.js\?v=4/g)||[]).length,1,'The Verify reader is separate from the call bootstrap');
});
