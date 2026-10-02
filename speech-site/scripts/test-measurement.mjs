import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const source = fs.readFileSync('public/pinnacle-pages-scripts/speech-measurement.js','utf8');
const key='pinnacle-speech-analytics-v1';
const canonicalEnrolment='/enroll-autism-speech-aba-therapies-india';
function harness({origin='https://www.pinnacleblooms.org',path='/top-speech-therapy-center-india-proven-improvement-rate',gpc=false,saved,storageThrows=false,variant='service',commerceCatalogue={}}={}){
 const listeners={},buttons={},scripts=[],cookies=[],writes=[];
 const panel={hidden:true},status={textContent:''};
 const choices=['accepted','declined'].map(value=>({dataset:{measurementChoice:value},disabled:false,addEventListener:(_,cb)=>buttons[value]=cb}));
 const doc={body:{dataset:{pageVariant:variant}},querySelector:s=>s==='[data-speech-measurement]'?panel:s==='[data-book-commerce]'?{dataset:{cartCatalogue:JSON.stringify(commerceCatalogue)}}:status,querySelectorAll:()=>choices,createElement:()=>({}),head:{append:x=>scripts.push(x)},addEventListener:(event,fn)=>listeners[event]=fn};
 Object.defineProperty(doc,'cookie',{get:()=> 'ps_ga=123; ph_ga=keep; unrelated=keep',set:value=>cookies.push(value)});
 const store=new Map(saved?[[key,JSON.stringify(saved)]]:[]);
 const win={};
 vm.runInNewContext(source,{window:win,document:doc,location:{origin,pathname:path,href:origin+path+'?utm_term=private-child-detail&gclid=secret'},navigator:{globalPrivacyControl:gpc},localStorage:{getItem:k=>{if(storageThrows)throw Error();return store.get(k)||null;},setItem:(k,v)=>{if(storageThrows)throw Error();writes.push([k,v]);store.set(k,v);}},Date,Set,JSON,URL});
 return {win,scripts,cookies,writes,panel,status,choices,choose:value=>buttons[value](),accepted:()=>listeners['pinnacle:enquiry-accepted']?.(),click:(placement,href)=>listeners.click({target:{closest:()=>({dataset:{cta:placement},getAttribute:()=>href})}}),commerce:(name,items,extra={})=>listeners['pinnacle:commerce']?.({detail:{name,items,...extra}}),events:()=>Array.from(win.dataLayer||[],x=>Array.from(x)).filter(x=>x[0]==='event')};
}
test('no analytics before consent; valid consent sends only fixed CTA fields',()=>{
 const h=harness();h.click('hero-call','tel:+919100181181');assert.equal(h.scripts.length,0);assert.equal(h.events().length,0);
 h.choose('accepted');assert.equal(h.scripts.length,1);h.click('hero-call','tel:+919100181181');h.click('hero-assessment','https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india?entry=speech-assessment#speech-assessment-enquiry');h.click('header-enrol','https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india');
 assert.deepEqual(h.events().map(x=>x[1]),['page_view','phone_link_click','enquiry_link_click','enquiry_link_click']);
 const serialized=JSON.stringify(h.win.dataLayer);assert.ok(!serialized.includes('private-child-detail'));assert.ok(!serialized.includes('gclid'));assert.ok(!serialized.includes('secret'));
 assert.ok(h.events().every(x=>x[2].page_referrer===''&&!x[2].page_location.includes('?')));
});

test('accepted enquiries send one fixed consented event on the enrolment route only',()=>{
 const h=harness({path:canonicalEnrolment});h.accepted();assert.equal(h.events().length,0);
 h.choose('accepted');h.accepted();h.accepted();
 assert.deepEqual(h.events().map(e=>e[1]),['page_view','enquiry_accepted']);
 assert.equal(h.events()[1][2].page_group,'enrolment');
 assert.equal(h.events()[1][2].destination,'existing_enrolment_workflow');
 assert.equal(h.events()[1][2].page_location,'https://www.pinnacleblooms.org'+canonicalEnrolment);
 const text=JSON.stringify(h.events());for(const excluded of ['private-child-detail','requestId','contact','phone','centre=','service=','gclid'])assert(!text.includes(excluded));
 for(const opts of [{path:canonicalEnrolment,gpc:true},{path:'/pinnacle-pages-preview/enrolment'},{path:canonicalEnrolment,origin:'http://127.0.0.1:4340'},{path:'/autism-therapy'}]){
  const b=harness(opts);b.choose('accepted');b.accepted();assert(!b.events().some(e=>e[1]==='enquiry_accepted'));
 }
 const declined=harness({path:canonicalEnrolment});declined.choose('accepted');declined.choose('declined');declined.accepted();assert(!declined.events().some(e=>e[1]==='enquiry_accepted'));
});

test('every current managed public route has a coarse measurement configuration',async()=>{
 const routes=await import('../deployment/speech-handler.mjs');
 const paths=[routes.ENROLMENT_CANONICAL,routes.SPEECH_CANONICAL,routes.OCCUPATIONAL_CANONICAL,routes.ABA_CANONICAL,routes.SPECIAL_EDUCATION_CANONICAL,routes.AUTISM_CANONICAL,routes.ASSESSMENT_CANONICAL,routes.CENTERS_CANONICAL,...Object.keys(routes.CENTRE_DETAIL_ROUTES),...Object.keys(routes.PUBLIC_DOCUMENT_ROUTES),...routes.PINNACLEAI_PATHS];
 for(const path of paths){const h=harness({path});h.choose('accepted');h.click('footer-call','tel:+919100181181');assert.deepEqual(h.events().map(e=>e[1]),['page_view','phone_link_click'],path);assert(!JSON.stringify(h.events()).includes('private-child-detail'));}
});

test('new life and PinnacleAI placements record only the national call destination',()=>{
 for(const path of ['/self-sufficient','/mainstream','/pinnacleai'])for(const placement of ['family-journey-call','example-call','pinnacleai-call','pinnacleai-close-call']){
  const h=harness({path});h.choose('accepted');h.click(placement,'tel:+919100181181');assert.equal(h.events()[1][1],'phone_link_click');
 }
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
test('managed therapy pages and centre directory use their own groups and enquiry service',()=>{
 const pages=[
  ['/top-speech-therapy-center-india-proven-improvement-rate','speech_therapy','speech'],
  ['/best-occupational-therapy-center-india-proven-improvement-rate','occupational_therapy','occupational'],
  ['/best-aba-therapy-center-india-proven-improvement-rate','aba_therapy','aba'],
  ['/best-special-education-center-call-9100181181','special_education','education'],
  ['/autism-therapy','autism_therapy','autism'],
  ['/centers','centre_directory','centres']
 ];
 for(const [path,group,service] of pages){
  const h=harness({path});h.choose('accepted');
  h.click('hero-assessment',`https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india?service=${service}`);
  h.click('hero-assessment','https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india?service=wrong');
  assert.deepEqual(h.events().map(e=>e[1]),['page_view','enquiry_link_click']);
  assert.equal(h.events()[0][2].page_group,group);
 }
});
test('rendered occupational actions emit coarse consented events and no private destination values',()=>{
 const html=fs.readFileSync('dist/best-occupational-therapy-center-india-proven-improvement-rate.html','utf8');
 const links=[...html.matchAll(/<a\b[^>]*>/g)].map(([tag])=>[tag.match(/\bdata-cta="(ot-[^"]+)"/)?.[1],tag.match(/\bhref="([^"]+)"/)?.[1]]).filter(([placement,href])=>placement&&href).map(([placement,href])=>[placement,href.replaceAll('&amp;','&')]);
 const placements=new Set(links.map(([placement])=>placement));
 for(const expected of ['ot-hero-call','ot-first-call','ot-final-call','ot-final-enrol','ot-final-centres','ot-share-whatsapp'])assert(placements.has(expected),`OT action ${expected} is absent from rendered HTML`);
 const h=harness({path:'/best-occupational-therapy-center-india-proven-improvement-rate'});
 for(const [placement,href] of links)h.click(placement,href);
 assert.equal(h.events().length,0);
 h.choose('accepted');for(const [placement,href] of links)h.click(placement,href);
 const names=h.events().map(event=>event[1]);
 assert.equal(names.filter(name=>name==='phone_link_click').length,3);
 assert.equal(names.filter(name=>name==='enquiry_link_click').length,1);
 assert(names.includes('centre_section_click'));
 assert(names.includes('page_share_click'));
 const serialized=JSON.stringify(h.events());for(const privateValue of ['centre=','service=','text=','private-child-detail'])assert(!serialized.includes(privateValue));
 const count=h.events().length;h.choose('declined');for(const [placement,href] of links)h.click(placement,href);assert.equal(h.events().length,count);
 const blocked=harness({path:'/best-occupational-therapy-center-india-proven-improvement-rate',gpc:true});blocked.choose('accepted');for(const [placement,href] of links)blocked.click(placement,href);assert.equal(blocked.events().length,0);
});
test('rendered ABA actions emit only coarse consented events',()=>{
 const html=fs.readFileSync('dist/best-aba-therapy-center-india-proven-improvement-rate.html','utf8');
 const links=[...html.matchAll(/<a\b[^>]*>/g)].map(([tag])=>[tag.match(/\bdata-cta="(aba-[^"]+)"/)?.[1],tag.match(/\bhref="([^"]+)"/)?.[1]]).filter(([placement,href])=>placement&&href).map(([placement,href])=>[placement,href.replaceAll('&amp;','&')]);
 const placements=new Set(links.map(([placement])=>placement));
 for(const expected of ['aba-first-call','aba-first-centres','aba-final-call','aba-final-centres','aba-final-enrol','aba-share-whatsapp'])assert(placements.has(expected),`ABA action ${expected} is absent from rendered HTML`);
 const h=harness({path:'/best-aba-therapy-center-india-proven-improvement-rate'});
 for(const [placement,href] of links)h.click(placement,href);
 assert.equal(h.events().length,0);
 h.choose('accepted');for(const [placement,href] of links)h.click(placement,href);
 const names=h.events().map(event=>event[1]);
 assert.equal(names.filter(name=>name==='phone_link_click').length,2);
 assert.equal(names.filter(name=>name==='enquiry_link_click').length,1);
 assert.equal(names.filter(name=>name==='centre_section_click').length,2);
 assert.equal(names.filter(name=>name==='page_share_click').length,1);
 const serialized=JSON.stringify(h.events());for(const privateValue of ['centre=','service=','text=','private-child-detail'])assert(!serialized.includes(privateValue));
 const count=h.events().length;h.choose('declined');for(const [placement,href] of links)h.click(placement,href);assert.equal(h.events().length,count);
 const blocked=harness({path:'/best-aba-therapy-center-india-proven-improvement-rate',gpc:true});blocked.choose('accepted');for(const [placement,href] of links)blocked.click(placement,href);assert.equal(blocked.events().length,0);
});
test('rendered Autism first-call actions emit only coarse consented events',()=>{
 const html=fs.readFileSync('dist/autism-therapy.html','utf8');
 const links=[...html.matchAll(/<a\b[^>]*>/g)].map(([tag])=>[tag.match(/\bdata-cta="(autism-[^"]+)"/)?.[1],tag.match(/\bhref="([^"]+)"/)?.[1]]).filter(([placement,href])=>placement&&href).map(([placement,href])=>[placement,href.replaceAll('&amp;','&')]);
 const placements=new Set(links.map(([placement])=>placement));
 for(const expected of ['autism-first-call','autism-first-enquiry'])assert(placements.has(expected),`Autism action ${expected} is absent from rendered HTML`);
 const h=harness({path:'/autism-therapy'});
 for(const [placement,href] of links)h.click(placement,href);
 assert.equal(h.events().length,0);
 h.choose('accepted');for(const [placement,href] of links)h.click(placement,href);
 assert.deepEqual(h.events().map(event=>event[1]),['page_view','phone_link_click','enquiry_link_click']);
 const serialized=JSON.stringify(h.events());for(const privateValue of ['centre=','service=','text=','private-child-detail'])assert(!serialized.includes(privateValue));
 const count=h.events().length;h.choose('declined');for(const [placement,href] of links)h.click(placement,href);assert.equal(h.events().length,count);
 const blocked=harness({path:'/autism-therapy',gpc:true});blocked.choose('accepted');for(const [placement,href] of links)blocked.click(placement,href);assert.equal(blocked.events().length,0);
});
test('centre directory actions stay coarse and never export centre names, hashes or search terms',()=>{
 const h=harness({path:'/centers'});h.choose('accepted');
 for(const placement of ['centre-profile','centre-maps','centre-whatsapp','centre-vcard','centre-share','centre-copy-link','centre-copy-citation'])h.click(placement,'https://www.pinnacleblooms.org/centers#centre-suchitra');
 const events=h.events().filter(event=>event[1]==='centre_directory_action');assert.equal(events.length,7);
 const serialized=JSON.stringify(events);for(const privateValue of ['suchitra','centre-suchitra','private-child-detail'])assert(!serialized.includes(privateValue));
});

test('assessment calls and generic enquiries are consented fixed events',()=>{
 const path='/speech-aba-autism-assessments',call='tel:+919100181181',enquiry='https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india?service=help';
 for(const opts of [{},{gpc:true}]){const h=harness({path,...opts});h.click('hero-call',call);assert.equal(h.events().length,0);h.choose('accepted');h.click('hero-call',call);h.click('hero-assessment',enquiry);if(opts.gpc){assert.equal(h.events().length,0);continue;}assert.deepEqual(h.events().map(event=>event[1]),['page_view','phone_link_click','enquiry_link_click']);const text=JSON.stringify(h.events());assert(!text.includes('private-child-detail')&&!text.includes('secret')&&!text.includes('service=help'));assert(h.events().every(event=>event[2].page_group==='developmental_assessment'));h.choose('declined');h.click('final-call',call);assert.equal(h.events().length,3);}
});

test('centre-detail events omit the branch identity and query values under consent and GPC',()=>{
 for(const [id,slug] of [['suchitra','suchitra-hyderabad-telangana-india'],['dilsukhnagar','dilsukhnagar-hyderabad-telangana-india'],['gurunanak','gurunanak-road-vijayawada-ap-india'],['delhi','south-extension-newdelhi-india'],['ananthapuram','anathapuram-ap-india']]){
 const path='/centers/best-autism-speech-aba-occupational-therapy-center-'+slug;
 for(const opts of [{},{gpc:true}]){
  const h=harness({path,...opts});h.click('hero-call','tel:+919100181181');assert.equal(h.events().length,0);
  h.choose('accepted');h.click('hero-call','tel:+919100181181');h.click('hero-assessment','https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india?service=help&centre='+id);h.click('centre-share','https://www.pinnacleblooms.org'+path);
  if(opts.gpc){assert.equal(h.events().length,0);continue;}
  assert(h.events().length>=3);const body=JSON.stringify(h.events());for(const value of [id,slug,'centre=','service=','private-child-detail','secret'])assert(!body.includes(value));
  assert(h.events().every(event=>event[2].page_location==='https://www.pinnacleblooms.org/centers'));
  const count=h.events().length;h.choose('declined');h.click('final-call','tel:+919100181181');assert.equal(h.events().length,count);
 }
 }
});

const commerceFixture = {
 'PBN-SP-101-EN-PDF': {title:'My Message Matters',path:'/books/speech-communication-101-my-message-matters',price:799,
   editionPaths:['/books/speech-communication-101-my-message-matters','/books/speech-communication-101-my-message-matters-softcover'],
   books:[{sku:'PBN-SP-101-EN-PDF',title:'My Message Matters',sample:'/pinnacle-pages-assets/book-samples-sales-v2-20261002/speech-sample.pdf'}]}
};
const commerceLine = {sku:'PBN-SP-101-EN-PDF',quantity:1,price:799};
test('book ecommerce respects consent, withdrawal, GPC and production routes',()=>{
 const h=harness({path:'/shop',commerceCatalogue:commerceFixture});
 h.commerce('add_to_cart',[commerceLine]);assert.equal(h.events().length,0);
 h.choose('accepted');h.commerce('add_to_cart',[commerceLine]);
 assert.deepEqual(h.events().map(e=>e[1]),['page_view','add_to_cart']);
 h.choose('declined');h.commerce('begin_checkout',[commerceLine]);assert.equal(h.events().length,2);
 for(const opts of [{path:'/shop',gpc:true},{path:'/shop',origin:'http://127.0.0.1:4322'},{path:'/books/unknown'}]){
   const b=harness({...opts,commerceCatalogue:commerceFixture});b.choose('accepted');b.commerce('add_to_cart',[commerceLine]);assert.equal(b.events().length,0);
 }
 const prior=harness({path:'/shop',commerceCatalogue:commerceFixture,saved:{value:'accepted',at:Date.now()}});
 assert.equal(prior.events().length,0);
});
test('book ecommerce reconstructs public item fields and rejects unsupported payloads',()=>{
 const h=harness({path:'/shop',commerceCatalogue:commerceFixture});h.choose('accepted');
 h.commerce('begin_checkout',[{...commerceLine,email:'private@example.test',checkoutUrl:'secret-checkout'}],{phone:'private-phone'});
 const payload=h.events()[1][2];assert.equal(payload.currency,'INR');assert.equal(payload.value,799);assert.equal(payload.items[0].item_id,commerceLine.sku);
 assert(!JSON.stringify(payload).includes('private'));assert(!JSON.stringify(payload).includes('secret'));assert(!JSON.stringify(payload).includes('?'));
 for(const [name,items] of [['purchase',[commerceLine]],['add_to_cart',[{...commerceLine,sku:'UNKNOWN'}]],['add_to_cart',[{...commerceLine,quantity:-1}]],['add_to_cart',[{...commerceLine,price:Infinity}]],['add_to_cart',[{...commerceLine,price:800}]]])h.commerce(name,items);
 assert.equal(h.events().length,2);
});
test('product views and sample clicks are measured once consent is present',()=>{
 const h=harness({path:commerceFixture[commerceLine.sku].path,commerceCatalogue:commerceFixture});h.choose('accepted');h.choose('accepted');
 assert.deepEqual(h.events().map(e=>e[1]),['page_view','view_item']);
 h.click('sample',commerceFixture[commerceLine.sku].books[0].sample);
 assert.equal(h.events().at(-1)[1],'sample_preview');
 h.click('sample',commerceFixture[commerceLine.sku].books[0].sample+'?name=private');assert.equal(h.events().length,3);
 const print=harness({path:commerceFixture[commerceLine.sku].editionPaths[1],commerceCatalogue:commerceFixture});print.choose('accepted');
 assert.deepEqual(print.events().map(e=>e[1]),['page_view']);
});


test('authorized GA4 main stream receives one page view after repeated acceptance',()=>{
 const h=harness();h.choose('accepted');h.choose('accepted');
 assert.equal(h.scripts.length,1);
 assert.equal(h.scripts[0].src,'https://www.googletagmanager.com/gtag/js?id=G-2BYLRLFRDJ');
 assert.equal(h.events().filter(e=>e[1]==='page_view').length,1);
 assert(h.events().every(e=>e[2].send_to==='G-2BYLRLFRDJ'));
 const config=Array.from(h.win.dataLayer,x=>Array.from(x)).find(x=>x[0]==='config');
 assert.equal(config[1],'G-2BYLRLFRDJ');assert.equal(config[2].send_page_view,false);
});

test('all native and English purchase book routes receive consented commerce events',()=>{
 const native=JSON.parse(fs.readFileSync('src/data/book-locales.json','utf8'));
 const merchant=JSON.parse(fs.readFileSync('src/data/book-merchant-editions.json','utf8'));
 for(const entry of [...native,...merchant.map(item=>({...native.find(book=>book.sku===item.sku),...item}))]){
  const catalogue={[entry.sku]:{title:entry.title,path:entry.path,price:entry.price,editionPaths:[entry.path]}};
  const line={sku:entry.sku,quantity:1,price:entry.price};
  const h=harness({path:entry.path,commerceCatalogue:catalogue});
  h.commerce('add_to_cart',[line]);assert.equal(h.events().length,0,entry.path);
  h.choose('accepted');h.commerce('add_to_cart',[line]);
  assert.deepEqual(h.events().map(e=>e[1]),['page_view','view_item','add_to_cart'],entry.path);
  assert(h.events().every(e=>e[2].send_to==='G-2BYLRLFRDJ'&&e[2].page_location==='https://www.pinnacleblooms.org'+entry.path),entry.path);
  assert(!JSON.stringify(h.events()).includes('private-child-detail'));
  h.choose('declined');h.commerce('begin_checkout',[line]);assert.equal(h.events().length,3,entry.path);
  const g=harness({path:entry.path,commerceCatalogue:catalogue,gpc:true});g.choose('accepted');g.commerce('add_to_cart',[line]);assert.equal(g.events().length,0,entry.path);
 }
 for(const path of ['/books/hi','/books/te']){
  const h=harness({path,commerceCatalogue:commerceFixture});h.choose('accepted');h.commerce('add_to_cart',[commerceLine]);
  assert.deepEqual(h.events().map(e=>e[1]),['page_view','add_to_cart'],path);
 }
});

test('native route expansion rejects unknown paths and malformed catalogue destinations',()=>{
 for(const path of ['/books/hi/unpublished','/books/te/unpublished','/books/editions/hi/unpublished','/books/editions/te/unpublished','/books/fr/speech-101']){
  const h=harness({path,commerceCatalogue:commerceFixture});h.choose('accepted');h.commerce('add_to_cart',[commerceLine]);assert.equal(h.events().length,0,path);
 }
 for(const path of ['https://evil.example/books/hi/speech-101','/books/fr/speech-101','/books/hi/speech-101?name=private','/books/hi/speech-101#private','/books/hi/../speech-101','/books/editions/te/unknown/nested']){
  const catalogue={[commerceLine.sku]:{...commerceFixture[commerceLine.sku],path,editionPaths:[path]}};
  const h=harness({path,commerceCatalogue:catalogue});h.choose('accepted');h.commerce('add_to_cart',[commerceLine]);assert.equal(h.events().length,0,path);
 }
});
