// Real public Google SDK, isolated browser fixture. Collection is intercepted;
// no live analytics, phone call, WhatsApp message or customer lead is created.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const output=process.argv[2]||'ask-private/paid-journey-20261008/wire.json';
const live=process.argv.includes('--live');
const origin='https://www.pinnacleblooms.org',path='/enroll-autism-speech-aba-therapies-india';
const asset=origin+'/pinnacle-pages-scripts/speech-measurement.js?v=paid-journey-20261008';
const source=live?await(await fetch(asset,{signal:AbortSignal.timeout(30000)})).text():await fs.readFile('public/pinnacle-pages-scripts/speech-measurement.js','utf8');
assert(source.includes("sendGoogleAds('google_ads_arrival'"));
const sdkUrl='https://www.googletagmanager.com/gtag/js?id=G-2BYLRLFRDJ';
const response=await fetch(sdkUrl,{signal:AbortSignal.timeout(30000)});assert(response.ok);const sdk=await response.text();
const names=['google_ads_arrival','google_ads_phone_click','google_ads_whatsapp_click'],results=[];
for(const[browserName,type]of[['chromium',chromium],['webkit',webkit]]){
 const browser=await type.launch({headless:true});
 try{for(const state of ['unset','accepted','declined','gpc','qa','organic']){
  const context=await browser.newContext({viewport:{width:390,height:844}}),requests=[],rawRequests=[];
  await context.route('**/*',async route=>{
   const u=new URL(route.request().url());
   if(u.origin===origin&&u.pathname===path)return route.fulfill({contentType:'text/html',body:'<!doctype html><html><head></head><body><details open data-speech-measurement><p></p><button data-measurement-choice="accepted">Allow</button><button data-measurement-choice="declined">Off</button><p data-measurement-status></p></details><a id="call" data-cta="header-call" href="tel:+919100181181">Call 9100 181 181</a><a id="whatsapp" data-cta="header-whatsapp" href="https://wa.me/919100181181">WhatsApp</a><script src="/pinnacle-pages-scripts/speech-measurement.js"></script></body></html>'});
   if(u.origin===origin&&u.pathname.endsWith('/speech-measurement.js'))return route.fulfill({contentType:'text/javascript',body:source});
   if(u.href===sdkUrl)return route.fulfill({contentType:'text/javascript',body:sdk});
   if(/(?:google-analytics\.com|analytics\.google\.com)$/.test(u.hostname)&&u.pathname.endsWith('/collect')){
    const post=route.request().postData()||'';rawRequests.push({query:u.search,post});
    // gtag can batch several events in newline-delimited POST rows. Each row
    // shares the URL's common fields and must remain a distinct event.
    for(const line of post.split('\n').filter(Boolean).length?post.split('\n').filter(Boolean):['']){
     const fields=new URLSearchParams(u.search);for(const[k,v]of new URLSearchParams(line))fields.set(k,v);requests.push(Object.fromEntries(fields));
    }
    return route.fulfill({status:204});
   }
   return route.abort();
  });
  await context.addInitScript(({state})=>{
   if(state==='gpc')Object.defineProperty(navigator,'globalPrivacyControl',{value:true});
   if(['accepted','declined'].includes(state))localStorage.setItem('pinnacle-speech-analytics-v1',JSON.stringify({value:state,at:Date.now()}));
  },{state});
  const page=await context.newPage(),tag=state==='organic'?'?utm_source=google&utm_medium=organic':'?gclid=ISOLATED-CLICK&utm_source=google&utm_medium=cpc&utm_campaign=ISOLATED-CAMPAIGN';
  await page.goto(origin+path+tag+(state==='qa'?'&validation_test=1':''));
  const native=await page.evaluate(()=>{
   const result={};
   for(const id of ['call','whatsapp']){
    const a=document.getElementById(id),event=new MouseEvent('click',{bubbles:true,cancelable:true});
    // Test-only final listener prevents actual device actions, after checking
    // whether the website's own listeners already interfered with them.
    document.addEventListener('click',e=>{result[id]={href:a.getAttribute('href'),websitePrevented:e.defaultPrevented};e.preventDefault();},{once:true});
    a.dispatchEvent(event);
   }
   return result;
  });
  assert.equal(native.call.href,'tel:+919100181181');assert.equal(native.whatsapp.href,'https://wa.me/919100181181');
  assert.equal(native.call.websitePrevented,false);assert.equal(native.whatsapp.websitePrevented,false);
  const positive=['unset','accepted'].includes(state);
  if(positive){for(let i=0;i<30&&!names.every(name=>requests.some(r=>r.en===name));i++)await page.waitForTimeout(200);}
  else await page.waitForTimeout(350);
  if(positive&&!names.every(name=>requests.some(r=>r.en===name)))await fs.writeFile(output.replace(/\.json$/,'.failure.json'),JSON.stringify({browserName,state,rawRequests,dataLayer:await page.evaluate(()=>Array.from(window.dataLayer||[]).filter(x=>x[0]==='event').map(x=>({name:x[1],parameters:x[2]})))},null,2));
  for(const name of names)assert.equal(requests.filter(r=>r.en===name).length,positive?1:0,browserName+' '+state+' '+name);
  const paid=requests.filter(r=>names.includes(r.en)),cookies=await context.cookies();
  if(state==='unset'){
   for(const r of paid){assert.equal(r.gcs,'G100');assert.equal(r.dl,origin+path);assert(!JSON.stringify(r).includes('ISOLATED-'));}
   assert(!cookies.some(c=>/^(ps_ga(?:_|$)|_ga(?:_|$))/.test(c.name)));
   await page.getByText('Allow',{exact:true}).click();await page.waitForTimeout(350);
   for(const name of names)assert.equal(requests.filter(r=>r.en===name).length,1,'opt-in replay '+name);
  }
  if(!positive)assert.equal(requests.length,0);
  results.push({browser:browserName,state,paidEventCounts:Object.fromEntries(names.map(name=>[name,paid.filter(r=>r.en===name).length])),analyticsCookiesAtTap:cookies.filter(c=>/^(ps_ga(?:_|$)|_ga(?:_|$))/.test(c.name)).length,storageConsent:paid[0]?.gcs||null,native,passed:true});
  await context.close();
 }}finally{await browser.close();}
}
await fs.writeFile(output,JSON.stringify({at:new Date().toISOString(),source:live?'live cache-busted shared script':'local source',sdk:'Google public gtag SDK',collectionIntercepted:true,liveAnalyticsEventsSent:0,customerSubmissions:0,calls:0,whatsappMessages:0,results},null,2)+'\n');
console.log(JSON.stringify({cases:results.length,passed:true,liveAnalyticsEventsSent:0,output}));
