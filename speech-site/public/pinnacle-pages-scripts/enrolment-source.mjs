// Shared public/private validation. No raw URL, referrer, form field or free text
// belongs in the protected acquisition envelope.
export const ACQUISITION_LIFETIME_MS=30*86400000;
export const HELPLINE_PATH='/national-autism-helpline';
export const HELPLINE_CONSENT_KEY='pinnacle-helpline-measurement-choice-v4';
export const CHATGPT_CAMPAIGNS=['pinnacle_vizag_call_enquiries','pinnacle_hyderabad_vijayawada_call_enquiries'];
export function validHelplineCampaign(fields){
 return !!fields&&typeof fields==='object'&&!Array.isArray(fields)&&Object.keys(fields).length===3&&fields.utm_source==='chatgpt'&&fields.utm_medium==='paid'&&CHATGPT_CAMPAIGNS.includes(fields.utm_campaign);
}
export const ACQUISITION_KEYS=['utm_id','utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_source_platform','utm_creative_format','utm_marketing_tactic','gclid','dclid','msclkid','fbclid','gbraid','wbraid'];
const CLICK_KEYS=new Set(['gclid','dclid','msclkid','fbclid','gbraid','wbraid']);
export function safeAcquisitionValue(value,key){
 if(typeof value!=='string'||!ACQUISITION_KEYS.includes(key))return null;
 value=value.trim();const click=CLICK_KEYS.has(key);
 if(!value||value.length>(click?256:128)||!(click?/^[A-Za-z0-9._~-]+$/:/^[A-Za-z0-9][A-Za-z0-9._~ -]*$/).test(value))return null;
 const words=value.replace(/[._~-]/g,' '),parts=value.match(/(?:^|[^A-Za-z0-9])\+?\d[\d ().-]*\d(?=$|[^A-Za-z0-9])/g)||[];
 if(/@|%[0-9a-f]{2}/i.test(value)||parts.some(p=>p.replace(/\D/g,'').length>=10)||(/^[\d ().+-]+$/.test(value)&&value.replace(/\D/g,'').length>=7)||/\b(?:private|secret|password|token)\b/i.test(words)||/\b(?:my|our)\b.*\b(?:child|son|daughter|patient)\b/i.test(words)||/\b(?:child|patient)\s+(?:name|id|details?|records?)\b/i.test(words)||/\b(?:email|phone|mobile|diagnosis|symptoms|report)\s+(?:address|number|name|id|details?|records?|result|value)\b/i.test(words))return null;
 return value;
}
export function normaliseAcquisition(value,now=Date.now()){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(k=>!['schemaVersion','consent','capturedAt','landingPath','fields'].includes(k))||value.schemaVersion!==1||value.consent!=='analytics_accepted')return null;
 if(!Number.isSafeInteger(value.capturedAt)||value.capturedAt>now+60000||now-value.capturedAt>ACQUISITION_LIFETIME_MS)return null;
 // Only coarse public acquisition surfaces, never a question, child or account URL.
 if(typeof value.landingPath!=='string'||value.landingPath.length>160||!/^\/(?:national-autism-helpline|centers|autism-therapy|speech-aba-autism-assessments|top-speech-therapy-center-india-proven-improvement-rate|best-occupational-therapy-center-india-proven-improvement-rate|best-aba-therapy-center-india-proven-improvement-rate|best-special-education-center-call-9100181181|enroll-autism-speech-aba-therapies-india|pinnacleai|abilityscore|seven-readiness-indexes|personal-development-kernel|prognose|therapeuticai|everyday-therapy|fusion-module|reassess-review-repeat|self-sufficient|mainstream|faq|sunshine|allmirracles)$/.test(value.landingPath))return null;
 if(value.landingPath===HELPLINE_PATH&&!validHelplineCampaign(value.fields))return null;
 if(!value.fields||typeof value.fields!=='object'||Array.isArray(value.fields))return null;
 const entries=Object.entries(value.fields);if(!entries.length||entries.length>ACQUISITION_KEYS.length)return null;
 const fields={};for(const [key,raw]of entries){const safe=safeAcquisitionValue(raw,key);if(safe===null||safe!==raw)return null;fields[key]=safe;}
 return {schemaVersion:1,consent:'analytics_accepted',capturedAt:value.capturedAt,landingPath:value.landingPath,fields};
}
export function validPublicEnrolmentSource(source){
 // Optional attribution must not reject a valid enquiry, including when a
 // parent's clock differs from the server. The private adapter drops it unless
 // normaliseAcquisition passes; required page identity remains exact.
 return !!source&&source.page==='/enroll-autism-speech-aba-therapies-india'&&Object.keys(source).every(k=>['page','acquisition'].includes(k));
}
