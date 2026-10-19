import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {makeContactPayload} from '../public/pinnacle-pages-scripts/contact-api.mjs';
import {CONTACT_FACILITIES,CONTACT_PATH} from '../public/pinnacle-pages-scripts/contact-options.mjs';
import {toLegacyContact,toReceiptContact} from '../deployment/contact-handler.mjs';
import {fixtureLedger} from '../tests/fixtures/enrolment-ledger-sqlite.mjs';

const candidate=path.resolve(process.argv[2]||'');
assert(candidate.endsWith('website-enrolment-receipt.mjs'),'Pass the assembled private receipt helper');
const {receiveReceiptEnrolment}=await import(pathToFileURL(candidate).href+'?candidate='+Date.now());
assert.equal(typeof receiveReceiptEnrolment,'function');

const values={name:'ISOLATED FIXTURE',title:'Mx',phone:'0000000000',email:'fixture@example.invalid',facilityId:CONTACT_FACILITIES[0],subject:'Therapy Services',message:'Offline fixture only.'};
const acquisition={schemaVersion:1,consent:'analytics_accepted',capturedAt:Date.now(),landingPath:CONTACT_PATH,fields:{utm_source:'Google',utm_medium:'CPC',utm_campaign:'contact_receipt_live',utm_content:'contact_form',gclid:'EAIaIQobChMIContactCase123'}};
const privateBody=(requestId,source=acquisition,message=values.message)=>{
 const publicBody=makeContactPayload({...values,message},requestId,source);
 return toReceiptContact(toLegacyContact(publicBody),publicBody.requestId,publicBody.source);
};

const acceptedFixture=fixtureLedger();
try{
 let handoffs=0;
 const body=privateBody('qa-contact-source-accepted');
 const options={idempotencyKey:body.WebsiteReceipt.requestId,ledger:acceptedFixture.ledger,handoff:async lead=>{handoffs++;assert.equal(lead.FormType,'contact submit');return 'lead_v1:900001';}};
 const first=await receiveReceiptEnrolment(body,options);
 assert.equal(first.status,'accepted');
 const retry=await receiveReceiptEnrolment(body,options);
 assert.equal(retry.status,'accepted');assert.deepEqual(retry.receipt,first.receipt);assert.equal(handoffs,1);
 const stored=acceptedFixture.db.prepare('SELECT source_json AS sourceJson FROM website_enrolment_receipts WHERE request_key=?').get(body.WebsiteReceipt.requestId);
 const source=JSON.parse(stored.sourceJson);assert.equal(source.page,CONTACT_PATH);assert.deepEqual(source.acquisition,acquisition);
 const conflict=await receiveReceiptEnrolment({...body,Message:'Different isolated fixture'},options);
 assert.equal(conflict.httpStatus,409);assert.equal(handoffs,1);
}finally{acceptedFixture.close();}

const invalidFixture=fixtureLedger();
try{
 let handoffs=0;
 const body=privateBody('qa-contact-source-unknown',{bad:true});
 assert.equal(body.WebsiteReceipt.source.acquisition,undefined,'Invalid optional attribution must be dropped before the receiver');
 const result=await receiveReceiptEnrolment(body,{idempotencyKey:body.WebsiteReceipt.requestId,ledger:invalidFixture.ledger,handoff:async()=>{handoffs++;return 'lead_v1:900002';}});
 assert.equal(result.status,'accepted');assert.equal(handoffs,1);
}finally{invalidFixture.close();}

const uncertainFixture=fixtureLedger();
try{
 let handoffs=0;
 const body=privateBody('qa-contact-source-uncertain');
 const options={idempotencyKey:body.WebsiteReceipt.requestId,ledger:uncertainFixture.ledger,handoff:async()=>{handoffs++;throw Error('Isolated receiver uncertainty');}};
 assert.equal((await receiveReceiptEnrolment(body,options)).status,'unknown');
 assert.equal((await receiveReceiptEnrolment(body,options)).status,'unknown');
 assert.equal(handoffs,1,'An uncertain private handoff must never be repeated');
}finally{uncertainFixture.close();}

console.log(JSON.stringify({passed:true,candidate,contactPath:CONTACT_PATH,realLeadCreated:false,productionWrite:false}));
