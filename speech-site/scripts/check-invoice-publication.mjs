import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
import {assertReceiverPublication,invoiceSpan} from './receiver-publication-guard.mjs';
const [folder,candidateDirectory]=process.argv.slice(2);assert(folder&&candidateDirectory,'Pass prepared release folder and reviewed candidate directory');
const out=path.resolve(folder),dir=path.resolve(candidateDirectory),site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site),sha=b=>createHash('sha256').update(b).digest('hex');
const receipt=JSON.parse(await fs.readFile(path.join(out,'release.json'),'utf8'));assert(receipt.restoreInvoice&&receipt.phase==='prepared');
const original=await fs.readFile(path.join(out,'captured/index.js')),candidate=await fs.readFile(path.join(dir,'index.js'));
const patch=JSON.parse(await fs.readFile(path.join(dir,'patch-receipt.json'),'utf8'));assert.equal(sha(original),patch.inputSha256);assert.equal(sha(candidate),patch.candidateSha256);
const oldSpan=invoiceSpan(original),newSpan=invoiceSpan(candidate);assert(original.subarray(0,oldSpan.start).equals(candidate.subarray(0,newSpan.start)));assert(original.subarray(oldSpan.end).equals(candidate.subarray(newSpan.end)));
const entries=await Promise.all(Object.keys(receipt.originalHashes).map(async name=>({name,bytes:name==='index.js'?candidate:await fs.readFile(path.join(out,'captured',name))})));
const guard=await assertReceiverPublication(entries,original);
let invalidOriginalRejectedBeforeUpload=false;
try{await assertReceiverPublication(entries.map(m=>m.name==='index.js'?{name:m.name,bytes:original}:m),original);}catch(error){assert.match(error.message,/invoice optimization/);invalidOriginalRejectedBeforeUpload=true;}
assert(invalidOriginalRejectedBeforeUpload);
const log=execFileSync(process.execPath,['--test','scripts/test-receiver-publication-guard.mjs'],{cwd:site,encoding:'utf8'});await fs.writeFile(path.join(out,'guard-tests.log'),log,{mode:0o600});
execFileSync(process.execPath,['--check',path.join(dir,'index.js')]);
const files=['scripts/release-public-template-protection.mjs','scripts/receiver-publication-guard.mjs','scripts/check-invoice-publication.mjs','scripts/test-receiver-publication-guard.mjs','package.json','package-lock.json'];
const sourceInputs=Object.fromEntries(await Promise.all(files.map(async name=>[name,sha(await fs.readFile(path.join(site,name)))])));
const proof={status:'passed',at:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim(),originalSha256:sha(original),candidateSha256:sha(candidate),allOtherBytesPreserved:true,invalidOriginalRejectedBeforeUpload,guard,sourceInputs,log:path.join(out,'guard-tests.log'),logSHA256:sha(log),reusedReview:path.join(dir,'independent-review.json'),reusedReviewSHA256:sha(await fs.readFile(path.join(dir,'independent-review.json'))),reusedEquivalenceTestReceipt:path.join(dir,'../preparation-receipt.json'),reusedEquivalenceTestReceiptSHA256:sha(await fs.readFile(path.join(dir,'../preparation-receipt.json')))};
await fs.writeFile(path.join(out,'invoice-acceptance.json'),JSON.stringify(proof,null,2)+'\n',{mode:0o600});console.log(JSON.stringify({status:proof.status,guard,invalidOriginalRejectedBeforeUpload,allOtherBytesPreserved:true}));
