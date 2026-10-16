import test from 'node:test';import assert from 'node:assert/strict';
import {build} from 'esbuild';import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import data from '../deployment/selected-reference-data.json' with {type:'json'};
import optimized from '../deployment/selected-reference-optimized.json' with {type:'json'};
import {removePlaceholderVideo} from '../deployment/materials-placeholder-video.mjs';
import fs from 'node:fs';import {gunzipSync} from 'node:zlib';import {createHash} from 'node:crypto';
test('Selection binds193 existing parents and2049 exact ordinary gallery uses',()=>{
 assert.equal(Object.keys(data).length,193);assert.equal(Object.values(data).filter(r=>r.kind==='ability').length,47);assert.equal(Object.values(data).reduce((n,r)=>n+r.imageCount,0),2049);
 assert.equal(Object.keys(optimized).length,14);
 for(const r of Object.values(data)){assert(r.html.includes('loading="lazy"'));assert(/href="tel:(?:\+91)?9100181181"/.test(r.html));assert(!/<(?:script|form|iframe|input)\b|<[^>]+\shidden(?:=|[\s>])/.test(r.html));}
});
test('Rendered section is scoped, canonical, idempotent and preserves exact primary versus OG decisions',async()=>{
 const fixture=(u,row)=>`<html><head><link rel="canonical" href="${u}"><meta property="og:image" content="${row.replacement?.og_image.observed_exact_urls[0]||'https://images.pinnacleblooms.org/emblem.jpg'}"></head><body><main><article class="guru-article"><p>Original article and parent context</p></article><div class="guru-gallery"><figure><img src="${row.replacement?.visible_primary.observed_exact_urls[0]||'https://example.org/retained.jpg'}"></figure></div><a href="tel:+919100181181">Call</a></main></body></html>`;
 const samples=Object.entries(data).filter(([u,r])=>r.kind==='ability').slice(0,1).concat(Object.entries(data).filter(([u])=>/\/guru\/(5847|6129)\//.test(u)));
 const fixtures=Object.fromEntries(samples.map(([u,r])=>[u,fixture(u,r)]));
 const code=await build({stdin:{contents:`import{repairSelectedReferences as apply,serveSelectedReferenceAsset as asset}from'./deployment/selected-reference-gallery.mjs';const fixtures=${JSON.stringify(fixtures)};export default{fetch(r){const x=asset(r);if(x)return x;const html=fixtures[new URL(r.url).origin+new URL(r.url).pathname]||'<main>Untouched</main>';let response=new Response(html,{headers:{'content-type':'text/html','content-security-policy':"style-src 'self'"}});return apply(r,apply(r,response));}}`,resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-03',script:code.outputFiles[0].text}));
 try{for(const [u,row]of samples){const r=await mf.dispatchFetch(u),html=await r.text();assert(html.includes('Original article and parent context'));assert.equal(html.split(row.html).length-1,1);assert(html.includes('tel:+919100181181'));assert.equal(r.headers.get('content-security-policy'),"style-src 'self'");if(row.kind==='guru'){assert(!html.includes('src="'+row.replacement.visible_primary.observed_exact_urls[0]+'"'));assert(html.includes('src="'+row.replacement.sequence_zero_url+'"'));if(u.includes('/6129/'))assert(html.includes('content="'+row.replacement.og_image.observed_exact_urls[0]+'"'));}}
 const u=samples[0][0];assert(!(await(await mf.dispatchFetch(u,{headers:{authorization:'private'}})).text()).includes('data-source="ability_reference_illustrations_v1"'));
 assert.equal(await(await mf.dispatchFetch('https://www.pinnacleblooms.org/api/enrolment')).text(),'<main>Untouched</main>');
 const image=Object.values(optimized)[0],r=await mf.dispatchFetch('https://www.pinnacleblooms.org'+image.path);assert.equal(r.headers.get('content-type'),'image/webp');assert.equal((await r.arrayBuffer()).byteLength,image.bytes);
 }finally{await mf.dispose();}
});
test('Tactile placeholder removal retains valid video, article, player and malformed JSON boundaries',()=>{
 const valid={'@type':'VideoObject',embedUrl:'https://www.youtube.com/embed/verified-id'},article={'@type':'Article',headline:'Retain article'},placeholder={'@type':'VideoObject',embedUrl:'https://www.youtube.com/embed/VIDEO_ID'};
 assert.deepEqual(removePlaceholderVideo({'@context':'https://schema.org','@graph':[article,placeholder,valid]}),{'@context':'https://schema.org','@graph':[article,valid]});assert.equal(removePlaceholderVideo(placeholder),undefined);assert.deepEqual(removePlaceholderVideo(valid),valid);
});

test('actual legacy Ability and exceptional Guru containers receive their selected section without a main/article element',async()=>{
 const folder=new URL('../tests/fixtures/selected-reference-legacy/',import.meta.url),manifest=JSON.parse(fs.readFileSync(new URL('manifest.json',folder)));
 const fixtures=Object.fromEntries(manifest.map(r=>{const raw=gunzipSync(fs.readFileSync(new URL(r.name+'.html.gz',folder)));assert.equal(createHash('sha256').update(raw).digest('hex'),r.bodySHA256);return[r.url,raw.toString()];}));
 const code=await build({stdin:{contents:`import{repairSelectedReferences}from'./deployment/selected-reference-gallery.mjs';const fixtures=${JSON.stringify(fixtures)};export default{fetch(r){return repairSelectedReferences(r,new Response(fixtures[new URL(r.url).origin+new URL(r.url).pathname],{headers:{'content-type':'text/html'}}));}}`,resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-03',script:code.outputFiles[0].text}));
 try{for(const [u,original]of Object.entries(fixtures)){assert(!/<main\b|<article\b/i.test(original));const html=await(await mf.dispatchFetch(u)).text(),row=data[u];fs.mkdirSync('audits/selected-reference-legacy',{recursive:true});fs.writeFileSync('audits/selected-reference-legacy/'+row.kind+'.html',html);assert.equal(html.split(row.html).length-1,1,u+' exact selected section');assert.equal((html.match(/data-selected-reference-style/g)||[]).length,1,u+' selected stylesheet');assert(html.includes('9100181181'));
  if(row.kind==='guru'){assert(!html.includes('src="'+row.replacement.visible_primary.observed_exact_urls[0]+'"'));assert(html.includes('src="'+row.replacement.sequence_zero_url+'"'));assert(html.includes(row.replacement.og_image.observed_exact_urls[0]));}
 }}finally{await mf.dispose();}
});
