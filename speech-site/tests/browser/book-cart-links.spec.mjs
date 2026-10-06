import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import books from '../../src/data/book-catalog.json' with {type:'json'};
import native from '../../src/data/book-locales.json' with {type:'json'};
import locales from '../../src/data/book-cart-locales.json' with {type:'json'};

const origin='https://www.pinnacleblooms.org';
const entries=[...books.filter(x=>!x.physical),...native.filter(x=>x.available)];
const catalogue=Object.fromEntries(entries.map(x=>[x.sku,{title:x.title,path:x.path,price:x.price,books:[]} ]));
const variant=sku=>({id:'gid://shopify/ProductVariant/'+sku,sku,availableForSale:true,requiresShipping:false,price:{amount:String(catalogue[sku].price),currencyCode:'INR'},product:{title:catalogue[sku].title}});
const markup=`<!doctype html><meta charset="utf-8"><title>Isolated book bag acceptance</title><body>
<div data-book-commerce data-cart-strings='${JSON.stringify(locales.en).replaceAll("'",'&#39;')}' data-cart-catalogue='${JSON.stringify(catalogue).replaceAll("'",'&#39;')}'>
<button data-cart-open>Book bag</button><span data-cart-count></span><span data-shop-status></span>
<dialog><button data-cart-close>Close</button><span data-cart-message></span><span data-cart-total></span><span data-cart-file-count></span><div data-cart-items></div><a data-cart-checkout>Checkout</a></dialog></div>
<script src="/pinnacle-pages-scripts/book-commerce.js"></script></body>`;

async function fixture(page,{existing=[],overrides={},readError=false,updateError=false,duplicate=false}={}){
 let mutations=0,lines=existing.map(([sku,quantity])=>({sku,quantity}));
 const snapshot=()=>({id:'fixture-cart',checkoutUrl:'https://pinnacleblooms.myshopify.com/checkouts/fixture',totalQuantity:lines.reduce((s,l)=>s+l.quantity,0),cost:{totalAmount:{amount:String(lines.reduce((s,l)=>s+catalogue[l.sku].price*l.quantity,0)),currencyCode:'INR'}},lines:{nodes:lines.map(l=>({id:'line-'+l.sku,quantity:l.quantity,merchandise:variant(l.sku),cost:{totalAmount:{amount:String(catalogue[l.sku].price*l.quantity),currencyCode:'INR'}}}))}});
 if(existing.length||readError)await page.addInitScript(()=>localStorage.setItem('pinnacle-book-cart-v1','fixture-cart'));
 await page.route('**/*',async route=>{
  const req=route.request(),url=new URL(req.url());
  if(url.origin===origin&&url.pathname==='/shop/cart')return route.fulfill({body:markup,contentType:'text/html'});
  if(url.origin===origin&&url.pathname==='/pinnacle-pages-scripts/book-commerce.js')return route.fulfill({body:await fs.readFile('public'+url.pathname,'utf8'),contentType:'text/javascript'});
  if(url.hostname==='pinnacleblooms.myshopify.com'&&url.pathname.startsWith('/api/')){
   const {query,variables}=req.postDataJSON();
   if(query.includes('products(first:50)')){
    const values=entries.map(e=>({...variant(e.sku),...overrides}));if(duplicate)values.push(values[0]);
    return route.fulfill({json:{data:{products:{nodes:[{variants:{nodes:values}}]}}}});
   }
   if(query.startsWith('query Cart'))return readError?route.fulfill({status:503,body:'fixture failure'}):route.fulfill({json:{data:{cart:snapshot()}}});
   if(query.startsWith('mutation')){
    mutations++;
    const key=query.includes('cartLinesAdd')?'cartLinesAdd':'cartCreate';
    const selected=(variables.lines||variables.input.lines)[0];
    const sku=selected.merchandiseId.split('/').at(-1);
    if(!updateError)lines.push({sku,quantity:selected.quantity});
    return route.fulfill({json:{data:{[key]:{cart:updateError?null:snapshot(),userErrors:updateError?[{message:'fixture'}]:[]}}}});
   }
  }
  return route.abort();
 });
 return {mutations:()=>mutations,lines:()=>lines};
}

for(const sku of ['PBN-SP-101-EN-PDF','PBN-SP-101-HI-PDF','PBN-SP-101-TE-PDF','PBN-101-TE-PDF-SET4'])test(`direct bag selects ${sku} and stays first-party`,async({page})=>{
 const f=await fixture(page);await page.goto(origin+'/shop/cart?cart_sku='+sku+'&quantity=1');
 await expect(page.locator('[data-cart-checkout]')).toBeVisible();
 await expect(page.locator('dialog')).toBeVisible();await expect(page.locator('[data-cart-count]')).toHaveText('1');
 await expect(page.locator('[data-cart-total]')).toContainText(new Intl.NumberFormat('en-IN').format(catalogue[sku].price));
 await expect(page.locator('.pbn-cart-item-meta')).toContainText({EN:'English',HI:'Hindi',TE:'Telugu'}[sku.match(/-(EN|HI|TE)-/)[1]]);
 expect(f.lines()).toEqual([{sku,quantity:1}]);expect(f.mutations()).toBe(1);expect(new URL(page.url()).origin).toBe(origin);
 await page.reload();await expect(page.locator('[data-cart-checkout]')).toBeVisible();expect(f.mutations()).toBe(1);expect(f.lines()).toHaveLength(1);
});
test('keeps other items and existing quantities during repeated navigation',async({page})=>{
 const en='PBN-SP-101-EN-PDF',te='PBN-SP-101-TE-PDF',f=await fixture(page,{existing:[[en,2]]});
 await page.goto(origin+'/shop/cart?cart_sku='+te+'&quantity=1');await expect(page.locator('[data-cart-count]')).toHaveText('3');
 await page.goto(origin+'/shop/cart?cart_sku='+en+'&quantity=1');await expect(page.locator('[data-cart-checkout]')).toBeVisible();
 expect(f.lines()).toEqual([{sku:en,quantity:2},{sku:te,quantity:1}]);expect(f.mutations()).toBe(1);
});
for(const query of ['cart_sku=unknown','cart_sku=PBN-SP-101-EN-PB','cart_sku=PBN-SP-101-EN-PDF&quantity=2','cart_sku=PBN-SP-101-EN-PDF&cart_sku=PBN-SP-101-TE-PDF'])test('rejects invalid link '+query,async({page})=>{
 const f=await fixture(page);await page.goto(origin+'/shop/cart?'+query);
 await expect(page.locator('[data-cart-message]')).toContainText('does not select');
 await expect(page.locator('[data-cart-checkout]')).toBeHidden();expect(f.mutations()).toBe(0);
});
for(const [name,options] of Object.entries({unavailable:{overrides:{availableForSale:false}},physical:{overrides:{requiresShipping:true}},price:{overrides:{price:{amount:'800',currencyCode:'INR'}}},currency:{overrides:{price:{amount:'799',currencyCode:'USD'}}},duplicate:{duplicate:true}}))test('fails closed for '+name,async({page})=>{
 const f=await fixture(page,options);await page.goto(origin+'/shop?cart_sku=PBN-SP-101-EN-PDF&quantity=1');
 await expect(page.locator('[data-cart-message]')).toContainText('does not select');expect(f.mutations()).toBe(0);
});
test('an unreadable saved bag is retained and never replaced',async({page})=>{
 const f=await fixture(page,{readError:true});await page.goto(origin+'/shop?cart_sku=PBN-SP-101-EN-PDF&quantity=1');
 await expect(page.locator('[data-cart-message]')).toContainText('could not connect');expect(f.mutations()).toBe(0);
 expect(await page.evaluate(()=>localStorage.getItem('pinnacle-book-cart-v1'))).toBe('fixture-cart');
});
test('a failed cart mutation does not advertise a ready checkout',async({page})=>{
 const f=await fixture(page,{updateError:true});await page.goto(origin+'/shop?cart_sku=PBN-SP-101-EN-PDF&quantity=1');
 await expect(page.locator('[data-cart-message]')).toContainText('could not be updated');expect(f.mutations()).toBe(1);await expect(page.locator('[data-cart-checkout]')).toBeHidden();
});
