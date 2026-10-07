import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {PUBLIC_AD_CALL_PATH} from '../deployment/public-ad-call.mjs';
const base='https://www.pinnacleblooms.org',out='deployment/public-ad-call-public-20261007';
await fs.mkdir(out,{recursive:true});
const register=JSON.parse(await fs.readFile('src/data/centre-register.json','utf8')).centres;
const cases=[
 {name:'guntur-phone',width:390,path:new URL(register.find(c=>c.id==='guntur').profileUrl).pathname},
 {name:'occupational-desktop',width:1440,path:'/best-occupational-therapy-center-india-proven-improvement-rate'},
 {name:'enrolment-small-phone',width:320,path:'/enroll-autism-speech-aba-therapies-india'},
];
const rows=[],browser=await chromium.launch({headless:true});
try{
 for(const c of cases){
  const context=await browser.newContext({viewport:{width:c.width,height:900}}),page=await context.newPage();
  await page.route(/https:\/\/(?:[^/]*google-analytics\.com|[^/]*analytics\.google\.com|www\.googletagmanager\.com|www\.googleadservices\.com|googleads\.g\.doubleclick\.net|www\.google\.com|pagead2\.googlesyndication\.com|ad\.doubleclick\.net)\//,route=>route.abort());
  const response=await page.goto(base+c.path,{waitUntil:'domcontentloaded',timeout:45000});assert.equal(response.status(),200);
  const headers=response.headers();assert.equal(headers['x-pinnacle-ad-call-coverage'],'public-20261007');assert(headers['content-security-policy'].includes('https://www.googleadservices.com'));
  assert.equal(await page.locator(`script[src="${PUBLIC_AD_CALL_PATH}"]`).count(),1);
  const controls=page.locator('[data-ad-call-preferences]');await controls.waitFor({state:'visible',timeout:10000});assert.equal(await controls.count(),1);
  assert.equal(await page.evaluate(()=>window.__pinnacleAdCallConsent.enabled),false);
  await controls.locator('summary').click();await controls.scrollIntoViewIfNeeded();
  assert(await controls.locator('[data-ad-call-choice="accepted"]').isVisible());
  await page.screenshot({path:out+'/'+c.name+'.png'});
  await controls.locator('[data-ad-call-choice="accepted"]').click();
  const proof=await page.evaluate(()=>{
   const cmd=Array.from(window.dataLayer||[],x=>Array.from(x));const configs=cmd.filter(x=>x[0]==='config'&&String(x[1]).includes('/VNUc'));
   if(configs.length!==1)throw Error('Missing or duplicate call config');
   const locals=Array.from(document.querySelectorAll('a[href^="tel:"]')).filter(x=>x.getAttribute('href')!=='tel:+919100181181').map(x=>({node:x,href:x.getAttribute('href')}));
   const displays=Array.from(document.querySelectorAll('a[href="tel:+919100181181"]')).filter(x=>/9100[\s-]*181[\s-]*181/.test(x.textContent));
   configs[0][2].phone_conversion_callback('+1 202 555 0142','+12025550142');
   const targets=Array.from(document.querySelectorAll('[data-pinnacle-ad-call-target="central"]'));
   return {enabled:window.__pinnacleAdCallConsent.enabled,configs:configs.length,centralTargets:targets.length,displayAndDial:targets.every(x=>x.getAttribute('href')==='tel:+12025550142')&&displays.length>0&&displays.every(x=>x.textContent.includes('+1 202 555 0142')),localsUntouched:locals.every(x=>x.node.getAttribute('href')===x.href)};
  });assert(proof.enabled&&proof.centralTargets>0&&proof.displayAndDial&&proof.localsUntouched);
  // A real cookie-return visit must retain current module coverage and saved choice.
  await context.addCookies([{name:'pinnacle_qa_return',value:'1',domain:'www.pinnacleblooms.org',path:'/',secure:true}]);
  const returning=await page.reload({waitUntil:'domcontentloaded'});assert.equal(returning.status(),200);await page.waitForFunction(()=>window.__pinnacleAdCallConsent?.enabled===true);
  const panel=page.locator('[data-ad-call-preferences]');if(!await panel.locator('[data-ad-call-choice="declined"]').isVisible())await panel.locator('summary').click();
  await Promise.all([page.waitForEvent('load'),panel.locator('[data-ad-call-choice="declined"]').click()]);
  await page.waitForFunction(()=>window.__pinnacleAdCallConsent?.enabled===false);
  assert.equal(await page.locator('script[src*="googletagmanager.com/gtag/js"]').count(),0);
  assert.equal(await page.locator('a[href="tel:+12025550142"]').count(),0);
  rows.push({...c,headers:{coverage:headers['x-pinnacle-ad-call-coverage'],cacheControl:headers['cache-control']},proof,returningCookie:true,withdrawal:true,passed:true});await context.close();
 }
}finally{await browser.close();await fs.writeFile(out+'.json',JSON.stringify({at:new Date().toISOString(),scope:'Direct public visits; Google vendor requests blocked; callback numbers isolated QA fixtures; no paid click, phone call, enquiry submission, login or real-family record.',module:PUBLIC_AD_CALL_PATH,cases:rows},null,2)+'\n');}
console.log(JSON.stringify({passed:rows.length,module:PUBLIC_AD_CALL_PATH}));
