// Changed shared centre story only: actual rendering, navigation and local intake selection.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {chromium,webkit} from '@playwright/test';import {centreRegister} from '../src/data/centre-network-content.ts';
const live=process.argv.includes('--live'),base=live?'https://www.pinnacleblooms.org':'http://127.0.0.1:4368';
const out=path.resolve('ask-private/centre-narrative-20261007',live?'public-browser':'candidate-browser');await fs.mkdir(out,{recursive:true});
const rows=[];
for(const [engine,kind,widths] of [[chromium,'edge',[320,768,1440]],[webkit,'webkit',[390]]]){
 const browser=await engine.launch({headless:true,...(kind==='edge'?{channel:'msedge'}:{})});
 for(const width of widths){const context=await browser.newContext({viewport:{width,height:1000}});await context.route(/google-analytics|googletagmanager|doubleclick|googleadservices/,r=>r.abort());await context.route('**/api/enrolment',r=>r.abort());
 for(const id of ['suchitra','guntur','gurunanak']){
  const branch=centreRegister.find(c=>c.id===id),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+new URL(branch.profileUrl).pathname,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);assert.equal(response.status(),200);
  assert.equal(await page.locator('.ecosystem-chapter').count(),4);assert.equal(await page.locator('.ecosystem-stage-pair>li').count(),7);assert.equal(await page.locator('iframe').count(),0,'No eager video or maps');
  const entry=page.locator('.local-hero [data-cta="hero-assessment"]');assert((await entry.getAttribute('href')).includes('centre='+id));
  assert.equal(await page.locator('.local-hero a[href="tel:+919100181181"]').count(),1);
  const info=await page.evaluate(()=>{const h=document.querySelector('.local-hero'),hit=n=>{const b=n.getBoundingClientRect();return b.bottom<=innerHeight&&document.elementFromPoint(b.left+b.width/2,b.top+b.height/2)?.closest('a')===n;};return {actualWidth:innerWidth,scrollWidth:document.documentElement.scrollWidth,callHit:hit(h.querySelector('[data-cta="hero-call"]')),enquiryHit:hit(h.querySelector('[data-cta="hero-assessment"]'))};});
  assert(info.scrollWidth<=width+1,id+' initial overflow');if(width<=390){assert(info.callHit,id+' opening call');assert(info.enquiryHit,id+' opening visit');}
  const captures=[];
  for(const section of ['life-first','centre-chapter-understand','centre-chapter-everyday','centre-chapter-review','centre-chapter-life']){
   const target=page.locator('#'+section);await target.scrollIntoViewIfNeeded();await page.evaluate(()=>document.fonts.ready);
   const state=await target.evaluate(n=>({overflow:document.documentElement.scrollWidth>innerWidth+1,font:getComputedStyle(n.querySelector('h3,h2')).fontSize,width:n.getBoundingClientRect().width}));assert(!state.overflow,id+' '+section+' overflow');assert(parseFloat(state.font)>=26,id+' chapter heading readability');
   if(id==='guntur'){const file=path.join(out,id+'-'+kind+'-'+width+'-'+section+'.png');await target.screenshot({path:file});captures.push(file);}
  }
  await page.locator('.ecosystem-chapter-nav a[href="#centre-chapter-review"]').click();assert.equal(new URL(page.url()).hash,'#centre-chapter-review');
  if(live&&kind==='edge'&&width===320&&id==='guntur'){await page.goto(await entry.getAttribute('href'),{waitUntil:'domcontentloaded'});assert.equal(await page.locator('select[name="centre"]').inputValue(),'guntur');}
  assert.deepEqual(errors,[],id+' page errors');rows.push({id,kind,width,...info,captures,passed:true});await page.close();
 }await context.close();}await browser.close();
}
await fs.writeFile(path.join(out,'results.json'),JSON.stringify({at:new Date().toISOString(),live,base,passed:rows.length,rows,noEnquirySubmitted:true},null,2)+'\n');console.log(JSON.stringify({passed:rows.length,live,out}));
