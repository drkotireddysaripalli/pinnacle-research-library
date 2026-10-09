// Isolated, local persisted transport evidence. No requests to Google, the public
// enquiry API, customer tables, OTP, call or notification services are made.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {makePayload} from '../public/pinnacle-pages-scripts/enrolment-api.mjs';
import {serveEnrolmentApi} from '../deployment/enrolment-handler.mjs';
import {receiveReceiptEnrolment} from '../deployment/enrolment-receipt.mjs';
import {fixtureLedger} from '../tests/fixtures/enrolment-ledger-sqlite.mjs';
import {centreFacilities} from '../deployment/centre-facilities.mjs';
const id='gbp-source-handoff-20261009',privateDir=path.resolve('ask-private',id),output=path.resolve('deployment',id+'-fixture.json');
if(fs.existsSync(output))throw Error('Existing evidence must be reconciled, not overwritten');
fs.mkdirSync(privateDir,{recursive:true});
const source=fs.readFileSync('public/pinnacle-pages-scripts/speech-measurement.js','utf8');
const origin='https://www.pinnacleblooms.org',landing='/centers/best-autism-speech-aba-occupational-therapy-center-anathapuram-ap-india';
const search='?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=anathapuram-ap';
const values=new Map(),buttons={},listeners={},status={textContent:''},win={};
const doc={referrer:'',body:{dataset:{pageVariant:'service'}},querySelector:s=>s.startsWith('script[')?null:s==='[data-speech-measurement]'?{hidden:true}:status,querySelectorAll:()=>['accepted','declined'].map(choice=>({dataset:{measurementChoice:choice},addEventListener:(_,fn)=>buttons[choice]=fn})),createElement:()=>({setAttribute(){}}),head:{append(){}},addEventListener:(name,fn)=>listeners[name]=fn};
vm.runInNewContext(source,{window:win,document:doc,location:{origin,pathname:landing,href:origin+landing+search},navigator:{globalPrivacyControl:false},localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)},Date,Set,JSON,URL});
buttons.accepted();
const acquisition=JSON.parse(JSON.stringify(win.pinnacleEnquirySource()));
assert.equal(acquisition.landingPath,'/centers');assert.equal(acquisition.fields.utm_content,'anathapuram-ap');
const requestId='qa-gbp-'+randomUUID();
const body=makePayload({name:'ISOLATED QA FIXTURE',phone:'+91 00000 00000',email:'',service:'speech',centre:'kadapa',message:'ISOLATED TRANSPORT ONLY'},requestId,acquisition);
const f=fixtureLedger(path.join(privateDir,'transport-fixture.sqlite'));
f.db.exec('CREATE TABLE IF NOT EXISTS qa_selected_centres (request_key TEXT PRIMARY KEY,facility_id TEXT NOT NULL)');
let handoffs=0;
const env={ENROLMENT_RECEIPT_VERSION:'1',PINNACLE_ENROLMENT_RECEIPTS:{receive:(data,key)=>receiveReceiptEnrolment(data,{idempotencyKey:key,ledger:f.ledger,handoff:async lead=>{
  handoffs++;assert.deepEqual(lead.FacilityIds,[centreFacilities.kadapa.id]);
  f.db.prepare('INSERT INTO qa_selected_centres (request_key,facility_id) VALUES (?,?)').run(key,lead.FacilityIds[0]);
  return 'qa_fixture_v1:'+randomUUID();
}})}};
const send=payload=>serveEnrolmentApi(new Request(origin+'/api/enrolment',{method:'POST',headers:{origin,'content-type':'application/json','idempotency-key':requestId},body:JSON.stringify(payload)}),env);
try {
 const initial=await Promise.all(Array.from({length:10},()=>send(body)));
 assert(initial.some(r=>r.status===202));assert.equal(handoffs,1);
 const accepted=await (await send(body)).json();assert.equal(accepted.status,'accepted');
 const same=await (await send(body)).json();assert.deepEqual(same.receipt,accepted.receipt);
 const alteredSource=structuredClone(body);alteredSource.source.acquisition.fields.utm_content='different-listing';
 assert.equal((await (await send(alteredSource)).json()).receipt.id,accepted.receipt.id);
 const alteredCentre=structuredClone(body);alteredCentre.preferences.centre='ananthapuram';assert.equal((await send(alteredCentre)).status,409);
 const row=f.db.prepare('SELECT request_key,receipt_id,state,source_json FROM website_enrolment_receipts WHERE request_key=?').get(requestId);
 const selected=f.db.prepare('SELECT facility_id FROM qa_selected_centres WHERE request_key=?').get(requestId);
 const saved=JSON.parse(row.source_json);assert.deepEqual(saved.acquisition,acquisition);assert.equal(handoffs,1);
 const telemetry=JSON.stringify(win.dataLayer);assert(!telemetry.includes('ISOLATED QA FIXTURE'));assert(!telemetry.includes('00000'));assert(!telemetry.includes(requestId));
 const receipt={at:new Date().toISOString(),evidenceClass:'isolated_local_persisted_transport_fixture',productionDatabase:false,realEnquiry:false,requestId:row.request_key,receiptId:row.receipt_id,state:row.state,source:saved,listingCentre:{key:saved.acquisition.fields.utm_content,basis:'declared GBP UTM convention; not verified organic acquisition'},selectedCentre:{key:'kadapa',facilityId:selected.facility_id,basis:'separate form selection mapped by maintained centreFacilities'},deduplication:{concurrentAttempts:10,retries:3,committedFixtureIntakes:handoffs,changedSelectedCentreStatus:409,firstClaimedSourceRetained:true},customerIntakes:0,googleRequests:0,notifications:0,measurementSha256:createHash('sha256').update(source).digest('hex')};
 fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
}finally{f.close();}
