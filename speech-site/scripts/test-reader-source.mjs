import test from 'node:test';
import assert from 'node:assert/strict';
import {READER_SECTIONS,readerSection,libraryReturn,readerDestination,readerContext,registrationSection,readerSignInPath} from '../src/lib/reader-source.mjs';
import {safeReturn,registerReader,action,hashNonce} from '../src/lib/ask/auth.mjs';
import {addLibraryRegistration} from '../deployment/library-registration.mjs';
const roots={ask:'/ask',faq:'/faq',sunshine:'/sunshine',mirracles:'/allmirracles',materials:'/materials',interventions:'/interventions'};
for(const section of READER_SECTIONS)for(const tail of ['',section==='mirracles'?'/category/Materials':'/sample-topic']){
 const path=roots[section]+tail;
 test(section+' registration source is retained for '+path,()=>{
  assert.equal(readerSection(path),section);assert.equal(readerContext('https://www.pinnacleblooms.org'+path).library,section);
  assert.equal(registrationSection(null,path),section);
 });
}
for(const section of ['materials','interventions'])for(const tail of ['','/sample-topic','/Parent%20Practice']){
 const back='/'+section+tail;
 test(section+' account handoff returns to original '+back,()=>{
  assert.equal(safeReturn(back),back);
  const gate=new URL(readerSignInPath(back),'https://www.pinnacleblooms.org');
  const context=readerContext(gate.href);
  assert.deepEqual(context,{library:section,returnTo:back,forwarded:true,destination:'https://'+section+'.pinnacleblooms.org'+(tail||'/')});
 });
}
test('unrecognised page remains explicitly unknown, never silently Ask',()=>{
 assert.equal(readerContext('https://www.pinnacleblooms.org/other').library,'unknown');
 assert.equal(registrationSection(undefined,undefined),'unknown');
});
test('known form destination wins over inconsistent browser section',()=>{
 assert.equal(registrationSection('ask','/faq/hindi/speech-therapy'),'faq');
 assert.equal(registrationSection('materials','/interventions/communication'),'interventions');
});
test('unapproved external and malformed returns cannot enter the bridge',()=>{
 for(const value of ['https://evil.invalid','//evil.invalid','/materials/../ask','/materials/%2e%2e/ask','/materials/%2f/evil','/materials?return=https://evil.invalid','/interventions/<script>','/interventions\\evil','/materialsa/topic'])assert.equal(libraryReturn(value),null,value);
 const c=readerContext('https://www.pinnacleblooms.org/ask?reader_return=https%3A%2F%2Fevil.invalid');assert.equal(c.forwarded,false);assert.equal(c.library,'ask');
});
for(const section of ['materials','interventions'])test(section+' root and detail pages gain exactly one shared signup link without content changes',async()=>{
 for(const path of ['/','/sample-topic']){
  const req=new Request('https://'+section+'.pinnacleblooms.org'+path);
  const html='<html><head><title>Original library</title></head><body><main>Original content</main><a href="/original">Original link</a></body></html>';
  const res=await addLibraryRegistration(req,new Response(html,{headers:{'content-type':'text/html','etag':'old','content-length':'20'}}));const body=await res.text();
  assert.equal((body.match(/data-pinnacle-reader-signup=/g)||[]).length,1);assert(body.includes('returnTo='+encodeURIComponent('/'+section+(path==='/'?'':path))));
  assert(body.includes('<main>Original content</main><a href="/original">Original link</a>'));assert.equal(res.headers.get('etag'),null);
  const repeat=await addLibraryRegistration(req,new Response(body,{headers:{'content-type':'text/html'}}));assert.equal(await repeat.text(),body);
 }
});
test('assets, failed responses and other hosts are untouched',async()=>{
 for(const [url,status,type] of [['https://other.invalid/',200,'text/html'],['https://materials.pinnacleblooms.org/missing',404,'text/html'],['https://interventions.pinnacleblooms.org/app.js',200,'text/javascript']]){
  const r=new Response('untouched',{status,headers:{'content-type':type,'etag':'same'}});
  assert.equal(await addLibraryRegistration(new Request(url),r),r);
 }
});
test('new registration writes an explicit section exactly once; historical unknown is never guessed',async()=>{
 const old=globalThis.fetch;const saved=[];
 globalThis.fetch=async(url,init)=>{saved.push(JSON.parse(init.body));return new Response(JSON.stringify({id:'00000000-0000-4000-8000-000000000001',app_metadata:saved.at(-1).app_metadata}),{headers:{'content-type':'application/json'}});};
 try{
  const env={SUPABASE_URL:'https://offline.invalid',ASK_AUTH_SECRET_KEY:'fixture-only'};
  for(const section of READER_SECTIONS){const u={id:'00000000-0000-4000-8000-000000000001',app_metadata:{}};assert(await registerReader(env,u,section,roots[section]));assert.equal(saved.at(-1).app_metadata.ask_reader.first_library,section);assert.equal(saved.at(-1).app_metadata.ask_reader.source_version,'20261025');}
  assert(await registerReader(env,{id:'00000000-0000-4000-8000-000000000001',app_metadata:{}},null));assert.equal(saved.at(-1).app_metadata.ask_reader.first_library,'unknown');
  const count=saved.length;assert(await registerReader(env,{app_metadata:{ask_reader:{registered_at:'2026-10-03'}}},'materials','/materials'));assert.equal(saved.length,count);
 }finally{globalThis.fetch=old;}
});
for(const mode of ['google-id-token','callback'])for(const section of [...READER_SECTIONS,'unknown'])test(mode+' persists the '+section+' source through the actual auth handler',async()=>{
 const original=globalThis.fetch;const writes=[];
 const id='00000000-0000-4000-8000-000000000001';
 const user={id,email:'fixture@example.invalid',email_confirmed_at:'2026-10-03',identities:[{provider:'google'}],app_metadata:{}};
 const token='e30.'+Buffer.from(JSON.stringify({sub:id,exp:Math.floor(Date.now()/1000)+3600})).toString('base64url')+'.fixture';
 globalThis.fetch=async(url,init)=>{
  const u=String(url);
  if(u.includes('/admin/users/')){writes.push(JSON.parse(init.body));return new Response(JSON.stringify(user),{headers:{'content-type':'application/json'}});}
  if(u.includes('/token?'))return new Response(JSON.stringify({access_token:token,refresh_token:'fixture-only',token_type:'bearer',expires_in:3600,user}),{headers:{'content-type':'application/json'}});
  throw Error('Unexpected external request: '+u);
 };
 try{
  const env={ASK_AUTH_ENABLED:'true',SUPABASE_URL:'https://offline.invalid',ASK_AUTH_PUBLISHABLE_KEY:'fixture-only',ASK_AUTH_SECRET_KEY:'fixture-only',ASK_GOOGLE_CLIENT_ID:'123-fixture.apps.googleusercontent.com',ASK_AUTH_RATE_LIMIT:{limit:async()=>({success:true})}};
  const csrf=crypto.randomUUID(),back=roots[section]||'https://invalid.example/';let response;
  if(mode==='google-id-token'){
   const nonce=Date.now()+'.'+crypto.randomUUID()+crypto.randomUUID();
   const claims={aud:env.ASK_GOOGLE_CLIENT_ID,iss:'https://accounts.google.com',exp:Math.floor(Date.now()/1000)+300,nonce:await hashNonce(nonce)};
   const credential='e30.'+Buffer.from(JSON.stringify(claims)).toString('base64url')+'.fixture';
   response=await action(new Request('https://www.pinnacleblooms.org/ask/auth/google-id-token',{method:'POST',headers:{origin:'https://www.pinnacleblooms.org','content-type':'application/x-www-form-urlencoded',cookie:'pinnacle-ask-csrf='+csrf+'; pinnacle-ask-google-nonce='+nonce},body:new URLSearchParams({csrf,credential,returnTo:back,library:section})}),env,mode);
  }else{
   const start=await action(new Request('https://www.pinnacleblooms.org/ask/auth/google',{method:'POST',headers:{origin:'https://www.pinnacleblooms.org','content-type':'application/x-www-form-urlencoded',cookie:'pinnacle-ask-csrf='+csrf},body:new URLSearchParams({csrf,returnTo:back,library:section})}),env,'google');
   assert.equal(start.status,303);
   const cookies=start.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
   response=await action(new Request('https://www.pinnacleblooms.org/ask/auth/callback?code=fixture-code',{headers:{cookie:cookies}}),env,mode);
  }
  assert.equal(response.status,303);assert.equal(response.headers.get('location'),readerDestination(safeReturn(back)));assert.equal(writes.length,1);assert.equal(writes[0].app_metadata.ask_reader.first_library,section);
 }finally{globalThis.fetch=original;}
});
