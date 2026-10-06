import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium,webkit} from '@playwright/test';
import worker from '../workers/google-ads-call-measurement/index.mjs';
const live=process.argv.includes('--live'),root='deployment/website-call-browser-'+(live?'live':'candidate')+(process.argv.includes('--visual-only')?'-visual':'')+'-20261006';
await fs.mkdir(root,{recursive:true});
const origin='https://www.pinnacleblooms.org',speech='/top-speech-therapy-center-india-proven-improvement-rate',verify='/verify/guides/everyday-practice.html';
const shared=await fs.readFile('src/lib/google-ads-call-consent.mjs','utf8'),analytics=await fs.readFile('public/pinnacle-pages-scripts/speech-measurement.js','utf8');
const bootstrap=shared.replace(/^export /gm,'');const verifyReader=await fs.readFile('../verify-site/dist/reader-extras.js','utf8');const htmlCache=new Map();
async function candidate(page,path){
 if(live)return;
 await page.route('**/pinnacle-pages-scripts/google-ads-call.js*',r=>r.fulfill({contentType:'application/javascript',body:r.request().url().includes('module=verify-reader')?verifyReader:bootstrap}));
 await page.route('**/pinnacle-pages-scripts/speech-measurement.js*',r=>r.fulfill({contentType:'application/javascript',body:analytics}));
 if(!htmlCache.has(path)){
  const r=await fetch(origin+path);assert.equal(r.status,200);const headers=Object.fromEntries(r.headers),body=await r.text();
  const output=await worker.fetch(new Request(origin+path),{PINNACLE_VERIFY:{fetch:async()=>new Response(body,{headers})}});
  htmlCache.set(path,{body:await output.text(),headers:Object.fromEntries(output.headers)});
 }
 await page.route(origin+path,r=>r.fulfill({...htmlCache.get(path),status:200}));
}
const result={at:new Date().toISOString(),live,scope:'No ad clicks, calls or enquiries; callback numbers are isolated fixtures. Actual network test uses a direct visit without ad identifiers.',cases:[],visual:[]};
const save=()=>fs.writeFile(root+'/report.json',JSON.stringify(result,null,2));
const browser=await chromium.launch({headless:true});
async function panel(page,kind='ad-call'){
 const node=page.locator(kind==='ad-call'?'[data-ad-call-preferences]':'[data-speech-measurement]');
 await node.locator('summary').click();return node;
}
const config=page=>page.evaluate(()=>Array.from(window.dataLayer||[],x=>Array.from(x)).filter(x=>x[0]==='config').map(x=>({id:x[1],phone:x[2]?.phone_conversion_number,personalization:x[2]?.allow_ad_personalization_signals})));
try{
 for(const mode of (process.argv.includes('--visual-only')?[]:['default','declined','analytics-only','gpc','ads-only','ads-then-analytics','analytics-then-ads'])){
  const context=await browser.newContext({viewport:{width:1440,height:960}}),page=await context.newPage(),network=[],errors=[];
  if(mode==='gpc')await context.addInitScript(()=>Object.defineProperty(navigator,'globalPrivacyControl',{value:true}));
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{const u=new URL(r.url());if(/googletagmanager|google-analytics|analytics.google|doubleclick|googleadservices|googlesyndication/.test(u.hostname))network.push({host:u.hostname,path:u.pathname,id:u.searchParams.get('id')});});
  // Only ads-only observes real Google requests; all other modes isolate QA from reporting.
  if(mode!=='ads-only')await page.route(/https:\/\/(?:[^/]*google[^/]*|[^/]*doubleclick[^/]*)\//,r=>r.fulfill({status:200,contentType:'application/javascript',body:''}));
  await candidate(page,speech);await page.goto(origin+speech,{waitUntil:'domcontentloaded'});
  await page.locator('[data-ad-call-preferences]').waitFor({state:'visible'});
  if(mode==='analytics-only'||mode==='analytics-then-ads'){await panel(page,'analytics');await page.locator('[data-measurement-choice="accepted"]').click();}
  if(mode==='declined'){await panel(page);await page.locator('[data-ad-call-choice="declined"]').click();}
  if(mode.startsWith('ads-')||mode==='analytics-then-ads'){await panel(page);await page.locator('[data-ad-call-choice="accepted"]').click();}
  if(mode==='ads-then-analytics'){await panel(page,'analytics');await page.locator('[data-measurement-choice="accepted"]').click();}
  await page.waitForTimeout(mode==='ads-only'?2200:200);
  const commands=await config(page),ads=mode.startsWith('ads-')||mode==='analytics-then-ads';
  assert.equal(commands.filter(x=>x.id.includes('/VNUc')).length,ads?1:0,mode+' conversion config');
  const cookies=(await context.cookies()).map(({name,domain})=>({name,domain}));
  if(!ads){assert(!cookies.some(c=>c.name==='gwcc'||c.name.startsWith('_gcl')),mode+' ad cookies');assert(!network.some(x=>/wcm/.test(x.path)),mode+' helper');}
  if(['default','declined','gpc'].includes(mode))assert.equal(network.length,0,mode+' optional network');
  assert(await page.locator('a[href="tel:+919100181181"]').count(),mode+' ordinary phone');
  if(ads)assert.equal(await page.locator('script[src*="googletagmanager.com/gtag/js"]').count(),1,mode+' one shared loader');
  if(mode==='gpc')assert.equal(await page.locator('[data-ad-call-choice="accepted"]').isDisabled(),true);
  const row={mode,commands,cookies,network,errors,passed:true};
  if(mode==='ads-only'){
   assert(network.some(x=>x.host==='www.googletagmanager.com'&&x.id==='AW-10810823199'),'Actual Ads loader was not requested');
   await Promise.all([page.waitForEvent('load'),page.locator('[data-ad-call-choice="declined"]').click()]);
   await page.locator('[data-ad-call-preferences]').waitFor({state:'visible'});
   assert.equal((await config(page)).filter(x=>x.id.includes('/VNUc')).length,0);
   assert.equal(await page.locator('script[src*="googletagmanager.com/gtag/js"]').count(),0);
   assert.equal((await context.cookies()).some(c=>c.name==='gwcc'||c.name.startsWith('_gcl')),false);
   row.withdrawal={restored:true,reloaded:true,noHelperOnReload:true};
  }
  if(mode==='ads-then-analytics'){
   const fixture=await page.evaluate(()=>{
    const config=Array.from(window.dataLayer,x=>Array.from(x)).find(x=>x[0]==='config'&&x[1].includes('/VNUc'));
    const first=document.querySelector('a[href="tel:+919100181181"]');const before=first.textContent;
    const local=document.createElement('a');local.href='tel:+914012345678';local.textContent='040 1234 5678';document.body.append(local);
    config[2].phone_conversion_callback('+1 202 555 0142','+12025550142');
    return {href:first.getAttribute('href'),text:first.textContent,marker:first.dataset.pinnacleAdCallTarget,local:local.getAttribute('href'),before};
   });assert.equal(fixture.href,'tel:+12025550142');assert.equal(fixture.marker,'central');assert.equal(fixture.local,'tel:+914012345678');
   row.callbackFixture=fixture;
  }
  result.cases.push(row);await context.close();await save();
 }
 for(const [engine,width,path] of [['chromium',320,speech],['chromium',768,verify],['chromium',1440,verify],['webkit',390,speech]]){
  const engineBrowser=engine==='chromium'?browser:await webkit.launch({headless:true});const context=await engineBrowser.newContext({viewport:{width,height:920}}),page=await context.newPage();await candidate(page,path);
  await page.goto(origin+path,{waitUntil:'domcontentloaded'});await page.locator('[data-ad-call-preferences]').waitFor({state:'visible'});if(path===verify)await page.locator('[data-analytics-choice="declined"]').click();await panel(page);
  const style=await page.locator('[data-ad-call-preferences]').evaluate(e=>{const box=e.getBoundingClientRect(),b=e.querySelector('button').getBoundingClientRect(),s=getComputedStyle(e);return {width:box.width,x:box.x,buttonHeight:b.height,font:s.fontSize,color:s.color,overflow:document.documentElement.scrollWidth>innerWidth+1};});
  assert(!style.overflow,engine+' '+width+' overflow');assert(style.buttonHeight>=40,'Consent button too small');
  const file=`${engine}-${width}-${path===speech?'speech':'verify'}.png`;await page.locator('[data-ad-call-preferences]').screenshot({path:root+'/'+file});
  result.visual.push({engine,width,path,style,file,passed:true});await context.close();if(engine!=='chromium')await engineBrowser.close();await save();
 }
 console.log(JSON.stringify({passed:true,cases:result.cases.length,visual:result.visual.length,report:root+'/report.json'}));
}finally{await save();await browser.close();}
