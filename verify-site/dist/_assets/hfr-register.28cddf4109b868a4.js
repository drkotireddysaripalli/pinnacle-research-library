'use strict';
(() => {
 const search=document.getElementById('hfr-search');
 if(!search)return;
 const rows=[...document.querySelectorAll('[data-hfr-search]')];
 const status=document.getElementById('hfr-status');
 const filter=()=>{
  const query=search.value.trim().toLocaleLowerCase();
  rows.forEach(row=>row.hidden=!row.dataset.hfrSearch.includes(query)||(status&&status.value!=='all'&&row.dataset.hfrEvidence!==status.value));
  const count=rows.filter(row=>!row.hidden).length;
  document.getElementById('hfr-result').textContent=count+' HFR '+(count===1?'record':'records');
  document.getElementById('hfr-empty').hidden=count>0;
 };
 search.addEventListener('input',filter);
 status?.addEventListener('change',filter);
 const revealLinkedRecord=()=>{
  let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{return;}
  if(!target)return;
  if(target.matches('[data-hfr-search]')){
   search.value='';if(status)status.value='all';filter();
   const details=target.querySelector('details');if(details)details.open=true;
  }
  let parent=target.parentElement;
  while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}
 };
 revealLinkedRecord();
 window.addEventListener('hashchange',revealLinkedRecord);
})();
