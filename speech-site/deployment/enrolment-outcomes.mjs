// Protected reporting helper. Never import into a browser or expose as a public route.
// Exact receipt references establish a person association, not campaign causality.
export const MAX_RECEIPT_COHORT_MS=31*86400000;
export const RECEIPT_LINK_SQL=`SELECT r.receipt_id AS receiptId,r.created_at_ms AS createdAtMs,
 CASE WHEN l.Id IS NULL AND n.Id IS NULL THEN 'missing_or_invalid_intake_reference'
      WHEN p.Id IS NULL THEN 'missing_person' ELSE 'linked' END AS linkStatus,
 (SELECT h.Status FROM lead_v1 h WHERE h.TOId=p.Id ORDER BY h.CDT DESC,h.Id DESC LIMIT 1) AS operationalStatusNow
 FROM website_enrolment_receipts r
 LEFT JOIN lead_v1 l ON r.lead_reference REGEXP '^lead_v1:[1-9][0-9]{0,18}$'
  AND l.Id=CAST(SUBSTRING_INDEX(r.lead_reference,':',-1) AS UNSIGNED)
 LEFT JOIN peoplenote_v1 n ON r.lead_reference REGEXP '^peoplenote_v1:[1-9][0-9]{0,18}$'
  AND n.Id=CAST(SUBSTRING_INDEX(r.lead_reference,':',-1) AS UNSIGNED)
 LEFT JOIN people p ON p.Id=COALESCE(l.TOId,n.TOId)
 WHERE r.state='accepted' AND r.created_at_ms>=? AND r.created_at_ms<?
 ORDER BY r.created_at_ms,r.receipt_id LIMIT ?`;

export async function readReceiptLinks(execute,{startMs,endMs,limit=100}={}){
 if(typeof execute!=='function'||!Number.isSafeInteger(startMs)||!Number.isSafeInteger(endMs)||startMs<0||endMs<=startMs||endMs-startMs>MAX_RECEIPT_COHORT_MS||!Number.isInteger(limit)||limit<1||limit>100)throw new TypeError('Use a protected 1–31 day receipt cohort and limit 1–100');
 const result=await execute(RECEIPT_LINK_SQL,[startMs,endMs,limit+1]);
 const rows=result.rows||[];
 return {schemaVersion:1,cohort:{startMs,endMs},truncated:rows.length>limit,
  definition:'Accepted website receipts joined by exact typed intake ID. Current operational status is an observation; it is not a dated admission or attributed outcome.',
  rows:rows.slice(0,limit).map(r=>({receiptId:r.receiptId,createdAtMs:Number(r.createdAtMs),linkStatus:r.linkStatus,
   operationalStatusNow:r.operationalStatusNow??null,qualification:'unknown',appointment:'unknown',attendance:'unknown',admission:'unknown',
   reason:'Dated outcome and call-system contracts required; do not infer from phone numbers or timestamp proximity.'}))};
}
