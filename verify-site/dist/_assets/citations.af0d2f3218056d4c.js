'use strict';
(() => {
 document.querySelectorAll('[data-copy-citation]').forEach(button=>button.hidden=false);
 document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-copy-citation]');if(!button)return;
  const field=document.getElementById(button.dataset.copyCitation),status=button.closest('.citation-content')?.querySelector('.citation-status');if(!field||!status)return;
  try{await navigator.clipboard.writeText(field.value);status.textContent='Citation copied.';}
  catch{field.focus();field.select();status.textContent='Citation selected. Use your device’s Copy command.';}
 });
})();
