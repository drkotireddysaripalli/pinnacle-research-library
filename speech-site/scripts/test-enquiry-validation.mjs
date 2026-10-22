import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {normaliseValidationHints,readClientQaHints} from '../public/pinnacle-pages-scripts/enquiry-validation.mjs';
import {normaliseAcquisition,validPublicEnrolmentSource} from '../public/pinnacle-pages-scripts/enrolment-source.mjs';
import {makePayload} from '../public/pinnacle-pages-scripts/enrolment-api.mjs';
import {makeContactPayload} from '../public/pinnacle-pages-scripts/contact-api.mjs';
import {CONTACT_FACILITIES} from '../public/pinnacle-pages-scripts/contact-options.mjs';
import {toLegacyContact,toReceiptContact,validatePublicContact} from '../deployment/contact-handler.mjs';
import {parseReceiptContact} from '../deployment/contact-receipt-contract.mjs';
import {toReceiptEnrolment,receiveReceiptEnrolment,parseReceiptEnrolment} from '../deployment/enrolment-receipt.mjs';
import {readEnquiryAnalytics,ENQUIRY_ANALYTICS_SQL,ENQUIRY_ANALYTICS_COUNTS_SQL} from '../deployment/enrolment-analytics.mjs';
import {fixtureLedger} from '../tests/fixtures/enrolment-ledger-sqlite.mjs';
const now=1800000000000;
const qa={schemaVersion:1,provenance:'client_observed',hints:['validation_test','qa_mode']};
const values={name:'OFFLINE FIXTURE',phone:'0000000000',email:'',service:'speech',centre:'',message:'Offline only'};
const memory=()=>{const values=new Map();return {getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};};
const acquisition={schemaVersion:1,consent:'analytics_accepted',capturedAt:Date.now(),landingPath:'/national-autism-helpline',fields:{utm_source:'chatgpt',utm_medium:'paid',utm_campaign:'pinnacle_vizag_call_enquiries'}};
const legacy=()=>({FormType:'Enroll',Name:values.name,MobileNumber:values.phone,Message:values.message,EmailId:'',Services:['Speech Therapy'],FacilityIds:[''],Title:'Mx',Languages:['English']});
test('only fixed client-observed hint names survive normalization',()=>{
 assert.deepEqual(normaliseValidationHints(qa),qa);
 for(const value of [null,{}, {...qa,provenance:'trusted'}, {...qa,hints:['customer']},{...qa,hints:['qa_mode','qa_mode']},{...qa,rawUrl:'https://private.invalid'},{...qa,hints:[]}])assert.equal(normaliseValidationHints(value),null);
});
test('explicit URL markers yield names only, never original values',()=>{
 const result=readClientQaHints({search:'?validation_test=qa_sample_run&qa_mode=1',storage:memory(),now});
 assert.deepEqual(result,qa);assert(!JSON.stringify(result).includes('qa_sample_run'));
});
test('absent, false, duplicated, malformed, oversized and unrecognized hints remain unknown',()=>{
 for(const search of ['', '?validation_test=false','?qa_mode=false','?qa_mode=something','?qa_mode=1&qa_mode=1','?validation_test=a&validation_test=b','?validation_test=child%40example.invalid','?validation_test='+('x'.repeat(129))])assert.equal(readClientQaHints({search,storage:memory(),now}),null,search);
});
test('bounded tab hints survive source-to-form navigation and expire',()=>{
 const storage=memory();readClientQaHints({search:'?validation_test=offline&qa_mode=true',storage,now});
 assert.deepEqual(readClientQaHints({search:'',storage,now:now+100}),qa);
 assert.equal(readClientQaHints({search:'',storage,now:now+86400001}),null);
});
test('legacy suppression flags remain unknown without bounded observed evidence',()=>{
 const storage=memory();storage.setItem('pinnacle-validation-v1',String(now));
 assert.equal(readClientQaHints({storage,now}),null);
 assert.equal(readClientQaHints({storage:memory(),now}),null);
});
test('actual collector suppression cannot turn invalid URL hints into form provenance',()=>{
 for(const file of ['public/pinnacle-pages-scripts/speech-measurement.js','../helpline-site/phone-analytics.js']){
  const text=fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
  const start=text.indexOf('/* PINNACLE_QA_PROVENANCE_START */');
  const end=text.indexOf(file.startsWith('../')?'  if (!production':'  const callPlacements',start);
  assert(start>=0&&end>start);
  for(const search of ['?validation_test=false','?validation_test=a&validation_test=b','?validation_test=bad%40value','?validation_test=offline']){
   const storage=memory();vm.runInNewContext(text.slice(start,end),{URL,URLSearchParams,Date,Set,sessionStorage:storage,location:{href:'https://www.pinnacleblooms.org/'+search,search}});
   assert(storage.getItem('pinnacle-validation-v1'),'Existing suppression is unchanged');
   const result=readClientQaHints({search:'',storage});
   if(search==='?validation_test=offline')assert.deepEqual(result?.hints,['validation_test']);else assert.equal(result,null);
  }
 }
});
test('storage failure does not prevent bounded current-page observation',()=>{
 const storage={getItem(){throw Error('disabled');},setItem(){throw Error('disabled');}};
 assert.deepEqual(readClientQaHints({search:'?qa_mode=test',storage,now}).hints,['qa_mode']);
 assert.equal(readClientQaHints({search:'',storage,now}),null);
});
test('enrolment keeps source and QA hint separate from family fields and event payload',()=>{
 const p=makePayload(values,'offline-enrolment-qa',acquisition,qa);
 assert(validPublicEnrolmentSource(p.source));assert.deepEqual(p.source.validation,qa);assert.deepEqual(p.source.acquisition,acquisition);
 assert(!JSON.stringify(p.source).includes(values.name));
 const body=toReceiptEnrolment(legacy(),p.requestId,p.source),parsed=parseReceiptEnrolment(body,p.requestId);
 assert.deepEqual(parsed.source.validation,qa);assert.deepEqual(parsed.source.acquisition,acquisition);
 const plain=makePayload(values,'offline-enrolment-plain',acquisition,null);assert(!Object.hasOwn(plain.source,'validation'));
 assert.deepEqual(makePayload(values,'offline-enrolment-bad',acquisition,{...qa,hints:['untrusted_value']}).source,plain.source);
});
test('contact uses the same bounded metadata and existing private contract',()=>{
 const p=makeContactPayload({...values,title:'Mx',email:'fixture@example.invalid',facilityId:CONTACT_FACILITIES[0],subject:'Therapy Services'},'offline-contact-qa',acquisition,qa);
 assert(validatePublicContact(p));const b=toReceiptContact(toLegacyContact(p),p.requestId,p.source);
 const parsed=parseReceiptContact(b,p.requestId,normaliseAcquisition,CONTACT_FACILITIES);
 assert.deepEqual(parsed.source.validation,qa);assert.deepEqual(parsed.source.acquisition,acquisition);
});
test('invalid optional metadata is dropped without rejecting otherwise valid intake',()=>{
 const body=toReceiptEnrolment(legacy(),'offline-malformed-qa',{validation:{...qa,raw:'unapproved'}});
 assert(parseReceiptEnrolment(body,'offline-malformed-qa'));assert(!Object.hasOwn(body.WebsiteReceipt.source,'validation'));
 const malicious={...body,WebsiteReceipt:{...body.WebsiteReceipt,source:{...body.WebsiteReceipt.source,validation:{...qa,raw:'unapproved'}}}};
 const parsed=parseReceiptEnrolment(malicious,'offline-malformed-qa');assert(parsed);assert(!Object.hasOwn(parsed.source,'validation'));
});
test('durable acceptance persists hints once; replay cannot reclassify and payload conflict stays rejected',async()=>{
 const f=fixtureLedger();let handoffs=0;const options={idempotencyKey:'offline-durable-qa',ledger:f.ledger,handoff:async()=>{handoffs++;return 'lead_v1:1';}};
 try{
  const body=toReceiptEnrolment(legacy(),options.idempotencyKey,{acquisition,validation:qa});
  const first=await receiveReceiptEnrolment(body,options);assert.equal(first.status,'accepted');
  const replay=await receiveReceiptEnrolment({...body,WebsiteReceipt:{...body.WebsiteReceipt,source:{page:body.WebsiteReceipt.source.page,contract:'website_enrolment_v1'}}},options);
  assert.equal(replay.receipt.id,first.receipt.id);assert.equal(handoffs,1);
  assert.deepEqual(JSON.parse(f.db.prepare('SELECT source_json FROM website_enrolment_receipts').get().source_json).validation,qa);
  assert.equal((await receiveReceiptEnrolment({...body,Message:'changed offline payload'},options)).httpStatus,409);assert.equal(handoffs,1);
 }finally{f.close();}
});
test('uncertain intake retains observed hints without claiming acceptance',async()=>{
 const f=fixtureLedger();try{
  const body=toReceiptEnrolment(legacy(),'offline-uncertain-qa',{validation:qa});
  const result=await receiveReceiptEnrolment(body,{idempotencyKey:'offline-uncertain-qa',ledger:f.ledger,handoff:async()=>{throw Error('isolated failure');}});
  assert.equal(result.status,'unknown');const row=f.db.prepare('SELECT state,source_json FROM website_enrolment_receipts').get();assert.equal(row.state,'uncertain');assert.deepEqual(JSON.parse(row.source_json).validation,qa);
 }finally{f.close();}
});
test('private projection reports client marking and keeps historical/invalid rows unknown',async()=>{
 const rows=[qa,null,{...qa,provenance:'trusted'}].map((validation,i)=>({receiptId:'offline-'+i,leadReference:'lead_v1:'+i,state:'accepted',createdAtMs:now,sourceJson:JSON.stringify({validation,Name:'must_not_export'})}));
 const execute=async sql=>sql===ENQUIRY_ANALYTICS_SQL?{rows}:sql===ENQUIRY_ANALYTICS_COUNTS_SQL?{rows:[{state:'accepted',receiptCount:3,enquiryAccepted:3}]}:assert.fail(sql);
 const report=await readEnquiryAnalytics(execute,{startMs:now,endMs:now+1});
 assert.deepEqual(report.rows.map(r=>r.trafficClassification),['client_marked_qa','unknown','unknown']);assert.deepEqual(report.rows[0].validation,qa);assert(!JSON.stringify(report).includes('must_not_export'));
});
test('same helper runs before both collectors and adds no native event parameter',()=>{
 for(const file of ['../public/pinnacle-pages-scripts/speech-measurement.js','../../helpline-site/phone-analytics.js']){
  const s=fs.readFileSync(new URL(file,import.meta.url),'utf8');assert.equal(s.split('/* PINNACLE_QA_PROVENANCE_START */').length,2);assert(s.indexOf('readClientQaHints();')<s.indexOf('let validationTraffic'));
  assert(s.includes(normaliseValidationHints.toString()));assert(s.includes(readClientQaHints.toString()));
 }
});
