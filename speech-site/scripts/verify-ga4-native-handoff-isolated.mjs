// Explicit isolated native-SDK verification; never auto-run as a unit test.
// No customer, backend submission, call or vendor conversion is created.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {chromium} from 'playwright';
const root=process.env.PINNACLE_GA4_FIXTURE_UNION,out=process.env.PINNACLE_GA4_FIXTURE_OUTPUT;assert(root&&out,'Explicit accepted asset union and private output required');
const hash=b=>createHash('sha256').update(b).digest('hex'),id='G-2BYLRLFRDJ',origin='https://www.pinnacleblooms.org',speech='/top-speech-therapy-center-india-proven-improvement-rate',enrol='/enroll-autism-speech-aba-therapies-india',sdkURL='https://www.googletagmanager.com/gtag/js?id='+id;
await fs.mkdir(out,{recursive:true});const sdkPath=path.join(out,'native-gtag-sdk.js');let sdk;
try{sdk=await fs.readFile(sdkPath);}catch(e){if(e.code!=='ENOENT')throw e;const r=await fetch(sdkURL,{signal:AbortSignal.timeout(45000)});assert.equal(r.status,200);sdk=Buffer.from(await r.arrayBuffer());await fs.writeFile(sdkPath,sdk);}
const collector=await fs.readFile('public/pinnacle-pages-scripts/speech-measurement.js'),collected=[];let externalSent=0,firstPartyPosts=0,otherBlocked=0;
const browser=await chromium.launch({headless:true});
try{const context=await browser.newContext({viewport:{width:390,height:844}});await context.addInitScript(()=>localStorage.setItem('pinnacle-speech-analytics-v1',JSON.stringify({value:'accepted',at:Date.now()})));
await context.addCookies([{name:'ps_ga',value:'GA1.1.1111111111.1111111111',domain:'www.pinnacleblooms.org',path:speech,secure:true,sameSite:'Lax'}]);
await context.route('**/*',async route=>{const request=route.request(),u=new URL(request.url());
 if(u.hostname==='www.googletagmanager.com'&&u.pathname==='/gtag/js'&&u.searchParams.get('id')===id)return route.fulfill({status:200,contentType:'text/javascript',body:sdk});
 if(/(^|\.)google-analytics\.com$|(^|\.)analytics\.google\.com$/.test(u.hostname)&&u.pathname.endsWith('/collect')){const bodies=[u.search.slice(1),...(request.postData()||'').split('\n').filter(Boolean)];let values=new URLSearchParams();for(const body of bodies)for(const [k,v]of new URLSearchParams(body))values.set(k,v);collected.push(Object.fromEntries(values));return route.fulfill({status:204,body:''});}
 if(u.origin!==origin){otherBlocked++;return route.abort();}
 if(request.method()!=='GET'){firstPartyPosts++;return route.abort();}
 const file=u.pathname===speech?'/pinnacle-pages-html/speech.html':u.pathname===enrol?'/pinnacle-pages-html/enrolment.html':u.pathname;
 try{const bytes=u.pathname==='/pinnacle-pages-scripts/speech-measurement.js'?collector:await fs.readFile(path.join(root,file));const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'}[path.extname(file)]||'application/octet-stream';return route.fulfill({status:200,contentType:mime,body:bytes});}catch{return route.abort();}
});
const page=await context.newPage();
const identity=()=>page.evaluate(id=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Native SDK identity unavailable')),15000);window.gtag('get',id,'client_id',client=>window.gtag('get',id,'session_id',session=>{clearTimeout(timer);resolve({client,session});}));}),id);
const waitFor=async check=>{const end=Date.now()+15000;while(!check()){assert(Date.now()<end,'Expected isolated native SDK transport absent');await new Promise(r=>setTimeout(r,100));}};
await page.goto(origin+speech+'?utm_source=google&utm_medium=cpc&utm_campaign=Hyderabad_Speech&gclid=ISOLATED_LOCAL_FIXTURE',{waitUntil:'domcontentloaded'});const first=await identity();assert(first.client&&first.session);await waitFor(()=>collected.some(r=>r.en==='page_view'));
const source=await page.evaluate(()=>window.pinnacleEnquirySource());assert.equal(source.landingPath,speech);assert.equal(source.fields.utm_source,'google');
await page.goto(origin+enrol,{waitUntil:'domcontentloaded'});const second=await identity();assert.equal(second.client,first.client,'Client continuity');assert.equal(second.session,first.session,'Session continuity');
const destination=await page.evaluate(()=>({source:window.pinnacleEnquirySource(),config:Array.from(window.dataLayer||[],x=>Array.from(x)).filter(x=>x[0]==='config').at(-1)?.[2]}));assert.deepEqual(destination.source,source);assert.equal(destination.config.cookie_path,'/');assert(!Object.hasOwn(destination.config,'campaign_source'));
const receipt={schemaVersion:1,requestId:'offline-ga4-fixture-request-0001',id:'offline-ga4-fixture-receipt-0001'};
await page.evaluate(({receipt,acquisition})=>{const detail={receipt,acquisition};document.dispatchEvent(new CustomEvent('pinnacle:enquiry-accepted',{detail}));document.dispatchEvent(new CustomEvent('pinnacle:enquiry-accepted',{detail}));},{receipt,acquisition:source});await waitFor(()=>collected.some(r=>r.en==='enquiry_accepted'));
// Reload the actual page normally. The existing form persists acceptance
// before emitting; it never re-emits a restored accepted attempt on load.
await page.reload({waitUntil:'domcontentloaded'});await identity();await new Promise(r=>setTimeout(r,1000));
const events=collected.filter(r=>r.en==='enquiry_accepted');assert.equal(events.length,1);assert.equal(events[0].cid,first.client);assert.equal(events[0].sid,first.session);assert.equal(firstPartyPosts,0);assert(!JSON.stringify(collected).includes('offline-ga4-fixture'));
const cookies=(await context.cookies()).filter(c=>c.name.startsWith('ps_ga'));assert(cookies.length>0);assert(cookies.every(c=>c.path==='/'));const landing=collected.find(r=>r.en==='page_view'&&r.dl?.includes(speech));assert(landing);assert.equal(landing.cs,'google');assert.equal(landing.cm,'cpc');assert.equal(landing.cn,'Hyderabad_Speech');
const result={status:'passed',at:new Date().toISOString(),scope:'Isolated browser fixture with the real Google tag JavaScript; all browser requests intercepted. Not production ingestion or a genuine enquiry.',collectorSHA256:hash(collector),sdk:{source:sdkURL,sha256:hash(sdk)},clientContinuity:true,sessionContinuity:true,landingCampaign:{source:landing.cs,medium:landing.cm,campaign:landing.cn},destinationDoesNotClearCampaign:true,protectedSourceUnchanged:true,rootCookieScope:true,acceptanceFixtureEvents:events.length,samePageDuplicateSuppressed:true,reloadDoesNotAutoEmit:true,externalRequestsSent:externalSent,otherExternalRequestsBlocked:otherBlocked,firstPartySubmissions:firstPartyPosts,realReceiptsCreated:0,realGoogleHits:0,identifiersPersisted:0};await fs.writeFile(path.join(out,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));await context.close();
}finally{await browser.close();}
