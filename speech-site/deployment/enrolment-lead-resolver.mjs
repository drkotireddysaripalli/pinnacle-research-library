// Server-only resolver for an already accepted website intake.
// Uses the receiver's existing records; never creates a lead.
import {validReceiptEnvelope} from './enrolment-receipt.mjs';
const ID=/^[1-9][0-9]{0,18}$/;
function exactId(value){
 if(!['string','number','bigint'].includes(typeof value)||
    (typeof value==='number'&&!Number.isSafeInteger(value))||!ID.test(String(value)))throw Error('Exact positive ID required');
 return String(value);
}
export const EXISTING_LEAD_PERSON_LINK_SQL=`SELECT l.Id AS intakeId,p.Id AS personId
 FROM website_enrolment_receipts r
 JOIN lead_v1 l ON l.Id=?
 JOIN people p ON p.Id=l.TOId
 WHERE r.request_key=? AND r.receipt_id=? AND r.state='accepted'
 AND r.lead_reference=? LIMIT 1`;
export function existingLeadPersonUrl(personId){
 // Existing backend notification producers use TOId/person ID in this link.
 // The accepted intake's lead_v1.Id remains a separate history identifier.
 return 'https://therapeuticai.org/?l=lead-'+exactId(personId);
}
export function approveExistingLeadPersonUrl(url,_leadId,personId){
 return ID.test(String(personId))&&url.href===existingLeadPersonUrl(personId);
}
export async function resolveAcceptedWebsiteLead(receipt,{execute}={}){
 const match=/^lead_v1:([1-9][0-9]{0,18})$/.exec(receipt?.leadReference||'');
 if(receipt?.state!=='accepted'||!validReceiptEnvelope(receipt,receipt.requestId)||
    !/^[A-Za-z0-9-]{8,100}$/.test(receipt.requestId||'')||!match||typeof execute!=='function')throw Error('Accepted private website receipt required');
 const result=await execute(EXISTING_LEAD_PERSON_LINK_SQL,[match[1],receipt.requestId,receipt.id,receipt.leadReference]);
 const rows=result?.rows;
 if(!Array.isArray(rows)||rows.length!==1||exactId(rows[0].intakeId)!==match[1])throw Error('Protected intake/person join unconfirmed');
 const leadId=exactId(rows[0].intakeId),personId=exactId(rows[0].personId);
 return {leadReference:receipt.leadReference,leadId,personId,leadUrl:existingLeadPersonUrl(personId)};
}
