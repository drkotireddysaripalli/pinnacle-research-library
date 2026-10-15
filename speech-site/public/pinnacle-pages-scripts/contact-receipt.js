import {validateContact,makeContactPayload,CONTACT_ATTEMPT_KEY} from './contact-api.mjs?v=contact-receipt-20261015';
import {CONTACT_CONTRACT,isParentContact} from './contact-options.mjs?v=contact-receipt-20261015';
import {submitEnrolment,createAttemptStore,validAcceptedReceipt} from './enrolment-api.mjs?v=contact-receipt-20261015';
const form=document.querySelector('#pinnacle-contact[data-contact-contract="durable-contact-v1"]');
if(form&&!form.dataset.contactClientReady){
 form.dataset.contactClientReady='true';
 const button=form.querySelector('[data-contact-submit]'),status=document.getElementById('pinnacle-contact-status'),summary=document.getElementById('pinnacle-contact-errors');
 const fields={name:'contact-form-name',title:'contact-form-title',phone:'contact-form-mobile',email:'contact-form-email',facilityId:'facility-for',subject:'contact-for',message:'contact-form-message'};
 const inputs=Object.fromEntries(Object.entries(fields).map(([key,id])=>[key,document.getElementById(id)]));
 let store,pending=false,finished=false,uncertain=false,frozen=null,attempt=null,storageReady=false;
 const lock='pbn-contact-request';
 const retry=document.createElement('button');retry.type='button';retry.dataset.contactSecondary='';retry.textContent='Retry the same request';retry.hidden=true;status.after(retry);
 const another=document.createElement('button');another.type='button';another.dataset.contactSecondary='';another.textContent='Send a different message';another.hidden=true;retry.after(another);
 const values=()=>Object.fromEntries(Object.entries(inputs).map(([key,input])=>[key,input.value]));
 function busy(value){pending=value;form.setAttribute('aria-busy',String(value));for(const input of Object.values(inputs))input.disabled=value||finished||uncertain;button.disabled=value||finished||uncertain;retry.disabled=value;}
 function accepted(){finished=true;uncertain=false;form.reset();status.textContent='Thank you. Your message has been received by Pinnacle. The team will review it and contact you about the next step. An appointment is confirmed separately.';button.textContent='Message received';retry.hidden=true;another.hidden=false;busy(false);}
 function blocked(text){uncertain=true;status.textContent=text;retry.hidden=!frozen;busy(false);}
 function restore(){
  let saved;try{saved=store.read();}catch{blocked('We could not safely restore the request confirmation. Please call 9100 181 181 before sending another message.');return true;}
  if(!saved)return false;
  if(saved.state==='accepted'&&validAcceptedReceipt(saved.receipt,saved.requestId))accepted();
  else blocked('A previous message is awaiting confirmation. Please call 9100 181 181 before sending another message.');
  return true;
 }
 function errors(found){
  summary.replaceChildren();summary.hidden=!Object.keys(found).length;
  for(const [key,input]of Object.entries(inputs)){input.setAttribute('aria-invalid',String(!!found[key]));const id=input.id+'-receipt-error';let p=document.getElementById(id);if(!p){p=document.createElement('p');p.id=id;input.after(p);}p.textContent=found[key]||'';if(found[key])input.setAttribute('aria-describedby',id);else input.removeAttribute('aria-describedby');}
  if(summary.hidden)return;
  const title=document.createElement('strong');title.textContent='Please check these details:';summary.append(title);
  const ul=document.createElement('ul');for(const[key,text]of Object.entries(found)){const li=document.createElement('li'),a=document.createElement('a');a.href='#'+fields[key];a.textContent=text;a.addEventListener('click',()=>inputs[key].focus());li.append(a);ul.append(li);}summary.append(ul);summary.focus();
 }
 async function transmit(){
  busy(true);status.textContent='Sending your message…';let httpStatus;
  const result=await submitEnrolment('/api/enrolment',frozen,{origin:location.origin,receiptRequired:true,fetchImpl:async(...args)=>{const r=await fetch(...args);httpStatus=r.status;return r;}});
  if(result.state==='accepted'){
   try{store.write({...attempt,state:'accepted',receipt:result.receipt});}catch{}
   accepted();
   const detail={receipt:result.receipt,contract:CONTACT_CONTRACT,acquisition:frozen.source.acquisition||null};
   document.dispatchEvent(new CustomEvent('pinnacle:contact-accepted',{detail}));
   if(isParentContact(frozen.preferences.subject))document.dispatchEvent(new CustomEvent('pinnacle:enquiry-accepted',{detail:{...detail,topic:frozen.preferences.subject}}));
  }else if(result.state==='rejected'&&httpStatus!==409){
   try{store.clear();frozen=null;attempt=null;uncertain=false;}catch{uncertain=true;}
   status.textContent='Your message was not accepted. Your details are still here. Please check them and try again, or call 9100 181 181.';
  }else{
   try{store.write({...attempt,state:'unknown'});}catch{}
   blocked(httpStatus===409?'This request reference could not be reconciled. Your details are still here. Please call 9100 181 181 before sending another message.':'We could not confirm receipt. Your details are still here. You can retry this same request, or call 9100 181 181 before sending another message.');
   if(httpStatus===409)retry.hidden=true;
  }
  busy(false);status.focus();
 }
 async function submit(event){
  event.preventDefault();event.stopImmediatePropagation();
  if(pending||finished||uncertain)return;
  const data=values(),found=validateContact(data);errors(found);if(Object.keys(found).length)return;
  if(!storageReady||!crypto.randomUUID){status.textContent='The request form is unavailable on this device. Please call 9100 181 181.';status.focus();return;}
  busy(true);
  const send=async()=>{
   if(restore()){busy(false);return;}
   let acquisition;try{acquisition=window.pinnacleEnquirySource?.();}catch{}
   frozen=makeContactPayload(data,crypto.randomUUID(),acquisition);attempt={schemaVersion:1,requestId:frozen.requestId,state:'pending',createdAt:Date.now()};
   try{store.write(attempt);}catch{blocked('We could not safely save the request reference. Nothing was sent. Please call 9100 181 181.');retry.hidden=true;return;}
   await transmit();
  };
  if(navigator.locks?.request)await navigator.locks.request(lock,send);else await send();
 }
 // Capture prevents the existing delegated legacy AJAX from making a second
 // POST. The server also removes the legacy click class before this loads.
 form.addEventListener('submit',submit,true);
 button.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();form.requestSubmit();},true);
 retry.addEventListener('click',async()=>{
  if(!frozen||pending||finished)return;
  const send=async()=>{let saved;try{saved=store.read();}catch{return blocked('Please call 9100 181 181 to confirm your previous message.');}if(saved?.requestId!==frozen.requestId)return blocked('Please call 9100 181 181 to confirm your previous message.');if(saved.state==='accepted')return validAcceptedReceipt(saved.receipt,saved.requestId)?accepted():blocked('Please call 9100 181 181 to confirm your previous message.');await transmit();};
  if(navigator.locks?.request)await navigator.locks.request(lock,send);else await send();
 });
 another.addEventListener('click',async()=>{const reset=()=>{try{if(store.read()?.state!=='accepted')return;store.clear();location.reload();}catch{}};if(navigator.locks?.request)await navigator.locks.request(lock,reset);else reset();});
 try{store=createAttemptStore(localStorage,CONTACT_ATTEMPT_KEY);const key=CONTACT_ATTEMPT_KEY+'-probe';localStorage.setItem(key,'1');localStorage.removeItem(key);storageReady=true;}catch{}
 if(storageReady){restore();busy(false);}else status.textContent='The request form is unavailable on this device. Please call 9100 181 181.';
}
