import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {build} from 'esbuild';import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {repairLegacyIdentity,organization} from '../deployment/legacy-social-metadata/organization.mjs';
test('exact legacy organization becomes verified current legal and brand graph only',async()=>{
 const raw=await fs.readFile('tests/fixtures/legacy-organization-invalid.txt','utf8');
 const fixed=await repairLegacyIdentity(raw);assert.deepEqual(JSON.parse(fixed),organization);assert.equal(organization.name,'Bharath Healthcare Laboratories Private Limited');
 assert.equal(await repairLegacyIdentity(raw+' changed'),raw+' changed');
 assert(!('award' in organization));assert(!('employee' in organization));
});
test('paid journey script refreshes managed public pages without changing private or external scripts',async()=>{
 const markup='<header>Keep header</header><script src="/pinnacle-pages-scripts/speech-measurement.js?v=old"></script><script src="https://elsewhere.example/pinnacle-pages-scripts/speech-measurement.js"></script>';
 const out=await build({stdin:{contents:`import {repairSharedNavigation} from './deployment/shared-navigation.mjs';export default {fetch(r){return repairSharedNavigation(r,new Response(${JSON.stringify(markup)},{headers:{'content-type':'text/html','cache-control':new URL(r.url).pathname==='/private'?'private, no-store':'public,max-age=300'}}))}}`,resolveDir:process.cwd()},bundle:true,write:false,format:'esm'});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:out.outputFiles[0].text,compatibilityDate:'2026-10-08'}));
 try{
  const html=await(await mf.dispatchFetch('https://www.pinnacleblooms.org/centers')).text();
  assert(html.includes('src="/pinnacle-pages-scripts/speech-measurement.js?v=paid-journey-20261008"'));
  assert(html.includes('src="https://elsewhere.example/pinnacle-pages-scripts/speech-measurement.js"'));
  const privateHtml=await(await mf.dispatchFetch('https://www.pinnacleblooms.org/private')).text();
  assert.equal(privateHtml,markup);
 }finally{await mf.dispose();}
});
test('shared navigation repairs public HTML and preserves private responses',async()=>{
 const out=await build({stdin:{contents:"import {repairSharedNavigation} from './deployment/shared-navigation.mjs'; export default {fetch(r){return repairSharedNavigation(r,new Response('<header><a href=\"https://pinnacleblooms.org/ask/\">Ask</a></header><p>Keep body</p>',{headers:{'content-type':'text/html','cache-control':new URL(r.url).pathname==='/private'?'private, no-store':'public,max-age=300'}}))}}",resolveDir:process.cwd()},bundle:true,write:false,format:'esm'});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:out.outputFiles[0].text,compatibilityDate:'2026-09-18'}));
 try{const publicResponse=await mf.dispatchFetch('https://example.com/');assert.equal(await publicResponse.text(),'<header><a href="https://pinnacleblooms.org/ask">Ask</a></header><p>Keep body</p>');
 const privateResponse=await mf.dispatchFetch('https://example.com/private');assert((await privateResponse.text()).includes('https://pinnacleblooms.org/ask/'));}finally{await mf.dispose()}
});
