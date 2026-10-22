// In-memory browser-shaped fixture. Scripts are captured and never loaded.
import vm from 'node:vm';
export function collector(source,{url,referrer='',store=new Map(),session=new Map()}={}){
 const location=new URL(url),scripts=[],listeners={};
 const document={title:'Pinnacle',referrer,currentScript:{nonce:''},visibilityState:'visible',body:{dataset:{pageVariant:'service'}},
  querySelector(selector){if(selector==='[data-book-commerce]')return {dataset:{cartCatalogue:'{}'}};return null;},
  querySelectorAll(){return [];},createElement(){return {setAttribute(k,v){this[k]=v;},remove(){}};},head:{append(s){scripts.push(s);}},
  addEventListener(name,fn){const old=listeners[name];listeners[name]=e=>{old?.(e);fn(e);};},dispatchEvent(e){listeners[e.type]?.(e);return true;}};
 Object.defineProperty(document,'cookie',{get:()=>'',set(){}});
 const window={addEventListener(){}};
 const localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
 const sessionStorage={getItem:k=>session.get(k)??null,setItem:(k,v)=>session.set(k,v)};
 const sandbox={window,document,location,localStorage,sessionStorage,URL,URLSearchParams,Date,Set,Map,JSON,Math,Number,Event,navigator:{},MutationObserver:class{observe(){}}};
 vm.runInNewContext(source,sandbox,{importModuleDynamically:()=>Promise.reject(Error('No network in this fixture'))});
 return {window,store,scripts,commands:()=>Array.from(window.dataLayer||[],e=>Array.isArray(e)?e:Array.from(e)),source:()=>JSON.parse(store.get('pinnacle-enquiry-source-v1')||'null')};
}
