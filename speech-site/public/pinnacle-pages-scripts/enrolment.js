import {services,validateEnrolment,makePayload,approvedEndpoint,submitEnrolment,createAttemptStore} from './enrolment-api.mjs?v=source-20261008';
const form=document.getElementById('pinnacle-enrolment');
if(form){
 const preview=form.dataset.preview==='true',endpoint=form.dataset.apiEndpoint;
 const button=document.getElementById('enrol-submit'),summary=document.getElementById('enrol-error-summary'),status=document.getElementById('enrol-status'),centre=document.getElementById('preferred-centre'),preferences=document.getElementById('enrol-preferences');
 const anotherRequest=document.createElement('button');anotherRequest.type='button';anotherRequest.className='button secondary';anotherRequest.textContent='Start a different enquiry';anotherRequest.hidden=true;status.after(anotherRequest);
 const fields={name:'parent-name',phone:'parent-phone',email:'parent-email',service:'service-label',centre:'preferred-centre',message:'family-priority'};
 const centreIds=new Set([...centre.options].map(o=>o.value));
 const centreCard=document.getElementById('enrol-centre-card'),centreAnnouncement=document.getElementById('enrol-centre-announcement');
 function renderCentre(announce=false){
  if(!centreCard)return;
  const template=[...document.querySelectorAll('template[data-enrol-centre]')].find(t=>t.dataset.enrolCentre===centre.value);
  centreCard.replaceChildren();centreCard.hidden=!template;
  if(template)centreCard.append(template.content.cloneNode(true));
  if(centreAnnouncement)centreAnnouncement.textContent=announce?(template?'Centre details shown for '+centre.options[centre.selectedIndex].textContent+'.':'We can help you find a centre.'):'';
 }
 centre.addEventListener('change',()=>renderCentre(true));
 form.addEventListener('reset',()=>queueMicrotask(()=>{renderCentre();if(preferences)preferences.open=false;}));
 let pending=false,finished=false,uncertain=false;
 let attemptStore,storageReady=preview;
 if(!preview){try{attemptStore=createAttemptStore(localStorage);const probe='pbn-enrolment-storage-check';localStorage.setItem(probe,'1');localStorage.removeItem(probe);storageReady=true;}catch{}}
 const controls=[...form.querySelectorAll('[data-enrol-fields]')];
 function setBusy(busy){pending=busy;form.setAttribute('aria-busy',String(busy));controls.forEach(fieldset=>{fieldset.disabled=busy||finished;});button.disabled=busy||finished||uncertain;}
 function values(){return {name:document.getElementById(fields.name).value,phone:document.getElementById(fields.phone).value,email:document.getElementById(fields.email).value,service:form.querySelector('[name="service"]:checked')?.value||'',centre:centre.value,message:document.getElementById(fields.message).value};}
 function showErrors(errors){
  summary.replaceChildren();summary.hidden=!Object.keys(errors).length;
  for(const [name,id] of Object.entries(fields)){
   const element=document.getElementById(id),error=document.getElementById(id+'-error');
   if(element.matches('input,select,textarea'))element.setAttribute('aria-invalid',String(Boolean(errors[name])));
   if(error)error.textContent=errors[name]||'';
  }
  if(summary.hidden)return;
  if((errors.service||errors.centre)&&preferences)preferences.open=true;
  if(errors.email||errors.message)form.querySelector('.enrol-optional').open=true;
  const title=document.createElement('strong');title.textContent='Please check these details:';summary.append(title);
  const list=document.createElement('ul');for(const [field,error]of Object.entries(errors)){const li=document.createElement('li'),link=document.createElement('a');link.href='#'+fields[field];link.textContent=error;link.addEventListener('click',()=>document.getElementById(fields[field]).focus());li.append(link);list.append(li);}summary.append(list);summary.focus();
 }
 function showAccepted(){
  finished=true;form.reset();status.textContent='Thank you. Your request has been received. The Pinnacle team will contact you to arrange the next step. Your appointment will be confirmed with you.';button.textContent='Request received';anotherRequest.hidden=false;
 }
 anotherRequest.addEventListener('click',async()=>{
  const reset=()=>{try{const saved=attemptStore.read();if(saved?.state!=='accepted')return;attemptStore.clear();location.reload();}catch{}};
  if(navigator.locks?.request)await navigator.locks.request('pbn-enrolment-request',reset);else reset();
 });
 function restoreAttempt(){
  if(preview)return false;
  let saved;try{saved=attemptStore.read();}catch{storageReady=false;uncertain=true;status.textContent='We could not safely restore the request confirmation on this device. Please call 9100 181 181.';button.textContent='Please call to confirm';setBusy(false);return true;}
  if(!saved)return false;
  if(saved.state==='accepted')showAccepted();
  else {uncertain=true;status.textContent='A previous request is awaiting confirmation. Please call 9100 181 181 before sending another request.';button.textContent='Please call to confirm';}
  setBusy(false);return true;
 }
 async function sendValidated(data){
  // A second tab rechecks the same metadata while holding the origin's Web Lock.
  // A reload turns pending into uncertain and never automatically sends again.
  if(restoreAttempt())return;
  let acquisition;try{acquisition=window.pinnacleEnquirySource?.();}catch{}
  const payload=makePayload(data,crypto.randomUUID(),acquisition),attempt={schemaVersion:1,requestId:payload.requestId,state:'pending',createdAt:Date.now()};
  try{attemptStore.write(attempt);}catch{uncertain=true;status.textContent='We could not safely save the request confirmation on this device. Please call 9100 181 181.';setBusy(false);return;}
  setBusy(true);status.textContent='Sending your request…';
  const result=await submitEnrolment(endpoint,payload,{origin:location.origin,receiptRequired:true});
  if(result.state==='accepted'){
   // Persist before emitting. Reloading a receipt never re-emits the GA4 event.
   try{attemptStore.write({...attempt,state:'accepted',receipt:result.receipt,contractVersion:result.contractVersion});}catch{}
   showAccepted();document.dispatchEvent(new CustomEvent('pinnacle:enquiry-accepted',{detail:{receipt:result.receipt}}));
  }
  else if(result.state==='rejected'){
   try{attemptStore.clear();}catch{uncertain=true;}
   status.textContent='Your request was not accepted. Your details are still here. Please check them and try again, or call 9100 181 181.';
  }
  else {
   uncertain=true;try{attemptStore.write({...attempt,state:'unknown'});}catch{}
   status.textContent='We could not confirm whether your request was received. Please call 9100 181 181 before sending another request. Your details are still here.';button.textContent='Please call to confirm';
  }
  setBusy(false);status.focus();
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(pending||finished||uncertain)return;
  status.textContent='';const data=values(),errors=validateEnrolment(data,centreIds);showErrors(errors);if(Object.keys(errors).length)return;
  if(preview){status.textContent='Preview checked. No request has been sent. Your details have not been saved or transmitted.';status.focus();return;}
  if(!approvedEndpoint(endpoint,location.origin)||!crypto.randomUUID||!storageReady){status.textContent='The form is unavailable on this device. Please call 9100 181 181.';status.focus();return;}
  setBusy(true);
  if(navigator.locks?.request)await navigator.locks.request('pbn-enrolment-request',()=>sendValidated(data));
  else await sendValidated(data);
 });
 // Bind prevention before enabling any inputs. Failed or missing scripts leave
 // the native POST form disabled; private information can never become a GET URL.
 if(preview||approvedEndpoint(endpoint,location.origin)){
  restoreAttempt();setBusy(false);
  document.getElementById('enrol-unavailable').hidden=true;
  const params=new URLSearchParams(location.search),explicit=params.get('service'),entrySpeech=params.get('entry')==='speech-assessment',explicitService=services.has(explicit);
  const selected=explicitService?explicit:entrySpeech?'speech':'help';
  const option=form.querySelector('input[name="service"][value="'+selected+'"]');if(option)option.checked=true;
  const preferred=params.get('centre'),explicitCentre=preferred&&centreIds.has(preferred);if(explicitCentre)centre.value=preferred;
  if(preferences&&(explicitService||entrySpeech||explicitCentre))preferences.open=true;
  const offer=document.getElementById('enrol-speech-offer'),heading=document.getElementById('request-title'),intro=document.querySelector('.enrol-form-intro');
  const defaultHeading=heading?.innerHTML,defaultIntro=intro?.textContent,defaultAction=button.textContent;
  function renderOffer(){
   const active=entrySpeech&&form.querySelector('[name="service"]:checked')?.value==='speech';
   if(offer)offer.hidden=!active;
   if(heading){if(active)heading.textContent='Start your child’s FREE speech assessment.';else heading.innerHTML=defaultHeading;}
   if(intro)intro.textContent=active?'Your name and number are enough. The team will confirm your speech and language assessment appointment with you.':defaultIntro;
   if(!finished&&!pending&&!uncertain)button.textContent=active?(preview?'Check form preview':'Request my FREE speech assessment'):defaultAction;
  }
  form.querySelectorAll('[name="service"]').forEach(option=>option.addEventListener('change',renderOffer));
  renderOffer();
  renderCentre();
 }
}
