import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {centreContactMeasurement,measurementScript,addCentreMeasurement,CENTRE_ROUTES,MEASUREMENT_RELEASE} from '../deployment/centre-search-repair/centre-measurement.mjs';

const paths=Object.keys(CENTRE_ROUTES), origin='https://www.pinnacleblooms.org';
function harness(options={}) {
 const path=options.path||paths[0],config={...CENTRE_ROUTES[path],path};
 let stored=options.stored===undefined?JSON.stringify({value:'accepted',at:Date.now()}):options.stored;
 const calls=[],handlers=[];
 const window={gtag:(...args)=>calls.push(args)},navigator={globalPrivacyControl:!!options.gpc};
 const document={querySelector:()=>options.modernPanel?{}:null,addEventListener:(type,handler)=>{if(type==='click')handlers.push(handler);}};
 const context={window,navigator,document,location:{origin:options.origin||origin,pathname:path,search:'?private=child-name&gclid=secret'},localStorage:{getItem:()=>{if(options.storageBlocked)throw Error('blocked');return stored;}},URL,Date};
 const run=()=>vm.runInNewContext('('+centreContactMeasurement.toString()+')('+JSON.stringify(config)+')',context);
 run();if(options.twice)run();
 return {calls,window,navigator,setConsent:value=>stored=value,click:href=>handlers.forEach(handler=>handler({target:{closest:()=>href?{getAttribute:()=>href}:null},preventDefault:()=>{throw Error('must not block navigation');}})),handlers};
}
test('only consented named calls and valid enquiry handoffs; no initialization or acceptance event',()=>{
 for(const path of paths){
  const h=harness({path,twice:true});const {id,service}=CENTRE_ROUTES[path];
  assert.equal(h.calls.length,0);assert.equal(h.handlers.length,1);
  for(const href of ['tel:+919100181181','tel:919100181181','tel:9100181181'])h.click(href);
  h.click('/enroll-autism-speech-aba-therapies-india?service='+service+'&centre='+id);
  h.click(origin+'/enroll-autism-speech-aba-therapies-india');
  assert.deepEqual(h.calls.map(c=>c[1]),['phone_link_click','phone_link_click','phone_link_click','enquiry_link_click','enquiry_link_click']);
  assert(h.calls.every(c=>c[0]==='event'&&c[2].send_to==='G-2BYLRLFRDJ'&&c[2].page_location===origin+'/centers'&&c[2].page_referrer===''));
  const text=JSON.stringify(h.calls);for(const excluded of ['child-name','secret','?','enquiry_accepted','service=','centre='])assert(!text.includes(excluded));
 }
});
test('missing, declined, stale, future, malformed or unreadable consent sends nothing',()=>{
 for(const stored of [null,'broken','{}',JSON.stringify({value:'declined',at:Date.now()}),JSON.stringify({value:'accepted',at:Date.now()-181*86400000}),JSON.stringify({value:'accepted',at:Date.now()+60000}),JSON.stringify({value:'accepted',at:'today'})]){
  const h=harness({stored});h.click('tel:+919100181181');assert.equal(h.calls.length,0);
 }
 for(const options of [{gpc:true},{storageBlocked:true},{origin:'http://localhost:4330'},{modernPanel:true}]){const h=harness(options);h.click('tel:+919100181181');assert.equal(h.calls.length,0);}
});
test('withdrawal, GPC changes, unavailable gtag and Analytics disable are honored at click time',()=>{
 const h=harness();h.click('tel:+919100181181');assert.equal(h.calls.length,1);
 h.setConsent(JSON.stringify({value:'declined',at:Date.now()}));h.click('tel:+919100181181');assert.equal(h.calls.length,1);
 h.setConsent(JSON.stringify({value:'accepted',at:Date.now()}));h.navigator.globalPrivacyControl=true;h.click('tel:+919100181181');assert.equal(h.calls.length,1);
 h.navigator.globalPrivacyControl=false;h.window['ga-disable-G-2BYLRLFRDJ']=true;h.click('tel:+919100181181');assert.equal(h.calls.length,1);
 h.window['ga-disable-G-2BYLRLFRDJ']=false;delete h.window.gtag;h.click('tel:+919100181181');assert.equal(h.calls.length,1);
});
test('ignore other phones, external destinations, extra parameters, wrong or duplicate centre and service',()=>{
 const h=harness(),p='/enroll-autism-speech-aba-therapies-india';
 for(const href of [null,'tel:+919999999999','tel:+919100181181?private=child','https://evil.example'+p,'https://private@www.pinnacleblooms.org'+p,p+'?centre=lbnagar',p+'?service=help',p+'?centre=kukatpally&centre=kukatpally',p+'?name=private',p+'?service=',p+'-other'])h.click(href);
 assert.equal(h.calls.length,0);
});
test('legacy response gets one invisible script only, preserves content and cache policy',async()=>{
 for(const path of paths){
  const html='<html><head><script>gtag(\'config\', \'G-2BYLRLFRDJ\');</script></head><body><header>Original</header><main>Keep me</main><footer>Original</footer></body></html>';
  const request=new Request(origin+path+'?utm_source=private');
  const before=new Response(html,{headers:{'content-type':'text/html','x-pinnacle-local-journey':'approved','cache-control':'private, no-store, max-age=0',etag:'old'}});
  const after=await addCentreMeasurement(request,before),text=await after.text();
  assert.equal(text.replace(measurementScript(path),''),html);assert.equal(after.headers.get('cache-control'),'private, no-store, max-age=0');assert.equal(after.headers.get('etag'),null);assert.equal(after.headers.get('x-pinnacle-centre-measurement'),MEASUREMENT_RELEASE);
  const repeat=new Response(text,{headers:after.headers});assert.equal(await addCentreMeasurement(request,repeat),repeat);
 }
});
test('do not instrument other paths, failed transformation, absent existing tag or modern measurement',async()=>{
 for(const [path,html,headers,status]of [
  ['/ask','<body></body>',{'x-pinnacle-local-journey':'approved'},200],
  [paths[0],'<body></body>',{},200],
  [paths[0],'<body></body>',{'x-pinnacle-local-journey':'approved'},200],
  [paths[0],"<body>gtag('config', 'G-2BYLRLFRDJ') data-speech-measurement</body>",{'x-pinnacle-local-journey':'approved'},200],
  [paths[0],"<body>gtag('config', 'G-2BYLRLFRDJ')</body>",{'x-pinnacle-local-journey':'approved'},500]
 ]){const r=new Response(html,{status,headers:{'content-type':'text/html',...headers}});assert.equal(await addCentreMeasurement(new Request(origin+path),r),r);}
});
