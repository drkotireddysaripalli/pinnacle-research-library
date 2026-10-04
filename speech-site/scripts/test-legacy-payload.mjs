import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {parse} from 'parse5';import {build} from 'esbuild';import {Miniflare,convertV4MiniflareOptions} from 'miniflare';import {DEBUG_BYTES,DEBUG_SHA256} from '../deployment/legacy-social-metadata/payload.mjs';import crypto from 'node:crypto';import {gunzipSync} from 'node:zlib';
const host='https://www.pinnacleblooms.org',path='/faq/english/aba-therapy/abatherapysocialskills';
const wrap=script=>`<!doctype html><html><head><meta property="og:url" content="http://www.pinnacleblooms.org${path}"><link rel="canonical" href="${host}${path}"></head><body><p>Family guidance తెలుగు 中文 🌸</p>${script}<a href="tel:+919100181181">9100 181 181</a></body></html>`;
test('streamed legacy debug filter is exact and preserves functional data',async t=>{
 let body=wrap('<script>const realFeature=1;</script>'),chunkSize=1024,headers={},status=200;
 const bundle=await build({stdin:{contents:`import {handle} from './deployment/legacy-social-metadata/entry.mjs';export default {fetch(r,e){return handle(r,q=>e.ORIGIN.fetch(q));}}`,resolveDir:process.cwd()},bundle:true,format:'esm',platform:'browser',write:false});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-04',script:bundle.outputFiles[0].text,serviceBindings:{ORIGIN:async()=>{const bytes=Buffer.from(body);let offset=0;return new Response(new ReadableStream({pull(c){if(offset===bytes.length){c.close();return;}const end=Math.min(bytes.length,offset+chunkSize);c.enqueue(bytes.subarray(offset,end));offset=end;}}),{status,headers:{'content-type':'text/html; charset=utf-8','cache-control':'private, max-age=60',...headers}});}}}));
 const run=async(input,options={})=>{body=input;headers=options.headers||{};status=options.status||200;chunkSize=options.chunkSize||1024;const r=await mf.dispatchFetch(host+path);return {r,text:Buffer.from(await r.arrayBuffer()).toString('utf8')};};
 const metaFix=input=>input.replace('content="http:','content="https:');
 try{
  for(const script of [
   '<script>const realFeature=1;</script>',
   '<script>console.log("A legitimate message");window.ready=true;</script>',
   '<script>console.log([{&quot;DisplayTitle&quot;:&quot;different source&quot;}]));</script>',
   '<script type="application/ld+json">{"@type":"FAQPage","name":"తెలుగు answer"}</script>',
   '<script src="/real-feature.js"></script>',
   '<script>'+' '.repeat(270000)+'window.largeScript=true;</script>',
   '<script>const string="<&amp; తెలుగు";</script><script>window.next=1;</script>'
  ])await t.test('retain unknown script '+script.slice(0,60),async()=>{const input=wrap(script);const result=await run(input);assert.equal(result.text,metaFix(input));assert.equal(result.r.headers.get('cache-control'),'private, max-age=60');});
  {
   const fixture=process.env.LEGACY_FAQ_FIXTURE?await fs.readFile(process.env.LEGACY_FAQ_FIXTURE,'utf8'):wrap('<script>'+gunzipSync(await fs.readFile(new URL('../tests/fixtures/legacy-faq-debug-script-20261004.txt.gz',import.meta.url))).toString('utf8')+'</script>');
   const doc=parse(fixture,{sourceCodeLocationInfo:true});let debug;
   const walk=node=>{if(node.tagName==='script'&&node.sourceCodeLocation?.startTag){const p=node.sourceCodeLocation,inner=fixture.slice(p.startTag.endOffset,p.endTag.startOffset);if(crypto.createHash('sha256').update(inner).digest('hex')===DEBUG_SHA256)debug={start:p.startTag.endOffset,end:p.endTag.startOffset,inner};}for(const child of node.childNodes||[])walk(child);};walk(doc);assert(debug);assert.equal(Buffer.byteLength(debug.inner),DEBUG_BYTES);
   for(const size of [7,65536])await t.test('captured 196KB invalid script only is removed, chunk '+size,async()=>{const input=wrap('<script>'+debug.inner+'</script><script>window.functional=true;</script>');const result=await run(input,{chunkSize:size});assert.equal(result.text,metaFix(input).replace(debug.inner,''));assert.equal(Buffer.byteLength(input)-Buffer.byteLength(result.text),DEBUG_BYTES-1);});
   await t.test('one-byte changed fingerprint remains untouched',async()=>{const input=wrap('<script>'+debug.inner.replace('console.log','console.dir')+'</script>');assert.equal((await run(input)).text,metaFix(input));});
   await t.test('captured payload and surrounding document have no other byte changes',async()=>{const result=await run(fixture,{chunkSize:16384});assert.equal(result.text,metaFix(fixture).replace(debug.inner,''));});
   for(const options of [{status:500},{headers:{'set-cookie':'fixture=1'}},{headers:{'cache-control':'no-store'}},{status:500,headers:{'x-pinnacle-social-metadata':'legacy-social-https-20261004','cache-control':'no-store, no-transform','etag':'"keep"'}}])await t.test('guarded response retains entire debug script '+JSON.stringify(options),async()=>{const result=await run(fixture,options);assert.equal(result.text,fixture);assert.equal(result.r.headers.get('x-pinnacle-legacy-payload'),null);if(options.headers?.etag)assert.equal(result.r.headers.get('etag'),options.headers.etag);});
  }
 }finally{await mf.dispose();}
});
