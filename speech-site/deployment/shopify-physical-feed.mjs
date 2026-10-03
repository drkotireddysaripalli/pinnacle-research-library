// Public Shopify catalogue only. No credentials, inbound headers or customer data.
export const PHYSICAL_FEED_PATH = '/pinnacle-pages-data/books-meta-physical-feed.xml';
const STORE = 'https://pinnacleblooms.myshopify.com';
const BOOK_TYPE = 'Illustrated parent education books';
const API = STORE + '/api/2026-10/graphql.json';
const QUERY = `query Books($after:String) @inContext(country:IN){products(first:50,after:$after){pageInfo{hasNextPage endCursor} nodes{id handle title productType vendor descriptionHtml images(first:1){nodes{url}} variants(first:10){pageInfo{hasNextPage} nodes{id title availableForSale requiresShipping image{url} price{amount currencyCode}}}}}}`;
// Native Meta IDs verified in the UI: retailer ID = Shopify variant ID; group = product ID.
const retailerIdFor = (_product, variant) => String(variant.id);
const escapeXml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const tag = (name, value) => `<g:${name}>${escapeXml(value)}</g:${name}>`;
function plain(value) {
  return String(value || '').replace(/<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>/gi,' ')
    .replace(/<[^>]*>/g,' ').replace(/&(?:amp|lt|gt|quot|apos|nbsp);/g, e => ({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&nbsp;':' '}[e]))
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/\s+/g,' ').trim();
}
export function physicalFeedXml(products, currency, idFor) {
  if (!Array.isArray(products) || !/^[A-Z]{3}$/.test(currency) || typeof idFor !== 'function') throw Error('Feed configuration incomplete');
  const ids = new Set(), rows = [];
  for (const product of products) {
    if (product?.product_type !== BOOK_TYPE || !product.published_at) continue;
    if (!Number.isSafeInteger(product.id) || !/^[a-z0-9][a-z0-9-]*$/.test(product.handle) || !Array.isArray(product.variants)) throw Error('Invalid book');
    for (const variant of product.variants) {
      if (variant?.requires_shipping !== true) continue;
      if (!Number.isSafeInteger(variant.id) || typeof variant.available !== 'boolean' || !/^\d+(?:\.\d{1,2})?$/.test(variant.price) || !Number.isFinite(Number(variant.price))) throw Error('Invalid physical variant');
      const id = idFor(product, variant);
      if (typeof id !== 'string' || !id || id.length > 100 || ids.has(id)) throw Error('Invalid retailer ID');
      ids.add(id);
      const image = new URL(variant.featured_image?.src || product.images?.find(i => i.variant_ids?.includes(variant.id))?.src || product.images?.[0]?.src || '');
      if (image.protocol !== 'https:' || image.hostname !== 'cdn.shopify.com' || image.username || image.password) throw Error('Invalid product image');
      const title = `${plain(product.title)} — ${plain(variant.title)}`.slice(0,150);
      const paragraph = String(product.body_html || '').match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] || product.body_html;
      const description = `${plain(variant.title)}. ${plain(paragraph)}`.slice(0,5000);
      if (!plain(product.title) || !plain(variant.title) || !plain(paragraph) || !plain(product.vendor)) throw Error('Missing product copy');
      const fields = {id,item_group_id:String(product.id),title,description,product_type:product.product_type,link:`${STORE}/products/${product.handle}?variant=${variant.id}`,image_link:image.href,
        availability:variant.available?'in stock':'out of stock',price:`${Number(variant.price).toFixed(2)} ${currency}`,condition:'new',brand:plain(product.vendor)};
      rows.push('<item>'+Object.entries(fields).map(([key,value])=>tag(key,value)).join('')+'</item>');
    }
  }
  if (!rows.length) throw Error('Refuse empty feed');
  return '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>Pinnacle physical books from Shopify</title><link>https://www.pinnacleblooms.org/shop</link><description>Published physical book editions; availability and prices come from Shopify.</description>'+rows.join('\n')+'</channel></rss>\n';
}
async function publicProducts(fetcher) {
  const products=[], ids=new Set(), cursors=new Set();let after=null,currency=null;
  const numericId=(id,type)=>{const match=String(id).match(new RegExp('^gid://shopify/'+type+'/(\\d+)$'));if(!match||!Number.isSafeInteger(Number(match[1])))throw Error('Invalid Shopify ID');return Number(match[1]);};
  for (let page=0; page<20; page++) {
    // Tokenless Storefront API is the supported public catalogue interface.
    // Storefront publication is enforced upstream; no customer/cart request is made.
    const response=await fetcher(API,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({query:QUERY,variables:{after}}),redirect:'manual',signal:AbortSignal.timeout(8000)});
    if(!response.ok||!/^(?:application\/json)(?:;|$)/i.test(response.headers.get('content-type')||'')||Number(response.headers.get('content-length'))>4000000)throw Error('Upstream unavailable');
    const text=await response.text();if(text.length>4000000)throw Error('Upstream too large');const body=JSON.parse(text);
    if(body.errors?.length)throw Error('Catalogue API error');const data=body.data?.products;
    if(!Array.isArray(data?.nodes)||data.nodes.length>50||typeof data.pageInfo?.hasNextPage!=='boolean')throw Error('Invalid catalogue page');
    for(const product of data.nodes){
      if(ids.has(product.id))throw Error('Repeated catalogue page');ids.add(product.id);
      if(product.productType!==BOOK_TYPE)continue;
      if(!Array.isArray(product.variants?.nodes)||product.variants.pageInfo?.hasNextPage!==false)throw Error('Incomplete book variants');
      const variants=product.variants.nodes.filter(v=>v.requiresShipping===true).map(v=>{
        if(!/^[A-Z]{3}$/.test(v.price?.currencyCode)||currency&&currency!==v.price.currencyCode)throw Error('Invalid currency');currency=v.price.currencyCode;
        return {id:numericId(v.id,'ProductVariant'),title:v.title,requires_shipping:v.requiresShipping,available:v.availableForSale,price:v.price.amount,...(v.image?.url?{featured_image:{src:v.image.url}}:{})};
      });
      products.push({id:numericId(product.id,'Product'),handle:product.handle,published_at:true,product_type:product.productType,title:product.title,vendor:product.vendor,body_html:product.descriptionHtml,images:(product.images?.nodes||[]).map(image=>({src:image.url})),variants});
    }
    if(!data.pageInfo.hasNextPage)return {products,currency};
    after=data.pageInfo.endCursor;if(typeof after!=='string'||!after||cursors.has(after))throw Error('Invalid pagination cursor');cursors.add(after);
  }
  throw Error('Catalogue exceeds bounded pagination');
}
export async function serveShopifyPhysicalFeed(request, {fetcher=fetch,cache=globalThis.caches?.default,idFor=retailerIdFor}={}) {
  const url=new URL(request.url);
  if(url.hostname!=='www.pinnacleblooms.org'||url.pathname!==PHYSICAL_FEED_PATH)return null;
  if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{allow:'GET, HEAD','cache-control':'no-store'}});
  const key=new Request('https://www.pinnacleblooms.org'+PHYSICAL_FEED_PATH);
  try {
    if(typeof idFor!=='function')throw Error('Retailer IDs unverified');
    let result;try{result=await cache?.match(key);}catch{}
    if(!result){
      const {products,currency}=await publicProducts(fetcher);
      const xml=physicalFeedXml(products,currency,idFor);
      result=new Response(xml,{headers:{'content-type':'application/xml; charset=utf-8','cache-control':'public, max-age=300','x-content-type-options':'nosniff','x-robots-tag':'noindex'}});
      try{await cache?.put(key,result.clone());}catch{}
    }
    return new Response(request.method==='HEAD'?null:result.body,{status:result.status,headers:result.headers});
  } catch {
    return new Response(request.method==='HEAD'?null:'The product feed is temporarily unavailable. Please retry.',{status:503,headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store','retry-after':'300','x-robots-tag':'noindex'}});
  }
}
