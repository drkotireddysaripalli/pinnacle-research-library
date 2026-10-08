// Isolated browser + real SQL fixture trace. All website documents/API responses
// are fulfilled locally; no customer, call, WhatsApp or vendor collector is used.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {chromium} from '@playwright/test';import {serveSpeech} from '../deployment/speech-handler.mjs';import {serveEnrolmentApi} from '../deployment/enrolment-handler.mjs';import {receiveReceiptEnrolment} from '../deployment/enrolment-receipt.mjs';import {fixtureLedger} from '../tests/fixtures/enrolment-ledger-sqlite.mjs';
const origin='https://www.pinnacleblooms.org',enrol='/enroll-autism-speech-aba-therapies-india',speech='/top-speech-therapy-center-india-proven-improvement-rate',centre='/centers/best-autism-speech-aba-occupational-therapy-center-suchitra-hyderabad-telangana-india',root=path.resolve('release-public-completion-20261008');
const inventory=JSON.parse((await fs.readFile('deployment/pinnacle-route-v12.mjs','utf8')).match(/const SPEECH_INVENTORY=(\{[^\n]+\});/)[1]);
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.json':'application/json'},ASSETS={fetch:async q=>{const p=new URL(typeof q==='string'?q:q.url).pathname;try{return new Response(await fs.readFile(path.join(root,p)),{headers:{'content-type':mime[path.extname(p)]||'application/octet-stream'}})}catch{return new Response('missing',{status:404})}}};
const browser=await chromium.launch({headless:true,channel:'msedge'}),cases=[];let vendorBlocked=0,totalHandoffs=0;
try{
 for(const state of ['accepted','declined','unknown','validation']){
  const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),sql=fixtureLedger();let submissions=0,handoffs=0,body;
  const env={ASSETS,ENROLMENT_RECEIPT_VERSION:'1',PINNACLE_ENROLMENT_RECEIPTS:{receive:async(data,key)=>receiveReceiptEnrolment(data,{idempotencyKey:key,ledger:sql.ledger,handoff:async()=>{handoffs++;totalHandoffs++;if(state==='unknown')throw Error('Isolated uncertainty');return 'qa_fixture_v1:offline-browser-only';}})}};
  await context.route('**/*',async route=>{
   const q=route.request(),u=new URL(q.url());if(u.origin!==origin){vendorBlocked++;return route.abort();}
   let r;
   if(u.pathname==='/api/enrolment'){submissions++;body=q.postDataJSON();r=await serveEnrolmentApi(new Request(q.url(),{method:q.method(),headers:q.headers(),body:q.postData()}),env);}
   else if(/^\/pinnacle-pages-scripts\/(?:enrolment(?:-api|-source)?\.m?js|speech-measurement\.js)$/.test(u.pathname))r=new Response(await fs.readFile(path.join('public',u.pathname)),{headers:{'content-type':'text/javascript'}});
   else r=await serveSpeech(new Request(q.url(),{method:q.method(),headers:q.headers()}),env,inventory);
   if(!r)return route.abort();const bytes=Buffer.from(await r.arrayBuffer());let content=bytes;
   if(u.pathname===enrol)content=Buffer.from(bytes.toString().replaceAll('enrolment.js?v=receipt-20261007','enrolment.js?v=source-20261008'));
   await route.fulfill({status:r.status,headers:Object.fromEntries(r.headers),body:content});
  });
  const tagged='?utm_source=google&utm_medium=cpc&utm_campaign=ISOLATED-QA-BROWSER&gclid=qaSourceBrowser123&child_name=excluded'+(state==='validation'?'&validation_test=1':'');
  await page.goto(origin+speech+tagged,{waitUntil:'networkidle'});await page.locator('[data-speech-measurement]').evaluate(e=>e.open=true);await page.locator('[data-measurement-choice='+ (state==='declined'?'declined':'accepted')+']').click();
  await page.goto(origin+centre,{waitUntil:'networkidle'});await page.goto(origin+enrol+'?service=speech&centre=suchitra'+(state==='validation'?'&validation_test=1':''),{waitUntil:'networkidle'});
  await page.locator('#parent-name').fill('ISOLATED LOCAL QA');await page.locator('#parent-phone').fill('+91 00000 00000');await page.locator('#enrol-submit').evaluate(b=>{b.click();b.click();});
  await page.waitForFunction(()=>document.querySelector('#enrol-status').textContent.includes('Your request has been received')||document.querySelector('#enrol-status').textContent.includes('could not confirm'));
  assert.equal(submissions,1);assert.equal(handoffs,1);assert.equal(body.preferences.service,'speech');assert.equal(body.preferences.centre,'suchitra');
  const events=await page.evaluate(()=>Array.from(window.dataLayer||[],x=>Array.from(x)).filter(x=>x[0]==='event'));const acceptedEvents=events.filter(e=>e[1]==='enquiry_accepted');
  assert.equal(acceptedEvents.length,state==='accepted'?1:0);assert(!JSON.stringify(events).includes('ISOLATED LOCAL QA'));assert(!JSON.stringify(events).includes('qa_fixture_v1'));
  const row=sql.db.prepare('SELECT request_key,state,receipt_id,source_json FROM website_enrolment_receipts').get();assert.equal(row.request_key,body.requestId);const source=JSON.parse(row.source_json);
  if(state==='accepted'||state==='unknown'){assert.equal(body.source.acquisition.fields.gclid,'qaSourceBrowser123');assert.deepEqual(source.acquisition,body.source.acquisition);}else assert(!body.source.acquisition);
  const attempts=await page.evaluate(()=>localStorage.getItem('pbn-enrolment-request-v1'));for(const value of ['gclid','ISOLATED LOCAL QA','00000','acquisition'])assert(!attempts.includes(value));
  await page.reload({waitUntil:'networkidle'});assert.equal(submissions,1);assert.equal(handoffs,1);assert.equal(await page.evaluate(()=>Array.from(window.dataLayer||[],x=>Array.from(x)).filter(x=>x[0]==='event'&&x[1]==='enquiry_accepted').length),0);
  cases.push({case:state,requestId:body.requestId,receiptId:row.receipt_id,ledgerState:row.state,source,submissions,handoffs,acceptedEvents:acceptedEvents.length,reloadReposts:0,reloadAcceptedEvents:0});await page.screenshot({path:'ask-private/enquiry-source-20261008/'+state+'-390.png',fullPage:true});await context.close();sql.close();
 }
}finally{await browser.close();}
const proof={at:new Date().toISOString(),testOnly:true,passed:true,isolation:'All public documents and API responses intercepted locally; actual SQLite ledger only',viewport:{width:390,height:844},cases,isolatedHandoffs:totalHandoffs,actualGoogleHits:0,actualContacts:0,productionEnquiries:0,vendorRequestsBlocked:vendorBlocked};await fs.writeFile('deployment/enquiry-source-browser-20261008.json',JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify({passed:true,cases:cases.length,acceptedEvents:cases.map(c=>c.acceptedEvents),productionEnquiries:0,actualGoogleHits:0}));
