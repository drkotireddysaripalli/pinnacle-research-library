import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const source = fs.readFileSync('public/pinnacle-pages-scripts/speech-measurement.js','utf8');
const key='pinnacle-speech-analytics-v1';
function harness({origin='https://www.pinnacleblooms.org',path='/top-speech-therapy-center-india-proven-improvement-rate',gpc=false,saved,storageThrows=false,variant='service'}={}){
 const listeners={},buttons={},scripts=[],cookies=[],writes=[];
 const panel={hidden:true},status={textContent:''};
 const choices=['accepted','declined'].map(value=>({dataset:{measurementChoice:value},disabled:false,addEventListener:(_,cb)=>buttons[value]=cb}));
 const doc={body:{dataset:{pageVariant:variant}},querySelector:s=>s==='[data-speech-measurement]'?panel:status,querySelectorAll:()=>choices,createElement:()=>({}),head:{append:x=>scripts.push(x)},addEventListener:(event,fn)=>listeners[event]=fn};
 Object.defineProperty(doc,'cookie',{get:()=> 'ps_ga=123; ph_ga=keep; unrelated=keep',set:value=>cookies.push(value)});
 const store=new Map(saved?[[key,JSON.stringify(saved)]]:[]);
 const win={};
 vm.runInNewContext(source,{window:win,document:doc,location:{origin,pathname:path,href:origin+path+'?utm_term=private-child-detail&gclid=secret'},navigator:{globalPrivacyControl:gpc},localStorage:{getItem:k=>{if(storageThrows)throw Error();return store.get(k)||null;},setItem:(k,v)=>{if(storageThrows)throw Error();writes.push([k,v]);store.set(k,v);}},Date,Set,JSON,URL});
 return {win,scripts,cookies,writes,panel,status,choices,choose:value=>buttons[value](),click:(placement,href)=>listeners.click({target:{closest:()=>({dataset:{cta:placement},getAttribute:()=>href})}}),events:()=>Array.from(win.dataLayer||[],x=>Array.from(x)).filter(x=>x[0]==='event')};
}
test('no analytics before consent; valid consent sends only fixed CTA fields',()=>{
 const h=harness();h.click('hero-call','tel:+919100181181');assert.equal(h.scripts.length,0);assert.equal(h.events().length,0);
 h.choose('accepted');assert.equal(h.scripts.length,1);h.click('hero-call','tel:+919100181181');h.click('hero-assessment','https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india?entry=speech-assessment#speech-assessment-enquiry');h.click('header-enrol','https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india');
 assert.deepEqual(h.events().map(x=>x[1]),['page_view','phone_link_click','enquiry_link_click','enquiry_link_click']);
 const serialized=JSON.stringify(h.win.dataLayer);assert.ok(!serialized.includes('private-child-detail'));assert.ok(!serialized.includes('gclid'));assert.ok(!serialized.includes('secret'));
 assert.ok(h.events().every(x=>x[2].page_referrer===''&&!x[2].page_location.includes('?')));
});
test('unknown destinations and placements are ignored without blocking navigation',()=>{
 const h=harness();h.choose('accepted');h.click('hero-call','tel:+911234');h.click('not-approved','tel:+919100181181');h.click('hero-assessment','https://evil.example/enroll');h.click('hero-assessment','https://www.pinnacleblooms.org/enroll?name=private');assert.equal(h.events().length,1);
});
test('all verified centre links are measured after consent without exporting centre or query values',()=>{
 const centres=JSON.parse(fs.readFileSync('src/data/centre-directory.json','utf8')).filter(c=>c.facilityId);
 const ids=JSON.parse(source.match(/const centreIds = (\[[^\n]+\]);/)[1]);
 assert.deepEqual(ids,centres.map(c=>c.id));
 const h=harness();const href=id=>'https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india?entry=speech-assessment&centre='+id+'#speech-assessment-enquiry';
 h.click('centre-enquiry',href('annanagar'));assert.equal(h.events().length,0);
 h.choose('accepted');for(const c of centres)h.click('centre-enquiry',href(c.id));
 for(const placement of ['directory-national-call','centre-national-call','centre-enquiry'])h.click(placement,'tel:+919100181181');
 assert.equal(h.events().filter(x=>x[1]==='enquiry_link_click').length,59);
 assert.equal(h.events().filter(x=>x[1]==='phone_link_click').length,3);
 const count=h.events().length;h.click('centre-enquiry',href('unverified'));h.click('centre-enquiry',href('annanagar').replace('#','&name=private#'));h.click('centre-enquiry',href('annanagar').replace('www.pinnacleblooms.org','evil.example'));
 assert.equal(h.events().length,count);assert(!JSON.stringify(h.events()).includes('centre='));assert(!JSON.stringify(h.events()).includes('annanagar'));
 h.choose('declined');h.click('centre-enquiry',href('annanagar'));assert.equal(h.events().length,count);
});
test('withdrawal stops events and clears only owned cookies',()=>{
 const h=harness();h.choose('accepted');h.choose('declined');h.click('hero-call','tel:+919100181181');assert.equal(h.events().length,1);assert.ok(h.cookies.length>0);assert.ok(h.cookies.every(c=>c.startsWith('ps_ga=')));
});
test('GPC overrides stored or new acceptance',()=>{
 const h=harness({gpc:true,saved:{value:'accepted',at:Date.now()}});h.choose('accepted');h.click('hero-call','tel:+919100181181');assert.equal(h.scripts.length,0);assert.equal(h.events().length,0);assert.ok(h.choices[0].disabled);
});
test('local preview and unrelated routes never send analytics',()=>{
 for(const opts of [{origin:'http://127.0.0.1:4326',path:'/'},{path:'/payonline'},{path:'/speech-therapy-extra'}]){const h=harness(opts);h.choose('accepted');h.click('hero-call','tel:+919100181181');assert.equal(h.scripts.length,0);assert.equal(h.writes.length,0);}
});
test('expired or future consent does not activate; restored consent keeps original expiry',()=>{
 for(const at of [Date.now()-181*86400000,Date.now()+86400000]) assert.equal(harness({saved:{value:'accepted',at}}).scripts.length,0);
 const h=harness({saved:{value:'accepted',at:Date.now()-86400000}});assert.equal(h.scripts.length,1);assert.equal(h.writes.length,0);
});
test('unavailable storage does not interrupt choice or CTA handling',()=>{
 const h=harness({storageThrows:true});assert.equal(h.scripts.length,0);h.choose('accepted');h.click('hero-call','tel:+919100181181');assert.equal(h.events().length,2);
});

test('page variant accepts only the two fixed values',()=>{
 for(const variant of ['service','focused','private-value']){const h=harness({variant});h.choose('accepted');assert.equal(h.events()[0][2].page_variant,variant==='focused'?'focused':'service');}
});

test('public speech guides measure their exact canonical without visitor query values',()=>{
 for(const path of ['/speech-therapy/service-information','/speech-therapy/first-visit-guide','/speech-therapy/teacher-observation-guide']){
  const h=harness({path});h.choose('accepted');h.click('footer-call','tel:+919100181181');
  assert.equal(h.events().length,2);assert(h.events().every(e=>e[2].page_location==='https://www.pinnacleblooms.org'+path));
  assert(!JSON.stringify(h.events()).includes('private-child-detail'));
 }
 const preview=harness({path:'/pinnacle-pages-preview/enrolment'});preview.choose('accepted');assert.equal(preview.events().length,0);
});
test('managed therapy pages use service-specific groups and accept only their own enquiry service',()=>{
 const pages=[
  ['/top-speech-therapy-center-india-proven-improvement-rate','speech_therapy','speech'],
  ['/best-occupational-therapy-center-india-proven-improvement-rate','occupational_therapy','occupational'],
  ['/best-aba-therapy-center-india-proven-improvement-rate','aba_therapy','aba'],
  ['/best-special-education-center-call-9100181181','special_education','education']
 ];
 for(const [path,group,service] of pages){
  const h=harness({path});h.choose('accepted');
  h.click('hero-assessment',`https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india?service=${service}`);
  h.click('hero-assessment','https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india?service=wrong');
  assert.deepEqual(h.events().map(e=>e[1]),['page_view','enquiry_link_click']);
  assert.equal(h.events()[0][2].page_group,group);
 }
});
