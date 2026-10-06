import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {chromium,webkit,firefox} from '@playwright/test';
import {reviseChandaNagarHtml,CHANDANAGAR_URL} from '../deployment/centre-search-repair/chandanagar.mjs';
const folder='ask-private/six-step-release-20261006',screens='deployment/six-step-proof-20261006';await fs.mkdir(screens,{recursive:true});
const chandaPath=new URL(CHANDANAGAR_URL).pathname;const transformed=reviseChandaNagarHtml(await fs.readFile(folder+'/page-6.html','utf8'));assert(transformed);await fs.writeFile('dist'+chandaPath+'.html',transformed);
const paths=[{id:'suchitra',url:'http://127.0.0.1:4340/centers/best-autism-speech-aba-occupational-therapy-center-suchitra-hyderabad-telangana-india'},{id:'chandanagar',url:CHANDANAGAR_URL},{id:'deic',url:'http://127.0.0.1:4345/ask/what-is-a-deic-and-what-services-does-it-offer'},{id:'aac',url:'http://127.0.0.1:4345/ask/lens/entity%3Atherapy_modality/aac'}];
const report={at:new Date().toISOString(),coverage:[],noSubmissions:true,noCalls:true};const assetCache=new Map();
for(const engine of [{name:'chromium',driver:chromium,widths:[320,390,768,1440]},{name:'webkit',driver:webkit,widths:[390]},{name:'firefox',driver:firefox,widths:[1440]}]){
 let browser;try{browser=await engine.driver.launch({headless:true});}catch(e){report.coverage.push({engine:engine.name,status:'skipped',reason:String(e).slice(0,200)});continue;}
 try{for(const width of engine.widths){const page=await browser.newPage({viewport:{width,height:900}});await page.route(/google-analytics.com|googletagmanager.com|clarity.ms/,r=>r.abort());
 // Preview only the changed public HTML at its real origin; legacy assets retain their real URLs.
 await page.route(CHANDANAGAR_URL,r=>r.fulfill({status:200,contentType:'text/html; charset=utf-8',body:transformed}));
 for(const row of paths){const errors=[];page.on('pageerror',e=>errors.push(String(e)));const response=await page.goto(row.url,{waitUntil:'domcontentloaded'});await page.locator('h1').first().waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(300);
 const metrics=await page.evaluate(()=>({title:document.title,h1:[...document.querySelectorAll('h1')].map(x=>x.textContent),width:innerWidth,scroll:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth&&i.getBoundingClientRect().top<innerHeight).map(i=>i.getAttribute('src')),formLinks:[...document.querySelectorAll('a[href*="enroll-autism"]')].map(a=>a.getAttribute('href')),phone:!!document.querySelector('a[href="tel:+919100181181"]')}));
 const result={page:row.id,engine:engine.name,width,status:response.status(),metrics,errors};report.coverage.push(result);await page.screenshot({path:screens+'/'+row.id+'-'+engine.name+'-'+width+'.png'});assert.equal(response.status(),200,row.id);assert(metrics.scroll<=width+1,JSON.stringify(result));assert.equal(metrics.h1.length,1,row.id);assert(metrics.phone,row.id);if(row.id==='aac')assert(metrics.formLinks.some(l=>l.includes('enroll-autism')));page.removeAllListeners('pageerror');
 }
 await page.close();}}catch(e){report.failure=String(e);await fs.writeFile(screens+'/local.json',JSON.stringify(report,null,2));throw e;}finally{await browser.close();}
}
await fs.writeFile(screens+'/local.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.coverage.filter(x=>x.status===200).length,skipped:report.coverage.filter(x=>x.status==='skipped')}));
