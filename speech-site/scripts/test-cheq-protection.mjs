import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const code=await fs.readFile(new URL('../public/pinnacle-pages-scripts/cheq-protection.js',import.meta.url),'utf8');
function setup({path='/centers',query='',hash='',referrer='',host='www.pinnacleblooms.org',qaAt,existing=false}={}){
 const scripts=[];
 const location={protocol:'https:',hostname:host,pathname:path,hash,href:'https://'+host+path+query+hash};
 const document={
  referrer,
  querySelector:s=>s==='script.ct_clicktrue_102663'&&existing?{}:null,
  createElement:()=>({dataset:{},setAttribute(k,v){this[k]=v;}}),
  head:{appendChild:e=>scripts.push(e)}
 };
 const window={};
 const sessionStorage={getItem:()=>qaAt||null,setItem:(key,value)=>{qaAt=value;}};
 const neverStore=new Proxy({}, {get(){throw Error('visitor choice storage must not be accessed');}});
 const context={window,document,location,navigator:{globalPrivacyControl:true},localStorage:neverStore,sessionStorage,URL,Date,console};
 vm.createContext(context);vm.runInContext(code,context);
 return {context,scripts};
}

test('CHEQ has no visitor choice UI, storage or GPC gate',()=>{
 for(const token of ['data-cheq-choice','data-cheq-preferences','pinnacle-cheq-consent','globalPrivacyControl','localStorage','Allow traffic protection','Keep traffic protection off'])assert.equal(code.includes(token),false,token);
});

test('eligible commercial routes install exactly one automatic vendor tag',()=>{
 for(const path of ['/centers','/best-aba-therapy-center-india-proven-improvement-rate','/top-speech-therapy-center-india-proven-improvement-rate','/autism-therapy']){
  const x=setup({path,query:'?q=private-text'});assert.equal(x.scripts.length,1,path);
  const script=x.scripts[0];assert.equal(script.className,'ct_clicktrue_102663');assert.equal(script.dataset.ch,'www.pinnacleblooms.org');assert.equal(script.dataset.jsonp,'onCheqResponse');assert.equal(script['data-include-qs'],'__pinnacle_no_query_parameter__');assert.equal(script.referrerPolicy,'no-referrer');
  assert.deepEqual(JSON.parse(JSON.stringify(x.context.window.__pinnacleCheq)),{started:true,enabled:true,responses:0});
 }
 assert.equal(setup({existing:true}).scripts.length,0);
});

test('callback retains only a response count and an SDK error cannot block the page',()=>{
 const x=setup();x.context.window.onCheqResponse({private:'ignored'},'request-id','visitor-id');assert.equal(x.context.window.__pinnacleCheq.responses,1);assert.equal(JSON.stringify(x.context.window.__pinnacleCheq).includes('visitor-id'),false);x.scripts[0].onerror();assert.equal(x.context.window.__pinnacleCheq.enabled,false);
});

test('private, form, authentication, checkout and unrelated routes never install',()=>{
 for(const path of ['/ask','/ask/account','/ask/auth/callback','/faq','/sunshine','/enroll-autism-speech-aba-therapies-india','/shop/cart']){const x=setup({path});assert.equal(x.context.window.__pinnacleCheq,undefined,path);assert.equal(x.scripts.length,0,path);}
 assert.equal(setup({host:'pinnacleblooms.org'}).scripts.length,0);
});

test('labelled QA, fragments, unsafe referrers and reserved query fields stay excluded',()=>{
 for(const options of [
  {query:'?validation_test=measurement_20261019'},
  {qaAt:String(Date.now()-1000)},
  {hash:'#private'},
  {referrer:'https://www.pinnacleblooms.org/faq/child-topic'},
  {referrer:'https://untrusted.example/search?q=private'},
  {query:'?__pinnacle_no_query_parameter__=private'}
 ])assert.equal(setup(options).scripts.length,0,JSON.stringify(options));
});

test('expired and invalid QA markers do not suppress an otherwise eligible public route',()=>{
 for(const qaAt of [String(Date.now()-86401000),String(Date.now()+86400000),'invalid'])assert.equal(setup({qaAt}).scripts.length,1,qaAt);
});
