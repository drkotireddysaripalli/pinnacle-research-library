import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const source=fs.readFileSync('src/lib/google-ads-call-consent.mjs','utf8').replace(/^export /gm,'');
const key='pinnacle-ad-call-consent-v1',action='AW-10810823199/VNUcCMSy3YobEJ-kgKMo';
function harness({path='/ask/example',host='pinnacleblooms.org',gpc=false,saved,storage=false,panelMissing=false,loader=false}={}){
 const local=new Map(saved?[[key,JSON.stringify(saved)]]:[]),session=new Map(),scripts=[],cookies=[],clicks={},listeners={};let reloads=0,mutate;
 const link=(href,text)=>{const attrs=new Map([['href',href],['aria-label','Call '+text]]),node={nodeValue:text};return {attrs,node,setAttribute:(k,v)=>attrs.set(k,v),getAttribute:k=>attrs.get(k)??null,removeAttribute:k=>attrs.delete(k)};};
 const central=link('tel:+919100181181','Call 9100\u00a0181\u00a0181'),localLink=link('tel:+914012345678','040 1234 5678'),links=[central,localLink];
 const buttons=['accepted','declined'].map(value=>({dataset:{adCallChoice:value},addEventListener:(e,f)=>clicks[value]=f}));
 const status={textContent:''},panel={hidden:true,querySelectorAll:()=>buttons};
 const doc={readyState:'complete',body:{},querySelector:s=>s==='[data-ad-call-preferences]'?(panelMissing?null:panel):s==='[data-ad-call-status]'?status:s.startsWith('script[')?(loader||scripts.length?{}:null):null,querySelectorAll:()=>links,createTreeWalker:l=>{let moved=false;return {currentNode:l.node,nextNode:()=>moved?false:(moved=true)};},createElement:()=>({setAttribute(){}}),head:{appendChild:s=>scripts.push(s)},addEventListener:(e,f)=>listeners[e]=f};
 Object.defineProperty(doc,'cookie',{get:()=> 'gwcc=fixture; _gcl_aw=fixture; ps_ga=keep; unrelated=keep',set:v=>cookies.push(v)});
 const mapStore=m=>({getItem:k=>{if(storage)throw Error('storage unavailable');return m.get(k)||null;},setItem:(k,v)=>{if(storage)throw Error('storage unavailable');m.set(k,v);},removeItem:k=>{if(storage)throw Error('storage unavailable');m.delete(k);}});
 const win={addEventListener:(e,f)=>listeners[e]=f},ctx={window:win,document:doc,location:{protocol:'https:',hostname:host,pathname:path,reload:()=>reloads++},navigator:{globalPrivacyControl:gpc},localStorage:mapStore(local),sessionStorage:mapStore(session),MutationObserver:class{constructor(f){mutate=f;}observe(){}},Date,Set,Map,JSON};
 vm.runInNewContext(source,ctx);
 const commands=()=>Array.from(win.dataLayer||[],x=>Array.from(x));
 return {win,ctx,scripts,cookies,panel,status,central,localLink,buttons,links,local,session,listeners,commands,choose:v=>clicks[v](),callback:()=>commands().find(x=>x[0]==='config'&&x[1]===action)?.[2].phone_conversion_callback,reloads:()=>reloads,mutate:()=>mutate(),link};
}
test('default, refusal, GPC, blocked storage and missing controls never start the helper',()=>{
 for(const opts of [{},{gpc:true},{storage:true},{panelMissing:true}]){
  const h=harness(opts);if(!opts.panelMissing)h.choose(opts.gpc||opts.storage?'accepted':'declined');
  assert.equal(h.scripts.length,0);assert(!h.callback());assert.equal(h.central.getAttribute('href'),'tel:+919100181181');
 }
});
test('private and unrelated paths and nonproduction hosts stay uninstrumented',()=>{
 for(const path of ['/ask/account','/ask/auth/callback','/ask/te/search','/ask/api/item','/ask/te/account','/shop','/faq','/ask-other']){
  const h=harness({path});assert(!h.win.__pinnacleAdCallConsent,path);assert.equal(h.scripts.length,0);
 }
 assert(!harness({host:'local.invalid'}).win.__pinnacleAdCallConsent);
});
test('public paid centre/service/assessment/enrolment paths expose consent, with default-off and local-number protection',()=>{
 const centres=JSON.parse(fs.readFileSync('src/data/centre-register.json','utf8')).centres;
 const paths=['/','/centers','/autism-therapy','/best-occupational-therapy-center-india-proven-improvement-rate','/best-aba-therapy-center-india-proven-improvement-rate','/best-special-education-center-call-9100181181','/speech-aba-autism-assessments','/enroll-autism-speech-aba-therapies-india',...centres.map(c=>new URL(c.profileUrl).pathname)];
 for(const path of paths){const h=harness({path,host:'www.pinnacleblooms.org'});assert(h.win.__pinnacleAdCallConsent,path);assert.equal(h.panel.hidden,false,path);assert.equal(h.scripts.length,0);h.choose('accepted');assert.equal(h.scripts.length,1,path);h.callback()('+1 202 555 0142','+12025550142');assert.equal(h.central.getAttribute('href'),'tel:+12025550142');assert.equal(h.localLink.getAttribute('href'),'tel:+914012345678');}
});
test('acceptance configures one conversion, never personalisation; callback updates display and dial',()=>{
 const h=harness();h.choose('accepted');h.choose('accepted');assert.equal(h.scripts.length,1);
 assert.equal(h.commands().filter(x=>x[0]==='config'&&x[1]===action).length,1);
 const config=h.commands().find(x=>x[0]==='config')[2];assert.equal(config.phone_conversion_number,'9100 181 181');assert.equal(config.allow_ad_personalization_signals,false);
 h.callback()('+91 40 1234 5678','+914012345678');assert.equal(h.central.getAttribute('href'),'tel:+914012345678');assert.equal(h.central.node.nodeValue,'Call +91 40 1234 5678');
 assert.equal(h.central.getAttribute('data-pinnacle-ad-call-target'),'central');assert.equal(h.localLink.node.nodeValue,'040 1234 5678');
 const extra=h.link('tel:9100181181','9100 181 181');h.links.push(extra);h.mutate();assert.equal(extra.getAttribute('href'),'tel:+914012345678');
});
test('withdrawal restores original text/link, clears only ad cookies, unloads and rejects late callback',()=>{
 const h=harness();h.choose('accepted');const callback=h.callback();callback('040 1234 5678','04012345678');h.choose('declined');callback('040 9999 9999','04099999999');
 assert.equal(h.central.getAttribute('href'),'tel:+919100181181');assert.equal(h.central.node.nodeValue,'Call 9100\u00a0181\u00a0181');assert.equal(h.central.getAttribute('data-pinnacle-ad-call-target'),null);assert.equal(h.reloads(),1);
 assert.equal(JSON.parse(h.local.get(key)).value,'declined');assert(h.cookies.some(x=>x.startsWith('gwcc=')));assert(!h.cookies.some(x=>x.startsWith('ps_ga=')||x.startsWith('unrelated=')));
});
test('withdrawal from another tab unloads an already enabled tab',()=>{
 const h=harness();h.choose('accepted');h.listeners.storage({storageArea:h.ctx.localStorage,key,newValue:JSON.stringify({value:'declined',at:Date.now()})});
 assert.equal(h.win.__pinnacleAdCallConsent.enabled,false);assert.equal(h.reloads(),1);
});
test('expired, future and malformed saved grants stay denied; valid current grant starts once',()=>{
 for(const saved of [{value:'accepted',at:Date.now()-181*86400000},{value:'accepted',at:Date.now()+100000},{value:'accepted',at:'bad'}])assert.equal(harness({saved}).scripts.length,0);
 assert.equal(harness({saved:{value:'accepted',at:Date.now()-1000}}).scripts.length,1);
});
test('reuses an existing analytics loader and ignores invalid forwarding numbers',()=>{
 const h=harness({loader:true});h.choose('accepted');assert.equal(h.scripts.length,0);h.callback()('malicious html','tel:bad');assert.equal(h.central.getAttribute('href'),'tel:+919100181181');
});
test('default off never leaves a false withdrawal marker; successful persistent denial clears the fallback',()=>{
 const h=harness();assert.equal(h.session.has(key+'-withdrawn'),false);
 h.choose('accepted');h.choose('declined');assert.equal(h.session.has(key+'-withdrawn'),false);
 assert.equal(JSON.parse(h.local.get(key)).value,'declined');
});
