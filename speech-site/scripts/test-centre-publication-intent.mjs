import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import{build}from'esbuild';import{Miniflare,convertV4MiniflareOptions}from'miniflare';
const origin='https://www.pinnacleblooms.org',policy=JSON.parse(await fs.readFile('../tooling/sitemap-manager/discovery-policy.json','utf8'));
test('all source-approved centre enquiry pages have production parity; explicit status and QA/private guards remain',async()=>{
 const source="import{repairCentreIndexability}from'./deployment/centre-indexability.mjs';import{repairClearanceLinks}from'./deployment/shared-clearance.mjs';export default{async fetch(r,e){return repairClearanceLinks(r,repairCentreIndexability(r,await e.ORIGIN.fetch(r)))}}";
 const result=await build({stdin:{contents:source,resolveDir:process.cwd()},format:'esm',bundle:true,write:false});let headers={'content-type':'text/html','x-robots-tag':'index, follow'};
 const html='<html><head><meta name="robots" content="noindex, nofollow"><link rel="canonical" href="https://d.pinnacleblooms.org/group-teaching"></head><body><div class="preview-note">Design preview</div><main><a href="tel:+919100181181">Call</a><form action="/api/enrolment"><input name="centre" value="12"></form><p>Original public content.</p></main></body></html>';
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-03',script:result.outputFiles[0].text,serviceBindings:{ORIGIN:()=>new Response(html,{headers})}}));
 try{
  assert.equal(policy.indexable_centre_paths.length,60);assert.equal(policy.held_centre_paths.length,2);
  for(const path of policy.indexable_centre_paths){const r=await mf.dispatchFetch(origin+path),body=await r.text();assert(body.includes('content="index, follow, max-image-preview:large"'),path);assert(!body.includes('class="preview-note"'),path);assert(body.includes('action="/api/enrolment"')&&body.includes('name="centre" value="12"')&&body.includes('tel:+919100181181'));}
  for(const path of policy.held_centre_paths){const r=await mf.dispatchFetch(origin+path);assert.match(r.headers.get('x-robots-tag'),/noindex/);assert((await r.text()).includes('content="noindex, nofollow"'));}
  const path=policy.indexable_centre_paths[0];
  for(const h of [{authorization:'fixture'},{range:'bytes=0-100'},{'x-pinnacle-qa':'true'}])assert((await(await mf.dispatchFetch(origin+path,{headers:h})).text()).includes('content="noindex, nofollow"'));
  for(const update of [{'x-robots-tag':'noindex,follow'},{'content-signal':'search=no'},{'set-cookie':'private=fixture'},{'cache-control':'no-transform'}]){headers={'content-type':'text/html','x-robots-tag':'index,follow',...update};assert((await(await mf.dispatchFetch(origin+path)).text()).includes('content="noindex, nofollow"'));}
  headers={'content-type':'text/html','x-robots-tag':'index,follow'};
  const canonical=await(await mf.dispatchFetch(origin+'/group-teaching')).text();assert(canonical.includes('rel="canonical" href="'+origin+'/group-teaching"'));assert(canonical.includes('Original public content.'));
 }finally{await mf.dispose();}
});
