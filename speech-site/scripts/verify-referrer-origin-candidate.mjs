// Offline acceptance of the assembled receiver and public handlers, not source substitutes.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {fixtureLedger} from '../tests/fixtures/enrolment-ledger-sqlite.mjs';
import {CONTACT_FACILITIES} from '../public/pinnacle-pages-scripts/contact-options.mjs';

assert(process.argv[2], 'Pass the artifact root or its candidate directory');
const supplied=path.resolve(process.argv[2]);
const candidate=await fs.stat(path.join(supplied,'pbn-planetscale')).then(()=>supplied,()=>path.join(supplied,'candidate'));
const modulePaths={
 receipt:'pbn-planetscale/website-enrolment-receipt.mjs',
 analytics:'pbn-planetscale/website-enrolment-analytics.mjs',
 standalone:'pinnacle-verify-route/enrolment-handler.mjs',
 shared:'pinnacle-verify-route/shared-clearance-runtime.mjs'
};
const hashes={},loaded={},results=[];
const NOW=1_800_000_000_000,ROOT='https://www.pinnacleblooms.org';
const ENROL='/enroll-autism-speech-aba-therapies-india',CONTACT='/contact-national-autism-helpline-24-7';
const QA={schemaVersion:1,provenance:'client_observed',hints:['validation_test','qa_mode']};
const originalFetch=globalThis.fetch,originalNow=Date.now;
let networkCalls=0,uuidSequence=0;
globalThis.fetch=()=>{networkCalls++;throw Error('Network prohibited in offline candidate acceptance');};
Date.now=()=>NOW;
const copy=value=>structuredClone(value);
async function check(name,fn){
 try{await fn();results.push({name,status:'passed'});}
 catch(error){results.push({name,status:'failed',error:error.message});}
}
const acquisition=(referrerOrigin='https://chatgpt.com')=>({schemaVersion:1,consent:'analytics_accepted',capturedAt:NOW-100,landingPath:'/national-autism-helpline',fields:{},referrerOrigin});
const campaign=()=>({...acquisition(),fields:{utm_source:'chatgpt',utm_medium:'paid',utm_campaign:'pinnacle_vizag_call_enquiries'}});
function privateBody(kind,key,source){
 const common={Name:'OFFLINE FIXTURE',MobileNumber:'0000000000',Message:'Offline fixture only',EmailId:'fixture@example.invalid',Title:'Mx'};
 if(kind==='enrolment')return {...common,FormType:'Enroll',Services:['Speech Therapy'],FacilityIds:[''],Languages:['English'],WebsiteReceipt:{schemaVersion:1,requestId:key,source:{page:ENROL,contract:'website_enrolment_v1',...copy(source)}}};
 return {...common,FormType:'contact submit',Name:'Mx. OFFLINE FIXTURE',Subject:'Therapy Services',FacilityIds:[CONTACT_FACILITIES[0]],WebsiteReceipt:{schemaVersion:1,requestId:key,source:{page:CONTACT,contract:'website_contact_v1',topic:'Therapy Services',...copy(source)}}};
}
function stored(f){return f.db.prepare('SELECT receipt_id AS receiptId,state,source_json AS sourceJson,created_at_ms AS createdAtMs,updated_at_ms AS updatedAtMs,lead_reference AS leadReference FROM website_enrolment_receipts').all();}
function options(f,key,handoff){return {idempotencyKey:key,ledger:loaded.receipt.sqlReceiptLedger(f.execute),handoff,now:()=>NOW,uuid:()=>`offline-fixed-${++uuidSequence}`};}
async function report(rows){
 const groups=new Map();
 for(const row of rows){
  const group=groups.get(row.state)||{state:row.state,receiptCount:0,enquiryAccepted:0,contactAccepted:0,nonEnquiryContactAccepted:0};
  group.receiptCount++;
  if(row.state==='accepted'&&row.leadReference){group.enquiryAccepted++;if(JSON.parse(row.sourceJson).contract==='website_contact_v1')group.contactAccepted++;}
  groups.set(row.state,group);
 }
 return loaded.analytics.readEnquiryAnalytics(async sql=>{
  if(sql===loaded.analytics.ENQUIRY_ANALYTICS_SQL)return {rows};
  if(sql===loaded.analytics.ENQUIRY_ANALYTICS_COUNTS_SQL)return {rows:[...groups.values()]};
  assert.fail('Unexpected offline analytics query');
 },{startMs:NOW-1000,endMs:NOW+1});
}
function publicBody(kind,key,source){
 if(kind==='enrolment')return {schemaVersion:1,requestId:key,contact:{name:'OFFLINE FIXTURE',phone:'0000000000',email:''},preferences:{service:'speech',centre:''},message:'Offline fixture only',source:{page:ENROL,...copy(source)}};
 return {schemaVersion:1,formType:'contact',requestId:key,contact:{name:'OFFLINE FIXTURE',title:'Mx',phone:'0000000000',email:'fixture@example.invalid'},preferences:{facilityId:CONTACT_FACILITIES[0],subject:'Therapy Services'},message:'Offline fixture only',source:{page:CONTACT,...copy(source)}};
}
async function publicCall(handler,kind,key,source){
 const payload=publicBody(kind,key,source),calls=[];
 const env={ENROLMENT_RECEIPT_VERSION:'1',PINNACLE_ENROLMENT_RECEIPTS:{receive:async(body,id)=>{
  calls.push({body:copy(body),id});
  return {httpStatus:202,status:'accepted',receipt:{schemaVersion:1,requestId:id,id:'offline-public-receipt',leadReference:'lead_v1:900001'}};
 }}};
 const request=new Request(ROOT+'/api/enrolment',{method:'POST',headers:{origin:ROOT,'content-type':'application/json','idempotency-key':key},body:JSON.stringify(payload)});
 const response=await handler(request,env),answer=await response.json();
 assert.equal(response.status,202);assert.equal(answer.status,'accepted');assert.equal(answer.contractVersion,1);assert.equal(calls.length,1);
 assert.equal(answer.receipt.id,'offline-public-receipt');assert(!JSON.stringify(answer).includes('lead_v1:'));
 return calls[0].body.WebsiteReceipt.source;
}

try{
 for(const [name,relative]of Object.entries(modulePaths)){
  const file=path.join(candidate,relative),bytes=await fs.readFile(file);
  hashes[relative]=createHash('sha256').update(bytes).digest('hex');
  loaded[name]=await import(pathToFileURL(file).href+'?offline-origin='+hashes[relative]);
 }
 assert.equal(typeof loaded.standalone.serveEnrolmentApi,'function');
 assert.equal(typeof loaded.shared.createClearanceWrapper,'function');
 for(const kind of ['enrolment','contact']){
  await check(`${kind}: origin and QA persist once, replay/conflict and observed row count`,async()=>{
   const f=fixtureLedger();let writes=0;
   try{
    const key='offline-origin-'+kind,body=privateBody(kind,key,{acquisition:acquisition(),validation:QA});
    const opts=options(f,key,async()=>{writes++;return 'lead_v1:900001';});
    const first=await loaded.receipt.receiveReceiptEnrolment(body,opts);assert.equal(first.status,'accepted');
    const replay=privateBody(kind,key,{acquisition:acquisition('https://search.example.org')});
    assert.equal((await loaded.receipt.receiveReceiptEnrolment(replay,opts)).receipt.id,first.receipt.id);
    assert.equal((await loaded.receipt.receiveReceiptEnrolment({...body,Message:'different offline message'},opts)).httpStatus,409);
    assert.equal(writes,1);assert.equal(stored(f).length,1);
    const saved=JSON.parse(stored(f)[0].sourceJson);assert.deepEqual(saved.acquisition,acquisition());assert.deepEqual(saved.validation,QA);
    const actual=await report(stored(f));assert.equal(actual.rows[0].sourceStatus,'observed_referrer');assert.equal(actual.rows[0].referrerOrigin,'https://chatgpt.com');
    assert.equal(actual.rows[0].trafficClassification,'client_marked_qa');assert.equal(actual.rows[0].event,'enquiry_accepted');
    assert.equal(actual.rowCounts.acceptedWithObservedReferrer,1);assert.equal(actual.rowCounts.acceptedWithPermittedCampaign,0);
    assert.equal(actual.rows[0].googleDelivery,'unknown');assert.equal(actual.rows[0].qualification,'unknown');assert(!JSON.stringify(actual).includes('OFFLINE FIXTURE'));
   }finally{f.close();}
  });
  await check(`${kind}: malformed, private and noncanonical origin-only inputs reject before handoff`,async()=>{
   const f=fixtureLedger();let writes=0;
   try{
    for(const [i,value]of [undefined,'https://chatgpt.com/private?secret=1','https://user:pass@chatgpt.com','http://127.0.0.1','https://chatgpt.com:8443','https://www.pinnacleblooms.org'].entries()){
     const key=`offline-invalid-${kind}-${i}`,a=acquisition(value);if(value===undefined)delete a.referrerOrigin;
     const result=await loaded.receipt.receiveReceiptEnrolment(privateBody(kind,key,{acquisition:a}),options(f,key,async()=>{writes++;return 'lead_v1:900001';}));
     assert.equal(result.httpStatus,422,String(value));
    }
    assert.equal(writes,0);assert.equal(stored(f).length,0);
   }finally{f.close();}
  });
  await check(`${kind}: explicit campaign keeps priority and drops optional origin`,async()=>{
   const f=fixtureLedger();
   try{
    for(const [i,origin]of ['https://chatgpt.com','http://127.0.0.1/private'].entries()){
     const key=`offline-campaign-${kind}-${i}`,a={...campaign(),referrerOrigin:origin};
     assert.equal((await loaded.receipt.receiveReceiptEnrolment(privateBody(kind,key,{acquisition:a}),options(f,key,async()=> 'lead_v1:900001'))).status,'accepted');
    }
    for(const row of stored(f)){const saved=JSON.parse(row.sourceJson).acquisition;assert.deepEqual(saved.fields,campaign().fields);assert(!Object.hasOwn(saved,'referrerOrigin'));}
    const actual=await report(stored(f));assert.equal(actual.rowCounts.acceptedWithPermittedCampaign,2);assert.equal(actual.rowCounts.acceptedWithObservedReferrer,0);
    assert(actual.rows.every(row=>row.sourceStatus==='permitted_campaign'&&row.referrerOrigin===null));
   }finally{f.close();}
  });
  await check(`${kind}: uncertain origin intake cannot replay or become an accepted count`,async()=>{
   const f=fixtureLedger();let writes=0;
   try{
    const key='offline-uncertain-'+kind,body=privateBody(kind,key,{acquisition:acquisition(),validation:QA}),opts=options(f,key,async()=>{writes++;throw Error('Offline uncertain handoff');});
    assert.equal((await loaded.receipt.receiveReceiptEnrolment(body,opts)).status,'unknown');assert.equal((await loaded.receipt.receiveReceiptEnrolment(body,opts)).status,'unknown');assert.equal(writes,1);
    const actual=await report(stored(f));assert.equal(actual.rows[0].event,null);assert.equal(actual.rowCounts.acceptedWithObservedReferrer,0);assert.equal(actual.rows[0].trafficClassification,'client_marked_qa');
   }finally{f.close();}
  });
 }
 const standalone=(req,env)=>loaded.standalone.serveEnrolmentApi(req,env,{fetchImpl:()=>{networkCalls++;throw Error('Forbidden public fallback');}});
 await check('standalone handler: helpline origin-only and QA reach only the stub receiver',async()=>{
  const source=await publicCall(standalone,'enrolment','offline-standalone-origin',{acquisition:acquisition(),validation:QA});
  assert.deepEqual(source.acquisition,acquisition());assert.deepEqual(source.validation,QA);
 });
 await check('standalone handler: unapproved helpline campaign drops attribution, preserving valid enquiry',async()=>{
  const source=await publicCall(standalone,'enrolment','offline-standalone-invalid',{acquisition:{...campaign(),fields:{utm_source:'google',utm_medium:'cpc',utm_campaign:'unapproved'}},validation:QA});
  assert(!Object.hasOwn(source,'acquisition'));assert.deepEqual(source.validation,QA);
 });
 await check('standalone handler: approved fixed helpline campaign remains intact',async()=>{
  const a=campaign(),source=await publicCall(standalone,'enrolment','offline-standalone-campaign',{acquisition:a});
  assert.deepEqual(source.acquisition.fields,a.fields);assert(!Object.hasOwn(source.acquisition,'referrerOrigin'));
 });
 const wrapper=loaded.shared.createClearanceWrapper({fetch:()=>{networkCalls++;throw Error('Unexpected shared fallback');}});
 const shared=(req,env)=>wrapper.fetch(req,env,{waitUntil:()=>assert.fail('Unexpected background dispatch')});
 for(const kind of ['enrolment','contact'])await check(`actual shared handler: ${kind} origin and QA reach only the stub receiver`,async()=>{
  const source=await publicCall(shared,kind,'offline-shared-'+kind,{acquisition:acquisition(),validation:QA});
  assert.deepEqual(source.acquisition,acquisition());assert.deepEqual(source.validation,QA);
 });
 await check('zero external requests across all candidate cases',()=>assert.equal(networkCalls,0));
}catch(error){results.push({name:'candidate module loading/contract',status:'failed',error:error.message});}
finally{globalThis.fetch=originalFetch;Date.now=originalNow;}
const failed=results.filter(r=>r.status==='failed');
console.log(JSON.stringify({status:failed.length?'failed':'passed',candidate,moduleSHA256:hashes,cases:results.length,passed:results.length-failed.length,failed:failed.length,results,networkCalls,productionWrites:0,nativeEvents:0,scope:'Actual candidate helpers with isolated SQLite; actual public/shared handlers with stub receiver; no index.js execution or provider calls'},null,2));
if(failed.length)process.exitCode=1;
