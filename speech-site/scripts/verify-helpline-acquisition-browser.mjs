// Intercepted production-origin fixture; never contacts customer/vendor systems.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {chromium} from '@playwright/test';
import helplineWorker from '../../helpline-site/worker.mjs';import {serveSpeech} from '../deployment/speech-handler.mjs';import {serveEnrolmentApi} from '../deployment/enrolment-handler.mjs';import {receiveReceiptEnrolment} from '../deployment/enrolment-receipt.mjs';import {fixtureLedger} from '../tests/fixtures/enrolment-ledger-sqlite.mjs';
const origin='https://www.pinnacleblooms.org',helpline='/national-autism-helpline',enrol='/enroll-autism-speech-aba-therapies-india',out='ask-private/chatgpt-enquiry-20261010';await fs.mkdir(out,{recursive:true});
const campaigns=['pinnacle_vizag_call_enquiries','pinnacle_hyderabad_vijayawada_call_enquiries'];
const inventory=JSON.parse((await fs.readFile('deployment/pinnacle-route-v12.mjs','utf8')).match(/const SPEECH_INVENTORY=(\{[^\n]+\});/)[1]);
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.json':'application/json'};
const ASSETS={fetch:async q=>{const p=new URL(typeof q==='string'?q:q.url).pathname;for(const root of ['release-public-completion-20261008','public','dist']){try{return new Response(await fs.readFile(path.join(root,p)),{headers:{'content-type':mime[path.extname(p)]||'application/octet-stream'}})}catch{}}return new Response('missing',{status:404});}};
const browser=await chromium.launch({headless:true,channel:'msedge'}),cases=[];let blockedExternalRequests=0;
try{for(const [index,state] of ['accepted-mobile','accepted-desktop','refused','unknown','rejected'].entries()){
 const viewport={width:state==='accepted-desktop'?1440:390,height:state==='accepted-desktop'?1000:844};const context=await browser.newContext({viewport}),page=await context.newPage(),sql=fixtureLedger();let submissions=0,handoffs=0,body;const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const env={ASSETS,ENROLMENT_RECEIPT_VERSION:'1',PINNACLE_ENROLMENT_RECEIPTS:{receive:(data,key)=>receiveReceiptEnrolment(data,{idempotencyKey:key,ledger:sql.ledger,handoff:async()=>{handoffs++;if(state==='unknown')throw Error('Isolated uncertainty');return 'qa_fixture_v1:chatgpt-browser-only';}})}};
 await context.route('**/*',async route=>{const q=route.request(),u=new URL(q.url());if(u.origin!==origin){blockedExternalRequests++;return route.abort();}let response;
  if(u.pathname==='/api/enrolment'){submissions++;body=q.postDataJSON();response=state==='rejected'?Response.json({ok:false},{status:400}):await serveEnrolmentApi(new Request(q.url(),{method:q.method(),headers:q.headers(),body:q.postData()}),env);}
  else if(u.pathname.startsWith(helpline))response=await helplineWorker.fetch(new Request(q.url()),{});
  else if(/^\/pinnacle-pages-scripts\/(?:enrolment(?:-api|-source)?\.m?js|speech-measurement\.js)$/.test(u.pathname))response=new Response(await fs.readFile(path.join('public',u.pathname)),{headers:{'content-type':'text/javascript'}});
  else response=await serveSpeech(new Request(q.url(),{method:q.method(),headers:q.headers()}),env,inventory);
  if(!response)return route.abort();await route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:Buffer.from(await response.arrayBuffer())});
 });
 const campaign=campaigns[index===1?1:0];await page.goto(origin+helpline+'?utm_source=chatgpt&utm_medium=paid&utm_campaign='+campaign,{waitUntil:'networkidle'});
 assert.equal(await page.locator('a[href="tel:+919100181181"]').count(),8);assert.equal(await page.locator('[data-helpline-callback]').getAttribute('href'),enrol);
 await page.locator('[data-analytics-choice="accepted"]').click();
 const initial=await page.evaluate(()=>JSON.parse(localStorage.getItem('pinnacle-enquiry-source-v1')));assert.equal(initial.landingPath,helpline);
 if(index<2){await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:out+'/'+state+'-helpline.png',fullPage:false});}
 await page.locator('[data-helpline-callback]').click();await page.waitForURL(origin+enrol);await page.waitForLoadState('networkidle');
 assert.equal(await page.locator('[name="service"]:checked').inputValue(),'help');assert.equal(await page.locator('#preferred-centre').inputValue(),'');
 assert.equal(await page.evaluate(()=>window.pinnacleEnquirySource()),null);
 await page.locator('[data-speech-measurement]').evaluate(e=>e.open=true);await page.locator('[data-measurement-choice="'+(state==='refused'?'declined':'accepted')+'"]').click();
 const acquired=await page.evaluate(()=>window.pinnacleEnquirySource());if(state==='refused')assert.equal(acquired,null);else assert.deepEqual(acquired,initial);
 await page.locator('#parent-name').fill('ISOLATED LOCAL QA');await page.locator('#parent-phone').fill('+91 00000 00000');await page.locator('#enrol-submit').evaluate(b=>{b.click();b.click();});
 await page.waitForFunction(()=>/Your request has been received|not accepted|could not confirm/.test(document.querySelector('#enrol-status').textContent));
 await page.waitForTimeout(150);
 assert.equal(submissions,1);assert.equal(handoffs,state==='rejected'?0:1);assert.equal(body.source.page,enrol);
 const events=await page.evaluate(()=>Array.from(window.dataLayer||[],x=>Array.from(x)).filter(x=>x[0]==='event'));const acceptedEvents=events.filter(e=>e[1]==='enquiry_accepted');const success=state.startsWith('accepted')||state==='refused';
 assert.equal(acceptedEvents.length,state.startsWith('accepted')?1:0);assert(!JSON.stringify(events).includes('ISOLATED LOCAL QA'));assert(!JSON.stringify(events).includes('qa_fixture_v1'));
 const row=sql.db.prepare('SELECT state,receipt_id,source_json,lead_reference FROM website_enrolment_receipts').get();if(success)assert.equal(row.state,'accepted');
 if(state==='refused')assert(!body.source.acquisition);else{assert.deepEqual(body.source.acquisition,initial);if(row)assert.deepEqual(JSON.parse(row.source_json).acquisition,initial);}
 if(state.startsWith('accepted')){const params=acceptedEvents[0][2];assert.equal(params.campaign_name,campaign);assert.equal(params.send_to,'G-2BYLRLFRDJ');assert(!JSON.stringify(params).includes(row.receipt_id));}
 const status=await page.locator('#enrol-status').textContent();if(success)assert(status.includes('Your request has been received'));else assert(!status.includes('Your request has been received'));
 if(index<2){await page.locator('#enrol-status').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/'+state+'-receipt.png',fullPage:false});}
 await page.reload({waitUntil:'networkidle'});assert.equal(submissions,1);assert.equal(handoffs,state==='rejected'?0:1);assert.equal(await page.evaluate(()=>Array.from(window.dataLayer||[],x=>Array.from(x)).filter(x=>x[0]==='event'&&x[1]==='enquiry_accepted').length),0);
 assert.deepEqual(errors,[]);cases.push({state,campaign,viewport,submissions,handoffs,source:body.source,receiptState:row?.state||'rejected',privateReference:row?.lead_reference||null,acceptedEvents:acceptedEvents.length,reloadSubmissions:0,reloadAcceptedEvents:0,phoneLinks:8,pageErrors:errors});await context.close();sql.close();
}}finally{await browser.close();}
const proof={at:new Date().toISOString(),passed:true,browser:'Microsoft Edge / Chromium',os:process.platform,physicalDevice:false,network:'All requests intercepted locally; external requests blocked. No speed simulation.',cases,blockedExternalRequests,productionEnquiries:0,actualGoogleHits:0,callsPlaced:0};await fs.writeFile('deployment/chatgpt-enquiry-browser-20261010.json',JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify({passed:true,cases:cases.length,productionEnquiries:0,actualGoogleHits:0}));
