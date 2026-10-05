import {centreFacilities} from './centre-facilities.mjs';

export const ENROLMENT_API_PATH='/api/enrolment';
export const ENROLMENT_UPSTREAM='https://mirracle.pinnacleblooms.org/api/gl/swfs';

const MAX_BODY_BYTES=16*1024;
const SERVICE_MAP={
 help:'Assements - Treatments',
 // Keep the upstream's existing assessment service; preserve the family's
 // Autism / integrated support preference explicitly in Message below.
 autism:'Assements - Treatments',
 speech:'Speech Therapy',
 occupational:'Occupational Therapy',
 aba:'Behavioral Modification',
 education:'Special Education',
 other:'Assements - Treatments'
};
const SERVICE_LABEL={
 help:'Help me choose',autism:'Autism / integrated support',speech:'Speech & language',occupational:'Occupational therapy',
 aba:'ABA / behavioural support',education:'Special education',other:'Another service'
};
const CENTRE_WITHOUT_LEGACY_ID={
 gajuwaka:'Gajuwaka @ Vizag',
 jagadamba:'Jagadamba, Visakhapatnam',
 usa:'USA'
};
const RESPONSE_HEADERS={
 'content-type':'application/json; charset=utf-8',
 'cache-control':'no-store',
 'x-content-type-options':'nosniff',
 'referrer-policy':'no-referrer',
 'content-security-policy':"default-src 'none'; frame-ancestors 'none'"
};

function response(status,state){return new Response(JSON.stringify({status:state}),{status,headers:RESPONSE_HEADERS});}
function validPhone(phone){return typeof phone==='string'&&phone.length<=25&&/^[+\d\s().-]+$/.test(phone)&&phone.replace(/\D/g,'').length>=7&&phone.replace(/\D/g,'').length<=15;}
function validEmail(email){return typeof email==='string'&&email.length<=254&&(!email||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));}
function validRequestId(value){return typeof value==='string'&&value.length>=8&&value.length<=100&&/^[A-Za-z0-9-]+$/.test(value);}

export function validatePublicEnrolment(body){
 if(!body||body.schemaVersion!==1||!validRequestId(body.requestId))return false;
 const contact=body.contact,preferences=body.preferences;
 if(!contact||typeof contact.name!=='string'||!contact.name.trim()||contact.name.trim().length>100||!validPhone(contact.phone)||!validEmail(contact.email))return false;
 if(!preferences||!Object.hasOwn(SERVICE_MAP,preferences.service)||typeof preferences.centre!=='string')return false;
 if(preferences.centre&&!Object.hasOwn(centreFacilities,preferences.centre)&&!Object.hasOwn(CENTRE_WITHOUT_LEGACY_ID,preferences.centre))return false;
 return typeof body.message==='string'&&body.message.length<=500&&body.source?.page==='/enroll-autism-speech-aba-therapies-india';
}

export function toLegacyEnrolment(body){
 const slug=body.preferences.centre;
 const facility=slug?centreFacilities[slug]:null;
 const centreName=facility?.name||CENTRE_WITHOUT_LEGACY_ID[slug]||'Help me find a centre';
 const parts=[
  'Website enrolment request.',
  `Service preference: ${SERVICE_LABEL[body.preferences.service]}.`,
  `Centre preference: ${centreName}.`
 ];
 if(body.message.trim())parts.push(`Family note: ${body.message.trim()}`);
 else parts.push('Please contact the enquirer to understand the suitable next step.');
 return {
  FormType:'Enroll',
  Name:body.contact.name.trim(),
  MobileNumber:body.contact.phone.trim(),
  Message:parts.join(' '),
  EmailId:body.contact.email.trim()||'not-provided@pinnacleblooms.org',
  Services:[SERVICE_MAP[body.preferences.service]],
  FacilityIds:[facility?.id||''],
  Title:'Mx',
  Languages:['English']
 };
}

async function readBoundedJson(request){
 const declared=Number(request.headers.get('content-length')||0);
 if(Number.isFinite(declared)&&declared>MAX_BODY_BYTES)throw new Error('too-large');
 if(!request.body)return null;
 const reader=request.body.getReader();let size=0;const chunks=[];
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_BODY_BYTES){await reader.cancel();throw new Error('too-large');}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
 return JSON.parse(new TextDecoder().decode(bytes));
}

export async function serveEnrolmentApi(request,env,{fetchImpl=fetch,timeoutMs=15000}={}){
 const url=new URL(request.url);
 if(url.hostname!=='www.pinnacleblooms.org'||url.pathname!==ENROLMENT_API_PATH)return null;
 if(request.method!=='POST')return new Response(null,{status:405,headers:{...RESPONSE_HEADERS,allow:'POST'}});
 if(request.headers.get('origin')!=='https://www.pinnacleblooms.org')return response(403,'rejected');
 if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type')||''))return response(415,'rejected');
 let body;
 try{body=await readBoundedJson(request);}catch{return response(422,'rejected');}
 if(!validatePublicEnrolment(body))return response(422,'rejected');
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
 try{
  const upstreamOptions={method:'POST',headers:{'content-type':'application/json','accept':'text/plain, application/json'},body:JSON.stringify(toLegacyEnrolment(body)),signal:controller.signal};
  // The legacy API is served by another Worker in this account. A direct
  // service binding keeps the POST inside Cloudflare and avoids a routed
  // Worker-to-Worker subrequest being rejected with an empty HTTP 405.
  const upstream=env?.PINNACLE_LEGACY?.fetch
   ?await env.PINNACLE_LEGACY.fetch(new Request(ENROLMENT_UPSTREAM,upstreamOptions))
   :await fetchImpl(ENROLMENT_UPSTREAM,upstreamOptions);
  const answer=(await upstream.text()).trim().toLowerCase();
  if(upstream.ok&&answer==='true')return response(202,'accepted');
  console.warn('enrolment-upstream-unconfirmed',{status:upstream.status,contentType:upstream.headers.get('content-type')||'',answerKind:answer==='false'?'false':answer?'other':'empty',answerLength:answer.length});
  return response(502,'unknown');
 }catch(error){console.warn('enrolment-upstream-error',{name:error?.name||'Error',message:error?.message||'unknown'});return response(502,'unknown');}finally{clearTimeout(timer);}
}
