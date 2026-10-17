import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
import {services} from '../public/pinnacle-pages-scripts/enrolment-api.mjs';

// Read maintained inputs directly: this test needs no build, saved audit,
// production fetch, browser, analytics SDK or receiving-system access.
const read=path=>fs.readFileSync(new URL(path,import.meta.url),'utf8');
const initializer=read('../public/pinnacle-pages-scripts/enrolment.js').replace(/^import[^\n]+\n/gm,'');
const header=read('../src/components/SiteHeader.astro');
const contextScripts=[...header.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
 .map(match=>match[1]).filter(source=>source.includes('function pbnPaidJourneyContext'));
assert.equal(contextScripts.length,1,'one maintained shared-header routing implementation');
// The only TypeScript syntax in this small script is the anchor element type.
const headerContext=contextScripts[0].replace('querySelectorAll<HTMLAnchorElement>','querySelectorAll');
const directory=JSON.parse(read('../src/data/centre-directory.json'));
const centreIds=['',...directory.map(centre=>centre.id)];
const enrol='https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india';
const native=content=>'utm_source=google&utm_medium=cpc&utm_campaign=pbn_network_hyderabad&utm_content='+content;
assert.deepEqual([...services].sort(),['help','autism','speech','occupational','aba','education','other'].sort());
assert.equal(directory.find(centre=>centre.id==='khajaguda').name,'Khajaguda, Mehdipatnam');

function runInitializer(fixture){
 let selected='help',forbiddenCalls=0;
 const forbidden=()=>{forbiddenCalls++;throw Error('Network, storage, events, payloads and submission are forbidden');};
 const generic=()=>({hidden:false,textContent:'',innerHTML:'',append(){},after(){},replaceChildren(){},addEventListener(){},setAttribute(){},focus(){},querySelector(){return null;}});
 const radios=[...services].map(value=>({value,closest:()=>({textContent:value}),addEventListener(){},get checked(){return selected===value;},set checked(checked){if(checked)selected=value;}}));
 const centre={...generic(),value:'',options:centreIds.map(value=>({value,textContent:value||'Help me find a centre'})),get selectedIndex(){return centreIds.indexOf(this.value);}};
 const form={...generic(),dataset:{preview:'true',apiEndpoint:'/api/enrolment',defaultService:fixture.defaultService||'',defaultCentre:''},querySelector(selector){
  if(selector==='[name="service"]:checked')return radios.find(radio=>radio.checked);
  const match=selector.match(/input\[name="service"\]\[value="([^"]+)"\]/);
  return match?radios.find(radio=>radio.value===match[1]):generic();
 },querySelectorAll:selector=>selector==='[name="service"]'?radios:[]};
 const nodes=new Map([['pinnacle-enrolment',form],['preferred-centre',centre]]);
 const document={getElementById(id){if(!nodes.has(id))nodes.set(id,generic());return nodes.get(id);},createElement:generic,querySelector:generic,querySelectorAll:()=>[],dispatchEvent:forbidden};
 const url=new URL(enrol+(fixture.query?'?'+fixture.query:''));
 vm.runInNewContext(initializer,{services,validateEnrolment:forbidden,makePayload:forbidden,approvedEndpoint:()=>true,submitEnrolment:forbidden,createAttemptStore:forbidden,
  document,location:{href:url.href,origin:url.origin,search:url.search},URL,URLSearchParams,Date,Set,CustomEvent:class{},queueMicrotask:fn=>fn(),navigator:{},window:{},crypto:{randomUUID:forbidden},fetch:forbidden,localStorage:{getItem:forbidden,setItem:forbidden}},{timeout:1000});
 assert.equal(selected,fixture.service,'selected service');
 assert.equal(centre.value,fixture.centre,'selected published centre');
 assert.equal(forbiddenCalls,0,'initialization performs no network, storage, event or submission work');
}

const initializerCases=[
 {name:'native Speech Khajaguda label selects the published Mehdipatnam centre',query:native('khajaguda-mehdipatnam-hyderabad-telangana_speech'),service:'speech',centre:'khajaguda'},
 {name:'native ABA LB Nagar label selects LB Nagar',query:native('lbnagar-hyderabad-telangana_aba'),defaultService:'aba',service:'aba',centre:'lbnagar'},
 {name:'native OT Nallagandla label selects Nallagandla',query:native('nallagandla-hyderabad-telangana_ot'),defaultService:'occupational',service:'occupational',centre:'nallagandla'},
 {name:'native OT Suchitra2 label selects published Suchitra II',query:native('suchitra2-hyderabad-telangana_ot'),defaultService:'occupational',service:'occupational',centre:'suchitraii'},
 {name:'explicit Suchitra2 alias resolves to the published choice',query:'service=occupational&centre=suchitra2',service:'occupational',centre:'suchitraii'},
 {name:'existing canonical Suchitra II value remains valid',query:'service=occupational&centre=suchitraii',service:'occupational',centre:'suchitraii'},
 {name:'explicit family service and centre beat paid defaults',query:'service=speech&centre=nizampet&'+native('lbnagar-hyderabad-telangana_aba'),service:'speech',centre:'nizampet'},
 {name:'explicit Help me choose and empty centre beat paid defaults',query:'service=help&centre=&'+native('lbnagar-hyderabad-telangana_aba'),service:'help',centre:''},
 {name:'ambiguous Paradise label keeps the help fallback',query:native('paradise-hyderabad-telangana_speech'),service:'help',centre:''},
 ...['himayatnagar','kondapur','gachibowli'].map(locality=>({name:'held '+locality+' label does not infer a centre',query:native(locality+'-hyderabad-telangana_ot'),defaultService:'occupational',service:'occupational',centre:''})),
 {name:'duplicate explicit centres do not silently choose one',query:'service=occupational&centre=suchitraii&centre=nallagandla',service:'occupational',centre:''},
 {name:'invalid explicit centre does not fall through to a paid default',query:'service=occupational&centre=unpublished&'+native('nallagandla-hyderabad-telangana_ot'),service:'occupational',centre:''},
 {name:'duplicate paid labels do not infer a centre',query:native('nallagandla-hyderabad-telangana_ot')+'&utm_content=lbnagar-hyderabad-telangana_aba',defaultService:'occupational',service:'occupational',centre:''},
 {name:'an unrelated source cannot use the native campaign map',query:native('nallagandla-hyderabad-telangana_ot').replace('utm_source=google','utm_source=unrelated'),defaultService:'occupational',service:'occupational',centre:''},
 {name:'existing speech assessment entry keeps its speech preference',query:'entry=speech-assessment',service:'speech',centre:''},
 {name:'untagged Enrolment keeps Help me choose',query:'',service:'help',centre:''}
];
for(const fixture of initializerCases)test(fixture.name,()=>runInitializer(fixture));

function decorate(url,hrefs){
 let forbiddenCalls=0;
 const forbidden=()=>{forbiddenCalls++;throw Error('Routing must not access tracking, consent, storage, events or network');};
 const targets=hrefs.map(href=>({href}));
 const document={querySelectorAll:()=>targets,dispatchEvent:forbidden};
 Object.defineProperty(document,'cookie',{get:forbidden,set:forbidden});
 vm.runInNewContext(headerContext,{document,location:new URL(url),URL,URLSearchParams,Set,fetch:forbidden,localStorage:new Proxy({},{get:forbidden}),window:new Proxy({},{get:forbidden})},{timeout:1000});
 assert.equal(forbiddenCalls,0,'routing does not change consent or send/store attribution');
 return targets.map(target=>target.href);
}
const nativeLinks=[
 ['/top-speech-therapy-center-india-proven-improvement-rate','speech','khajaguda-mehdipatnam-hyderabad-telangana_speech','khajaguda'],
 ['/best-aba-therapy-center-india-proven-improvement-rate','aba','lbnagar-hyderabad-telangana_aba','lbnagar'],
 ['/best-occupational-therapy-center-india-proven-improvement-rate','occupational','nallagandla-hyderabad-telangana_ot','nallagandla'],
 ['/best-occupational-therapy-center-india-proven-improvement-rate','occupational','suchitra2-hyderabad-telangana_ot','suchitraii']
];
for(const [path,service,content,centre] of nativeLinks)test('shared header/footer retain '+content+' preferences without new attribution propagation',()=>{
 const url='https://www.pinnacleblooms.org'+path+'?'+native(content)+'&utm_id=SOURCE_CAMPAIGN_FIXTURE&gclid=SOURCE_GCLID_FIXTURE&gbraid=SOURCE_GBRAID_FIXTURE&wbraid=SOURCE_WBRAID_FIXTURE';
 const explicitHref=enrol+'?service=education&centre=nizampet&offer=navratri-one-service-month-2026&utm_source=target_source&utm_id=TARGET_CAMPAIGN_FIXTURE&gclid=TARGET_GCLID_FIXTURE&gbraid=TARGET_GBRAID_FIXTURE&wbraid=TARGET_WBRAID_FIXTURE&opaque_fixture=keep#enrolment-form';
 const targets=decorate(url,[enrol,enrol+'#enrolment-form',explicitHref,'tel:+919100181181','https://example.invalid/enroll-autism-speech-aba-therapies-india']);
 for(const target of targets.slice(0,2)){
  const actual=new URL(target);assert.equal(actual.searchParams.get('service'),service);assert.equal(actual.searchParams.get('centre'),centre);
  for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_id','gclid','gbraid','wbraid'])assert.equal(actual.searchParams.has(key),false,'must not newly propagate '+key);
 }
 const explicit=new URL(targets[2]);assert.deepEqual([...explicit.searchParams],[...new URL(explicitHref).searchParams]);assert.equal(explicit.hash,'#enrolment-form');
 assert.equal(targets[3],'tel:+919100181181');assert.equal(targets[4],'https://example.invalid/enroll-autism-speech-aba-therapies-india');
});
test('untagged known OT page preserves only its service on Enrol links',()=>{
 const target=new URL(decorate('https://www.pinnacleblooms.org/best-occupational-therapy-center-india-proven-improvement-rate',[enrol])[0]);
 assert.equal(target.searchParams.get('service'),'occupational');assert.equal(target.searchParams.has('centre'),false);
});
test('an unrelated page does not invent a service for shared Enrol links',()=>{
 assert.equal(decorate('https://www.pinnacleblooms.org/about-pinnacle-proven-improvement-rate',[enrol])[0],enrol);
});
for(const locality of ['paradise','himayatnagar','kondapur','gachibowli'])test('shared Enrol links retain the centre fallback for '+locality,()=>{
 const target=new URL(decorate('https://www.pinnacleblooms.org/best-occupational-therapy-center-india-proven-improvement-rate?'+native(locality+'-hyderabad-telangana_ot'),[enrol])[0]);
 assert.equal(target.searchParams.get('service'),'occupational');assert.equal(target.searchParams.has('centre'),false);
});
