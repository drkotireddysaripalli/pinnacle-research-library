import {test} from 'node:test';import assert from 'node:assert/strict';
import {readReceiptLinks,RECEIPT_LINK_SQL} from '../deployment/enrolment-outcomes.mjs';
test('bounded exact intake joins omit customer fields and use bind parameters',async()=>{
 let call;const r=await readReceiptLinks(async(sql,params)=>{call={sql,params};return {rows:[{receiptId:'opaque-receipt',createdAtMs:1000,linkStatus:'linked',operationalStatusNow:'ENROLED',personId:123,Name:'private',MobileNumber:'private'}]}},{startMs:0,endMs:86400000,limit:1});
 assert.equal(call.sql,RECEIPT_LINK_SQL);assert.deepEqual(call.params,[0,86400000,2]);assert.equal(r.rows[0].admission,'unknown');assert.equal(r.rows[0].operationalStatusNow,'ENROLED');assert(!JSON.stringify(r).includes('private'));assert(!('personId' in r.rows[0]));
});
test('empty production cohort stays empty rather than reporting false conversions',async()=>{const r=await readReceiptLinks(async()=>({rows:[]}),{startMs:0,endMs:86400000});assert.deepEqual(r.rows,[]);assert.equal(r.truncated,false);});
test('oversized or invalid cohorts fail before database access',async()=>{let calls=0;const run=async()=>{calls++;return {rows:[]}};for(const o of [{startMs:0,endMs:32*86400000},{startMs:0,endMs:86400000,limit:101},{startMs:'0 OR 1=1',endMs:86400000},{startMs:1,endMs:0}])await assert.rejects(readReceiptLinks(run,o),TypeError);assert.equal(calls,0);});
test('extra row reports truncation and does not invent extra receipts',async()=>{const r=await readReceiptLinks(async()=>({rows:[{receiptId:'a',createdAtMs:1,linkStatus:'missing_person'},{receiptId:'b',createdAtMs:2}]}),{startMs:0,endMs:86400000,limit:1});assert(r.truncated);assert.equal(r.rows.length,1);assert.equal(r.rows[0].qualification,'unknown');});
