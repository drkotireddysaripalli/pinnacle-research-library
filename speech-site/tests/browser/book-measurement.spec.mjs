import {test,expect} from '@playwright/test';

test('book funnel measures successful operations automatically without choice controls',async({page,request,baseURL})=>{
 const origin='https://www.pinnacleblooms.org';
 const sku='PBN-SP-101-EN-PDF';
 const variant={id:'gid://shopify/ProductVariant/45295972646978',sku,title:'PDF ebook',availableForSale:true,requiresShipping:false,price:{amount:'799',currencyCode:'INR'},product:{title:'My Message Matters'}};
 let lines=[],failRemove=false,tagRequests=0;
 const line={id:'fixture-line',quantity:1,merchandise:variant,cost:{totalAmount:{amount:'799',currencyCode:'INR'}}};
 const cart=()=>({id:'fixture-cart',checkoutUrl:'https://pinnacleblooms.myshopify.com/checkouts/fixture',totalQuantity:lines.length,cost:{totalAmount:{amount:String(lines.length*799),currencyCode:'INR'}},lines:{nodes:lines,pageInfo:{hasNextPage:false,endCursor:null}}});
 await page.route('https://www.googletagmanager.com/**',route=>{tagRequests++;return route.fulfill({contentType:'text/javascript',body:''});});
 await page.route(origin+'/**',async route=>{
  const url=new URL(route.request().url());
  const response=await request.get(baseURL+url.pathname);
  await route.fulfill({response});
 });
 await page.route('https://pinnacleblooms.myshopify.com/api/**',async route=>{
  const {query}=route.request().postDataJSON();let data;
  if(query.includes('products(first:50)')) data={products:{nodes:[{variants:{nodes:[variant]}}]}};
  else if(query.includes('cartLinesRemove')){if(failRemove){await route.fulfill({status:503,body:'unavailable'});return;}lines=[];data={cartLinesRemove:{cart:cart(),userErrors:[]}};}
  else if(query.includes('cartLinesAdd')){lines=[line];data={cartLinesAdd:{cart:cart(),userErrors:[]}};}
  else if(query.includes('cartCreate')){lines=[line];data={cartCreate:{cart:cart(),userErrors:[]}};}
  else data={cart:cart()};
  await route.fulfill({contentType:'application/json',body:JSON.stringify({data})});
 });
 await page.goto(origin+'/shop?name=private-test');
 const events=()=>page.evaluate(()=>Array.from(window.dataLayer||[],x=>Array.from(x)).filter(x=>x[0]==='event'));
 await expect(page.locator('[data-book-sku="'+sku+'"]')).toBeEnabled();
 await expect.poll(()=>tagRequests).toBe(1);
 await expect(page.locator('[data-measurement-choice],#website-preferences')).toHaveCount(0);
 expect(await page.evaluate(()=>window.pinnacleBookAnalyticsAllowed?.())).toBe(true);
 expect((await events()).filter(e=>e[1]==='page_view')).toHaveLength(1);
 await page.locator('[data-book-sku="'+sku+'"]').click();
 await expect(page.locator('.pbn-cart-item')).toHaveCount(1);
 await page.locator('[data-cart-close]').click();
 await page.locator('[data-book-sku="'+sku+'"]').click();
 expect((await events()).filter(e=>e[1]==='add_to_cart')).toHaveLength(1);
 failRemove=true;await page.locator('[data-remove-line]').click();
 await expect(page.locator('[data-cart-message]')).toContainText('could not connect');
 expect((await events()).filter(e=>e[1]==='remove_from_cart')).toHaveLength(0);
 failRemove=false;await page.locator('[data-remove-line]').click();
 await expect(page.locator('.pbn-cart-item')).toHaveCount(0);
 expect((await events()).filter(e=>e[1]==='remove_from_cart')).toHaveLength(1);
 const serialized=JSON.stringify(await events());expect(serialized).not.toContain('private-test');expect(serialized).not.toContain('fixture-cart');expect(serialized).not.toContain('purchase');
 await page.locator('[data-cart-close]').click();
 await page.evaluate(()=>localStorage.setItem('pinnacle-speech-analytics-v1',JSON.stringify({value:'declined',at:Date.now()})));
 const before=(await events()).filter(e=>e[1]==='add_to_cart').length;
 await page.locator('[data-book-sku="'+sku+'"]').click();await expect(page.locator('.pbn-cart-item')).toHaveCount(1);
 expect((await events()).filter(e=>e[1]==='add_to_cart')).toHaveLength(before+1);
});
