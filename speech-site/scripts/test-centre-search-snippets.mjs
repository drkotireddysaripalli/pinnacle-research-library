import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {centreDetails} from '../src/data/centre-detail-content.ts';
import {centreSearchSnippets} from '../src/data/centre-search-snippets.mjs';
import policy from '../../tooling/sitemap-manager/discovery-policy.json' with {type:'json'};

test('two reviewed snippets are used by the maintained page source; controls retain their existing title',()=>{
 assert.equal(Object.keys(centreSearchSnippets).length,2);
 for(const [path,snippet] of Object.entries(centreSearchSnippets)){
  const page=centreDetails.find(p=>p.path===path);assert(page,path);
  assert.equal(page.title,snippet.title);assert.equal(page.description,snippet.description);
  assert(policy.indexable_centre_paths.includes(path));
  assert.match(page.enquiry,/enroll-autism-speech-aba-therapies-india\?service=help/);
 }
 for(const id of ['annanagar','kukatpally','lbnagar','labbipet','rajahmundry','tirupati']){
  const page=centreDetails.find(p=>p.id===id);assert(page,id);
  assert.equal(page.title,`Pinnacle Blooms ${page.label} | Child Development & Therapy Enquiries`);
 }
});

test('edge metadata changes exactly two approved pages without changing the body, canonical or contact journey',async()=>{
 const entry="import{repairCentreIndexability}from'./deployment/centre-indexability.mjs';export default{async fetch(r,e){return repairCentreIndexability(r,await e.ORIGIN.fetch(r))}}";
 const b=await build({stdin:{contents:entry,resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
 let headers={'content-type':'text/html','x-robots-tag':'index, follow'};
 const main='<main><h1>Original local child-development support</h1><a href="tel:+919100181181">Call 9100 181 181</a><a href="/enroll-autism-speech-aba-therapies-india?centre=fixture&amp;service=help">Enquire</a><form action="/api/enrolment"><input name="centre" value="fixture"></form></main>';
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-03',script:b.outputFiles[0].text,serviceBindings:{ORIGIN:r=>new Response('<html><head><title>Original title</title><meta name="description" content="Original description"><meta name="robots" content="index, follow"><link rel="canonical" href="'+new URL(r.url).origin+new URL(r.url).pathname+'"><meta property="og:title" content="Original title"><meta property="og:description" content="Original description"><meta name="twitter:title" content="Original title"><meta name="twitter:description" content="Original description"></head><body>'+main+'</body></html>',{headers})}}));
 const origin='https://www.pinnacleblooms.org';
 try{
  let changed=0;
  for(const path of [...policy.indexable_centre_paths,...policy.held_centre_paths]){
   const r=await mf.dispatchFetch(origin+path),html=await r.text(),snippet=centreSearchSnippets[path];
   assert(html.includes(main),'body/contact changed: '+path);
   assert(html.includes('rel="canonical" href="'+origin+path+'"'));
   if(snippet){
    changed++;assert(html.includes('<title>'+snippet.title+'</title>'));
    for(const selector of ['name="description"','property="og:description"','name="twitter:description"'])assert(html.includes(selector+' content="'+snippet.description+'"'));
    for(const selector of ['property="og:title"','name="twitter:title"'])assert(html.includes(selector+' content="'+snippet.title+'"'));
   }else assert(html.includes('<title>Original title</title>'));
  }
  assert.equal(changed,2);
  const path=Object.keys(centreSearchSnippets)[0];
  for(const h of [{authorization:'fixture'},{range:'bytes=0-100'},{'x-pinnacle-qa':'true'}])assert((await(await mf.dispatchFetch(origin+path,{headers:h})).text()).includes('<title>Original title</title>'));
  for(const hold of [{'x-robots-tag':'noindex,follow'},{'content-signal':'search=no'},{'set-cookie':'private=fixture'},{'cache-control':'no-transform'}]){
   headers={'content-type':'text/html','x-robots-tag':'index,follow',...hold};assert((await(await mf.dispatchFetch(origin+path)).text()).includes('<title>Original title</title>'));
  }
 }finally{await mf.dispose();}
});
