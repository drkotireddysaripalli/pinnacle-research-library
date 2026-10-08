// Isolated browser transport test. The real Google SDK is read once; every
// collection request is intercepted locally. No Google/customer record is made.
import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {chromium,webkit} from 'playwright';
const output=process.argv[2]||'ask-private/automatic-enquiry-20261008/wire.json';
const source=await fs.readFile('public/pinnacle-pages-scripts/speech-measurement.js','utf8');
const sdkUrl='https://www.googletagmanager.com/gtag/js?id=G-2BYLRLFRDJ';
const sdkResponse=await fetch(sdkUrl,{signal:AbortSignal.timeout(30000)});assert(sdkResponse.ok);const sdk=await sdkResponse.text();
const origin='https://www.pinnacleblooms.org',path='/enroll-autism-speech-aba-therapies-india',results=[];
for(const [browserName,type]of [['chromium',chromium],['webkit',webkit]]){
 const browser=await type.launch({headless:true});
 try{for(const state of ['unset','accepted','declined','gpc','invalid','call-granted']){
  const context=await browser.newContext({viewport:{width:390,height:844}}),requests=[];
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.origin===origin&&url.pathname===path)return route.fulfill({contentType:'text/html',body:'<!doctype html><html><head></head><body><details data-speech-measurement><p></p><button data-measurement-choice="accepted">Allow</button><button data-measurement-choice="declined">Off</button><p data-measurement-status></p></details><script src="/pinnacle-pages-scripts/speech-measurement.js"></script></body></html>'});
   if(url.origin===origin&&url.pathname.endsWith('/speech-measurement.js'))return route.fulfill({contentType:'text/javascript',body:source});
   if(url.href===sdkUrl)return route.fulfill({contentType:'text/javascript',body:sdk});
   if(/(?:google-analytics\.com|analytics\.google\.com)$/.test(url.hostname)&&url.pathname.endsWith('/collect')){
    const payload=new URLSearchParams(url.search);for(const[k,v]of new URLSearchParams(route.request().postData()||''))payload.set(k,v);requests.push(Object.fromEntries(payload));return route.fulfill({status:204});
   }
   return route.abort();
  });
  await context.addInitScript(({state})=>{
   if(state==='gpc')Object.defineProperty(navigator,'globalPrivacyControl',{value:true});
   if(state==='call-granted'){window.__pinnacleConsentDefaults=true;window.dataLayer=[];window.gtag=function(){window.dataLayer.push(arguments);};window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});window.gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'denied'});}
   if(['accepted','declined'].includes(state))localStorage.setItem('pinnacle-speech-analytics-v1',JSON.stringify({value:state,at:Date.now()}));
  },{state});
  const page=await context.newPage();await page.goto(origin+path+'?name=ISOLATED_PRIVATE&gclid=ISOLATED-CLICK');
  await page.evaluate(({invalid})=>{
   const receipt={schemaVersion:1,requestId:'isolated-wire-request',id:'isolated-wire-receipt',...(invalid?{phone:'ISOLATED_PRIVATE'}:{})};
   for(let i=0;i<2;i++)document.dispatchEvent(new CustomEvent('pinnacle:enquiry-accepted',{detail:{receipt}}));
  },{invalid:state==='invalid'});
  if(['unset','accepted','call-granted'].includes(state))await page.waitForFunction(()=>window.dataLayer?.some(x=>x[0]==='event'&&x[1]==='enquiry_accepted'));
  for(let i=0;i<30&&['unset','accepted','call-granted'].includes(state)&&!requests.some(r=>r.en==='enquiry_accepted');i++)await page.waitForTimeout(200);
  const accepted=requests.filter(r=>r.en==='enquiry_accepted'),cookies=await context.cookies();
  assert.equal(accepted.length,['unset','accepted','call-granted'].includes(state)?1:0,browserName+' '+state+' accepted wire');
  if(['unset','call-granted'].includes(state)){assert.equal(accepted[0].gcs,state==='call-granted'?'G110':'G100');assert.equal(accepted[0].dl,origin+path);assert(!cookies.some(c=>/^(ps_ga(?:_|$)|_ga(?:_|$))/.test(c.name)));assert(!requests.some(r=>r.en==='page_view'));}
  if(!['unset','accepted','call-granted'].includes(state))assert.equal(requests.filter(r=>state!=='invalid'||r.en!=='google_ads_arrival').length,0);
  const wire=JSON.stringify(accepted);for(const value of ['ISOLATED_PRIVATE','isolated-wire-request','isolated-wire-receipt','phone','user_id',...(state==='accepted'?[]:['ISOLATED-CLICK'])])assert(!wire.includes(value),browserName+" "+state+" excluded "+value);
  results.push({browser:browserName,state,acceptedEvents:accepted.length,allInterceptedEvents:requests.map(r=>r.en),storageConsent:accepted[0]?.gcs||null,analyticsCookies:cookies.filter(c=>/^(ps_ga(?:_|$)|_ga(?:_|$))/.test(c.name)).length,passed:true});
  await context.close();
 }}finally{await browser.close();}
}
await fs.writeFile(output,JSON.stringify({at:new Date().toISOString(),sdk:'Google gtag public SDK',collectionIntercepted:true,liveAnalyticsEventsSent:0,customerSubmissions:0,results},null,2)+'\n');console.log(JSON.stringify({cases:results.length,passed:true,liveAnalyticsEventsSent:0,output}));
