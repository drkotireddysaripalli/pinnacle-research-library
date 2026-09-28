// Proposed boundary for the forthcoming PinnacleAI Cloudflare API.
// No endpoint is configured or contacted by the design preview.
export const services = new Set(['help','speech','occupational','aba','education','other']);
export function validateEnrolment(values, centreIds) {
 const errors={};
 if(typeof values.name!=='string'||!values.name.trim()||values.name.trim().length>100)errors.name='Enter your name (up to 100 characters).';
 const phone=typeof values.phone==='string'?values.phone.trim():'';
 if(!/^[+\d\s().-]+$/.test(phone)||phone.length>25||phone.replace(/\D/g,'').length<7||phone.replace(/\D/g,'').length>15)errors.phone='Enter a contact number with 7–15 digits.';
 const email=typeof values.email==='string'?values.email.trim():'';
 if(email&&(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))errors.email='Enter a valid email address, or leave it blank.';
 if(!services.has(values.service))errors.service='Choose a service, or select “Help me choose”.';
 if(values.centre&&!centreIds.has(values.centre))errors.centre='Choose a listed centre, or select “Help me find a centre”.';
 if(typeof values.message!=='string'||values.message.length>500)errors.message='Keep your note to 500 characters or fewer.';
 return errors;
}
export function makePayload(values, requestId) {
 return {schemaVersion:1,requestId,contact:{name:values.name.trim(),phone:values.phone.trim(),email:values.email.trim()},preferences:{service:values.service,centre:values.centre},message:values.message.trim(),source:{page:'/enroll-autism-speech-aba-therapies-india'}};
}
export function approvedEndpoint(endpoint, origin) {
 if(typeof endpoint!=='string'||!endpoint)return null;
 try{const u=new URL(endpoint,origin);return u.origin===origin&&u.pathname.startsWith('/api/')&&!u.search&&!u.hash&&!u.username&&!u.password?u.href:null;}catch{return null;}
}
export async function submitEnrolment(endpoint, payload, {origin,fetchImpl=fetch,timeoutMs=15000}={}) {
 const target=approvedEndpoint(endpoint,origin);
 if(!target)return {state:'unavailable'};
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeoutMs);
 try{
  const response=await fetchImpl(target,{method:'POST',headers:{'content-type':'application/json','accept':'application/json','idempotency-key':payload.requestId},credentials:'same-origin',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',signal:controller.signal,body:JSON.stringify(payload)});
  const json=await response.json();
  // HTTP 200 alone is not acceptance. This proposed envelope must be implemented
  // by PinnacleAI or adapted here against its supplied API contract before launch.
  if(response.ok&&json?.status==='accepted')return {state:'accepted'};
  if([400,422,429].includes(response.status)&&json?.status==='rejected')return {state:'rejected'};
  return {state:'unknown'};
 }catch{return {state:'unknown'};}finally{clearTimeout(timer);}
}
