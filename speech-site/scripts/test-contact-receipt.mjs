import {facilityOperatingHold} from '../public/pinnacle-pages-scripts/centre-operating-holds.mjs';
import test from 'node:test';import assert from 'node:assert/strict';
import {makeContactPayload,validateContact,CONTACT_ATTEMPT_KEY} from '../public/pinnacle-pages-scripts/contact-api.mjs';
import {CONTACT_PATH,CONTACT_TITLES,CONTACT_TOPICS,CONTACT_FACILITIES} from '../public/pinnacle-pages-scripts/contact-options.mjs';
import {createAttemptStore} from '../public/pinnacle-pages-scripts/enrolment-api.mjs';
import {normaliseAcquisition} from '../public/pinnacle-pages-scripts/enrolment-source.mjs';
import {validatePublicContact,toLegacyContact,toReceiptContact} from '../deployment/contact-handler.mjs';
import {parseReceiptContact,contactPayloadDigest} from '../deployment/contact-receipt-contract.mjs';
import {serveEnrolmentApi} from '../deployment/enrolment-handler.mjs';
import {escapeContactMapRows,serveContactReceiptAsset,contactReceiptAssets} from '../deployment/contact-receipt.mjs';
import fs from 'node:fs/promises';
const values={name:'ISOLATED FIXTURE',title:'Mx',phone:'0000000000',email:'fixture@example.invalid',facilityId:CONTACT_FACILITIES[0],subject:'Therapy Services',message:'Offline fixture only.'};
const payload=()=>makeContactPayload(values,'qa-contact-request');
const request=body=>new Request('https://www.pinnacleblooms.org/api/enrolment',{method:'POST',headers:{origin:'https://www.pinnacleblooms.org','content-type':'application/json','idempotency-key':body.requestId},body:JSON.stringify(body)});
test('outer contact asset precedence serves the complete maintained dependency closure before old embedded assets',async()=>{
 const base='https://www.pinnacleblooms.org';assert.equal(contactReceiptAssets.size,6);
 const env={ASSETS:{fetch:async r=>new Response(await fs.readFile(new URL('../public'+new URL(r.url).pathname,import.meta.url)))}};
 for(const name of ['contact-receipt.js','contact-api.mjs','contact-options.mjs','enrolment-api.mjs','enrolment-source.mjs','speech-measurement.js']){
  const p='/pinnacle-pages-scripts/'+name,r=await serveContactReceiptAsset(new Request(base+p+'?v=contact-receipt-20261015'),env);assert.equal(r.status,200,name);assert.equal(await r.text(),await fs.readFile(new URL('../public'+p,import.meta.url),'utf8'),name);
  assert.equal((await serveContactReceiptAsset(new Request(base+p,{method:'POST'}),env)).status,405);
  assert.equal(await (await serveContactReceiptAsset(new Request(base+p,{method:'HEAD'}),env)).text(),'');
 }
 const source=await (await serveContactReceiptAsset(new Request(base+'/pinnacle-pages-scripts/enrolment-source.mjs?v=navratri-20261011'),env)).text();assert(source.includes("HELPLINE_CONSENT_KEY='pinnacle-helpline-measurement-choice-v4'"));assert(source.includes('pinnacle_vizag_call_enquiries'));
 assert((await fs.readFile(new URL('../public/pinnacle-pages-scripts/contact-api.mjs',import.meta.url),'utf8')).includes("./enrolment-source.mjs?v=contact-receipt-20261015"),'Returning contact browsers must not reuse the prior immutable dependency URL');
});
test('contact map retains addresses and coordinates while escaping literal line breaks in row labels',()=>{
 const source='myArray.push(["Branch\\\" name\r\nRoad\nCity",17.42,78.45]);\nconst other="unchanged";';
 const repaired=escapeContactMapRows(source);
 assert.equal(repaired,'myArray.push(["Branch\\\" name\\nRoad\\nCity",17.42,78.45]);\nconst other="unchanged";');
 assert.equal(escapeContactMapRows(repaired),repaired);
 assert.equal(escapeContactMapRows('myArray.push(["Already escaped\\naddress",-17.42,78.45]);'),'myArray.push(["Already escaped\\naddress",-17.42,78.45]);');
 new Function('myArray',repaired)([]);
});
test('published contact options and exact legacy/private shapes agree across every topic, title and facility',()=>{
 assert.equal(CONTACT_FACILITIES.length,62);assert.equal(CONTACT_TITLES.length,8);assert.equal(CONTACT_TOPICS.length,9);
 for(const field of ['subject','title','facilityId'])for(const value of {subject:CONTACT_TOPICS,title:CONTACT_TITLES,facilityId:CONTACT_FACILITIES}[field]){
  const v={...values,[field]:value},p=makeContactPayload(v,'qa-contact-request');if(facilityOperatingHold(v.facilityId)){assert(validateContact(v).facilityId);assert.equal(validatePublicContact(p),false);assert.throws(()=>toLegacyContact(p),/temporarily closed/);continue;}assert.deepEqual(validateContact(v),{});assert(validatePublicContact(p));const legacy=toLegacyContact(p),privateBody=toReceiptContact(legacy,p.requestId,p.source),parsed=parseReceiptContact(privateBody,p.requestId,normaliseAcquisition,CONTACT_FACILITIES);assert(parsed);assert.deepEqual(parsed.lead,legacy);assert.equal(legacy.Name,v.title+'. '+v.name);assert.equal(legacy.FormType,'contact submit');assert(!('Services'in legacy));assert(!('Languages'in legacy));assert.equal(parsed.source.topic,v.subject);
 }
});
test('validation retains required fields, exact allowlists and bounded lengths; public private-envelope injection is rejected',()=>{
 for(const [key,value]of [['name',''],['name','x'.repeat(101)],['email',''],['email','invalid'],['phone','123456789'],['phone','+910000000000'],['title','invented'],['subject','invented'],['facilityId','invented'],['message',''],['message','x'.repeat(1001)]])assert(!validatePublicContact(makeContactPayload({...values,[key]:value},'qa-contact-request')),key);
 for(const patch of [{WebsiteReceipt:{}},{Services:[]},{formType:'other'},{source:{page:CONTACT_PATH,contract:'website_contact_v1'}},{source:{page:'/careers'}}])assert(!validatePublicContact({...payload(),...patch}));
 assert(validatePublicContact(makeContactPayload({...values,name:'x'.repeat(100),message:'x'.repeat(1000)},'qa-contact-request')));
});
test('invalid optional acquisition is dropped, original approved source is retained, Subject changes the private digest',async()=>{
 const acquisition={schemaVersion:1,consent:'analytics_accepted',capturedAt:Date.now(),landingPath:'/centers',fields:{utm_source:'google',utm_medium:'cpc',utm_campaign:'fixture'}};
 const p=makeContactPayload(values,'qa-contact-request',acquisition),l=toLegacyContact(p),b=toReceiptContact(l,p.requestId,p.source);assert.deepEqual(b.WebsiteReceipt.source.acquisition,acquisition);
 assert.equal(makeContactPayload(values,'qa-contact-request',{bad:true}).source.acquisition,undefined);
 assert.equal(toReceiptContact(l,p.requestId,{page:CONTACT_PATH,acquisition:{bad:true}}).WebsiteReceipt.source.acquisition,undefined);
 assert.notEqual(await contactPayloadDigest(l),await contactPayloadDigest({...l,Subject:'Assessments'}));
});
test('existing API uses one private receiver, strips its protected join key, and never falls back to legacy contact AJAX',async()=>{
 let calls=0,sent;const p=payload(),env={ENROLMENT_RECEIPT_VERSION:'1',PINNACLE_ENROLMENT_RECEIPTS:{receive:async(body,key)=>{calls++;sent=body;return {httpStatus:202,status:'accepted',receipt:{schemaVersion:1,requestId:key,id:'qa-contact-receipt',leadReference:'private-fixture-intake'}};}}};
 const r=await serveEnrolmentApi(request(p),env,{fetchImpl:()=>{throw Error('Legacy fallback forbidden');}});assert.equal(r.status,202);const b=await r.json();assert.equal(calls,1);assert.equal(sent.WebsiteReceipt.source.contract,'website_contact_v1');assert(!JSON.stringify(b).includes('private-fixture'));assert.equal(b.receipt.requestId,p.requestId);
 const disabled=await serveEnrolmentApi(request(p),{}, {fetchImpl:()=>{throw Error('Legacy fallback forbidden');}});assert.equal(disabled.status,503);
 for(const result of [{httpStatus:409,status:'rejected'},{httpStatus:503,status:'unknown'},true,{httpStatus:202,status:'accepted',receipt:{schemaVersion:1,requestId:'different-key',id:'qa-contact-receipt',leadReference:'private'}}]){const x=await serveEnrolmentApi(request(p),{...env,PINNACLE_ENROLMENT_RECEIPTS:{receive:async()=>result}});assert.notEqual((await x.json()).status,'accepted');}
 const timeout=await serveEnrolmentApi(request(p),{...env,PINNACLE_ENROLMENT_RECEIPTS:{receive:()=>new Promise(()=>{})}},{timeoutMs:5});assert.equal((await timeout.json()).status,'unknown');
});
test('contact request metadata is separate from enrolment and stores no contact values',()=>{
 const map=new Map(),storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 const enrol=createAttemptStore(storage),contact=createAttemptStore(storage,CONTACT_ATTEMPT_KEY);enrol.write({schemaVersion:1,requestId:'qa-enrol-request',state:'pending',createdAt:Date.now()});contact.write({schemaVersion:1,requestId:'qa-contact-request',state:'pending',createdAt:Date.now(),...values});assert.equal(enrol.read().requestId,'qa-enrol-request');assert.equal(contact.read().requestId,'qa-contact-request');contact.clear();assert(enrol.read());assert(!JSON.stringify([...map]).includes(values.email));
});
