const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1200 } });
    await page.goto('https://www.pinnacleblooms.org/best-special-education-center-call-9100181181', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.innerText,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      brokenImages: [...document.images].filter((image) => image.loading !== 'lazy' && (!image.complete || !image.naturalWidth)).map((image) => ({ src: image.currentSrc || image.src, alt: image.alt })),
      header: Boolean(document.querySelector('.portal-header')),
      footer: Boolean(document.querySelector('.portal-site-footer')),
      call: Boolean(document.querySelector('a[href="tel:+919100181181"]'))
    }));
    results.push({ width, ...result });
    await page.close();
  }
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
  if (results.some((result) => result.scrollWidth > result.clientWidth || result.brokenImages.length || !result.header || !result.footer || !result.call)) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
