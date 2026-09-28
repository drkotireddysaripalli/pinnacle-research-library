import {services,validateEnrolment,makePayload,approvedEndpoint,submitEnrolment} from './enrolment-api.mjs';
const form=document.getElementById('pinnacle-enrolment');
if(form){
 const preview=form.dataset.preview==='true',endpoint=form.dataset.apiEndpoint;
 const button=document.getElementById('enrol-submit'),summary=document.getElementById('enrol-error-summary'),status=document.getElementById('enrol-status'),centre=document.getElementById('preferred-centre');
 const fields={name:'parent-name',phone:'parent-phone',email:'parent-email',service:'service-label',centre:'preferred-centre',message:'family-priority'};
 const centreIds=new Set([...centre.options].map(o=>o.value));
 let pending=false,finished=false,uncertain=false;
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
  if(errors.email||errors.message)form.querySelector('.enrol-optional').open=true;
  const title=document.createElement('strong');title.textContent='Please check these details:';summary.append(title);
  const list=document.createElement('ul');for(const [field,error]of Object.entries(errors)){const li=document.createElement('li'),link=document.createElement('a');link.href='#'+fields[field];link.textContent=error;link.addEventListener('click',()=>document.getElementById(fields[field]).focus());li.append(link);list.append(li);}summary.append(list);summary.focus();
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(pending||finished||uncertain)return;
  status.textContent='';const data=values(),errors=validateEnrolment(data,centreIds);showErrors(errors);if(Object.keys(errors).length)return;
  if(preview){status.textContent='Preview checked. No request has been sent. Your details have not been saved or transmitted.';status.focus();return;}
  if(!approvedEndpoint(endpoint,location.origin)||!crypto.randomUUID){status.textContent='The form is unavailable. Please call 9100 181 181.';status.focus();return;}
  const payload=makePayload(data,crypto.randomUUID());setBusy(true);status.textContent='Sending your request…';
  const result=await submitEnrolment(endpoint,payload,{origin:location.origin});
  if(result.state==='accepted'){finished=true;form.reset();status.textContent='Thank you. Your request has been received. The Pinnacle team will contact you to arrange the next step. Your appointment will be confirmed with you.';button.textContent='Request received';}
  else if(result.state==='rejected'){status.textContent='Your request was not accepted. Your details are still here. Please check them and try again, or call 9100 181 181.';}
  else {uncertain=true;status.textContent='We could not confirm whether your request was received. Please call 9100 181 181 before sending another request. Your details are still here.';button.textContent='Please call to confirm';}
  setBusy(false);status.focus();
 });
 // Bind prevention before enabling any inputs. Failed or missing scripts leave
 // the native POST form disabled; private information can never become a GET URL.
 if(preview||approvedEndpoint(endpoint,location.origin)){
  controls.forEach(fieldset=>{fieldset.disabled=false;});button.disabled=false;
  document.getElementById('enrol-unavailable').hidden=true;
  const params=new URLSearchParams(location.search),explicit=params.get('service');
  const selected=services.has(explicit)?explicit:params.get('entry')==='speech-assessment'?'speech':'help';
  const option=form.querySelector('input[name="service"][value="'+selected+'"]');if(option)option.checked=true;
  const preferred=params.get('centre');if(preferred&&centreIds.has(preferred))centre.value=preferred;
 }
}
