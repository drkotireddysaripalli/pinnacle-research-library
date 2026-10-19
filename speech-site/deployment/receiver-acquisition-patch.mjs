// The private receipt Worker contains later contact-receipt and reporting work
// that is not reproducible from the older local receiver helper. Patch only the
// shared acquisition route sequence in the captured production modules.
export const CONTACT_ACQUISITION_PATH='/contact-national-autism-helpline-24-7';
const OLD_SEQUENCE='national-autism-helpline|centers|autism-therapy';
const NEW_SEQUENCE='national-autism-helpline|contact-national-autism-helpline-24-7|centers|autism-therapy';

const occurrences=(source,value)=>source.split(value).length-1;

export function patchReceiverContactAcquisition(source){
 if(typeof source!=='string'||!source.includes('function normaliseAcquisition'))throw new Error('Receiver acquisition validator missing');
 const oldCount=occurrences(source,OLD_SEQUENCE),newCount=occurrences(source,NEW_SEQUENCE);
 if(oldCount===1&&newCount===0){
  const patched=source.replace(OLD_SEQUENCE,NEW_SEQUENCE);
  if(occurrences(patched,OLD_SEQUENCE)!==0||occurrences(patched,NEW_SEQUENCE)!==1)throw new Error('Receiver acquisition patch was not exact');
  return patched;
 }
 if(oldCount===0&&newCount===1)return source;
 throw new Error(`Receiver acquisition validator changed: old=${oldCount} new=${newCount}`);
}

export function assertReceiverContactAcquisitionPatch(before,after){
 if(patchReceiverContactAcquisition(before)!==after)throw new Error('Receiver candidate contains changes outside the contact acquisition route');
 return true;
}
