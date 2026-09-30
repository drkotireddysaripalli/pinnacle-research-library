const {chromium,webkit}=require('playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const origin=process.env.CENTRE_ORIGIN||'http://127.0.0.1:4338';
const canonical='/centers/best-autism-speech-aba-occupational-therapy-center-suchitra-hyderabad-telangana-india';
(async()=>{
 const runs=[];
 for(const [channel,widths]of [['chrome',[320,390,768,1024,1440]],['msedge',[390,1440]]]){
  const browser=await chromium.launch({channel,headless:true});
  for(const width of widths){
   const page=await browser.newPage({viewport:{width,height:width<500?844:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin+canonical,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>document.querySelector('.local-hero-photo img')?.naturalWidth);
   if(channel==='chrome'&&[390,1440].includes(width))await page.screenshot({path:'audits/suchitra-v131-hero-'+width+'.png'});
   if(width<=768){await page.locator('.portal-mobile-menu-trigger').click();assert(await page.locator('.portal-directory').evaluate(el=>el.open));await page.locator('.portal-menu-close').click();}
   await page.locator('#connected-pathway').scrollIntoViewIfNeeded();
   if(channel==='chrome'&&[390,1440].includes(width))await page.screenshot({path:'audits/suchitra-v131-path-'+width+'.png'});
   await page.locator('.local-sources summary').focus();await page.keyboard.press('Enter');
   const facts=await page.evaluate(()=>{
    const ids=[...document.querySelectorAll('[id]')].map(x=>x.id);
    return {viewport:document.documentElement.clientWidth,width:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,stages:document.querySelectorAll('.local-stages>li').length,questions:document.querySelectorAll('#questions details').length,phone:document.querySelector('.local-actions a[data-cta="hero-call"]').getAttribute('href'),enquiry:document.querySelector('.local-actions a[data-cta="hero-assessment"]').getAttribute('href'),header:!!document.querySelector('.portal-header'),footer:!!document.querySelector('.portal-site-footer .verify-footer'),disclosure:document.querySelector('.local-sources').open,dup:ids.filter((x,i)=>ids.indexOf(x)!==i),missing:[...document.querySelectorAll('a[href^="#"]')].map(x=>x.getAttribute('href')).filter(x=>x.length>1&&!document.getElementById(x.slice(1)))};
   });
   assert.equal(facts.viewport,facts.width);assert.equal(facts.h1,1);assert.equal(facts.stages,7);assert.equal(facts.questions,8);assert.equal(facts.phone,'tel:+919100181181');assert(facts.enquiry.includes('centre=suchitra')&&facts.header&&facts.footer&&facts.disclosure);assert.equal(facts.dup.length,0);assert.equal(facts.missing.length,0);assert.equal(errors.length,0);
   if(channel==='chrome'&&width===390){
    await page.locator('#centre-gallery').scrollIntoViewIfNeeded();await page.waitForFunction(()=>[...document.querySelectorAll('.local-gallery img')].every(x=>x.complete&&x.naturalWidth));
    await page.screenshot({path:'audits/suchitra-v131-gallery-390.png'});
    await page.locator('.local-campaign').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('.local-campaign img')?.naturalWidth);await page.screenshot({path:'audits/suchitra-v131-story-390.png'});
    let writes=[];await page.addInitScript(()=>{window.__copies=[];Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>window.__copies.push(text)},configurable:true});Object.defineProperty(navigator,'share',{value:undefined,configurable:true});});
    await page.reload({waitUntil:'networkidle'});await page.locator('#local-share').click();assert.equal((await page.evaluate(()=>window.__copies))[0],'https://www.pinnacleblooms.org'+canonical);
    await page.locator('.local-sources summary').click();await page.locator('#local-copy-citation').click();assert((await page.evaluate(()=>window.__copies))[1].includes('30 September 2026'));
   }
   runs.push({channel,width,...facts,errors});await page.close();
  }await browser.close();
 }
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage();let sends=0;await page.route('**/api/enrolment',route=>{sends++;return route.abort();});
 await page.goto(origin+'/enroll-autism-speech-aba-therapies-india?service=help&centre=suchitra',{waitUntil:'networkidle'});assert.equal(await page.locator('#preferred-centre').inputValue(),'suchitra');assert.equal(await page.locator('[name=service]:checked').inputValue(),'help');assert.equal(sends,0);await browser.close();
 const output='deployment/suchitra-responsive-v131-20260930.json';fs.writeFileSync(output,JSON.stringify({checkedAt:new Date().toISOString(),origin,runs,selectedCentreEnquiry:true,noEnquirySubmitted:true,webkitAvailable:fs.existsSync(webkit.executablePath()),physicalIOS:false},null,2)+'\n');console.log(JSON.stringify({output,runs:runs.length,selectedCentreEnquiry:true,noEnquirySubmitted:true}));
})().catch(e=>{console.error(e);process.exitCode=1});
