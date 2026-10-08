import test from 'node:test';import assert from 'node:assert/strict';
import {readEnquiryAnalytics,ENQUIRY_ANALYTICS_SQL} from '../deployment/enrolment-analytics.mjs';
test('owned business projection uses the durable state, exact IDs and no contact fields',async()=>{
 let call;const result=await readEnquiryAnalytics(async(sql,params)=>{call={sql,params};return {rows:[
  {receiptId:'opaque-accepted',leadReference:'lead_v1:123',state:'accepted',createdAtMs:1,updatedAtMs:2,sourceJson:'{}',Name:'private',MobileNumber:'private'},
  {receiptId:'opaque-uncertain',state:'uncertain',createdAtMs:3,updatedAtMs:4,sourceJson:'{}'},
  {receiptId:'opaque-unconfirmed',state:'accepted',createdAtMs:5,updatedAtMs:6,sourceJson:'{}'}]};},{startMs:0,endMs:86400000});
 assert.equal(call.sql,ENQUIRY_ANALYTICS_SQL);assert.deepEqual(call.params,[0,86400000,1001]);
 assert.equal(result.counts.enquiryAccepted,1);assert.equal(result.counts.uncertain,1);
 assert.equal(result.rows[0].sourceStatus,'unknown');assert.equal(result.rows[0].googleDelivery,'unknown');
 assert(!JSON.stringify(result).includes('private'));assert.equal(result.rows[1].event,null);
});
test('projection validates optional sources rather than promoting arbitrary JSON',async()=>{
 const acquisition={schemaVersion:1,consent:'analytics_accepted',capturedAt:Date.now(),landingPath:'/centers',fields:{utm_source:'google',utm_medium:'cpc'}};
 const result=await readEnquiryAnalytics(async()=>({rows:[{receiptId:'a',leadReference:'lead_v1:123',state:'accepted',sourceJson:JSON.stringify({acquisition})},{receiptId:'b',leadReference:'lead_v1:124',state:'accepted',sourceJson:JSON.stringify({acquisition:{...acquisition,fields:{name:'private-child'}}})}]}),{startMs:0,endMs:86400000});
 assert.equal(result.counts.acceptedWithPermittedCampaign,1);assert.deepEqual(result.rows[0].acquisition,acquisition);assert.equal(result.rows[1].acquisition,null);
});
test('empty, unavailable and truncated reports remain explicit',async()=>{
 const empty=await readEnquiryAnalytics(async()=>({rows:[]}),{startMs:0,endMs:86400000});assert.equal(empty.counts.enquiryAccepted,0);assert.equal(empty.truncated,false);
 await assert.rejects(readEnquiryAnalytics(async()=>{throw Error('unavailable');},{startMs:0,endMs:86400000}),/unavailable/);
 const truncated=await readEnquiryAnalytics(async()=>({rows:[{receiptId:'a',state:'uncertain'},{receiptId:'b',state:'claimed'}]}),{startMs:0,endMs:86400000,limit:1});assert.equal(truncated.truncated,true);assert.equal(truncated.rows.length,1);
});
test('invalid cohorts stop before database access',async()=>{
 let calls=0;for(const args of [{startMs:'0',endMs:86400000},{startMs:0,endMs:32*86400000},{startMs:1,endMs:0},{startMs:0,endMs:86400000,limit:1001}])await assert.rejects(readEnquiryAnalytics(async()=>{calls++;return {rows:[]};},args),TypeError);assert.equal(calls,0);
});
