const {chromium,webkit}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const origin=process.env.ASSESSMENT_ORIGIN||'http://127.0.0.1:4338';
const canonical='/speech-aba-autism-assessments';
const widths=[320,390,768,1024,1440];
(async()=>{
 fs.mkdirSync('audits',{recursive:true});
 const results=[],enrolment=[],engines=[['chrome',widths],['msedge',[390,1440]]];
 const availability={chrome:true,edge:true,webkitBinary:fs.existsSync(webkit.executablePath()),physicalSafariIOS:false};
 for(const [channel,sizes] of engines){
  const browser=await chromium.launch({channel,headless:true});
  for(const width of sizes){
   const page=await browser.newPage({viewport:{width,height:width===320?568:width===390?844:900}}),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.goto(origin+canonical,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>document.querySelector('.assessment-hero-art img')?.naturalWidth);
   if(channel==='chrome'&&[390,1440].includes(width))await page.screenshot({path:`audits/assessment-v130-${channel}-hero-${width}.png`});
   let menu=null;
   if(width<=768){const trigger=page.locator('.portal-mobile-menu-trigger');await trigger.click();menu={opened:await page.locator('.portal-directory').evaluate(el=>el.open),expanded:await trigger.getAttribute('aria-expanded')};await page.locator('.portal-menu-close').click();menu.closed=!(await page.locator('.portal-directory').evaluate(el=>el.open));}
   await page.locator('#connected-pathway').scrollIntoViewIfNeeded();
   if(channel==='chrome'&&[390,1440].includes(width))await page.screenshot({path:`audits/assessment-v130-${channel}-stages-${width}.png`});
   await page.locator('.assessment-more-sources summary').focus();await page.keyboard.press('Enter');
   const result=await page.evaluate(()=>{
    const ids=[...document.querySelectorAll('[id]')].map(el=>el.id),graph=JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
    const faq=graph.find(item=>item['@type']==='FAQPage'),service=graph.find(item=>item['@type']==='Service');
    return {title:document.title,h1Count:document.querySelectorAll('h1').length,canonical:document.querySelector('link[rel="canonical"]').href,viewport:document.documentElement.clientWidth,documentWidth:document.documentElement.scrollWidth,heroLoaded:!!document.querySelector('.assessment-hero-art img')?.naturalWidth,call:document.querySelector('.assessment-actions [data-cta="hero-call"]')?.getAttribute('href'),callRect:document.querySelector('.assessment-actions [data-cta="hero-call"]')?.getBoundingClientRect().toJSON(),stickyCall:document.querySelector('.mobile-cta a')?.getAttribute('href'),header:!!document.querySelector('.portal-header'),footer:!!document.querySelector('.portal-site-footer'),verifyInsideFooter:!!document.querySelector('.portal-site-footer .verify-footer'),authorityCount:document.querySelectorAll('.portal-header .portal-nav-label').length,stages:document.querySelectorAll('.assessment-stages>li').length,centres:document.querySelectorAll('.directory-card').length,visibleFaqs:document.querySelectorAll('#questions details').length,schemaFaqs:faq.mainEntity.length,serviceArea:service.areaServed||null,sourceKeyboard:document.querySelector('.assessment-more-sources').open,duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i),missingAnchors:[...document.querySelectorAll('a[href^="#"]')].map(el=>el.getAttribute('href')).filter(href=>href.length>1&&!document.getElementById(href.slice(1))),og:document.querySelector('meta[property="og:image"]').content};
   });
   assert.equal(result.documentWidth,result.viewport,'Horizontal overflow');assert.equal(result.h1Count,1);assert.equal(result.stages,7);assert.equal(result.centres,62);assert.equal(result.visibleFaqs,8);assert.equal(result.schemaFaqs,8);assert.equal(result.serviceArea,null);assert.equal(result.call,'tel:+919100181181');assert.equal(result.stickyCall,result.call);assert(result.heroLoaded&&result.header&&result.footer&&result.verifyInsideFooter&&result.sourceKeyboard);assert.equal(result.authorityCount,9);assert.equal(result.duplicateIds.length,0);assert.equal(result.missingAnchors.length,0);assert.equal(errors.length,0);if(menu)assert(menu.opened&&menu.closed&&menu.expanded==='true');
   results.push({channel,width,...result,menu,errors});await page.close();
  }
  if(channel==='chrome'){
   for(const [query,expected]of [['?entry=speech-assessment','speech'],['?entry=speech-assessment&service=occupational','occupational'],['','help']]){
    const page=await browser.newPage({viewport:{width:390,height:844}});let transmitted=0;
    await page.route('**/api/enrolment',route=>{transmitted++;return route.fulfill({status:202,contentType:'application/json',body:'{"status":"accepted"}'});});
    await page.goto(origin+'/enroll-autism-speech-aba-therapies-india'+query,{waitUntil:'networkidle'});await page.waitForFunction(()=>!document.getElementById('enrol-submit').disabled);
    const initial={query,selected:await page.locator('[name="service"]:checked').inputValue(),offer:await page.locator('#enrol-speech-offer').isVisible(),heading:await page.locator('#request-title').textContent(),action:await page.locator('#enrol-submit').textContent()};assert.equal(initial.selected,expected);assert.equal(initial.offer,expected==='speech');assert.equal(transmitted,0);
    if(expected==='speech'){
     await page.locator('#enrol-speech-offer').scrollIntoViewIfNeeded();await page.screenshot({path:'audits/enrolment-speech-offer-v130-390.png'});
     await page.locator('input[value="occupational"]').check();assert(!(await page.locator('#enrol-speech-offer').isVisible()));assert(!(await page.locator('#enrol-submit').textContent()).includes('FREE'));
     await page.locator('input[value="speech"]').check();assert(await page.locator('#enrol-speech-offer').isVisible());
     await page.locator('#parent-name').fill('Local Test Only');await page.locator('#parent-phone').fill('+91 00000 00000');await page.locator('#enrol-submit').click();await page.waitForFunction(()=>document.getElementById('enrol-status').textContent.includes('received'));assert.equal(transmitted,1);initial.mockAccepted=true;
    }enrolment.push(initial);await page.close();
   }
   for(const width of [390,1440]){
    const page=await browser.newPage({viewport:{width,height:900}});await page.goto(origin+'/autism-therapy',{waitUntil:'networkidle'});await page.locator('#questions').scrollIntoViewIfNeeded();await page.screenshot({path:`audits/autism-faq-v130-${width}.png`});const facts=await page.evaluate(()=>({faqChildren:document.querySelector('#questions').children.length,anchors:['why-section','Advantages-section','ChildrenServices-section','assessment-section','admission-section','procedure-section','Cost-section'].every(id=>!!document.getElementById(id)),selfLink:[...document.querySelectorAll('.therapy-together-close a')].some(el=>el.pathname==='/autism-therapy'),lead:document.querySelector('.hero-intro strong').textContent}));assert.equal(facts.faqChildren,2);assert(facts.anchors&&!facts.selfLink&&facts.lead.includes('Only the support'));await page.close();
   }
  }
  await browser.close();
 }
 const output='deployment/assessment-responsive-v130-20260930.json';fs.writeFileSync(output,JSON.stringify({checkedAt:new Date().toISOString(),origin,availability,results,enrolment},null,2)+'\n');console.log(JSON.stringify({output,responsivePassed:results.length,enrolmentContexts:enrolment.length,mockOnly:true,availability}));
})().catch(error=>{console.error(error);process.exitCode=1});
