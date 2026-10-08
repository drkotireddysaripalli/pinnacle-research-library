import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
const url='https://www.pinnacleblooms.org/c/hand-flapping-therapy';
const original='Hand flapping in children can significantly impact their ability to engage socially and perform daily tasks. Pinnacle Blooms Network provides comprehensive, personalized therapies to help children manage hand flapping and improve their quality of life.';
const html=`<html><head><title>Old record</title><meta name="description" content="Old summary"><meta property="og:title" content="Old record"><meta property="og:description" content="Old summary"><meta property="og:url" content="${url}"><link rel="canonical" href="${url}"></head><body><header>Approved header</header><main><h1 class="pinnacle-title">Understanding and Managing Hand Flapping in Children | Pinnacle Blooms Network</h1><p class="pinnacle-paragraph">${original}</p><div>Remaining record</div></main><footer>Approved footer</footer></body></html>`;
test('exact hand-flapping correction changes useful content and metadata, retaining route/privacy boundaries',async t=>{
 let fixture={body:html,status:200,headers:{}};
 const bundled=await build({stdin:{contents:`import {repairPriorityContent} from './deployment/legacy-social-metadata/priority-content.mjs';export default {async fetch(r,e){return repairPriorityContent(r,await e.ORIGIN.fetch(r))}}`,resolveDir:process.cwd()},bundle:true,format:'esm',platform:'browser',write:false});
 const runtime=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-04',script:bundled.outputFiles[0].text,serviceBindings:{ORIGIN:async()=>new Response(fixture.body,{status:fixture.status,headers:{'content-type':'text/html; charset=utf-8','cache-control':'private, max-age=60','etag':'old',...fixture.headers}})}}));
 const run=async(f={},u=url,opts={})=>{fixture={body:html,status:200,headers:{},...f};const r=await runtime.dispatchFetch(u,opts);return {r,body:await r.text()};};
 try{
  await t.test('meaning, next step and sources agree with updated title/H1',async()=>{const {r,body}=await run();assert(body.includes('Hand Flapping in Children: Meaning &amp; Support'));assert(body.includes('when support helps'));assert(body.includes('does not diagnose autism'));assert(body.includes('data-pinnacle-priority-content'));assert(body.includes('tel:+919100181181'));assert(body.includes('autism.org.uk'));assert.equal((body.match(/<h1\b/g)||[]).length,1);for(const x of ['Approved header','Approved footer','Remaining record'])assert(body.includes(x));assert(!body.includes(original));assert.equal(r.headers.get('cache-control'),'private, max-age=60');assert.equal(r.headers.get('etag'),null);});
  await t.test('campaign request keeps canonical and functional link',async()=>{const {body}=await run({},url+'?utm_source=validation_test&gclid=test');assert(body.includes('data-pinnacle-priority-content'));assert(body.includes('href="'+url+'"'));});
  for(const [name,f,u,opts] of [
   ['unknown record',{body:html.replace(original,'Different original record')},url,{}],
   ['wrong canonical',{body:html.replaceAll(url,url+'-other')},url,{}],
   ['adjacent page',{},url+'-other',{}],
   ['noindex',{headers:{'x-robots-tag':'noindex'}},url,{}],
   ['private cookie',{headers:{'set-cookie':'secret=value'}},url,{}],
   ['no-store',{headers:{'cache-control':'private, no-store'}},url,{}],
   ['error',{status:503},url,{}],
   ['authorization',{},url,{headers:{authorization:'Bearer fixture'}}],
  ])await t.test('pass through '+name,async()=>{const {r,body}=await run(f,u,opts);assert.equal(body,f.body||html);assert.equal(r.headers.get('x-pinnacle-priority-content'),null);});
 }finally{await runtime.dispose();}
});
