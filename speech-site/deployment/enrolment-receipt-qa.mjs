// Isolated MySQL fixtures only. Never invokes HandleLead, sales, WhatsApp, calls,
// or customer tables. This module is used by a temporary private QA entrypoint.
import {receiveReceiptEnrolment,sqlReceiptLedger,toReceiptEnrolment,payloadDigest} from './website-enrolment-receipt.mjs';
export async function verifyMysqlReceiptContract(execute,runId){
 if(!/^[a-f0-9-]{36}$/.test(runId))throw Error('Isolated fixture run ID required');
 const schema=(await execute('SHOW CREATE TABLE website_enrolment_receipts')).rows?.[0];
 const definition=Object.values(schema||{}).find(x=>typeof x==='string'&&x.includes('CREATE TABLE'))||'';
 if(!definition.includes('PRIMARY KEY (`request_key`)')||!definition.includes('website_enrolment_receipt_id')||!definition.includes('website_enrolment_state_updated'))throw Error('Production ledger schema is not ready');
 const ledger=sqlReceiptLedger((sql,params)=>execute(sql.replaceAll('website_enrolment_receipts','website_enrolment_receipts_qa'),params));
 const checks=[];const check=(name,condition)=>{if(!condition)throw Error('Isolated contract failed: '+name);checks.push(name);};
 let handoffs=0;
 const lead={FormType:'Enroll',Name:'ISOLATED QA FIXTURE',MobileNumber:'+91 00000 00000',Message:'',EmailId:'',Services:['Speech Therapy'],FacilityIds:[''],Title:'Mx',Languages:['English']};
 const body=suffix=>toReceiptEnrolment(lead,'qa-'+runId+'-'+suffix);
 async function handoff(key,data){
  handoffs++;const id=crypto.randomUUID(),digest=await payloadDigest(data);
  await execute('INSERT INTO website_enrolment_qa_intakes (id,request_key,payload_digest) VALUES (?,?,?)',[id,key,digest]);
  const row=(await execute('SELECT id FROM website_enrolment_qa_intakes WHERE request_key=? LIMIT 1',[key])).rows?.[0];
  if(row?.id!==id)throw Error('Isolated intake not durably read back');
  return 'qa_fixture_v1:'+id;
 }
 const receive=(b,options={})=>receiveReceiptEnrolment(b,{idempotencyKey:b.WebsiteReceipt.requestId,ledger,handoff:data=>handoff(b.WebsiteReceipt.requestId,data),...options});
 const first=body('accepted'),concurrent=await Promise.all(Array.from({length:10},()=>receive(first)));
 check('ten concurrent attempts perform one isolated committed handoff',handoffs===1&&concurrent.some(x=>x.status==='accepted'));
 const accepted=await receive(first),reused=await receive(first);
 check('accepted receipt read-back and reload retry preserve receipt',accepted.status==='accepted'&&reused.receipt.id===accepted.receipt.id&&handoffs===1);
 const conflict=await receive({...first,Name:'CHANGED QA FIXTURE'});
 check('same key with changed payload rejected before intake',conflict.httpStatus===409&&handoffs===1);
 const uncertain=body('uncertain'),before=handoffs;
 const failure=await receive(uncertain,{handoff:async data=>{await handoff(uncertain.WebsiteReceipt.requestId,data);throw Error('Isolated lost handoff acknowledgement');}});
 const retry=await receive(uncertain);
 check('uncertain committed handoff never automatically reposted',failure.status==='unknown'&&retry.status==='unknown'&&handoffs===before+1);
 const lost=body('lost-ack'),baseAccept=ledger.accept;
 const lostLedger={...ledger,accept:async(...args)=>{await baseAccept(...args);throw Error('Isolated lost receipt acknowledgement');}};
 const lostResponse=await receive(lost,{ledger:lostLedger}),after=handoffs,restored=await receive(lost);
 check('lost receipt acknowledgement reconciles committed receipt without repost',lostResponse.status==='unknown'&&restored.status==='accepted'&&handoffs===after);
 const failed=body('failed-commit'),failedLedger={...ledger,accept:async()=>{throw Error('Isolated failed receipt commit');}};
 const failedResponse=await receive(failed,{ledger:failedLedger}),afterFailed=handoffs,failedRetry=await receive(failed);
 check('failed receipt commit remains uncertain and cannot repost',failedResponse.status==='unknown'&&failedRetry.status==='unknown'&&handoffs===afterFailed);
 const count=await execute('SELECT COUNT(*) AS total FROM website_enrolment_qa_intakes WHERE request_key LIKE ?',['qa-'+runId+'-%']);
 check('actual isolated MySQL intake count matches four unique handoffs',Number(count.rows?.[0]?.total)===4&&handoffs===4);
 return {testOnly:true,runId,productionTableReady:true,storage:'existing MySQL, isolated QA tables',privateRpc:true,checks,passed:checks.length,isolatedIntakes:4,customerIntakes:0,notifications:0,privateReferencesReturned:false};
}
