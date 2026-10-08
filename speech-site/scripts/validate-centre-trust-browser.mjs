// Changed centre media only; never calls, enquires or opens a real player network.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {chromium,webkit} from '@playwright/test';import {centreRegister} from '../src/data/centre-network-content.ts';
const live=process.argv.includes('--live'),base=live?'https://www.pinnacleblooms.org':process.env.CENTRE_TRUST_TEST_BASE||'http://127.0.0.1:4368',out=path.resolve('ask-private/centre-trust-20261007',live?'public-media':'candidate-media');await fs.mkdir(out,{recursive:true});
const branch=centreRegister.find(c=>c.id==='guntur'),rows=[];
for(const [engine,kind,width] of [[chromium,process.platform==='win32'?'edge':'chromium',320],[chromium,process.platform==='win32'?'edge':'chromium',768],[chromium,process.platform==='win32'?'edge':'chromium',1440],[webkit,'webkit',390]]){
 const browser=await engine.launch({headless:true,...(kind==='edge'?{channel:'msedge'}:{})}),context=await browser.newContext({viewport:{width,height:1000}});
 await context.route(/google-analytics|googletagmanager|doubleclick|googleadservices|youtube-nocookie.com\/embed/,r=>r.abort());await context.route('**/api/enrolment',r=>r.abort());
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+new URL(branch.profileUrl).pathname,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('iframe').count(),0,'No eager third-party embeds');assert.equal(await page.locator('.trust-art img').count(),4,'Four coordinated illustrations');
 for(const id of ['first-visit','people-and-families','family-voices','centre-life-outcome']){
  const section=page.locator('#'+id);await section.scrollIntoViewIfNeeded();await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(id=>[...document.querySelectorAll('#'+id+' .trust-art img')].every(image=>image.complete&&image.naturalWidth>0),id);
  const state=await section.evaluate(n=>({overflow:document.documentElement.scrollWidth>innerWidth+1,viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:[...n.querySelectorAll('.trust-art img')].map(i=>({loaded:i.complete&&i.naturalWidth>0,lazy:i.loading==='lazy',width:i.getBoundingClientRect().width}))}));assert(!state.overflow,id+' overflow '+JSON.stringify({kind,width,viewport:state.viewport,scrollWidth:state.scrollWidth}));assert(state.images.every(i=>i.loaded&&i.lazy),id+' image load/lazy contract');
  if(id==='people-and-families'||id==='first-visit')await section.screenshot({path:path.join(out,kind+'-'+width+'-'+id+'.png')});
 }
 for(const id of ['people-and-families','family-voices']){
  const section=page.locator('#'+id),button=section.locator('[data-trust-video]').first();await button.scrollIntoViewIfNeeded();await page.waitForFunction(id=>[...document.querySelectorAll('#'+id+' .trust-portrait img')].every(image=>image.complete&&image.naturalWidth>0),id);await section.screenshot({path:path.join(out,kind+'-'+width+'-'+id+'-loaded.png')});await button.click();await section.locator('dialog').waitFor({state:'visible'});assert.equal(await section.locator('dialog iframe').count(),1);
  assert.equal(await section.locator('dialog iframe').getAttribute('allow'), 'encrypted-media; picture-in-picture; fullscreen');await page.keyboard.press('Escape');await section.locator('dialog').waitFor({state:'hidden'});await section.locator('dialog iframe').waitFor({state:'detached'});assert.equal(await section.locator('dialog iframe').count(),0,'Closing releases player');assert(await button.evaluate(n=>document.activeElement===n),'Focus returns to opener');
 }
 assert.deepEqual(errors,[]);rows.push({kind,width,fourImages:true,dialogCloseReleaseFocus:true,passed:true});await browser.close();
}
await fs.writeFile(path.join(out,'results.json'),JSON.stringify({at:new Date().toISOString(),base,live,rows,passed:rows.length,noContactOrSubmission:true},null,2)+'\n');console.log(JSON.stringify({passed:rows.length,live,out}));
