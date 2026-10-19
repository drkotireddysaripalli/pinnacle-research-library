import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';

const output = path.resolve(process.argv[2] || '../artifacts/measurement-always-on-live-20261019/live-browser.json');
const blockedHosts = /(?:googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|googlesyndication\.com|aseasky\.link|protect\.pinnacleblooms\.org)$/i;
const requests = [];
const browser = await chromium.launch({headless: true});
try {
  const context = await browser.newContext({viewport: {width: 390, height: 844}});
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (!blockedHosts.test(url.hostname)) return route.continue();
    requests.push({url: url.href, resourceType: route.request().resourceType()});
    const javascript = route.request().resourceType() === 'script';
    return route.fulfill({status: javascript ? 200 : 204, contentType: javascript ? 'text/javascript' : 'text/plain', body: ''});
  });
  const page = await context.newPage();
  const nonce = Date.now();
  const abaUrl = `https://www.pinnacleblooms.org/best-aba-therapy-center-india-proven-improvement-rate?utm_id=15340172547&utm_source=google&utm_medium=cpc&utm_campaign=aba_therapy&utm_content=aba_service&gclid=EAIaIQobChMIautomaticlive${nonce}`;
  await page.goto(abaUrl, {waitUntil: 'domcontentloaded', timeout: 45000});
  await page.waitForTimeout(1000);
  const aba = await page.evaluate(() => {
    const calls = (window.dataLayer || []).map(entry => Array.from(entry));
    const callConfig = calls.find(entry => entry[0] === 'config' && entry[1] === 'AW-10810823199/VNUcCMSy3YobEJ-kgKMo');
    if (typeof callConfig?.[2]?.phone_conversion_callback === 'function') callConfig[2].phone_conversion_callback('040 4000 0000', '+914040000000');
    const link = [...document.querySelectorAll('a[href^="tel:"]')].find(node => node.dataset.pinnacleAdCallTarget === 'central') || document.querySelector('a[href^="tel:"]');
    if (link) {
      link.addEventListener('click', event => event.preventDefault(), {once: true});
      link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
    }
    const source = JSON.parse(localStorage.getItem('pinnacle-enquiry-source-v1') || 'null');
    return {
      controls: document.querySelectorAll('[data-analytics-choice],[data-analytics-settings],[data-ad-call-preferences],[data-speech-measurement]').length,
      state: window.__pinnacleAdCallMeasurement || null,
      source,
      forwardedHref: link?.getAttribute('href') || null,
      dataLayer: (window.dataLayer || []).map(entry => Array.from(entry).slice(0, 3).map(value => typeof value === 'function' ? '[function]' : value))
    };
  });
  await page.waitForTimeout(100);
  aba.dataLayer = await page.evaluate(() => (window.dataLayer || []).map(entry => Array.from(entry).slice(0, 3).map(value => typeof value === 'function' ? '[function]' : value)));
  assert.equal(aba.controls, 0);
  assert.equal(aba.state?.enabled, true);
  assert.equal(aba.state?.started, true);
  assert.equal(aba.source?.fields?.utm_source, 'google');
  assert.equal(aba.source?.fields?.utm_medium, 'cpc');
  assert.match(aba.source?.fields?.gclid || '', /^EAIaIQobChMIautomaticlive/);
  assert.equal(aba.forwardedHref, 'tel:+914040000000');
  const names = aba.dataLayer.filter(entry => entry[0] === 'event').map(entry => entry[1]);
  for (const name of ['page_view', 'google_ads_arrival', 'phone_link_click']) assert(names.includes(name), `${name} missing from live dataLayer`);

  const verifyPages = [];
  for (const pathname of ['/verify/evidence/privacy.html', '/verify/guides/abilityscore.html']) {
    await page.goto(`https://www.pinnacleblooms.org${pathname}?live_readback=${nonce}`, {waitUntil: 'domcontentloaded', timeout: 45000});
    await page.waitForTimeout(250);
    const result = await page.evaluate(() => ({
      controls: document.querySelectorAll('[data-analytics-choice],[data-analytics-settings],[data-ad-call-preferences],[data-speech-measurement]').length,
      dataLayer: (window.dataLayer || []).map(entry => Array.from(entry).slice(0, 3).map(value => typeof value === 'function' ? '[function]' : value)),
      policyAutomatic: document.body.textContent.includes('The Google tag starts automatically on production Verify pages.')
    }));
    assert.equal(result.controls, 0);
    assert(result.dataLayer.some(entry => entry[0] === 'event' && entry[1] === 'page_view'));
    if (pathname.endsWith('/privacy.html')) assert.equal(result.policyAutomatic, true);
    verifyPages.push({pathname, ...result});
  }
  const evidence = {at: new Date().toISOString(), aba, verifyPages, requests};
  assert(requests.some(item => item.url.includes('googletagmanager.com')));
  assert(requests.some(item => item.url.includes('aseasky.link')));
  assert(requests.some(item => item.url.includes('protect.pinnacleblooms.org')));
  await fs.mkdir(path.dirname(output), {recursive: true});
  await fs.writeFile(output, JSON.stringify(evidence, null, 2) + '\n');
  console.log(JSON.stringify({output, requests: requests.length, events: names}));
} finally {
  await browser.close();
}
