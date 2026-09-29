const { chromium } = require('playwright');
const fs=require('node:fs');

(async () => {
  const origin = process.env.AUTISM_ORIGIN || 'http://127.0.0.1:4321';
  const mode = origin.startsWith('https://') ? 'live' : 'local';
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1200 } });
    await page.goto(origin + '/autism-therapy', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.autism-story').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => Boolean(document.querySelector('.autism-story img')?.naturalWidth), null, {timeout:5000});
    const result = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.innerText,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      brokenImages: [...document.images].filter(image => image.loading !== 'lazy' && (!image.complete || !image.naturalWidth)).map(image => ({src:image.currentSrc||image.src,alt:image.alt})),
      storyImageLoaded: Boolean(document.querySelector('.autism-story img')?.naturalWidth),
      duplicateIds:[...document.querySelectorAll('[id]')].map(node=>node.id).filter((id,index,all)=>all.indexOf(id)!==index),
      header: Boolean(document.querySelector('.portal-header')),
      footer: Boolean(document.querySelector('.portal-site-footer')),
      evidenceFooter: Boolean(document.querySelector('.verify-footer')),
      call: Boolean(document.querySelector('a[href="tel:+919100181181"]')),
      directory: Boolean(document.querySelector('#centres')),
      mobileCta: getComputedStyle(document.querySelector('.mobile-cta')).display
    }));
    await page.screenshot({path:`audits/autism-therapy-${mode}-${width}-20260929.png`,fullPage:true});
    results.push({ width, ...result });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(`deployment/autism-therapy-responsive-${mode}-20260929.json`,JSON.stringify({checkedAt:new Date().toISOString(),origin,results},null,2)+'\n');
  console.log(JSON.stringify(results, null, 2));
  if (results.some(result => result.scrollWidth > result.clientWidth || result.brokenImages.length || !result.storyImageLoaded || result.duplicateIds.length || !result.header || !result.footer || !result.call || !result.directory)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
