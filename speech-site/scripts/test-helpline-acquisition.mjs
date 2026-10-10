import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import fs from 'node:fs';
import {client,origin,helpline,enrol,sourceKey,helplineKey,mainKey,campaigns,tagged} from '../tests/fixtures/helpline-acquisition-browser.mjs';
import {normaliseAcquisition} from '../public/pinnacle-pages-scripts/enrolment-source.mjs';
import {makePayload,submitEnrolment} from '../public/pinnacle-pages-scripts/enrolment-api.mjs';
import {serveEnrolmentApi} from '../deployment/enrolment-handler.mjs';
import {receiveReceiptEnrolment} from '../deployment/enrolment-receipt.mjs';
import {fixtureLedger} from '../tests/fixtures/enrolment-ledger-sqlite.mjs';
import {HELPLINE_HTML,ANALYTICS_CSP_HASH} from '../../helpline-site/worker.mjs';
const accepted={value:'accepted',at:Date.now()},values={name:'ISOLATED FIXTURE',phone:'+91 00000 00000',email:'',service:'help',centre:'',message:''};
const receipt={schemaVersion:1,requestId:'qa-helpline-request',id:'qa-helpline-receipt'};
const eventRows=c=>c.events().filter(e=>e[1]==='enquiry_accepted');
test('generated helpline CSP matches browser-normalised inline analytics',()=>{
 const code=[...HELPLINE_HTML.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(m=>m[1].includes(helplineKey))[1];
 assert.equal(createHash('sha256').update(code.replaceAll('\r\n','\n').replaceAll('\r','\n')).digest('base64'),ANALYTICS_CSP_HASH);
});
test('accepted attribution uses its submitted snapshot despite a concurrent source or weaker GBP URL',()=>{
 for(const search of ['', '?utm_source=google&utm_medium=organic&utm_campaign=gbp']){
  const now=Date.now(),first=client({search:tagged(campaigns[0]),now});first.choose('accepted');
  const form=client({path:enrol,search,store:first.store,now});form.choose('accepted');const submitted=form.source();
  const other=client({search:tagged(campaigns[1]),store:first.store,now});other.choose('accepted');
  form.accepted(receipt,submitted);assert.equal(eventRows(form)[0][2].campaign_name,campaigns[0]);
 }
});
test('concurrent Google tabs retain each submission gclid and UTM envelope through durable intake',async()=>{
 const clickA='EAIaIQobChMIqaClickEnvelopeSourceA',clickB='EAIaIQobChMIqaClickEnvelopeSourceB';
 const store=new Map(),tagA='?utm_source=google&utm_medium=cpc&utm_campaign=google_tab_a&gclid='+clickA;
 const tagB='?utm_source=google&utm_medium=cpc&utm_campaign=google_tab_b&gclid='+clickB;
 const landingA=client({path:'/centers',search:tagA,store});landingA.choose('accepted');
 const formA=client({path:enrol,store});formA.choose('accepted');const submittedA=formA.source();
 const landingB=client({path:'/autism-therapy',search:tagB,store});landingB.choose('accepted');
 const formB=client({path:enrol,store});formB.choose('accepted');const submittedB=formB.source();
 assert.equal(submittedA.fields.gclid,clickA);assert.equal(submittedA.fields.utm_campaign,'google_tab_a');
 assert.equal(submittedB.fields.gclid,clickB);assert.equal(submittedB.fields.utm_campaign,'google_tab_b');
 const f=fixtureLedger(),handoffs=[];
 const env={ENROLMENT_RECEIPT_VERSION:'1',PINNACLE_ENROLMENT_RECEIPTS:{receive:(data,key)=>receiveReceiptEnrolment(data,{idempotencyKey:key,ledger:f.ledger,handoff:async lead=>{handoffs.push(lead);return 'qa_fixture_v1:multi-tab';}})}};
 const fetchImpl=(url,options)=>serveEnrolmentApi(new Request(url,{...options,headers:{...options.headers,origin}}),env);
 const send=(source,suffix)=>submitEnrolment('/api/enrolment',makePayload(values,'qa-multi-tab-'+suffix,source),{origin,fetchImpl,receiptRequired:true});
 try{
  const [a,b]=await Promise.all([send(submittedA,'source-a'),send(submittedB,'source-b')]);assert.equal(a.state,'accepted');assert.equal(b.state,'accepted');assert.equal(handoffs.length,2);
  const rows=f.db.prepare('SELECT request_key, source_json FROM website_enrolment_receipts ORDER BY request_key').all();assert.equal(rows.length,2);
  const persisted=Object.fromEntries(rows.map(row=>[row.request_key,JSON.parse(row.source_json).acquisition]));
  assert.deepEqual(persisted['qa-multi-tab-source-a'],submittedA);assert.deepEqual(persisted['qa-multi-tab-source-b'],submittedB);
  assert.equal(JSON.parse(store.get(sourceKey)).fields.gclid,clickB);
 } finally {f.close();}
});
test('pending receipt still succeeds but helpline withdrawal suppresses its optional labels',()=>{
 const first=client({search:tagged(campaigns[0])});first.choose('accepted');const form=client({path:enrol,store:first.store});form.choose('accepted');const submitted=form.source();
 first.choose('declined');form.accepted(receipt,submitted);assert.equal(eventRows(form).length,1);assert.equal(eventRows(form)[0][2].campaign_name,'');
 const fresh=client({path:enrol,store:first.store});fresh.navigator.globalPrivacyControl=true;fresh.accepted(receipt,submitted);assert.equal(eventRows(fresh).length,0);
});
for(const campaign of campaigns){
 test(campaign+' keeps the original source through an isolated durable intake exactly once',async()=>{
  const first=client({search:tagged(campaign)});first.choose('accepted');
  const captured=JSON.parse(first.store.get(sourceKey));first.advance(5000);first.choose('accepted');assert.deepEqual(JSON.parse(first.store.get(sourceKey)),captured);
  const form=client({path:enrol,store:first.store,now:Date.now()+6000});assert.equal(form.source(),null);form.choose('accepted');assert.deepEqual(form.source(),captured);
  const config=form.commands().find(x=>x[0]==='config'&&x[1]==='G-2BYLRLFRDJ')[2];assert.equal(config.campaign_name,campaign);
  assert.equal(config.cookie_prefix,'ps');assert.equal(config.cookie_path,enrol);
  const f=fixtureLedger();let handoffs=0;
  const payload=makePayload(values,'qa-chatgpt-'+randomUUID(),form.source());
  const env={ENROLMENT_RECEIPT_VERSION:'1',PINNACLE_ENROLMENT_RECEIPTS:{receive:(data,key)=>receiveReceiptEnrolment(data,{idempotencyKey:key,ledger:f.ledger,handoff:async lead=>{handoffs++;assert.deepEqual(lead.FacilityIds,['']);return 'qa_fixture_v1:helpline-only';}})}};
  const fetchImpl=(url,options)=>serveEnrolmentApi(new Request(url,{...options,headers:{...options.headers,origin}}),env);
  const send=data=>submitEnrolment('/api/enrolment',data,{origin,fetchImpl,receiptRequired:true});
  try{
   const concurrent=await Promise.all(Array.from({length:10},()=>send(payload)));assert(concurrent.some(r=>r.state==='accepted'));assert.equal(handoffs,1);
   const result=await send(payload);assert.equal(result.state,'accepted');form.accepted(result.receipt);form.accepted(result.receipt);
   const row=f.db.prepare('SELECT * FROM website_enrolment_receipts').get();assert.equal(row.state,'accepted');assert.equal(row.lead_reference,'qa_fixture_v1:helpline-only');assert.deepEqual(JSON.parse(row.source_json).acquisition,captured);assert.equal(payload.source.page,enrol);
   const changed=structuredClone(payload);changed.preferences.service='speech';assert.equal((await send(changed)).state,'rejected');assert.equal(handoffs,1);
   const other=structuredClone(payload);other.source.acquisition.fields.utm_campaign=campaigns.find(c=>c!==campaign);assert.equal((await send(other)).receipt.id,result.receipt.id);assert.deepEqual(JSON.parse(f.db.prepare('SELECT source_json FROM website_enrolment_receipts').get().source_json).acquisition,captured);
   assert.equal(eventRows(form).length,1);const event=eventRows(form)[0][2];assert.equal(event.campaign_source,'chatgpt');assert.equal(event.campaign_medium,'paid');assert.equal(event.campaign_name,campaign);assert.equal(event.page_group,'enrolment');assert.equal(event.destination,'existing_enrolment_workflow');assert.equal(event.measurement_mode,'consented');assert.equal(event.send_to,'G-2BYLRLFRDJ');assert(!Object.hasOwn(event,'link_placement'));
   for(const excluded of [payload.requestId,result.receipt.id,row.lead_reference,values.name,values.phone,'G-H9CLX1WJ7R'])assert(!JSON.stringify(eventRows(form)).includes(excluded));
  }finally{f.close();}
 });
}
for(const [name,hConsent,mConsent,expectSource,expectEvents] of [['neither',false,false,false,1],['helpline only',true,false,false,1],['main only',false,true,false,1],['both',true,true,true,1],['helpline refusal','declined',true,false,1],['main refusal',true,'declined',false,0]]){
 test('independent consent: '+name,()=>{
  const h=client({search:tagged(campaigns[0])});if(hConsent)h.choose(hConsent===true?'accepted':'declined');
  assert(!h.store.has(mainKey));const m=client({path:enrol,store:h.store});if(mConsent)m.choose(mConsent===true?'accepted':'declined');
  assert.equal(!!m.source(),expectSource);m.accepted(receipt);assert.equal(eventRows(m).length,expectEvents);
  if(!expectSource)assert(!JSON.stringify(eventRows(m)).includes(campaigns[0]));
  if(expectEvents)assert.equal(eventRows(m)[0][2].measurement_mode,mConsent===true?'consented':'denied_storage');
 });
}
test('v3 permission is not expanded into v4 or main-site permission',()=>{
 const store=new Map([['pinnacle-helpline-measurement-choice-v3',JSON.stringify(accepted)],[mainKey,JSON.stringify(accepted)]]);
 const h=client({store,search:tagged(campaigns[0])});assert.equal(h.events().length,0);assert(!store.has(sourceKey));assert(!store.has(helplineKey));
});
test('withdrawal in either stream stops handoff and removes the optional source',()=>{
 for(const withdrawing of ['helpline','main']){
  const h=client({search:tagged(campaigns[0])});h.choose('accepted');const m=client({path:enrol,store:h.store});m.choose('accepted');assert(m.source());
  (withdrawing==='helpline'?h:m).choose('declined');assert.equal(m.source(),null);assert(!h.store.has(sourceKey));m.accepted(receipt);assert(!JSON.stringify(eventRows(m)).includes(campaigns[0]));
 }
});
test('expiry, GPC, QA exclusion and optional storage failure cannot supply attribution',()=>{
 for(const kind of ['source expiry','helpline expiry','main expiry','gpc','qa','storage']){
  const h=client({search:tagged(campaigns[0]),sourceStorageFailure:kind==='storage'});h.choose('accepted');
  if(kind==='source expiry'){const source=JSON.parse(h.store.get(sourceKey));source.capturedAt-=31*86400000;h.store.set(sourceKey,JSON.stringify(source));}
  if(kind==='helpline expiry')h.store.set(helplineKey,JSON.stringify({value:'accepted',at:Date.now()-181*86400000}));
  const m=client({path:enrol,store:h.store,gpc:kind==='gpc',search:kind==='qa'?'?validation_test=1':'',sourceStorageFailure:kind==='storage'});m.choose('accepted');
  if(kind==='main expiry')m.advance(181*86400000);
  assert.equal(m.source(),null,kind);assert(!makePayload(values,'qa-source-unknown',m.source()).source.acquisition);
 }
});
test('helpline rejects partial, duplicate, wrong, additional and malformed campaign fields',()=>{
 for(const search of ['?utm_source=chatgpt','?utm_source=google&utm_medium=paid&utm_campaign='+campaigns[0],tagged('unapproved'),tagged(campaigns[0])+'&utm_source=chatgpt',tagged(campaigns[0])+'&utm_medium=paid',tagged(campaigns[0])+'&utm_campaign='+campaigns[1],tagged(campaigns[0])+'&gclid=excluded',tagged(campaigns[0])+'&oppref=excluded',tagged(campaigns[0])+'&utm_term=excluded',tagged(campaigns[0])+'&utm_unknown=excluded',tagged(campaigns[0]).replace('chatgpt','%20chatgpt')]){
  const h=client({search});h.choose('accepted');assert(!h.store.has(sourceKey),search);assert(!JSON.stringify(h.events()).includes('excluded'),search);
 }
 const h=client({search:tagged(campaigns[0])+'&child_name=DO_NOT_EXPORT'});h.choose('accepted');assert(!JSON.stringify([...h.store]).includes('DO_NOT_EXPORT'));
});
test('shared and private validator drops invalid optional sources without blocking valid intake',async()=>{
 const f=fixtureLedger();let handoffs=0;
 const source={schemaVersion:1,consent:'analytics_accepted',capturedAt:Date.now(),landingPath:helpline,fields:{utm_source:'chatgpt',utm_medium:'paid',utm_campaign:campaigns[0]}};
 try{
  for(const invalid of [{...source,landingPath:helpline+'/private'},{...source,fields:{...source.fields,gclid:'no'}},{...source,fields:{...source.fields,utm_campaign:'no'}},{...source,fields:{utm_source:'chatgpt'}},{...source,capturedAt:Date.now()-31*86400000}]){
   assert.equal(normaliseAcquisition(invalid),null);const payload=makePayload(values,'qa-invalid-'+randomUUID(),null);payload.source.acquisition=invalid;
   const result=await serveEnrolmentApi(new Request(origin+'/api/enrolment',{method:'POST',headers:{origin,'content-type':'application/json','idempotency-key':payload.requestId},body:JSON.stringify(payload)}),{ENROLMENT_RECEIPT_VERSION:'1',PINNACLE_ENROLMENT_RECEIPTS:{receive:(data,key)=>receiveReceiptEnrolment(data,{idempotencyKey:key,ledger:f.ledger,handoff:async()=>{handoffs++;return 'qa_fixture_v1:source-unknown';}})}});
   assert.equal(result.status,202);const row=f.db.prepare('SELECT source_json FROM website_enrolment_receipts WHERE request_key=?').get(payload.requestId);assert(!JSON.parse(row.source_json).acquisition);
  }assert.equal(handoffs,5);
 }finally{f.close();}
});
test('new paid source and GBP precedence remain atomic; direct navigation retains capture time',()=>{
 const g=client({path:'/centers',search:'?utm_source=google&utm_medium=cpc&utm_campaign=prior&gclid=qaPriorClick'});g.choose('accepted');
 const h=client({store:g.store,search:tagged(campaigns[0])});h.choose('accepted');const expected=JSON.parse(h.store.get(sourceKey));
 const gbp=client({path:'/centers',store:h.store,search:'?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=suchitra'});assert.deepEqual(gbp.source(),expected);
 const direct=client({path:enrol,store:h.store});assert.deepEqual(direct.source(),expected);
 const freshGoogle=client({path:'/centers',store:h.store,search:'?utm_source=google&utm_medium=cpc&utm_campaign=current&gclid=qaCurrentClick'});assert.equal(freshGoogle.source().fields.gclid,'qaCurrentClick');assert.equal(freshGoogle.source().fields.utm_source,'google');
});
test('callback is a plain enrolment link and all eight telephone actions remain intact',()=>{
 const html=fs.readFileSync('../helpline-site/page.html','utf8');assert(html.includes('data-helpline-callback href="'+enrol+'"'));
 const calls=[...html.matchAll(/<a\b[^>]*data-call-placement="([^"]+)"[^>]*>/g)];assert.equal(calls.length,8);assert.equal(new Set(calls.map(m=>m[1])).size,8);assert(calls.every(m=>m[0].includes('href="tel:+919100181181"')));assert(html.includes('30 days'));assert(html.includes('both choices'));
});
