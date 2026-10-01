import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import worker from '../workers/google-ads-call-measurement/index.mjs';
const origin='https://www.pinnacleblooms.org';
const path='/pinnacle-pages-scripts/google-ads-call.js?v=2';
const html='<html><head><title>Unchanged</title></head><body><header>Header</header><main><a href="tel:+919100181181">9100 181 181</a></main><footer>Footer</footer></body></html>';
const env={PINNACLE_VERIFY:{fetch:async()=>new Response(html,{headers:{'content-type':'text/html'}})}};
test('Ads defaults precede loading; general config retained; no phone conversion',async()=>{
 const source=await(await worker.fetch(new Request(origin+path),env)).text();
 const loads=[],sandbox={navigator:{},Date};sandbox.window=sandbox;
 sandbox.document={querySelector:()=>null,createElement:()=>({setAttribute(){}}),head:{appendChild(n){loads.push({src:n.src,commands:sandbox.dataLayer.map(x=>Array.from(x))});}}};
 vm.runInNewContext(source,sandbox);
 assert.equal(loads.length,1);assert.equal(loads[0].commands[0][0],'consent');assert.equal(loads[0].commands[0][1],'default');
 for(const key of ['ad_storage','ad_user_data','ad_personalization','analytics_storage'])assert.equal(loads[0].commands[0][2][key],'denied');
 assert(loads[0].commands.some(x=>x[0]==='config'&&x[1]==='AW-10810823199'));
 assert(!source.includes('phone_conversion_number'));assert(!source.includes('VNUcCMSy3YobEJ-kgKMo'));
});
test('Global Privacy Control withholds optional Ads loader',async()=>{
 const source=await(await worker.fetch(new Request(origin+path),env)).text();const sandbox={navigator:{globalPrivacyControl:true},Date};sandbox.window=sandbox;
 sandbox.document={querySelector(){throw Error('GPC loaded Ads');}};vm.runInNewContext(source,sandbox);
 assert(!sandbox.dataLayer.some(x=>x[0]==='config'));
});
test('Five measured pages retain body and CTA; bootstrap alone is injected',async()=>{
 for(const p of ['/top-speech-therapy-center-india-proven-improvement-rate','/speech-therapy/service-information','/verify/guides/everyday-practice.html','/verify/guides/abilityscore.html','/verify/evidence/pinnacle-paradigm-shift.html']){
  const r=await worker.fetch(new Request(origin+p),env),t=await r.text();assert.equal(r.headers.get('x-pinnacle-google-ads-call-measurement'),'v2-consent');
  assert.equal((t.match(/google-ads-call.js\?v=2/g)||[]).length,1);assert(!t.includes('gtag/js?id='));assert(t.includes('<main><a href="tel:+919100181181">9100 181 181</a></main><footer>Footer</footer>'));
  assert.equal(t.includes('data-pinnacle-mobile-call-cta'),p.startsWith('/verify/'));
 }
 const t=await(await worker.fetch(new Request(origin+'/untouched'),env)).text();assert.equal(t,html);
});
test('Bootstrap HEAD and method controls retained',async()=>{
 assert.equal(await(await worker.fetch(new Request(origin+path,{method:'HEAD'}),env)).text(),'');
 assert.equal((await worker.fetch(new Request(origin+path,{method:'POST'}),env)).status,405);
});
