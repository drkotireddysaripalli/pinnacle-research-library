// Identity is fetched separately: public SSR content never contains user data.
const gate=document.querySelector<HTMLDialogElement>('#ask-reader-gate');
if(gate){
 const signIn=document.querySelector<HTMLFormElement>('[data-ask-google-form]')!;
 const signOut=document.querySelector<HTMLFormElement>('[data-ask-logout]')!;
 const profile=document.querySelector<HTMLDetailsElement>('[data-ask-profile]')!;
 const openButton=document.querySelector<HTMLButtonElement>('[data-ask-sign-in]')!;
 const status=gate.querySelector<HTMLElement>('[data-ask-gate-status]')!;
 const retry=gate.querySelector<HTMLButtonElement>('[data-ask-session-retry]')!;
 const button=signIn.querySelector<HTMLButtonElement>('button')!;
 const current=new URL(location.href),reason=current.searchParams.get('ask_signin');
 current.searchParams.delete('ask_signin');
 if(reason)history.replaceState(null,'',current.pathname+current.search+current.hash);
 if(reason==='signed-out')try{localStorage.setItem('ask-auth-change',String(Date.now()));}catch{}
 const returnTo=current.pathname+current.search+current.hash;
 for(const form of [signIn,signOut])form.querySelector<HTMLInputElement>('[name=returnTo]')!.value=returnTo;
 const lock=()=>{profile.hidden=true;profile.open=false;openButton.hidden=false;if(!gate.open)gate.showModal();};
 gate.addEventListener('cancel',event=>event.preventDefault());
 openButton.addEventListener('click',lock);
 let pending=false;
 async function check(){
  if(pending)return;pending=true;button.disabled=true;retry.hidden=true;
  status.textContent='Checking your sign-in…';
  try{
   const response=await fetch('/ask/auth/session',{credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'},signal:AbortSignal.timeout(12000)});
   if(!response.ok)throw Error('session');
   const data=await response.json();if(!/^[0-9a-f-]{36}$/.test(data.csrf||''))throw Error('session');
   for(const form of [signIn,signOut])form.querySelector<HTMLInputElement>('[name=csrf]')!.value=data.csrf;
   if(data.profile){
    const name=String(data.profile.name||'Ask reader');
    document.querySelector<HTMLElement>('[data-ask-profile-name]')!.textContent=name;
    const image=document.querySelector<HTMLImageElement>('[data-ask-avatar]')!;
    const fallback=document.querySelector<HTMLElement>('[data-ask-avatar-fallback]')!;
    fallback.textContent=name.charAt(0).toUpperCase();fallback.hidden=false;image.hidden=true;
    if(data.profile.avatar){image.onload=()=>{image.hidden=false;fallback.hidden=true;};image.onerror=()=>{image.hidden=true;fallback.hidden=false;};image.src=data.profile.avatar;}
    profile.hidden=false;openButton.hidden=true;gate!.close();
   }else{
    lock();button.disabled=false;
    status.textContent=reason==='wait'?'Please wait a minute, then try signing in again.':reason==='signed-out'?'You’re signed out.':reason?'Sign-in was not completed. Please try again.':'';
   }
  }catch{lock();status.textContent='We couldn’t connect to sign-in. Please try again.';retry.hidden=false;}
  finally{pending=false;}
 }
 retry.addEventListener('click',()=>void check());
 signIn.addEventListener('submit',()=>{button.disabled=true;status.textContent='Opening Google…';});
 signOut.addEventListener('submit',lock);
 window.addEventListener('storage',event=>{if(event.key==='ask-auth-change'){lock();void check();}});
 window.addEventListener('pageshow',event=>{if(event.persisted){lock();void check();}});
 window.addEventListener('pagehide',lock);
 document.addEventListener('click',event=>{if(!profile.contains(event.target as Node))profile.open=false;});
 void check();
}
