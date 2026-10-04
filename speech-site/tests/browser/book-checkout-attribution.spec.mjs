import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

const origin='https://www.pinnacleblooms.org',sku='PBN-SP-101-EN-PDF';
const catalogue={[sku]:{title:'My Message Matters',path:'/books/speech-communication-101-my-message-matters',price:799,books:[]}};
const markup=`<!doctype html><meta charset="utf-8"><title>Isolated checkout fixture</title><body>
<section data-speech-measurement><p></p><span data-measurement-status></span><button data-measurement-choice="accepted">Allow</button><button data-measurement-choice="declined">Decline</button></section>
<div data-book-commerce data-cart-catalogue='${JSON.stringify(catalogue)}'><button data-cart-open>Bag</button><span data-shop-status></span><span data-cart-count></span><dialog><button data-cart-close>Close</button><span data-cart-message></span><span data-cart-total></span><span data-cart-file-count></span><div data-cart-items></div><a data-cart-checkout>Checkout</a></dialog></div>
<script src="/pinnacle-pages-scripts/book-commerce.js"></script><script src="/pinnacle-pages-scripts/speech-measurement.js"></script></body>`;

for(const scenario of ['accepted','declined','gpc','withdraw-pending','expired','wrong-host','server-failure'])test(`checkout attribution: ${scenario}`,async({page})=>{
 let navigation='',refreshStarted,releaseRefresh;
 const started=new Promise(r=>refreshStarted=r),release=new Promise(r=>releaseRefresh=r);
 let reads=0;
 await page.addInitScript(({scenario})=>{
  localStorage.setItem('pinnacle-book-cart-v1','fixture-cart');
  if(scenario==='gpc')Object.defineProperty(navigator,'globalPrivacyControl',{value:true});
 },{scenario});
 // All traffic is handled here. No Google event, Shopify cart or order is sent.
 await page.route('**/*',async route=>{
  const req=route.request(),url=new URL(req.url());
  if(url.hostname==='www.googletagmanager.com')return route.fulfill({contentType:'text/javascript',body:`document.addEventListener('click',e=>{const a=e.target.closest('[data-cart-checkout]');if(a&&window.pinnacleBookAnalyticsAllowed?.()){const u=new URL(a.href);u.searchParams.set('_gl','1*fixture*test');u.searchParams.set('private_extra','must-not-transfer');a.href=u.href;}});`});
  if(url.hostname==='pinnacleblooms.myshopify.com'&&url.pathname.startsWith('/api/')){
   const {query}=req.postDataJSON();if(query.includes('products(first:50)'))return route.fulfill({json:{data:{products:{nodes:[]}}}});
   reads++;if(reads===2){refreshStarted();if(scenario==='withdraw-pending')await release;}
   if(reads===2&&scenario==='server-failure')return route.fulfill({status:503,body:'unavailable'});
   const empty=reads===2&&scenario==='expired';
   const host=reads===2&&scenario==='wrong-host'?'checkout.evil.example':'qg10s5-ie.myshopify.com';
   return route.fulfill({json:{data:{cart:{id:'fixture-cart',checkoutUrl:`https://${host}/checkouts/${reads===2?'fresh':'old'}?key=required-store-key`,totalQuantity:empty?0:1,cost:{totalAmount:{amount:'799',currencyCode:'INR'}},lines:{nodes:empty?[]:[{id:'fixture-line',quantity:1,merchandise:{id:'fixture-variant',sku,product:{title:'My Message Matters'}},cost:{totalAmount:{amount:'799',currencyCode:'INR'}}}]}}}}});
  }
  if(req.isNavigationRequest()&&url.origin!==origin){navigation=req.url();return route.fulfill({body:'<h1>Intercepted checkout</h1>',contentType:'text/html'});}
  if(url.origin===origin&&url.pathname==='/shop')return route.fulfill({body:markup,contentType:'text/html'});
  if(url.origin===origin&&url.pathname.startsWith('/pinnacle-pages-scripts/'))return route.fulfill({body:await fs.readFile('public'+url.pathname,'utf8'),contentType:'text/javascript'});
  return route.abort();
 });
 await page.goto(origin+'/shop?private=never-export');
 await expect(page.locator('[data-cart-count]')).toHaveText('1');
 if(!['declined','gpc'].includes(scenario))await page.locator('[data-measurement-choice="accepted"]').click();
 if(scenario==='declined')await page.locator('[data-measurement-choice="declined"]').click();
 await page.locator('[data-cart-open]').click();
 await page.locator('[data-cart-checkout]').click();
 await started;
 if(scenario==='withdraw-pending'){
  await page.locator('[data-cart-close]').click();await page.locator('[data-measurement-choice="declined"]').click();releaseRefresh();
 }
 if(['expired','wrong-host','server-failure'].includes(scenario)){
  await expect.poll(()=>reads).toBe(2);
  if(scenario==='server-failure')await expect(page.locator('[data-cart-message]')).toHaveText('connectionError');else await expect(page.locator('[data-cart-checkout]')).toBeHidden();
  expect(navigation).toBe('');
  expect(await page.evaluate(()=>Array.from(window.dataLayer||[],x=>x[1]).includes('begin_checkout'))).toBe(false);
 }else{
  await expect.poll(()=>navigation).not.toBe('');const url=new URL(navigation);
  expect(url.hostname).toBe('qg10s5-ie.myshopify.com');expect(url.pathname).toBe('/checkouts/fresh');expect(url.searchParams.get('key')).toBe('required-store-key');
  expect(url.searchParams.get('_gl')).toBe(scenario==='accepted'?'1*fixture*test':null);expect(url.searchParams.has('private_extra')).toBe(false);expect(url.searchParams.has('private')).toBe(false);
 }
});
