'use strict';
(() => {
 const status=document.querySelector('.share-status');let timeout;
 const collapse=()=>document.querySelectorAll('.share-toggle[aria-expanded="true"]').forEach(b=>{b.setAttribute('aria-expanded','false');b.closest('.fact-share').querySelector('.share-options').hidden=true;});
 document.querySelectorAll('.fact-share').forEach(bar=>{const toggle=bar.querySelector('.share-toggle'),options=bar.querySelector('.share-options');if(toggle&&options){toggle.hidden=false;options.hidden=true;toggle.addEventListener('click',()=>{const open=options.hidden;collapse();options.hidden=!open;toggle.setAttribute('aria-expanded',String(open));});}});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){const active=document.querySelector('.share-toggle[aria-expanded="true"]');collapse();active?.focus();}});
 document.addEventListener('click',event=>{if(!event.target.closest('.fact-share'))collapse();});
 const announce=message=>{if(!status)return;status.textContent=message;clearTimeout(timeout);timeout=setTimeout(()=>status.textContent='',5000);};
 const fallback=url=>{const dialog=document.querySelector('.share-fallback'),field=dialog?.querySelector('input');if(!dialog||!field)return;field.value=url;dialog.showModal();field.focus();field.select();};
 if(navigator.share)document.querySelectorAll('.device-share').forEach(button=>button.hidden=false);
 document.addEventListener('click',async event=>{
  const button=event.target.closest('.copy-share,.device-share');if(!button)return;
  const bar=button.closest('.fact-share'),url=bar?.dataset.shareUrl;if(!url)return;
  if(button.classList.contains('copy-share')){try{await navigator.clipboard.writeText(url);announce('Evidence link copied.');}catch{fallback(url);}return;}
  const link=bar.querySelector('.share-x');const text=new URL(link.href).searchParams.get('text')||bar.dataset.shareTitle;
  try{await navigator.share({title:bar.dataset.shareTitle,text,url});}catch(error){if(error.name!=='AbortError')fallback(url);}
 });
 const reveal=()=>{let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const element=document.getElementById(id);if(!element)return;for(let item=element;item;item=item.parentElement){if(item.tagName==='DETAILS')item.open=true;}if(!element.hidden)requestAnimationFrame(()=>element.scrollIntoView({block:'start',behavior:'instant'}));};
 window.addEventListener('hashchange',reveal);reveal();
})();
