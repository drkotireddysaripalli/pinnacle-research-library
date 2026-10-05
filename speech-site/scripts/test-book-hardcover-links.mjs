import test from 'node:test';import assert from 'node:assert/strict';
import {hardcoverEditions,hardcoverPanel,hardcoverHubStock,addHardcoverLinks,HARDCOVER_LINK_RELEASE} from '../deployment/book-hardcover-links.mjs';
import {serveSpeech,BOOK_ROUTES} from '../deployment/speech-handler.mjs';
const origin='https://www.pinnacleblooms.org',fixture=(p,b)=>'<html><head><link rel="canonical" href="'+origin+p+'"><script type="application/ld+json">{"offers":{"price":2999,"availability":"OutOfStock"}}</script></head><body>'+b+'</body></html>';
const strip=s=>s.replace(/<aside data-hardcover-panel="[^"]+"[^>]*>[\s\S]*?<\/aside>/g,'').replace(/<!--pbn-hardcover-card-start--><div[^>]*>([\s\S]*?)<\/div><!--pbn-hardcover-card-end-->/g,'$1').replace(hardcoverHubStock,'Printed editions are out of stock.');
for(const e of hardcoverEditions)test(e.asin+' keeps existing catalogue copy and schema intact',()=>{
 const old=fixture(e.path,'<button disabled>Out of stock</button><div class="pbn-book-actions">Sample</div>'),changed=addHardcoverLinks(old,e.path);
 assert(changed.includes(e.url)&&changed.includes(String(e.pages))&&changed.includes(e.isbn));assert.equal(strip(changed),old);assert.equal(addHardcoverLinks(changed,e.path),changed);assert.equal((changed.match(/data-hardcover-purchase=/g)||[]).length,1);
});
test('hub places two standalone links in the matching cards without nested anchors or duplicated panels',()=>{
 const [pair,four]=hardcoverEditions;
 const old=fixture('/books','<article class="page"><div class="pbn-book-sets"><a href="'+four.path+'"><h3>Hardbound</h3><strong>₹5,499</strong></a></div><p>Printed editions are out of stock.</p><article><h3>Speech and OT</h3><nav><a href="'+pair.path+'">Hardbound ₹2,999</a></nav></article></article>');
 const changed=addHardcoverLinks(old,'/books');assert.equal((changed.match(/data-hardcover-purchase=/g)||[]).length,2);assert.equal(strip(changed),old);assert.equal(addHardcoverLinks(changed,'/books'),changed);
 assert(!/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<aside/.test(changed));
});
test('wrong canonical, unrelated books and changed structure are untouched',()=>{
 const p=hardcoverEditions[0].path;assert.equal(addHardcoverLinks(fixture('/wrong','<div class="pbn-book-actions">'),p),fixture('/wrong','<div class="pbn-book-actions">'));
 for(const p of ['/ask','/verify/','/about-pinnacle-proven-improvement-rate','/books/occupational-therapy-101-i-belong-in-everyday-life','/books/te'])assert.equal(addHardcoverLinks('original',p),'original');
 assert.equal(addHardcoverLinks(fixture(p,'No insertion target'),p),fixture(p,'No insertion target'));
});
test('response validators and cache handling include the new edition revision',async()=>{
 const p=hardcoverEditions[1].path,key='/pinnacle-pages-html/'+BOOK_ROUTES[p]+'.html',body=fixture(p,'<div class="pbn-book-actions"><a href="#collections">Explore the complete collection ↓</a></div>'),env={ASSETS:{fetch:async()=>new Response(body,{headers:{'content-length':String(body.length),'last-modified':'Fri, 02 Oct 2026 01:00:00 GMT'}})}};
 const req=(headers={},method='GET')=>new Request(origin+p,{headers,method});
 const r=await serveSpeech(req(),env,{[key]:'old'}),html=await r.text(),tag=r.headers.get('etag');assert(html.includes(hardcoverEditions[1].url));assert(html.includes('/books#collections'));assert(tag.includes(HARDCOVER_LINK_RELEASE));assert.equal(r.headers.get('content-length'),null);assert.equal(r.headers.get('last-modified'),null);
 assert.equal((await serveSpeech(req({'if-none-match':tag}),env,{[key]:'old'})).status,304);
 const privateR=await serveSpeech(req({cookie:'fixture=1','if-none-match':tag}),env,{[key]:'old'});assert.equal(privateR.status,200);assert.equal(privateR.headers.get('cache-control'),'private, no-store');
 const head=await serveSpeech(req({},'HEAD'),env,{[key]:'old'});assert.equal(await head.text(),'');assert.equal(head.headers.get('etag'),tag);
});

