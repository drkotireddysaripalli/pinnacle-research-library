const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const origin = process.env.ABA_ORIGIN || 'http://127.0.0.1:4328';
const channel = process.env.ABA_BROWSER || 'chrome';
const canonical = '/best-aba-therapy-center-india-proven-improvement-rate';
const widths = [320,390,768,1024,1440];

(async () => {
  const browser = await chromium.launch({channel,headless:true});
  fs.mkdirSync('audits',{recursive:true});
  const results=[];
  for(const width of widths){
    const page=await browser.newPage({viewport:{width,height:width===320?568:width===390?844:900},deviceScaleFactor:1});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(origin+canonical,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForFunction(()=>Boolean(document.querySelector('.hero-slide img')?.naturalWidth));
    const firstScreen=await page.evaluate(()=>({headingBottom:Math.round(document.querySelector('.hero-copy h1').getBoundingClientRect().bottom),stickyTop:Math.round(document.querySelector('.mobile-cta').getBoundingClientRect().top),heroCallTop:Math.round(document.querySelector('.hero-actions [data-cta="hero-call"]').getBoundingClientRect().top)}));
    if([320,390,1440].includes(width)) await page.screenshot({path:path.join('audits',`aba-hero-${width}-20260930.png`)});
    let menu=null;
    if(width<=768){
      const trigger=page.locator('.portal-mobile-menu-trigger');
      await trigger.click();
      await page.waitForFunction(()=>document.querySelector('.portal-mobile-menu-trigger')?.getAttribute('aria-expanded')==='true');
      menu={opened:await page.locator('.portal-directory').evaluate(el=>el.open),expanded:await trigger.getAttribute('aria-expanded')};
      if(width===390){
        menu.firstSection=await page.locator('.portal-priority-menu section').evaluateAll(sections=>sections.slice().sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top)[0]?.querySelector('h2')?.textContent?.trim());
        await page.screenshot({path:path.join('audits','aba-menu-390-20260930.png')});
      }
      await page.locator('.portal-menu-close').click();
      menu.closed=!(await page.locator('.portal-directory').evaluate(el=>el.open));
    }
    if([390,1440].includes(width)){
      for(const [selector,name] of [['.aba-story','example'],['.aba-stage-grid','stages'],['.aba-review-art','review']]){
        await page.locator(selector).scrollIntoViewIfNeeded();
        if(selector!=='.aba-stage-grid') await page.waitForFunction(s=>Boolean(document.querySelector(s+' img')?.naturalWidth),selector);
        await page.screenshot({path:path.join('audits',`aba-${name}-${width}-20260930.png`)});
      }
    }
    for(const selector of ['.aba-story img','.aba-review-art>img']){
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForFunction(s=>Boolean(document.querySelector(s)?.naturalWidth),selector);
    }
    const result=await page.evaluate(()=>{
      const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);
      const graph=[...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(el=>{try{const item=JSON.parse(el.textContent);return item['@graph']||[item];}catch{return [];}});
      const faq=graph.find(item=>item['@type']==='FAQPage');
      const service=graph.find(item=>item['@type']==='Service'&&item['@id']?.endsWith('#service'));
      return {
        title:document.title,h1:document.querySelector('h1')?.textContent?.trim(),
        viewport:document.documentElement.clientWidth,documentWidth:document.documentElement.scrollWidth,
        heroImageLoaded:Boolean(document.querySelector('.hero-slide img')?.naturalWidth),
        exampleImageLoaded:Boolean(document.querySelector('.aba-story img')?.naturalWidth),
        reviewImageLoaded:Boolean(document.querySelector('.aba-review-art>img')?.naturalWidth),
        header:Boolean(document.querySelector('.portal-header')),footer:Boolean(document.querySelector('.portal-site-footer')),
        verifyFooter:Boolean(document.querySelector('#pinnacle-evidence')),
        callHref:document.querySelector('.hero-actions [data-cta="hero-call"]')?.getAttribute('href'),
        firstCallHref:document.querySelector('[data-cta="aba-first-call"]')?.getAttribute('href'),
        centreCount:document.querySelectorAll('.directory-card').length,
        centreNotice:Boolean(document.querySelector('.directory-service-notice')),
        faqVisible:document.querySelectorAll('#questions details').length,faqSchema:faq?.mainEntity?.length||0,
        serviceAreaServed:service?.areaServed||null,
        stages:document.querySelectorAll('.aba-stage-grid>li').length,
        duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i),
        missingAnchors:[...document.querySelectorAll('a[href^="#"]')].map(el=>el.getAttribute('href')).filter(href=>href.length>1&&!document.getElementById(href.slice(1))),
        ogImage:document.querySelector('meta[property="og:image"]')?.content
      };
    });
    await page.locator('.aba-lens-disclosure summary').focus();
    await page.keyboard.press('Enter');
    result.lensKeyboard=await page.locator('.aba-lens-disclosure').evaluate(el=>el.open);
    results.push({width,...result,...firstScreen,menu,errors});
    await page.close();
  }
  await browser.close();
  const output='deployment/aba-responsive-local-20260930.json';
  fs.writeFileSync(output,JSON.stringify({checkedAt:new Date().toISOString(),origin,channel,results},null,2)+'\n');
  console.log(JSON.stringify({output,results},null,2));
  if(results.some(r=>r.documentWidth>r.viewport||!r.heroImageLoaded||!r.exampleImageLoaded||!r.reviewImageLoaded||!r.header||!r.footer||!r.verifyFooter||r.callHref!=='tel:+919100181181'||r.firstCallHref!=='tel:+919100181181'||r.centreCount!==62||!r.centreNotice||r.faqVisible!==11||r.faqSchema!==11||r.serviceAreaServed||r.stages!==7||r.duplicateIds.length||r.missingAnchors.length||!r.lensKeyboard||r.errors.length||(r.width<=768&&(!r.menu?.opened||r.menu?.expanded!=='true'||!r.menu?.closed))||(r.width===390&&r.menu?.firstSection!=='Therapies')))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1});
