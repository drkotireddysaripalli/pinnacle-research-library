const { chromium } = require('playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const origin=process.env.PORTAL_ORIGIN||'https://www.pinnacleblooms.org',local=origin.startsWith('http://127.'),tag=process.env.PORTAL_REVIEW_TAG||'special-education';
const expected=JSON.parse(fs.readFileSync('public/pinnacle-pages-data/special-education-evidence.json')).lifecycle.map(s=>s.title);

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1200 } });
    await page.goto(origin+'/best-special-education-center-call-9100181181'+(local?'.html':''), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => ({
      stages:[...document.querySelectorAll('.life-path>li h3')].map(e=>e.textContent),title: document.title,
      h1: document.querySelector('h1')?.innerText,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      brokenImages: [...document.images].filter((image) => image.loading !== 'lazy' && (!image.complete || !image.naturalWidth)).map((image) => ({ src: image.currentSrc || image.src, alt: image.alt })),
      header: Boolean(document.querySelector('.portal-header')),
      footer: Boolean(document.querySelector('.portal-site-footer')),
      call: Boolean(document.querySelector('a[href="tel:+919100181181"]'))
    }));
    assert.deepEqual(result.stages,expected);
    if(width===390){await page.locator('.life-path').screenshot({path:'audits/special-education-'+tag+'-'+(local?'local':'live')+'-stages-390.png'});}
    results.push({ width, ...result });
    await page.close();
  }
  await browser.close();
  const output='deployment/special-education-responsive-'+tag+'-'+(local?'local':'live')+'-20261001.json';fs.writeFileSync(output,JSON.stringify({at:new Date().toISOString(),results},null,2)+'\n');console.log(JSON.stringify({output,cases:results.length,passed:!results.some(r=>r.scrollWidth>r.clientWidth||r.brokenImages.length)}));
  if (results.some((result) => result.scrollWidth > result.clientWidth || result.brokenImages.length || !result.header || !result.footer || !result.call)) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
