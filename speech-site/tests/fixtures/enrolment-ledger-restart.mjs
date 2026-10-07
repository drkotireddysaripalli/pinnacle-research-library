import {receiveReceiptEnrolment,toReceiptEnrolment} from '../../deployment/enrolment-receipt.mjs';
import {fixtureLedger} from './enrolment-ledger-sqlite.mjs';
// Child process fixture: no networking, analytics, live sales or real contact.
globalThis.fetch=async()=>{throw new Error('Offline fixture forbids networking');};
const [filename,phase]=process.argv.slice(2),fixture=fixtureLedger(filename);
const key=phase.startsWith('uncertain')?'qa-restart-uncertain':'qa-restart-accepted';
const lead={FormType:'Enroll',Name:'ISOLATED QA FIXTURE',MobileNumber:'+91 00000 00000',EmailId:'qa@example.invalid',Message:phase==='conflict'?'Different QA payload':'ISOLATED QA ONLY',Services:['Speech Therapy'],FacilityIds:[''],Title:'Mx',Languages:['English']};
const body=toReceiptEnrolment(lead,key);
const result=await receiveReceiptEnrolment(body,{idempotencyKey:key,ledger:fixture.ledger,handoff:async()=>{
 const ref='lead_v1:qa-fixture-'+key;fixture.db.prepare('INSERT INTO qa_handoffs VALUES (?,?)').run(key,ref);
 if(phase==='uncertain-first')throw new Error('Simulated lost acknowledgement after write');
 return ref;
}});
const handoffs=fixture.db.prepare('SELECT count(*) AS n FROM qa_handoffs WHERE request_key=?').get(key).n;
console.log(JSON.stringify({phase,status:result.status,httpStatus:result.httpStatus,receipt:result.receipt,handoffs,networking:'disabled',sales:'isolated_fixture'}));
fixture.close();
