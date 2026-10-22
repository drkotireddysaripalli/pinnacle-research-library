import {normaliseValidationHints} from '../public/pinnacle-pages-scripts/enquiry-validation.mjs';
import {validateContact} from '../public/pinnacle-pages-scripts/contact-api.mjs';
import {CONTACT_PATH,CONTACT_CONTRACT} from '../public/pinnacle-pages-scripts/contact-options.mjs';
import {normaliseAcquisition} from '../public/pinnacle-pages-scripts/enrolment-source.mjs';
import {heldEnquiryAssignment} from '../public/pinnacle-pages-scripts/centre-operating-holds.mjs';
const keys=(o,allowed)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).every(k=>allowed.includes(k));
export function validatePublicContact(body){
 if(heldEnquiryAssignment(body))return false;
 if(!keys(body,['schemaVersion','formType','requestId','contact','preferences','message','source'])||body.schemaVersion!==1||body.formType!=='contact'||typeof body.requestId!=='string'||!/^[A-Za-z0-9-]{8,100}$/.test(body.requestId))return false;
 if(!keys(body.contact,['name','title','phone','email'])||!keys(body.preferences,['facilityId','subject'])||!keys(body.source,['page','acquisition','validation'])||body.source.page!==CONTACT_PATH)return false;
 return Object.keys(validateContact({...body.contact,...body.preferences,message:body.message})).length===0;
}
export function toLegacyContact(body){
 if(heldEnquiryAssignment(body))throw new TypeError('Centre temporarily closed');
 return {FormType:'contact submit',Name:body.contact.title+'. '+body.contact.name.trim(),Title:body.contact.title,EmailId:body.contact.email.trim(),Subject:body.preferences.subject,Message:body.message.trim(),MobileNumber:body.contact.phone.trim(),FacilityIds:[body.preferences.facilityId]};
}
export function toReceiptContact(legacy,requestId,source){
 const acquisition=normaliseAcquisition(source?.acquisition),validation=normaliseValidationHints(source?.validation);
 return {...legacy,WebsiteReceipt:{schemaVersion:1,requestId,source:{page:CONTACT_PATH,contract:CONTACT_CONTRACT,topic:legacy.Subject,...(acquisition?{acquisition}:{}),...(validation?{validation}:{})}}};
}
