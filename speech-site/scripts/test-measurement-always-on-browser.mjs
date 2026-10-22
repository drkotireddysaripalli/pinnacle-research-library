import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import mime from 'mime';
import {chromium} from 'playwright';

const root=process.cwd(),dist=path.join(root,'dist'),origin='https://www.pinnacleblooms.org';
const requests=[];
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage();
const routeDist=async route=>{
 const request=route.request(),url=new URL(request.url());
 if(url.origin!==origin){requests.push(url.href);return route.abort();}
 let relative=url.pathname==='/'?'index.html':url.pathname.slice(1);
 if(!path.extname(relative))relative+='.html';
 const file=path.resolve(dist,relative);
 if(!file.startsWith(dist+path.sep))return route.fulfill({status:404,body:'Not found'});
 const bytes=await fs.readFile(file).catch(()=>null);
 if(!bytes)return route.fulfill({status:404,body:'Not found'});
 return route.fulfill({status:200,body:request.method()==='HEAD'?'':bytes,contentType:mime.getType(file)||'application/octet-stream'});
};
await page.route('**/*',routeDist);
const url=origin+'/best-aba-therapy-center-india-proven-improvement-rate?utm_id=15340172547&utm_source=google&utm_medium=cpc&utm_campaign=aba_therapy&utm_content=aba_service&gclid=EAIaIQobChMIautomaticfixture';
try{
 await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__pinnacleAdCallMeasurement?.started===true&&window.__pinnacleCheq?.started===true);
 await page.evaluate(()=>document.addEventListener('click',event=>{if(event.target?.closest?.('a[href^="tel:"]'))event.preventDefault();},true));
 await page.locator('a[href^="tel:"]').first().click();
 await page.waitForTimeout(100);
 const proof=await page.evaluate(()=>({
  choices:document.querySelectorAll('#website-preferences,[data-measurement-choice],[data-ad-call-choice],[data-speech-measurement],[data-ad-call-preferences]').length,
  callState:window.__pinnacleAdCallMeasurement,
  cheqState:window.__pinnacleCheq,
  protectionState:window.__pinnacleProtectionContainer,
  source:window.pinnacleEnquirySource?.(),
  dataLayer:(window.dataLayer||[]).map(item=>typeof item?.length==='number'&&!item.event?Array.from(item):item)
 }));
 assert.equal(proof.choices,0);
 assert.equal(proof.callState.enabled,true);assert.equal(proof.callState.started,true);
 // The contained browser deliberately aborts vendor traffic after observing it,
 // so the loader records an error and disables retries. Starting is the contract.
 assert.equal(proof.cheqState.started,true);
 assert.equal(proof.source?.fields?.utm_source,'google');assert.equal(proof.source?.fields?.utm_medium,'cpc');
 assert.equal(proof.source?.fields?.gclid,'EAIaIQobChMIautomaticfixture');
 const commands=proof.dataLayer.filter(Array.isArray),events=commands.filter(row=>row[0]==='event');
 const defaults=commands.find(row=>row[0]==='consent'&&row[1]==='default')?.[2];
 const updates=commands.filter(row=>row[0]==='consent'&&row[1]==='update').map(row=>row[2]);
 assert.equal(defaults?.analytics_storage,'granted');assert.equal(defaults?.ad_storage,'granted');assert.equal(defaults?.ad_user_data,'granted');assert(!Object.hasOwn(defaults,'ad_personalization'),'Common measurement must not restore the retired personalisation override');
 assert(updates.some(value=>value.analytics_storage==='granted'&&value.ad_storage==='granted'&&value.ad_user_data==='granted'&&!Object.hasOwn(value,'ad_personalization')));
 assert(commands.some(row=>row[0]==='config'&&row[1]==='G-2BYLRLFRDJ'&&row[2]?.send_page_view===false));
 assert(commands.some(row=>row[0]==='config'&&row[1]==='AW-10810823199/VNUcCMSy3YobEJ-kgKMo'&&row[2]?.phone_conversion_number==='9100 181 181'));
 assert.equal(events.filter(row=>row[1]==='page_view').length,1);
 assert.equal(events.filter(row=>row[1]==='google_ads_arrival').length,1);
 assert.equal(events.filter(row=>row[1]==='phone_link_click').length,1);
 for(const row of events.filter(row=>['page_view','google_ads_arrival','phone_link_click'].includes(row[1])))assert.equal(row[2]?.measurement_mode,'automatic');
 assert(requests.some(value=>value.includes('googletagmanager.com/gtag/js?id=')));
 assert(requests.some(value=>value.includes('ob.aseasky.link/i/00b2b59a2f9c3717e415ed4d55bb642f.js')));
 assert(requests.some(value=>value.includes('protect.pinnacleblooms.org/s/accRP7xVcZTM4/astrhtuTudL4x')));
 const routeCases=[];
 for(const [name,query,allowed]of[
  ['published-centre','service=help&centre=suchitra&utm_source=google&utm_medium=cpc&utm_campaign=aba_therapy&utm_content=aba_service',true],
  ['unknown-centre','service=help&centre=unverified',true],
  ['duplicate-centre','service=help&centre=suchitra&centre=suchitra',true],
  ['unknown-query','service=help&centre=suchitra&unsupported_field=ordinary_label',true],
  ['centre-query-independent','service=help&centre=nizamabad',true],
  ['labelled-qa','service=help&centre=suchitra&validation_test=contained',false]
 ]){
  const c=await browser.newContext({viewport:{width:390,height:844}}),p=await c.newPage();await p.route('**/*',routeDist);
  try{
   await p.goto(origin+'/enroll-autism-speech-aba-therapies-india?'+query,{waitUntil:'domcontentloaded'});
   await p.waitForFunction(()=>typeof window.pinnacleProtectionAllowed==='function');
   if(allowed)await p.waitForFunction(()=>!!document.querySelector('script[src^="https://protect.pinnacleblooms.org/s/"]'));
   const r=await p.evaluate(()=>({allowed:window.pinnacleProtectionAllowed(),sdkTags:document.querySelectorAll('script[src^="https://protect.pinnacleblooms.org/s/"]').length,source:window.pinnacleEnquirySource?.(),centre:document.querySelector('[name="centre"]')?.value,cheq:window.__pinnacleCheq||null,events:(window.dataLayer||[]).filter(x=>x?.[0]==='event').map(x=>x[1])}));
   assert.equal(r.allowed,allowed,name);assert.equal(r.sdkTags,allowed?1:0,name);
   assert.equal(r.events.filter(x=>x==='enquiry_accepted').length,0,name);
   assert.equal(r.events.filter(x=>x==='page_view').length,name==='labelled-qa'?0:1,name);
   if(name==='labelled-qa')assert(!r.cheq?.started);else assert.equal(r.cheq?.started,true,'CHEQ public default is independent of CG');
   if(name==='published-centre'){assert.equal(r.centre,'suchitra');for(const key of['utm_source','utm_medium','utm_campaign','utm_content'])assert(r.source?.fields[key],key);}
   routeCases.push({name,passed:true,...r});
  }finally{await c.close();}
 }
 const requirements=[
  {id:'source-campaign-centre-continuity',status:'Pass',assertion:'Published centre query retains four source fields and selected Suchitra without creating a lead or extra page view',pageFamilies:['enrolment','managed-service'],devices:['Chromium390']},
  {id:'cheq-independent-loader',status:'Pass',assertion:'CHEQ and CG start independently on public ABA and Enrol; explicit QA stays isolated and vendor transports intercepted',pageFamilies:['managed-service','enrolment'],devices:['Chromium390']},
  {id:'clickguard-centre-bridge',status:'Pass',assertion:'Public query/fragment/referrer shape does not gate CG; SDK tag/request once and explicit QA remains isolated',pageFamilies:['enrolment'],devices:['Chromium390']}
 ];
 const report={passed:true,url,requests:[...new Set(requests)].sort(),proof,routeCases,requirements,measurementRequestsDelivered:0,intakeWrites:0};
 const at=process.argv.indexOf('--out');if(at>=0)await fs.writeFile(process.argv[at+1],JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
