import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

const bundle=await build({entryPoints:['src/lib/ask/repository.ts'],bundle:true,format:'esm',platform:'node',write:false});
const {answer,resourceItems}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));

test('published legacy resource envelopes remain readable alongside array records',()=>{
 const technique={title:'Eye Contact Engagement',utilization:499};
 const material={slug:'example-material',title:'Example material'};
 assert.deepEqual(resourceItems({count:1,items:[technique]}),[technique]);
 assert.deepEqual(resourceItems([material]),[material]);
 for(const value of [null,undefined,{},'invalid',{items:null}])assert.deepEqual(resourceItems(value),[]);
 assert.deepEqual(resourceItems({items:[null,'invalid',[],material]}),[material]);
});

test('answer boundary supports legacy resource linking and keeps the real answer, sources and publication policy',async()=>{
 const originalFetch=globalThis.fetch,originalCaches=globalThis.caches;
 const stored={slug:'published-answer',lang:'en',answer_md:'The complete explanation',meta_robots:'index, follow',authority_links:[{url:'https://example.gov/source'}],related_materials:{count:1,items:[{slug:'material'}]},related_techniques:{count:1,items:[{title:'Eye Contact Engagement',utilization:499}]}};
 globalThis.caches={default:{match:async()=>undefined,put:async()=>{}}};
 let mode='answer';
 globalThis.fetch=async()=>mode==='failed'?new Response('Unavailable',{status:503}):Response.json(mode==='missing'?null:stored);
 try {
  const actual=await answer({SUPABASE_URL:'https://example.invalid',SUPABASE_KEY:'test'},stored.slug);
  assert.equal(actual.answer_md,stored.answer_md);
  assert.equal(actual.meta_robots,stored.meta_robots);
  assert.deepEqual(actual.authority_links,stored.authority_links);
  assert.deepEqual([...actual.related_materials,...actual.related_techniques].map(x=>x.slug).filter(Boolean),['material']);
  assert.equal(actual.related_techniques[0].utilization,499);
  mode='missing';assert.equal(await answer({SUPABASE_URL:'https://example.invalid',SUPABASE_KEY:'test'},'missing'),null);
  mode='failed';await assert.rejects(()=>answer({SUPABASE_URL:'https://example.invalid',SUPABASE_KEY:'test'},'failure'),/lookup unavailable/);
 } finally {globalThis.fetch=originalFetch;globalThis.caches=originalCaches;}
});
