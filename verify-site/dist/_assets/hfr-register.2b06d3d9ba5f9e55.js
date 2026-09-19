'use strict';
(() => {
 const search=document.getElementById('hfr-search');
 if(!search)return;
 const rows=[...document.querySelectorAll('[data-hfr-search]')];
 const status=document.getElementById('hfr-status');
 const filter=()=>{
  const query=search.value.trim().toLocaleLowerCase();
  rows.forEach(row=>row.hidden=!row.dataset.hfrSearch.includes(query)||(status&&status.value!=='all'&&row.dataset.hfrStatus!==status.value));
  const count=rows.filter(row=>!row.hidden).length;
  document.getElementById('hfr-result').textContent=count+' HFR '+(count===1?'record':'records');
  document.getElementById('hfr-empty').hidden=count>0;
 };
 search.addEventListener('input',filter);
 status?.addEventListener('change',filter);
})();
