import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {Webhook} from 'standardwebhooks';

test('signed delivery hook constructs a valid Cloudflare request without external messaging',async()=>{
 const secret='whsec_'+Buffer.alloc(32,7).toString('base64');
 const env={ASK_WHATSAPP_ENABLED:'true',WATI_TENANT_ID:'531',WATI_API_TOKEN:'synthetic-test-token',WATI_TEMPLATE_NAME:'synthetic_authentication',WATI_CHANNEL_NUMBER:'919999999999',WATI_OTP_PARAMETER_NAMES:'["1"]',SUPABASE_SMS_HOOK_SECRET:secret};
 const bundled=await build({stdin:{contents:`import {watiHook} from './src/lib/ask/wati-hook.mjs';export default {async fetch(request){return watiHook(request,{...${JSON.stringify(env)},ASK_AUTH_RATE_LIMIT:{limit:async()=>({success:true})}},async(url,options)=>{const outgoing=new Request(url,options);if(outgoing.redirect!=='manual')throw Error('Unsafe redirect');await outgoing.text();return Response.json({result:true});});}}`,resolveDir:process.cwd()},bundle:true,format:'esm',platform:'browser',write:false});
 const runtime=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-03',compatibilityFlags:['nodejs_compat'],script:bundled.outputFiles[0].text}));
 try{
  const body=JSON.stringify({user:{id:'00000000-0000-4000-8000-000000000001',email:'example@example.invalid',email_confirmed_at:'2026-10-03',identities:[{provider:'google'}]},sms:{phone:'+919999999998',otp:'123456'}});
  const date=new Date(),id='synthetic-worker-test';
  const response=await runtime.dispatchFetch('https://local.invalid/ask/auth/whatsapp-hook',{method:'POST',headers:{'webhook-id':id,'webhook-timestamp':String(Math.floor(date.getTime()/1000)),'webhook-signature':new Webhook(secret).sign(id,date,body)},body});
  assert.equal(response.status,200,await response.text());
 }finally{await runtime.dispose();}
});
