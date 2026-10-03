import test from 'node:test';
import assert from 'node:assert/strict';
import {Webhook} from 'standardwebhooks';
import {safeReturn,phoneNumber,hasSupportedIdentity,registrationComplete,googleProfile,registerReader,context,csrf,validPost,applyHeaders,action,enabledProviders,OAUTH_PROVIDERS} from '../src/lib/ask/auth.mjs';
import {watiHook} from '../src/lib/ask/wati-hook.mjs';
const user={id:'00000000-0000-4000-8000-000000000001',email:'example@example.invalid',email_confirmed_at:'2026-10-03',identities:[{provider:'google'}]};
const rate={limit:async()=>({success:true})};
const secret='whsec_'+Buffer.alloc(32,7).toString('base64');
const env={ASK_WHATSAPP_ENABLED:'true',WATI_TENANT_ID:'531',WATI_API_TOKEN:'synthetic-test-token',WATI_TEMPLATE_NAME:'synthetic_authentication',WATI_CHANNEL_NUMBER:'919999999999',WATI_OTP_PARAMETER_NAMES:'["1"]',SUPABASE_SMS_HOOK_SECRET:secret,ASK_AUTH_RATE_LIMIT:rate};
const payload={user,sms:{phone:'+919999999998',otp:'123456'}};
function signed(body=payload,timestamp=new Date()){const raw=JSON.stringify(body),id='synthetic-event';return new Request('https://pinnacleblooms.org/ask/auth/whatsapp-hook',{method:'POST',headers:{'webhook-id':id,'webhook-timestamp':String(Math.floor(timestamp.getTime()/1000)),'webhook-signature':new Webhook(secret).sign(id,timestamp,raw)},body:raw});}
test('returns only an internal public Ask path',()=>{
 assert.equal(safeReturn('/ask/autism'),'/ask/autism');
 for(const path of ['/ask/lens/entity%3Atherapy_modality/ot','/ask/conditions?page=2','/ask/search?q=speech+delay','/ask/te/search?q=%E0%B0%A4','/ask/autism#sources'])assert.equal(safeReturn(path),path);
 for(const bad of ['https://evil.invalid','//evil.invalid','/ask/../account','/ask/%2e%2e/account','/ask/auth/callback','/ask/account','/ask?token=x','/ask/%2f%2fevil.invalid','/ask/x#<script>','/ask/\\evil','%','/ask/auth%3fcallback','/ask?redirect_to=https://evil.invalid','/ask/lens/entity%253Atherapy/ot'])assert.equal(safeReturn(bad),'/ask',bad);
});
test('reader profile uses a verified Google identity and a restricted avatar host',()=>{
 assert.equal(googleProfile({...user,identities:[{provider:'apple'}],user_metadata:{provider:'google'}}),null);
 assert.equal(googleProfile({...user,email_confirmed_at:null}),null);
 const good={...user,identities:[{provider:'google',identity_data:{full_name:'Reader',avatar_url:'https://lh3.googleusercontent.com/example'}}],user_metadata:{full_name:'Untrusted override'}};
 assert.deepEqual(googleProfile(good),{name:'Reader',avatar:'https://lh3.googleusercontent.com/example'});
 for(const avatar of ['javascript:alert(1)','https://evil.invalid/a','https://googleusercontent.com.evil.invalid/a','http://lh3.googleusercontent.com/a','https://name:secret@lh3.googleusercontent.com/a']){
  assert.equal(googleProfile({...good,identities:[{provider:'google',identity_data:{avatar_url:avatar}}]}).avatar,null);
 }
});
test('Ask registry marker stays server-owned and is recorded only once',async()=>{
 assert.equal(await registerReader({}, {...user,app_metadata:{ask_reader:{registered_at:'2026-10-03'}}}),true);
 assert.equal(await registerReader({}, {...user,user_metadata:{ask_reader:{registered_at:'2026-10-03'}}}),false);
});
test('anonymous session response is private, contains CSRF and never a token or profile',async()=>{
 const authEnv={ASK_AUTH_ENABLED:'true',SUPABASE_URL:'https://synthetic.supabase.co',ASK_AUTH_PUBLISHABLE_KEY:'synthetic-key',ASK_AUTH_RATE_LIMIT:rate};
 const r=await action(new Request('https://pinnacleblooms.org/ask/auth/session'),authEnv,'session');
 assert.equal(r.status,200);assert.match(r.headers.get('cache-control'),/no-store/);assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow');
 const body=await r.json();assert.deepEqual(Object.keys(body).sort(),['csrf','profile']);assert.equal(body.profile,null);assert.match(body.csrf,/^[0-9a-f-]{36}$/);
 assert.equal((await action(new Request('https://pinnacleblooms.org/ask/auth/session',{method:'POST'}),authEnv,'session')).status,405);
});
test('phone requires explicit E.164 country code',()=>{
 assert.equal(phoneNumber('+91 9100 181 181'),'+919100181181');
 for(const bad of ['9100181181','+0123456789','<script>','+1','+919100181181&x=1'])assert.equal(phoneNumber(bad),null);
});
test('user metadata cannot confer Google or phone verification',()=>{
 assert.equal(hasSupportedIdentity({email:'x',user_metadata:{provider:'google',email_verified:true}}),false);
 assert.equal(!!hasSupportedIdentity(user),true);assert.equal(registrationComplete(user),false);
 const confirmed={...user,phone:'919999999998',phone_confirmed_at:'2026-10-03'};
 assert.equal(registrationComplete(confirmed),false);
 assert.equal(registrationComplete({...confirmed,user_metadata:{ask_whatsapp:{provider:'wati',phone:confirmed.phone,confirmed_at:confirmed.phone_confirmed_at}}}),false);
 assert.equal(registrationComplete({...confirmed,app_metadata:{ask_whatsapp:{provider:'wati',phone:confirmed.phone,confirmed_at:confirmed.phone_confirmed_at}}}),true);
 assert.equal(registrationComplete({...confirmed,app_metadata:{ask_whatsapp:{provider:'wati',phone:'wrong',confirmed_at:confirmed.phone_confirmed_at}}}),false);
 assert.equal(!!hasSupportedIdentity({...user,is_anonymous:true}),false);
});
test('CSRF token requires same origin and same cookie',()=>{
 const c=context(new Request('https://pinnacleblooms.org/ask/account'),{}),token=csrf(c);
 assert.match(c.headers.get('set-cookie'),/HttpOnly/);assert.match(c.headers.get('set-cookie'),/Secure/);assert.match(c.headers.get('set-cookie'),/Path=\/ask/);
 const request=new Request('https://pinnacleblooms.org/ask/auth/phone',{method:'POST',headers:{origin:'https://pinnacleblooms.org',cookie:'pinnacle-ask-csrf='+token}});
 assert.equal(validPost(context(request,{}),new URLSearchParams({csrf:token})),true);
 assert.equal(validPost(context(request,{}),new URLSearchParams({csrf:'wrong'})),false);
 const other=new Request(request,{headers:{origin:'https://evil.invalid',cookie:'pinnacle-ask-csrf='+token}});
 assert.equal(validPost(context(other,{}),new URLSearchParams({csrf:token})),false);
});
test('only supported providers with confirmed email satisfy the identity gate',()=>{
 for(const provider of ['google','apple','azure','x']){
  const identity={...user,identities:[{provider}]};
  assert.equal(hasSupportedIdentity(identity),true);
  assert.equal(hasSupportedIdentity({...identity,email_confirmed_at:null}),false);
  assert.equal(hasSupportedIdentity({...identity,email:''}),false);
 }
 assert.equal(hasSupportedIdentity({...user,identities:[{provider:'github'}]}),false);
 assert.deepEqual(enabledProviders({}),['google']);
 assert.deepEqual(enabledProviders({ASK_OAUTH_PROVIDERS:'google,x'}),['google','x']);
 assert.deepEqual(enabledProviders({ASK_OAUTH_PROVIDERS:'google,apple,azure,x,github,google'}),['google','apple','azure','x']);
});
test('enabled OAuth routes preserve PKCE and use each providers scopes',async()=>{
 const token=crypto.randomUUID();
 const request=kind=>new Request('https://pinnacleblooms.org/ask/auth/'+kind,{method:'POST',headers:{origin:'https://pinnacleblooms.org','content-type':'application/x-www-form-urlencoded',cookie:'pinnacle-ask-csrf='+token},body:new URLSearchParams({csrf:token,returnTo:'/ask/autism'})});
 const authEnv={ASK_AUTH_ENABLED:'true',SUPABASE_URL:'https://synthetic.supabase.co',ASK_AUTH_PUBLISHABLE_KEY:'synthetic-key',ASK_AUTH_RATE_LIMIT:rate,ASK_OAUTH_PROVIDERS:'google,apple,azure,x'};
 for(const provider of Object.keys(OAUTH_PROVIDERS)){
  const result=await action(request(provider),authEnv,provider);
  assert.equal(result.status,303);
  const url=new URL(result.headers.get('location'));
  assert.equal(url.searchParams.get('provider'),provider);
  assert.equal(url.searchParams.get('redirect_to'),'https://pinnacleblooms.org/ask/auth/callback');
  assert.equal(url.searchParams.get('scopes'),OAUTH_PROVIDERS[provider].scopes||null);
  assert.equal(url.searchParams.get('code_challenge_method'),'s256');
  assert.match(result.headers.get('set-cookie'),/pinnacle-ask-session-code-verifier/);
 }
 assert.equal((await action(request('apple'),{...authEnv,ASK_OAUTH_PROVIDERS:'google'},'apple')).status,503);
 assert.equal((await action(request('x'),{...authEnv,ASK_OAUTH_PROVIDERS:'google'},'x')).status,503);
});
test('multiple cookies survive response headers and no-store is explicit',()=>{
 const c=context(new Request('https://pinnacleblooms.org/ask/account'),{});c.set('one','1');c.set('two','2');
 assert.equal(c.headers.get('referrer-policy'),'strict-origin');
 const out=new Headers();applyHeaders(out,c.headers);assert.equal(out.getSetCookie().length,2);assert.match(out.get('cache-control'),/no-store/);
 assert.equal(c.redirect('/ask').headers.getSetCookie().length,2);
});
test('disabled identity routes fail closed without external calls',async()=>{
 const r=await action(new Request('https://pinnacleblooms.org/ask/auth/google',{method:'POST'}),{},'google');
 assert.equal(r.status,503);assert.match(r.headers.get('cache-control'),/no-store/);assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow');
});
test('signed WATI hook sends the requested phone, never old user.phone',async()=>{
 let sent;
 const body={...payload,user:{...user,phone:'+919999999997'}};
 const r=await watiHook(signed(body),env,async(url,opts)=>{sent={url,opts};return Response.json({result:true});});
 assert.equal(r.status,200);assert.match(sent.url,/whatsappNumber=919999999998$/);
 assert.equal(JSON.parse(sent.opts.body).parameters[0].value,'123456');assert.equal(sent.opts.redirect,'manual');
 assert.equal(await r.text(),'{}');
});
test('the signed WATI hook accepts confirmed identities from each supported provider',async()=>{
 for(const provider of Object.keys(OAUTH_PROVIDERS)){
  const body={...payload,user:{...user,identities:[{provider}]}};
  assert.equal((await watiHook(signed(body),env,async()=>Response.json({result:true}))).status,200);
 }
});
test('unsigned, expired and ambiguous phone payloads cannot send',async()=>{
 let calls=0;const sender=async()=>{calls++;return Response.json({result:true});};
 const unsigned=new Request('https://pinnacleblooms.org/ask/auth/whatsapp-hook',{method:'POST',body:JSON.stringify(payload)});
 assert.equal((await watiHook(unsigned,env,sender)).status,401);
 assert.equal((await watiHook(signed(payload,new Date(Date.now()-600000)),env,sender)).status,401);
 assert.equal((await watiHook(signed({...payload,sms:{otp:'123456'}}),env,sender)).status,400);
 assert.equal((await watiHook(signed({...payload,user:{id:user.id,phone:payload.sms.phone}}),env,sender)).status,400);
 assert.equal(calls,0);
});
test('template mapping and limits must be configured before sending',async()=>{
 let calls=0;const sender=async()=>{calls++;return Response.json({result:true});};
 assert.equal((await watiHook(signed(),{...env,WATI_OTP_PARAMETER_NAMES:''},sender)).status,503);
 assert.equal((await watiHook(signed(),{...env,ASK_AUTH_RATE_LIMIT:{limit:async()=>({success:false})}},sender)).status,429);
 assert.equal((await watiHook(signed(),{...env,ASK_AUTH_RATE_LIMIT:null},sender)).status,503);
 assert.equal(calls,0);
});
test('WATI HTTP200 rejection is not a successful OTP send',async()=>{
 const r=await watiHook(signed(),env,async()=>Response.json({result:false,message:'private provider detail'}));
 assert.equal(r.status,502);assert.doesNotMatch(await r.text(),/private provider detail/);
});
test('WATI redirects fail without forwarding credentials',async()=>{
 const r=await watiHook(signed(),env,async(_url,options)=>{
  assert.equal(options.redirect,'manual');
  return new Response(null,{status:307,headers:{location:'https://other.invalid'}});
 });
 assert.equal(r.status,502);
});
test('provider exceptions never disclose token, phone or OTP',async()=>{
 const r=await watiHook(signed(),env,async()=>{throw new Error('synthetic-test-token +919999999998 123456');});
 assert.equal(r.status,502);assert.doesNotMatch(await r.text(),/synthetic-test-token|919999999998|123456/);
});
