export function setupAskVerification(refresh:()=>Promise<void>){
 const dialog=document.querySelector<HTMLDialogElement>('#ask-whatsapp-verification')!;
 const profile=document.querySelector<HTMLDetailsElement>('[data-ask-profile]')!;
 const phoneForm=dialog.querySelector<HTMLFormElement>('[data-ask-phone-form]')!;
 const codeForm=dialog.querySelector<HTMLFormElement>('[data-ask-code-form]')!;
 const message=dialog.querySelector<HTMLElement>('[data-ask-verification-status]')!;
 const verifyButton=document.querySelector<HTMLButtonElement>('[data-ask-verify-open]')!;
 let verified=false,csrf='',pendingContact:string|null=null,busy=false,generation=0;
 const errors:Record<string,string>={'sign-in':'Please sign in again.','wait':'Please wait a minute before trying again.','phone-format':'Enter your WhatsApp number with its country code.','phone-send':'We couldn’t send the code. Check your number and try again.','phone-unavailable':'Verification is temporarily unavailable. Please try again later.','code-invalid':'That code is incorrect or has expired. Please try again.','verification-record':'We couldn’t save your verification. Please try again.','verification-required':'Verify your WhatsApp number first.'};
 const close=()=>{generation++;pendingContact=null;if(dialog.open)dialog.close();};
 function open(mode:string|null=null){generation++;pendingContact=mode;profile.open=false;phoneForm.hidden=false;codeForm.hidden=true;message.textContent='';codeForm.reset();if(!dialog.open)dialog.showModal();}
 async function request(kind:string,fields:Record<string,string>){
  const response=await fetch('/ask/auth/'+kind,{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'content-type':'application/x-www-form-urlencoded',accept:'application/json'},body:new URLSearchParams({csrf,...fields}),signal:AbortSignal.timeout(15000)});
  const data=await response.json();if(!response.ok)throw Error(data.status||'network');return data;
 }
 async function contact(mode:string){
  if(!verified){open(mode);return;}
  const operation=generation;
  try{const data=await request('contact',{mode});if(operation!==generation)return;if(data.url===(mode==='call'?'tel:+919100181181':'https://wa.me/919100181181')){profile.open=false;location.assign(data.url);}}
  catch(error){if(operation!==generation)return;open(mode);message.textContent=errors[(error as Error).message]||'We couldn’t connect. Please try again.';}
 }
 verifyButton.addEventListener('click',()=>{if(!verified)open();});
 document.querySelectorAll<HTMLButtonElement>('[data-ask-contact]').forEach(b=>b.addEventListener('click',()=>void contact(b.dataset.askContact!)));
 document.querySelector('[data-ask-profile-close]')?.addEventListener('click',()=>{profile.open=false;profile.querySelector<HTMLElement>('summary')?.focus();});
 profile.addEventListener('keydown',event=>{if(event.key==='Escape'){profile.open=false;profile.querySelector<HTMLElement>('summary')?.focus();}});
 dialog.querySelectorAll('[data-ask-verification-cancel]').forEach(b=>b.addEventListener('click',close));
 dialog.addEventListener('cancel',close);
 dialog.querySelector('[data-ask-phone-change]')?.addEventListener('click',()=>{phoneForm.hidden=false;codeForm.hidden=true;message.textContent='';});
 function busyState(value:boolean){busy=value;dialog.querySelectorAll<HTMLButtonElement>('form button').forEach(b=>b.disabled=value);}
 phoneForm.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;const phone=String(new FormData(phoneForm).get('phone')||'').replace(/[ ()-]/g,'');
  if(!/^\+[1-9][0-9]{7,14}$/.test(phone)){message.textContent=errors['phone-format'];return;}
  const operation=generation;busyState(true);message.textContent='Sending your code…';
  try{await request('phone',{phone,verificationConsent:'yes'});if(operation===generation&&dialog.open){phoneForm.hidden=true;codeForm.hidden=false;message.textContent='Code sent. Check WhatsApp.';codeForm.querySelector<HTMLInputElement>('input')!.focus();}}
  catch(error){if(operation===generation)message.textContent=errors[(error as Error).message]||'We couldn’t confirm delivery. Please try again.';}
  finally{busyState(false);}
 });
 codeForm.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;const token=String(new FormData(codeForm).get('token')||'').trim();if(!/^\d{6}$/.test(token))return;
  const operation=generation;busyState(true);message.textContent='Verifying your number…';
  try{await request('verify',{token});if(operation!==generation)return;await refresh();if(operation!==generation)return;const mode=dialog.open?pendingContact:null;if(verified){close();profile.open=!mode;if(mode)await contact(mode);}else message.textContent='Verification is still updating. Please try again.';}
  catch(error){if(operation===generation)message.textContent=errors[(error as Error).message]||'We couldn’t confirm verification. Please try again.';}
  finally{busyState(false);}
 });
 return {close,update(value:boolean,token:string){
  verified=value;csrf=token;
  document.querySelectorAll<HTMLElement>('[data-ask-verified-badge]').forEach(b=>{b.dataset.verified=String(value);b.setAttribute('aria-label',value?'WhatsApp number verified':'WhatsApp number not yet verified');b.title=value?'WhatsApp number verified':'Get Verified with WhatsApp';});
  document.querySelector<HTMLElement>('[data-ask-verify-text]')!.textContent=value?'WhatsApp verified':'Get Verified';
  document.querySelector<HTMLElement>('[data-ask-verification-label]')!.textContent=value?'Google sign-in · WhatsApp verified':'Signed in with Google';
  verifyButton.disabled=value;
 }};
}
