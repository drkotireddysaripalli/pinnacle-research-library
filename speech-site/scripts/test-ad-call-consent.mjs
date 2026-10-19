import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {preferencesMarkup} from '../src/lib/google-ads-call-consent.mjs';

const source=fs.readFileSync('src/lib/google-ads-call-consent.mjs','utf8').replace(/^export /gm,'');
const action='AW-10810823199/VNUcCMSy3YobEJ-kgKMo';

function harness({path='/ask/example',host='pinnacleblooms.org',loader=false,variant,ready='complete'}={}){
 const scripts=[],listeners={};let mutate;
 const link=(href,text)=>{const attrs=new Map([['href',href],['aria-label','Call '+text]]),node={nodeValue:text};return {attrs,node,setAttribute:(k,v)=>attrs.set(k,v),getAttribute:k=>attrs.get(k)??null,removeAttribute:k=>attrs.delete(k)};};
 const central=link('tel:+919100181181','Call 9100\u00a0181\u00a0181'),local=link('tel:+914012345678','040 1234 5678'),links=[central,local];
 const document={
  readyState:ready,body:{dataset:{pageVariant:variant}},
  querySelector:s=>s.startsWith('script[')&&(loader||scripts.length)?{}:null,
  querySelectorAll:s=>s==='a[href^="tel:"]'?links:[],
  createTreeWalker:target=>{let moved=false;return {currentNode:target.node,nextNode:()=>moved?false:(moved=true)};},
  createElement:()=>({setAttribute(k,v){this[k]=v;}}),head:{appendChild:s=>scripts.push(s)},
  addEventListener:(event,fn)=>listeners[event]=fn
 };
 const window={addEventListener:(event,fn)=>listeners['window:'+event]=fn};
 const neverStore=new Proxy({}, {get(){throw Error('visitor choice storage must not be read');}});
 const context={window,document,location:{protocol:'https:',hostname:host,pathname:path},navigator:{globalPrivacyControl:true},localStorage:neverStore,sessionStorage:neverStore,MutationObserver:class{constructor(fn){mutate=fn;}observe(){}},Date,Set,Map,JSON};
 vm.runInNewContext(source,context);
 if(ready==='loading')listeners.DOMContentLoaded?.();
 const commands=()=>Array.from(window.dataLayer||[],entry=>Array.from(entry));
 return {window,scripts,central,local,links,commands,callback:()=>commands().find(x=>x[0]==='config'&&x[1]===action)?.[2].phone_conversion_callback,mutate:()=>mutate?.(),link};
}

test('visitor choice UI, choice storage and GPC gates are absent',()=>{
 assert.equal(preferencesMarkup,'');
 for(const token of ['data-ad-call-choice','data-ad-call-preferences','pinnacle-ad-call-consent','globalPrivacyControl','localStorage','sessionStorage','Allow call measurement','Keep call measurement off'])assert.equal(source.includes(token),false,token);
});

test('eligible public pages start one Ads call configuration automatically',()=>{
 const h=harness();
 assert.equal(h.window.__pinnacleAdCallMeasurement.enabled,true);
 assert.equal(h.window.__pinnacleAdCallMeasurement.started,true);
 assert.equal(h.scripts.length,1);
 assert.equal(h.scripts[0].src,'https://www.googletagmanager.com/gtag/js?id=AW-10810823199');
 assert.equal(h.commands().filter(x=>x[0]==='config'&&x[1]===action).length,1);
 const state={};for(const command of h.commands().filter(x=>x[0]==='consent'))Object.assign(state,command[2]);
 assert.deepEqual(state,{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'denied'});
 assert(h.commands().some(x=>x[0]==='set'&&x[1]==='ads_data_redaction'&&x[2]===false));
});

test('private, unrelated and non-production pages stay uninstrumented',()=>{
 for(const path of ['/ask/account','/ask/auth/callback','/ask/te/search','/ask/api/item','/shop','/faq','/ask-other']){
  const h=harness({path});assert.equal(h.window.__pinnacleAdCallMeasurement,undefined,path);assert.equal(h.scripts.length,0,path);
 }
 assert.equal(harness({host:'local.invalid'}).window.__pinnacleAdCallMeasurement,undefined);
});

test('every current paid service and centre route starts without a UI',()=>{
 const centres=JSON.parse(fs.readFileSync('src/data/centre-register.json','utf8')).centres;
 const paths=['/','/centers','/autism-therapy','/best-occupational-therapy-center-india-proven-improvement-rate','/best-aba-therapy-center-india-proven-improvement-rate','/best-special-education-center-call-9100181181','/speech-aba-autism-assessments','/enroll-autism-speech-aba-therapies-india',...centres.map(c=>new URL(c.profileUrl).pathname)];
 for(const path of paths){const h=harness({path,host:'www.pinnacleblooms.org'});assert.equal(h.window.__pinnacleAdCallMeasurement?.started,true,path);assert.equal(h.scripts.length,1,path);}
});

test('reviewed legacy templates require their owner marker and use a coarse identity',()=>{
 for(const [path,coarse] of [['/assessments/stuttering-assessment','/speech-aba-autism-assessments'],['/certified-courses','/certified-courses'],['/certified-courses/','/certified-courses']]){
  assert.equal(harness({path,host:'www.pinnacleblooms.org'}).window.__pinnacleAdCallMeasurement,undefined);
  const h=harness({path,host:'www.pinnacleblooms.org',variant:'legacy_public_template'});
  const config=h.commands().find(x=>x[0]==='config'&&x[1]===action)[2];
  assert.equal(config.page_location,'https://www.pinnacleblooms.org'+coarse);assert.equal(config.page_referrer,'');
 }
});

test('forwarding callback replaces only the national number, including later links',()=>{
 const h=harness();const callback=h.callback();
 callback('+91 40 1234 5678','+914012345678');
 assert.equal(h.central.getAttribute('href'),'tel:+914012345678');
 assert.equal(h.central.node.nodeValue,'Call +91 40 1234 5678');
 assert.equal(h.central.getAttribute('data-pinnacle-ad-call-target'),'central');
 assert.equal(h.local.getAttribute('href'),'tel:+914012345678');
 assert.equal(h.local.node.nodeValue,'040 1234 5678');
 const late=h.link('tel:9100181181','9100 181 181');h.links.push(late);h.mutate();assert.equal(late.getAttribute('href'),'tel:+914012345678');
});

test('invalid forwarding values are ignored and an existing tag loader is reused',()=>{
 const h=harness({loader:true});assert.equal(h.scripts.length,0);h.callback()('malicious html','tel:bad');assert.equal(h.central.getAttribute('href'),'tel:+919100181181');
});

test('DOMContentLoaded start is automatic and idempotent',()=>{
 const h=harness({ready:'loading'});assert.equal(h.scripts.length,1);assert.equal(h.commands().filter(x=>x[0]==='config'&&x[1]===action).length,1);
});
