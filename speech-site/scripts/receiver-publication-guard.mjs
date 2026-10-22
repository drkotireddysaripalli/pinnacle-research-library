import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {init,parse} from 'es-module-lexer';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export const APPROVED_INVOICE_FUNCTION_SHA256='1838a1f148167ba4f1b30ceafc35e91e99c57b837f238225483796df41b715cf';
export function invoiceSpan(bytes){
 const startToken=Buffer.from('async function GetAllUsers('),endToken=Buffer.from('\n__name(GetAllUsers, "GetAllUsers");');
 const start=bytes.indexOf(startToken),end=bytes.indexOf(endToken,start);
 assert(start>=0&&end>start,'Invoice function boundary missing');
 assert.equal(bytes.indexOf(startToken,start+startToken.length),-1,'Duplicate invoice function');
 assert.equal(bytes.indexOf(endToken,end+endToken.length),-1,'Duplicate invoice marker');
 return {start,end,body:bytes.subarray(start,end)};
}
export function assertInvoiceFunction(bytes){
 const span=invoiceSpan(bytes);assert.equal(sha(span.body),APPROVED_INVOICE_FUNCTION_SHA256,'Approved invoice optimization changed or missing');
 return {functionSHA256:sha(span.body)};
}
export async function assertReceiverExports(entries,baseline){
 await init;const modules=new Map(entries.map(m=>[m.name,m.bytes]));const current=modules.get('index.js');assert(current,'Receiver index.js missing');
 const [,oldExports]=parse(baseline.toString()),[,nextExports]=parse(current.toString());
 const names=new Set(nextExports.map(x=>x.n));
 for(const name of new Set(['default','WebsiteEnrolmentReceipts',...oldExports.map(x=>x.n)]))assert(names.has(name),'Missing receiver export: '+name);
 const seen=new Set();function visit(name){if(seen.has(name))return;seen.add(name);const bytes=modules.get(name);assert(bytes,'Missing receiver module: '+name);for(const item of parse(bytes.toString())[0])if(item.n?.startsWith('.')){const target=path.posix.normalize(path.posix.join(path.posix.dirname(name),item.n));assert(!target.startsWith('../'),'Module escapes receiver bundle');visit(target);}}
 visit('index.js');return {exports:[...names].sort(),referencedModules:[...seen].sort()};
}
export async function assertReceiverPublication(entries,baseline){
 const exports=await assertReceiverExports(entries,baseline),invoice=assertInvoiceFunction(entries.find(m=>m.name==='index.js').bytes);
 return {status:'passed',...exports,...invoice};
}
