import {normaliseValidationHints,readClientQaHints} from './enquiry-validation.mjs?v=qa-provenance-20261022';
import {normaliseAcquisition} from './enrolment-source.mjs?v=contact-source-20261020';
import {facilityOperatingHold} from './centre-operating-holds.mjs?v=centre-operating-holds-20261017';
import {CONTACT_PATH,CONTACT_TITLES,CONTACT_TOPICS,CONTACT_FACILITIES} from './contact-options.mjs?v=contact-source-20261020';
export const CONTACT_ATTEMPT_KEY='pbn-contact-request-v1';
export function validateContact(values){
 const errors={};
 if(typeof values.name!=='string'||!values.name.trim()||values.name.trim().length>100)errors.name='Enter your name (up to 100 characters).';
 if(!CONTACT_TITLES.includes(values.title))errors.title='Choose a listed title.';
 if(typeof values.phone!=='string'||!/^\d{10}$/.test(values.phone.trim()))errors.phone='Enter your ten-digit mobile number.';
 if(typeof values.email!=='string'||values.email.trim().length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))errors.email='Enter a valid email address.';
 if(!CONTACT_FACILITIES.includes(values.facilityId))errors.facilityId='Choose a listed location.';
 if(facilityOperatingHold(values.facilityId))errors.facilityId='This centre is temporarily closed. Choose an available location or call 9100 181 181 for help.';
 if(!CONTACT_TOPICS.includes(values.subject))errors.subject='Choose what your message is about.';
 if(typeof values.message!=='string'||!values.message.trim()||values.message.trim().length>1000)errors.message='Enter your message (up to 1,000 characters).';
 return errors;
}
export function makeContactPayload(values,requestId,acquisition,validation=readClientQaHints()){
 const permitted=normaliseAcquisition(acquisition),qa=normaliseValidationHints(validation);
 return {schemaVersion:1,formType:'contact',requestId,contact:{name:values.name.trim(),title:values.title,phone:values.phone.trim(),email:values.email.trim()},preferences:{facilityId:values.facilityId,subject:values.subject},message:values.message.trim(),source:{page:CONTACT_PATH,...(permitted?{acquisition:permitted}:{}),...(qa?{validation:qa}:{})}};
}
