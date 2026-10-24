import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import {CENTRE_OPERATING_HOLDS} from '../public/pinnacle-pages-scripts/centre-operating-holds.mjs';
const source=fs.readFileSync(process.env.PINNACLE_DIRECT_CALL_SOURCE||new URL('../public/pinnacle-pages-scripts/speech-measurement.js',import.meta.url),'utf8');
const directory=JSON.parse(fs.readFileSync(new URL('../src/data/centre-directory.json',import.meta.url),'utf8'));
const heldPhones=new Set(CENTRE_OPERATING_HOLDS.map(c=>c.directTelephone)),heldIds=new Set(CENTRE_OPERATING_HOLDS.map(c=>c.id));
const published=directory.filter(c=>c.directTelephone&&!heldPhones.has(c.directTelephone)&&!heldIds.has(c.id));
const origin='https://www.pinnacleblooms.org',speech='/top-speech-therapy-center-india-proven-improvement-rate';
function harness({pathname=speech,search='',qaAt,reload=false}={}){
 const listeners={},scripts=[],session=new Map(),local=new Map(),location=new URL(origin+pathname+search);
 if(qaAt)session.set('pinnacle-validation-v1',String(qaAt));
 const document={title:'Pinnacle',referrer:'',body:{dataset:{pageVariant:'service'}},currentScript:{nonce:''},visibilityState:'visible',
  querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>({setAttribute(k,v){this[k]=v;},remove(){}}),head:{append:s=>scripts.push(s)},
  addEventListener(n,f){(listeners[n]||=[]).push(f);},dispatchEvent(e){for(const f of listeners[e.type]||[])f(e);}};
 Object.defineProperty(document,'cookie',{get:()=>'',set:()=>{}});
 const window={addEventListener(n,f){(listeners['window:'+n]||=[]).push(f);}};
 const storage=map=>({getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)});
 const context={window,document,location,localStorage:storage(local),sessionStorage:storage(session),navigator:{},URL,URLSearchParams,Date,Set,Map,JSON,Event,Math,Number,console};
 const run=()=>vm.runInNewContext(source,context,{importModuleDynamically:()=>Promise.reject(Error('No network in offline fixture'))});run();if(reload)run();
 const events=()=>Array.from(window.dataLayer||[],v=>Array.from(v)).filter(v=>v[0]==='event');
 const signals=()=>Array.from(window.dataLayer||[]).filter(v=>v?.event==='pinnacle_contact_intent');
 function click({href,cta,cardId,localArea=false,forwarded=false,extra={}}){
  const link={href,dataset:{...extra,...(cta?{cta}:{}),...(forwarded?{pinnacleAdCallTarget:'central'}:{})},getAttribute:k=>k==='href'?href:null,
   closest:s=>s==='a[href]'?link:s==='#centre-cards .directory-card[id]'?(cardId?{id:cardId}:null):s==='#local-area'?(localArea?{id:'local-area'}:null):s==='[data-cta]'&&cta?link:null};
  const e={isTrusted:true,target:{closest:s=>link.closest(s)},preventDefault(){assert.fail('Native navigation intercepted');},stopPropagation(){assert.fail('Native navigation intercepted');}};
  const before=events().length;for(const f of listeners.click||[])f(e);return{link,events:events().slice(before)};
 }
 return{click,events,signals,window,scripts};
}
const phoneEvents=r=>r.events.filter(e=>e[1]==='phone_link_click');
test('all 54 published direct-centre links emit one safe centre intent with no vendor conversion',()=>{
 assert.equal(published.length,54);assert(published.some(c=>c.id==='gajuwaka'));assert(published.some(c=>c.id==='jagadamba'));
 const h=harness();for(const c of published){const href='tel:'+c.directTelephone,r=h.click({href,cardId:'centre-'+c.id});const events=phoneEvents(r);assert.equal(events.length,1,c.id);assert.equal(events[0][2].publiccentre_id,c.id);assert.equal(events[0][2].destination,'centre_direct');assert.equal(events[0][2].link_placement,'centre-direct-call');assert.equal(r.link.href,href);assert(!JSON.stringify(events).includes(c.directTelephone));assert(!r.events.some(e=>e[1]==='google_ads_phone_click'));}assert.equal(h.signals().length,0);
});
test('Attapur local alternative uses its exact published profile and keeps the dialled number',()=>{
 const c=published.find(c=>c.id==='attapur'),h=harness({pathname:new URL(c.profileUrl).pathname});const href='tel:'+c.directTelephone,r=h.click({href,cta:'local-centre-call',localArea:true});
 assert.equal(phoneEvents(r).length,1);assert.equal(phoneEvents(r)[0][2].publiccentre_id,'attapur');assert.equal(phoneEvents(r)[0][2].link_placement,'local-centre-call');assert.equal(r.link.href,href);assert.equal(h.signals().length,0);
});
test('national and forwarded central calls retain their existing classification',()=>{
 const h=harness();for(const c of [{href:'tel:+919100181181',cardId:'centre-suchitra'},{href:'tel:+18005550100',cardId:'centre-suchitra',forwarded:true}]){const r=h.click(c);assert.equal(phoneEvents(r).length,1);assert.equal(phoneEvents(r)[0][2].destination,'national_helpline');assert(!Object.hasOwn(phoneEvents(r)[0][2],'publiccentre_id'));assert.equal(r.link.href,c.href);}
});
test('unknown centres, wrong containers and malformed telephone URLs are not counted',()=>{
 const h=harness();for(const c of [{href:'tel:+919100222183',cardId:'centre-unknown'},{href:'tel:+919100222183'},{href:'tel:+919100222183?secret=x',cardId:'centre-suchitra'},{href:'tel:+919100222183;ext=22',cardId:'centre-suchitra'},{href:'javascript:alert(1)',cardId:'centre-suchitra'},{href:'tel:12',cardId:'centre-suchitra'},{href:'tel:+919100222183',cardId:'not-centre-suchitra'}])assert.equal(phoneEvents(h.click(c)).length,0);
});
test('local-centre markers require the local section and a known centre profile',()=>{
 const href='tel:+919618222944';for(const options of [{pathname:speech},{pathname:'/centers/not-a-published-profile'}])assert.equal(phoneEvents(harness(options).click({href,cta:'local-centre-call',localArea:true})).length,0);
 const c=published.find(c=>c.id==='attapur');assert.equal(phoneEvents(harness({pathname:new URL(c.profileUrl).pathname}).click({href,cta:'local-centre-call'})).length,0);
});
test('held centre identities remain excluded from direct-call metadata',()=>{
 const h=harness();for(const c of CENTRE_OPERATING_HOLDS)assert.equal(phoneEvents(h.click({href:'tel:'+c.directTelephone,cardId:'centre-'+c.id})).length,0);
});
test('QA flags and retained QA suppress direct events while navigation still works',()=>{
 for(const options of [{search:'?qa_mode=1'},{search:'?measurement_mode=qa'},{search:'?validation_test=1'},{qaAt:Date.now()}]){const h=harness(options),href='tel:+919100222183',r=h.click({href,cardId:'centre-suchitra'});assert.equal(phoneEvents(r).length,0);assert.equal(r.link.href,href);assert.equal(h.signals().length,0);}
});
test('paid source survives but phone, text and arbitrary metadata never enter the event',()=>{
 const h=harness({search:'?utm_source=google&utm_medium=cpc&utm_campaign=Speech&gclid=offline-fixture'}),r=h.click({href:'tel:+919100222183',cardId:'centre-suchitra',extra:{phone:'private-number',patient:'private-patient',centreId:'invented'}}),p=phoneEvents(r)[0][2];
 assert.equal(p.campaign_source,'google');assert.equal(p.campaign_medium,'cpc');assert.equal(p.campaign_name,'Speech');assert.equal(p.publiccentre_id,'suchitra');
 for(const key of ['phone','href','text','patient','centreId'])assert(!Object.hasOwn(p,key));assert(!JSON.stringify(p).includes('private-'));
});
test('reinstalling the canonical collector does not duplicate a direct click',()=>{
 const h=harness({reload:true});assert.equal(phoneEvents(h.click({href:'tel:+919100222183',cardId:'centre-suchitra'})).length,1);
});
