import test from 'node:test';
import assert from 'node:assert/strict';
import {physicalFeedXml,serveShopifyPhysicalFeed,PHYSICAL_FEED_PATH} from '../deployment/shopify-physical-feed.mjs';
const fixture=()=>({id:10,handle:'parent-book',published_at:'2026-10-02',product_type:'Illustrated parent education books',title:'A & B',vendor:'Pinnacle Blooms Network',body_html:'<p>Read &amp; play together.</p><p>PDF fulfilment details excluded.</p>',images:[{src:'https://cdn.shopify.com/book.jpg',variant_ids:[]}],variants:[{id:11,title:'PDF ebook',requires_shipping:false,available:true,price:'799.00'},{id:12,title:'Softcover',requires_shipping:true,available:false,price:'799.00'}]});
// The production default uses the UI-verified Shopify variant-ID convention.
const idFor=(_product,variant)=>String(variant.id);
const json=data=>new Response(JSON.stringify(data),{headers:{'content-type':'application/json'}});
test('feed follows physical Shopify variants, price, stock and future book additions',()=>{
 const p=fixture();const xml=physicalFeedXml([p],'INR',idFor);
 assert.equal((xml.match(/<item>/g)||[]).length,1);assert(xml.includes('<g:id>12</g:id>'));assert(xml.includes('out of stock'));assert(xml.includes('variant=12'));assert(xml.includes('A &amp; B'));assert(!xml.includes('PDF'));assert(!xml.includes('<g:id>11</g:id>'));assert(xml.includes('<g:item_group_id>10</g:item_group_id>'));
 p.variants[1].available=true;p.variants[1].price='899.00';const next={...fixture(),id:20,handle:'next-book',variants:[{...p.variants[1],id:22}]};
 const changed=physicalFeedXml([p,next,{...fixture(),id:30,product_type:'Medical supplies'}],'INR',idFor);
 assert.equal((changed.match(/<item>/g)||[]).length,2);assert(changed.includes('899.00 INR'));assert(changed.includes('in stock'));
 assert.throws(()=>physicalFeedXml([p],'',idFor));assert.throws(()=>physicalFeedXml([],'INR',idFor));assert.throws(()=>physicalFeedXml([p],'INR',null));
});
test('endpoint forwards no inbound credentials, caches one canonical response and supports HEAD',async()=>{
 const calls=[];const fetcher=async(url,options)=>{calls.push({url,options});return url.includes('/cart.js')?new Response(JSON.stringify({currency:'INR',token:'must-not-leak'}),{headers:{'content-type':'text/javascript; charset=utf-8'}}):json({products:[fixture()]});};
 const cacheData=new Map();const cache={match:async key=>cacheData.get(key.url)?.clone(),put:async(key,response)=>cacheData.set(key.url,response)};
 const request=new Request('https://www.pinnacleblooms.org'+PHYSICAL_FEED_PATH+'?private=secret',{headers:{cookie:'private-cookie',authorization:'private-token'}});
 const response=await serveShopifyPhysicalFeed(request,{fetcher,cache,idFor});assert.equal(response.status,200);assert(!(await response.text()).includes('must-not-leak'));assert.equal(calls.length,2);
 for(const call of calls){assert.deepEqual(call.options.headers,{accept:'application/json'});assert(!call.url.includes('private'));}
 const head=await serveShopifyPhysicalFeed(new Request('https://www.pinnacleblooms.org'+PHYSICAL_FEED_PATH,{method:'HEAD'}),{fetcher,cache,idFor});assert.equal(head.status,200);assert.equal(await head.text(),'');assert.equal(calls.length,2);
 assert.equal(await serveShopifyPhysicalFeed(new Request('https://www.pinnacleblooms.org/unrelated'),{fetcher,idFor}),null);
});
test('upstream failures and invalid currency never become empty feeds',async()=>{
 const request=new Request('https://www.pinnacleblooms.org'+PHYSICAL_FEED_PATH);
 for(const fetcher of [async()=>new Response('unavailable',{status:503}),async url=>json(url.includes('/cart.js')?{currency:'invalid'}:{products:[fixture()]})]){
  const response=await serveShopifyPhysicalFeed(request,{fetcher,cache:null,idFor});assert.equal(response.status,503);assert.equal(response.headers.get('cache-control'),'no-store');assert(!(await response.text()).includes('<rss'));
 }
 const native=await serveShopifyPhysicalFeed(request,{fetcher:async url=>json(url.includes('/cart.js')?{currency:'INR'}:{products:[fixture()]}),cache:null});assert.equal(native.status,200);const xml=await native.text();assert(xml.includes('<g:id>12</g:id>'));assert(xml.includes('<g:item_group_id>10</g:item_group_id>'));
});
