import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import fs from 'node:fs';
import {client,origin,helpline,enrol,sourceKey,campaigns,tagged} from '../tests/fixtures/helpline-acquisition-browser.mjs';
import {normaliseAcquisition} from '../public/pinnacle-pages-scripts/enrolment-source.mjs';
import {makePayload,submitEnrolment} from '../public/pinnacle-pages-scripts/enrolment-api.mjs';
import {serveEnrolmentApi} from '../deployment/enrolment-handler.mjs';
import {receiveReceiptEnrolment} from '../deployment/enrolment-receipt.mjs';
import {fixtureLedger} from '../tests/fixtures/enrolment-ledger-sqlite.mjs';
import {HELPLINE_HTML,ANALYTICS_CSP_HASH} from '../../helpline-site/worker.mjs';

const values={name:'ISOLATED FIXTURE',phone:'+91 00000 00000',email:'',service:'help',centre:'',message:''};
const receipt={schemaVersion:1,requestId:'qa-helpline-request',id:'qa-helpline-receipt'};
const eventRows=c=>c.events().filter(e=>e[1]==='enquiry_accepted');
const consentRows=c=>c.commands().filter(e=>e[0]==='consent');

test('generated helpline CSP matches browser-normalised inline analytics',()=>{
 const code=[...HELPLINE_HTML.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(m=>m[1].includes("const id = 'G-H9CLX1WJ7R'")&&m[1].includes('phone_conversion_number'))?.[1];
 assert.equal(typeof code,'string');
 assert.equal(createHash('sha256').update(code.replaceAll('\r\n','\n').replaceAll('\r','\n')).digest('base64'),ANALYTICS_CSP_HASH);
});

test('helpline and enrolment measurement start automatically and ignore retired choice records',()=>{
 const store=new Map([
  ['pinnacle-helpline-measurement-choice-v4',JSON.stringify({value:'declined',at:Date.now()})],
  ['pinnacle-speech-analytics-v1',JSON.stringify({value:'declined',at:Date.now()})]
 ]);
 const h=client({store,search:tagged(campaigns[0])});
 const captured=JSON.parse(store.get(sourceKey));
 assert.equal(captured.fields.utm_campaign,campaigns[0]);
 assert.deepEqual(h.events().map(row=>row[1]),['page_view']);
 const form=client({path:enrol,store});
 assert.deepEqual(form.source(),captured);
 assert(form.events().some(row=>row[1]==='page_view'&&row[2].measurement_mode==='automatic'));
 for(const stream of [h,form]){
  assert.equal(consentRows(stream).length,2);
  assert(consentRows(stream).every(row=>row[2].analytics_storage==='granted'&&row[2].ad_storage==='granted'&&row[2].ad_user_data==='granted'&&row[2].ad_personalization==='denied'));
 }
});

test('accepted attribution uses its submitted snapshot despite a concurrent source or weaker GBP URL',()=>{
 for(const search of ['', '?utm_source=google&utm_medium=organic&utm_campaign=gbp']){
  const now=Date.now(),first=client({search:tagged(campaigns[0]),now});
  const form=client({path:enrol,search,store:first.store,now}),submitted=form.source();
  client({search:tagged(campaigns[1]),store:first.store,now});
  form.accepted(receipt,submitted);
  assert.equal(eventRows(form)[0][2].campaign_name,campaigns[0]);
  assert.equal(eventRows(form)[0][2].measurement_mode,'automatic');
 }
});

test('concurrent Google tabs retain each submitted click and UTM envelope through durable intake',async()=>{
 const clickA='EAIaIQobChMIqaClickEnvelopeSourceA',clickB='EAIaIQobChMIqaClickEnvelopeSourceB';
 const store=new Map(),tagA='?utm_source=google&utm_medium=cpc&utm_campaign=google_tab_a&gclid='+clickA;
 const tagB='?utm_source=google&utm_medium=cpc&utm_campaign=google_tab_b&gclid='+clickB;
 client({path:'/centers',search:tagA,store});
 const submittedA=client({path:enrol,store}).source();
 client({path:'/autism-therapy',search:tagB,store});
 const submittedB=client({path:enrol,store}).source();
 assert.equal(submittedA.fields.gclid,clickA);assert.equal(submittedA.fields.utm_campaign,'google_tab_a');
 assert.equal(submittedB.fields.gclid,clickB);assert.equal(submittedB.fields.utm_campaign,'google_tab_b');
 const f=fixtureLedger(),handoffs=[];
 const env={ENROLMENT_RECEIPT_VERSION:'1',PINNACLE_ENROLMENT_RECEIPTS:{receive:(data,key)=>receiveReceiptEnrolment(data,{idempotencyKey:key,ledger:f.ledger,handoff:async lead=>{handoffs.push(lead);return 'qa_fixture_v1:multi-tab';}})}};
 const fetchImpl=(url,options)=>serveEnrolmentApi(new Request(url,{...options,headers:{...options.headers,origin}}),env);
 const send=(source,suffix)=>submitEnrolment('/api/enrolment',makePayload(values,'qa-multi-tab-'+suffix,source),{origin,fetchImpl,receiptRequired:true});
 try{
  const [a,b]=await Promise.all([send(submittedA,'source-a'),send(submittedB,'source-b')]);
  assert.equal(a.state,'accepted');assert.equal(b.state,'accepted');assert.equal(handoffs.length,2);
  const rows=f.db.prepare('SELECT request_key, source_json FROM website_enrolment_receipts ORDER BY request_key').all();
  const persisted=Object.fromEntries(rows.map(row=>[row.request_key,JSON.parse(row.source_json).acquisition]));
  assert.deepEqual(persisted['qa-multi-tab-source-a'],submittedA);assert.deepEqual(persisted['qa-multi-tab-source-b'],submittedB);
  assert.equal(JSON.parse(store.get(sourceKey)).fields.gclid,clickB);
 }finally{f.close();}
});

for(const campaign of campaigns){
 test(campaign+' keeps the original source through isolated durable intake exactly once',async()=>{
  const first=client({search:tagged(campaign)}),captured=JSON.parse(first.store.get(sourceKey));
  first.advance(5000);client({search:tagged(campaign),store:first.store,now:captured.capturedAt+5000});
  assert.deepEqual(JSON.parse(first.store.get(sourceKey)),captured);
  const form=client({path:enrol,store:first.store,now:captured.capturedAt+6000});
  assert.deepEqual(form.source(),captured);
  const config=form.commands().find(row=>row[0]==='config'&&row[1]==='G-2BYLRLFRDJ')?.[2];
  assert.equal(config.campaign_name,campaign);assert.equal(config.cookie_prefix,'ps');assert.equal(config.cookie_path,'/');
  const f=fixtureLedger();let handoffs=0;
  const payload=makePayload(values,'qa-chatgpt-'+randomUUID(),form.source());
  const env={ENROLMENT_RECEIPT_VERSION:'1',PINNACLE_ENROLMENT_RECEIPTS:{receive:(data,key)=>receiveReceiptEnrolment(data,{idempotencyKey:key,ledger:f.ledger,handoff:async lead=>{handoffs++;assert.deepEqual(lead.FacilityIds,['']);return 'qa_fixture_v1:helpline-only';}})}};
  const fetchImpl=(url,options)=>serveEnrolmentApi(new Request(url,{...options,headers:{...options.headers,origin}}),env);
  const send=data=>submitEnrolment('/api/enrolment',data,{origin,fetchImpl,receiptRequired:true});
  try{
   const concurrent=await Promise.all(Array.from({length:10},()=>send(payload)));
   assert(concurrent.some(result=>result.state==='accepted'));assert.equal(handoffs,1);
   const result=await send(payload);assert.equal(result.state,'accepted');assert.equal(handoffs,1);
   form.accepted(result.receipt,payload.source.acquisition);form.accepted(result.receipt,payload.source.acquisition);
   const row=f.db.prepare('SELECT * FROM website_enrolment_receipts').get();
   assert.equal(row.state,'accepted');assert.equal(row.lead_reference,'qa_fixture_v1:helpline-only');assert.deepEqual(JSON.parse(row.source_json).acquisition,captured);
   const changed=structuredClone(payload);changed.preferences.service='speech';assert.equal((await send(changed)).state,'rejected');assert.equal(handoffs,1);
   const other=structuredClone(payload);other.source.acquisition.fields.utm_campaign=campaigns.find(value=>value!==campaign);
   assert.equal((await send(other)).receipt.id,result.receipt.id);assert.deepEqual(JSON.parse(f.db.prepare('SELECT source_json FROM website_enrolment_receipts').get().source_json).acquisition,captured);
   assert.equal(eventRows(form).length,1);const event=eventRows(form)[0][2];
   assert.equal(event.campaign_source,'chatgpt');assert.equal(event.campaign_medium,'paid');assert.equal(event.campaign_name,campaign);
   assert.equal(event.page_group,'enrolment');assert.equal(event.destination,'existing_enrolment_workflow');assert.equal(event.measurement_mode,'automatic');assert.equal(event.send_to,'G-2BYLRLFRDJ');
   for(const excluded of [payload.requestId,result.receipt.id,row.lead_reference,values.name,values.phone,'G-H9CLX1WJ7R'])assert(!JSON.stringify(eventRows(form)).includes(excluded));
  }finally{f.close();}
 });
}

test('source expiry, QA labelling and optional storage failure cannot supply attribution',()=>{
 const expired=client({search:tagged(campaigns[0])});const stale=JSON.parse(expired.store.get(sourceKey));stale.capturedAt-=31*86400000;expired.store.set(sourceKey,JSON.stringify(stale));
 assert.equal(client({path:enrol,store:expired.store}).source(),null);
 const mainExpiry=client({search:tagged(campaigns[0])});const later=client({path:enrol,store:mainExpiry.store});later.advance(31*86400000);assert.equal(later.source(),null);
 const qa=client({search:tagged(campaigns[0])+'&validation_test=1'});assert.equal(qa.store.has(sourceKey),false);assert.equal(qa.commands().length,0);
 const storage=client({search:tagged(campaigns[0]),sourceStorageFailure:true});assert.equal(storage.store.has(sourceKey),false);assert.deepEqual(storage.events().map(row=>row[1]),['page_view']);
 for(const source of [qa.source(),storage.source(),later.source()])assert(!makePayload(values,'qa-source-unknown',source).source.acquisition);
});

test('automatic measurement remains active when a browser exposes GPC',()=>{
 const h=client({search:tagged(campaigns[0]),gpc:true});assert(h.store.has(sourceKey));assert.deepEqual(h.events().map(row=>row[1]),['page_view']);
 const form=client({path:enrol,store:h.store,gpc:true});assert.equal(form.source().fields.utm_campaign,campaigns[0]);form.accepted(receipt);assert.equal(eventRows(form)[0][2].measurement_mode,'automatic');
});

test('helpline rejects partial, duplicate, wrong, additional and malformed campaign fields',()=>{
 for(const search of ['?utm_source=chatgpt','?utm_source=google&utm_medium=paid&utm_campaign='+campaigns[0],tagged('unapproved'),tagged(campaigns[0])+'&utm_source=chatgpt',tagged(campaigns[0])+'&utm_medium=paid',tagged(campaigns[0])+'&utm_campaign='+campaigns[1],tagged(campaigns[0])+'&gclid=excluded',tagged(campaigns[0])+'&oppref=excluded',tagged(campaigns[0])+'&utm_term=excluded',tagged(campaigns[0])+'&utm_unknown=excluded',tagged(campaigns[0]).replace('chatgpt','%20chatgpt')]){
  const h=client({search});assert(!h.store.has(sourceKey),search);assert(!JSON.stringify(h.events()).includes('excluded'),search);
 }
 const h=client({search:tagged(campaigns[0])+'&child_name=DO_NOT_EXPORT'});assert(!JSON.stringify([...h.store]).includes('DO_NOT_EXPORT'));
});

test('shared validator drops invalid optional sources without blocking valid intake',async()=>{
 const f=fixtureLedger();let handoffs=0;
 const source={schemaVersion:1,consent:'analytics_accepted',capturedAt:Date.now(),landingPath:helpline,fields:{utm_source:'chatgpt',utm_medium:'paid',utm_campaign:campaigns[0]}};
 try{
  for(const invalid of [{...source,landingPath:helpline+'/private'},{...source,fields:{...source.fields,gclid:'no'}},{...source,fields:{...source.fields,utm_campaign:'no'}},{...source,fields:{utm_source:'chatgpt'}},{...source,capturedAt:Date.now()-31*86400000}]){
   assert.equal(normaliseAcquisition(invalid),null);const payload=makePayload(values,'qa-invalid-'+randomUUID(),null);payload.source.acquisition=invalid;
   const result=await serveEnrolmentApi(new Request(origin+'/api/enrolment',{method:'POST',headers:{origin,'content-type':'application/json','idempotency-key':payload.requestId},body:JSON.stringify(payload)}),{ENROLMENT_RECEIPT_VERSION:'1',PINNACLE_ENROLMENT_RECEIPTS:{receive:(data,key)=>receiveReceiptEnrolment(data,{idempotencyKey:key,ledger:f.ledger,handoff:async()=>{handoffs++;return 'qa_fixture_v1:source-unknown';}})}});
   assert.equal(result.status,202);const row=f.db.prepare('SELECT source_json FROM website_enrolment_receipts WHERE request_key=?').get(payload.requestId);assert(!JSON.parse(row.source_json).acquisition);
  }
  assert.equal(handoffs,5);
 }finally{f.close();}
});

test('new paid source and GBP precedence remain atomic; direct navigation retains capture time',()=>{
 const store=new Map();client({path:'/centers',search:'?utm_source=google&utm_medium=cpc&utm_campaign=prior&gclid=qaPriorClick',store});
 client({store,search:tagged(campaigns[0])});const expected=JSON.parse(store.get(sourceKey));
 const gbp=client({path:'/centers',store,search:'?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=suchitra'});assert.deepEqual(gbp.source(),expected);
 const direct=client({path:enrol,store});assert.deepEqual(direct.source(),expected);
 const freshGoogle=client({path:'/centers',store,search:'?utm_source=google&utm_medium=cpc&utm_campaign=current&gclid=qaCurrentClick'});assert.equal(freshGoogle.source().fields.gclid,'qaCurrentClick');assert.equal(freshGoogle.source().fields.utm_source,'google');
});

test('callback is a plain enrolment link, eight phone actions remain, and choice UI is absent',()=>{
 const html=fs.readFileSync('../helpline-site/page.html','utf8');assert(html.includes('data-helpline-callback href="'+enrol+'"'));
 const calls=[...html.matchAll(/<a\b[^>]*data-call-placement="([^"]+)"[^>]*>/g)];
 assert.equal(calls.length,8);assert.equal(new Set(calls.map(match=>match[1])).size,8);assert(calls.every(match=>match[0].includes('href="tel:+919100181181"')));
 for(const token of ['data-analytics-choice','data-analytics-panel','both choices','Allow analytics','Keep analytics off'])assert.equal(html.includes(token),false,token);
});
