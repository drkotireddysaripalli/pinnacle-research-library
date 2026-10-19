import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile,writeFile} from 'node:fs/promises';

const source=await readFile(new URL('./phone-analytics.js',import.meta.url),'utf8');
const html=await readFile(new URL('./preview.html',import.meta.url),'utf8');
const analyticsId='G-H9CLX1WJ7R',adsId='AW-10810823199',callAction=adsId+'/VNUcCMSy3YobEJ-kgKMo';
const sourceKey='pinnacle-enquiry-source-v1';
const realLinks=[...html.matchAll(/<a\b([^>]+data-call-placement="([^"]+)"[^>]*)>/g)].map(match=>({
  href:match[1].match(/href="([^"]+)"/)[1],placement:match[2]
}));

function browser(options={}){
  const scripts=[],listeners={},storage=new Map(),session=new Map(),storageWrites=[];
  if(options.qaAt!==undefined)session.set('pinnacle-validation-v1',String(options.qaAt));
  const link=(href,text,placement)=>{
    const attrs=new Map([['href',href],['aria-label','Call '+text]]),node={nodeValue:text};
    return {dataset:{...(placement?{callPlacement:placement}:{})},node,
      setAttribute(k,v){attrs.set(k,v);if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;},
      getAttribute:k=>attrs.get(k)??null,removeAttribute:k=>attrs.delete(k),closest(){return this;}};
  };
  const links=realLinks.map(item=>link(item.href,'Call 9100 181 181',item.placement));
  links.push(link('tel:+914012345678','040 1234 5678','local'));
  let mutation;
  const document={
    body:{},
    querySelector:selector=>selector.includes('googletagmanager.com/gtag/js')&&options.existingTag?{}:null,
    querySelectorAll:selector=>selector==='a[href^="tel:"]'?links:[],
    createTreeWalker:target=>{let moved=false;return {currentNode:target.node,nextNode:()=>moved?false:(moved=true)};},
    createElement:()=>({setAttribute(k,v){this[k]=v;}}),
    head:{append:element=>scripts.push(element)},
    addEventListener:(name,fn)=>(listeners[name]??=[]).push(fn)
  };
  const location=new URL(options.url||'https://www.pinnacleblooms.org/national-autism-helpline');
  const localStorage={
    getItem:key=>storage.get(key)??null,
    setItem(key,value){storage.set(key,value);storageWrites.push([key,value]);},
    removeItem:key=>storage.delete(key)
  };
  const sessionStorage={getItem:key=>session.get(key)??null,setItem:(key,value)=>session.set(key,value)};
  const window={};
  const context={window,document,location,localStorage,sessionStorage,URL,Date,Map,Set,Number,
    MutationObserver:class{constructor(fn){mutation=fn;}observe(){}},console};
  vm.runInNewContext(source,context);
  const commands=()=>Array.from(window.dataLayer||[],entry=>Array.from(entry));
  const events=()=>commands().filter(entry=>entry[0]==='event');
  const click=target=>{
    const event={target,preventDefault(){throw Error('dialling was intercepted');},stopPropagation(){throw Error('dialling was intercepted');}};
    for(const fn of listeners.click||[])fn(event);
  };
  const callback=()=>commands().find(entry=>entry[0]==='config'&&entry[1]===callAction)?.[2].phone_conversion_callback;
  return {window,document,location,links,scripts,listeners,storage,storageWrites,commands,events,click,callback,createLink:link,mutate:()=>mutation?.()};
}

const results=[];
function check(name,run){run();results.push({name,passed:true});}

check('Eight public helpline call placements remain unique and use the central number',()=>{
  assert.equal(realLinks.length,8);assert.equal(new Set(realLinks.map(item=>item.placement)).size,8);
  assert(realLinks.every(item=>item.href==='tel:+919100181181'));
});

check('No visitor measurement choice, refusal state or GPC gate remains',()=>{
  for(const token of ['data-analytics-panel','data-analytics-choice','pinnacle-helpline-measurement-choice','globalPrivacyControl','Allow analytics','Keep analytics off']){
    assert.equal(source.includes(token)||html.includes(token),false,token);
  }
});

check('A production visit starts GA4, Ads and call measurement exactly once',()=>{
  const b=browser();
  assert.equal(b.scripts.length,1);assert.equal(b.scripts[0].src,'https://www.googletagmanager.com/gtag/js?id='+analyticsId);
  assert.deepEqual(b.events().map(entry=>entry[1]),['page_view']);
  for(const target of [analyticsId,adsId,callAction])assert.equal(b.commands().filter(entry=>entry[0]==='config'&&entry[1]===target).length,1,target);
  const consent=b.commands().filter(entry=>entry[0]==='consent');
  assert.equal(consent.length,2);
  for(const entry of consent)for(const key of ['analytics_storage','ad_storage','ad_user_data'])assert.equal(entry[2][key],'granted');
  assert(consent.every(entry=>entry[2].ad_personalization==='denied'));
  assert(b.commands().some(entry=>entry[0]==='set'&&entry[1]==='ads_data_redaction'&&entry[2]===false));
  const ga=b.commands().find(entry=>entry[0]==='config'&&entry[1]===analyticsId)[2];
  assert.equal(ga.send_page_view,false);assert.equal(ga.page_location,'https://www.pinnacleblooms.org/national-autism-helpline');assert.equal(ga.page_referrer,'');
  assert(!JSON.stringify(b.commands()).includes('PRIVATE_CANARY'));
});

check('An existing Google tag is reused without losing configuration or events',()=>{
  const b=browser({existingTag:true});assert.equal(b.scripts.length,0);
  assert.equal(b.commands().filter(entry=>entry[0]==='config').length,3);assert.deepEqual(b.events().map(entry=>entry[1]),['page_view']);
});

check('Forwarding-number replacement changes only central links and tracked calls still fire',()=>{
  const b=browser(),central=b.links[0],local=b.links.at(-1),callback=b.callback();
  assert.equal(typeof callback,'function');callback('+1 202 555 0142','+12025550142');
  assert.equal(central.getAttribute('href'),'tel:+12025550142');assert.equal(central.dataset.pinnacleAdCallTarget,'central');
  assert.equal(local.getAttribute('href'),'tel:+914012345678');
  const before=b.events().length;assert.doesNotThrow(()=>b.click(central));assert.equal(b.events().length,before+1);
  assert.equal(b.events().at(-1)[1],'phone_link_click');assert.equal(b.events().at(-1)[2].link_placement,realLinks[0].placement);
  const later=b.createLink('tel:+919100181181','Call 9100 181 181','closing');b.links.push(later);
  callback('invalid','PRIVATE_CANARY');assert.equal(later.getAttribute('href'),'tel:+919100181181');
  b.mutate();assert.equal(later.getAttribute('href'),'tel:+12025550142');
});

check('Every approved placement produces one bounded event without blocking dialling',()=>{
  const b=browser();
  for(const link of b.links.slice(0,8)){
    const before=b.events().length;assert.doesNotThrow(()=>b.click(link));assert.equal(b.events().length,before+1);
    const event=b.events().at(-1);assert.equal(event[1],'phone_link_click');
    assert.deepEqual(Object.keys(event[2]).sort(),['schema_version','page_group','link_placement','destination','page_location','page_title','page_referrer','send_to'].sort());
  }
  const before=b.events().length;b.click(b.links.at(-1));assert.equal(b.events().length,before);
});

check('Only the two reviewed ChatGPT tuples enter GA4 and the journey envelope',()=>{
  for(const name of ['pinnacle_vizag_call_enquiries','pinnacle_hyderabad_vijayawada_call_enquiries']){
    const b=browser({url:'https://www.pinnacleblooms.org/national-autism-helpline?utm_source=chatgpt&utm_medium=paid&utm_campaign='+name});
    const page=b.events()[0][2];assert.equal(page.campaign_source,'chatgpt');assert.equal(page.campaign_medium,'paid');assert.equal(page.campaign_name,name);
    const saved=JSON.parse(b.storage.get(sourceKey));assert.equal(saved.fields.utm_campaign,name);assert.equal(saved.landingPath,'/national-autism-helpline');
  }
});

check('Google click IDs remain in the landing URL for the granted Google tag and never enter custom payloads',()=>{
  const b=browser({url:'https://www.pinnacleblooms.org/national-autism-helpline?gclid=TEST_CLICK_ID&utm_source=google&utm_medium=cpc&utm_campaign=aba'});
  assert.equal(b.location.searchParams.get('gclid'),'TEST_CLICK_ID');assert.equal(b.scripts.length,1);
  assert(!JSON.stringify(b.commands()).includes('TEST_CLICK_ID'));assert.equal(b.storage.has(sourceKey),false);
});

check('Unknown or private campaign values never enter analytics or storage',()=>{
  for(const query of ['utm_source=chatgpt&utm_medium=paid&utm_campaign=PRIVATE_CANARY','utm_source=chatgpt&utm_medium=paid&utm_campaign=pinnacle_vizag_call_enquiries&utm_term=PRIVATE_CANARY','email=PRIVATE_CANARY#PRIVATE_CANARY']){
    const b=browser({url:'https://www.pinnacleblooms.org/national-autism-helpline?'+query});
    assert(!JSON.stringify(b.commands()).includes('PRIVATE_CANARY'));assert.equal(b.storage.has(sourceKey),false);
  }
});

check('Labelled QA, preview, apex and unrelated routes remain unmeasured',()=>{
  for(const options of [
    {url:'https://www.pinnacleblooms.org/national-autism-helpline?validation_test=measurement_20261019'},
    {qaAt:Date.now()-1000},
    {url:'http://127.0.0.1:8787/national-autism-helpline'},
    {url:'https://pinnacleblooms.org/national-autism-helpline'},
    {url:'https://www.pinnacleblooms.org/verify/'}
  ]){const b=browser(options);assert.equal(b.scripts.length,0);assert.equal(b.commands().length,0);}
});

const report={checkedAt:new Date().toISOString(),passed:results.length,results,scope:'Automatic first-party helpline measurement tests. Third-party requests and receiving-platform ingestion require separate live verification; a phone-link event does not prove a connected call.'};
await writeFile(new URL('./phone-analytics-test-results.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
