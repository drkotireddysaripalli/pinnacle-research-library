import test from 'node:test';import assert from 'node:assert/strict';
import {fetchPublicOrigin} from '../deployment/public-mobile-recovery.mjs';
const mobile='Mozilla/5.0 Android Mobile';
test('shared public resource template recovers exact article and retains campaign bytes',async()=>{
 const failure='<title>Error</title>System.NullReferenceException ASP._Page_Views_Shared_SunshineInnerPage_V9_Mobile_cshtml.Execute()';
 for(const prefix of ['t','c','ma','b','m','a','abs','abilities','skills']){
  const path='/'+prefix+'/interactive-song-therapy',q=req(path+'?gclid=a%2Bb&utm_content=x&utm_content=y');let count=0;
  const r=await fetchPublicOrigin(q,async retry=>{assert.equal(retry.url,q.url);return ++count===1?new Response(failure,{status:500,headers:{'content-type':'text/html'}}):new Response('<title>Interactive Song Therapy | Pinnacle Blooms</title><link rel="canonical" href="https://www.pinnacleblooms.org'+path+'"><h1>Interactive Song Therapy</h1><p>Original article content</p>',{headers:{'content-type':'text/html'}});});
  assert.equal(r.status,200);assert.equal(count,2);assert((await r.text()).includes('Original article content'));
 }
 for(const [path,body,canonical] of [['/api/interactive-song-therapy',failure,'/api/interactive-song-therapy'],['/t/interactive-song-therapy',failure.replace('SunshineInnerPage','UnrelatedPage'),'/t/interactive-song-therapy'],['/t/interactive-song-therapy',failure,'/t/different-topic']]){
  let count=0;const first=new Response(body,{status:500,headers:{'content-type':'text/html'}});
  const r=await fetchPublicOrigin(req(path),async()=>++count===1?first:new Response('<title>Different topic</title><link rel="canonical" href="https://www.pinnacleblooms.org'+canonical+'"><h1>Different topic</h1>',{headers:{'content-type':'text/html'}}));
  assert.equal(r,first);
 }
});
const req=(path='/?gclid=x&utm_source=google',options={})=>new Request('https://www.pinnacleblooms.org'+path,{headers:{'user-agent':mobile,...options.headers},method:options.method||'GET'});
const error=()=>new Response('<title>Error</title>Newtonsoft.Json.JsonReaderException GetStaffandCentersData',{status:500,headers:{'content-type':'text/html'}});
const success=(path='/')=>new Response('<title>#1 Autism Therapy Centres Network -for your kids</title><link rel="canonical" href="https://www.pinnacleblooms.org'+path+'?gclid=x"><h1>Public home</h1>',{headers:{'content-type':'text/html','set-cookie':'public-preference=x','etag':'old','vary':'Accept-Encoding'}});
// Exact public stack fragments from the observed homepage failure, without its
// unrelated HTML, server filesystem path or exception output in the repository.
const rootFaqError='<title>Error</title>Newtonsoft.Json.JsonReaderException: Unexpected character encountered while parsing value: &lt;. Path &#39;&#39;, line 0, position 0.\n'+
 'at PinnacleBlooms.MISC.Utility.GetFaqs(String lang, String category)\n'+
 'at ASP._Page_Views_Home_Index_V9_Mobile_cshtml.Execute() Index-V9.Mobile.cshtml:line 11';
test('observed root FAQ failure recovers, but wrong route or incomplete fingerprint does not',async()=>{
 for(const [q,html,expected] of [[req(),rootFaqError,2],[req('/careers'),rootFaqError,1],[req(),rootFaqError.replace('Index-V9.Mobile.cshtml:line 11','different-view'),1]]){
  let n=0;const original=new Response(html,{status:500,headers:{'content-type':'text/html'}});
  const result=await fetchPublicOrigin(q,async()=>++n===1?original:success());assert.equal(n,expected);assert.equal(result.status,expected===2?200:500);
 }
});
test('reproduced origin exception recovers once without dropping URL, cookies or query',async()=>{const seen=[];const r=await fetchPublicOrigin(req(undefined,{headers:{cookie:'preference=x'}}),async q=>{seen.push(q);return seen.length===1?error():success();});assert.equal(r.status,200);assert.equal(seen.length,2);assert.equal(seen[1].url,seen[0].url);assert.equal(seen[1].headers.get('cookie'),'preference=x');assert(!/Mobile/.test(seen[1].headers.get('user-agent')));assert.equal(r.headers.get('cache-control'),'private, no-store');assert.equal(r.headers.get('set-cookie'),'public-preference=x');assert.equal(r.headers.get('vary'),'Accept-Encoding, User-Agent');assert.equal(r.headers.get('etag'),null);assert((await r.text()).includes('href="https://www.pinnacleblooms.org/"'));});
test('successful requests and unknown exceptions are never retried',async()=>{for(const response of [success(),new Response('<title>Error</title>Different failure',{status:500,headers:{'content-type':'text/html'}})]){let count=0;const r=await fetchPublicOrigin(req(),async()=>{count++;return response});assert.equal(r,response);assert.equal(count,1);}});
test('auth, API, submissions, unknown paths, ranges and no-transform retain original behavior',async()=>{for(const q of [req('/api/enrolment'),req('/ask/account'),req('/',{method:'POST'}),req('/',{headers:{authorization:'Bearer x'}}),req('/',{headers:{range:'bytes=0-9'}}),req('/',{headers:{'cache-control':'no-transform'}})]){let count=0;const original=error();assert.equal(await fetchPublicOrigin(q,async()=>{count++;return original}),original);assert.equal(count,1);}});
test('wrong identity, non-HTML, failed retry and exceptions preserve original failure',async()=>{for(const second of [success('/other'),new Response('No',{headers:{'content-type':'text/plain'}}),new Response('Still failing',{status:500}),null]){let n=0;const original=error();const r=await fetchPublicOrigin(req(),async()=>{if(!n++)return original;if(!second)throw Error('outage');return second});assert.equal(r,original);assert.equal(n,2);}});
test('named legacy failures recover only matching public identities, including historical lowercase terms',async()=>{
 const cases=[['/child-psychological-counseling','Best Child Counselling Centers in Delhi','/child-psychological-counseling','<title>Error</title>Newtonsoft.Json.JsonReaderException PinnacleBlooms.MISC.Utility.GetFaqs(String lang, String category) ASP._Page_Views_Home_PsychologicalCounselling_V9_Mobile_cshtml.Execute()'],['/franchise-autism-therapy-center','Advantages of pinnacle blooms network franchises','/franchises','<title>Error</title>Newtonsoft.Json.JsonReaderException GetStaffandCentersData'],['/epass','#1 Autism Therapy Centres Network','/epass',rootFaqError],['/TOS','Pinnacle Blooms - Terms of usage','/tos','<title>Error</title>Newtonsoft.Json.JsonReaderException GetStaffandCentersData']];
 for(const [path,title,canonical,html]of cases){let n=0;const r=await fetchPublicOrigin(req(path+'?utm_source=google'),async q=>{n++;assert(q.url.includes('utm_source=google'));return n===1?new Response(html,{status:500,headers:{'content-type':'text/html'}}):new Response('<title>'+title+'</title><link rel="canonical" href="https://www.pinnacleblooms.org'+canonical+'"><h1>Original public page</h1>',{headers:{'content-type':'text/html'}});});assert.equal(n,2);assert.equal(r.status,200);assert((await r.text()).includes('href="https://www.pinnacleblooms.org'+canonical+'"'));}
});

test('five Semrush mobile failures recover the same public page with campaign query intact',async()=>{
 const pages=[['/yoga-therapy','Best Yoga Therapy Centers In Hyderabad, Delhi, Vizag, Vijay'],['/physiotherapy','Best Physio Therapy In Delhi, Hyderabad, Bengaluru, Vizag,'],['/hydro-therapy','Best Hydro Therapy Centers in Delhi, Hyderabad, Bengaluru,'],['/autism-speech-aba-parent-family-resources','Resources - Pinnacle Blooms Network Improving quality-of-li'],['/autism-speech-aba-news','News - Child Development, Rehabilitation centers - Autism']];
 for(const [path,title]of pages){
  let attempts=0;const q=req(path+'?utm_source=google&utm_medium=cpc');
  const r=await fetchPublicOrigin(q,async request=>{
   attempts++;assert.equal(request.url,q.url);
   return attempts===1?error():new Response('<title>'+title+'</title><link rel="canonical" href="https://www.pinnacleblooms.org'+path+'"><h1>Original public content</h1><a href="tel:+919100181181">Call</a>',{headers:{'content-type':'text/html'}});
  });
  assert.equal(r.status,200);assert.equal(attempts,2);assert.equal(r.headers.get('cache-control'),'private, no-store');
  assert((await r.text()).includes('<h1>Original public content</h1>'));
 }
 let attempts=0;const q=req('/yoga-therapy');const original=error();
 const r=await fetchPublicOrigin(q,async()=>++attempts===1?original:new Response('<title>Best Hydro Therapy Centers in Hyderabad</title><link rel="canonical" href="https://www.pinnacleblooms.org/yoga-therapy">',{headers:{'content-type':'text/html'}}));
 assert.equal(r,original,'Wrong service title must never turn an error into an unrelated page');
});
