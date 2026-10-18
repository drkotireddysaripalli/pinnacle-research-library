// Reuse the already published first-party protection SDK. No identity payloads.
export const PROTECTION_SDK='https://protect.pinnacleblooms.org/s/accRP7xVcZTM4/astrhtuTudL4x';
const signals=new Set(['pinnacle_contact_intent','pinnacle_enquiry_accepted']);
export function installProtectionConsumer(win,doc){
 if(win.__pinnacleProtectionConsumer)return win.__pinnacleProtectionConsumer;
 const allowed=()=>{try{return typeof win.pinnacleProtectionAllowed==='function'&&win.pinnacleProtectionAllowed()===true;}catch{return false;}};
 if(!allowed())return null;
 let queued=false,cancelled=false,sdk;
 const status=win.__pinnacleClickguardConversion||(win.__pinnacleClickguardConversion={status:'pending'});
 const clean=()=>{doc.removeEventListener?.('load',onLoad,true);doc.removeEventListener?.('pinnacle_protection_cancel',cancel);win.removeEventListener?.('pagehide',cancel);};
 const cancel=()=>{cancelled=true;if(status.status!=='invoked')status.status='cancelled';sdk?.remove?.();win.__pinnacleProtectionPending?.clear?.();clean();};
 const dispatch=()=>{
  if(cancelled||['invoked','failed','cancelled'].includes(status.status)||!queued)return;
  if(!allowed()){cancel();return;}
  if(typeof win.CG?.conversion!=='function'){status.status='waiting_for_library';return;}
  // Share the exact global invocation sentinel with the retained GTM callback.
  status.status='invoked';queued=false;clean();
  try{win.CG.conversion();}catch{status.invocationThrew=true;} // Never retry an uncertain vendor invocation.
 };
 const onLoad=event=>{if(String(event?.target?.tagName).toUpperCase()==='SCRIPT')dispatch();};
 const signal=name=>{if(!signals.has(name)||cancelled)return false;if(!allowed()){cancel();return false;}queued=true;dispatch();return true;};
 const consumer=win.__pinnacleProtectionConsumer={signal,cancel};
 doc.addEventListener('pinnacle_protection_cancel',cancel,{once:true});win.addEventListener?.('pagehide',cancel,{once:true});doc.addEventListener('load',onLoad,true);
 // An existing GTM loader/SDK wins; do not install a second copy.
 const existing=[...doc.querySelectorAll('script[src]')].some(s=>{try{return new URL(s.src,win.location.href).href===PROTECTION_SDK;}catch{return false;}});
 if(!existing&&!win.CG){
  if(!allowed()){cancel();return consumer;}
  sdk=doc.createElement('script');sdk.async=true;sdk.referrerPolicy='origin';sdk.src=PROTECTION_SDK;
  const nonce=doc.getElementById?.('pinnacle-protection-container')?.nonce;if(nonce)sdk.nonce=nonce;
  sdk.addEventListener?.('load',()=>{if(!allowed())cancel();else dispatch();},{once:true});
  doc.head.append(sdk);
 }
 for(const name of win.__pinnacleProtectionPending||[])signal(name);
 win.__pinnacleProtectionPending?.clear?.();
 return consumer;
}
if(typeof window!=='undefined'&&typeof document!=='undefined')installProtectionConsumer(window,document);
