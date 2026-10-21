import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const sha=s=>createHash('sha256').update(s).digest('hex');
const span=(source,name)=>{const start=source.indexOf('async function '+name+'('),end=source.indexOf('__name('+name+', "'+name+'");',start);assert(start>=0&&end>start,name+' boundary');return {start,end,text:source.slice(start,end)};};
export function additiveReceiptRecovery(current,previous){
 assert(!current.includes('WebsiteEnrolmentReceipts'),'Receipt entrypoint already exists');
 const imports=previous.split('\n').slice(0,3).join('\n');
 assert(imports.startsWith('import {WorkerEntrypoint as WebsiteReceiptWorkerEntrypoint} from "cloudflare:workers";'));
 const old=span(previous,'HandleLead').text,now=span(current,'HandleLead').text;
 const uninstrumented=old.replace(', websiteReceiptWrite) {',') {').replace(/^\s*if \(websiteReceiptWrite && (?:gReach|createdLead)\?\.\[0\]\?\.Id\) websiteReceiptWrite\.reference = "(?:peoplenote_v1:|lead_v1:)" \+ (?:gReach|createdLead)\[0\]\.Id;\n/gm,'');
 assert.equal(uninstrumented,now,'Current staff lead handler diverged from the previously verified capture boundaries');
 assert.equal((old.match(/websiteReceiptWrite\.reference =/g)||[]).length,4);
 const clone=old.replace('async function HandleLead(','async function HandleWebsiteReceiptLead(');
 const marker='// Private service-binding RPC only; no new public fetch handler.';const at=previous.indexOf(marker);assert(at>=0);let entry=previous.slice(at);
 assert(entry.includes('export {WebsiteEnrolmentReceipts};'));
 assert.equal((entry.match(/await HandleLead\(/g)||[]).length,2);entry=entry.replaceAll('await HandleLead(','await HandleWebsiteReceiptLead(');
 const candidate=current+'\n'+imports+'\n'+clone+'\n'+entry;
 assert(candidate.startsWith(current));
 return {candidate,proof:{mode:'additive',originalBytes:Buffer.byteLength(current),originalSha256:sha(current),candidateSha256:sha(candidate),currentStaffSourceUnchanged:true,clonedHandlerMatchesPreviouslyVerifiedInstrumentation:true,addedEntry:'WebsiteEnrolmentReceipts',existingExports:['Organs','default','organTOSkillMapped']}};
}
