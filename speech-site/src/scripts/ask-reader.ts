// Identity is fetched separately: public SSR content never contains user data.
import {setupAskVerification} from './ask-verification';
type GoogleIdentity={initialize:(options:Record<string,unknown>)=>void;renderButton:(element:HTMLElement,options:Record<string,unknown>)=>void;disableAutoSelect:()=>void};
const googleIdentity=()=> (window as unknown as {google?:{accounts?:{id?:GoogleIdentity}}}).google?.accounts?.id;
let googleLoader:Promise<void>|undefined;
function loadGoogle(){
 if(googleIdentity())return Promise.resolve();
 if(!googleLoader)googleLoader=new Promise<void>((resolve,reject)=>{
  const script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true;
  const timer=setTimeout(()=>{script.remove();googleLoader=undefined;reject(Error('google-load'));},12000);
  script.onload=()=>{clearTimeout(timer);resolve();};script.onerror=()=>{clearTimeout(timer);script.remove();googleLoader=undefined;reject(Error('google-load'));};document.head.append(script);
 });
 return googleLoader;
}
const gate=document.querySelector<HTMLDialogElement>('#ask-reader-gate');
if(gate){
 const signIn=document.querySelector<HTMLFormElement>('[data-ask-google-form]')!;
 const signOut=document.querySelector<HTMLFormElement>('[data-ask-logout]')!;
 const profile=document.querySelector<HTMLDetailsElement>('[data-ask-profile]')!;
 const openButton=document.querySelector<HTMLButtonElement>('[data-ask-sign-in]')!;
 const status=gate.querySelector<HTMLElement>('[data-ask-gate-status]')!;
 const retry=gate.querySelector<HTMLButtonElement>('[data-ask-session-retry]')!;
 const button=signIn.querySelector<HTMLButtonElement>('button')!;
 const googleButton=gate.querySelector<HTMLElement>('[data-ask-google-button]')!;
 const current=new URL(location.href),reason=current.searchParams.get('ask_signin');
 current.searchParams.delete('ask_signin');
 if(reason)history.replaceState(null,'',current.pathname+current.search+current.hash);
 if(reason==='signed-out')try{localStorage.setItem('ask-auth-change',String(Date.now()));}catch{}
 const returnTo=current.pathname+current.search+current.hash;
 for(const form of [signIn,signOut])form.querySelector<HTMLInputElement>('[name=returnTo]')!.value=returnTo;
 const lock=()=>{verification.close();profile.hidden=true;profile.open=false;openButton.hidden=false;if(!gate.open)gate.showModal();};
 gate.addEventListener('cancel',event=>event.preventDefault());
 openButton.addEventListener('click',lock);
 let pending=false;
 async function check(){
  if(pending)return;pending=true;button.disabled=true;retry.hidden=true;googleButton.hidden=true;
  status.textContent='Checking your sign-in…';
  try{
   const response=await fetch('/ask/auth/session',{credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'},signal:AbortSignal.timeout(12000)});
   if(!response.ok)throw Error('session');
   const data=await response.json();if(!/^[0-9a-f-]{36}$/.test(data.csrf||''))throw Error('session');
   verification.update(data.profile?.whatsappVerified===true,data.csrf);
   for(const form of [signIn,signOut])form.querySelector<HTMLInputElement>('[name=csrf]')!.value=data.csrf;
   if(data.profile){
    const name=String(data.profile.name||'Ask reader');
    document.querySelectorAll<HTMLElement>('[data-ask-profile-name]').forEach(n=>n.textContent=name);
    const fallbacks=[...document.querySelectorAll<HTMLElement>('[data-ask-avatar-fallback]')];
    document.querySelectorAll<HTMLImageElement>('[data-ask-avatar]').forEach((image,i)=>{const fallback=fallbacks[i];fallback.textContent=name.charAt(0).toUpperCase();fallback.hidden=false;image.hidden=true;
     if(data.profile.avatar){image.onload=()=>{image.hidden=false;fallback.hidden=true;};image.onerror=()=>{image.hidden=true;fallback.hidden=false;};image.src=data.profile.avatar;}
    });
    profile.hidden=false;openButton.hidden=true;gate!.close();
   }else{
    lock();
    if(data.google){
     signIn.hidden=true;await loadGoogle();const identity=googleIdentity();if(!identity)throw Error('google-load');
     identity.initialize({client_id:data.google.clientId,nonce:data.google.nonce,auto_select:false,ux_mode:'popup',context:'signin',callback:(result:{credential?:string})=>{
      if(!result.credential){status.textContent='Sign-in was not completed. Please try again.';return;}
      signIn.action='/ask/auth/google-id-token';signIn.querySelector<HTMLInputElement>('[name=credential]')!.value=result.credential;
      signIn.requestSubmit();
     }});
     googleButton.replaceChildren();googleButton.hidden=false;
     identity.renderButton(googleButton,{type:'standard',theme:'outline',size:'large',text:'continue_with',shape:'rectangular',logo_alignment:'left',width:Math.min(400,Math.floor(googleButton.clientWidth))});
    }else{signIn.hidden=false;button.disabled=false;}
    status.textContent=reason==='wait'?'Please wait a minute, then try signing in again.':reason==='signed-out'?'You’re signed out.':reason?'Sign-in was not completed. Please try again.':'';
   }
  }catch{lock();status.textContent='We couldn’t connect to sign-in. Please try again.';retry.hidden=false;}
  finally{pending=false;}
 }
 const verification=setupAskVerification(check);
 retry.addEventListener('click',()=>void check());
 signIn.addEventListener('submit',()=>{button.disabled=true;status.textContent='Opening Google…';});
 signOut.addEventListener('submit',()=>{googleIdentity()?.disableAutoSelect();lock();});
 window.addEventListener('storage',event=>{if(event.key==='ask-auth-change'){lock();void check();}});
 window.addEventListener('pageshow',event=>{if(event.persisted){lock();void check();}});
 window.addEventListener('pagehide',lock);
 document.addEventListener('click',event=>{if(!profile.contains(event.target as Node))profile.open=false;});
 void check();
}
