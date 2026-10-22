import assert from 'node:assert/strict';import path from 'node:path';import fs from 'node:fs/promises';import {pathToFileURL} from 'node:url';
import {fixtureLedger} from '../tests/fixtures/enrolment-ledger-sqlite.mjs';
import {toReceiptEnrolment} from '../deployment/enrolment-receipt.mjs';
import {toReceiptContact} from '../deployment/contact-handler.mjs';
import {CONTACT_FACILITIES} from '../public/pinnacle-pages-scripts/contact-options.mjs';
const dir=path.resolve(process.argv[2]||'');assert(dir.endsWith('pbn-planetscale'));
const receipt=await import(pathToFileURL(path.join(dir,'website-enrolment-receipt.mjs')));
const analytics=await import(pathToFileURL(path.join(dir,'website-enrolment-analytics.mjs')));
const qa={schemaVersion:1,provenance:'client_observed',hints:['validation_test','qa_mode']},records=[];
for(const kind of ['enrolment','contact'])for(const scenario of ['accepted','invalid','uncertain']){
 const id='offline-'+kind+'-'+scenario,fixture=fixtureLedger();let handoffs=0;
 try{
  const lead=kind==='enrolment'?{FormType:'Enroll',Name:'OFFLINE FIXTURE',MobileNumber:'0000000000',Message:'Offline only',EmailId:'',Services:['Speech Therapy'],FacilityIds:[''],Title:'Mx',Languages:['English']}:{FormType:'contact submit',Name:'Mx. OFFLINE FIXTURE',Title:'Mx',MobileNumber:'0000000000',EmailId:'fixture@example.invalid',Subject:'Therapy Services',Message:'Offline only',FacilityIds:[CONTACT_FACILITIES[0]]};
  const source={validation:qa},body=kind==='enrolment'?toReceiptEnrolment(lead,id,source):toReceiptContact(lead,id,source);
  if(scenario==='invalid')body.WebsiteReceipt.source.validation={...qa,raw:'must_not_be_saved'};
  const options={idempotencyKey:id,ledger:fixture.ledger,handoff:async()=>{handoffs++;if(scenario==='uncertain')throw Error('offline uncertain');return 'lead_v1:900001';}};
  const first=await receipt.receiveReceiptEnrolment(body,options);assert.equal(first.status,scenario==='uncertain'?'unknown':'accepted');
  const stored=fixture.db.prepare('SELECT receipt_id AS receiptId,state,source_json AS sourceJson,created_at_ms AS createdAtMs,updated_at_ms AS updatedAtMs,lead_reference AS leadReference FROM website_enrolment_receipts').get();
  const saved=JSON.parse(stored.sourceJson);assert.deepEqual(saved.validation,scenario==='invalid'?undefined:qa);
  const replay=structuredClone(body);delete replay.WebsiteReceipt.source.validation;await receipt.receiveReceiptEnrolment(replay,options);assert.equal(handoffs,1);assert.equal(fixture.db.prepare('SELECT source_json AS json FROM website_enrolment_receipts').get().json,stored.sourceJson);
  if(scenario!=='uncertain')assert.equal((await receipt.receiveReceiptEnrolment({...body,Message:'conflicting offline text'},options)).httpStatus,409);
  const execute=async sql=>sql===analytics.ENQUIRY_ANALYTICS_SQL?{rows:[stored]}:sql===analytics.ENQUIRY_ANALYTICS_COUNTS_SQL?{rows:[{state:stored.state,receiptCount:1,enquiryAccepted:scenario==='uncertain'?0:1,contactAccepted:kind==='contact'&&scenario!=='uncertain'?1:0,nonEnquiryContactAccepted:0}]}:assert.fail('Unexpected query');
  const report=await analytics.readEnquiryAnalytics(execute,{startMs:stored.createdAtMs-1,endMs:Date.now()+1000});assert.equal(report.rows[0].trafficClassification,scenario==='invalid'?'unknown':'client_marked_qa');assert.deepEqual(report.rows[0].validation,scenario==='invalid'?null:qa);
  assert(!JSON.stringify(report).includes('OFFLINE FIXTURE'));assert.equal(report.rows[0].event,scenario==='uncertain'?null:'enquiry_accepted');
  records.push({kind,scenario,status:'passed'});
 }finally{fixture.close();}
}
await fs.writeFile(path.join(dir,'qa-fixture-proof.json'),JSON.stringify({status:'passed',records,database:'isolated SQLite',productionWrites:0,nativeEvents:0},null,2)+'\n');console.log(JSON.stringify({status:'passed',cases:records.length,productionWrites:0,nativeEvents:0}));
