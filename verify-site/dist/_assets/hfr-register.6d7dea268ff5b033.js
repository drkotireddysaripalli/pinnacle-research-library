'use strict';
(() => {
 const search=document.getElementById('hfr-search');
 if(!search)return;
 const rows=[...document.querySelectorAll('[data-hfr-search]')];
 search.addEventListener('input',()=>{
  const query=search.value.trim().toLocaleLowerCase();
  rows.forEach(row=>row.hidden=!row.dataset.hfrSearch.includes(query));
  const count=rows.filter(row=>!row.hidden).length;
  document.getElementById('hfr-result').textContent=count+' HFR '+(count===1?'record':'records');
  document.getElementById('hfr-empty').hidden=count>0;
 });
})();
