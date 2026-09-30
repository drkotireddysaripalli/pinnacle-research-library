const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const phase=process.argv[2]||'local',origin=phase==='live'?'https://www.pinnacleblooms.org':'http://127.0.0.1:4338';
const pageUrl=path=>origin+(phase==='local'&&path==='/top-speech-therapy-center-india-proven-improvement-rate'?'/':path);
const launched=[];
const release='release-shared-shell-v133-20261001',previous='release-centre-batch-v132-20261001';
const prior=JSON.parse(fs.readFileSync('deployment/centre-batch-live-v132-20261001.json','utf8'));
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const main=s=>s.match(/<main\b[^>]*>[\s\S]*?<\/main>/)[0];
const hrefs=s=>new Set([...s.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>m[1]));
const mapping={};
for(const entry of prior.shells){const old=fs.readdirSync(previous+'/pinnacle-pages-html').find(f=>{const s=fs.readFileSync(previous+'/pinnacle-pages-html/'+f,'utf8');return s.includes('rel="canonical" href="https://www.pinnacleblooms.org'+entry.path+'"')&&!s.includes('data-preview="true"');});assert(old,entry.path);mapping[entry.path]=old;}
const bodyResults=[];
for(const [path,file] of Object.entries(mapping)){
 const old=fs.readFileSync(previous+'/pinnacle-pages-html/'+file,'utf8'),now=fs.readFileSync(release+'/pinnacle-pages-html/'+file,'utf8');
 assert.equal(sha(main(now)),sha(main(old)),path+' accepted main body');
 for(const href of hrefs(old))assert(hrefs(now).has(href),path+' missing href '+href);
 assert.equal((now.match(/data-record-id=/g)||[]).length,36,path);
 bodyResults.push({path,file,acceptedMainSha256:sha(main(now)),previousHrefDestinationsRetained:true,records:36});
}
(async()=>{
 const runs=[],before=[];
 const cases=[['speech','/top-speech-therapy-center-india-proven-improvement-rate',[320,390,768,1024,1440]],['enrolment','/enroll-autism-speech-aba-therapies-india',[390,1024,1440]],['pinnacleai','/pinnacleai',[390,768,1440]],['centres','/centers',[390,1440]]];
 for(const [channel,items]of [['chrome',cases],['msedge',[cases[0].slice(0,2).concat([[390,1440]])]]]){
  const browser=await chromium.launch({channel,headless:true});
  launched.push(browser);
  for(const [id,path,widths]of items)for(const width of widths){
   const page=await browser.newPage({viewport:{width,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/api/enrolment',r=>r.abort());const response=await page.goto(pageUrl(path),{waitUntil:'networkidle'});assert.equal(response.status(),200,path+' rendered response');await page.evaluate(()=>document.fonts.ready);
   const metrics=await page.evaluate(()=>({header:document.querySelector('.portal-header').getBoundingClientRect().height,footer:document.querySelector('.portal-site-footer').getBoundingClientRect().height,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,featured:document.querySelectorAll('.verify-footer>.wrap>.verify-card-grid>.verify-card').length,allRecords:document.querySelectorAll('[data-record-id]').length,phone:document.querySelector('[data-cta="header-call"]').getAttribute('href'),footerNative:document.querySelectorAll('details.portal-footer-group').length,mobileLabels:[...document.querySelectorAll('.portal-main-list .portal-nav-label')].filter(e=>getComputedStyle(e.parentElement).display!=='none').map(e=>e.textContent)}));
   assert.equal(metrics.overflow,0);assert.equal(metrics.featured,8);assert.equal(metrics.allRecords,36);assert.equal(metrics.phone,'tel:+919100181181');assert.equal(metrics.footerNative,8);assert.equal(errors.length,0);
   if(width<=900){assert.equal(metrics.mobileLabels.length,7);await page.locator('.portal-mobile-menu-trigger').click();assert(await page.locator('.portal-directory').evaluate(e=>e.open));await page.keyboard.press('Escape');assert(!(await page.locator('.portal-directory').evaluate(e=>e.open)));}
   const group=page.locator('details.portal-footer-group').first();await group.locator('summary').focus();await page.keyboard.press('Enter');assert(await group.evaluate(e=>e.open));await page.keyboard.press('Enter');assert(!(await group.evaluate(e=>e.open)));
   const scope=page.locator('.verify-card-scope').first();await scope.locator('summary').focus();await page.keyboard.press('Enter');assert(await scope.evaluate(e=>e.open));await page.keyboard.press('Enter');
   if(channel==='chrome'&&id==='speech'&&[390,1440].includes(width)){
    await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`audits/shared-shell-v133-${phase}-header-${width}.png`});
    await page.locator('.portal-footer-brands').scrollIntoViewIfNeeded();await page.locator('.portal-footer-brands img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.complete?img.decode():new Promise((resolve,reject)=>{img.addEventListener('load',()=>img.decode().then(resolve,reject),{once:true});img.addEventListener('error',reject,{once:true});}))));await page.locator('.portal-footer-evidence').scrollIntoViewIfNeeded();await page.screenshot({path:`audits/shared-shell-v133-${phase}-footer-${width}.png`});
    if(phase==='local'){const oldPage=await browser.newPage({viewport:{width,height:900}});await oldPage.goto('https://www.pinnacleblooms.org'+path,{waitUntil:'networkidle'});before.push({width,...await oldPage.evaluate(()=>({header:document.querySelector('.portal-header').getBoundingClientRect().height,footer:document.querySelector('.portal-site-footer').getBoundingClientRect().height}))});await oldPage.close();}
   }
   runs.push({id,path,channel,width,...metrics,errors});await page.close();
  }await browser.close();
 }
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:900}});
 launched.push(browser);await page.goto(pageUrl(cases[0][1]));const group=page.locator('details.portal-footer-group').first();await group.locator('summary').click();assert(await group.evaluate(e=>e.open));const scope=page.locator('.verify-card-scope').first();await scope.locator('summary').click();assert(await scope.evaluate(e=>e.open));await browser.close();
 const output=`deployment/shared-shell-responsive-${phase}-v133-20261001.json`;fs.writeFileSync(output,JSON.stringify({checkedAt:new Date().toISOString(),origin,bodyResults,runs,before,noJsNativeFooter:true,noEnquirySubmitted:true},null,2)+'\n');console.log(JSON.stringify({output,acceptedBodiesUnchanged:bodyResults.length,runs:runs.length,before,after:runs.filter(r=>r.id==='speech'&&r.channel==='chrome'&&[390,1440].includes(r.width)).map(({width,header,footer})=>({width,header,footer})),noJsNativeFooter:true}));
})().catch(async e=>{console.error(e);await Promise.allSettled(launched.map(browser=>browser.close()));process.exitCode=1});
