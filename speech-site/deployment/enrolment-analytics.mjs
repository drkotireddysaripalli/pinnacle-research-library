// Protected first-party reporting. Every accepted receipt is recorded by the
// receiver transaction, without depending on Google, scripts or cookie choice.
// This is a projection of those records; it creates no leads or conversions.
import {normaliseAcquisition} from '../public/pinnacle-pages-scripts/enrolment-source.mjs';
export const ENQUIRY_ANALYTICS_SQL=`SELECT receipt_id AS receiptId,lead_reference AS leadReference,
 state,created_at_ms AS createdAtMs,updated_at_ms AS updatedAtMs,source_json AS sourceJson
 FROM website_enrolment_receipts WHERE created_at_ms>=? AND created_at_ms<?
 ORDER BY created_at_ms,receipt_id LIMIT ?`;
export const ENQUIRY_ANALYTICS_COUNTS_SQL=`SELECT state,COUNT(*) AS receiptCount,
 SUM(CASE WHEN state='accepted' AND lead_reference IS NOT NULL AND lead_reference<>'' THEN 1 ELSE 0 END) AS enquiryAccepted
 FROM website_enrolment_receipts WHERE created_at_ms>=? AND created_at_ms<? GROUP BY state`;
export async function readEnquiryAnalytics(execute,{startMs,endMs,limit=1000}={}){
 if(typeof execute!=='function'||!Number.isSafeInteger(startMs)||!Number.isSafeInteger(endMs)||startMs<0||endMs<=startMs||endMs-startMs>31*86400000||!Number.isInteger(limit)||limit<1||limit>1000)throw new TypeError('Use a protected 1–31 day cohort and limit 1–1000');
 const result=await execute(ENQUIRY_ANALYTICS_SQL,[startMs,endMs,limit+1]),raw=result.rows||[],states={accepted:0,claimed:0,handoff_started:0,uncertain:0,other:0};
 const summary=await execute(ENQUIRY_ANALYTICS_COUNTS_SQL,[startMs,endMs]),counts={accepted:0,claimed:0,handoff_started:0,uncertain:0,other:0,enquiryAccepted:0};
 for(const r of summary.rows||[]){const n=Number(r.receiptCount),a=Number(r.enquiryAccepted);if(!Number.isSafeInteger(n)||n<0||!Number.isSafeInteger(a)||a<0||a>n)throw new Error('Invalid receiving count');counts[Object.hasOwn(states,r.state)?r.state:'other']+=n;counts.enquiryAccepted+=a;}
 const rows=raw.slice(0,limit).map(r=>{
  states[Object.hasOwn(states,r.state)?r.state:'other']++;
  let source;try{source=typeof r.sourceJson==='string'?JSON.parse(r.sourceJson):r.sourceJson;}catch{}
  // Validate the stored permission at intake time. Device expiry must not erase
  // a valid historical source from an already accepted business record.
  const acquisition=normaliseAcquisition(source?.acquisition,Number(r.createdAtMs));
  return {receiptId:r.receiptId,leadReference:r.leadReference??null,state:r.state,
   createdAtMs:Number(r.createdAtMs),updatedAtMs:Number(r.updatedAtMs),
   event:r.state==='accepted'&&r.leadReference?'enquiry_accepted':null,
   acquisition:acquisition||null,sourceStatus:acquisition?'permitted_campaign':'unknown',
   googleDelivery:'unknown',qualification:'unknown',appointment:'unknown',attendance:'unknown',admission:'unknown'};
 });
 return {schemaVersion:1,generatedAt:new Date().toISOString(),timeZone:'Asia/Calcutta',cohort:{startMs,endMs},truncated:raw.length>limit,
  definition:'One business event per durable accepted website receipt with its exact protected intake reference. Google delivery and downstream outcomes require their own records.',
  timeBasis:'Receipt creation cohort with current durable states at read time; not acceptance-event time',countScope:'whole_receipt_creation_cohort',counts,
  rowCountScope:'returned_rows',rowCounts:{...states,enquiryAccepted:rows.filter(r=>r.event==='enquiry_accepted').length,
   acceptedWithPermittedCampaign:rows.filter(r=>r.event==='enquiry_accepted'&&r.acquisition).length},rows};
}
