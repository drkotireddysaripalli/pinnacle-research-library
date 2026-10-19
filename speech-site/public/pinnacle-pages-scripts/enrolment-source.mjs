// Shared public/private validation. No raw URL, referrer, form field or free text
// belongs in the protected acquisition envelope.
export const ACQUISITION_LIFETIME_MS=30*86400000;
export const HELPLINE_PATH='/national-autism-helpline';
export const CHATGPT_CAMPAIGNS=['pinnacle_vizag_call_enquiries','pinnacle_hyderabad_vijayawada_call_enquiries'];
export function validHelplineCampaign(fields){
 return !!fields&&typeof fields==='object'&&!Array.isArray(fields)&&Object.keys(fields).length===3&&fields.utm_source==='chatgpt'&&fields.utm_medium==='paid'&&CHATGPT_CAMPAIGNS.includes(fields.utm_campaign);
}
export const ACQUISITION_KEYS=['utm_id','utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_source_platform','utm_creative_format','utm_marketing_tactic','gclid','dclid','msclkid','fbclid','gbraid','wbraid'];
const CLICK_KEYS=new Set(['gclid','dclid','msclkid','fbclid','gbraid','wbraid']);
// Verified account2990211780campaign IDs,18Oct2026. Only utm_id may use this numeric exception.
export const KNOWN_GOOGLE_ADS_CAMPAIGN_IDS=Object.freeze(["15340172547","15342772051","15345343142","15354492632","15410631276","15413188987","15416361515","15420705510","15422686714","15432947413","15454505906","16267659093","17430732638","17437197720","17714915698","18396274735","18590437867","20544678845","20544772051","20545400635","20548667278","20548688812","20588599080","20637879982","20726403779","20737568791","21097964139","21104736236","21106795656","21108028792","21108070054","21781203250","21814666781","21818529070","21822581429","21834560771","21834624209","21841955750","21842000123","21845614507","21845755342","21860786291","21873580048","21876816365","22297271692","22834256612","22838210062","23717098995","23722206176","23722246949","23722546298","23726650789","23726936563","23729053395","23729053632","23732018301","23732073522","23732073549","23732073552","23732073744","23732096874","23732098053","23732098203","23732111226","23732126781","23732188203","23732219493","23732280408","23732280432","23732280606","23732280645","23732335416","23732372055","23732372862","23732373063","23732466957","23732475522","23733005883","23733006126","23733029721","23733043878","23733044052","23734264760","23737227821","23737228001","23737239545","23737250090","23737250108","23737250849","23737280393","23737302131","23737312049","23737326926","23737327157","23737341104","23737341119","23737378787","23737386947","23737421507","23737421939","23737421987","23737421990","23737539791","23738212283","23738212460","23738212697","23738913244","23738913274","23741866921","23741867182","23741881591","23741940367","23741951650","23741951653","23741951887","23741967052","23741967058","23741979580","23741980078","23741980201","23742023941","23742023965","23742116110","23742170623","23742171022","23742171088","23742210124","23742210181","23742304498","23742304522","23742304534","23742817573","23742817582","23742818389","23742841894","23742854764","23742855046","23742855550","24295750691","24318442248","24318505173","24318506094","24323765198","24332444156","24334732992","24335035560","24335145489","24339607862","24340273595","24340279580","24346349935","24346359358","24346769519","24346889656","24352675399"]);
const knownGoogleAdsCampaignIds=new Set(KNOWN_GOOGLE_ADS_CAMPAIGN_IDS);
export function safeAcquisitionValue(value,key){
 if(typeof value!=='string'||!ACQUISITION_KEYS.includes(key))return null;
 value=value.trim();const click=CLICK_KEYS.has(key);
 if(!value||value.length>(click?256:128)||!(click?/^[A-Za-z0-9._~-]+$/:/^[A-Za-z0-9][A-Za-z0-9._~ -]*$/).test(value))return null;
 if(key==='utm_id'&&knownGoogleAdsCampaignIds.has(value))return value;
 const words=value.replace(/[._~-]/g,' '),parts=value.match(/(?:^|[^A-Za-z0-9])\+?\d[\d ().-]*\d(?=$|[^A-Za-z0-9])/g)||[];
 if(/@|%[0-9a-f]{2}/i.test(value)||parts.some(p=>p.replace(/\D/g,'').length>=10)||(/^[\d ().+-]+$/.test(value)&&value.replace(/\D/g,'').length>=7)||/\b(?:private|secret|password|token)\b/i.test(words)||/\b(?:my|our)\b.*\b(?:child|son|daughter|patient)\b/i.test(words)||/\b(?:child|patient)\s+(?:name|id|details?|records?)\b/i.test(words)||/\b(?:email|phone|mobile|diagnosis|symptoms|report)\s+(?:address|number|name|id|details?|records?|result|value)\b/i.test(words))return null;
 return value;
}
export function normaliseAcquisition(value,now=Date.now()){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(k=>!['schemaVersion','consent','capturedAt','landingPath','fields'].includes(k))||value.schemaVersion!==1||value.consent!=='analytics_accepted')return null;
 if(!Number.isSafeInteger(value.capturedAt)||value.capturedAt>now+60000||now-value.capturedAt>ACQUISITION_LIFETIME_MS)return null;
 // Only coarse public acquisition surfaces, never a question, child or account URL.
 if(typeof value.landingPath!=='string'||value.landingPath.length>160||!/^\/(?:national-autism-helpline|contact-national-autism-helpline-24-7|centers|autism-therapy|speech-aba-autism-assessments|top-speech-therapy-center-india-proven-improvement-rate|best-occupational-therapy-center-india-proven-improvement-rate|best-aba-therapy-center-india-proven-improvement-rate|best-special-education-center-call-9100181181|enroll-autism-speech-aba-therapies-india|certified-courses|pinnacleai|abilityscore|seven-readiness-indexes|personal-development-kernel|prognose|therapeuticai|everyday-therapy|fusion-module|reassess-review-repeat|self-sufficient|mainstream|faq|sunshine|allmirracles)?$/.test(value.landingPath))return null;
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
