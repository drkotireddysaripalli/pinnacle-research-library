import {createServerClient,parseCookieHeader,serializeCookieHeader} from '@supabase/ssr';
import {createClient} from '@supabase/supabase-js';
// Keep paths/codes out of referrers while retaining the Origin on native POST forms.
// no-referrer makes browsers send Origin: null, which correctly fails the CSRF guard.
export const AUTH_HEADERS={'cache-control':'private, no-store, max-age=0','cdn-cache-control':'no-store','cloudflare-cdn-cache-control':'no-store','x-robots-tag':'noindex, nofollow','referrer-policy':'strict-origin','x-content-type-options':'nosniff'};
export const ACCOUNT='/ask/account';
// Matches the approved WATI code_template_pbn_v3 expiry; Supabase must use 360s at activation.
export const OTP_EXPIRY_SECONDS=360;
export function safeReturn(value){
 if(typeof value!=='string'||value.length>700||!value.startsWith('/ask')||/[\\\x00-\x20\x7f]/.test(value))return '/ask';
 try{
  const rawPath=value.split(/[?#]/)[0],decoded=decodeURIComponent(rawPath);
  if(!/^\/ask(?:\/[a-zA-Z0-9_:-]+)*$/.test(decoded)||/%(?:2f|5c)/i.test(rawPath)||/^\/ask\/(?:auth|account)(?:\/|$)/.test(decoded))return '/ask';
  const u=new URL(value,'https://pinnacleblooms.org');
  if(u.origin!=='https://pinnacleblooms.org')return '/ask';
  for(const [key,v] of u.searchParams)if(!(key==='page'&&/^[1-9][0-9]{0,3}$/.test(v))&&!(key==='q'&&/^\/ask\/(?:te\/)?search$/.test(decoded)&&v.length<=200))return '/ask';
  if(u.hash&&!/^#[a-zA-Z0-9_-]+$/.test(u.hash))return '/ask';
  return u.pathname+u.search+u.hash;
 }catch{return '/ask';}
}
export function googleProfile(user){
 if(!user?.email||!user.email_confirmed_at||user.is_anonymous)return null;
 const identity=user.identities?.find(i=>i.provider==='google');if(!identity)return null;
 const data=identity.identity_data||{};let avatar=null;
 try{const u=new URL(data.avatar_url||data.picture);if(u.protocol==='https:'&&!u.username&&!u.password&&(u.hostname==='googleusercontent.com'||u.hostname.endsWith('.googleusercontent.com')))avatar=u.href;}catch{}
 return {name:String(data.full_name||data.name||'Ask reader').slice(0,100),avatar};
}
// An app-specific, server-owned marker identifies Ask readers in the existing
// Supabase user registry. It grants no IRWFA entitlement and stores no reading history.
export async function registerReader(env,user){
 if(user.app_metadata?.ask_reader?.registered_at)return true;
 if(!env.ASK_AUTH_SECRET_KEY)return false;
 const admin=createClient(env.SUPABASE_URL,env.ASK_AUTH_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>fetch(input,{...init,signal:AbortSignal.timeout(8000)})}});
 const {error}=await admin.auth.admin.updateUserById(user.id,{app_metadata:{ask_reader:{provider:'google',registered_at:new Date().toISOString()}}});
 return !error;
}
export function phoneNumber(value){const v=String(value||'').replace(/[ ()-]/g,'');return /^\+[1-9][0-9]{7,14}$/.test(v)?v:null;}
export const OAUTH_PROVIDERS=Object.freeze({google:{label:'Google',scopes:'openid email profile'},apple:{label:'Apple'},azure:{label:'Microsoft',scopes:'email'},x:{label:'X'}});
export function enabledProviders(env){return String(env.ASK_OAUTH_PROVIDERS||'google').split(',').map(p=>p.trim()).filter((p,i,a)=>Object.hasOwn(OAUTH_PROVIDERS,p)&&a.indexOf(p)===i);}
export function hasSupportedIdentity(user){return !!user?.email&&!!user.email_confirmed_at&&!user.is_anonymous&&!!user.identities?.some(i=>Object.hasOwn(OAUTH_PROVIDERS,i.provider));}
export function phoneConfirmed(user){return hasSupportedIdentity(user)&&!!user.phone&&!!user.phone_confirmed_at;}
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
 if(kind==='session'){
  if(request.method!=='GET')return c.reply('Method not allowed',405);
  const {data:{user},error}=await c.auth.auth.getUser();
  if(error&&error.name!=='AuthSessionMissingError'&&!(error.status>=400&&error.status<500))return c.reply('Sign-in service is temporarily unavailable.',503);
  const profile=googleProfile(user);
  if(profile&&!await registerReader(env,user))return c.reply('Your registration could not be saved. Please try again.',503);
  c.headers.set('content-type','application/json; charset=utf-8');
  return c.reply(JSON.stringify({profile,csrf:csrf(c)}));
 }
 if(kind==='callback'){
  if(request.method!=='GET')return c.reply('Method not allowed',405);
  const code=c.url.searchParams.get('code');if(!code||code.length>2048)return back('sign-in');
  const {data,error}=await c.auth.auth.exchangeCodeForSession(code);
  if(error||!googleProfile(data.user)){await c.auth.auth.signOut({scope:'local'});return back('sign-in');}
  if(!await registerReader(env,data.user))return back('registration');
  const returnTo=safeReturn(c.cookies.get('pinnacle-ask-return'));c.set('pinnacle-ask-return','',{maxAge:0});
  return c.redirect(returnTo);
 }
 if(request.method!=='POST')return c.reply('Method not allowed',405);
 if(!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded'))return c.reply('Unsupported request',415);
 const text=await request.text();if(text.length>4096)return c.reply('Request too large',413);
 const form=new URLSearchParams(text);if(!validPost(c,form))return c.reply('Please reopen the account page and try again.',403);
 if(Object.hasOwn(OAUTH_PROVIDERS,kind)){
  if(!enabledProviders(env).includes(kind))return c.reply('This sign-in option is not available yet.',503);
  if(await limited(env,'oauth:'+request.headers.get('cf-connecting-ip')))return back('wait');
  c.set('pinnacle-ask-return',safeReturn(form.get('returnTo')),{maxAge:1800});
  const {data,error}=await c.auth.auth.signInWithOAuth({provider:kind,options:{redirectTo:c.url.origin+'/ask/auth/callback',skipBrowserRedirect:true,...(OAUTH_PROVIDERS[kind].scopes?{scopes:OAUTH_PROVIDERS[kind].scopes}:{})}});
  return error||!data.url?back('sign-in'):c.redirect(data.url);
 }
 if(kind==='logout'){const {error}=await c.auth.auth.signOut({scope:'local'});if(error)return c.reply('Sign out could not be completed. Please try again.',503);for(const name of ['pinnacle-ask-phone','pinnacle-ask-return','pinnacle-ask-csrf'])c.set(name,'',{maxAge:0});const target=new URL(safeReturn(form.get('returnTo')),c.url.origin);target.searchParams.set('ask_signin','signed-out');return c.redirect(target.pathname+target.search+target.hash);}
 const {data:{user},error}=await c.auth.auth.getUser();
 if(error||!hasSupportedIdentity(user))return back('sign-in');
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
