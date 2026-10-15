import {normaliseAcquisition} from './enrolment-source.mjs?v=contact-receipt-20261015';
import {CONTACT_PATH,CONTACT_TITLES,CONTACT_TOPICS,CONTACT_FACILITIES} from './contact-options.mjs?v=contact-receipt-20261015';
export const CONTACT_ATTEMPT_KEY='pbn-contact-request-v1';
export function validateContact(values){
 const errors={};
 if(typeof values.name!=='string'||!values.name.trim()||values.name.trim().length>100)errors.name='Enter your name (up to 100 characters).';
 if(!CONTACT_TITLES.includes(values.title))errors.title='Choose a listed title.';
 if(typeof values.phone!=='string'||!/^\d{10}$/.test(values.phone.trim()))errors.phone='Enter your ten-digit mobile number.';
 if(typeof values.email!=='string'||values.email.trim().length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))errors.email='Enter a valid email address.';
 if(!CONTACT_FACILITIES.includes(values.facilityId))errors.facilityId='Choose a listed location.';
 if(!CONTACT_TOPICS.includes(values.subject))errors.subject='Choose what your message is about.';
 if(typeof values.message!=='string'||!values.message.trim()||values.message.trim().length>1000)errors.message='Enter your message (up to 1,000 characters).';
 return errors;
}
export function makeContactPayload(values,requestId,acquisition){
 const permitted=normaliseAcquisition(acquisition);
 return {schemaVersion:1,formType:'contact',requestId,contact:{name:values.name.trim(),title:values.title,phone:values.phone.trim(),email:values.email.trim()},preferences:{facilityId:values.facilityId,subject:values.subject},message:values.message.trim(),source:{page:CONTACT_PATH,...(permitted?{acquisition:permitted}:{})}};
}
