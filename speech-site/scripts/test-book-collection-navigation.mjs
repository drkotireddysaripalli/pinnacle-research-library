import test from 'node:test';
import assert from 'node:assert/strict';
import {serveSpeech,BOOK_ROUTES} from '../deployment/speech-handler.mjs';
const old='<a href="#collections">Explore the complete collection ↓</a>';
const html='<html><body><h1>Complete library</h1>'+old+'</body></html>';
const env={ASSETS:{fetch:async()=>new Response(html,{headers:{'content-type':'text/html','content-length':String(Buffer.byteLength(html))}})}};
for(const format of ['pdf','softcover','hardbound'])test(format+' library links to actual collection hub and invalidates old validators',async()=>{
 const pathname='/books/pinnacle-101-four-book-'+format+'-collection',key='/pinnacle-pages-html/'+BOOK_ROUTES[pathname]+'.html';
 const inventory={[key]:'fixture-original'};
 const response=await serveSpeech(new Request('https://www.pinnacleblooms.org'+pathname,{headers:{'if-none-match':'"speech-fixture-original"'}}),env,inventory);
 assert.equal(response.status,200);assert.equal(response.headers.get('content-length'),null);
 assert.equal(await response.text(),html.replace(old,'<a href="/books#collections">Compare all collections and formats →</a>'));
 const current=await serveSpeech(new Request('https://www.pinnacleblooms.org'+pathname,{headers:{'if-none-match':response.headers.get('etag')}}),env,inventory);
 assert.equal(current.status,304);
 const head=await serveSpeech(new Request('https://www.pinnacleblooms.org'+pathname,{method:'HEAD'}),env,inventory);
 assert.equal(await head.text(),'');assert.equal(head.headers.get('etag'),response.headers.get('etag'));
});
test('other books retain their own collection link and validator',async()=>{
 const pathname='/books/speech-communication-101-my-message-matters',key='/pinnacle-pages-html/'+BOOK_ROUTES[pathname]+'.html';
 const response=await serveSpeech(new Request('https://www.pinnacleblooms.org'+pathname),env,{[key]:'fixture-original'});
 assert.equal(await response.text(),html);assert.equal(response.headers.get('etag'),'"speech-fixture-original"');
});
