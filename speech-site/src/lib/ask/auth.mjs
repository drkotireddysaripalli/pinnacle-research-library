import {createServerClient,parseCookieHeader,serializeCookieHeader} from '@supabase/ssr';
import {createClient} from '@supabase/supabase-js';
// Keep paths/codes out of referrers while retaining the Origin on native POST forms.
// no-referrer makes browsers send Origin: null, which correctly fails the CSRF guard.
export const AUTH_HEADERS={'cache-control':'private, no-store, max-age=0','cdn-cache-control':'no-store','cloudflare-cdn-cache-control':'no-store','x-robots-tag':'noindex, nofollow','referrer-policy':'strict-origin','x-content-type-options':'nosniff'};
export const ACCOUNT='/ask/account';
// Matches the approved WATI code_template_pbn_v3 expiry; Supabase must use 360s at activation.
export const OTP_EXPIRY_SECONDS=360;
export function safeReturn(value){
 if(typeof value!=='string'||value.length>350)return '/ask';
 try{const p=decodeURIComponent(value);if(!/^\/ask(?:\/[a-zA-Z0-9_-]+)*$/.test(p)||/^\/ask\/(?:auth|account|search)(?:\/|$)/.test(p))return '/ask';return p;}catch{return '/ask';}
}
export function phoneNumber(value){const v=String(value||'').replace(/[ ()-]/g,'');return /^\+[1-9][0-9]{7,14}$/.test(v)?v:null;}
export function hasGoogle(user){return !!user?.email&&!!user.email_confirmed_at&&!user.is_anonymous&&user.identities?.some(i=>i.provider==='google');}
export function phoneConfirmed(user){return hasGoogle(user)&&!!user.phone&&!!user.phone_confirmed_at;}
export function registrationComplete(user){const receipt=user?.app_metadata?.ask_whatsapp;return phoneConfirmed(user)&&receipt?.provider==='wati'&&receipt?.phone===user.phone&&receipt?.confirmed_at===user.phone_confirmed_at;}
export function configured(env){return env.ASK_AUTH_ENABLED==='true'&&!!env.SUPABASE_URL&&!!env.ASK_AUTH_PUBLISHABLE_KEY&&!!env.ASK_AUTH_RATE_LIMIT;}
export function applyHeaders(target,source){for(const [key,value] of source)if(key!=='set-cookie')target.set(key,value);for(const cookie of source.getSetCookie())target.append('set-cookie',cookie);}
export function context(request,env){
 const url=new URL(request.url),headers=new Headers(AUTH_HEADERS);
 const cookies=new Map(parseCookieHeader(request.headers.get('cookie')||'').map(c=>[c.name,c.value||'']));
 const options={path:'/ask',httpOnly:true,secure:url.protocol==='https:',sameSite:'lax'};
 const set=(name,value,extra={})=>{cookies.set(name,value);headers.append('set-cookie',serializeCookieHeader(name,value,{...options,...extra}));};
 const auth=configured(env)?createServerClient(env.SUPABASE_URL,env.ASK_AUTH_PUBLISHABLE_KEY,{
  cookieOptions:{name:'pinnacle-ask-session',...options},
  global:{fetch:(input,init)=>fetch(input,{...init,signal:AbortSignal.timeout(8000)})},
  cookies:{getAll:()=>[...cookies].map(([name,value])=>({name,value})),setAll:(items,cacheHeaders)=>{for(const item of items)set(item.name,item.value,{...item.options,...options});for(const [k,v] of Object.entries(cacheHeaders||{}))headers.set(k,v);}}
 }):null;
 return {request,url,headers,auth,cookies,set,redirect:(to)=>{const h=new Headers(headers);h.set('location',to);return new Response(null,{status:303,headers:h});},reply:(body,status=200)=>new Response(body,{status,headers})};
}
export function csrf(c){let token=c.cookies.get('pinnacle-ask-csrf');if(!/^[0-9a-f-]{36}$/.test(token||'')){token=crypto.randomUUID();c.set('pinnacle-ask-csrf',token,{maxAge:3600});}return token;}
export function validPost(c,form){return c.request.method==='POST'&&c.request.headers.get('origin')===c.url.origin&&!!c.cookies.get('pinnacle-ask-csrf')&&form.get('csrf')===c.cookies.get('pinnacle-ask-csrf');}
export async function limited(env,key){if(!env.ASK_AUTH_RATE_LIMIT)return true;return !(await env.ASK_AUTH_RATE_LIMIT.limit({key})).success;}
export async function action(request,env,kind){
 const c=context(request,env);
 const back=code=>c.redirect(ACCOUNT+'?status='+code);
 if(!c.auth)return c.reply('Account sign-in is not available yet. You can read Ask or call 9100 181 181.',503);
 if(kind==='callback'){
  if(request.method!=='GET')return c.reply('Method not allowed',405);
  const code=c.url.searchParams.get('code');if(!code||code.length>2048)return back('sign-in');
  const {data,error}=await c.auth.auth.exchangeCodeForSession(code);
  if(error||!hasGoogle(data.user)){await c.auth.auth.signOut({scope:'local'});return back('sign-in');}
  return c.redirect(ACCOUNT);
 }
 if(request.method!=='POST')return c.reply('Method not allowed',405);
 if(!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded'))return c.reply('Unsupported request',415);
 const text=await request.text();if(text.length>4096)return c.reply('Request too large',413);
 const form=new URLSearchParams(text);if(!validPost(c,form))return c.reply('Please reopen the account page and try again.',403);
 if(kind==='google'){
  if(await limited(env,'google:'+request.headers.get('cf-connecting-ip')))return back('wait');
  c.set('pinnacle-ask-return',safeReturn(form.get('returnTo')),{maxAge:1800});
  const {data,error}=await c.auth.auth.signInWithOAuth({provider:'google',options:{redirectTo:c.url.origin+'/ask/auth/callback',skipBrowserRedirect:true,scopes:'openid email profile'}});
  return error||!data.url?back('sign-in'):c.redirect(data.url);
 }
 if(kind==='logout'){await c.auth.auth.signOut({scope:'local'});for(const name of ['pinnacle-ask-phone','pinnacle-ask-return','pinnacle-ask-csrf'])c.set(name,'',{maxAge:0});return c.redirect('/ask');}
 const {data:{user},error}=await c.auth.auth.getUser();
 if(error||!hasGoogle(user))return back('sign-in');
 if(await limited(env,kind+':'+user.id))return back('wait');
 if(kind==='phone'){
  if(env.ASK_WHATSAPP_ENABLED!=='true'||!env.ASK_AUTH_SECRET_KEY)return back('phone-unavailable');
  const phone=phoneNumber(form.get('phone'));if(!phone||form.get('verificationConsent')!=='yes')return back('phone-format');
  const {error}=await c.auth.auth.updateUser({phone});
  if(error)return back(error.status===429?'wait':'phone-send');
  c.set('pinnacle-ask-phone',phone,{maxAge:OTP_EXPIRY_SECONDS});return back('code-sent');
 }
 if(kind==='verify'){
  if(env.ASK_WHATSAPP_ENABLED!=='true'||!env.ASK_AUTH_SECRET_KEY)return back('phone-unavailable');
  const phone=phoneNumber(c.cookies.get('pinnacle-ask-phone')),token=String(form.get('token')||'').trim();
  if(!phone||!/^\d{6,10}$/.test(token))return back('code-invalid');
  const {data,error}=await c.auth.auth.verifyOtp({phone,token,type:'phone_change'});
  if(error)return back(error.status===429?'wait':'code-invalid');
  if(data.user?.id!==user.id||!phoneConfirmed(data.user)||phoneNumber(data.user.phone?.startsWith('+')?data.user.phone:'+'+data.user.phone)!==phone){await c.auth.auth.signOut({scope:'local'});return back('sign-in');}
  // Server-owned receipt: user_metadata and an inherited SMS confirmation cannot claim WhatsApp verification.
  const admin=createClient(env.SUPABASE_URL,env.ASK_AUTH_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>fetch(input,{...init,signal:AbortSignal.timeout(8000)})}});
  const saved=await admin.auth.admin.updateUserById(user.id,{app_metadata:{ask_whatsapp:{provider:'wati',phone:data.user.phone,confirmed_at:data.user.phone_confirmed_at}}});
  if(saved.error)return back('verification-record');
  c.set('pinnacle-ask-phone','',{maxAge:0});return back('verified');
 }
 return c.reply('Not found',404);
}
