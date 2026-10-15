import test from 'node:test';
import assert from 'node:assert/strict';
import {handleManagedSitemap as handle} from '../asset-handler.mjs';
const xml='<?xml version="1.0" encoding="utf-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>';
test('unrelated/protected/existing discovery paths remain with their owner',async()=>{
 for(const path of ['/api/lead','/auth','/llms.txt','/robots.txt','/sitemap.xml','/centers']) assert.equal(await handle(new Request('https://www.pinnacleblooms.org'+path),{}),null);
});
test('each host uses its isolated namespace, GET/HEAD and stable etag',async()=>{
 let internal;const env={ASSETS:{async fetch(request){internal=request.url;return new Response(xml);}}};
 const a=await handle(new Request('https://materials.pinnacleblooms.org/sitemap-managed.xml'),env);
 assert.equal(a.status,200);assert.match(internal,/\/_managed_sitemaps\/materials\.pinnacleblooms\.org\/sitemap-managed.xml$/);assert.equal(await a.text(),xml);
 const b=await handle(new Request('https://materials.pinnacleblooms.org/sitemap-managed.xml',{method:'HEAD'}),env);assert.equal(await b.text(),'');
 const c=await handle(new Request('https://materials.pinnacleblooms.org/sitemap-managed.xml',{headers:{'If-None-Match':a.headers.get('ETag')}}),env);assert.equal(c.status,304);
});
test('SPA HTML cannot pretend to be an XML sitemap',async()=>{
 const response=await handle(new Request('https://www.pinnacleblooms.org/sitemap-pages-ask-001.xml'),{ASSETS:{fetch:async()=>new Response('<!doctype html><h1>Home</h1>')}});assert.equal(response.status,502);
});
test('conditional News leaves use the same isolated XML handler',async()=>{
 let internal;const r=await handle(new Request('https://www.pinnacleblooms.org/sitemap-news-news-001.xml'),{ASSETS:{fetch:async request=>{internal=request.url;return new Response('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>');}}});
 assert.equal(r.status,200);assert.match(r.headers.get('Content-Type'),/application\/xml/);assert.match(internal,/\/_managed_sitemaps\/www\.pinnacleblooms\.org\/sitemap-news-news-001\.xml$/);
});
test('unsupported methods, encoded paths and internal namespace are rejected',async()=>{
 for(const [path,method,status] of [['/site-map/%2ftest.xml','GET',404],['/sitemap-managed.xml','POST',405],['/_managed_sitemaps/www.pinnacleblooms.org/llms.txt','GET',404]]) assert.equal((await handle(new Request('https://www.pinnacleblooms.org'+path,{method}),{})).status,status);
});
test('advertised Mirracles compatibility XML uses reviewed managed bytes on the www host only',async()=>{
 let internal;const env={ASSETS:{fetch:async request=>{internal=request.url;return new Response('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>');}}};
 const r=await handle(new Request('https://www.pinnacleblooms.org/sitemaps/miracles.xml'),env);
 assert.equal(r.status,200);assert.match(internal,/\/_managed_sitemaps\/www\.pinnacleblooms\.org\/sitemaps\/miracles\.xml$/);
 assert.match(r.headers.get('Content-Type'),/application\/xml/);
 assert.equal(await handle(new Request('https://materials.pinnacleblooms.org/sitemaps/miracles.xml'),env),null);
 assert.equal((await handle(new Request('https://www.pinnacleblooms.org/sitemaps/miracles.xml?other=1'),env)).status,404);
});
