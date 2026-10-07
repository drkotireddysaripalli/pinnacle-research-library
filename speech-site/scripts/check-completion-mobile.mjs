// Fixed reported public families; one mobile lab pass, isolated from lead systems.
import fs from 'node:fs/promises';
import path from 'node:path';
import lighthouse from 'lighthouse';
import {chromium} from '@playwright/test';
import net from 'node:net';
const phase=process.argv[2]||'before';
if(!['before','after'].includes(phase))throw Error('Use before or after');
const root=path.resolve(import.meta.dirname,'../../../website-completion-20261007',phase+'-mobile');
await fs.mkdir(root,{recursive:true});
const urls=JSON.parse(await fs.readFile(path.resolve(root,'../'+phase+'/summary.json'),'utf8'));
const selected=process.argv.slice(3),ids=selected.length?selected:['materials','miracles','mirracle-app','centre','abilities','staff','blog'];
const socket=net.createServer();await new Promise(r=>socket.listen(0,'127.0.0.1',r));const port=socket.address().port;await new Promise(r=>socket.close(r));
const browser=await chromium.launch({headless:true,args:[`--remote-debugging-port=${port}`]});
const results={at:new Date().toISOString(),kind:'single mobile simulated Lighthouse lab pass; not field INP or physical-device proof',phase,pages:[]};
try{
 for(const id of ids){
  const url=urls[id]?.url;if(!url)throw Error('Unknown family');
  const report={id,url};
  try{
   const {lhr}=await lighthouse(url,{port,logLevel:'error',onlyCategories:['performance','accessibility','seo'],enableErrorReporting:false,blockedUrlPatterns:['*google-analytics.com*','*analytics.google.com*','*ob.aseasky.link*'],maxWaitForLoad:45000});
   await fs.writeFile(path.join(root,id+'-lighthouse.json'),JSON.stringify(lhr));
   report.scores=Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)]));
   report.metrics=Object.fromEntries([['lcpMs','largest-contentful-paint'],['fcpMs','first-contentful-paint'],['tbtMs','total-blocking-time'],['cls','cumulative-layout-shift']].map(([k,a])=>[k,lhr.audits[a]?.numericValue]));
   report.findings=Object.values(lhr.audits).filter(a=>a.score!==null&&a.score<1&&!['manual','informative','notApplicable'].includes(a.scoreDisplayMode)).map(a=>({id:a.id,title:a.title,value:a.displayValue,details:a.details}));
   report.runtimeError=lhr.runtimeError;
  }catch(e){report.labError=e.message;}
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await context.route(/google-analytics\.com|analytics\.google\.com|ob\.aseasky\.link/,r=>r.abort());
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(2000);
   report.render=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:[...document.querySelectorAll('h1')].map(e=>e.textContent.trim()),bodyVisible:document.body.getBoundingClientRect().height>0,images:[...document.images].filter(e=>e.getBoundingClientRect().top<innerHeight).map(e=>({src:e.currentSrc,loaded:e.complete&&e.naturalWidth>0,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})),links:[...document.querySelectorAll('a[href^="tel:"]')].map(e=>({href:e.getAttribute('href'),text:e.textContent.trim()})).slice(0,8)}));
   await page.screenshot({path:path.join(root,id+'-390.png')});
   const button=page.getByRole('button',{name:/menu|more|privacy settings|cookie settings/i}).first();
   if(await button.count()&&await button.isVisible()){
    const started=Date.now();await button.click({timeout:5000});report.interaction={control:await button.getAttribute('aria-label')||await button.textContent(),durationMs:Date.now()-started,expanded:await button.getAttribute('aria-expanded')};
   }else report.interaction={status:'no matching safe menu/privacy control; scrolling checked'};
   await page.evaluate(()=>window.scrollTo(0,Math.min(document.body.scrollHeight,1600)));await page.waitForTimeout(250);
   report.render.scrollWorked=await page.evaluate(()=>scrollY>0||document.body.scrollHeight<=innerHeight);
  }catch(e){report.renderError=e.message;}
  report.browserErrors=errors.slice(0,10);await context.close();
  results.pages.push(report);await fs.writeFile(path.join(root,'summary.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify({id,scores:report.scores,metrics:report.metrics,render:report.render&&{overflow:report.render.scrollWidth>390,h1:report.render.h1,scroll:report.render.scrollWorked},error:report.labError||report.renderError}));
 }
}finally{await browser.close();}
