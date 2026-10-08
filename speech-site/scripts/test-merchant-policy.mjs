import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {parse} from 'parse5';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {repairAssessmentSchema,serveBookOrderPolicy,bookPolicyPath} from '../deployment/merchant-policy-handler.mjs';
import {bookPolicyAssets} from '../deployment/merchant-policy-content.mjs';
import policies from '../src/data/book-order-policies.json' with {type:'json'};
const origin='https://www.pinnacleblooms.org',canonical=origin+'/top-speech-therapy-center-india-proven-improvement-rate';
const offer={'@type':'Offer',price:0,priceCurrency:'INR',url:origin+'/enroll-autism-speech-aba-therapies-india?service=speech',itemOffered:{'@id':canonical+'#assessment'}};
const assessment={'@type':'Service','@id':canonical+'#assessment',name:'FREE speech assessment',brand:{'@id':origin+'/verify/#pinnacle-brand'},offers:offer};
const product={'@type':'Product',sku:'PBN-SP-101-EN-PDF',offers:{'@type':'Offer',price:499,priceCurrency:'INR',availability:'https://schema.org/InStock'}};
const graph=nodes=>JSON.stringify({'@context':'https://schema.org','@graph':nodes});
function text(html){const out=[];function walk(n){if(n.nodeName==='#text')out.push(n.value);for(const c of n.childNodes||[])walk(c);}walk(parse(html));return out.join(' ').replace(/\s+/g,' ').trim();}
test('policy sections preserve the accepted Shopify wording and contact links',()=>{
 const html=Buffer.from(bookPolicyAssets[bookPolicyPath].body,'base64').toString();
 for(const section of policies.sections){assert(text(html).includes(text(section.html)));assert(section.source.startsWith('https://pinnacleblooms.myshopify.com/policies/'));}
 assert(html.includes('href="tel:+919100181181"'));assert(html.includes('href="mailto:care@pinnacleblooms.org"'));assert(html.includes('href="/refund-policy"'));assert(!html.includes('"@type":"Product"'));
});
test('policy public GET, HEAD, conditional request, private cache and method boundaries',async()=>{
 const url=origin+bookPolicyPath,r=serveBookOrderPolicy(new Request(url));assert.equal(r.status,200);const tag=r.headers.get('etag');assert((await r.text()).includes('Book refunds and digital delivery'));
 assert.equal(await serveBookOrderPolicy(new Request(url,{method:'HEAD'})).text(),'');
 assert.equal(serveBookOrderPolicy(new Request(url,{headers:{'if-none-match':tag}})).status,304);
 assert.equal(serveBookOrderPolicy(new Request(url,{headers:{cookie:'session=test','if-none-match':tag}})).status,200);
 assert.equal(serveBookOrderPolicy(new Request(url,{headers:{cookie:'session=test'}})).headers.get('cache-control'),'private, no-store');
 assert.equal(serveBookOrderPolicy(new Request(url,{method:'POST'})).status,405);
 assert.equal(serveBookOrderPolicy(new Request(origin+'/refund-policy')),null);
 assert.equal(serveBookOrderPolicy(new Request('https://other.example'+bookPolicyPath)),null);
});
test('only the known assessment Offer is removed; service and appointment destination remain',()=>{
 const out=JSON.parse(repairAssessmentSchema(graph([assessment,product]),canonical));
 assert.equal(out['@graph'][0].offers,undefined);assert.equal(out['@graph'][0]['@type'],'Service');assert.equal(out['@graph'][0].name,assessment.name);assert.equal(out['@graph'][0].availableChannel.serviceUrl,offer.url);assert.deepEqual(out['@graph'][1],product);
});
test('null nodes and unsafe unrelated numbers preserve public HTML safely',()=>{
 for(const source of ['null',graph([null]),graph([assessment]).replace('\"@graph\":','\"identifier\":90071992547409931234,\"@graph\":')])assert.equal(repairAssessmentSchema(source,canonical),source);
});
test('unknown identities, plain book graphs and malformed JSON are unchanged',()=>{
 for(const source of [graph([product]),graph([{...assessment,'@id':origin+'/other#assessment'}]),graph([{...assessment,brand:{'@id':'https://other.example/#brand'}}]),'not json'])assert.equal(repairAssessmentSchema(source,canonical),source);
});
const bundle=await build({stdin:{contents:`import {repairMerchantDiscovery} from './deployment/merchant-policy-handler.mjs';export default {async fetch(request){return repairMerchantDiscovery(new Request(request.url,{method:request.headers.get('x-method')||'GET'}),new Response(await request.text(),{headers:{'content-type':'text/html',...(request.headers.has('x-private')?{'cache-control':'private, no-store','set-cookie':'session=fixture'}:{})}}));}}`,resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
const runtime=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-04',script:bundle.outputFiles[0].text}));
after(()=>runtime.dispose());
async function rewrite(path,html,method='GET',privateResponse=false){return (await runtime.dispatchFetch(origin+path,{method:'POST',body:html,headers:{'x-method':method,...(privateResponse?{'x-private':'1'}:{})}})).text();}
test('runtime changes only book body policy links and keeps clinic footer and product offers',async()=>{
 const html='<main><a href="/refund-policy">Refund</a><script type="application/ld+json">'+graph([product])+'</script></main><footer><a href="/refund-policy">Clinic policy</a></footer>';
 const out=await rewrite('/books/test',html);assert(out.includes('<a href="'+bookPolicyPath+'">Refund</a>'));assert(out.includes('<footer><a href="/refund-policy">Clinic policy</a></footer>'));assert(out.includes(graph([product])));
 assert.equal(await rewrite('/refund-policy',html),html);assert.equal(await rewrite('/books/test',html,'POST'),html);
 const privateBook=await rewrite('/books/test',html,'GET',true);assert(privateBook.includes('<a href="'+bookPolicyPath+'">Refund</a>'));
 const privateResponse=await runtime.dispatchFetch(origin+'/books/test',{method:'POST',body:html,headers:{'x-private':'1'}});assert.equal(privateResponse.headers.get('cache-control'),'private, no-store');assert.equal(privateResponse.headers.get('set-cookie'),'session=fixture');
});
test('runtime assessment removal keeps visible offer and all unrelated schema',async()=>{
 const html='<main>FREE speech assessment<script type="application/ld+json">'+graph([assessment,product])+'</script></main>';
 const out=await rewrite(new URL(canonical).pathname,html);assert(out.includes('FREE speech assessment'));const data=JSON.parse(out.match(/<script[^>]*>(.*?)<\/script>/s)[1]);assert(!data['@graph'][0].offers);assert.deepEqual(data['@graph'][1],product);
});
test('book templates and bag code use the book policy, without changing checkout operations',async()=>{
 for(const file of ['src/pages/books/[slug].astro','src/pages/books/[locale]/[slug].astro','src/pages/books/editions/[locale]/[slug].astro']){const source=await fs.readFile(file,'utf8');assert(source.includes('href="'+bookPolicyPath+'"'));assert(!source.includes('href="/refund-policy"'));}
 const cart=await fs.readFile('public/pinnacle-pages-scripts/book-commerce.js','utf8');assert(cart.includes("link.href='"+bookPolicyPath+"'"));assert(cart.includes("if(!root.querySelector('[data-book-order-policy]'))"));assert(!cart.includes("['Refund policy','/refund-policy']"));
 const layout=await fs.readFile('src/layouts/PageLayout.astro','utf8');assert(!layout.includes("price:assessmentOffer.price"));assert(layout.includes('serviceUrl:assessmentOffer.url'));
});
