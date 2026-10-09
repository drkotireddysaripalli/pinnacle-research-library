import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import {patchCurrentReceiverBase} from './prepare-current-receiver-base.mjs';
test('base restoration contains no optional notification import or hook and returns unchanged receipt',t=>{
 const sourcePath=process.env.PINNACLE_RECEIVER_SAVED_SOURCE;
 if(!sourcePath){t.skip('Explicit private receiver source required');return;}
 const source=patchCurrentReceiverBase(fs.readFileSync(sourcePath));
 assert(!source.includes('attachWebsiteEnrolmentSlack'));assert(!source.includes('website-enrolment-slack.mjs'));
 assert(source.includes('export {WebsiteEnrolmentReceipts};'));assert(source.includes('organTOSkillMapped'));
 const result={httpStatus:202,status:'accepted',receipt:{schemaVersion:1,requestId:'offline-request-base-0001',id:'offline-receipt-base-0001',leadReference:'lead_v1:123'}};
 const context=vm.createContext({WebsiteReceiptWorkerEntrypoint:class{constructor(){this.env={};this.ctx={waitUntil(){throw Error('No notification expected');}};}},getPSConnection:async()=>{},globalConnection:{execute(){}},globalEnv:null,globalEvent:null,websiteEnrolmentSqlLedger:()=>({}),receiveWebsiteEnrolmentReceipt:async()=>result,readWebsiteEnquiryAnalytics:()=>{}});
 const start=source.indexOf('class WebsiteEnrolmentReceipts extends'),end=source.indexOf('export {WebsiteEnrolmentReceipts};',start);
 const RPC=vm.runInContext(source.slice(start,end)+'\nWebsiteEnrolmentReceipts',context);
 return new RPC().receive({},'offline-invalid-request').then(actual=>assert.equal(actual,result));
});
test('base restoration refuses an unrelated or changed receiver',()=>{
 assert.throws(()=>patchCurrentReceiverBase(Buffer.from('other source')));
});
