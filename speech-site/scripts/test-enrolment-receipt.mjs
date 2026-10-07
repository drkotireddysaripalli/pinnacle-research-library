import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {receiveReceiptEnrolment,toReceiptEnrolment,parseReceiptEnrolment,payloadDigest,sqlReceiptLedger} from '../deployment/enrolment-receipt.mjs';
import {serveEnrolmentApi,toLegacyEnrolment} from '../deployment/enrolment-handler.mjs';
import {makePayload,submitEnrolment,createAttemptStore,ATTEMPT_STORAGE_KEY} from '../public/pinnacle-pages-scripts/enrolment-api.mjs';
import {fixtureLedger} from '../tests/fixtures/enrolment-ledger-sqlite.mjs';
import {patchEnrolmentReceiver} from './prepare-enrolment-receiver.mjs';
const origin='https://www.pinnacleblooms.org',endpoint='/api/enrolment';
const publicPayload=makePayload({name:'ISOLATED QA FIXTURE',phone:'+91 00000 00000',email:'',service:'speech',centre:'',message:'ISOLATED QA ONLY'},'qa-contract-request');
const body=toReceiptEnrolment(toLegacyEnrolment(publicPayload),publicPayload.requestId);
const request=()=>new Request(origin+endpoint,{method:'POST',headers:{origin,'content-type':'application/json','idempotency-key':publicPayload.requestId},body:JSON.stringify(publicPayload)});
const acceptedReceipt={schemaVersion:1,requestId:publicPayload.requestId,id:'qa-receipt-accepted',leadReference:'lead_v1:qa-only'};
const rpcEnv=receive=>({ENROLMENT_RECEIPT_VERSION:'1',PINNACLE_ENROLMENT_RECEIPTS:{receive}});

test('receipt source is fixed; version/header/source conflicts never hand off',async()=>{
 assert(parseReceiptEnrolment(body,body.WebsiteReceipt.requestId));
 for(const change of [{...body,WebsiteReceipt:{...body.WebsiteReceipt,schemaVersion:2}},{...body,WebsiteReceipt:{...body.WebsiteReceipt,source:{page:'/invented',contract:'website_enrolment_v1'}}},{...body,WebsiteReceipt:{...body.WebsiteReceipt,source:{...body.WebsiteReceipt.source,gclid:'secret'}}}]){
  let calls=0;assert.equal((await receiveReceiptEnrolment(change,{idempotencyKey:body.WebsiteReceipt.requestId,handoff:async()=>calls++})).status,'rejected');assert.equal(calls,0);
 }
 assert.equal(parseReceiptEnrolment(body,'different-key'),null);
});
test('canonical hash covers every legacy handoff field and survives object property order',async()=>{
 const legacy=toLegacyEnrolment(publicPayload),reversed=Object.fromEntries(Object.entries(legacy).reverse());assert.equal(await payloadDigest(legacy),await payloadDigest(reversed));
 for(const field of ['Name','MobileNumber','EmailId','Message','Title'])assert.notEqual(await payloadDigest(legacy),await payloadDigest({...legacy,[field]:legacy[field]+' changed'}));
});
test('atomic concurrent claims call the handoff once and same-key retry reuses durable receipt',async()=>{
 const f=fixtureLedger();try{
  let calls=0;const handoff=async()=>{calls++;await new Promise(resolve=>setTimeout(resolve,5));return 'lead_v1:qa-only';};
  const results=await Promise.all(Array.from({length:10},()=>receiveReceiptEnrolment(body,{idempotencyKey:publicPayload.requestId,ledger:f.ledger,handoff})));
  assert.equal(calls,1);assert.equal(results.filter(x=>x.status==='accepted').length,1);
  const retry=await receiveReceiptEnrolment(body,{idempotencyKey:publicPayload.requestId,ledger:f.ledger,handoff});assert.equal(calls,1);assert.deepEqual(retry.receipt,results.find(x=>x.status==='accepted').receipt);
  const row=f.db.prepare('SELECT * FROM website_enrolment_receipts').get();assert.equal(row.state,'accepted');assert.equal(row.lead_reference,'lead_v1:qa-only');const stored=JSON.stringify(row);for(const secret of ['ISOLATED QA FIXTURE','+91 00000','ISOLATED QA ONLY'])assert(!stored.includes(secret));assert.equal(JSON.parse(row.source_json).page,publicPayload.source.page);
 }finally{f.close();}
});
test('same key with conflicting payload is rejected without a second handoff',async()=>{
 const f=fixtureLedger();try{let calls=0;const options={idempotencyKey:publicPayload.requestId,ledger:f.ledger,handoff:async()=>{calls++;return 'lead_v1:qa-only';}};
  assert.equal((await receiveReceiptEnrolment(body,options)).status,'accepted');const conflict=await receiveReceiptEnrolment({...body,Name:'Different QA name'},options);assert.equal(conflict.httpStatus,409);assert.equal(conflict.reason,'request_key_conflict');assert.equal(calls,1);
 }finally{f.close();}
});
test('failed, empty and uncertain handoffs remain held; retries never repost',async()=>{
 for(const handoff of [async()=>{throw Error('Simulated acknowledgement lost');},async()=>undefined]){
  const f=fixtureLedger();try{let calls=0;const options={idempotencyKey:publicPayload.requestId,ledger:f.ledger,handoff:async()=>{calls++;return handoff();}};assert.equal((await receiveReceiptEnrolment(body,options)).status,'unknown');assert.equal((await receiveReceiptEnrolment(body,options)).status,'unknown');assert.equal(calls,1);assert.equal(f.db.prepare('SELECT state FROM website_enrolment_receipts').get().state,'uncertain');}finally{f.close();}
 }
});
test('claim/storage failure stops before handoff; receipt commit failure holds the write',async()=>{
 let calls=0;
 assert.equal((await receiveReceiptEnrolment(body,{idempotencyKey:publicPayload.requestId,ledger:{claim:async()=>{throw Error('db down');}},handoff:async()=>calls++})).status,'unknown');assert.equal(calls,0);
 const f=fixtureLedger();try{const ledger={...f.ledger,accept:async()=>{throw Error('Simulated commit failure');}};const options={idempotencyKey:publicPayload.requestId,ledger,handoff:async()=>{calls++;return 'lead_v1:qa-written';}};assert.equal((await receiveReceiptEnrolment(body,options)).status,'unknown');assert.equal((await receiveReceiptEnrolment(body,options)).status,'unknown');assert.equal(calls,1);}finally{f.close();}
});
test('an abandoned claim after a process failure never assumes the lead was unwritten',async()=>{
 const f=fixtureLedger();try{await f.ledger.claim({requestId:publicPayload.requestId,digest:await payloadDigest(toLegacyEnrolment(publicPayload)),receiptId:'qa-crashed-receipt',claimToken:'qa-crashed-token',source:{page:publicPayload.source.page},now:Date.now()});let calls=0;assert.equal((await receiveReceiptEnrolment(body,{idempotencyKey:publicPayload.requestId,ledger:f.ledger,handoff:async()=>calls++})).status,'unknown');assert.equal(calls,0);}finally{f.close();}
});
test('lost acknowledgement after accepted commit reuses receipt on reconciliation without reposting',async()=>{
 const f=fixtureLedger();try{let calls=0;const ledger={...f.ledger,accept:async(...args)=>{await f.ledger.accept(...args);throw Error('Simulated accepted commit acknowledgement lost');}};const options={idempotencyKey:publicPayload.requestId,ledger,handoff:async()=>{calls++;return 'lead_v1:qa-written';}};assert.equal((await receiveReceiptEnrolment(body,options)).status,'unknown');const retry=await receiveReceiptEnrolment(body,options);assert.equal(retry.status,'accepted');assert.equal(calls,1);assert.equal(retry.receipt.leadReference,'lead_v1:qa-written');}finally{f.close();}
});
test('real child process restart reuses accepted receipt and holds an uncertain write',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'pbn-enrolment-offline-'));const db=path.join(dir,'qa.sqlite');
 const run=phase=>JSON.parse(execFileSync(process.execPath,['tests/fixtures/enrolment-ledger-restart.mjs',db,phase],{encoding:'utf8',stdio:['ignore','pipe','ignore']}));
 try{const first=run('accepted-first'),retry=run('accepted-retry');assert.equal(first.status,'accepted');assert.equal(retry.status,'accepted');assert.deepEqual(retry.receipt,first.receipt);assert.equal(retry.handoffs,1);assert.equal(run('conflict').httpStatus,409);assert.equal(run('uncertain-first').status,'unknown');const held=run('uncertain-retry');assert.equal(held.status,'unknown');assert.equal(held.handoffs,1);assert.equal(held.networking,'disabled');}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('activation flag preserves legacy intake and explicit transitional boundary',async()=>{
 let sent;const result=await serveEnrolmentApi(request(),{}, {fetchImpl:async(_,options)=>{sent=JSON.parse(options.body);return new Response('true');}});assert.equal(result.status,202);assert.deepEqual(await result.json(),{status:'accepted',contractVersion:0});assert(!sent.WebsiteReceipt);
});
test('durable adapter propagates key/source, requires confirmed reference, and strips protected IDs',async()=>{
 let sent;const result=await serveEnrolmentApi(request(),rpcEnv(async(data,key)=>{sent={data,key};return {httpStatus:202,status:'accepted',receipt:acceptedReceipt};}),{fetchImpl:async()=>{throw Error('Durable path must never use public fetch');}});
 assert.equal(result.status,202);const envelope=await result.json();assert.deepEqual(envelope,{status:'accepted',receipt:{schemaVersion:1,requestId:publicPayload.requestId,id:acceptedReceipt.id},contractVersion:1});assert(!JSON.stringify(envelope).includes('lead_v1:'));assert.equal(sent.key,publicPayload.requestId);assert.equal(sent.data.WebsiteReceipt.source.page,publicPayload.source.page);
 for(const answer of [true,{status:'accepted'},{status:'accepted',receipt:{...acceptedReceipt,requestId:'other-key'}},{status:'accepted',receipt:{...acceptedReceipt,leadReference:''}}])assert.equal((await serveEnrolmentApi(request(),rpcEnv(async()=>answer))).status,502);
});
test('versioned rejection allows correction; wrong idempotency header never reaches receiver',async()=>{
 assert.equal((await serveEnrolmentApi(request(),rpcEnv(async()=>({httpStatus:409,status:'rejected'})))).status,409);
 const bad=request();bad.headers.set('idempotency-key','wrong-key');let calls=0;assert.equal((await serveEnrolmentApi(bad,{},{fetchImpl:async()=>calls++})).status,422);assert.equal(calls,0);
});
test('durable activation without private binding fails before intake; RPC timeout stays uncertain',async()=>{
 let calls=0;assert.equal((await serveEnrolmentApi(request(),{ENROLMENT_RECEIPT_VERSION:'1'},{fetchImpl:async()=>calls++})).status,503);assert.equal(calls,0);
 const result=await serveEnrolmentApi(request(),rpcEnv(()=>{calls++;return new Promise(()=>{});}),{timeoutMs:10});assert.equal(result.status,502);assert.equal(calls,1);assert.deepEqual(await result.json(),{status:'unknown'});
});
test('browser requires matching receipt for durable acceptance and labels transitional legacy',async()=>{
 const call=(answer,extra={})=>submitEnrolment(endpoint,publicPayload,{origin,fetchImpl:async()=>Response.json(answer),...extra});
 assert.equal((await call({status:'accepted'})).state,'unknown');assert.equal((await call({status:'accepted',receipt:{...acceptedReceipt,requestId:'wrong-key'}})).state,'unknown');assert.equal((await call({status:'accepted',receipt:acceptedReceipt})).state,'accepted');assert.equal((await call({status:'accepted',contractVersion:0})).state,'accepted');assert.equal((await call({status:'accepted',contractVersion:0},{receiptRequired:true})).state,'unknown');
});
test('persistent browser state contains essential metadata and never raw enquiry or attribution',()=>{
 const entries=new Map(),store=createAttemptStore({getItem:k=>entries.get(k)||null,setItem:(k,v)=>entries.set(k,v),removeItem:k=>entries.delete(k)});
 store.write({requestId:publicPayload.requestId,state:'pending',createdAt:Date.now(),...publicPayload,gclid:'secret'});assert.equal(store.read().state,'pending');const raw=entries.get(ATTEMPT_STORAGE_KEY);for(const privateField of ['contact','preferences','message','gclid','secret','ISOLATED QA FIXTURE'])assert(!raw.includes(privateField));
 store.write({requestId:publicPayload.requestId,state:'accepted',createdAt:Date.now(),receipt:acceptedReceipt});assert.equal(store.read().receipt.id,acceptedReceipt.id);assert(!entries.get(ATTEMPT_STORAGE_KEY).includes('leadReference'));store.clear();assert.equal(store.read(),null);
});
test('narrow private receiver candidate preserves legacy response and notification payload',{skip:!fs.existsSync('ask-private/acquisition-receiver-20261007/index.js')},async()=>{
 const source=fs.readFileSync('ask-private/acquisition-receiver-20261007/index.js'),candidate=patchEnrolmentReceiver(source);
 assert.throws(()=>patchEnrolmentReceiver(Buffer.from('different revision')));
 assert.equal((candidate.match(/websiteReceiptWrite\.reference =/g)||[]).length,4);
 const start=candidate.indexOf('async function HandleStaticWebForms('),end=candidate.indexOf('__name(HandleStaticWebForms,',start),functionSource=candidate.slice(start,end);
 const f=fixtureLedger();let calls=0,notices=[];
 try{
  const context=vm.createContext({Object,Response,receiveWebsiteEnrolmentReceipt:receiveReceiptEnrolment,websiteEnrolmentSqlLedger:sqlReceiptLedger,WebsiteReceiptWorkerEntrypoint:class{constructor(ctx,env){this.ctx=ctx;this.env=env;}},getPSConnection:async()=>{},globalEnv:null,globalEvent:null,globalConnection:{execute:f.execute},HandleLead:async(...args)=>{calls++;if(args[14])args[14].reference='lead_v1:qa-real-write';return {Id:'qa-user-id',IsNewLead:'NEWLEAD'};},ProcessWhatsAppMessages:async payload=>notices.push(payload),getSuccessResponse:value=>new Response(String(value)),getErrorResponse:()=>new Response('error',{status:500}),logger:{Log(){}}});
  const handle=vm.runInContext(functionSource+'\nHandleStaticWebForms',context),event={waitUntil:promise=>promise};
  const send=data=>handle(new Request('https://fixture.invalid/api/gl/swfs',{method:'POST',headers:{'content-type':'application/json','idempotency-key':publicPayload.requestId},body:JSON.stringify(data)}),event);
  assert.equal((await send(body)).status,422);assert.equal(calls,0);
  const classStart=candidate.indexOf('class WebsiteEnrolmentReceipts extends'),classEnd=candidate.indexOf('export {WebsiteEnrolmentReceipts};',classStart),Entrypoint=vm.runInContext(candidate.slice(classStart,classEnd)+'\nWebsiteEnrolmentReceipts',context),rpc=new Entrypoint(event,{});
  assert.equal((await rpc.receive(body,publicPayload.requestId)).status,'accepted');assert.equal((await rpc.receive(body,publicPayload.requestId)).status,'accepted');assert.equal(calls,1);assert.equal(notices.length,1);assert(!JSON.stringify(notices).includes('WebsiteReceipt'));
  assert.equal(await (await send(toLegacyEnrolment(publicPayload))).text(),'true');assert.equal(calls,2);
 }finally{f.close();}
});
