import test from 'node:test';
import assert from 'node:assert/strict';
import {Webhook} from 'standardwebhooks';
import {safeReturn,phoneNumber,hasGoogle,registrationComplete,context,csrf,validPost,applyHeaders,action} from '../src/lib/ask/auth.mjs';
import {watiHook} from '../src/lib/ask/wati-hook.mjs';
const user={id:'00000000-0000-4000-8000-000000000001',email:'example@example.invalid',email_confirmed_at:'2026-10-03',identities:[{provider:'google'}]};
const rate={limit:async()=>({success:true})};
const secret='whsec_'+Buffer.alloc(32,7).toString('base64');
const env={ASK_WHATSAPP_ENABLED:'true',WATI_TENANT_ID:'531',WATI_API_TOKEN:'synthetic-test-token',WATI_TEMPLATE_NAME:'synthetic_authentication',WATI_CHANNEL_NUMBER:'919999999999',WATI_OTP_PARAMETER_NAMES:'["1"]',SUPABASE_SMS_HOOK_SECRET:secret,ASK_AUTH_RATE_LIMIT:rate};
const payload={user,sms:{phone:'+919999999998',otp:'123456'}};
function signed(body=payload,timestamp=new Date()){const raw=JSON.stringify(body),id='synthetic-event';return new Request('https://pinnacleblooms.org/ask/auth/whatsapp-hook',{method:'POST',headers:{'webhook-id':id,'webhook-timestamp':String(Math.floor(timestamp.getTime()/1000)),'webhook-signature':new Webhook(secret).sign(id,timestamp,raw)},body:raw});}
test('returns only an internal public Ask path',()=>{
 assert.equal(safeReturn('/ask/autism'),'/ask/autism');
 for(const bad of ['https://evil.invalid','//evil.invalid','/ask/../account','/ask/%2e%2e/account','/ask/auth/callback','/ask/account','/ask/search','/ask?token=x','/ask/%2f%2fevil.invalid','/ask/x#y','/ask/\\evil','%'])assert.equal(safeReturn(bad),'/ask',bad);
});
test('phone requires explicit E.164 country code',()=>{
 assert.equal(phoneNumber('+91 9100 181 181'),'+919100181181');
 for(const bad of ['9100181181','+0123456789','<script>','+1','+919100181181&x=1'])assert.equal(phoneNumber(bad),null);
});
test('user metadata cannot confer Google or phone verification',()=>{
 assert.equal(hasGoogle({email:'x',user_metadata:{provider:'google',email_verified:true}}),false);
 assert.equal(!!hasGoogle(user),true);assert.equal(registrationComplete(user),false);
 const confirmed={...user,phone:'919999999998',phone_confirmed_at:'2026-10-03'};
 assert.equal(registrationComplete(confirmed),false);
 assert.equal(registrationComplete({...confirmed,user_metadata:{ask_whatsapp:{provider:'wati',phone:confirmed.phone,confirmed_at:confirmed.phone_confirmed_at}}}),false);
 assert.equal(registrationComplete({...confirmed,app_metadata:{ask_whatsapp:{provider:'wati',phone:confirmed.phone,confirmed_at:confirmed.phone_confirmed_at}}}),true);
 assert.equal(registrationComplete({...confirmed,app_metadata:{ask_whatsapp:{provider:'wati',phone:'wrong',confirmed_at:confirmed.phone_confirmed_at}}}),false);
 assert.equal(!!hasGoogle({...user,is_anonymous:true}),false);
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
 assert.equal(JSON.parse(sent.opts.body).parameters[0].value,'123456');assert.equal(sent.opts.redirect,'error');
 assert.equal(await r.text(),'{}');
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
test('provider exceptions never disclose token, phone or OTP',async()=>{
 const r=await watiHook(signed(),env,async()=>{throw new Error('synthetic-test-token +919999999998 123456');});
 assert.equal(r.status,502);assert.doesNotMatch(await r.text(),/synthetic-test-token|919999999998|123456/);
});
