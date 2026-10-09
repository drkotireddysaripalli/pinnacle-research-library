import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {DatabaseSync} from 'node:sqlite';
import {receiveReceiptEnrolment,sqlReceiptLedger,toReceiptEnrolment} from '../deployment/enrolment-receipt.mjs';
import {attachAcceptedEnrolmentSlack,prepareAcceptedEnrolmentSlack} from '../deployment/enrolment-slack-attachment.mjs';
import {planLeadSlackNotifications} from '../deployment/enrolment-lead-slack.mjs';
import {patchCurrentReceiver,CURRENT_RECEIVER_SHA256} from './prepare-current-receiver-slack.mjs';
// Synthetic offline records only. No network, provider or customer intake.
const key='offline-request-attachment-0001';
const routing={centralChannel:'C9876543210',allowUnassigned:true,facilityRoutes:{'456':{short_code:'QA',administration_channel_id:'C1234567890'}}};
function fixture(){
 const db=new DatabaseSync(':memory:');
 db.exec(`CREATE TABLE website_enrolment_receipts(request_key TEXT PRIMARY KEY,payload_digest TEXT,state TEXT,receipt_id TEXT,claim_token TEXT,source_json TEXT,lead_reference TEXT,created_at_ms INTEGER,updated_at_ms INTEGER);
 CREATE TABLE website_lead_slack_deliveries(delivery_key TEXT PRIMARY KEY,payload_digest TEXT,state TEXT,claim_token TEXT,slack_ts TEXT,created_at_ms INTEGER,updated_at_ms INTEGER);
 CREATE TABLE lead_v1(Id TEXT,TOId TEXT);CREATE TABLE people(Id TEXT);`);
 const execute=async(sql,params=[])=>{const q=db.prepare(sql.replace(/^INSERT IGNORE/,'INSERT OR IGNORE'));return /^SELECT/.test(sql)?{rows:q.all(...params)}:{rowsAffected:Number(q.run(...params).changes)};};
 const body=toReceiptEnrolment({FormType:'Enroll',Name:'OFFLINE TEST ONLY',MobileNumber:'0000000000',Message:'fixture',EmailId:'test@example.invalid',Services:['Speech Therapy'],FacilityIds:['456'],Title:'Mx',Languages:['English']},key);
 let handoffs=0;
 const receive=()=>receiveReceiptEnrolment(body,{idempotencyKey:key,ledger:sqlReceiptLedger(execute),handoff:async()=>{handoffs++;db.exec("INSERT INTO lead_v1 VALUES ('123','789');INSERT INTO people VALUES ('789')");return 'lead_v1:123';}});
 return {db,execute,body,receive,handoffs:()=>handoffs,close:()=>db.close()};
}
const ok=p=>({ok:true,channel:p.channel,ts:'1234567890.000001'});
test('real receipt shape attaches after acceptance with both durable intents before first send',async()=>{
 const f=fixture();try{
  const result=await f.receive(),before=JSON.stringify(result);let sends=0;
  assert.equal(result.receipt.state,undefined);
  const report=await attachAcceptedEnrolmentSlack(result,{...f,idempotencyKey:key,routing,enabled:true,postMessage:p=>{
   sends++;assert.equal(f.db.prepare('SELECT count(*) AS n FROM website_lead_slack_deliveries').get().n,2);
   assert(p.text.includes('l=lead-789'));assert(!p.text.includes('OFFLINE TEST ONLY'));return ok(p);
  }});
  assert.equal(report.status,'dispatch_finished');assert.equal(sends,2);assert.equal(JSON.stringify(result),before);assert.equal(f.handoffs(),1);
  const replay=await f.receive();await attachAcceptedEnrolmentSlack(replay,{...f,idempotencyKey:key,routing,enabled:true,postMessage:()=>{throw Error('must not repost');}});
  assert.equal(f.handoffs(),1);assert.equal(f.db.prepare("SELECT count(*) AS n FROM website_lead_slack_deliveries WHERE state='delivered'").get().n,2);
 }finally{f.close();}
});
test('unknown Slack outcome preserves acceptance and replay never recreates intake or reposts',async()=>{
 const f=fixture();try{const result=await f.receive();let sends=0;
  const options={...f,idempotencyKey:key,routing,enabled:true,postMessage:()=>{sends++;throw Error('unknown network outcome');}};
  await attachAcceptedEnrolmentSlack(result,options);await attachAcceptedEnrolmentSlack(await f.receive(),options);
  assert.equal(result.status,'accepted');assert.equal(sends,2);assert.equal(f.handoffs(),1);
  assert.equal(f.db.prepare("SELECT count(*) AS n FROM website_lead_slack_deliveries WHERE state='uncertain'").get().n,2);
 }finally{f.close();}
});
test('changed facility preference cannot redirect a replayed accepted receipt',async()=>{
 const f=fixture();try{const result=await f.receive(),body=structuredClone(f.body);body.FacilityIds=['999'];let sends=0;
  const report=await prepareAcceptedEnrolmentSlack(result,{...f,body,idempotencyKey:key,routing,enabled:true,postMessage:()=>sends++});
  assert.equal(report.status,'accepted_payload_unconfirmed');assert.equal(sends,0);
 }finally{f.close();}
});
test('disabled, unaccepted, configuration-pending and non-lead accepted references perform no reads or sends',async()=>{
 const receipt={schemaVersion:1,requestId:key,id:'offline-receipt-0001',leadReference:'lead_v1:123'};let effects=0;
 const accepted={httpStatus:202,status:'accepted',receipt};
 const base={idempotencyKey:key,execute:()=>effects++,postMessage:()=>effects++,routing};
 assert.equal((await prepareAcceptedEnrolmentSlack(accepted,base)).status,'disabled');
 assert.equal((await prepareAcceptedEnrolmentSlack({...accepted,status:'unknown'},{...base,enabled:true})).status,'not_accepted');
 assert.equal((await prepareAcceptedEnrolmentSlack(accepted,{...base,enabled:true,postMessage:null})).status,'configuration_pending');
 assert.equal((await prepareAcceptedEnrolmentSlack({...accepted,receipt:{...receipt,leadReference:'peoplenote_v1:123'}},{...base,enabled:true})).status,'accepted_reference_out_of_scope');
 assert.equal(effects,0);
});
test('background registration failure cannot change accepted status or duplicate delivery',async()=>{
 const f=fixture();try{const result=await f.receive();let sends=0;
  const report=await attachAcceptedEnrolmentSlack(result,{...f,idempotencyKey:key,routing,enabled:true,postMessage:p=>{sends++;return ok(p);},waitUntil:()=>{throw Error('context ended');}});
  assert.equal(report.status,'dispatch_registration_held');assert.equal(result.status,'accepted');assert.equal(sends,2);assert.equal(f.handoffs(),1);
 }finally{f.close();}
});
test('journal failure leaves the genuine accepted receipt unchanged',async()=>{
 const f=fixture();try{const result=await f.receive(),before=JSON.stringify(result);f.db.exec('DROP TABLE website_lead_slack_deliveries');let sends=0;
  const report=await attachAcceptedEnrolmentSlack(result,{...f,idempotencyKey:key,routing,enabled:true,postMessage:()=>sends++});
  assert.equal(report.status,'notification_preparation_held');assert.equal(sends,0);assert.equal(JSON.stringify(result),before);
 }finally{f.close();}
});
test('partial destination claim failure holds all sends and retains the first pending intent',async()=>{
 const f=fixture();try{const result=await f.receive();let sends=0;
  const execute=async(sql,params=[])=>{
   if(/^INSERT IGNORE INTO website_lead_slack_deliveries/.test(sql)&&params[0].endsWith(':C9876543210'))throw Error('offline central journal unavailable');
   return f.execute(sql,params);
  };
  const report=await attachAcceptedEnrolmentSlack(result,{...f,execute,idempotencyKey:key,routing,enabled:true,postMessage:()=>sends++});
  assert.equal(report.status,'notification_preparation_held');assert.equal(sends,0);assert.equal(result.status,'accepted');
  assert.equal(f.db.prepare("SELECT count(*) AS n FROM website_lead_slack_deliveries WHERE state='pending'").get().n,1);
  await attachAcceptedEnrolmentSlack(result,{...f,idempotencyKey:key,routing,enabled:true,postMessage:p=>{sends++;return ok(p);}});
  assert.equal(sends,2);assert.equal(f.handoffs(),1);
 }finally{f.close();}
});
test('planner rejects a mismatched intake-history ID even with a permissive URL validator',()=>{
 const receipt={schemaVersion:1,requestId:key,id:'offline-receipt-0001',state:'accepted',leadReference:'lead_v1:123'};
 assert.throws(()=>planLeadSlackNotifications({event:{type:'website.enrol.submitted',requestId:key,facilityId:'456'},receipt,resolvedLead:{leadReference:'lead_v1:123',leadId:'456',personId:'789',leadUrl:'https://therapeuticai.org/?l=lead-789'}},{...routing,approveLeadUrl:()=>true}));
});
test('pinned current-receiver patch preserves other exports and holds Slack inactive',async t=>{
 const input=process.env.PINNACLE_RECEIVER_SAVED_SOURCE;
 if(!input){t.skip('Explicit private receiver fixture is required');return;}
 const original=fs.readFileSync(input),candidate=patchCurrentReceiver(original);
 assert.throws(()=>patchCurrentReceiver(Buffer.from('other receiver')));
 assert.throws(()=>patchCurrentReceiver(Buffer.from(candidate),CURRENT_RECEIVER_SHA256));
 assert(candidate.includes('  Organs,\r\n  index_default as default,\r\n  organTOSkillMapped')||candidate.includes('  Organs,\n  index_default as default,\n  organTOSkillMapped'));
 assert.equal((candidate.match(/websiteReceiptWrite.reference = "lead_v1:"/g)||[]).length,3);
 assert(candidate.includes('Object.hasOwn(data2, "WebsiteReceipt")'));
 const start=candidate.indexOf('class WebsiteEnrolmentReceipts extends'),end=candidate.indexOf('export {WebsiteEnrolmentReceipts};',start);
 const result={httpStatus:202,status:'accepted',receipt:{schemaVersion:1,requestId:key,id:'offline-receipt-0001',leadReference:'lead_v1:123'}};
 let attached=false,received=false;
 const context=vm.createContext({WebsiteReceiptWorkerEntrypoint:class{constructor(){this.env={};this.ctx={waitUntil(){}};}},getPSConnection:async()=>{},globalConnection:{execute(){}},globalEnv:null,globalEvent:null,websiteEnrolmentSqlLedger:()=>({}),receiveWebsiteEnrolmentReceipt:async()=>{received=true;return result;},attachWebsiteEnrolmentSlack:async(r,options)=>{assert(received);assert.equal(r,result);assert.equal(options.enabled,false);attached=true;},readWebsiteEnquiryAnalytics:()=>{}});
 const RPC=vm.runInContext(candidate.slice(start,end)+'\nWebsiteEnrolmentReceipts',context);
 assert.equal(await new RPC().receive({},key),result);assert(attached);
});
