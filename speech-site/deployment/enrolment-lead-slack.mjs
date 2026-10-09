// Server-only candidate. Not imported by the public API or browser.
// Lead creation remains the existing receiver's responsibility.
import {validReceiptEnvelope} from './enrolment-receipt.mjs';
const IDENTIFIER=/^[A-Za-z0-9:_-]{1,100}$/;
const CHANNEL=/^C[A-Z0-9]{8,20}$/;
const TS=/^[0-9]+\.[0-9]+$/;
const PLANNED=new WeakSet();
const PLAN_META=new WeakMap();
const GROUP_META=new WeakMap();

function verifiedCentre(event,{routes,facilityRoutes,allowUnassigned}){
 let code=event.centreId,channel;
 if(code!=null&&code!==''&&!/^[A-Z0-9]{2,12}$/.test(code))throw Error('Verified centre routing required');
 if(Object.hasOwn(event,'facilityId')){
  const id=event.facilityId;
  if(id!=null&&id!==''&&(typeof id!=='string'||!/^\d{1,30}$/.test(id)))throw Error('Exact facility ID required');
  const route=id&&facilityRoutes&&Object.hasOwn(facilityRoutes,id)?facilityRoutes[id]:null;
  if(route){
   if(!/^[A-Z0-9]{2,12}$/.test(route.short_code)||!CHANNEL.test(route.administration_channel_id)||
      (code&&code!==route.short_code))throw Error('Verified centre routing required');
   return {code:route.short_code,channel:route.administration_channel_id};
  }
  // An unresolved facility cannot fall back to an independently supplied code.
  if(allowUnassigned!==true)throw Error('Verified centre routing required');
  return {pending:id?'unmapped_facility':'no_centre_selected'};
 }
 if(code&&routes&&Object.hasOwn(routes,code)){
  channel=routes[code];if(!CHANNEL.test(channel))throw Error('Verified centre routing required');
  return {code,channel};
 }
 if(allowUnassigned!==true)throw Error('Verified centre routing required');
 return {pending:code?'unmapped_centre':'no_centre_selected'};
}

export function planLeadSlackNotifications({event,receipt,resolvedLead},config={}){
 const {centralChannel,approveLeadUrl}=config;
 if(event?.type!=='website.enrol.submitted'||!/^[A-Za-z0-9-]{8,100}$/.test(event.requestId||'')||
    receipt?.state!=='accepted'||!validReceiptEnvelope(receipt,event.requestId)||
    !/^lead_v1:[1-9][0-9]{0,18}$/.test(receipt?.leadReference||'')||
    resolvedLead?.leadReference!==receipt.leadReference||!IDENTIFIER.test(resolvedLead?.leadId||'')||
    resolvedLead.leadId!==receipt.leadReference.slice('lead_v1:'.length)||
    typeof resolvedLead?.leadUrl!=='string'||typeof approveLeadUrl!=='function')throw Error('Confirmed lead contract required');
 const centre=verifiedCentre(event,config);
 if(!CHANNEL.test(centralChannel)||centre.channel===centralChannel)throw Error('Verified centre routing required');
 const url=new URL(resolvedLead.leadUrl);
 const personQuery=url.origin==='https://therapeuticai.org'&&url.pathname==='/'&&
  /^[1-9][0-9]{0,18}$/.test(String(resolvedLead.personId))&&url.searchParams.size===1&&
  url.searchParams.get('l')==='lead-'+String(resolvedLead.personId);
 // The configured validator must verify the official record path and ID,
 // and its access-control contract. Syntax alone cannot establish authentication.
 if(url.protocol!=='https:'||url.username||url.password||(url.search&&!personQuery)||url.hash||url.href.length>1000||
    /[<>|\r\n]/.test(resolvedLead.leadUrl)||approveLeadUrl(url,resolvedLead.leadId,resolvedLead.personId)!==true)throw Error('Approved protected lead URL required');
 const text=['Website enrolment lead ready for review',
  'Submission: '+event.requestId,'Intake history: '+resolvedLead.leadId,
  'Centre: '+(centre.code||'UNASSIGNED — pending verified assignment'),'Open protected lead: '+url.href].join('\n');
 const destinations=centre.channel?[centre.channel,centralChannel]:[centralChannel];
 const plans=Object.freeze(destinations.map(channel=>{
  const plan=Object.freeze({key:event.type+':'+receipt.id+':'+channel,
   payload:Object.freeze({channel,text,mrkdwn:false,parse:'none',unfurl_links:false,unfurl_media:false,unfurl_app_links:false})});
  // Keep the network receipt identity stable when a later verified assignment
  // adds its centre leg. Changed lead/URL identities still conflict.
  PLAN_META.set(plan,Object.freeze({source:event.type,requestId:event.requestId,receiptId:receipt.id,
   leadReference:receipt.leadReference,leadId:resolvedLead.leadId,leadUrl:url.href,channel,
   ...(channel===centralChannel?{}:{centre:centre.code})}));
  return plan;
 }));
 GROUP_META.set(plans,centre.pending);
 PLANNED.add(plans);return plans;
}
async function digest(payload){
 const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(payload)));
 return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
// journal must use atomic durable storage in the existing receiver database.
// Failed Slack responses may retry; network/ack uncertainty requires readback.
export async function prepareLeadSlackDelivery(plans,{journal,postMessage,now=Date.now,uuid=()=>crypto.randomUUID()}={}){
 if(!Array.isArray(plans)||![1,2].includes(plans.length)||!PLANNED.has(plans))throw Error('Use the verified immutable notification group');
 if(!journal||!['claim','start','complete','retry','uncertain'].every(k=>typeof journal[k]==='function')||
    typeof postMessage!=='function')throw Error('Durable journal and server-side Slack adapter required');
 // Persist every destination intent before any provider request. If execution
 // ends during the first send, the other destination remains visible/pending.
 const claimed=[];
 for(const plan of plans){
  let token,claim;
  try{
   token=uuid();claim=await journal.claim({key:plan.key,digest:await digest(PLAN_META.get(plan)),token,now:now()});
   claimed.push({plan,token,claim});
  }catch{
   claimed.push({plan,token,failed:true});
  }
 }
 // No destination may send if another destination's durable intent was not
 // confirmed. Existing pending rows remain available for a later safe replay.
 if(claimed.some(record=>record.failed))throw Error('All destination intents must be durably confirmed');
 return async function dispatch(){
 const results=[];
 for(const {plan,token,claim,failed}of claimed){
  try{
   if(failed){results.push({channel:plan.payload.channel,status:'uncertain'});continue;}
   if(claim.conflict){results.push({channel:plan.payload.channel,status:'conflict'});continue;}
   if(!claim.owner){results.push({channel:plan.payload.channel,status:claim.state});continue;}
   if(!await journal.start(plan.key,token,now())){results.push({channel:plan.payload.channel,status:'pending'});continue;}
   const response=await postMessage(plan.payload);
   // Slack internal_error/fatal_error can follow partial success. Only a
   // definite rate-limit rejection is automatically retryable here.
   if(response?.ok===false&&['rate_limited','ratelimited'].includes(response.error)){
    await journal.retry(plan.key,token,now());results.push({channel:plan.payload.channel,status:'pending'});continue;
   }
   if(response?.ok!==true||response.channel!==plan.payload.channel||!TS.test(response.ts||''))throw Error('Slack acknowledgement unconfirmed');
   await journal.complete(plan.key,token,response.ts,now());
   results.push({channel:plan.payload.channel,status:'delivered'});
  }catch{
   if(token)try{await journal.uncertain(plan.key,token,now());}catch{}
   results.push({channel:plan.payload.channel,status:'uncertain'});
  }
 }
 const pending=GROUP_META.get(plans);
 if(pending)results.push({channel:null,status:'centre_pending',reason:pending});
 return results;
 };
}
export async function deliverLeadSlackNotifications(plans,options){
 return (await prepareLeadSlackDelivery(plans,options))();
}
export function sqlLeadSlackJournal(execute){
 const select='SELECT payload_digest AS digest,state,claim_token AS token FROM website_lead_slack_deliveries WHERE delivery_key=? LIMIT 1';
 const changed=r=>Number(r.rowsAffected??r.affectedRows??0)===1;
 return {
  async claim(r){
   const inserted=changed(await execute("INSERT IGNORE INTO website_lead_slack_deliveries (delivery_key,payload_digest,state,claim_token,created_at_ms,updated_at_ms) VALUES (?,?,'pending',?,?,?)",[r.key,r.digest,r.token,r.now,r.now]));
   let row=(await execute(select,[r.key])).rows?.[0];
   if(!row)throw Error('Notification claim unconfirmed');
   if(row.digest!==r.digest)return {owner:false,conflict:true,state:row.state};
   if(row.state!=='pending')return {owner:false,state:row.state};
   const owner=inserted||changed(await execute("UPDATE website_lead_slack_deliveries SET claim_token=?,updated_at_ms=? WHERE delivery_key=? AND claim_token=? AND state='pending'",[r.token,r.now,r.key,row.token]));
   return {owner,state:row.state};
  },
  async start(key,token,at){return changed(await execute("UPDATE website_lead_slack_deliveries SET state='in_flight',updated_at_ms=? WHERE delivery_key=? AND claim_token=? AND state='pending'",[at,key,token]));},
  async complete(key,token,ts,at){
   if(!changed(await execute("UPDATE website_lead_slack_deliveries SET state='delivered',slack_ts=?,updated_at_ms=? WHERE delivery_key=? AND claim_token=? AND state='in_flight'",[ts,at,key,token])))throw Error('Notification commit unconfirmed');
   const row=(await execute(select,[key])).rows?.[0];if(row?.state!=='delivered')throw Error('Notification readback unconfirmed');
  },
  async retry(key,token,at){if(!changed(await execute("UPDATE website_lead_slack_deliveries SET state='pending',updated_at_ms=? WHERE delivery_key=? AND claim_token=? AND state='in_flight'",[at,key,token])))throw Error('Notification retry unconfirmed');},
  async uncertain(key,token,at){await execute("UPDATE website_lead_slack_deliveries SET state='uncertain',updated_at_ms=? WHERE delivery_key=? AND claim_token=? AND state='in_flight'",[at,key,token]);}
 };
}
