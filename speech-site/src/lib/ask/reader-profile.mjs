import {createClient} from '@supabase/supabase-js';
export const GOOGLE_PROFILE_SCOPES='openid email profile https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.addresses.read';
const keys=['phone','city','postal_code','country'];
export function profilePhone(value){const v=String(value||'').replace(/[ ()-]/g,'');return /^\+[1-9][0-9]{7,14}$/.test(v)?v:null;}
export function profileFields(input){
 const phone=String(input.phone||'').trim(),city=String(input.city||'').trim().normalize('NFC'),postal=String(input.postal_code||'').trim(),country=String(input.country||'').trim().toUpperCase();
 if((phone&&!profilePhone(phone))||city.length>80||/[<>\x00-\x1f\x7f]/.test(city)||(country&&!/^[A-Z]{2}$/.test(country))||(postal&&!(country==='IN'?/^[1-9][0-9]{5}$/:/^[A-Za-z0-9][A-Za-z0-9 -]{0,15}$/).test(postal)))return null;
 return {phone:phone?profilePhone(phone):'',city,postal_code:postal,country};
}
export function readerProfile(user){
 const stored=user?.app_metadata?.ask_profile||{},fields=stored.fields||{};
 const safe=profileFields(Object.fromEntries(keys.map(k=>[k,fields[k]?.value||''])))||{phone:'',city:'',postal_code:'',country:''};
 return {fields:safe,reviewed:!!(stored.reviewed_at||stored.skipped_at),sources:Object.fromEntries(keys.filter(k=>safe[k]).map(k=>[k,['google','user'].includes(fields[k]?.source)?fields[k].source:'unknown']))};
}
function adminClient(env){return createClient(env.SUPABASE_URL,env.ASK_AUTH_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>fetch(input,{...init,signal:AbortSignal.timeout(8000)})}});}
export async function saveReaderProfile(env,user,input,mode='user'){
 if(!env.ASK_AUTH_SECRET_KEY)return {status:'profile-unavailable'};
 const admin=adminClient(env);
 if(mode==='google'){const fresh=await admin.auth.admin.getUserById(user.id);if(fresh.error||fresh.data.user?.id!==user.id)return {status:'profile-save'};const sub=u=>u.identities?.find(x=>x.provider==='google')?.identity_data?.sub;if(sub(fresh.data.user)!==sub(user))return {status:'google-profile-account'};user=fresh.data.user;}
 const old=user.app_metadata?.ask_profile||{},fields={...(old.fields||{})},at=new Date().toISOString();
 if(mode!=='skip'){
  const values=profileFields(input);if(!values)return {status:'profile-format'};
  for(const key of keys){
   const value=values[key],previous=fields[key];
   if(mode==='google'){
    // A later import must not undo the reader's choices, including a deliberate clear.
    if(!value||(previous?.source==='user'||previous?.confirmed_at))continue;
    fields[key]={value,source:'google',updated_at:at};
   }else fields[key]=previous?.value===value&&previous?.source==='google'?{...previous,confirmed_at:at}:{value,source:'user',updated_at:at};
  }
 }
 const saved={...old,version:'20261028',fields,...(mode==='skip'?{skipped_at:at}:mode==='user'?{reviewed_at:at}:{google_imported_at:at})};
 // Only this namespace is patched. Registration source and WhatsApp verification are untouched.
 let error;try{({error}=await admin.auth.admin.updateUserById(user.id,{app_metadata:{ask_profile:saved}}));}catch{return {status:'profile-save'};}
 return error?{status:'profile-save'}:{status:mode==='skip'?'profile-skipped':'profile-saved',readerProfile:readerProfile({...user,app_metadata:{...user.app_metadata,ask_profile:saved}})};
}
export function googleProfileFields(person,requested){
 const candidates=items=>(Array.isArray(items)?items:[]).filter(x=>!x.metadata?.source?.type||x.metadata.source.type==='PROFILE').sort((a,b)=>Number(!!b.metadata?.primary)-Number(!!a.metadata?.primary));
 const phone=requested.includes('phoneNumbers')?candidates(person.phoneNumbers).map(x=>profilePhone(x.canonicalForm||x.value)).find(Boolean)||'':'';
 const address=requested.includes('addresses')?candidates(person.addresses).find(x=>x.city||x.postalCode||x.countryCode)||{}:{};
 const location=profileFields({city:address.city,postal_code:address.postalCode,country:address.countryCode})||profileFields({city:address.city,country:address.countryCode})||profileFields({city:address.city})||profileFields({});
 return {phone,...(location?{city:location.city,postal_code:location.postal_code,country:location.country}:{city:'',postal_code:'',country:''})};
}
export async function importGoogleProfile(env,user,token,request=fetch){
 if(!env.ASK_GOOGLE_CLIENT_ID)return {status:'google-profile-unavailable'};
 const subject=user.identities?.find(x=>x.provider==='google')?.identity_data?.sub;
 if(!subject||typeof token!=='string'||!token||token.length>8192||/[\s\x00-\x1f]/.test(token))return {status:'google-profile-account'};
 try{
  const headers={authorization:'Bearer '+token};
  // Same POST/Bearer token inspection as Google's official OAuth2 client; token never enters a URL.
  const check=await request('https://oauth2.googleapis.com/tokeninfo',{method:'POST',headers:{...headers,'content-type':'application/x-www-form-urlencoded'},redirect:'manual',signal:AbortSignal.timeout(5000)});
  if(!check.ok)return {status:'google-profile-token'};
  const info=await check.json();if(info.aud!==env.ASK_GOOGLE_CLIENT_ID||String(info.sub||info.user_id)!==String(subject)||!(Number(info.expires_in)>0))return {status:'google-profile-account'};
  const granted=new Set(String(info.scope||'').split(' ')),fields=[];
  if(granted.has('https://www.googleapis.com/auth/user.phonenumbers.read'))fields.push('phoneNumbers');
  if(granted.has('https://www.googleapis.com/auth/user.addresses.read'))fields.push('addresses');
  if(!fields.length)return {status:'google-profile-permission'};
  const url=new URL('https://people.googleapis.com/v1/people/me');url.searchParams.set('personFields',fields.join(','));url.searchParams.set('sources','READ_SOURCE_TYPE_PROFILE');
  const response=await request(url.href,{headers,redirect:'manual',signal:AbortSignal.timeout(5000)});if(!response.ok)return {status:'google-profile-unavailable'};
  const values=googleProfileFields(await response.json(),fields);if(!Object.values(values).some(Boolean))return {status:'google-profile-empty'};
  return await saveReaderProfile(env,user,values,'google');
 }catch{return {status:'google-profile-unavailable'};}
}
