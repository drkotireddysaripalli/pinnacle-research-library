import test from 'node:test';import assert from 'node:assert/strict';import {additiveReceiptRecovery} from './additive-receipt-recovery.mjs';
const core='async function HandleLead(FIds, wholeLog) {\n return true;\n}\n';
const current='export const Organs={};\n'+core+'__name(HandleLead, "HandleLead");\nexport default {};';
const lines='\n      if (websiteReceiptWrite && gReach?.[0]?.Id) websiteReceiptWrite.reference = "peoplenote_v1:" + gReach[0].Id;\n'+Array(3).fill('      if (websiteReceiptWrite && createdLead?.[0]?.Id) websiteReceiptWrite.reference = "lead_v1:" + createdLead[0].Id;\n').join('');
const oldCore=core.replace('wholeLog) {','wholeLog, websiteReceiptWrite) {').replace(' return true;',lines+' return true;');
const previous='import {WorkerEntrypoint as WebsiteReceiptWorkerEntrypoint} from "cloudflare:workers";\nimport {} from "./website-enrolment-receipt.mjs";\nimport {} from "./website-enrolment-analytics.mjs";\n'+oldCore+'__name(HandleLead, "HandleLead");\n// Private service-binding RPC only; no new public fetch handler.\nclass WebsiteEnrolmentReceipts {async receive(){await HandleLead();await HandleLead();}}\nexport {WebsiteEnrolmentReceipts};';
test('additive receipt recovery preserves all current staff bytes and fails on changed write scope',()=>{
 const result=additiveReceiptRecovery(current,previous);assert(result.candidate.startsWith(current));assert(result.candidate.includes('async function HandleWebsiteReceiptLead('));assert.equal(result.proof.currentStaffSourceUnchanged,true);assert.throws(()=>additiveReceiptRecovery(current.replace('return true','return false'),previous));assert.throws(()=>additiveReceiptRecovery(current+'\nclass WebsiteEnrolmentReceipts {}',previous));
});
