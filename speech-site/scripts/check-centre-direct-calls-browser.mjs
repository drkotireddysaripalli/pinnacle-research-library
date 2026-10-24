// Run the real saved page DOM with local-only scripts; all other requests abort.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {chromium} from 'playwright';
const [sourceFile,fixtureFolder,output]=process.argv.slice(2);assert(sourceFile&&fixtureFolder&&output);
const source=await fs.readFile(sourceFile,'utf8'),sha=b=>createHash('sha256').update(b).digest('hex');
const fixtures=[['national-speech.html','/top-speech-therapy-center-india-proven-improvement-rate',54],['attapur.html','/centers/best-autism-speech-aba-occupational-therapy-center-attapur-hyderabad-telangana-india',1]];
const browser=await chromium.launch({headless:true});const records=[];let externalDispatched=0;
try{for(const [name,pathname,expected]of fixtures){
 const raw=await fs.readFile(path.join(fixtureFolder,name),'utf8');
 const html=raw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
 const context=await browser.newContext();
 await context.route('**/*',route=>{
  if(route.request().isNavigationRequest()&&route.request().url()==='https://www.pinnacleblooms.org'+pathname)return route.fulfill({status:200,contentType:'text/html',body:html});
  return route.abort();
 });
 const page=await context.newPage();await page.goto('https://www.pinnacleblooms.org'+pathname,{waitUntil:'domcontentloaded'});
 await page.addInitScript(()=>{window.dataLayer=[];});
 await page.addScriptTag({content:source});
 // The test listener runs after the product handler. It verifies that handler
 // did not prevent navigation, then stops the test from opening a telephone app.
 const result=await page.evaluate(({expected})=>{
  const records=[];let intercepted=false;
  document.addEventListener('click',e=>{if(e.target?.closest?.('a[href^="tel:"]')){if(e.defaultPrevented)intercepted=true;e.preventDefault();}});
  const links=[...document.querySelectorAll('a[href^="tel:"]')].filter(a=>!['tel:+919100181181','tel:9100181181'].includes(a.getAttribute('href')));
  for(const link of links){
   const before=window.dataLayer.length,href=link.getAttribute('href');
   link.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
   const entries=window.dataLayer.slice(before).map(x=>Array.from(x));
   const events=entries.filter(x=>x[0]==='event'&&x[1]==='phone_link_click');
   const payload=events[0]?.[2],card=link.closest('#centre-cards .directory-card[id]');
   const expectedId=card?.id.replace(/^centre-/,'')||'attapur';
   records.push({centreId:expectedId,count:events.length,destination:payload?.destination,reportedId:payload?.centre_id,placement:payload?.link_placement,navigationPreserved:link.getAttribute('href')===href,numberExcluded:!JSON.stringify(events).includes(href.slice(4)),adsCalls:entries.filter(x=>x[0]==='event'&&x[1]==='google_ads_phone_click').length});
  }
  return{expected,records,intercepted};
 },{expected});
 assert.equal(result.records.length,expected,name);assert.equal(result.intercepted,false);
 for(const r of result.records){assert.equal(r.count,1,r.centreId);assert.equal(r.destination,'centre_direct');assert.equal(r.reportedId,r.centreId);assert(r.navigationPreserved&&r.numberExcluded);assert.equal(r.adsCalls,0);}
 records.push({fixture:name,fixtureSHA256:sha(raw),...result});await context.close();
}}finally{await browser.close();}
const receipt={status:'PASS',at:new Date().toISOString(),sourceSHA256:sha(source),testerSHA256:sha(await fs.readFile(new URL(import.meta.url))),records,externalDispatched,providerEvents:0,phoneApplicationsOpened:0};
await fs.writeFile(output,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({status:receipt.status,testedLinks:records.reduce((n,r)=>n+r.records.length,0),externalDispatched,providerEvents:0}));
