// Isolated browser-script harness. No network, cookies or production intake.
import fs from 'node:fs';
import vm from 'node:vm';
export const origin='https://www.pinnacleblooms.org',helpline='/national-autism-helpline',enrol='/enroll-autism-speech-aba-therapies-india';
export const sourceKey='pinnacle-enquiry-source-v1',helplineKey='pinnacle-helpline-measurement-choice-v4',mainKey='pinnacle-speech-analytics-v1';
export const campaigns=['pinnacle_vizag_call_enquiries','pinnacle_hyderabad_vijayawada_call_enquiries'];
export const tagged=name=>'?utm_source=chatgpt&utm_medium=paid&utm_campaign='+name;
export function client({path=helpline,search='',store=new Map(),session=new Map(),gpc=false,sourceStorageFailure=false,now=Date.now()}={}){
 const isHelpline=path===helpline,handlers={},windowHandlers={},buttons={},scripts=[],cookies=[],panel={hidden:true,querySelector:()=>({textContent:''})},status={textContent:''};
 const add=(target,name,fn)=>(target[name]??=[]).push(fn);
 const navigator={globalPrivacyControl:gpc};
 const window={addEventListener:(name,fn)=>add(windowHandlers,name,fn)};
 const localStorage={getItem:key=>{if(sourceStorageFailure&&key===sourceKey)throw Error('optional storage unavailable');return store.get(key)||null;},setItem:(key,value)=>{if(sourceStorageFailure&&key===sourceKey)throw Error('optional storage unavailable');store.set(key,value);},removeItem:key=>store.delete(key)};
 const document={referrer:'',body:{dataset:{pageVariant:'service'}},querySelector:selector=>selector==='[data-analytics-panel]'||selector==='[data-speech-measurement]'?panel:selector.includes('status')?status:null,querySelectorAll:()=>['accepted','declined'].map(value=>({dataset:isHelpline?{analyticsChoice:value}:{measurementChoice:value},addEventListener:(_,fn)=>buttons[value]=fn})),head:{append:item=>scripts.push(item)},createElement:()=>({setAttribute(){}}),addEventListener:(name,fn)=>add(handlers,name,fn)};
 Object.defineProperty(document,'cookie',{get:()=>'',set:value=>cookies.push(value)});
 class Clock extends Date { static now(){return now;} }
 const location=new URL(origin+path+search),sessionStorage={getItem:key=>session.get(key)||null,setItem:(key,value)=>session.set(key,value)};
 const file=isHelpline?'../helpline-site/phone-analytics.js':'public/pinnacle-pages-scripts/speech-measurement.js';
 vm.runInNewContext(fs.readFileSync(file,'utf8'),{window,document,location,navigator,localStorage,sessionStorage,Date:Clock,Set,Number,JSON,URL});
 return {window,store,session,scripts,status,cookies,navigator,choose:value=>buttons[value](),advance:ms=>now+=ms,
  source:()=>JSON.parse(JSON.stringify(window.pinnacleEnquirySource?.()||null)),
  storageChange:key=>(windowHandlers.storage||[]).forEach(fn=>fn({key})),
  accepted:(receipt,acquisition=window.pinnacleEnquirySource?.()||null)=>(handlers['pinnacle:enquiry-accepted']||[]).forEach(fn=>fn({detail:{receipt,acquisition}})),
  commands:()=>Array.from(window.dataLayer||[],x=>Array.from(x)),
  events:()=>Array.from(window.dataLayer||[],x=>Array.from(x)).filter(x=>x[0]==='event')};
}
