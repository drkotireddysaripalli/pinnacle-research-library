// Public form contract. Cloudflare translates this deliberately small envelope
// to the existing PinnacleAI enrolment workflow without exposing that service.
import {normaliseAcquisition} from './enrolment-source.mjs?v=source-20261008';
export const services = new Set(['help','autism','speech','occupational','aba','education','other']);
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
export function makePayload(values, requestId, acquisition) {
 const permitted=normaliseAcquisition(acquisition);
 return {schemaVersion:1,requestId,contact:{name:values.name.trim(),phone:values.phone.trim(),email:values.email.trim()},preferences:{service:values.service,centre:values.centre},message:values.message.trim(),source:{page:'/enroll-autism-speech-aba-therapies-india',...(permitted?{acquisition:permitted}:{})}};
}
export function approvedEndpoint(endpoint, origin) {
 if(typeof endpoint!=='string'||!endpoint)return null;
 try{const u=new URL(endpoint,origin);return u.origin===origin&&u.pathname==='/api/enrolment'&&!u.search&&!u.hash&&!u.username&&!u.password?u.href:null;}catch{return null;}
}
export const ATTEMPT_STORAGE_KEY='pbn-enrolment-request-v1';
const requestKey=/^[A-Za-z0-9-]{8,100}$/;
export function validAcceptedReceipt(receipt,requestId){return receipt?.schemaVersion===1&&receipt.requestId===requestId&&typeof receipt.id==='string'&&requestKey.test(receipt.id);}
// Essential request metadata only. Contact details, note, preferences, query
// strings and advertising identifiers never enter persistent browser storage.
export function createAttemptStore(storage){
 function read(){
  const raw=storage.getItem(ATTEMPT_STORAGE_KEY);if(!raw)return null;
  const entry=JSON.parse(raw);
  if(entry?.schemaVersion!==1||!requestKey.test(entry.requestId||'')||!['pending','unknown','accepted'].includes(entry.state)||!Number.isFinite(entry.createdAt))throw new Error('invalid-request-state');
  if(entry.state==='accepted'&&!validAcceptedReceipt(entry.receipt,entry.requestId)&&entry.contractVersion!==0)throw new Error('invalid-request-receipt');
  return entry;
 }
 function write(entry){
  const safe={schemaVersion:1,requestId:entry.requestId,state:entry.state,createdAt:entry.createdAt};
  if(entry.state==='accepted'){
   if(validAcceptedReceipt(entry.receipt,entry.requestId))safe.receipt={schemaVersion:1,requestId:entry.requestId,id:entry.receipt.id};
   else if(entry.contractVersion===0)safe.contractVersion=0;
   else throw new Error('invalid-request-receipt');
  }
  storage.setItem(ATTEMPT_STORAGE_KEY,JSON.stringify(safe));
  return safe;
 }
 return {read,write,clear:()=>storage.removeItem(ATTEMPT_STORAGE_KEY)};
}
export async function submitEnrolment(endpoint, payload, {origin,fetchImpl=fetch,timeoutMs=15000,receiptRequired=false}={}) {
 const target=approvedEndpoint(endpoint,origin);
 if(!target)return {state:'unavailable'};
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeoutMs);
 try{
  const response=await fetchImpl(target,{method:'POST',headers:{'content-type':'application/json','accept':'application/json','idempotency-key':payload.requestId},credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',signal:controller.signal,body:JSON.stringify(payload)});
  const json=await response.json();
  // Acceptance requires the durable receiver receipt for this exact key.
  if(response.ok&&json?.status==='accepted'&&validAcceptedReceipt(json.receipt,payload.requestId))return {state:'accepted',receipt:json.receipt};
  // Explicit transitional legacy boundary. This is not a durable receipt and
  // must never be described as deduplicated receiving-system acceptance.
  if(!receiptRequired&&response.ok&&json?.status==='accepted'&&json.contractVersion===0)return {state:'accepted',contractVersion:0};
  if([400,409,422,429].includes(response.status)&&json?.status==='rejected')return {state:'rejected'};
  return {state:'unknown'};
 }catch{return {state:'unknown'};}finally{clearTimeout(timer);}
}
