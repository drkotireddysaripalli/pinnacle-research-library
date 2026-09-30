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
 test(id+': returning public visitors see the released page without forwarding cookies',async()=>{
  let assetRequest;
  const visitorEnv={ASSETS:{fetch:async r=>{assetRequest=r;return new Response(r.method==='HEAD'?null:r.url.endsWith('.md')?'# reading':'public');}}};
  const cookie='_gcl_au=fixture; __Host-appgarden-visitor=fixture; _ga=fixture; cf_clearance=fixture; _ga_2BYLRLFRDJ=fixture';
  for(const[method,accept,expected]of [['GET','text/html','public'],['GET','text/markdown','# reading'],['HEAD','text/html','']]){
   const r=await serveSpeech(new Request(origin+path,{method,headers:{cookie,accept,'if-none-match':'"speech-public"'}}),visitorEnv,inv);
   assert.equal(r.status,200);assert.equal(await r.text(),expected);assert.equal(r.headers.get('cache-control'),'private, no-store');
   assert.equal(assetRequest.headers.has('cookie'),false);assert.equal(assetRequest.headers.has('authorization'),false);
  }
  const ad=await serveSpeech(new Request(origin+path,{headers:{cookie:'_gcl_au=fixture; _ga=fixture'}}),visitorEnv,inv);
  assert.equal(ad.status,200);assert.equal(await ad.text(),'public');
  assert.equal(await serveSpeech(new Request(origin+path,{headers:{cookie:cookie+'; session=fixture'}}),visitorEnv,inv),null);
 });
 test(id+': private/auth/session/range/POST and adjacent paths retain origin behaviour',async()=>{
  for(const headers of [{authorization:'fixture'},{cookie:'session=fixture'},{cookie:'unknown=fixture'},{range:'bytes=0-1'},{'cache-control':'no-transform'}])assert.equal(await serveSpeech(new Request(origin+path,{headers}),env,inv),null);
  assert.equal(await serveSpeech(new Request(origin+path,{method:'POST'}),env,inv),null);
  assert.equal(await serveSpeech(new Request(origin+path+'/private'),env,inv),null);
 });
}
