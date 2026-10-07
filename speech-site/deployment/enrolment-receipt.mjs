// Private receiver helper. This module is never published as a browser asset.
// The database's unique request key and conditional updates are the authority;
// an in-memory map, KV read/write pair, or HTTP 200 is not a durable receipt.
export const RECEIPT_CONTRACT_VERSION=1;
export const ENROLMENT_SOURCE_PAGE='/enroll-autism-speech-aba-therapies-india';
const KEY=/^[A-Za-z0-9-]{8,100}$/;
const ID=/^[A-Za-z0-9-]{8,100}$/;
const LEGACY_FIELDS=['FormType','Name','MobileNumber','Message','EmailId','Services','FacilityIds','Title','Languages'];

export function receiptSource(){return {page:ENROLMENT_SOURCE_PAGE,contract:'website_enrolment_v1'};}
export function validReceiptEnvelope(receipt,requestId){
 return receipt?.schemaVersion===1&&receipt.requestId===requestId&&typeof receipt.id==='string'&&ID.test(receipt.id);
}
export function toReceiptEnrolment(legacy,requestId){
 return {...legacy,WebsiteReceipt:{schemaVersion:RECEIPT_CONTRACT_VERSION,requestId,source:receiptSource()}};
}
export function parseReceiptEnrolment(body,idempotencyKey){
 const contract=body?.WebsiteReceipt;
 if(body?.FormType!=='Enroll'||contract?.schemaVersion!==1||!KEY.test(contract?.requestId||'')||idempotencyKey!==contract.requestId)return null;
 if(contract.source?.page!==ENROLMENT_SOURCE_PAGE||contract.source?.contract!=='website_enrolment_v1'||Object.keys(contract.source).length!==2)return null;
 const lead={};for(const field of LEGACY_FIELDS){if(!Object.hasOwn(body,field))return null;lead[field]=body[field];}
 if(['Name','MobileNumber','Message','EmailId','Title'].some(field=>typeof lead[field]!=='string'))return null;
 if(!lead.Name.trim()||lead.Name.length>100||lead.MobileNumber.length>25||!/^[+\d\s().-]+$/.test(lead.MobileNumber)||lead.MobileNumber.replace(/\D/g,'').length<7||lead.MobileNumber.replace(/\D/g,'').length>15||lead.Message.length>1000||lead.EmailId.length>254||lead.Title!=='Mx')return null;
 if(!Array.isArray(lead.Services)||lead.Services.length!==1||!['Assements - Treatments','Speech Therapy','Occupational Therapy','Behavioral Modification','Special Education'].includes(lead.Services[0]))return null;
 if(!Array.isArray(lead.FacilityIds)||lead.FacilityIds.length!==1||typeof lead.FacilityIds[0]!=='string'||!/^\d{0,30}$/.test(lead.FacilityIds[0]))return null;
 if(!Array.isArray(lead.Languages)||lead.Languages.length!==1||lead.Languages[0]!=='English')return null;
 return {requestId:contract.requestId,lead,source:receiptSource()};
}
export async function payloadDigest(lead){
 const canonical=JSON.stringify(LEGACY_FIELDS.map(field=>[field,lead[field]]));
 return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical)))].map(x=>x.toString(16).padStart(2,'0')).join('');
}

// execute must be a parameterized MySQL execute(sql,params) connection to the
// receiver's EXISTING private database. No customer table is read by this helper.
export function sqlReceiptLedger(execute){
 const select='SELECT request_key AS requestId, payload_digest AS digest, state, receipt_id AS receiptId, lead_reference AS leadReference, claim_token AS claimToken FROM website_enrolment_receipts WHERE request_key = ? LIMIT 1';
 const changed=result=>Number(result.rowsAffected??result.affectedRows??0)===1;
 return {
  async claim(record){
   // A duplicate key is not updated, including when its payload differs.
   await execute('INSERT IGNORE INTO website_enrolment_receipts (request_key,payload_digest,state,receipt_id,claim_token,source_json,created_at_ms,updated_at_ms) VALUES (?,?,\'claimed\',?,?,?,?,?)',[record.requestId,record.digest,record.receiptId,record.claimToken,JSON.stringify(record.source),record.now,record.now]);
   const row=(await execute(select,[record.requestId])).rows?.[0];
   if(!row)throw new Error('receipt-claim-unconfirmed');
   return {owner:row.claimToken===record.claimToken,row};
  },
  async start(requestId,claimToken,now){return changed(await execute('UPDATE website_enrolment_receipts SET state=\'handoff_started\',updated_at_ms=? WHERE request_key=? AND claim_token=? AND state=\'claimed\'',[now,requestId,claimToken]));},
  async accept(requestId,claimToken,leadReference,now){
   if(!changed(await execute('UPDATE website_enrolment_receipts SET state=\'accepted\',lead_reference=?,updated_at_ms=? WHERE request_key=? AND claim_token=? AND state=\'handoff_started\'',[leadReference,now,requestId,claimToken])))throw new Error('receipt-accept-unconfirmed');
   const row=(await execute(select,[requestId])).rows?.[0];
   if(row?.state!=='accepted'||row.leadReference!==leadReference)throw new Error('receipt-readback-unconfirmed');
   return row;
  },
  async uncertain(requestId,claimToken,now){await execute('UPDATE website_enrolment_receipts SET state=\'uncertain\',updated_at_ms=? WHERE request_key=? AND claim_token=? AND state=\'handoff_started\'',[now,requestId,claimToken]);}
 };
}

function accepted(row){
 // The lead join key stays protected between receiver and website Worker.
 return {httpStatus:202,status:'accepted',receipt:{schemaVersion:1,requestId:row.requestId,id:row.receiptId,leadReference:row.leadReference}};
}
const unknown=()=>({httpStatus:503,status:'unknown'});
export async function receiveReceiptEnrolment(body,{idempotencyKey,ledger,handoff,now=Date.now,uuid=()=>crypto.randomUUID()}={}){
 const parsed=parseReceiptEnrolment(body,idempotencyKey);
 if(!parsed)return {httpStatus:422,status:'rejected'};
 // Missing database readiness fails before any handoff. Never fall back to the
 // legacy true response for a versioned request.
 if(!ledger||typeof handoff!=='function')return unknown();
 const digest=await payloadDigest(parsed.lead),claimToken=uuid();let claim;
 try{claim=await ledger.claim({...parsed,digest,claimToken,receiptId:uuid(),now:now()});}catch{return unknown();}
 if(claim.row.digest!==digest)return {httpStatus:409,status:'rejected',reason:'request_key_conflict'};
 if(claim.row.state==='accepted'&&typeof claim.row.leadReference==='string'&&claim.row.leadReference)return accepted(claim.row);
 // Any earlier unfinished claim can have crossed the lead-write boundary.
 // A second call MUST NOT repeat HandleLead, even after a process restart.
 if(!claim.owner)return unknown();
 try{if(!await ledger.start(parsed.requestId,claimToken,now()))return unknown();}catch{return unknown();}
 try{
  const reference=await handoff(parsed.lead);
  if((typeof reference!=='string'&&typeof reference!=='number')||!String(reference).trim()||String(reference).length>100)throw new Error('lead-write-unconfirmed');
  const row=await ledger.accept(parsed.requestId,claimToken,String(reference),now());
  return accepted(row);
 }catch{
  // The lead may have been written before a timeout or failed receipt commit.
  // Preserve the claim for protected reconciliation; never automatically retry.
  try{await ledger.uncertain(parsed.requestId,claimToken,now());}catch{}
  return unknown();
 }
}
