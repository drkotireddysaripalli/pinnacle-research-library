import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=process.env.QA_GATE_SOURCE_ROOT||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const files=['speech-site/public/pinnacle-pages-scripts/speech-measurement.js','helpline-site/phone-analytics.js'];
const source=file=>fs.readFileSync(path.join(root,file),'utf8');
const storage=()=>{const map=new Map();return{map,getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};};
function gate(file,search='',store=storage(),now=1800000000000){
 const text=source(file),start=text.indexOf('/* PINNACLE_QA_PROVENANCE_START */');
 const end=text.indexOf(file.startsWith('speech-site')?'  const callPlacements':'  if (!production',start);
 assert(start>=0&&end>start);
 class Clock extends Date{static now(){return now;}}
 const calls=[],url=new URL('https://www.pinnacleblooms.org/'+search);
 const ctx={URL,URLSearchParams,Date:Clock,Set,JSON,Number,location:url,sessionStorage:store,
  production:true,enabled:true,knowledgeSearch:false,permittedCampaigns:()=>({}),pageGroup:'speech_therapy',variant:'service',
  measurementLocation:'https://www.pinnacleblooms.org/',pageTitle:'Pinnacle',safeReferrer:'',id:'OFFLINE',window:{gtag:(...args)=>calls.push(args)}};
 vm.runInNewContext(text.slice(start,end)+'\nglobalThis.qa=validationTraffic;',ctx);
 if(file.startsWith('speech-site')){
  const a=text.indexOf('  const send = '),b=text.indexOf('  const vitalRelease',a);
  vm.runInNewContext(text.slice(a,b)+"\nsend('phone_link_click',{});send('whatsapp_link_click',{});send('enquiry_accepted',{});",ctx);
 }
 return{qa:ctx.qa,calls,store};
}
for(const file of files){
 test(file+' excludes recognized qa_mode and legacy measurement_mode=qa',()=>{
  for(const search of ['?qa_mode=1','?qa_mode=true','?qa_mode=TRUE','?qa_mode=qa','?measurement_mode=qa','?measurement_mode=QA']){
   const r=gate(file,search);assert.equal(r.qa,true,search);assert.equal(r.calls.length,0,search);
  }
 });
 test(file+' preserves ordinary, false, malformed and duplicate-marker traffic',()=>{
  for(const search of ['','?utm_campaign=qa','?qa_mode=false','?qa_mode=0','?qa_mode=something','?qa_mode=1&qa_mode=1','?measurement_mode=automatic','?measurement_mode=qa&measurement_mode=automatic']){
   const r=gate(file,search);assert.equal(r.qa,false,search);if(file.startsWith('speech-site'))assert.equal(r.calls.length,3,search);
  }
 });
 test(file+' retains QA through navigation without extending the original expiry',()=>{
  const s=storage(),now=1800000000000;
  assert.equal(gate(file,'?qa_mode=1',s,now).qa,true);
  assert.equal(gate(file,'',s,now+1000).qa,true);
  assert.equal(s.getItem('pinnacle-validation-v1'),String(now));
  assert.equal(gate(file,'',s,now+86400001).qa,false);
 });
 test(file+' suppresses labelled current page when browser storage is unavailable',()=>{
  const s={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
  assert.equal(gate(file,'?qa_mode=true',s).qa,true);
  assert.equal(gate(file,'?measurement_mode=qa',s).qa,true);
 });
 test(file+' retains existing validation_test suppression',()=>{
  for(const search of ['?validation_test=1','?validation_test=false','?validation_test=a&validation_test=b'])assert.equal(gate(file,search).qa,true);
 });
}
const consumer=await import(pathToFileURL(path.join(root,'speech-site/public/pinnacle-pages-scripts/protection-consumer.mjs')));
function protection(search='',store=storage()){
 const listeners={},calls=[],scripts=[];
 const win={location:{href:'https://www.pinnacleblooms.org/'+search},sessionStorage:store,
  CG:{conversion(...args){calls.push(args);}},addEventListener:(n,f)=>listeners[n]=f,removeEventListener:n=>delete listeners[n]};
 const doc={querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>({setAttribute(){},addEventListener(){},remove(){}}),head:{append:x=>scripts.push(x)},
  addEventListener:(n,f)=>listeners[n]=f,removeEventListener:n=>delete listeners[n]};
 const c=consumer.installPublicProtection(win,doc);
 const href='tel:+919100181181';
 listeners.click?.({target:{closest:()=>({dataset:{},getAttribute:()=>href})},preventDefault(){assert.fail('Native navigation blocked');}});
 return{c,calls,scripts,store};
}
test('standalone ClickGUARD also excludes recognized QA markers before loader/contact dispatch',()=>{
 for(const q of ['?qa_mode=1','?qa_mode=true','?measurement_mode=qa']){
  const h=protection(q);assert.equal(h.c,null,q);assert.equal(h.calls.length,0,q);assert.equal(h.scripts.length,0,q);
 }
});
test('standalone ClickGUARD retains ordinary contact-intent protection and QA navigation suppression',()=>{
 assert.equal(protection('?qa_mode=false').calls.length,1);
 const s=storage();assert.equal(protection('?qa_mode=1',s).c,null);assert.equal(protection('',s).c,null);
});
test('standalone ClickGUARD respects previously recorded valid QA hints but not malformed hints',()=>{
 const s=storage();s.setItem('pinnacle-observed-qa-v1',JSON.stringify({at:Date.now(),value:{schemaVersion:1,provenance:'client_observed',hints:['qa_mode']}}));assert.equal(protection('',s).c,null);
 const malformed=storage();malformed.setItem('pinnacle-observed-qa-v1',JSON.stringify({at:Date.now(),value:{schemaVersion:1,provenance:'trusted',hints:['qa_mode']}}));assert.equal(protection('',malformed).calls.length,1);
});


const origin="https://www.pinnacleblooms.org";
function fullHarness({
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
  const sandbox={window,document,location,navigator:{globalPrivacyControl:gpc},localStorage,sessionStorage,Date,Set,Map,JSON,URL,URLSearchParams,Event,Math,Number,console};
  vm.runInNewContext(source(files[0]),sandbox,{importModuleDynamically:()=>Promise.reject(new Error('functional routing import is outside measurement test'))});
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
    localScripts:()=>scripts.filter(item=>item.src?.startsWith('/')||item.src?.startsWith(origin+'/pinnacle-pages-scripts/'))
  };
}


test('actual collector keeps ordinary paid source and native phone navigation',()=>{
 const h=fullHarness({url:origin+'/top-speech-therapy-center-india-proven-improvement-rate?utm_source=google&utm_medium=cpc&gclid=offline-safe-click'});
 assert.equal(h.window.pinnacleEnquirySource().fields.gclid,'offline-safe-click');
 assert(h.events().some(e=>e[1]==='page_view'));
 const link=h.click('hero-call','tel:+919100181181');assert.equal(link.href,'tel:+919100181181');
 assert(h.events().some(e=>e[1]==='phone_link_click'));
});
test('actual collector suppresses QA provider events while leaving phone navigation and accepted receipt dispatch intact',()=>{
 for(const marker of ['qa_mode=1','qa_mode=true','measurement_mode=qa']){
  const h=fullHarness({url:origin+'/enroll-autism-speech-aba-therapies-india?'+marker+'&utm_source=google&utm_medium=cpc&gclid=offline-safe-click'});
  const link=h.click('hero-call','tel:+919100181181');assert.equal(link.href,'tel:+919100181181');
  h.accepted();assert.equal(h.events().length,0);assert.equal(h.googleScripts().length,0);assert.equal(h.window.pinnacleProtectionAllowed(),false);
 }
});

function adCallGate(search,store=storage()){
 const text=source('speech-site/src/lib/google-ads-call-consent.mjs'),start=text.indexOf('  let qa='),end=text.indexOf('  if(!window.__pinnacleProtectionContainer)',start);
 return vm.runInNewContext('(function(){'+text.slice(start,end)+'return "allowed";})()',{URL,Date,Set,Number,JSON,Object,Array,location:{href:'https://www.pinnacleblooms.org/'+search},sessionStorage:store});
}
test('Ads call helper checks explicit and retained QA before initializing measurement, preserving normal pages',()=>{
 const evaluate=adCallGate;
 for(const q of ['?qa_mode=1','?qa_mode=true','?measurement_mode=qa','?validation_test=1'])assert.equal(evaluate(q),undefined,q);
 for(const q of ['','?qa_mode=false','?qa_mode=1&qa_mode=1','?measurement_mode=automatic'])assert.equal(evaluate(q),'allowed',q);
 const s=storage();assert.equal(evaluate('?qa_mode=1',s),undefined);assert.equal(evaluate('',s),undefined);
 const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};assert.equal(evaluate('?qa_mode=true',blocked),undefined);
});

test('retained QA timestamp survives a malformed or unreadable observed record',()=>{
 for(const broken of ['malformed','unreadable']){
  const s=storage();s.setItem('pinnacle-validation-v1',String(Date.now()));s.setItem('pinnacle-observed-qa-v1','{broken');
  if(broken==='unreadable'){const get=s.getItem;s.getItem=key=>{if(key==='pinnacle-observed-qa-v1')throw Error('unreadable');return get(key);};}
  assert.equal(adCallGate('',s),undefined,broken);
  assert.equal(protection('',s).c,null,broken);
 }
});
test('all producers reject observed QA values with unknown fields or an array shape',()=>{
 for(const value of [{schemaVersion:1,provenance:'client_observed',hints:['qa_mode'],unexpected:true},[]]){
  const s=storage();s.setItem('pinnacle-observed-qa-v1',JSON.stringify({at:Date.now(),value}));
  assert.equal(adCallGate('',s),'allowed');assert.equal(protection('',s).calls.length,1);
  for(const file of files){const stable=storage();stable.setItem('pinnacle-observed-qa-v1',JSON.stringify({at:1800000000000,value}));assert.equal(gate(file,'',stable).qa,false);}
 }
});
test('valid observed QA remains effective when the separate timestamp read fails',()=>{
 const s=storage();s.setItem('pinnacle-observed-qa-v1',JSON.stringify({at:Date.now(),value:{schemaVersion:1,provenance:'client_observed',hints:['qa_mode']}}));
 const get=s.getItem;s.getItem=key=>{if(key==='pinnacle-validation-v1')throw Error('unreadable');return get(key);};
 assert.equal(adCallGate('',s),undefined);assert.equal(protection('',s).c,null);
});
