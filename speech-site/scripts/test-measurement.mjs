import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
import {KNOWN_GOOGLE_ADS_CAMPAIGN_IDS,normaliseAcquisition} from '../public/pinnacle-pages-scripts/enrolment-source.mjs';

const source=fs.readFileSync('public/pinnacle-pages-scripts/speech-measurement.js','utf8');
const origin='https://www.pinnacleblooms.org';
const enrolment='/enroll-autism-speech-aba-therapies-india';
const sourceKey='pinnacle-enquiry-source-v1';

function harness({
  url=origin+'/top-speech-therapy-center-india-proven-improvement-rate',
  variant='service',
  referrer='',
  sharedStore,
  qaAt,
  gpc=false,
  contact=false,
  callback=false,
  commerceCatalogue={},
  existingTag=false
}={}){
  const location=new URL(url),listeners={},scripts=[],cookies=[],dispatched=[];
  const store=sharedStore||new Map(),session=new Map();
  if(qaAt!==undefined)session.set('pinnacle-validation-v1',String(qaAt));
  const document={
    title:'Pinnacle',
    referrer,
    visibilityState:'visible',
    currentScript:{nonce:''},
    body:{dataset:{pageVariant:variant}},
    querySelector(selector){
      if(selector.startsWith('#pinnacle-contact['))return contact?{dataset:{contactContract:'durable-contact-v1'}}:null;
      if(selector.startsWith('#pinnacle-enrolment['))return callback?{dataset:{apiEndpoint:'/api/enrolment'}}:null;
      if(selector==='[data-book-commerce]')return {dataset:{cartCatalogue:JSON.stringify(commerceCatalogue)}};
      if(selector.includes('googletagmanager.com/gtag/js'))return existingTag?{}:null;
      if(selector==='script[data-pinnacle-cheq-loader]')return scripts.some(item=>item['data-pinnacle-cheq-loader']!==undefined)?{}:null;
      return null;
    },
    querySelectorAll(){return [];},
    createElement(){return {setAttribute(k,v){this[k]=v;},remove(){this.removed=true;}};},
    head:{append(element){scripts.push(element);}},
    addEventListener(name,fn){
      const prior=listeners[name];
      listeners[name]=event=>{prior?.(event);fn(event);};
    },
    dispatchEvent(event){dispatched.push(event);listeners[event.type]?.(event);return true;}
  };
  Object.defineProperty(document,'cookie',{get:()=> 'ps_ga=existing; unrelated=keep',set:value=>cookies.push(value)});
  const window={
    addEventListener(name,fn){
      const prior=listeners['window:'+name];
      listeners['window:'+name]=event=>{prior?.(event);fn(event);};
    }
  };
  const localStorage={
    getItem:key=>store.get(key)??null,
    setItem:(key,value)=>store.set(key,value),
    removeItem:key=>store.delete(key)
  };
  const sessionStorage={getItem:key=>session.get(key)??null,setItem:(key,value)=>session.set(key,value)};
  const sandbox={window,document,location,navigator:{globalPrivacyControl:gpc},localStorage,sessionStorage,Date,Set,Map,JSON,URL,Event,Math,Number,console};
  vm.runInNewContext(source,sandbox,{importModuleDynamically:()=>Promise.reject(new Error('functional routing import is outside measurement test'))});
  const commands=()=>Array.from(window.dataLayer||[],entry=>Array.isArray(entry)?entry:Array.from(entry));
  const events=()=>commands().filter(entry=>Array.isArray(entry)&&entry[0]==='event');
  const click=(placement,href,dataset={},isTrusted=true)=>{
    const link={
      href,dataset:{cta:placement,...dataset},
      getAttribute:key=>key==='href'?href:null,
      closest(){return this;}
    };
    const event={isTrusted,target:{closest:()=>link},preventDefault(){throw Error('native navigation was intercepted');},stopPropagation(){throw Error('native navigation was intercepted');}};
    listeners.click?.(event);return link;
  };
  const dispatch=(name,detail)=>listeners[name]?.({detail});
  return {
    window,document,location,store,session,scripts,cookies,dispatched,commands,events,click,dispatch,
    accepted:(receipt={schemaVersion:1,requestId:'qa-request-0001',id:'qa-receipt-0001'},extra={})=>dispatch('pinnacle:enquiry-accepted',{receipt,...extra}),
    contactAccepted:(receipt={schemaVersion:1,requestId:'qa-contact-0001',id:'qa-contact-receipt-0001'},extra={})=>dispatch('pinnacle:contact-accepted',{contract:'website_contact_v1',receipt,...extra}),
    commerce:(name,items)=>dispatch('pinnacle:commerce',{name,items}),
    googleScripts:()=>scripts.filter(item=>item.src?.startsWith('https://www.googletagmanager.com/')),
    localScripts:()=>scripts.filter(item=>item.src?.startsWith('/'))
  };
}

const command=(h,name,target)=>h.commands().find(entry=>entry[0]===name&&(target===undefined||entry[1]===target));

test('visitor choice UI, choice state and GPC gates are absent',()=>{
  for(const token of ['data-measurement-choice','data-speech-measurement','pinnacle-speech-analytics-v1','globalPrivacyControl','Allow analytics','Keep analytics off']){
    assert.equal(source.includes(token),false,token);
  }
});

test('eligible public pages start automatic GA4 with granted storage and denied personalisation',()=>{
  for(const gpc of [false,true]){
    const h=harness({gpc});
    assert.equal(h.googleScripts().length,1);
    assert.equal(h.googleScripts()[0].src,'https://www.googletagmanager.com/gtag/js?id=G-2BYLRLFRDJ');
    const consent=h.commands().filter(entry=>entry[0]==='consent');
    assert.equal(consent.length,2);
    for(const entry of consent)for(const key of ['analytics_storage','ad_storage','ad_user_data'])assert.equal(entry[2][key],'granted');
    assert(consent.every(entry=>entry[2].ad_personalization==='denied'));
    assert(h.commands().some(entry=>entry[0]==='set'&&entry[1]==='ads_data_redaction'&&entry[2]===false));
    assert.equal(h.events().filter(entry=>entry[1]==='page_view').length,1);
    assert.equal(h.events().find(entry=>entry[1]==='page_view')[2].measurement_mode,'automatic');
  }
});

test('an existing Google tag is reused while configuration and the page view still run',()=>{
  const h=harness({existingTag:true});
  assert.equal(h.googleScripts().length,0);assert(command(h,'config','G-2BYLRLFRDJ'));assert.equal(h.events().filter(entry=>entry[1]==='page_view').length,1);
});

test('private, authenticated-style and unsupported paths stay uninstrumented',()=>{
  for(const url of [
    origin+'/account',origin+'/auth/session',origin+'/patients/private-record',
    origin+'/documents/private-record',origin+'/api/enrolment',origin+'/unknown'
  ]){
    const h=harness({url});assert.equal(h.googleScripts().length,0,url);assert.equal(h.events().length,0,url);assert.equal(typeof h.window.pinnacleEnquirySource==='function'?h.window.pinnacleEnquirySource():null,null,url);
  }
  const privateAsk=harness({url:'https://pinnacleblooms.org/ask/account',variant:'ask'});
  assert.equal(privateAsk.events().length,0);assert.equal(privateAsk.googleScripts().length,0);
});

test('labelled QA and tab-carried QA do not load Google or emit events',()=>{
  for(const options of [
    {url:origin+'/best-aba-therapy-center-india-proven-improvement-rate?validation_test=measurement_20261019'},
    {url:origin+'/best-aba-therapy-center-india-proven-improvement-rate',qaAt:Date.now()-1000}
  ]){
    const h=harness(options);assert.equal(h.googleScripts().length,0);assert.equal(h.events().length,0);assert.equal(h.store.has(sourceKey),false);
  }
});

test('safe Google Ads UTMs and click IDs survive in the source envelope and coarse GA configuration',()=>{
  const campaign=KNOWN_GOOGLE_ADS_CAMPAIGN_IDS[0];
  const h=harness({url:origin+'/best-aba-therapy-center-india-proven-improvement-rate?utm_source=google&utm_medium=cpc&utm_campaign=Regional_ABA&utm_id='+campaign+'&gclid=CLICK_123'});
  const config=command(h,'config','G-2BYLRLFRDJ')[2];
  assert.equal(config.campaign_source,'google');assert.equal(config.campaign_medium,'cpc');assert.equal(config.campaign_name,'Regional_ABA');assert.equal(config.campaign_id,campaign);
  const sourceEnvelope=JSON.parse(h.store.get(sourceKey));
  assert.equal(sourceEnvelope.landingPath,'/best-aba-therapy-center-india-proven-improvement-rate');
  assert.equal(sourceEnvelope.fields.gclid,'CLICK_123');assert.equal(sourceEnvelope.fields.utm_id,campaign);
  assert.deepEqual(normaliseAcquisition(sourceEnvelope),sourceEnvelope);
  const arrival=h.events().find(entry=>entry[1]==='google_ads_arrival');
  assert(arrival);assert.equal(arrival[2].traffic_source,'google_ads');assert.equal(arrival[2].attribution_method,'click_id');
  assert.equal(arrival[2].gclid,undefined);
});

test('duplicate, private and malformed campaign values never enter source or analytics payloads',()=>{
  for(const query of [
    'utm_source=google&utm_source=google&utm_medium=cpc',
    'utm_source=google&utm_medium=cpc&utm_campaign=my_child_diagnosis',
    'utm_source=google&utm_medium=cpc&utm_campaign=name%40example.test',
    'gclid=PRIVATE%2FCLICK',
    'email=PRIVATE_CANARY&utm_source=google'
  ]){
    const h=harness({url:origin+'/best-aba-therapy-center-india-proven-improvement-rate?'+query});
    const payload=JSON.stringify(h.commands());assert(!payload.includes('my_child_diagnosis'));assert(!payload.includes('name@example.test'));assert(!payload.includes('PRIVATE/CLICK'));assert(!payload.includes('PRIVATE_CANARY'));
  }
});

test('recognised referrers are reduced to their origin and private referrers are blank',()=>{
  const google=harness({referrer:'https://www.google.com/search?q=private-child'});
  const ga=command(google,'config','G-2BYLRLFRDJ')[2];assert.equal(ga.page_referrer,'https://www.google.com/');assert(!JSON.stringify(google.commands()).includes('private-child'));
  const privateRef=harness({referrer:'https://private.example/child'});
  const privateConfig=command(privateRef,'config','G-2BYLRLFRDJ')[2];assert.equal(privateConfig.page_referrer,'');assert.equal(privateConfig.ignore_referrer,true);
});

test('automatic protection loads only for a safe eligible commercial context',()=>{
  const safe=harness({url:origin+'/best-aba-therapy-center-india-proven-improvement-rate?utm_source=google&utm_medium=cpc&utm_campaign=Regional_ABA'});
  assert.equal(safe.window.pinnacleProtectionAllowed(),true);
  assert.equal(safe.localScripts().filter(item=>item.src?.includes('protection-consumer.mjs')).length,1);
  assert.equal(safe.localScripts().filter(item=>item.src?.includes('cheq-protection.js')).length,1);
  const unsafe=harness({url:origin+'/best-aba-therapy-center-india-proven-improvement-rate?name=private-child'});
  assert.equal(unsafe.window.pinnacleProtectionAllowed(),false);
  assert.equal(unsafe.localScripts().filter(item=>item.src?.includes('protection-consumer.mjs')).length,0);
  assert.equal(unsafe.events().filter(entry=>entry[1]==='page_view').length,1,'invalid-traffic protection cannot disable GA4');
});

test('central call and WhatsApp taps emit bounded events once and never block navigation',()=>{
  const h=harness({url:origin+'/best-aba-therapy-center-india-proven-improvement-rate?utm_source=google&utm_medium=cpc&utm_campaign=Regional_ABA'});
  assert.doesNotThrow(()=>h.click('aba-first-call','tel:+919100181181'));
  assert.doesNotThrow(()=>h.click('hero-whatsapp','https://wa.me/919100181181?text=PRIVATE_MESSAGE'));
  const phone=h.events().filter(entry=>entry[1]==='phone_link_click');
  const whatsapp=h.events().filter(entry=>entry[1]==='whatsapp_link_click');
  assert.equal(phone.length,1);assert.equal(phone[0][2].link_placement,'aba-first-call');
  assert.equal(whatsapp.length,1);assert.equal(whatsapp[0][2].destination,'national_helpline');
  assert(!JSON.stringify(h.commands()).includes('PRIVATE_MESSAGE'));
  assert.equal(h.events().filter(entry=>entry[1]==='google_ads_phone_click').length,1);
  assert.equal(h.events().filter(entry=>entry[1]==='google_ads_whatsapp_click').length,1);
});

test('a Google forwarding number marked central remains eligible for click tracking',()=>{
  const h=harness();
  h.click('unknown','tel:+12025550142',{pinnacleAdCallTarget:'central'});
  const phone=h.events().find(entry=>entry[1]==='phone_link_click');
  assert(phone);assert.equal(phone[2].link_placement,'central-phone');assert.equal(phone[2].destination,'national_helpline');
});

test('accepted enquiry receipts emit once, require the exact contract and retain the submitted source',()=>{
  const store=new Map();
  const landing=harness({sharedStore:store,url:origin+'/best-aba-therapy-center-india-proven-improvement-rate?utm_source=google&utm_medium=cpc&utm_campaign=Regional_ABA&gclid=CLICK_123'});
  const acquisition=landing.window.pinnacleEnquirySource();assert(acquisition);
  const form=harness({sharedStore:store,url:origin+enrolment,callback:true});
  form.accepted(undefined,{acquisition});form.accepted(undefined,{acquisition});
  assert.equal(form.events().filter(entry=>entry[1]==='enquiry_accepted').length,1);
  assert.equal(form.events().find(entry=>entry[1]==='enquiry_accepted')[2].campaign_source,'google');
  for(const invalid of [
    {schemaVersion:1,requestId:'short',id:'short'},
    {schemaVersion:1,requestId:'qa-request-0002',id:'qa-receipt-0002',private:'x'},
    {schemaVersion:0,requestId:'qa-request-0003',id:'qa-receipt-0003'}
  ])form.accepted(invalid);
  assert.equal(form.events().filter(entry=>entry[1]==='enquiry_accepted').length,1);
});

test('an accepted enquiry event cannot manufacture a business outcome on a non-form page',()=>{
  const h=harness();h.accepted();
  assert.equal(h.events().filter(entry=>entry[1]==='enquiry_accepted').length,0);
});

test('all registered centre pages and core commercial pages have automatic measurement',()=>{
  const centres=JSON.parse(fs.readFileSync('src/data/centre-register.json','utf8')).centres;
  const urls=[
    '/', '/centers','/autism-therapy','/top-speech-therapy-center-india-proven-improvement-rate',
    '/best-occupational-therapy-center-india-proven-improvement-rate',
    '/best-aba-therapy-center-india-proven-improvement-rate',
    '/best-special-education-center-call-9100181181','/speech-aba-autism-assessments',enrolment,
    ...centres.map(centre=>new URL(centre.profileUrl).pathname)
  ];
  for(const path of urls){
    const h=harness({url:origin+path});assert.equal(h.events().filter(entry=>entry[1]==='page_view').length,1,path);
  }
});

test('legacy public templates require their owner marker and use a coarse identity',()=>{
  for(const [path,expected] of [
    ['/assessments/stuttering-assessment','/speech-aba-autism-assessments'],
    ['/certified-courses','/certified-courses'],['/certified-courses/','/certified-courses']
  ]){
    const measured=harness({url:origin+path,variant:'legacy_public_template'});
    const view=measured.events().find(entry=>entry[1]==='page_view');assert(view,path);assert.equal(new URL(view[2].page_location).pathname,expected);
    const unmarked=harness({url:origin+path});assert.equal(unmarked.events().length,0,path);
  }
});

test('knowledge and Ask paths retain coarse identities and exclude searches',()=>{
  const ask=harness({url:'https://pinnacleblooms.org/ask/private-question',variant:'ask'});
  assert.equal(new URL(ask.events().find(entry=>entry[1]==='page_view')[2].page_location).pathname,'/ask');
  assert(!JSON.stringify(ask.commands()).includes('private-question'));
  const searched=harness({url:origin+'/faq/private-topic?q=child-secret',variant:'knowledge'});
  assert.equal(searched.events().length,0);
});

test('functional click handling remains native even if analytics throws',()=>{
  const h=harness();h.window.gtag=()=>{throw Error('collector unavailable');};
  assert.doesNotThrow(()=>h.click('hero-call','tel:+919100181181'));
  assert.doesNotThrow(()=>h.click('hero-assessment',origin+enrolment));
});

test('source reuse keeps capture time and replaces, rather than merges, a new campaign',()=>{
  const store=new Map();
  const first=harness({sharedStore:store,url:origin+'/best-aba-therapy-center-india-proven-improvement-rate?utm_source=google&utm_medium=cpc&utm_campaign=First&gclid=CLICK_FIRST'});
  const before=JSON.parse(store.get(sourceKey));
  const same=harness({sharedStore:store,url:origin+enrolment+'?utm_source=google&utm_medium=cpc&utm_campaign=First&gclid=CLICK_FIRST'});
  const retained=JSON.parse(store.get(sourceKey));assert.equal(retained.capturedAt,before.capturedAt);assert.equal(retained.landingPath,before.landingPath);
  const next=harness({sharedStore:store,url:origin+'/best-aba-therapy-center-india-proven-improvement-rate?utm_source=google&utm_medium=cpc&utm_campaign=Second'});
  const replaced=JSON.parse(store.get(sourceKey));assert.equal(replaced.fields.utm_campaign,'Second');assert.equal(replaced.fields.gclid,undefined);
  assert(next.events().some(entry=>entry[1]==='google_ads_arrival'));assert(same.events().some(entry=>entry[1]==='google_ads_arrival'));
});
