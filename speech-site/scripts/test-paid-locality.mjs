import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import{nativePaidCentre,applyPaidEnquiryLinks,paidCentreAliases,PAID_LOCALITY_CONTRACT}from'../public/pinnacle-pages-scripts/enrolment-routing.mjs';
const query=(content,extra={})=>new URLSearchParams({utm_source:'google',utm_medium:'cpc',utm_campaign:'pbn_network_hyderabad',utm_content:content,...extra});
const cases=[['khajaguda-mehdipatnam-hyderabad-telangana_speech','speech','khajaguda'],['lbnagar-hyderabad-telangana_aba','aba','lbnagar'],['nallagandla-hyderabad-telangana_ot','occupational','nallagandla'],['suchitra2-hyderabad-telangana_ot','occupational','suchitraii']];
for(const[content,service,centre]of cases)test('native '+content+' selects existing '+centre,()=>assert.deepEqual(nativePaidCentre(query(content),{service,centres:new Set([centre])}),{centre,service}));
test('all aliases exactly match existing published profile paths',()=>{const prefix='/centers/best-autism-speech-aba-occupational-therapy-center-',expected=Object.fromEntries(JSON.parse(fs.readFileSync('src/data/centre-directory.json','utf8')).map(c=>[c,new URL(c.profileUrl).pathname]).filter(([,p])=>p.startsWith(prefix)&&p.endsWith('-india')).map(([c,p])=>[p.slice(prefix.length,-6),c.id]));assert.deepEqual(paidCentreAliases,expected);});
test('explicit centre, blank help choice, mismatched service and unavailable option win over paid hints',()=>{for(const centre of ['guntur',''])assert.equal(nativePaidCentre(query(cases[0][0],{centre}),{service:'speech'}),null);assert.equal(nativePaidCentre(query(cases[0][0]),{service:'occupational'}),null);assert.equal(nativePaidCentre(query(cases[0][0]),{service:'speech',centres:new Set(['guntur'])}),null);});
test('held markets, Paradise and unmapped/prototype labels stay help-me-choose',()=>{for(const c of ['himayatnagar-hyderabad-telangana','kondapur-hyderabad-telangana','gachibowli-hyderabad-telangana','paradise-hyderabad-telangana','constructor'])assert.equal(nativePaidCentre(query(c+'_speech'),{service:'speech'}),null);});
test('conflicting duplicate, malformed and unrelated campaigns do not infer a centre',()=>{for(const key of ['utm_source','utm_medium','utm_campaign','utm_content']){const p=query(cases[0][0]);p.append(key,p.get(key));assert.equal(nativePaidCentre(p),null);}for(const p of [query(cases[0][0],{utm_source:'chatgpt'}),query(cases[0][0],{utm_campaign:'unrelated'}),query(cases[0][0],{utm_campaign:'pbn_network_vizag'}),query(cases[0][0],{utm_medium:'organic'}),query('khajaguda_<script>')])assert.equal(nativePaidCentre(p),null);});
const anchor=href=>({href,dataset:{},getAttribute(){return this.href;}});
const nativeRoutes=JSON.parse(fs.readFileSync('tests/fixtures/native-paid-locality-routes-20261017.json','utf8')).cases;
const publishedCentres=new Set(JSON.parse(fs.readFileSync('src/data/centre-directory.json','utf8')).map(c=>c.id));
test('all 150 existing native service/locality routes resolve or preserve an intentional fallback',()=>{
 assert.equal(nativeRoutes.length,150);
 for(const row of nativeRoutes){
  const params=new URL(row.url).searchParams;
  const expected=row.centre?{centre:row.centre,service:row.service}:null;
  assert.deepEqual(nativePaidCentre(params,{service:row.service,centres:publishedCentres}),expected,row.url);
  for(const centre of ['', 'guntur']){const explicit=new URLSearchParams(params);explicit.set('centre',centre);assert.equal(nativePaidCentre(explicit,{service:row.service,centres:publishedCentres}),null);}
 }
});
test('regional campaign and locality must match exactly; unknown and prototype keys stay unselected',()=>{
 const regional=nativeRoutes.filter(r=>r.classification==='EXACT_CAMPAIGN_ALLOWLIST_SCOPE_GAP');assert.equal(regional.length,72);
 for(const row of regional){
  const params=new URL(row.url).searchParams;
  for(const key of ['utm_source','utm_medium','utm_campaign','utm_content']){const duplicate=new URLSearchParams(params);duplicate.append(key,duplicate.get(key));assert.equal(nativePaidCentre(duplicate),null);}
  for(const campaign of ['pbn_network_unknown','constructor','toString']){const altered=new URLSearchParams(params);altered.set('utm_campaign',campaign);assert.equal(nativePaidCentre(altered),null);}
  const wrong=new URLSearchParams(params);wrong.set('utm_content','khajaguda-mehdipatnam-hyderabad-telangana_speech');assert.equal(nativePaidCentre(wrong),null);
  const missing=new Set(publishedCentres);missing.delete(row.centre);assert.equal(nativePaidCentre(params,{service:row.service,centres:missing}),null);
 }
});
test('regional enquiry handoff preserves existing link fields and leaves call links unchanged',()=>{
 for(const row of nativeRoutes.filter(r=>r.classification==='EXACT_CAMPAIGN_ALLOWLIST_SCOPE_GAP')){
  const a=anchor('/enroll-autism-speech-aba-therapies-india?offer=existing#form'),b=anchor('tel:+919100181181');
  applyPaidEnquiryLinks({querySelectorAll:()=>[a,b],body:{dataset:{}}},row.url,{service:row.service,centres:publishedCentres});
  const target=new URL(a.href);assert.equal(target.searchParams.get('centre'),row.centre);assert.equal(target.searchParams.get('service'),row.service);assert.equal(target.searchParams.get('offer'),'existing');assert.equal(target.hash,'#form');assert.equal(b.href,'tel:+919100181181');assert.equal(target.searchParams.has('utm_source'),false);
 }
});
test('a family-selected service wins over a conflicting paid service on every regional route',()=>{
 for(const row of nativeRoutes.filter(r=>r.classification==='EXACT_CAMPAIGN_ALLOWLIST_SCOPE_GAP')){
  const url=new URL(row.url),service=row.service==='speech'?'aba':'speech';url.searchParams.set('service',service);
  const a=anchor('/enroll-autism-speech-aba-therapies-india');
  applyPaidEnquiryLinks({querySelectorAll:()=>[a],body:{dataset:{}}},url.href,{service:row.service,centres:publishedCentres});
  const target=new URL(a.href);assert.equal(target.searchParams.get('service'),service);assert.equal(target.searchParams.has('centre'),false);
 }
});
test('generic header/footer links keep service and an explicit Suchitra2 family choice without campaign labels',()=>{
 const a=anchor('/enroll-autism-speech-aba-therapies-india?offer=existing#form'),b=anchor('/enroll-autism-speech-aba-therapies-india?centre=guntur&service=speech'),c=anchor('tel:+919100181181');
 applyPaidEnquiryLinks({querySelectorAll:()=>[a,b,c],body:{dataset:{}}},'https://www.pinnacleblooms.org/best-occupational-therapy-center-india-proven-improvement-rate?centre=suchitra2',{service:'occupational',centres:new Set(['suchitraii'])});
 const u=new URL(a.href);assert.equal(u.searchParams.get('service'),'occupational');assert.equal(u.searchParams.get('centre'),'suchitraii');assert.equal(u.searchParams.get('offer'),'existing');assert.equal(u.hash,'#form');assert.equal(b.href,'/enroll-autism-speech-aba-therapies-india?centre=guntur&service=speech');assert.equal(c.href,'tel:+919100181181');assert.equal(u.searchParams.has('utm_source'),false);
});
test('unknown or duplicate explicit centre stays unselected; generic service can still be carried',()=>{
 for(const query of ['centre=unknown','centre=suchitra2&centre=guntur']){const a=anchor('/enroll-autism-speech-aba-therapies-india');applyPaidEnquiryLinks({querySelectorAll:()=>[a],body:{dataset:{}}},'https://www.pinnacleblooms.org/autism-therapy?'+query,{service:'autism',centres:new Set(['suchitraii'])});const u=new URL(a.href);assert.equal(u.searchParams.has('centre'),false);assert.equal(u.searchParams.get('service'),'autism');}
});
test('Speech link handoff preserves exact existing fields, call links and explicit centre links',()=>{const original='https://www.pinnacleblooms.org/top-speech-therapy-center-india-proven-improvement-rate?'+query(cases[0][0]),a=anchor('/enroll-autism-speech-aba-therapies-india?entry=speech-assessment&gclid=fixtureClick&gbraid=fixtureBraid&utm_term=fixture#speech-assessment-enquiry'),b=anchor('/enroll-autism-speech-aba-therapies-india?centre=guntur&service=speech'),c=anchor('tel:+919100181181'),d=anchor('/speech-therapy/service-information');const document={querySelectorAll:()=>[a,b,c,d],body:{dataset:{}}};assert.equal(applyPaidEnquiryLinks(document,original,{service:'speech',centres:new Set(['khajaguda'])}),2);const u=new URL(a.href);assert.equal(u.searchParams.get('centre'),'khajaguda');assert.equal(u.searchParams.get('entry'),'speech-assessment');assert.equal(u.searchParams.get('gclid'),'fixtureClick');assert.equal(u.searchParams.get('gbraid'),'fixtureBraid');assert.equal(u.searchParams.get('utm_term'),'fixture');assert.equal(u.hash,'#speech-assessment-enquiry');assert.equal(b.href,'/enroll-autism-speech-aba-therapies-india?centre=guntur&service=speech');assert.equal(c.href,'tel:+919100181181');assert.equal(new URL(d.href).searchParams.get('centre'),'khajaguda');assert.equal(document.body.dataset.paidLocality,PAID_LOCALITY_CONTRACT);});
