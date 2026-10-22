import {normaliseValidationHints} from '../public/pinnacle-pages-scripts/enquiry-validation.mjs';
// Private contact receipt contract. This adds no public receiver or database.
export const CONTACT_SOURCE_PAGE='/contact-national-autism-helpline-24-7';
export const CONTACT_CONTRACT='website_contact_v1';
export const CONTACT_TOPICS=Object.freeze(['complaint_or_compliment','Therapy Services','Assessments','foundation','employment','clinical education','research education','feedback','other']);
export const CONTACT_TITLES=Object.freeze(['Mrs','Ms','Mr','Prof','Assoc Prof','Dr','Rev','Mx']);
export const CONTACT_FIELDS=Object.freeze(['FormType','Name','MobileNumber','Message','EmailId','FacilityIds','Title','Subject']);
const KEY=/^[A-Za-z0-9-]{8,100}$/;
export function parseReceiptContact(body,idempotencyKey,normaliseAcquisition,facilityIds){
 const contract=body?.WebsiteReceipt,source=contract?.source;
 if(body?.FormType!=='contact submit'||contract?.schemaVersion!==1||typeof contract.requestId!=='string'||!KEY.test(contract.requestId)||idempotencyKey!==contract.requestId)return null;
 if(!source||source.page!==CONTACT_SOURCE_PAGE||source.contract!==CONTACT_CONTRACT||source.topic!==body.Subject||Object.keys(source).some(k=>!['page','contract','topic','acquisition','validation'].includes(k)))return null;
 if(Object.hasOwn(source,'acquisition')&&!normaliseAcquisition(source.acquisition))return null;
 if(Object.keys(body).some(k=>![...CONTACT_FIELDS,'WebsiteReceipt'].includes(k)))return null;
 const lead={};for(const field of CONTACT_FIELDS){if(!Object.hasOwn(body,field))return null;lead[field]=body[field];}
 if(['Name','MobileNumber','Message','EmailId','Title','Subject'].some(k=>typeof lead[k]!=='string'))return null;
 if(!CONTACT_TITLES.includes(lead.Title)||!CONTACT_TOPICS.includes(lead.Subject)||!/^\d{10}$/.test(lead.MobileNumber)||lead.EmailId.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.EmailId))return null;
 const prefix=lead.Title+'. ';
 if(!lead.Name.startsWith(prefix)||!lead.Name.slice(prefix.length).trim()||lead.Name.slice(prefix.length).length>100||!lead.Message.trim()||lead.Message.length>1000)return null;
 if(!Array.isArray(lead.FacilityIds)||lead.FacilityIds.length!==1||typeof lead.FacilityIds[0]!=='string'||!facilityIds.includes(lead.FacilityIds[0]))return null;
 const acquisition=normaliseAcquisition(source.acquisition),validation=normaliseValidationHints(source.validation);
 return {requestId:contract.requestId,lead,source:{page:CONTACT_SOURCE_PAGE,contract:CONTACT_CONTRACT,topic:lead.Subject,...(acquisition?{acquisition}:{}),...(validation?{validation}:{})}};
}
export async function contactPayloadDigest(lead){
 const canonical=JSON.stringify(CONTACT_FIELDS.map(field=>[field,lead[field]]));
 return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical)))].map(x=>x.toString(16).padStart(2,'0')).join('');
}
export function classifyReceiptSource(source){
 if(source?.contract==='website_enrolment_v1'&&source.page==='/enroll-autism-speech-aba-therapies-india')return {sourceContract:'website_enrolment_v1',contactTopic:null,kind:'enquiry'};
 if(source?.contract===CONTACT_CONTRACT&&source.page===CONTACT_SOURCE_PAGE&&CONTACT_TOPICS.includes(source.topic))return {sourceContract:CONTACT_CONTRACT,contactTopic:source.topic,kind:['Therapy Services','Assessments'].includes(source.topic)?'enquiry':'other_contact'};
 return {sourceContract:'unknown',contactTopic:null,kind:'unknown'};
}
