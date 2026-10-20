// The private receipt Worker contains later contact-receipt and reporting work
// that is not reproducible from the older local receiver helper. Patch only the
// exact acquisition route and numeric campaign-field predicates in captured modules.
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
  source=patched;
 }
 else if(!(oldCount===0&&newCount===1))throw new Error(`Receiver acquisition validator changed: old=${oldCount} new=${newCount}`);
 const original=/knownGoogleAdsCampaignIds\.has\((value2?)\)/g;
 const matches=[...source.matchAll(original)];
 if(matches.length===1)source=source.replace(original,(_,value)=>'/^[1-9][0-9]{0,19}$/.test('+value+')');
 else if(!(matches.length===0&&/\/\^\[1-9\]\[0-9\]\{0,19\}\$\/\.test\(value2?\)/.test(source)))throw new Error('Receiver typed campaign validator changed');
 const special=/  if \(value2?\.landingPath === HELPLINE_PATH && !validHelplineCampaign\(value2?\.fields\)\) return null;\n/g;
 const count=[...source.matchAll(special)].length;
 if(count>1)throw new Error('Receiver helpline source guard changed');
 return source.replace(special,'');
}

export function assertReceiverContactAcquisitionPatch(before,after){
 if(patchReceiverContactAcquisition(before)!==after)throw new Error('Receiver candidate contains changes outside the exact acquisition route and typed campaign validator');
 return true;
}
