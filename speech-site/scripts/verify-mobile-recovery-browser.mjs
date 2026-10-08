import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {chromium,webkit} from '@playwright/test';
const out=path.resolve('../../website-completion-20261008/mobile-recovery-browser');await fs.mkdir(out,{recursive:true});
const release=JSON.parse(await fs.readFile('deployment/mobile-root-followup-20261008.json','utf8'));assert(['verified-configuration','verified-live'].includes(release.phase));
const rows=[];
for(const [name,engine,ua] of [
 ['edge',chromium,'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'],
 ['webkit',webkit,'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1']
]){
 const browser=await engine.launch({headless:true,...(name==='edge'?{channel:'msedge'}:{})});
 try {const page=await browser.newPage({viewport:{width:390,height:844},userAgent:ua,isMobile:true,hasTouch:true});
 await page.route(/google-analytics|googletagmanager|doubleclick|googleadservices|youtube(?:-nocookie)?\.com\/embed|\/api\/enrolment/,r=>r.abort());
 for(const [key,p] of [['home','/?gclid=test123&utm_source=google'],['contact','/contact-national-autism-helpline-24-7?gclid=test123&utm_source=google'],['careers','/careers?gclid=test123&utm_source=google'],['research','/research-studies?gclid=test123&utm_source=google']]){
  const response=await page.goto('https://www.pinnacleblooms.org'+p,{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);
  const state=await page.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,title:document.title,error:document.body.innerText.includes('Newtonsoft.Json.JsonReaderException'),phone:[...document.querySelectorAll('a[href]')].some(a=>/^tel:/i.test(a.getAttribute('href')||'')&&['9100181181','919100181181'].includes(a.getAttribute('href').replace(/[^0-9]/g,''))),phoneLinks:[...document.querySelectorAll('a[href^=tel]')].map(a=>a.getAttribute('href')),url:location.href}));
  await page.screenshot({path:path.join(out,name+'-'+key+'.png')});const row={name,key,status:response.status(),...state};rows.push(row);
  assert.equal(row.status,200);assert(!row.error&&row.title!=='Error'&&row.phone,JSON.stringify(row));
 }
 }finally{await browser.close();}
}
await fs.writeFile(path.join(out,'report.json'),JSON.stringify({at:new Date().toISOString(),commit:release.commit,deployment:release.deployment,rows,passed:true,analyticsRequestsBlocked:true,submissions:false,calls:false},null,2));console.log(JSON.stringify({cases:rows.length,passed:true,overflow:rows.filter(r=>r.documentWidth>r.width+1)}));
