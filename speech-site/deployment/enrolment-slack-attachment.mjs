// Private server-only attachment. No import by a browser or public fetch route.
import {parseReceiptEnrolment,payloadDigest,validReceiptEnvelope} from './enrolment-receipt.mjs';
import {resolveAcceptedWebsiteLead,approveExistingLeadPersonUrl} from './enrolment-lead-resolver.mjs';
import {planLeadSlackNotifications,prepareLeadSlackDelivery,sqlLeadSlackJournal} from './enrolment-lead-slack.mjs';

export const ACCEPTED_PAYLOAD_SQL="SELECT payload_digest AS digest FROM website_enrolment_receipts WHERE request_key=? AND receipt_id=? AND lead_reference=? AND state='accepted' LIMIT 1";

// The caller retains and returns result unmodified. Outcomes have no payload,
// contact, clinical, URL or credential fields and cannot become lead events.
export async function prepareAcceptedEnrolmentSlack(result,{body,idempotencyKey,execute,routing,postMessage,enabled=false}={}){
 if(enabled!==true)return {status:'disabled'};
 if(result?.httpStatus!==202||result.status!=='accepted'||!validReceiptEnvelope(result.receipt,idempotencyKey))return {status:'not_accepted'};
 if(!/^lead_v1:[1-9][0-9]{0,18}$/.test(result.receipt.leadReference||''))return {status:'accepted_reference_out_of_scope'};
 if(typeof execute!=='function'||typeof postMessage!=='function'||!routing)return {status:'configuration_pending'};
 try{
  const parsed=parseReceiptEnrolment(body,idempotencyKey);
  if(!parsed)return {status:'accepted_payload_unconfirmed'};
  // Bind the submitted facility preference to the exact body accepted under
  // this request. A replay with changed routing cannot redirect notifications.
  const rows=(await execute(ACCEPTED_PAYLOAD_SQL,[idempotencyKey,result.receipt.id,result.receipt.leadReference])).rows;
  if(!Array.isArray(rows)||rows.length!==1||rows[0].digest!==await payloadDigest(parsed.lead))return {status:'accepted_payload_unconfirmed'};
  // state belongs to the operation result; normalize only this internal copy.
  const receipt={...result.receipt,state:'accepted'};
  const resolvedLead=await resolveAcceptedWebsiteLead(receipt,{execute});
  const event={type:'website.enrol.submitted',requestId:idempotencyKey,facilityId:parsed.lead.FacilityIds[0]};
  const plans=planLeadSlackNotifications({event,receipt,resolvedLead},{...routing,approveLeadUrl:approveExistingLeadPersonUrl});
  const dispatch=await prepareLeadSlackDelivery(plans,{journal:sqlLeadSlackJournal(execute),postMessage});
  return {status:'intents_prepared',dispatch};
 }catch{return {status:'notification_preparation_held'};}
}

export async function attachAcceptedEnrolmentSlack(result,options={}){
 // There is deliberately no path back into HandleLead or the receipt accept
 // transaction from notification failure, including rejected background work.
 try{
  const prepared=await prepareAcceptedEnrolmentSlack(result,options);
  if(!prepared.dispatch)return {status:prepared.status};
  const task=prepared.dispatch().catch(()=>[{status:'notification_delivery_held'}]);
  if(typeof options.waitUntil==='function'){
   try{options.waitUntil(task);return {status:'dispatch_registered'};}
   catch{await task;return {status:'dispatch_registration_held'};}
  }
  return {status:'dispatch_finished',deliveries:await task};
 }catch{return {status:'notification_attachment_held'};}
}
