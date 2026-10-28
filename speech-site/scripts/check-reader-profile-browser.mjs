import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {build} from 'esbuild';import {readerProfileResponseHeaders} from '../deployment/reader-profile-shell.mjs';import {chromium} from '@playwright/test';
const [fixture,out]=process.argv.slice(2);const mirracles=process.argv.includes('--mirracles');assert(fixture&&out);await fs.mkdir(out,{recursive:true});
const html=(await fs.readFile(fixture,'utf8')).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
const js=(await build({entryPoints:['src/scripts/ask-reader.ts'],bundle:true,write:false,format:'iife',platform:'browser'})).outputFiles[0].text;
const token='00000000-0000-4000-8000-000000000001',fields={phone:'+919999999997',city:'Hyderabad',postal_code:'500033',country:'IN'},records=[];
const browser=await chromium.launch({headless:true});
try{for(const width of (mirracles?[390,1440]:[320,390,1440]))for(const scenario of (mirracles?['save-retry','reviewed','anonymous']:['save-retry','skip-forwarded','import','denied','empty','pending-skip','reviewed','verified'])){
 const page=await browser.newPage({viewport:{width,height:844}}),requests=[],errors=[];let failures=0,release;
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.dataLayer=[];window.google={accounts:{id:{initialize(options){window.fixtureGoogle=options;},renderButton(element){const button=document.createElement('button');button.textContent='Google sign-in fixture';element.append(button);},disableAutoSelect(){}},oauth2:{initTokenClient(options){window.profileOAuthOptions=options;return {requestAccessToken(){options.callback(window.profileOAuthResult||{access_token:'fixture-token'});}}}}}};});
 await page.route('**/*',async route=>{const req=route.request(),u=new URL(req.url());
  if(u.pathname==='/ask/auth/session'&&scenario==='anonymous')return route.fulfill({json:{profile:null,csrf:token,google:{clientId:'fixture.apps.googleusercontent.com',nonce:'fixture'}}});
  if(u.pathname==='/ask/auth/session')return route.fulfill({json:{profile:{name:'Fixture reader',whatsappVerified:scenario==='verified'},csrf:token,readerProfile:{fields:['reviewed','verified'].includes(scenario)?fields:{},reviewed:scenario==='reviewed'},...(['import','denied','empty','pending-skip'].includes(scenario)?{googleProfileImport:{clientId:'fixture.apps.googleusercontent.com',scopes:'openid email profile https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.addresses.read'}}:{})}});
  if(['/ask/auth/reader-profile','/ask/auth/google-profile'].includes(u.pathname)){const body=Object.fromEntries(new URLSearchParams(req.postData()));requests.push({path:u.pathname,body});assert.equal(body.csrf,token);
   if(scenario==='save-retry'&&!failures++){return route.fulfill({status:503,json:{status:'profile-save'}});}
   if(scenario==='pending-skip'&&u.pathname.endsWith('google-profile')){await new Promise(r=>release=r);return route.fulfill({json:{status:'profile-saved',readerProfile:{fields,reviewed:false}}}).catch(()=>{});}
   if(scenario==='empty'&&u.pathname.endsWith('google-profile'))return route.fulfill({status:400,json:{status:'google-profile-empty'}});
   return route.fulfill({json:{status:body.mode==='skip'?'profile-skipped':'profile-saved',readerProfile:{fields:u.pathname.endsWith('google-profile')?fields:body,reviewed:body.mode==='save'}}});
  }
  if(u.pathname==='/ask/reader-profile-client.js')return route.fulfill({body:js,contentType:'text/javascript'});
  if(req.isNavigationRequest())return route.fulfill({body:u.hostname==='materials.pinnacleblooms.org'?'LIBRARY RETURN':html,contentType:'text/html; charset=utf-8',...(mirracles?{headers:readerProfileResponseHeaders}:{})});
  return route.abort();
 });
 const forwarded=['skip-forwarded','pending-skip'].includes(scenario);await page.goto('https://pinnacleblooms.org'+(mirracles?'/allmirracles':'/ask')+(forwarded?'?reader_return=%2Fmaterials%2Fsample-topic':''));await page.addScriptTag({url:'https://pinnacleblooms.org/ask/reader-profile-client.js'});
 if(scenario==='anonymous'){await page.getByRole('button',{name:'Google sign-in fixture'}).waitFor();assert(await page.locator('#ask-reader-gate').evaluate(e=>e.matches(':modal')));assert.equal(await page.locator('[data-ask-google-form] [name=library]').inputValue(),'mirracles');assert.equal(await page.locator('[name=completeProfile]').inputValue(),'yes');assert.deepEqual(errors,[]);records.push({width,scenario,status:'PASS',requestCount:requests.length});await page.close();continue;}
 const dialog=page.locator('#ask-reader-details');
 if(scenario==='reviewed'){await page.locator('[data-ask-profile]').waitFor({state:'visible'});assert(!await dialog.isVisible());}
 else{await dialog.waitFor({state:'visible'});const box=await dialog.boundingBox();assert(box.width<=width&&box.x>=0);assert(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth));assert(await page.getByRole('button',{name:'Skip for now'}).isVisible());
  if(scenario==='verified')assert(!await dialog.locator('[data-reader-details-verify]').isVisible());
  if(scenario==='save-retry'){for(const [k,v]of Object.entries(fields))await dialog.locator('[name='+k+']').fill(v);await dialog.getByRole('button',{name:'Save and continue'}).click();await dialog.getByRole('status').filter({hasText:'remain here'}).waitFor();assert.equal(await dialog.locator('[name=city]').inputValue(),fields.city);await dialog.getByRole('button',{name:'Save and continue'}).click();await dialog.waitFor({state:'hidden'});}
  if(scenario==='skip-forwarded'){await dialog.getByRole('button',{name:'Skip for now'}).click();await page.waitForURL('https://materials.pinnacleblooms.org/sample-topic');assert.equal(requests.length,1);assert.equal(requests[0].body.mode,'skip');}
  if(['import','denied','empty','pending-skip'].includes(scenario)){
   if(scenario==='denied')await page.evaluate(()=>{window.profileOAuthResult={error:'access_denied'};});
   await dialog.getByRole('button',{name:'Use details from Google'}).click();
   if(scenario==='import'){await dialog.locator('[name=city]').waitFor();await page.waitForFunction(()=>document.querySelector('#ask-reader-details [name=city]').value==='Hyderabad');assert.equal(await dialog.locator('[name=phone]').inputValue(),fields.phone);await dialog.screenshot({path:path.join(out,'import-'+width+'.png')});}
   if(scenario==='empty')await dialog.getByRole('status').filter({hasText:'did not supply'}).waitFor();
   if(scenario==='denied'){await dialog.getByRole('status').filter({hasText:'not completed'}).waitFor();assert.equal(requests.length,0);}
   if(scenario==='pending-skip'){await page.waitForFunction(()=>document.querySelector('#ask-reader-details [role=status]').textContent.includes('Getting available'));await dialog.getByRole('button',{name:'Skip for now'}).click();await page.waitForURL('https://materials.pinnacleblooms.org/sample-topic');assert.equal(requests.length,1);release();}
  }
 }
 assert.deepEqual(errors,[]);assert(!(await page.evaluate(()=>JSON.stringify(window.dataLayer||[]))).includes(fields.phone));records.push({width,scenario,status:'PASS',requestCount:requests.length});await page.close();
 }}finally{await browser.close();}
await fs.writeFile(path.join(out,'browser.json'),JSON.stringify({status:'PASS',cases:records.length,records,realUsers:0,realProviderCalls:0,realOTPs:0},null,2));console.log(JSON.stringify({status:'PASS',cases:records.length}));
