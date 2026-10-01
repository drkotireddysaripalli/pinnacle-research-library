import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import worker from '../workers/google-ads-call-measurement/index.mjs';
const candidate=process.argv.includes('--candidate');
const origin='https://www.pinnacleblooms.org',url=origin+'/top-speech-therapy-center-india-proven-improvement-rate';
const bootstrap=await(await worker.fetch(new Request(origin+'/pinnacle-pages-scripts/google-ads-call.js?v=2'),{})).text();
const browser=await chromium.launch({headless:true});const results=[];
try{
 for(const mode of ['anonymous','declined','allowed','gpc']){
  const context=await browser.newContext();if(mode==='gpc')await context.addInitScript(()=>Object.defineProperty(navigator,'globalPrivacyControl',{value:true}));
  const page=await context.newPage(),events=[];
  if(candidate){
   await page.route('**/pinnacle-pages-scripts/google-ads-call.js*',r=>r.fulfill({contentType:'text/javascript',body:bootstrap}));
   await page.route(url,async route=>{const response=await route.fetch();const body=(await response.text()).replace('<script async src="https://www.googletagmanager.com/gtag/js?id=AW-10810823199"></script>','').replace('pinnacle-pages-scripts/google-ads-call.js"','pinnacle-pages-scripts/google-ads-call.js?v=2"');await route.fulfill({response,body});});
  }
  page.on('request',r=>{const u=new URL(r.url());if(/googletagmanager|google-analytics|analytics.google|doubleclick|googleadservices|googlesyndication/.test(u.hostname))events.push({host:u.hostname,path:u.pathname,id:u.searchParams.get('id')});});
  await page.goto(url,{waitUntil:'networkidle'});
  if(['declined','allowed'].includes(mode)){
   const choice=page.locator(`[data-measurement-choice="${mode==='allowed'?'accepted':mode}"]`);assert.equal(await choice.count(),1,mode+' choice');
   await choice.evaluate(n=>{let p=n.parentElement;while(p){if(p instanceof HTMLDetailsElement)p.open=true;p=p.parentElement;}});await choice.click();
  }
  await page.waitForTimeout(1800);
  const cookies=(await context.cookies()).map(c=>({name:c.name,domain:c.domain}));
  const commands=await page.evaluate(()=>(window.dataLayer||[]).map(x=>Array.from(x)).filter(x=>['consent','config'].includes(x[0])));
  assert(!cookies.some(c=>c.name.startsWith('_gcl')||c.name==='test_cookie'),mode+' advertising cookie');
  assert(!events.some(e=>/wcm/.test(e.path)),mode+' phone helper');
  assert(!commands.some(c=>c[0]==='config'&&String(c[1]).includes('/VNUc')),mode+' call configuration');
  assert.equal(commands[0][0],'consent');assert.equal(commands[0][2].ad_storage,'denied');
  if(mode==='gpc')assert.equal(events.length,0,'GPC optional network');
  if(mode==='allowed'){
   assert(commands.some(c=>c[0]==='consent'&&c[2].analytics_storage==='granted'),'Analytics choice still works');
   assert(commands.some(c=>c[0]==='config'&&c[1]==='G-H9CLX1WJ7R'),'Owned Analytics config retained');
   assert(events.some(e=>e.id==='G-H9CLX1WJ7R'),'Owned Analytics loader retained');
  }
  assert(await page.locator('a[href="tel:+919100181181"]').count()>0);
  results.push({mode,cookies,commands,events,telephoneRetained:true,passed:true});await context.close();
 }
 const receipt={at:new Date().toISOString(),candidate,scope:'Clean isolated browsers; no call, Ads conversion or enrolment submitted. Advanced consent mode may send cookieless requests.',results};
 const output=`deployment/ads-consent-v2-${candidate?'candidate':'live'}-20261001.json`;await fs.writeFile(output,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({passed:true,output,modes:results.map(x=>x.mode)}));
}finally{await browser.close();}
