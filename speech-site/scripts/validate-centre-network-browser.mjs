import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {chromium,firefox,webkit} from '@playwright/test';import {centreRegister} from '../src/data/centre-network-content.ts';
const live=process.argv.includes('--live'),base=live?'https://www.pinnacleblooms.org':'http://127.0.0.1:4338',out=path.resolve('ask-private/centre-network-20261007',live?'live-browser':'local-browser');await fs.mkdir(out,{recursive:true});
const selected=['guntur','khajaguda','annanagar','gurunanak','hayathnagar','vanasthalipuram','delhi','usa'];const rows=[],skipped=[];
for(const [engine,kind] of [[chromium,'chromium'],[firefox,'firefox'],[webkit,'webkit']]){
 if(process.argv.includes('--webkit-only')&&kind!=='webkit')continue;
 let browser;try{browser=await engine.launch({headless:true,...(kind==='chromium'?{channel:'msedge'}:{})});}catch(e){skipped.push({engine:kind,reason:'Local runtime could not launch',detail:e.message.split('\n')[0]});continue;}
 const matrix=kind==='chromium'?[{width:390,ids:centreRegister.map(c=>c.id)},...([320,768,1440].map(width=>({width,ids:selected})))]:[{width:390,ids:['guntur','gurunanak','vanasthalipuram']}];
 for(const {width,ids} of matrix){const context=await browser.newContext({viewport:{width,height:844}});await context.route(/google-analytics|googletagmanager|doubleclick|googleadservices/,r=>r.abort());await context.route('**/api/enrolment',r=>r.abort());
 for(const id of ids){const c=centreRegister.find(x=>x.id===id),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));const response=await page.goto(base+new URL(c.profileUrl).pathname,{waitUntil:'domcontentloaded',timeout:40000});await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);
 const info=await page.evaluate(()=>{const hero=document.querySelector('.local-hero')||document.querySelector('main');const call=hero.querySelector('a[href="tel:+919100181181"]');const enquiry=hero.querySelector('a[href*="enroll-autism-speech-aba-therapies-india"]');const rect=n=>n?.getBoundingClientRect().toJSON();const hit=n=>{if(!n)return null;const b=n.getBoundingClientRect(),x=b.left+b.width/2,y=b.top+Math.min(b.height/2,24);return y<innerHeight&&document.elementFromPoint(x,y)?.closest('a')===n;};return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,call:rect(call),enquiry:rect(enquiry),callUnobscured:hit(call),enquiryUnobscured:hit(enquiry),initialExternalFrames:document.querySelectorAll('iframe[src*="youtube"],iframe[src*="google.com"]').length,h1:document.querySelector('h1').textContent,heroImage:document.querySelector('.local-hero-photo img')?.getAttribute('src')};});
 Object.assign(info,{id,engine:kind,width,status:response.status(),errors});assert.equal(info.status,200,id);assert(info.scrollWidth<=width+1,id+' overflow '+kind);assert.deepEqual(errors,[],id+' JS errors');assert.equal(info.initialExternalFrames,0,id+' inert embeds');
 if(c.pageStatus==='centre-enquiry'&&width<=390){assert(info.callUnobscured,id+' opening call unobscured');assert(info.enquiryUnobscured,id+' opening assessment unobscured');}
 if(selected.includes(id)&&kind==='chromium'){info.screenshot=path.join(out,id+'-'+width+'.png');await page.screenshot({path:info.screenshot});}
 if(id==='guntur'&&width===390&&kind==='chromium'){
  const playlist=page.locator('[data-playlist="PL0lwT9W0zVpiKBcwqcaxBtGcrg1AX015g"] [data-video-load]');await playlist.click();assert((await page.locator('#people-and-families iframe').getAttribute('src')).includes('PL0lwT9W0zVpiKBcwqcaxBtGcrg1AX015g'));
  const map=page.locator('[data-map-load]');await map.click();assert(await page.locator('[data-centre-map] iframe').count());
  const video=page.locator('#centre-walkthrough [data-video-load]');await video.click();assert(await page.locator('[data-centre-video] iframe').count());
  const href=await page.locator('.local-hero a[data-cta="hero-assessment"]').getAttribute('href');info.enquiryHref=href;
  if(live){await page.goto(href,{waitUntil:'domcontentloaded'});info.receivingCentre=await page.locator('select[name="centre"]').inputValue();assert.equal(info.receivingCentre,'guntur');}
 }
 rows.push(info);await page.close();}
 await context.close();}await browser.close();await fs.writeFile(path.join(out,'results.json'),JSON.stringify({at:new Date().toISOString(),live,passed:rows.length,rows,skipped},null,2));
}
await fs.writeFile(path.join(out,'results.json'),JSON.stringify({at:new Date().toISOString(),live,passed:rows.length,rows,skipped},null,2));console.log(JSON.stringify({live,passed:rows.length,engines:[...new Set(rows.map(r=>r.engine))],skipped,viewportWidths:[...new Set(rows.map(r=>r.width))],noLeadSubmitted:true}));
