import test from 'node:test';
import assert from 'node:assert/strict';
import {physicalFeedXml,serveShopifyPhysicalFeed,PHYSICAL_FEED_PATH} from '../deployment/shopify-physical-feed.mjs';
const fixture=()=>({id:10,handle:'parent-book',published_at:'2026-10-02',product_type:'Illustrated parent education books',title:'A & B',vendor:'Pinnacle Blooms Network',body_html:'<p>Read &amp; play together.</p><p>PDF fulfilment details excluded.</p>',images:[{src:'https://cdn.shopify.com/book.jpg',variant_ids:[]}],variants:[{id:11,title:'PDF ebook',requires_shipping:false,available:true,price:'799.00'},{id:12,title:'Softcover',requires_shipping:true,available:false,price:'799.00'}]});
// The production default uses the UI-verified Shopify variant-ID convention.
const idFor=(_product,variant)=>String(variant.id);
const json=data=>new Response(JSON.stringify(data),{headers:{'content-type':'application/json'}});
const apiFixture=()=>({data:{products:{pageInfo:{hasNextPage:false,endCursor:null},nodes:[{id:'gid://shopify/Product/10',handle:'parent-book',productType:'Illustrated parent education books',title:'A & B',vendor:'Pinnacle Blooms Network',descriptionHtml:'<p>Read &amp; play together.</p>',images:{nodes:[{url:'https://cdn.shopify.com/book.jpg'}]},variants:{pageInfo:{hasNextPage:false},nodes:[{id:'gid://shopify/ProductVariant/11',title:'PDF ebook',requiresShipping:false,availableForSale:true,price:{amount:'799.00',currencyCode:'INR'}},{id:'gid://shopify/ProductVariant/12',title:'Softcover',requiresShipping:true,availableForSale:false,price:{amount:'799.00',currencyCode:'INR'}}]}}]}}});
test('feed follows physical Shopify variants, price, stock and future book additions',()=>{
 const p=fixture();const xml=physicalFeedXml([p],'INR',idFor);
 assert.equal((xml.match(/<item>/g)||[]).length,1);assert(xml.includes('<g:id>12</g:id>'));assert(xml.includes('out of stock'));assert(xml.includes('variant=12'));assert(xml.includes('A &amp; B'));assert(!xml.includes('PDF'));assert(!xml.includes('<g:id>11</g:id>'));assert(xml.includes('<g:item_group_id>10</g:item_group_id>'));
 p.variants[1].available=true;p.variants[1].price='899.00';const next={...fixture(),id:20,handle:'next-book',variants:[{...p.variants[1],id:22}]};
 const changed=physicalFeedXml([p,next,{...fixture(),id:30,product_type:'Medical supplies'}],'INR',idFor);
 assert.equal((changed.match(/<item>/g)||[]).length,2);assert(changed.includes('899.00 INR'));assert(changed.includes('in stock'));
 assert.throws(()=>physicalFeedXml([p],'',idFor));assert.throws(()=>physicalFeedXml([],'INR',idFor));assert.throws(()=>physicalFeedXml([p],'INR',null));
});
test('endpoint forwards no inbound credentials, caches one canonical response and supports HEAD',async()=>{
 const calls=[];const fetcher=async(url,options)=>{calls.push({url,options});return json(apiFixture());};
 const cacheData=new Map();const cache={match:async key=>cacheData.get(key.url)?.clone(),put:async(key,response)=>cacheData.set(key.url,response)};
 const request=new Request('https://www.pinnacleblooms.org'+PHYSICAL_FEED_PATH+'?private=secret',{headers:{cookie:'private-cookie',authorization:'private-token'}});
 const response=await serveShopifyPhysicalFeed(request,{fetcher,cache,idFor});assert.equal(response.status,200);assert(!(await response.text()).includes('must-not-leak'));assert.equal(calls.length,1);
 for(const call of calls){assert.deepEqual(call.options.headers,{'content-type':'application/json'});assert.equal(call.options.method,'POST');assert.equal(call.options.redirect,'manual');assert(!call.url.includes('private'));assert(!call.options.body.includes('private'));assert.equal(JSON.parse(call.options.body).variables.after,null);}
 const head=await serveShopifyPhysicalFeed(new Request('https://www.pinnacleblooms.org'+PHYSICAL_FEED_PATH,{method:'HEAD'}),{fetcher,cache,idFor});assert.equal(head.status,200);assert.equal(await head.text(),'');assert.equal(calls.length,1);
 assert.equal(await serveShopifyPhysicalFeed(new Request('https://www.pinnacleblooms.org/unrelated'),{fetcher,idFor}),null);
});
test('upstream failures and invalid currency never become empty feeds',async()=>{
 const request=new Request('https://www.pinnacleblooms.org'+PHYSICAL_FEED_PATH);
 const invalid=apiFixture();invalid.data.products.nodes[0].variants.nodes[1].price.currencyCode='invalid';
 for(const fetcher of [async()=>new Response('unavailable',{status:503}),async()=>json(invalid),async()=>json({errors:[{message:'upstream error'}]})]){
  const response=await serveShopifyPhysicalFeed(request,{fetcher,cache:null,idFor});assert.equal(response.status,503);assert.equal(response.headers.get('cache-control'),'no-store');assert(!(await response.text()).includes('<rss'));
 }
 const native=await serveShopifyPhysicalFeed(request,{fetcher:async()=>json(apiFixture()),cache:null});assert.equal(native.status,200);const xml=await native.text();assert(xml.includes('<g:id>12</g:id>'));assert(xml.includes('<g:item_group_id>10</g:item_group_id>'));
});

test('feed follows cursor pages and rejects incomplete variants or mixed currencies',async()=>{
 const request=new Request('https://www.pinnacleblooms.org'+PHYSICAL_FEED_PATH);
 const first=apiFixture();first.data.products.pageInfo={hasNextPage:true,endCursor:'page2'};
 const second=apiFixture();second.data.products.nodes[0].id='gid://shopify/Product/20';second.data.products.nodes[0].variants.nodes[1].id='gid://shopify/ProductVariant/22';
 let calls=0;const fetcher=async(_,o)=>{const cursor=JSON.parse(o.body).variables.after;calls++;return json(cursor===null?first:second);};
 const result=await serveShopifyPhysicalFeed(request,{fetcher,cache:null});assert.equal(result.status,200);assert.equal((await result.text()).match(/<item>/g).length,2);assert.equal(calls,2);
 const incomplete=apiFixture();incomplete.data.products.nodes[0].variants.pageInfo.hasNextPage=true;
 const mixed=apiFixture();mixed.data.products.nodes[0].variants.nodes.push({...mixed.data.products.nodes[0].variants.nodes[1],id:'gid://shopify/ProductVariant/13',price:{amount:'10.00',currencyCode:'USD'}});
 for(const data of [incomplete,mixed]){const r=await serveShopifyPhysicalFeed(request,{fetcher:async()=>json(data),cache:null});assert.equal(r.status,503);}
});

// Known reviewed previews are bounded independently of arbitrary storefront media.
test('reviewed preview links follow the known language and constituent set, keeping primary media and ebook exclusion',()=>{
 const english={...fixture(),id:8423887863874};
 english.images.push({src:'https://cdn.shopify.com/promotional-campaign.png'});
 const en=physicalFeedXml([english],'INR',idFor);
 assert.equal((en.match(/<g:additional_image_link>/g)||[]).length,2);
 assert(en.includes('/en/speech-sample-1.jpg'));assert(en.includes('/en/speech-sample-2.jpg'));
 assert(en.includes('<g:image_link>https://cdn.shopify.com/book.jpg</g:image_link>'));
 assert(!en.includes('promotional-campaign'));assert(!en.includes('<g:id>11</g:id>'));
 const telugu={...fixture(),id:8424123891778};
 const te=physicalFeedXml([telugu],'INR',idFor);
 const links=[...te.matchAll(/<g:additional_image_link>([^<]+)<\/g:additional_image_link>/g)].map(m=>m[1]);
 assert.equal(links.length,8);assert.equal(new Set(links).size,8);
 for(const key of ['speech','ot','aba','special-education'])for(const n of [1,2])assert(links.some(u=>u.endsWith(`/te/${key}-sample-${n}.png`)));
 const unknown=physicalFeedXml([fixture()],'INR',idFor);assert(!unknown.includes('additional_image_link'));
 assert(te.includes('<g:availability>out of stock</g:availability>'));
});
