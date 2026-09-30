const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const origin = process.env.OT_ORIGIN || 'http://127.0.0.1:4327';
const canonical = '/best-occupational-therapy-center-india-proven-improvement-rate';
const mode = origin.startsWith('https://') ? 'live' : 'local';
const channel = process.env.OT_BROWSER || 'chrome';
const widths = [320, 390, 768, 1024, 1440];

(async () => {
  const browser = await chromium.launch({channel,headless:true});
  const results = [];
  fs.mkdirSync('audits', {recursive:true});
  for (const width of widths) {
    const height = width === 320 ? 568 : width === 390 ? 844 : 900;
    const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + canonical, {waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.ot-hero-art > img').waitFor({state:'visible'});
    const firstScreen = await page.evaluate(() => ({
      headerBottom:Math.round(document.querySelector('.portal-header').getBoundingClientRect().bottom),
      headingBottom:Math.round(document.querySelector('.ot-hero h1').getBoundingClientRect().bottom),
      leadTop:Math.round(document.querySelector('.ot-hero-lead').getBoundingClientRect().top),
      stickyCallTop:Math.round(document.querySelector('.mobile-cta').getBoundingClientRect().top),
      helplineClipped:(()=>{const node=document.querySelector('.portal-national-label');return node.scrollHeight>node.clientHeight+1||node.scrollWidth>node.clientWidth+1})()
    }));
    if (width === 320 || width === 390 || width === 1440) {
      await page.screenshot({path:path.join('audits','occupational-'+mode+(channel==='chrome'?'':'-'+channel)+'-hero-'+width+'-20260930.png')});
    }
    let compactMenu = null;
    if (width === 320) {
      const button = page.locator('.portal-mobile-menu-trigger');
      await button.click();
      const opened = await page.locator('.portal-directory').evaluate(node => node.open);
      const expanded = await button.getAttribute('aria-expanded');
      await page.locator('.portal-menu-close').click();
      const closed = !(await page.locator('.portal-directory').evaluate(node => node.open));
      compactMenu = {opened,expanded,closed,focusRestored:await button.evaluate(node => document.activeElement === node)};
    }
    if (width === 390 || width === 1440) {
      await page.locator('.ot-goal-art').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => Boolean(document.querySelector('.ot-goal-art img')?.naturalWidth), null, {timeout:10000});
      await page.screenshot({path:path.join('audits','occupational-'+mode+'-mealtime-'+width+'-20260930.png')});
      await page.locator('.ot-stage-peek').scrollIntoViewIfNeeded();
      await page.screenshot({path:path.join('audits','occupational-'+mode+'-path-'+width+'-20260930.png')});
    }
    await page.locator('.ot-first-art').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => Boolean(document.querySelector('.ot-first-art img')?.naturalWidth), null, {timeout:10000});
    const result = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
      const faq = [...document.querySelectorAll('#questions details')].length;
      const schema = [...document.querySelectorAll('script[type="application/ld+json"]')].map(node => {
        try { return JSON.parse(node.textContent); } catch { return null; }
      }).filter(Boolean);
      const faqSchema = schema.flatMap(item => item['@graph'] || [item]).find(item => item['@type'] === 'FAQPage');
      const service = schema.flatMap(item => item['@graph'] || [item]).find(item => item['@type'] === 'Service' && item['@id']?.endsWith('#service'));
      const localAnchors = [...document.querySelectorAll('a[href^="#"]')].map(node => node.getAttribute('href')).filter(href => href && href.length > 1 && !document.getElementById(href.slice(1)));
      return {
        title:document.title,
        h1:document.querySelector('h1')?.textContent?.trim(),
        viewport:document.documentElement.clientWidth,
        documentWidth:document.documentElement.scrollWidth,
        heroImageLoaded:Boolean(document.querySelector('.ot-hero-art > img')?.naturalWidth),
        firstConversationImageLoaded:Boolean(document.querySelector('.ot-first-art img')?.naturalWidth),
        footer:Boolean(document.querySelector('.portal-site-footer')),
        verifyFooter:Boolean(document.querySelector('#pinnacle-evidence')),
        callHref:document.querySelector('[data-cta="ot-hero-call"]')?.getAttribute('href'),
        centreCount:document.querySelectorAll('.directory-card').length,
        faq,faqSchema:faqSchema?.mainEntity?.length || 0,
        serviceAreaServed:service?.areaServed || null,
        duplicateIds:ids.filter((id,index) => ids.indexOf(id) !== index),
        missingLocalAnchors:localAnchors,
        sevenVisibleStages:document.querySelectorAll('.ot-stage-peek li').length,
        socialImage:document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
        mobileCallBar:getComputedStyle(document.querySelector('.mobile-cta')).display
      };
    });
    Object.assign(result,firstScreen,{compactMenu});
    await page.locator('.ot-stage-disclosure summary').focus();
    await page.keyboard.press('Enter');
    result.stageDisclosureKeyboard = await page.locator('.ot-stage-disclosure').evaluate(node => node.open);
    result.pageErrors = errors;
    results.push({width,...result});
    await page.close();
  }
  await browser.close();
  const report = {checkedAt:new Date().toISOString(),origin,channel,results};
  const output = 'deployment/occupational-responsive-'+mode+(channel==='chrome'?'':'-'+channel)+'-20260930.json';
  fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({output,results},null,2));
  if (results.some(result => result.documentWidth > result.viewport || !result.heroImageLoaded || !result.firstConversationImageLoaded || !result.footer || !result.verifyFooter || result.callHref !== 'tel:+919100181181' || result.centreCount !== 62 || result.faq !== 8 || result.faqSchema !== 8 || result.serviceAreaServed || result.duplicateIds.length || result.missingLocalAnchors.length || result.sevenVisibleStages !== 7 || !result.stageDisclosureKeyboard || result.pageErrors.length || result.helplineClipped || (result.width===320 && (result.headingBottom>result.stickyCallTop || result.leadTop>=result.stickyCallTop || !result.compactMenu?.opened || result.compactMenu?.expanded!=='true' || !result.compactMenu?.closed || !result.compactMenu?.focusRestored)))) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
