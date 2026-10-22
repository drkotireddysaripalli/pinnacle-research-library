import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {normaliseReferrerOrigin,originOnlyAcquisition} from '../public/pinnacle-pages-scripts/enquiry-referrer.mjs';
import {normaliseAcquisition} from '../public/pinnacle-pages-scripts/enrolment-source.mjs';
import {makePayload} from '../public/pinnacle-pages-scripts/enrolment-api.mjs';
import {makeContactPayload} from '../public/pinnacle-pages-scripts/contact-api.mjs';
import {CONTACT_FACILITIES} from '../public/pinnacle-pages-scripts/contact-options.mjs';
import {toLegacyContact,toReceiptContact} from '../deployment/contact-handler.mjs';
import {parseReceiptContact} from '../deployment/contact-receipt-contract.mjs';
import {toReceiptEnrolment,receiveReceiptEnrolment,parseReceiptEnrolment} from '../deployment/enrolment-receipt.mjs';
import {readEnquiryAnalytics,ENQUIRY_ANALYTICS_COUNTS_SQL} from '../deployment/enrolment-analytics.mjs';
import {fixtureLedger} from '../tests/fixtures/enrolment-ledger-sqlite.mjs';
import {collector} from '../tests/fixtures/origin-collector.mjs';
const root='https://www.pinnacleblooms.org',helpline='/national-autism-helpline',enrol='/enroll-autism-speech-aba-therapies-india';
const shared=fs.readFileSync(new URL('../public/pinnacle-pages-scripts/speech-measurement.js',import.meta.url),'utf8');
const phone=fs.readFileSync(new URL('../../helpline-site/phone-analytics.js',import.meta.url),'utf8');
const at=Date.now();
const refSource=()=>({schemaVersion:1,consent:'analytics_accepted',capturedAt:at,landingPath:helpline,fields:{},referrerOrigin:'https://chatgpt.com'});
const campaign=()=>({...refSource(),fields:{utm_source:'chatgpt',utm_medium:'paid',utm_campaign:'pinnacle_vizag_call_enquiries'},referrerOrigin:undefined});
test('public referrer becomes origin only; private path/query/fragment are never retained',()=>{
 assert.equal(normaliseReferrerOrigin('https://ChatGPT.com/c/private-question?email=private%40example.com#secret'),'https://chatgpt.com');
 assert.equal(normaliseReferrerOrigin('https://chatgpt.com.:443/c/private'),'https://chatgpt.com');
 assert.equal(normaliseReferrerOrigin('http://search.example.org/path?q=private'),'http://search.example.org');
});
test('reject credentials, nondefault ports, invalid protocols and ambiguous input',()=>{
 for(const value of ['https://user:pass@chatgpt.com/x','https://user@chatgpt.com','https://chatgpt.com:8443/a','ftp://chatgpt.com/','data:text/html,private','//chatgpt.com/a','https:\\chatgpt.com','https://chatgpt.com\n/x','x'.repeat(8193),null])assert.equal(normaliseReferrerOrigin(value),null,String(value));
});
test('reject IP literals including parser-normalized numeric forms and local namespaces',()=>{
 for(const host of ['127.0.0.1','10.0.0.1','192.168.1.1','169.254.169.254','8.8.8.8','2130706433','0x7f000001','127.1','[::1]','[2001:4860:4860::8888]','localhost','localhost.','router','service.local','x.internal','x.localhost','x.lan','x.home','x.invalid','x.test','x.example','x.onion','x.arpa','x.intranet','x.corp'])assert.equal(normaliseReferrerOrigin('https://'+host+'/private'),null,host);
 assert.equal(normaliseReferrerOrigin('https://internalmedicine.org/path'),'https://internalmedicine.org');
});
test('own site, subdomains and trailing-dot aliases cannot masquerade as referrals',()=>{
 for(const h of ['www.pinnacleblooms.org','pinnacleblooms.org','pinnacleblooms.org.','materials.pinnacleblooms.org'])assert.equal(normaliseReferrerOrigin('https://'+h+'/x'),null,h);
 assert.equal(normaliseReferrerOrigin('https://pinnacleblooms.org.other.org/'),'https://pinnacleblooms.org.other.org');
});
test('empty fields require an exact validated origin, never a raw referrer URL',()=>{
 assert.deepEqual(normaliseAcquisition(refSource()),refSource());
 for(const value of [{...refSource(),referrerOrigin:undefined},{...refSource(),referrerOrigin:'https://chatgpt.com/private?x=1'},{...refSource(),referrerOrigin:'http://localhost'}])assert.equal(normaliseAcquisition(value),null);
 assert.equal(normaliseAcquisition({...refSource(),capturedAt:at-31*86400000}),null);
});
test('explicit campaign survives invalid optional origin and is not relabelled',()=>{
 const s=campaign();delete s.referrerOrigin;
 assert.deepEqual(normaliseAcquisition({...s,referrerOrigin:'http://127.0.0.1/private'}),s);
});
test('prior campaign/referrer source and its capture time win over later referrer-only arrival',()=>{
 const prior=campaign();delete prior.referrerOrigin;
 assert.equal(originOnlyAcquisition(prior,'https://chatgpt.com/c/other','/centers'),prior);
 assert.equal(originOnlyAcquisition(refSource(),'https://search.example.org/','/centers').capturedAt,at);
 assert.equal(originOnlyAcquisition(null,'','/centers'),null);
});
test('main collector captures origin and keeps it across navigation/direct return without extra GA parameters',()=>{
 const h=collector(shared,{url:root+'/centers',referrer:'https://chatgpt.com/c/private?query=secret'});const original=h.source();
 assert.equal(original.referrerOrigin,'https://chatgpt.com');assert.deepEqual(original.fields,{});
 const next=collector(shared,{url:root+enrol,referrer:root+'/centers',store:h.store});assert.deepEqual(next.source(),original);
 assert(next.commands().some(c=>c[0]==='config'&&c[1]==='G-2BYLRLFRDJ'));
 assert(!JSON.stringify(next.commands()).includes('referrerOrigin'));assert(!JSON.stringify(h.source()).includes('private'));
});
test('helpline collector uses its own stream and origin persists into the main form',()=>{
 const h=collector(phone,{url:root+helpline,referrer:'https://chatgpt.com/c/private'});const original=h.source();
 assert.equal(original.referrerOrigin,'https://chatgpt.com');assert.equal(original.landingPath,helpline);
 assert(h.commands().some(c=>c[0]==='config'&&c[1]==='G-H9CLX1WJ7R'));
 const next=collector(shared,{url:root+enrol,referrer:root+helpline,store:h.store});assert.deepEqual(next.source(),original);
 assert(!JSON.stringify(h.commands()).includes('referrerOrigin'));assert(!JSON.stringify(next.commands()).includes('campaign_source\",\"chatgpt'));
});
test('both collectors preserve explicit UTM priority and prior paid source',()=>{
 for(const [script,path]of [[shared,'/centers'],[phone,helpline]]){
  const h=collector(script,{url:root+path+'?utm_source=google&utm_medium=cpc&utm_campaign=valid_campaign',referrer:'https://chatgpt.com/c/private'});const first=h.source();
  assert.equal(first.fields.utm_source,'google');assert(!Object.hasOwn(first,'referrerOrigin'));
  const second=collector(script,{url:root+path,referrer:'https://search.example.org/private',store:h.store});assert.deepEqual(second.source(),first);
 }
});
test('direct, same-origin and invalid origins remain unknown in each collector',()=>{
 for(const [script,path]of [[shared,'/centers'],[phone,helpline]])for(const referrer of ['',root+'/x','http://localhost/private','https://user@chatgpt.com/x'])assert.equal(collector(script,{url:root+path,referrer}).source(),null,referrer);
});
test('origin is carried through both existing private form contracts',()=>{
 const a=refSource(),p=makePayload({name:'OFFLINE FIXTURE',phone:'0000000000',email:'',service:'speech',centre:'',message:''},'offline-origin-enrol',a);
 const b=toReceiptEnrolment({FormType:'Enroll',Name:p.contact.name,MobileNumber:p.contact.phone,Message:'',EmailId:'',Services:['Speech Therapy'],FacilityIds:[''],Title:'Mx',Languages:['English']},p.requestId,p.source);
 assert.deepEqual(parseReceiptEnrolment(b,p.requestId).source.acquisition,a);
 const c=makeContactPayload({name:'OFFLINE FIXTURE',title:'Mx',phone:'0000000000',email:'offline@example.invalid',facilityId:CONTACT_FACILITIES[0],subject:'Therapy Services',message:'Offline fixture'},'offline-origin-contact',a);
 assert.deepEqual(parseReceiptContact(toReceiptContact(toLegacyContact(c),c.requestId,c.source),c.requestId,normaliseAcquisition,CONTACT_FACILITIES).source.acquisition,a);
});
test('durable replay retains first origin; conflicting payload never creates another intake',async()=>{
 const f=fixtureLedger();try{
  const key='offline-origin-replay',lead={FormType:'Enroll',Name:'OFFLINE FIXTURE',MobileNumber:'0000000000',Message:'offline',EmailId:'',Services:['Speech Therapy'],FacilityIds:[''],Title:'Mx',Languages:['English']};
  const b=toReceiptEnrolment(lead,key,{acquisition:refSource()});let writes=0;const opts={idempotencyKey:key,ledger:f.ledger,handoff:async()=>{writes++;return 'lead_v1:1';}};
  const first=await receiveReceiptEnrolment(b,opts);assert.equal(first.status,'accepted');
  const second=await receiveReceiptEnrolment(toReceiptEnrolment(lead,key,{acquisition:{...refSource(),referrerOrigin:'https://search.example.org'}}),opts);assert.equal(second.receipt.id,first.receipt.id);assert.equal(writes,1);
  assert.equal(JSON.parse(f.db.prepare('SELECT source_json FROM website_enrolment_receipts').get().source_json).acquisition.referrerOrigin,'https://chatgpt.com');
  assert.equal((await receiveReceiptEnrolment({...b,Message:'conflict'},opts)).httpStatus,409);assert.equal(writes,1);
 }finally{f.close();}
});
test('private projection distinguishes observed origin, manual campaign and unknown without inferring paid/genuine',async()=>{
 const raw=[refSource(),campaign(),null].map((a,i)=>({receiptId:'offline-'+i,leadReference:'lead_v1:'+i,state:'accepted',createdAtMs:at,sourceJson:JSON.stringify({acquisition:a})}));
 const result=await readEnquiryAnalytics(async sql=>sql===ENQUIRY_ANALYTICS_COUNTS_SQL?{rows:[{state:'accepted',receiptCount:3,enquiryAccepted:3}]}:{rows:raw},{startMs:at,endMs:at+1});
 assert.deepEqual(result.rows.map(r=>r.sourceStatus),['observed_referrer','permitted_campaign','unknown']);assert.equal(result.rows[0].referrerOrigin,'https://chatgpt.com');assert.equal(result.rows[1].referrerOrigin,null);assert.equal(result.rows[0].qualification,'unknown');assert.equal(result.rows[0].googleDelivery,'unknown');
});
