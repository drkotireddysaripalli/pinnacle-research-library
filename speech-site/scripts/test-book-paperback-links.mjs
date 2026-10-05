import test from 'node:test';import assert from 'node:assert/strict';
import {paperbackEditions,addPaperbackLinks,PAPERBACK_LINK_RELEASE} from '../deployment/book-paperback-links.mjs';
import {serveSpeech,BOOK_ROUTES} from '../deployment/speech-handler.mjs';
const origin='https://www.pinnacleblooms.org';
const fixture=(p,b)=>'<html><head><link rel="canonical" href="'+origin+p+'"><script type="application/ld+json">{"offers":{"price":799,"availability":"OutOfStock"}}</script></head><body>'+b+'</body></html>';
const strip=s=>s.replace(/<aside data-paperback-panel="[^"]+"[^>]*>[\s\S]*?<\/aside>/g,'');
for(const e of paperbackEditions)test(e.asin+' adds the separate retailer edition and preserves the existing offer',()=>{
 const old=fixture(e.path,'<button disabled>Out of stock</button><div class="pbn-book-actions">Sample</div>'),changed=addPaperbackLinks(old,e.path);
 assert(changed.includes(e.url)&&changed.includes('44 interior pages')&&changed.includes(e.isbn));assert(changed.includes('separate 46-page edition'));
 assert.equal(strip(changed),old);assert.equal(addPaperbackLinks(changed,e.path),changed);assert.equal((changed.match(/data-paperback-purchase=/g)||[]).length,1);
 assert(changed.includes('Check Amazon for current price, shipping/import charges and delivery to your address.'));
});
test('hub places only the three matching paperback alternatives and preserves previous retailer links',()=>{
 const old=fixture('/books','<article class="page">'+paperbackEditions.map(e=>'<article><h3>'+e.title+'</h3><nav><a href="'+e.path+'">Softcover ₹799</a><a data-kindle-purchase="existing" href="https://www.amazon.com/dp/EXISTING">Kindle</a></nav></article>').join('')+'<article><h3>ABA</h3><nav><a href="/books/aba-parent-education-101-understanding-everyday-behaviour-softcover">Softcover</a></nav></article><aside data-hardcover-panel="existing">Combined hardcover</aside></article>');
 const changed=addPaperbackLinks(old,'/books');assert.equal((changed.match(/data-paperback-purchase=/g)||[]).length,3);assert.equal(strip(changed),old);assert.equal(addPaperbackLinks(changed,'/books'),changed);assert(!/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<aside/.test(changed));
});
test('unrelated editions, wrong canonicals and absent insertion points remain unchanged',()=>{
 const p=paperbackEditions[0].path;
 for(const html of [fixture('/wrong','<div class="pbn-book-actions">'),fixture(p,'No insertion point'),fixture(p,'<div class="pbn-book-actions">').replace('</head>','<link rel="canonical" href="'+origin+p+'"></head>')])assert.equal(addPaperbackLinks(html,p),html);
 for(const p of ['/ask','/verify/','/books/hi','/books/te','/books/aba-parent-education-101-understanding-everyday-behaviour-softcover','/books/speech-communication-101-my-message-matters'])assert.equal(addPaperbackLinks('original',p),'original');
});
test('new cache validator cannot serve the old HTML; private and HEAD responses remain correct',async()=>{
 const e=paperbackEditions[0],p=e.path,key='/pinnacle-pages-html/'+BOOK_ROUTES[p]+'.html',body=fixture(p,'<div class="pbn-book-actions">Sample</div>'),env={ASSETS:{fetch:async()=>new Response(body,{headers:{'content-length':String(body.length),'last-modified':'Fri, 02 Oct 2026 01:00:00 GMT'}})}};
 const req=(headers={},method='GET')=>new Request(origin+p,{headers,method});
 const r=await serveSpeech(req(),env,{[key]:'old'}),html=await r.text(),tag=r.headers.get('etag');assert(html.includes(e.url));assert(tag.includes(PAPERBACK_LINK_RELEASE));assert.equal(r.headers.get('x-pinnacle-paperback-links'),PAPERBACK_LINK_RELEASE);assert.equal(r.headers.get('content-length'),null);assert.equal(r.headers.get('last-modified'),null);
 assert.equal((await serveSpeech(req({'if-none-match':tag.replace('-'+PAPERBACK_LINK_RELEASE,'')}),env,{[key]:'old'})).status,200);
 assert.equal((await serveSpeech(req({'if-none-match':tag}),env,{[key]:'old'})).status,304);
 const privateR=await serveSpeech(req({cookie:'fixture=1','if-none-match':tag}),env,{[key]:'old'});assert.equal(privateR.status,200);assert.equal(privateR.headers.get('cache-control'),'private, no-store');
 const head=await serveSpeech(req({},'HEAD'),env,{[key]:'old'});assert.equal(await head.text(),'');assert.equal(head.headers.get('etag'),tag);
});
