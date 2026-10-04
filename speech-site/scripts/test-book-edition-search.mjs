import test from 'node:test';import assert from 'node:assert/strict';
import editions from '../src/data/book-merchant-editions.json' with {type:'json'};
import {bookEditionDescription} from '../src/data/book-edition-search.mjs';
import {editionSearch} from '../deployment/book-edition-search-content.mjs';
import {rewriteEditionSearch,editionSearchEntry,EDITION_SEARCH_RELEASE} from '../deployment/book-edition-search.mjs';
import {serveSpeech,BOOK_ROUTES} from '../deployment/speech-handler.mjs';
const origin='https://www.pinnacleblooms.org',escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;');
function fixture(path,description){return '<html><head><link rel="canonical" href="'+origin+path+'">'+['name="description"','property="og:description"','name="twitter:description"'].map(a=>'<meta '+a+' content="'+escape(description)+'">').join('')+'<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'WebPage','@id':origin+path+'#page',description},{'@type':'Product',description:'Protected product detail',offers:{price:799}}]})+'</script></head><body><h1>Approved title</h1><a href="tel:+919100181181">Call</a></body></html>';}
test('20 subject-specific summaries from 22 unchanged edition records',()=>{
 assert.equal(Object.keys(editionSearch).length,20);assert.equal(new Set(Object.values(editionSearch).map(x=>x.after)).size,20);
 for(const e of editions){const summary=bookEditionDescription(e);assert(summary.startsWith(e.locale==='hi'?'Hindi':'Telugu')||summary.startsWith('Two '+(e.locale==='hi'?'Hindi':'Telugu')));assert(summary.includes('PDF'));if(e.included_books.length===4)assert.equal(summary,e.seo_description);else{assert(summary.length<200);assert.equal(editionSearch[e.path].after,summary);}}
});
for(const [path,entry]of Object.entries(editionSearch))test(path+' changes only the four intended summaries',()=>{
 const old=fixture(path,entry.before),result=rewriteEditionSearch(old,path);
 assert.notEqual(result,old);assert.equal(rewriteEditionSearch(result,path),result);
 assert.equal(result.split('</head>')[1],old.split('</head>')[1]);
 const data=JSON.parse(result.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);assert.equal(data['@graph'][0].description,entry.after);assert.deepEqual(data['@graph'][1],{'@type':'Product',description:'Protected product detail',offers:{price:799}});
 assert.equal((result.match(new RegExp('content="'+escape(entry.after).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'"','g'))||[]).length,3);
 assert.equal(rewriteEditionSearch(old.replace('rel="canonical"','rel="alternate"'),path),old.replace('rel="canonical"','rel="alternate"'));
 const drift=old.replace('name="twitter:description"','name="unrelated"');assert.equal(rewriteEditionSearch(drift,path),drift);
});
test('only exact English-information edition routes change; native and unrelated pages stay intact',()=>{
 for(const path of ['/books/hi/speech-101','/books/te/ot-101','/books/editions/hi/speech-101/','/ask','/verify/','/books/editions/te/four-book-101']){assert.equal(editionSearchEntry(path),null);assert.equal(rewriteEditionSearch('original',path),'original');}
});
test('response validators, HEAD, private caching and alias remain correct',async()=>{
 const path='/books/editions/hi/speech-101',entry=editionSearch[path],key='/pinnacle-pages-html/'+BOOK_ROUTES[path]+'.html',html=fixture(path,entry.before),inventory={[key]:'prior'};
 const env={ASSETS:{fetch:async()=>new Response(html,{headers:{'content-length':String(html.length),'last-modified':'Fri, 02 Oct 2026 01:00:00 GMT'}})}};
 const req=(headers={},method='GET')=>new Request(origin+path,{headers,method});const r=await serveSpeech(req({'if-none-match':'"speech-prior"'}),env,inventory);
 assert.equal(r.status,200);assert.equal(r.headers.get('content-length'),null);assert.equal(r.headers.get('last-modified'),null);assert.equal(r.headers.get('x-pinnacle-edition-search'),EDITION_SEARCH_RELEASE);assert((await r.text()).includes(entry.after));
 const etag=r.headers.get('etag');assert(etag.includes(EDITION_SEARCH_RELEASE));assert.equal((await serveSpeech(req({'if-none-match':etag}),env,inventory)).status,304);
 const head=await serveSpeech(req({},'HEAD'),env,inventory);assert.equal(await head.text(),'');assert.equal(head.headers.get('etag'),etag);
 const privateResponse=await serveSpeech(req({cookie:'fixture=1','if-none-match':etag}),env,inventory);assert.equal(privateResponse.status,200);assert.equal(privateResponse.headers.get('cache-control'),'private, no-store');
 const alias=await serveSpeech(new Request(origin+path+'/?source=parent'),env,inventory);assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),origin+path+'?source=parent');
});
