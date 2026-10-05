import test from 'node:test';import assert from 'node:assert/strict';
import {kindleEditions,addKindleLinks,hasKindleEdition,kindleDetail,KINDLE_LINK_RELEASE} from '../deployment/book-kindle-links.mjs';
import {serveSpeech,BOOK_ROUTES} from '../deployment/speech-handler.mjs';
const origin='https://www.pinnacleblooms.org';
const fixture=(path,body)=>`<html><head><link rel="canonical" href="${origin+path}"><script type="application/ld+json">{"@type":"Book","offers":{"price":799}}</script></head><body>${body}</body></html>`;
const play='<aside class="pbn-play-purchase" data-astro-cid-existing><a href="https://play.google.com/store/books/details?id=existing" data-astro-cid-existing>Buy on Google Play Books</a><p data-astro-cid-existing>Existing PDF details</p></aside>';
test('exactly two English retailer identities; no prices or PDF identifiers replaced',()=>{
 assert.equal(kindleEditions.length,2);assert.deepEqual(kindleEditions.map(x=>x.asin),['B0HLYKFDQ9','B0HLYFTT36']);
 for(const x of kindleEditions){assert.equal(x.url,'https://www.amazon.in/dp/'+x.asin);assert(!('price' in x));assert(x.sku.endsWith('-EN-PDF'));}
});
for(const e of kindleEditions)test(e.asin+' preserves all original page bytes outside its one addition',()=>{
 const original=fixture(e.path,play),result=addKindleLinks(original,e.path);
 assert(result.includes(e.url)&&result.includes(kindleDetail));
 assert.equal(result.replace(/<p data-kindle-detail[^>]*>[\s\S]*?<\/p>/,''),original);
 assert.equal(addKindleLinks(result,e.path),result);
 assert.equal((result.match(/data-kindle-purchase=/g)||[]).length,1);
 assert(result.includes('data-astro-cid-existing>Buy on Amazon Kindle'));
});
test('library adds only two links to their matching cards, including a nested page article',()=>{
 const cards=[{path:'/books/unrelated'},...kindleEditions].map(e=>`<article><a href="${e.path}">Book</a><nav><a href="${e.path}">PDF</a></nav></article>`).join('');
 const original=fixture('/books','<article class="page">'+cards+'</article>'),result=addKindleLinks(original,'/books');
 assert.equal((result.match(/data-kindle-purchase=/g)||[]).length,2);
 assert.equal(result.replace(/<a[^>]*data-kindle-purchase=[\s\S]*?<\/a>/g,''),original);
 assert.equal(addKindleLinks(result,'/books'),result);
});
test('unrelated paths, wrong canonicals and changed structure fail closed',()=>{
 for(const p of ['/ask','/verify/','/books/hi/ot-101','/books/te/special-education-101','/books/editions/te/ot-101']){assert.equal(hasKindleEdition(p),false);assert.equal(addKindleLinks('unchanged',p),'unchanged');}
 const p=kindleEditions[0].path,wrong=fixture('/unrelated',play);assert.equal(addKindleLinks(wrong,p),wrong);
 const changed=fixture(p,play.replace('pbn-play-purchase','unknown'));assert.equal(addKindleLinks(changed,p),changed);
});
test('runtime preserves earlier library repair and updates response validators and HEAD',async()=>{
 const pathname='/books',entry=kindleEditions[0],body=fixture(pathname,`<article><a href="${entry.path}">Book</a><nav>PDF</nav></article><h3>Connect with Pinnacle</h3>`);
 const key='/pinnacle-pages-html/'+BOOK_ROUTES[pathname]+'.html';
 const env={ASSETS:{fetch:async()=>new Response(body,{headers:{'content-length':String(body.length),'last-modified':'Fri, 02 Oct 2026 01:00:00 GMT'}})}};
 const request=(headers={},method='GET')=>new Request(origin+pathname,{headers,method});
 const response=await serveSpeech(request(),env,{[key]:'prior'}),text=await response.text(),etag=response.headers.get('etag');
 assert(text.includes('data-first-conversation-link'));assert(text.includes(entry.url));assert(etag.includes(KINDLE_LINK_RELEASE));
 assert.equal(response.headers.get('content-length'),null);assert.equal(response.headers.get('last-modified'),null);
 assert.equal((await serveSpeech(request({'if-none-match':etag}),env,{[key]:'prior'})).status,304);
 const head=await serveSpeech(request({},'HEAD'),env,{[key]:'prior'});assert.equal(await head.text(),'');assert.equal(head.headers.get('etag'),etag);
 const privateResponse=await serveSpeech(request({cookie:'fixture=1','if-none-match':etag}),env,{[key]:'prior'});assert.equal(privateResponse.status,200);assert.equal(privateResponse.headers.get('cache-control'),'private, no-store');
});
