import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {chromium} from '@playwright/test';import worker from '../workers/google-ads-call-measurement/index.mjs';
const root='deployment/website-call-verify-20261006';await fs.mkdir(root,{recursive:true});const browser=await chromium.launch({headless:true}),results=[];
const url='https://www.pinnacleblooms.org/verify/guides/everyday-practice.html',original=await fetch(url),html=await original.text();
const content=await worker.fetch(new Request(url),{PINNACLE_VERIFY:{fetch:async()=>new Response(html,{headers:original.headers})}});const body=await content.text();
try{for(const order of ['analytics-first','advertising-first']){
 const context=await browser.newContext(),page=await context.newPage();
 await page.route(/https:\/\/(?:[^/]*google[^/]*|[^/]*doubleclick[^/]*)\//,r=>r.fulfill({status:200,contentType:'application/javascript',body:''}));
 await page.route('**/pinnacle-pages-scripts/google-ads-call.js*',async r=>{const response=await worker.fetch(new Request(r.request().url()),{});await r.fulfill({contentType:'application/javascript',body:await response.text()});});
 await page.route(url,r=>r.fulfill({status:200,headers:Object.fromEntries(content.headers),body}));
 await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.locator('[data-analytics-choice="'+(order==='analytics-first'?'accepted':'declined')+'"]').click();
 await page.locator('[data-ad-call-preferences] summary').click();await page.locator('[data-ad-call-choice="accepted"]').click();
 if(order==='advertising-first'){await page.locator('[data-analytics-settings]').first().click();await page.locator('[data-analytics-choice="accepted"]').click();}
 const state=await page.evaluate(()=>{const c=Array.from(window.dataLayer||[],x=>Array.from(x)),consent={};for(const x of c)if(x[0]==='consent')Object.assign(consent,x[2]);return {consent,configs:c.filter(x=>x[0]==='config').map(x=>x[1]),loaders:document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').length};});
 assert.equal(state.consent.ad_storage,'granted');assert.equal(state.consent.analytics_storage,'granted');assert.equal(state.consent.ad_personalization,'denied');assert.equal(state.loaders,1);assert.equal(state.configs.filter(x=>x.includes('/VNUc')).length,1);
 results.push({order,...state,passed:true});await context.close();}
 await fs.writeFile(root+'/report.json',JSON.stringify({at:new Date().toISOString(),results},null,2));console.log(JSON.stringify({verifyConsentOrders:results.length,passed:true}));
}finally{await browser.close();}
