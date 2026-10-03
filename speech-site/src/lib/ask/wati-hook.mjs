import {Webhook} from 'standardwebhooks';
import {AUTH_HEADERS,phoneNumber,hasGoogle} from './auth.mjs';
const failure=(status,message)=>Response.json({error:{http_code:status,message}},{status,headers:AUTH_HEADERS});
export async function watiHook(request,env,fetcher=fetch){
 if(request.method!=='POST')return failure(405,'Method not allowed');
 if(env.ASK_WHATSAPP_ENABLED!=='true'||!env.WATI_API_TOKEN||!env.WATI_TEMPLATE_NAME||!env.WATI_CHANNEL_NUMBER||!env.SUPABASE_SMS_HOOK_SECRET||!env.ASK_AUTH_RATE_LIMIT)return failure(503,'Verification delivery is not enabled');
 if(Number(request.headers.get('content-length')||0)>32768)return failure(413,'Request too large');
 const raw=await request.text();if(raw.length>32768)return failure(413,'Request too large');
 let payload;
 try{payload=new Webhook(env.SUPABASE_SMS_HOOK_SECRET.replace(/^v1,/,'')).verify(raw,Object.fromEntries(request.headers));}catch{return failure(401,'Invalid webhook');}
 // On phone changes user.phone may still be the old number. Do not use it.
 const phone=phoneNumber(payload?.sms?.phone?.startsWith('+')?payload.sms.phone:'+'+(payload?.sms?.phone||''));
 const otp=payload?.sms?.otp;
 if(!phone||!/^\d{6,10}$/.test(otp||'')||!hasGoogle(payload?.user))return failure(400,'Unsupported verification request');
 if(!/^\d+$/.test(env.WATI_TENANT_ID||''))return failure(503,'Verification delivery is not configured');
 let names;try{names=JSON.parse(env.WATI_OTP_PARAMETER_NAMES||'[]');}catch{return failure(503,'Template mapping is not configured');}
 if(!Array.isArray(names)||!names.length||names.length>4||names.some(n=>typeof n!=='string'||!n.trim()||n.length>80))return failure(503,'Template mapping is not configured');
 const [userLimit,phoneLimit]=await Promise.all([env.ASK_AUTH_RATE_LIMIT.limit({key:'hook-user:'+payload.user.id}),env.ASK_AUTH_RATE_LIMIT.limit({key:'hook-phone:'+phone})]);
 if(!userLimit.success||!phoneLimit.success)return failure(429,'Please wait before requesting another code');
 const url='https://live-mt-server.wati.io/'+env.WATI_TENANT_ID+'/api/v1/sendTemplateMessage?whatsappNumber='+phone.slice(1);
 try{
  const response=await fetcher(url,{method:'POST',redirect:'error',signal:AbortSignal.timeout(3500),headers:{authorization:'Bearer '+env.WATI_API_TOKEN,'content-type':'application/json'},body:JSON.stringify({template_name:env.WATI_TEMPLATE_NAME,broadcast_name:'ask_account_verification',channel_number:env.WATI_CHANNEL_NUMBER,parameters:names.map(name=>({name,value:otp}))})});
  const data=await response.json().catch(()=>null);
  if(!response.ok||data?.result!==true)return failure(502,'The code could not be sent. Please try again shortly.');
  return Response.json({},{headers:AUTH_HEADERS});
 }catch{return failure(502,'Verification delivery is temporarily unavailable');}
}
