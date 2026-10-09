import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {planLeadSlackNotifications as plan,deliverLeadSlackNotifications as deliver} from '../deployment/enrolment-lead-slack.mjs';
import {fixtureSlackJournal} from '../tests/fixtures/lead-slack-journal-sqlite.mjs';
// Entirely offline fixtures. These routes/links are not Pinnacle contracts.
const input={
 event:{type:'website.enrol.submitted',requestId:'offline-request-0001',centreId:'QA'},
 receipt:{schemaVersion:1,state:'accepted',requestId:'offline-request-0001',id:'offline-receipt-0001',leadReference:'lead_v1:123'},
 resolvedLead:{leadReference:'lead_v1:123',leadId:'123',leadUrl:'https://protected.example.invalid/lead/123'}
};
const config={routes:{QA:'C1234567890'},centralChannel:'C9876543210',
 approveLeadUrl:(url,id)=>url.origin==='https://protected.example.invalid'&&url.pathname==='/lead/'+id&&!url.hash};
const ok=payload=>({ok:true,channel:payload.channel,ts:'1234567890.000001'});
function fresh(){return structuredClone(input);}
test('confirmed private lead produces exactly centre and central minimal notifications',()=>{
 const plans=plan(input,config);assert.equal(plans.length,2);
 assert.deepEqual(plans.map(p=>p.payload.channel),['C1234567890','C9876543210']);
 for(const {payload} of plans){assert(payload.text.includes('Intake history: 123'));assert(payload.text.includes(input.resolvedLead.leadUrl));assert.equal(payload.unfurl_links,false);assert.equal(payload.unfurl_media,false);assert.equal(payload.unfurl_app_links,false);assert.equal(payload.mrkdwn,false);}
});
test('unconfirmed, mismatched and legacy references cannot produce notifications',()=>{
 for(const change of [
  x=>delete x.receipt,
  x=>x.receipt.state='uncertain',
  x=>x.receipt.requestId='another-request',
  x=>x.receipt.leadReference='peoplenote_v1:123',
  x=>x.resolvedLead.leadReference='lead_v1:456',
  x=>x.resolvedLead.leadId='private name <@here>',
  x=>x.event.requestId='name\n<@here>'
 ]){const x=fresh();change(x);assert.throws(()=>plan(x,config));}
});
test('unavailable official URL validator and unsafe URL forms fail closed',()=>{
 assert.throws(()=>plan(input,{...config,approveLeadUrl:null}));
 for(const url of ['http://protected.example.invalid/lead/123','https://user:password@protected.example.invalid/lead/123','https://protected.example.invalid/lead/123?token=SECRET','https://another.example.invalid/lead/123','https://protected.example.invalid/lead/123#family-data','https://protected.example.invalid/lead/123|@here']){
  const x=fresh();x.resolvedLead.leadUrl=url;assert.throws(()=>plan(x,config));
 }
});
test('invalid or unmapped centres and unverified WhatsApp source fail before posting',()=>{
 for(const change of [x=>x.event.centreId='UNKNOWN',x=>x.event.centreId='@here',x=>x.event.type='whatsapp.enquiry.received']){const x=fresh();change(x);assert.throws(()=>plan(x,config));}
 assert.throws(()=>plan(input,{...config,centralChannel:config.routes.QA}));
});
test('private fragments are rejected even when the official record validator ignores them',()=>{
 const x=fresh();x.resolvedLead.leadUrl+='\x23family_name=PRIVATE';
 assert.throws(()=>plan(x,{...config,approveLeadUrl:(url,id)=>url.origin==='https://protected.example.invalid'&&url.pathname==='/lead/'+id}));
});
test('family, clinical, advertising and credential fields never enter Slack payloads',()=>{
 const x=fresh();x.event.contact={name:'PRIVATE-FAMILY',phone:'PRIVATE-PHONE'};x.event.diagnosis='PRIVATE-DIAGNOSIS';x.receipt.secret='PRIVATE-TOKEN';x.resolvedLead.clinicalNotes='PRIVATE-NOTES';x.event.gclid='PRIVATE-CLICK';
 const serialised=JSON.stringify(plan(x,config));for(const secret of ['PRIVATE-FAMILY','PRIVATE-PHONE','PRIVATE-DIAGNOSIS','PRIVATE-TOKEN','PRIVATE-NOTES','PRIVATE-CLICK'])assert(!serialised.includes(secret));
});
test('untrusted or modified plans and missing durable storage cannot post',async()=>{
 const plans=plan(input,config);assert.throws(()=>{plans[0].payload.text='PRIVATE-FAMILY';});
 let calls=0;await assert.rejects(deliver(plans,{postMessage:()=>calls++}));assert.equal(calls,0);
 const f=fixtureSlackJournal();try{await assert.rejects(deliver(JSON.parse(JSON.stringify(plans)),{journal:f.journal,postMessage:()=>calls++}));assert.equal(calls,0);}finally{f.close();}
});
test('successful destinations are not reposted across ordinary retries',async()=>{
 const f=fixtureSlackJournal();let calls=0;try{
  const send=p=>{calls++;return ok(p);};assert.deepEqual((await deliver(plan(input,config),{journal:f.journal,postMessage:send})).map(r=>r.status),['delivered','delivered']);
  await deliver(plan(input,config),{journal:f.journal,postMessage:send});assert.equal(calls,2);
 }finally{f.close();}
});
test('duplicate and mixed branded plans cannot break the exact centre/central pair',async()=>{
 const first=plan(input,config),x=fresh();x.event.requestId='offline-request-0002';x.receipt.requestId=x.event.requestId;x.receipt.id='offline-receipt-0002';
 const second=plan(x,config),f=fixtureSlackJournal();let calls=0;
 try{for(const pair of [[first[0],first[0]],[first[0],second[1]]])await assert.rejects(deliver(pair,{journal:f.journal,postMessage:()=>calls++}));assert.equal(calls,0);}finally{f.close();}
});
test('partial Slack failure retries only that destination',async()=>{
 const f=fixtureSlackJournal(),calls=[];let fail=true;try{
  const send=p=>{calls.push(p.channel);return fail&&p.channel===config.centralChannel?{ok:false,error:'ratelimited'}:ok(p);};
  assert.deepEqual((await deliver(plan(input,config),{journal:f.journal,postMessage:send})).map(r=>r.status),['delivered','pending']);
  fail=false;await deliver(plan(input,config),{journal:f.journal,postMessage:send});assert.deepEqual(calls,['C1234567890','C9876543210','C9876543210']);
 }finally{f.close();}
});
test('ambiguous network outcome is held for reconciliation and never blindly retried',async()=>{
 const f=fixtureSlackJournal();let calls=0;try{
  const send=()=>{calls++;throw Error('unknown transport outcome');};
  assert.deepEqual((await deliver(plan(input,config),{journal:f.journal,postMessage:send})).map(r=>r.status),['uncertain','uncertain']);
  await deliver(plan(input,config),{journal:f.journal,postMessage:send});assert.equal(calls,2);
 }finally{f.close();}
});
test('Slack partial-success and unknown errors are quarantined without automatic repost',async()=>{
 for(const error of ['internal_error','fatal_error','unknown_error']){
  const f=fixtureSlackJournal();let calls=0;try{
   const send=()=>{calls++;return {ok:false,error};};
   assert.deepEqual((await deliver(plan(input,config),{journal:f.journal,postMessage:send})).map(r=>r.status),['uncertain','uncertain']);
   await deliver(plan(input,config),{journal:f.journal,postMessage:send});assert.equal(calls,2);
  }finally{f.close();}
 }
});
test('concurrent delivery attempts claim each destination once',async()=>{
 const f=fixtureSlackJournal();let calls=0;try{
  const send=async p=>{calls++;await new Promise(resolve=>setTimeout(resolve,5));return ok(p);};
  await Promise.all(Array.from({length:10},()=>deliver(plan(input,config),{journal:f.journal,postMessage:send})));assert.equal(calls,2);
 }finally{f.close();}
});
test('same accepted receipt cannot silently change its resolved lead payload',async()=>{
 const f=fixtureSlackJournal();let calls=0;try{
  const send=p=>{calls++;return ok(p);};await deliver(plan(input,config),{journal:f.journal,postMessage:send});
  const x=fresh();
  const changedConfig={...config,approveLeadUrl:()=>true};
  // Use a legitimate different person link with the same intake identity.
  x.resolvedLead.personId='456';x.resolvedLead.leadUrl='https://therapeuticai.org/?l=lead-456';
  assert.deepEqual((await deliver(plan(x,changedConfig),{journal:f.journal,postMessage:send})).map(r=>r.status),['conflict','conflict']);assert.equal(calls,2);
 }finally{f.close();}
});
test('successful destination state survives closing and reopening real local storage',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'offline-lead-slack-')),filename=path.join(dir,'journal.sqlite');let f=fixtureSlackJournal(filename),calls=0;
 try{
  const send=p=>{calls++;return ok(p);};await deliver(plan(input,config),{journal:f.journal,postMessage:send});f.close();f=fixtureSlackJournal(filename);
  await deliver(plan(input,config),{journal:f.journal,postMessage:send});assert.equal(calls,2);
 }finally{f.close();fs.rmSync(dir,{recursive:true,force:true});}
});
test('lost acknowledgement after durable commit does not repost a successful message',async()=>{
 const f=fixtureSlackJournal();let calls=0;try{
  const journal={...f.journal,complete:async(...args)=>{await f.journal.complete(...args);throw Error('commit response lost');}};
  const send=p=>{calls++;return ok(p);};await deliver(plan(input,config),{journal,postMessage:send});
  await deliver(plan(input,config),{journal:f.journal,postMessage:send});assert.equal(calls,2);
 }finally{f.close();}
});

test('existing protected resolver preserves intake ID versus person ID and the actual app route',async()=>{
 const {resolveAcceptedWebsiteLead,approveExistingLeadPersonUrl,EXISTING_LEAD_PERSON_LINK_SQL}=await import('../deployment/enrolment-lead-resolver.mjs');
 let seen;const resolvedLead=await resolveAcceptedWebsiteLead(input.receipt,{execute:async(sql,params)=>{seen={sql,params};return {rows:[{intakeId:'123',personId:'456'}]};}});
 assert.equal(seen.sql,EXISTING_LEAD_PERSON_LINK_SQL);assert.deepEqual(seen.params,['123','offline-request-0001','offline-receipt-0001','lead_v1:123']);
 assert.equal(resolvedLead.leadId,'123');assert.equal(resolvedLead.personId,'456');assert.equal(resolvedLead.leadUrl,'https://therapeuticai.org/?l=lead-456');
 const plans=plan({...input,resolvedLead},{...config,approveLeadUrl:approveExistingLeadPersonUrl});assert.equal(plans.length,2);assert(plans[0].payload.text.includes('Intake history: 123'));assert(plans[0].payload.text.includes('l=lead-456'));
});
test('protected resolver refuses uncertain/public/general-reach receipts before reading any records',async()=>{
 const {resolveAcceptedWebsiteLead}=await import('../deployment/enrolment-lead-resolver.mjs');let reads=0;
 for(const receipt of [{...input.receipt,state:'uncertain'},{...input.receipt,leadReference:'peoplenote_v1:123'},{...input.receipt,leadReference:undefined}]){
  await assert.rejects(resolveAcceptedWebsiteLead(receipt,{execute:()=>reads++}));
 }assert.equal(reads,0);
});
test('protected resolver requires exactly one matching intake with a positive person association',async()=>{
 const {resolveAcceptedWebsiteLead}=await import('../deployment/enrolment-lead-resolver.mjs');
 for(const rows of [[],[{intakeId:'789',personId:'456'}],[{intakeId:'123',personId:null}],[{intakeId:'123',personId:'0'}],[{intakeId:'123',personId:'456'},{intakeId:'123',personId:'456'}]]){
  await assert.rejects(resolveAcceptedWebsiteLead(input.receipt,{execute:async()=>({rows})}));
 }
});
test('official TherapeuticAI lead query accepts only the resolved person ID, without extra or duplicate fields',()=>{
 const resolvedLead={...input.resolvedLead,personId:'456',leadUrl:'https://therapeuticai.org/?l=lead-456'},approveLeadUrl=()=>true;
 assert.equal(plan({...input,resolvedLead},{...config,approveLeadUrl}).length,2);
 for(const leadUrl of ['https://mirracle.pinnacleblooms.org/hermes?id=456','https://therapeuticai.org/?l=lead-123','https://therapeuticai.org/?l=lead-789','https://therapeuticai.org/?l=lead-456&l=lead-456','https://therapeuticai.org/?l=lead-456&token=SECRET','https://therapeuticai.org/?l=lead-456#child=PRIVATE','https://other.example.invalid/?l=lead-456']){
  assert.throws(()=>plan({...input,resolvedLead:{...resolvedLead,leadUrl}},{...config,approveLeadUrl}));
 }
});
test('resolver refuses rounded numeric database IDs and preserves exact string IDs',async()=>{
 const {resolveAcceptedWebsiteLead}=await import('../deployment/enrolment-lead-resolver.mjs');
 await assert.rejects(resolveAcceptedWebsiteLead(input.receipt,{execute:async()=>({rows:[{intakeId:'123',personId:9007199254740992}]})}));
 const target=await resolveAcceptedWebsiteLead(input.receipt,{execute:async()=>({rows:[{intakeId:'123',personId:'9007199254740993'}]})});assert.equal(target.leadUrl,'https://therapeuticai.org/?l=lead-9007199254740993');
});

test('explicit unassigned policy sends only central and keeps the centre leg pending',async()=>{
 const x=fresh();delete x.event.centreId;const f=fixtureSlackJournal(),calls=[];
 try{
  const plans=plan(x,{...config,allowUnassigned:true});assert.equal(plans.length,1);
  assert(plans[0].payload.text.includes('UNASSIGNED'));
  const result=await deliver(plans,{journal:f.journal,postMessage:p=>{calls.push(p.channel);return ok(p);}});
  assert.deepEqual(result,[{channel:config.centralChannel,status:'delivered'},{channel:null,status:'centre_pending',reason:'no_centre_selected'}]);
  assert.deepEqual(calls,[config.centralChannel]);assert.throws(()=>plan(x,config));
 }finally{f.close();}
});
test('later verified assignment adds the centre leg without reposting the network receipt',async()=>{
 const x=fresh();x.event.facilityId='999';const f=fixtureSlackJournal(),calls=[];
 const runtime={...config,allowUnassigned:true,facilityRoutes:{}};
 const send=p=>{calls.push(p.channel);return ok(p);};
 try{
  await deliver(plan(x,runtime),{journal:f.journal,postMessage:send});
  runtime.facilityRoutes['999']={short_code:'QA',administration_channel_id:config.routes.QA};
  const results=await deliver(plan(x,runtime),{journal:f.journal,postMessage:send});
  assert.deepEqual(results.map(r=>r.status),['delivered','delivered']);assert.deepEqual(calls,[config.centralChannel,config.routes.QA]);
 }finally{f.close();}
});
test('facility identity chooses the verified Administration route and never a code fallback',()=>{
 const x=fresh();x.event.facilityId='456';
 const runtime={...config,allowUnassigned:true,facilityRoutes:{'456':{short_code:'QA',administration_channel_id:'C1111111111'}}};
 assert.deepEqual(plan(x,runtime).map(p=>p.payload.channel),['C1111111111',config.centralChannel]);
 x.event.facilityId='999';const pending=plan(x,runtime);assert.equal(pending.length,1);assert(pending[0].payload.text.includes('UNASSIGNED'));
 assert(!JSON.stringify(pending).includes('999'));
 x.event.facilityId='456';x.event.centreId='QB';assert.throws(()=>plan(x,runtime));
 for(const id of [456,['456'],'PRIVATE-FAMILY\n@here']){x.event.facilityId=id;x.event.centreId='QA';assert.throws(()=>plan(x,runtime));}
});
test('unassigned policy still requires confirmed lead identity and safe centre fields',()=>{
 const runtime={...config,allowUnassigned:true};
 for(const change of [x=>x.receipt.state='uncertain',x=>x.event.centreId='@here',x=>x.event.type='whatsapp.enquiry.received']){
  const x=fresh();delete x.event.centreId;change(x);assert.throws(()=>plan(x,runtime));
 }
});
test('SQL-backed existing resolver refuses an orphan person association',async()=>{
 const {resolveAcceptedWebsiteLead}=await import('../deployment/enrolment-lead-resolver.mjs');
 const db=new DatabaseSync(':memory:');
 try{
  db.exec("CREATE TABLE website_enrolment_receipts(request_key TEXT,receipt_id TEXT,state TEXT,lead_reference TEXT);CREATE TABLE lead_v1(Id TEXT,TOId TEXT);CREATE TABLE people(Id TEXT)");
  db.prepare('INSERT INTO website_enrolment_receipts VALUES (?,?,?,?)').run(input.receipt.requestId,input.receipt.id,'accepted',input.receipt.leadReference);
  db.prepare('INSERT INTO lead_v1 VALUES (?,?)').run('123','456');
  const execute=async(sql,params)=>({rows:db.prepare(sql).all(...params)});
  await assert.rejects(resolveAcceptedWebsiteLead(input.receipt,{execute}));
  db.prepare('INSERT INTO people VALUES (?)').run('456');
  assert.equal((await resolveAcceptedWebsiteLead(input.receipt,{execute})).leadUrl,'https://therapeuticai.org/?l=lead-456');
 }finally{db.close();}
});

test('official link builder uses the exact person ID and never the intake-history ID',async()=>{
 const {existingLeadPersonUrl,approveExistingLeadPersonUrl}=await import('../deployment/enrolment-lead-resolver.mjs');
 const url=existingLeadPersonUrl('75975');
 assert.equal(url,'https://therapeuticai.org/?l=lead-75975');
 assert.equal(approveExistingLeadPersonUrl(new URL(url),'123','75975'),true);
 assert.equal(approveExistingLeadPersonUrl(new URL(url),'75975','123'),false);
 for(const bad of ['https://mirracle.pinnacleblooms.org/hermes?id=75975',url+'&token=SECRET',url+'&l=lead-75975',url+'#private','https://therapeuticai.org/?l=lead-%37%35%39%37%35']){
  assert.equal(approveExistingLeadPersonUrl(new URL(bad),'123','75975'),false);
 }
 for(const id of [0,-1,'075975','75975&token=SECRET',9007199254740992])assert.throws(()=>existingLeadPersonUrl(id));
});
