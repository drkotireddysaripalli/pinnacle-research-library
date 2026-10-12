// Verify public offer separation without submitting an enquiry or placing a call.
import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const live=process.argv.includes('--live'),out=process.env.NAVRATRI_EVIDENCE_DIR||'outputs/navratri-discount-20261011';
const base=live?'https://www.pinnacleblooms.org':'http://127.0.0.1:4359';
const pathname='/enroll-autism-speech-aba-therapies-india',results=[];
await fs.mkdir(out,{recursive:true});
const server=live?null:spawn(process.execPath,['scripts/serve-quality-preview.mjs'],{env:{...process.env,QUALITY_PREVIEW_PORT:'4359'},stdio:'ignore',windowsHide:true});
const browser=await chromium.launch({headless:true});
try{
 if(server){let ready=false;for(let i=0;i<30;i++){try{if((await fetch(base+pathname)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,200))}assert(ready,'Local preview unavailable');}
 for(const width of [320,390,1440]){
  const context=await browser.newContext({viewport:{width,height:900}}),errors=[];
  await context.route('**/*',r=>{const u=new URL(r.request().url());return u.origin===base&&!u.pathname.startsWith('/api/')?r.continue():r.fulfill({status:200,body:''});});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  const query='?offer=navratri-one-service-month-2026&utm_source=google&utm_medium=cpc&utm_campaign=validation_test&service=speech';
  const response=await page.goto(base+pathname+query);assert.equal(response.status(),200);
  await page.locator('#enrol-submit').waitFor({state:'visible'});await page.evaluate(()=>document.fonts.ready);
  const monthly=page.locator('#navratri-one-service-month-offer'),discount=page.locator('#navratri-paid-plan-discount-2026');
  assert.equal(await monthly.locator('s').innerText(),'₹25,999/-');assert((await monthly.locator('.enrol-offer-price strong').innerText()).includes('₹14,499/-'));
  assert.equal(await monthly.locator('.enrol-offer-limit').innerText(),'Only for the first 4,999 kids and families.');assert((await monthly.innerText()).includes('Ends 25 October 2026 at 11:59 pm IST'));
  assert((await monthly.locator('s').evaluate(n=>getComputedStyle(n).textDecorationLine)).includes('line-through'));
  assert.equal(await discount.locator('h2').innerText(),'₹4,999 Navratri discount');
  assert.equal(await discount.locator('time[datetime="2026-10-11"]').innerText(),'11 October');assert.equal(await discount.locator('time[datetime="2026-10-25"]').innerText(),'25 October 2026');
  assert((await discount.innerText()).includes('cannot be combined with the ₹14,499 one-service monthly offer'));
  for(const block of [monthly,discount])assert.equal(await block.locator('a[href="tel:+919100181181"]').count(),1);
  const destination=new URL(await discount.locator('[data-navratri-discount-enrol]').getAttribute('href'),page.url());
  assert.equal(destination.pathname,pathname);assert.equal(destination.hash,'#enrolment-form');assert.equal(destination.searchParams.get('offer'),null);assert.equal(destination.searchParams.get('service'),'speech');assert.equal(destination.searchParams.get('utm_source'),'google');
  await discount.scrollIntoViewIfNeeded();const screenshot=out+`/${live?'live':'local'}-discount-${width}.png`;await discount.screenshot({path:screenshot});
  await discount.locator('[data-navratri-discount-enrol]').click();await page.waitForURL(u=>u.pathname===pathname&&!u.searchParams.has('offer')&&u.hash==='#enrolment-form');
  await page.waitForFunction(()=>!document.querySelector('#enrol-submit').disabled);assert.equal(await page.locator('input[name="service"]:checked').inputValue(),'speech');
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
  assert(!await page.evaluate(()=>Array.from(window.dataLayer||[]).some(e=>e?.[0]==='event'&&e[1]==='enquiry_accepted')));assert.deepEqual(errors,[]);
  results.push({width,status:response.status(),screenshot,monthlyPreserved:true,discountSeparate:true,dates:['2026-10-11','2026-10-25'],centralCallHref:'tel:+919100181181',callbackDestination:destination.href,monthlyOfferRemovedFromDiscountJourney:true,servicePreserved:true,formEnabled:true,noOverflow:true,noPageLoadAcceptance:true,errors});
  await context.close();
 }
}finally{await browser.close();if(server){server.kill();await new Promise(r=>server.once('exit',r));}await fs.writeFile(out+`/${live?'live':'local'}-browser.json`,JSON.stringify({scope:live?'Public deployed Chromium browsers':'Exact local production build',externalTransportsIntercepted:true,realEnquiries:0,realCalls:0,results},null,2)+'\n');}
console.log(JSON.stringify({passed:results.length,live,realEnquiries:0,realCalls:0}));
