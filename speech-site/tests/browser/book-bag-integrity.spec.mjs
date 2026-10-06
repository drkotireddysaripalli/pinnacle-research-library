import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import books from '../../src/data/book-catalog.json' with {type:'json'};
import native from '../../src/data/book-locales.json' with {type:'json'};
import locales from '../../src/data/book-cart-locales.json' with {type:'json'};

const origin='https://www.pinnacleblooms.org';
const entries=[...books.filter(x=>!x.physical),...native.filter(x=>x.available)];
const catalogue=Object.fromEntries(entries.map(x=>[x.sku,{title:x.title,path:x.path,price:x.price,books:[]} ]));
const en='PBN-SP-101-EN-PDF',te='PBN-SP-101-TE-PDF';
const variant=sku=>({id:'variant-'+sku,sku,availableForSale:true,requiresShipping:false,price:{amount:String(catalogue[sku].price),currencyCode:'INR'},product:{title:catalogue[sku].title}});
const line=(sku,id='line-'+sku,quantity=1)=>({id,quantity,merchandise:variant(sku),cost:{totalAmount:{amount:String(catalogue[sku].price*quantity),currencyCode:'INR'}}});
function markup(locale='en') {return `<!doctype html><meta charset="utf-8"><title>Book bag integrity acceptance</title><body>
<div data-book-commerce data-cart-locale="${locale}" data-cart-strings='${JSON.stringify(locales[locale]).replaceAll("'",'&#39;')}' data-cart-catalogue='${JSON.stringify(catalogue).replaceAll("'",'&#39;')}'>
<button data-cart-open>Bag</button><span data-cart-count></span><span data-shop-status></span>
<dialog><button data-cart-close>Close</button><span data-cart-message></span><span data-cart-total></span><span data-cart-file-count></span><div data-cart-items></div><a data-cart-checkout>Checkout</a></dialog></div>
<script src="/pinnacle-pages-scripts/book-commerce.js"></script></body>`;}
async function fixture(page,{initial=[line(en)],fresh,locale='en',catalogueError=false,pageError=false,brokenCursor=false}={}) {
 let reads=0,mutations=0,navigation='',pages=0;
 await page.addInitScript(()=>localStorage.setItem('pinnacle-book-cart-v1','fixture-cart'));
 const snapshot=(values,after)=>{
  const start=after?Number(after):0,nodes=values.slice(start,start+50),hasNextPage=start+50<values.length;
  return {id:'fixture-cart',checkoutUrl:'https://pinnacleblooms.myshopify.com/checkouts/fixture?key=required-key',totalQuantity:values.reduce((s,l)=>s+l.quantity,0),cost:{totalAmount:{amount:String(values.reduce((s,l)=>s+Number(l.cost.totalAmount.amount),0)),currencyCode:'INR'}},lines:{nodes,pageInfo:{hasNextPage,endCursor:hasNextPage?(brokenCursor?'0':String(start+50)):null}}};
 };
 await page.route('**/*',async route=>{
  const req=route.request(),url=new URL(req.url());
  if(url.hostname==='pinnacleblooms.myshopify.com'&&url.pathname.startsWith('/api/')){
   const {query,variables}=req.postDataJSON();
   if(query.includes('products(first:50)'))return catalogueError?route.fulfill({status:503,body:'unavailable'}):route.fulfill({json:{data:{products:{nodes:[{variants:{nodes:entries.map(x=>variant(x.sku))}}]}}}});
   if(query.startsWith('mutation')){mutations++;return route.fulfill({status:500,body:'Unexpected mutation'});}
   if(query.startsWith('query CartLines')){pages++;if(pageError)return route.fulfill({status:503,body:'page failure'});}
   else reads++;
   return route.fulfill({json:{data:{cart:snapshot(reads>1&&fresh?fresh:initial,variables.after)}}});
  }
  if(req.isNavigationRequest()&&url.origin!==origin){navigation=req.url();return route.fulfill({body:'<h1>Checkout intercepted; no order</h1>',contentType:'text/html'});}
  if(url.origin===origin&&['/shop','/shop/cart'].includes(url.pathname))return route.fulfill({body:markup(locale),contentType:'text/html'});
  if(url.origin===origin&&url.pathname==='/pinnacle-pages-scripts/book-commerce.js')return route.fulfill({body:await fs.readFile('public'+url.pathname,'utf8'),contentType:'text/javascript'});
  return route.abort();
 });
 return {reads:()=>reads,mutations:()=>mutations,navigation:()=>navigation,pages:()=>pages};
}

for(const [name,change] of Object.entries({
 availability:l=>l.merchandise.availableForSale=false,
 shipping:l=>l.merchandise.requiresShipping=true,
 price:l=>l.merchandise.price.amount='800',
 currency:l=>l.merchandise.price.currencyCode='USD',
 variant:l=>l.merchandise.id='different-variant',
 unknown:l=>l.merchandise.sku='unknown',
 quantity:l=>l.quantity=0,
 lineCurrency:l=>l.cost.totalAmount.currencyCode='USD'
}))test('fresh checkout blocks changed '+name+' and preserves bag',async({page})=>{
 const fresh=[line(en)];change(fresh[0]);const f=await fixture(page,{fresh});await page.goto(origin+'/shop');
 await expect(page.locator('[data-cart-count]')).toHaveText('1');await page.locator('[data-cart-open]').click();
 await page.locator('[data-cart-checkout]').click();await expect.poll(()=>f.reads()).toBe(2);
 await expect(page.locator('[data-cart-checkout]')).toBeHidden();expect(f.navigation()).toBe('');expect(f.mutations()).toBe(0);
 expect(await page.evaluate(()=>localStorage.getItem('pinnacle-book-cart-v1'))).toBe('fixture-cart');
 await expect(page.locator('[data-cart-message]')).not.toHaveText('Checking your book bag…');
});
for(const [name,fresh] of Object.entries({removed:[line(en)],added:[line(en),line(te),line(en,'another-line')],quantity:[line(en,'line-'+en,2),line(te)],discount:[{...line(en),cost:{totalAmount:{amount:'700',currencyCode:'INR'}}},line(te)]}))test('requires review for refreshed '+name+' before checkout',async({page})=>{
 const f=await fixture(page,{initial:[line(en),line(te)],fresh});await page.goto(origin+'/shop');await expect(page.locator('[data-cart-count]')).toHaveText('2');
 await page.locator('[data-cart-open]').click();await page.locator('[data-cart-checkout]').click();
 await expect(page.locator('[data-cart-message]')).toContainText('Your book bag changed');expect(f.navigation()).toBe('');
 await page.locator('[data-cart-checkout]').click();await expect.poll(()=>f.navigation()).toContain('/checkouts/fixture?key=required-key');expect(f.mutations()).toBe(0);
});
for(const locale of ['en','hi','te'])test('retained unavailable bag has localised guidance '+locale,async({page})=>{
 const initial=[line(en)];initial[0].merchandise.availableForSale=false;const f=await fixture(page,{initial,locale});await page.goto(origin+'/shop');
 await expect(page.locator('[data-cart-count]')).toHaveText('1');await page.locator('[data-cart-open]').click();await expect(page.locator('[data-cart-checkout]')).toBeHidden();
 await expect(page.locator('[data-cart-message]')).toContainText({en:'no longer available',hi:'अब उपलब्ध नहीं',te:'ఇప్పుడు అందుబాటులో లేదు'}[locale]);
 expect(f.navigation()).toBe('');expect(f.mutations()).toBe(0);await expect(page.locator('[data-remove-line]')).toBeVisible();
});
test('reads every line beyond first50 without adding the selected PDF twice',async({page})=>{
 const initial=Array.from({length:50},(_,i)=>line(en,'line-'+i));initial.push(line(te));const f=await fixture(page,{initial});
 await page.goto(origin+'/shop/cart?cart_sku='+te+'&quantity=1');await expect(page.locator('[data-cart-count]')).toHaveText('51');
 await expect(page.locator('.pbn-cart-item')).toHaveCount(51);expect(f.pages()).toBe(1);expect(f.mutations()).toBe(0);
 await expect(page.locator('[data-cart-message]')).toContainText('already in your bag');
});
for(const mode of ['pageError','brokenCursor'])test('incomplete pagination retains saved bag: '+mode,async({page})=>{
 const initial=Array.from({length:51},(_,i)=>line(en,'line-'+i)),f=await fixture(page,{initial,[mode]:true});
 await page.goto(origin+'/shop/cart?cart_sku='+te+'&quantity=1');await expect(page.locator('[data-cart-checkout]')).toBeHidden();
 await expect(page.locator('[data-shop-status]')).not.toHaveText('');expect(f.mutations()).toBe(0);expect(f.navigation()).toBe('');
 expect(await page.evaluate(()=>localStorage.getItem('pinnacle-book-cart-v1'))).toBe('fixture-cart');
});
test('saved bag cannot proceed when catalogue verification failed',async({page})=>{
 const f=await fixture(page,{catalogueError:true});await page.goto(origin+'/shop');await expect(page.locator('[data-cart-count]')).toHaveText('1');
 await page.locator('[data-cart-open]').click();await expect(page.locator('[data-cart-checkout]')).toBeHidden();expect(f.navigation()).toBe('');
 expect(await page.evaluate(()=>localStorage.getItem('pinnacle-book-cart-v1'))).toBe('fixture-cart');
});
