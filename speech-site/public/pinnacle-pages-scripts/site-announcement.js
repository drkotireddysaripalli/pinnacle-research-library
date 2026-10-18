(() => {
 'use strict';
 const bar=document.getElementById('pinnacle-site-announcement');if(!bar)return;
 const assetOrigin=new URL(document.currentScript?.src||location.href).origin;
 const dialog=document.getElementById('pinnacle-announcement-details'),configPath=assetOrigin+'/pinnacle-pages-data/site-announcement.json';
 let config=null,poll=null,expiry=null,focusTarget=null;
 const key=()=>`pinnacle-announcement-dismissed:${bar.dataset.announcementId}:${bar.dataset.announcementRevision}`;
 const dismissed=()=>{try{return sessionStorage.getItem(key())==='yes'}catch{return false}};
 function close(){if(dialog?.open)dialog.close();}
 function hide(){bar.hidden=true;close();}
 function dismiss(){try{sessionStorage.setItem(key(),'yes')}catch{}hide();}
 function stop(){hide();document.getElementById('navratri-one-service-month-offer')?.setAttribute('hidden','');const form=document.querySelector('form[data-offer-reference="navratri-one-service-month-2026"]');if(form){form.dataset.offerEnabled='false';delete form.dataset.offerReference;}clearTimeout(expiry);clearInterval(poll);poll=null;}
 function updateLinks(){
  if(!config)return;
  const current=new URL(location.href),target=new URL(config.enquiryPath,'https://www.pinnacleblooms.org');
  for(const [name,value]of current.searchParams)if(name==='gclid'||name==='gbraid'||name==='wbraid'||name.startsWith('utm_'))target.searchParams.append(name,value);
  const activeCentres=new Set((bar.dataset.announcementCentres||'').split(',').filter(Boolean));
  const selectedCentre=current.searchParams.has('centre')?(current.searchParams.getAll('centre').length===1?current.searchParams.get('centre'):null):bar.dataset.announcementCentre;
  target.searchParams.delete('centre');
  if(activeCentres.has(selectedCentre))target.searchParams.set('centre',selectedCentre);
  const services=['help','autism','speech','occupational','aba','education','other'];
  if(current.searchParams.getAll('service').length===1&&services.includes(current.searchParams.get('service')))target.searchParams.set('service',current.searchParams.get('service'));
  else if(bar.dataset.announcementService)target.searchParams.set('service',bar.dataset.announcementService);
  for(const link of document.querySelectorAll('[data-announcement-enquiry]'))link.href=target.href;
 }
 function apply(next){
  if(!next?.active||!next.config||next.config.id!==bar.dataset.announcementId||next.config.revision!==bar.dataset.announcementRevision){stop();return;}
  config=next.config;const remaining=Date.parse(config.expiresAt)-(Number.isFinite(next.serverNow)?next.serverNow:Date.now());if(!(remaining>0)){stop();return;}
  if(!dismissed())bar.hidden=false;updateLinks();clearTimeout(expiry);expiry=setTimeout(stop,Math.min(remaining,2147483647));
 }
 async function refresh(){try{const response=await fetch(configPath,{cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'});if(!response.ok){stop();return;}apply(await response.json());}catch{stop();}}
 bar.querySelector('[data-announcement-dismiss]')?.addEventListener('click',dismiss);
 bar.querySelector('[data-announcement-open]')?.addEventListener('click',event=>{focusTarget=event.currentTarget;if(dialog?.showModal){dialog.showModal();dialog.querySelector('[data-announcement-close]')?.focus();}else location.href=event.currentTarget.dataset.detailsPath;});
 dialog?.querySelector('[data-announcement-close]')?.addEventListener('click',close);
 dialog?.addEventListener('close',()=>{if(focusTarget?.isConnected&&!bar.hidden)focusTarget.focus();});
 dialog?.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
 window.addEventListener('pageshow',refresh);if(dismissed())hide();
 refresh();poll=setInterval(()=>{if(!document.hidden)refresh()},60000);
})();
