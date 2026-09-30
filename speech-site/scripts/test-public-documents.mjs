import test from 'node:test';import assert from 'node:assert/strict';
import {serveSpeech,PUBLIC_DOCUMENT_ROUTES} from '../deployment/speech-handler.mjs';
const origin='https://www.pinnacleblooms.org';
for(const[path,id]of Object.entries(PUBLIC_DOCUMENT_ROUTES)){
 const md=id+(['self-sufficient','mainstream','about','leadership','framework'].includes(id)?'-machine.md':'-policy.md');
 const inv={['/pinnacle-pages-html/'+id+'.html']:'public',['/pinnacle-pages-data/'+md]:'reading'};
 const env={ASSETS:{fetch:async r=>new Response(r.method==='HEAD'?null:r.url.endsWith('.md')?'# reading':'public')}};
 test(id+': exact public document, Markdown, HEAD and query-preserving alias',async()=>{
  for(const[method,headers,text]of [['GET',{},'public'],['GET',{accept:'text/markdown'},'# reading'],['HEAD',{},''],['GET',{cookie:'ps_ga=anonymous'},'public']]){const r=await serveSpeech(new Request(origin+path,{method,headers}),env,inv);assert.equal(r.status,200);assert.equal(await r.text(),text);assert.equal(r.headers.get('vary'),'Accept');}
  const alias=await serveSpeech(new Request(origin+path+'/?x=one'),env,inv);assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),origin+path+'?x=one');
 });
 test(id+': private/auth/session/range/POST and adjacent paths retain origin behaviour',async()=>{
  for(const headers of [{authorization:'fixture'},{cookie:'session=fixture'},{cookie:'unknown=fixture'},{range:'bytes=0-1'},{'cache-control':'no-transform'}])assert.equal(await serveSpeech(new Request(origin+path,{headers}),env,inv),null);
  assert.equal(await serveSpeech(new Request(origin+path,{method:'POST'}),env,inv),null);
  assert.equal(await serveSpeech(new Request(origin+path+'/private'),env,inv),null);
 });
}
