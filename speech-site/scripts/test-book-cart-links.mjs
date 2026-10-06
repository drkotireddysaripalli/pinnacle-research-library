import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import books from '../src/data/book-catalog.json' with {type:'json'};
import native from '../src/data/book-locales.json' with {type:'json'};
import {serveSpeech} from '../deployment/speech-handler.mjs';

test('the existing shop wildcard serves a private non-indexed bag page with the shop canonical',async()=>{
 const inventory={'/pinnacle-pages-html/shop-index.html':'fixture'};
 const env={ASSETS:{fetch:async request=>{assert.equal(new URL(request.url).pathname,'/pinnacle-pages-html/shop-index.html');return new Response('<html><head><link rel="canonical" href="https://www.pinnacleblooms.org/shop"></head><body>Bookshop</body></html>',{headers:{'content-type':'text/html'}});}}};
 const response=await serveSpeech(new Request('https://www.pinnacleblooms.org/shop/cart?cart_sku=PBN-SP-101-EN-PDF&quantity=1'),env,inventory);
 assert.equal(response.status,200);assert.equal(response.headers.get('x-robots-tag'),'noindex, follow');
 assert.equal(response.headers.get('cache-control'),'private, no-store');
 assert(response.headers.get('content-security-policy').includes('https://pinnacleblooms.myshopify.com'));
 assert((await response.text()).includes('href="https://www.pinnacleblooms.org/shop"'));
 assert.equal(await serveSpeech(new Request('https://www.pinnacleblooms.org/shop/unknown'),env,inventory),null);
});

test('55 existing feed rows retain 33 exact first-party PDF bag links and digital ad exclusions',async()=>{
 const catalogue=new Map([...books,...native].map(b=>[b.sku,b]));let rows=0,links=0;
 for(const name of ['books-merchant-feed.xml','books-native-editions-merchant-feed.xml']){
  const feed=await fs.readFile('public/pinnacle-pages-data/'+name,'utf8');
  for(const match of feed.matchAll(/<item>(.*?)<\/item>/gs)){
   rows++;const item=match[1],sku=item.match(/<g:id>(.*?)<\/g:id>/)[1],book=catalogue.get(sku);assert(book,sku);
   const link=item.match(/<g:checkout_link_template>(.*?)<\/g:checkout_link_template>/)?.[1];
   if(book.physical){assert.equal(link,undefined);continue;}
   links++;assert(link,sku);const url=new URL(link.replaceAll('&amp;','&'));
   assert.equal(url.origin,'https://www.pinnacleblooms.org');assert.equal(url.pathname,'/shop/cart');
   assert.deepEqual([...url.searchParams],[['cart_sku',sku],['quantity','1']]);
   assert(item.includes('<g:excluded_destination>Shopping_ads</g:excluded_destination>'));
   assert(item.includes('<g:price>'+book.price.toFixed(2)+' INR</g:price>'));
  }
 }
 assert.equal(rows,55);assert.equal(links,33);
});
