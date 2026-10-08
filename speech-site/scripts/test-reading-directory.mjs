import test from 'node:test';import assert from 'node:assert/strict';
import {fontFaceKey} from '../deployment/legacy-social-metadata/reading-directory.mjs';
import {build} from 'esbuild';import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
test('font deduplication accepts only equivalent complete font-face declarations',()=>{
 const a="@font-face {font-family:'A';src:url(a.woff2);}",b="@font-face {font-family:'B';src:url(b.woff2);}";
 assert.equal(fontFaceKey(a+b),fontFaceKey(b+a));assert.notEqual(fontFaceKey(a),fontFaceKey(b));assert.equal(fontFaceKey(a+'body{color:red}'),null);assert.equal(fontFaceKey('/*keep*/'+a),null);
});
test('native directory keeps article, all links, changed CSS, and accessible summaries',async()=>{
 const bundle=await build({stdin:{contents:"import {repairKnownLegacyPerformance} from './deployment/legacy-social-metadata/performance.mjs';export default {async fetch(r){return repairKnownLegacyPerformance(new Response(await r.text(),{headers:{'content-type':'text/html'}}),new Request('https://www.pinnacleblooms.org/ma/fixture'));}}",resolveDir:process.cwd(),sourcefile:'directory-test.mjs'},bundle:true,format:'esm',write:false});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:bundle.outputFiles[0].text,compatibilityDate:'2026-09-27'}));
 const font="@font-face {font-family:'Fixture';src:url(f.woff2);}";
 const html=`<html><head><style>${font}</style><style>.article{color:navy}</style></head><body><article class="article">Unchanged useful answer</article><div class="sunshine-all-sections"><div class="sunshine-block"><style>${font}</style><div class="cm-section-main"><div class="expandable-section expanded"><h2 class="pinnacle-title green toggle-btn" onclick="oldToggle()">Materials</h2><div class="content-sunshine"><div><a href="/ma/ball">Ball</a><a href="/ma/book">Book</a></div></div></div></div></div></div></body></html>`;
 try{const result=await(await mf.dispatchFetch('https://fixture.test/',{method:'POST',body:html})).text();assert(result.includes('<article class="article">Unchanged useful answer</article>'));assert(result.includes('<summary>Materials</summary>'));assert(result.includes('<details class="pinnacle-topic-directory">'));for(const href of ['/ma/ball','/ma/book'])assert(result.includes(`href="${href}"`));assert.equal(result.split(font).length-1,1);assert(result.includes('.article{color:navy}'));assert(!result.includes('oldToggle'));assert(!result.includes('expandable-section expanded'));}finally{await mf.dispose();}
});
