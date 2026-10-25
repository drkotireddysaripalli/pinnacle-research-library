import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from '@playwright/test';
import {readerSignInPath,readerDestination} from '../src/lib/reader-source.mjs';
const [fixturePath,outPath]=process.argv.slice(2);assert(fixturePath&&outPath,'Pass saved public Ask HTML and an output directory');
await fs.mkdir(outPath,{recursive:true});
const original=await fs.readFile(fixturePath,'utf8');
const html=original.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
const bundle=await build({entryPoints:[path.resolve('src/scripts/ask-reader.ts')],bundle:true,write:false,format:'iife',platform:'browser'});
const script=bundle.outputFiles[0].text;
const cases=[['ask','/ask'],['ask','/ask/sample-topic'],['faq','/faq'],['faq','/faq/hindi/speech-therapy'],['sunshine','/sunshine'],['sunshine','/sunshine/conditions'],['mirracles','/allmirracles'],['mirracles','/mirracles/123/sample'],['materials','/materials'],['materials','/materials/sample-topic'],['interventions','/interventions'],['interventions','/interventions/communication']];
const browser=await chromium.launch({headless:true});const records=[];
try{
 for(const width of [390,1440])for(const [library,target] of cases){
  const page=await browser.newPage({viewport:{width,height:900}});let posted;
  await page.route('**/*',async route=>{
   const req=route.request(),u=new URL(req.url());
   if(u.pathname==='/ask/auth/session')return route.fulfill({json:{profile:null,csrf:'00000000-0000-4000-8000-000000000001',google:{clientId:'fixture.apps.googleusercontent.com',nonce:'fixture'}}});
   if(u.pathname==='/ask/auth/google-id-token'){posted=new URLSearchParams(req.postData());return route.fulfill({body:'ISOLATED FORM CAPTURED',contentType:'text/html'});}
   if(req.isNavigationRequest())return route.fulfill({body:html,contentType:'text/html'});
   return route.abort();
  });
  await page.addInitScript(()=>{window.google={accounts:{id:{initialize(value){window.fixtureGoogle=value;},renderButton(element){const b=document.createElement('button');b.textContent='Continue with Google fixture';b.onclick=()=>window.fixtureGoogle.callback({credential:'fixture-no-provider-call'});element.append(b);},disableAutoSelect(){}}}};});
  const forwarded=['materials','interventions'].includes(library);
  await page.goto('https://www.pinnacleblooms.org'+(forwarded?readerSignInPath(target):target));
  await page.addScriptTag({content:script});
  if(forwarded){await page.getByRole('button',{name:'Continue with Google fixture'}).waitFor();await page.reload();await page.addScriptTag({content:script});}
  const button=page.getByRole('button',{name:'Continue with Google fixture'});await button.waitFor();
  assert.equal(await page.locator('[name=library]').inputValue(),library);
  assert.equal(await page.locator('[data-ask-google-form] [name=returnTo]').inputValue(),target);
  await button.click();await page.waitForURL('**/ask/auth/google-id-token');
  assert.equal(posted?.get('library'),library);assert.equal(posted?.get('returnTo'),target);assert.equal(posted?.get('credential'),'fixture-no-provider-call');
  records.push({library,target,width,sourceAndReturnPreserved:true,reloadPreserved:forwarded});await page.close();
 }
 for(const target of ['/materials/sample-topic','/interventions/communication']){
  const page=await browser.newPage();const destination=readerDestination(target);
  await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.pathname==='/ask/auth/session')return route.fulfill({json:{profile:{name:'Fixture reader'},csrf:'00000000-0000-4000-8000-000000000001'}});if(route.request().isNavigationRequest())return route.fulfill({body:u.origin==='https://www.pinnacleblooms.org'?html:'ISOLATED RETURN',contentType:'text/html'});return route.abort();});
  await page.goto('https://www.pinnacleblooms.org'+readerSignInPath(target));await page.addScriptTag({content:script});await page.waitForURL(destination);
  records.push({target,existingReaderReturn:true});await page.close();
 }
 await fs.writeFile(path.join(outPath,'browser.json'),JSON.stringify({status:'PASS',cases:records.length,records,realSignups:0,realProviderRequests:0,formPosts:'isolated route fixtures only'},null,2));
 console.log(JSON.stringify({status:'PASS',cases:records.length,realSignups:0,realProviderRequests:0}));
}finally{await browser.close();}
