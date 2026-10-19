// Isolated browser transport test. The real Google SDK is loaded once, while
// every collection request and every customer action remains intercepted.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { chromium, webkit } from 'playwright';

const output = process.argv[2] || 'ask-private/automatic-before-choice-20261019/wire.json';
const source = await fs.readFile('public/pinnacle-pages-scripts/speech-measurement.js', 'utf8');
const sdkUrl = 'https://www.googletagmanager.com/gtag/js?id=G-2BYLRLFRDJ';
const sdkResponse = await fetch(sdkUrl, { signal: AbortSignal.timeout(30000) });
assert(sdkResponse.ok, 'Google gtag SDK could not be read for the isolated test');
const sdk = await sdkResponse.text();
const sourceSha256 = crypto.createHash('sha256').update(source).digest('hex');
const sdkSha256 = crypto.createHash('sha256').update(sdk).digest('hex');

const origin = 'https://www.pinnacleblooms.org';
const abaPath = '/best-aba-therapy-center-india-proven-improvement-rate';
const fixture = `<!doctype html><html><head></head><body data-page-variant="service">
  <details data-speech-measurement open><p></p>
    <button id="allow" data-measurement-choice="accepted">Allow</button>
    <button id="off" data-measurement-choice="declined">Off</button>
    <p data-measurement-status></p>
  </details>
  <a id="phone" data-cta="aba-first-call" href="tel:+919100181181">Call</a>
  <a id="whatsapp" data-cta="hero-whatsapp" href="https://wa.me/919100181181?text=ISOLATED_PRIVATE">WhatsApp</a>
  <a id="enquiry" data-cta="aba-final-enrol" href="${origin}/enroll-autism-speech-aba-therapies-india?service=aba">Enquire</a>
  <a id="centre" data-cta="aba-first-centres" href="#centres">Centres</a>
  <section id="pinnacle-enrolment" data-callback-contract="durable-enrolment-v1" data-api-endpoint="/api/enrolment"></section>
  <div style="height:2000px" aria-hidden="true"></div>
  <script>document.addEventListener('click',event=>event.preventDefault(),true)</script>
  <script src="/pinnacle-pages-scripts/speech-measurement.js"></script>
</body></html>`;

const states = [
  { name: 'fresh', active: true, laterChoice: true },
  { name: 'fresh-no-choice-lifecycle', active: true, lifecycleBeforeChoice: true },
  { name: 'accepted', active: true },
  { name: 'call-granted', active: true, laterChoice: true },
  { name: 'declined', active: false },
  { name: 'gpc', active: false },
  { name: 'invalid', active: false },
  { name: 'unavailable-storage', active: false },
  { name: 'qa', active: false, query: '?validation_test=1' },
  { name: 'private', active: false, path: '/account/private' }
];
const results = [];

const analyticsCookies = cookies => cookies.filter(cookie => /^(?:ps_ga(?:_|$)|_ga(?:_|$))/.test(cookie.name));
const eventName = request => request.en;
const eventMode = request => request['ep.measurement_mode'];
const decodeCollection = (search, body = '') => {
  const shared = new URLSearchParams(search);
  return (body ? body.split('\n').filter(Boolean) : ['']).map(line => {
    const payload = new URLSearchParams(shared);
    for (const [key, value] of new URLSearchParams(line)) payload.set(key, value);
    return Object.fromEntries(payload);
  });
};
assert.deepEqual(
  decodeCollection('?v=2&tid=G-TEST', 'en=first&ep.mode=a\nen=second&ep.mode=b').map(item => [item.tid, item.en, item['ep.mode']]),
  [['G-TEST', 'first', 'a'], ['G-TEST', 'second', 'b']],
  'GA4 newline batches must be decoded as distinct events'
);
const waitForCount = async (page, requests, count) => {
  for (let attempt = 0; attempt < 50 && requests.length < count; attempt += 1) await page.waitForTimeout(100);
};

for (const [browserName, type] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await type.launch({ headless: true });
  try {
    for (const state of states) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const requests = [];
      await context.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.origin === origin && url.pathname === '/pinnacle-pages-scripts/speech-measurement.js') {
          return route.fulfill({ contentType: 'text/javascript', body: source });
        }
        if (url.href === sdkUrl) return route.fulfill({ contentType: 'text/javascript', body: sdk });
        if (/(?:google-analytics\.com|analytics\.google\.com)$/.test(url.hostname) && url.pathname.endsWith('/collect')) {
          requests.push(...decodeCollection(url.search, route.request().postData() || ''));
          return route.fulfill({ status: 204 });
        }
        if (url.origin === origin && !url.pathname.includes('.')) {
          return route.fulfill({ contentType: 'text/html', body: fixture });
        }
        return route.abort();
      });
      await context.addInitScript(({ stateName }) => {
        if (stateName === 'gpc') Object.defineProperty(navigator, 'globalPrivacyControl', { configurable: true, value: true });
        if (stateName === 'call-granted') {
          window.__pinnacleConsentDefaults = true;
          window.dataLayer = [];
          window.gtag = function () { window.dataLayer.push(arguments); };
          window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
          window.gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied' });
        }
        if (['accepted', 'declined'].includes(stateName)) {
          localStorage.setItem('pinnacle-speech-analytics-v1', JSON.stringify({ value: stateName, at: Date.now() }));
        }
        if (stateName === 'invalid') localStorage.setItem('pinnacle-speech-analytics-v1', '{invalid');
        if (stateName === 'unavailable-storage') {
          const originalSet = Storage.prototype.setItem;
          Storage.prototype.getItem = () => { throw new Error('isolated storage failure'); };
          Storage.prototype.setItem = function (key, value) {
            if (key === 'pinnacle-speech-analytics-v1') throw new Error('isolated storage failure');
            return originalSet.call(this, key, value);
          };
        }
      }, { stateName: state.name });

      const page = await context.newPage();
      const pagePath = state.path || abaPath;
      await page.goto(origin + pagePath + (state.query || '?name=ISOLATED_PRIVATE'));
      for (const selector of ['#phone', '#whatsapp', '#enquiry', '#centre']) await page.click(selector);
      await page.evaluate(() => {
        const receipt = { schemaVersion: 1, requestId: 'isolated-wire-request', id: 'isolated-wire-receipt' };
        for (let index = 0; index < 2; index += 1) {
          document.dispatchEvent(new CustomEvent('pinnacle:enquiry-accepted', { detail: { receipt } }));
        }
      });
      if (state.active) await waitForCount(page, requests, state.name === 'accepted' ? 6 : 5);
      else await page.waitForTimeout(500);
      if (state.lifecycleBeforeChoice) {
        await page.evaluate(() => {
          window.dispatchEvent(new Event('focus'));
          window.scrollTo(0, document.body.scrollHeight);
          Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
          document.dispatchEvent(new Event('visibilitychange'));
          window.dispatchEvent(new PageTransitionEvent('pagehide'));
          window.dispatchEvent(new Event('beforeunload'));
        });
        await page.waitForTimeout(300);
      }

      const beforeChoice = requests.slice();
      const limitedCookieCount = analyticsCookies(await context.cookies()).length;
      if (state.active) {
        const expectedEvents = ['page_view', 'phone_link_click', 'whatsapp_link_click', 'enquiry_link_click', ...(state.name === 'accepted' ? ['centre_section_click'] : []), 'enquiry_accepted'];
        assert.deepEqual(beforeChoice.map(eventName), expectedEvents, `${browserName} ${state.name} initial wire events`);
        const expectedMode = state.name === 'accepted' ? 'consented' : 'denied_storage';
        assert(beforeChoice.every(request => eventMode(request) === expectedMode), `${browserName} ${state.name} event mode`);
        assert.equal(beforeChoice.filter(request => eventName(request) === 'page_view').length, 1, `${browserName} ${state.name} one page view`);
        if (state.name !== 'accepted') assert(!beforeChoice.some(request => eventName(request) === 'centre_section_click'), `${browserName} ${state.name} centre navigation excluded from limited wire`);
        if (state.name === 'fresh' || state.lifecycleBeforeChoice) assert(beforeChoice.every(request => request.gcs === 'G100'), `${browserName} ${state.name} denied storage state`);
        if (state.name === 'call-granted') assert(beforeChoice.every(request => request.gcs === 'G110'), `${browserName} independent advertising consent preserved`);
        if (state.name !== 'accepted') assert.equal(limitedCookieCount, 0, `${browserName} ${state.name} no analytics cookies before choice`);
      } else {
        assert.equal(requests.length, 0, `${browserName} ${state.name} must remain silent`);
      }

      let postChoiceEventCount = requests.length;
      if (state.laterChoice) {
        await page.click('#allow');
        await page.click('#phone');
        await waitForCount(page, requests, beforeChoice.length + 1);
        assert.equal(requests.filter(request => eventName(request) === 'page_view').length, 1, `${browserName} ${state.name} acceptance must not duplicate page view`);
        assert.equal(eventMode(requests.at(-1)), 'consented', `${browserName} ${state.name} post-choice event`);
        await page.click('#off');
        postChoiceEventCount = requests.length;
        await page.click('#phone');
        await page.evaluate(() => {
          Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
          document.dispatchEvent(new Event('visibilitychange'));
          window.dispatchEvent(new PageTransitionEvent('pagehide'));
          window.dispatchEvent(new Event('beforeunload'));
        });
        await page.waitForTimeout(300);
        assert.equal(requests.length, postChoiceEventCount, `${browserName} ${state.name} withdrawal stops click, visibility and page-exit events`);
        assert.equal(analyticsCookies(await context.cookies()).length, 0, `${browserName} ${state.name} withdrawal clears owned analytics cookies`);
      }

      const wire = JSON.stringify(requests);
      for (const value of ['ISOLATED_PRIVATE', 'isolated-wire-request', 'isolated-wire-receipt', 'private-child-detail', 'service=aba', 'text=']) {
        assert(!wire.includes(value), `${browserName} ${state.name} excluded ${value}`);
      }
      const consentCalls = await page.evaluate(() => (window.dataLayer || [])
        .filter(item => item?.[0] === 'consent')
        .map(item => Array.from(item)));
      if (state.name === 'call-granted') {
        assert(consentCalls.some(call => call[1] === 'update' && call[2]?.ad_storage === 'granted'), `${browserName} advertising grant exists`);
        assert(!consentCalls.slice(2).some(call => Object.hasOwn(call[2] || {}, 'ad_storage')), `${browserName} analytics code does not overwrite advertising storage`);
      }
      results.push({
        browser: browserName,
        state: state.name,
        initialEvents: beforeChoice.map(request => ({ name: eventName(request), mode: eventMode(request), gcs: request.gcs || null })),
        totalInterceptedEvents: requests.length,
        interceptedPayloads: requests,
        limitedAnalyticsCookies: limitedCookieCount,
        finalEventCount: postChoiceEventCount,
        passed: true
      });
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, JSON.stringify({
  at: new Date().toISOString(),
  sdk: 'Google gtag public SDK',
  sdkSha256,
  collectorSha256: sourceSha256,
  collectionIntercepted: true,
  liveAnalyticsEventsSent: 0,
  customerSubmissions: 0,
  callsPlaced: 0,
  messagesSent: 0,
  cases: results.length,
  results
}, null, 2) + '\n');
console.log(JSON.stringify({ cases: results.length, passed: true, liveAnalyticsEventsSent: 0, output }));
