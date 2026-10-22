// Observed QA hints are not authenticated provenance or evidence of a genuine
// visitor. Keep only fixed hint names, never their values or the original URL.
export function normaliseValidationHints(value) {
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(key=>!['schemaVersion','provenance','hints'].includes(key))||value.schemaVersion!==1||value.provenance!=='client_observed'||!Array.isArray(value.hints)||value.hints.length<1||value.hints.length>2)return null;
 const allowed=['validation_test','qa_mode'];
 if(value.hints.some(key=>!allowed.includes(key))||new Set(value.hints).size!==value.hints.length)return null;
 return {schemaVersion:1,provenance:'client_observed',hints:allowed.filter(key=>value.hints.includes(key))};
}
export function readClientQaHints({search=globalThis.location?.search||'',storage,now=Date.now()}={}) {
 const key='pinnacle-observed-qa-v1',lifetime=86400000;
 try{if(storage===undefined)storage=globalThis.sessionStorage;}catch{}
 const hints=new Set();let capturedAt=now;
 try{
  const params=new URLSearchParams(search);
  for(const name of ['validation_test','qa_mode']){
   const values=params.getAll(name),value=values[0];
   if(values.length===1&&typeof value==='string'&&value.length>0&&value.length<=128&&/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value)&&!/^(?:0|false|off|no|none|null|undefined)$/i.test(value)&&(name==='validation_test'||/^(?:1|true|qa|test|validation|internal|fixture)$/i.test(value)))hints.add(name);
  }
 }catch{}
 try{
  const saved=JSON.parse(storage?.getItem(key)||'null');
  const prior=normaliseValidationHints(saved?.value);
  if(prior&&Number.isSafeInteger(saved.at)&&saved.at<=now&&now-saved.at<lifetime){capturedAt=Math.min(capturedAt,saved.at);for(const hint of prior.hints)hints.add(hint);}
  // Legacy suppression timestamps do not retain the original value and cannot establish provenance.
 }catch{}
 const value=normaliseValidationHints({schemaVersion:1,provenance:'client_observed',hints:[...hints]});
 if(value)try{storage?.setItem(key,JSON.stringify({at:capturedAt,value}));}catch{}
 return value;
}
