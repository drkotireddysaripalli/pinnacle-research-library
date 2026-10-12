import test from 'node:test';import assert from 'node:assert/strict';import {build} from 'esbuild';import {Miniflare,convertV4MiniflareOptions} from 'miniflare';import {LegacyIndentationCompactor} from '../deployment/legacy-social-metadata/compact.mjs';
const compact=(value,size=7)=>{const c=new LegacyIndentationCompactor();let result='';for(let i=0;i<value.length;i+=size)result+=c.push(value.slice(i,i+size));return result+c.push('',true);};
test('streaming indentation retains separators, meaningful text, native script and every attribute',()=>{
 const input='<div>\r\n      <a href="/ask?q=a&gt;b">తెలుగు A</a>\r\n   <span>Hello world</span>  <b>B</b>\r\n </div>';
 const expected='<div> <a href="/ask?q=a&gt;b">తెలుగు A</a> <span>Hello world</span>  <b>B</b> </div>';
 for(const size of [1,2,7,256,65536])assert.equal(compact(input,size),expected);
});
test('raw script/style, preformatted and editable content remain byte identical',()=>{
 const parts=['<script>var a="<div>\n </div>";if (a>0) a--;</script>','<style>p::before{content:"<span>\n </span>"}</style>','<pre>\n   <span>\n  content</span>\n </pre>','<textarea>\n   <div>anything</div>\n </textarea>','<div style="white-space: pre-wrap">\n    <span>\n </span></div>','<div contenteditable="true">\n   <div>\n </div></div>','<svg><g>\n   <text>hello</text>\n </g></svg>','<math>\n   <mi>x</mi>\n </math>','<!-- <div>\n  </div> -->','<![CDATA[<div>\n  </div>]]>'];
 for(const s of parts)for(const size of [1,7,65536])assert.equal(compact(s,size),s);
});
test('large text and incomplete/unknown markup pass through without partial whitespace mutation',()=>{
 for(const s of ['<div>'+(' '.repeat(70000))+'some answer</div>','<div>'+(' '.repeat(70000))+'</div>','<span title="unfinished','one < two\n  three','<div>Meaningful\n  multiline answer</div>'])assert.equal(compact(s,1024),s);
});
test('actual Worker stream preserves UTF-8, response guards and private-cache semantics',async()=>{
 const bundle=await build({stdin:{contents:"import {compactLegacyIndentation} from './deployment/legacy-social-metadata/compact.mjs';export default {async fetch(r,e){return compactLegacyIndentation(r,await e.ORIGIN.fetch(r))}}",resolveDir:process.cwd()},bundle:true,platform:'browser',format:'esm',write:false});
 let status=200,headers={},body='<html><body>\n  <a href="tel:+919100181181">తెలుగు</a>\n <form action="/api/enrolment"><input name="service" value="speech"></form>\n</body></html>';
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:bundle.outputFiles[0].text,compatibilityDate:'2026-10-04',serviceBindings:{ORIGIN:()=>{const bytes=new TextEncoder().encode(body);let i=0;return new Response(new ReadableStream({pull(c){if(i===bytes.length){c.close();return;}c.enqueue(bytes.slice(i,i+7));i=Math.min(i+7,bytes.length);}}),{status,headers:{'content-type':'text/html; charset=utf-8','cache-control':'private, max-age=60','vary':'*, accept-encoding','etag':'"old"',...headers}});}}}));
 try{
  const r=await mf.dispatchFetch('https://www.pinnacleblooms.org/c/hand-flapping-therapy');assert.equal(await r.text(),compact(body));assert.equal(r.headers.get('cache-control'),'private, max-age=60');assert.equal(r.headers.get('vary'),'*, accept-encoding');assert.equal(r.headers.get('etag'),null);assert.equal(r.headers.get('x-pinnacle-legacy-compact'),'indentation-20261012');
  for(const guard of [{url:'/api/enrolment'},{url:'/ask/question'},{url:'/faq/english'},{url:'/staff'},{url:'/c/hand-flapping-therapy',headers:{'cache-control':'no-store'}},{url:'/c/hand-flapping-therapy',headers:{'cache-control':'no-transform'}},{url:'/c/hand-flapping-therapy',headers:{'set-cookie':'fixture=1'}},{url:'/c/hand-flapping-therapy',headers:{'x-robots-tag':'noindex'}},{url:'/c/hand-flapping-therapy',status:500},{url:'/c/hand-flapping-therapy',requestHeaders:{authorization:'fixture'}}]){headers=guard.headers||{};status=guard.status||200;const x=await mf.dispatchFetch('https://www.pinnacleblooms.org'+guard.url,{headers:guard.requestHeaders});assert.equal(await x.text(),body);assert.equal(x.headers.get('x-pinnacle-legacy-compact'),null);assert.equal(x.headers.get('etag'),'"old"');}
 }finally{await mf.dispose();}
});
