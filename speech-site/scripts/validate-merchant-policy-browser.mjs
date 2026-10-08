import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {chromium} from '@playwright/test';
const live=process.argv.includes('--live'),base=live?'https://www.pinnacleblooms.org':'http://127.0.0.1:4389',out=path.resolve('ask-private/merchant-completion-20261008',live?'live-browser':'candidate-browser');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})}),rows=[];
try{
 for(const width of [390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:1000}});
  await context.route('**/*',async route=>{const u=new URL(route.request().url());if(/google-analytics|googletagmanager|googleadservices|doubleclick|aseasky|myshopify|youtube/.test(u.hostname))return route.abort();if(!live&&u.hostname==='www.pinnacleblooms.org'){const r=await route.fetch({url:base+u.pathname+u.search});return route.fulfill({response:r});}if(u.origin!==base)return route.abort();return route.continue();});
  const page=await context.newPage();let response=await page.goto(base+'/books/refund-and-delivery-policy',{waitUntil:'networkidle'});assert.equal(response.status(),200);
  assert.equal(await page.locator('h1').textContent(),'Book refunds and digital delivery');
  assert.equal(await page.locator('[data-book-policy-section]').count(),2);
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://www.pinnacleblooms.org/books/refund-and-delivery-policy');
  assert(await page.locator('meta[name=robots]').getAttribute('content').then(x=>x.startsWith('index,')));
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.screenshot({path:path.join(out,'policy-'+width+'.png')});
  await page.locator('#refunds').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'policy-text-'+width+'.png')});
  const book='/books/speech-communication-101-my-message-matters';await page.goto(base+book,{waitUntil:'networkidle'});
  assert(await page.locator('main a[href="/books/refund-and-delivery-policy"]').count());
  await page.locator('[data-cart-open]').click();await page.locator('dialog[open]').waitFor();
  assert.equal(await page.locator('dialog [data-book-order-policy]').count(),1);
  assert.equal(await page.locator('dialog [data-book-order-policy]').getAttribute('href'),'/books/refund-and-delivery-policy');
  await page.screenshot({path:path.join(out,'bag-'+width+'.png')});
  rows.push({browser:await browser.version(),engine:'Edge',os:process.platform,width,height:1000,policy:200,sections:2,canonical:true,indexable:true,noHorizontalOverflow:true,bookPolicyLink:true,bagPolicyLinks:1,externalMeasurementAndShopifyBlocked:true});await context.close();
 }
}finally{await browser.close();}
await fs.writeFile(path.join(out,'report.json'),JSON.stringify({at:new Date().toISOString(),live,rows,limits:'Desktop Edge with responsive viewports; not physical devices. No checkout, payment, analytics or customer records created.'},null,2));console.log(JSON.stringify({live,passed:rows.length,out}));
