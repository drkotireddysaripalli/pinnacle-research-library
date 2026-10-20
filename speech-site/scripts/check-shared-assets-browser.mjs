import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium, firefox, webkit} from '@playwright/test';
import {assets, rewrites} from '../deployment/shared-assets-repair-assets.mjs';

const out = 'outputs/semrush-assets-20261012';
const origin = 'https://www.pinnacleblooms.org';
const callPath = '/pinnacle-pages-assets/google-ads-call-consent.FqeWzaS9.mjs';
const legacyPath = '/bundles/newmirracleportal?v=42';
await fs.mkdir(out, {recursive: true});

// Compare the reviewed automatic source with the deterministic minified asset
// that replaces the retired consent-gated URL in public HTML.
const call = await fs.readFile('src/lib/google-ads-call-consent.mjs', 'utf8');
const legacy = await fs.readFile('deployment/shared-asset-sources/newmirracleportal-v42.js', 'utf8');
const results = [];

for (const [engine, launcher] of Object.entries(process.platform === 'win32' ? {chromium} : {chromium, firefox, webkit})) {
  const browser = await launcher.launch({headless: true});
  try {
    for (const width of [390, 1440]) {
      const variants = [];
      for (const candidate of [false, true]) {
        const context = await browser.newContext({viewport: {width, height: 900}});
        const requests = [];
        const errors = [];
        const errorDetails = [];
        const script = candidate ? rewrites[callPath] : callPath;
        const classic = candidate ? rewrites[legacyPath] : legacyPath;
        const html = `<!doctype html><html><head><title>Isolated shared asset journey fixture</title><script>var newsId=null;</script></head><body><main><h1>Isolated enquiry fixture</h1><a id="central" href="tel:+919100181181">Call 9100 181 181</a><a id="branch" href="tel:+914012345678">Branch alternative</a><a id="enquiry" href="/enroll-autism-speech-aba-therapies-india?centre=suchitra&service=speech">Request a callback</a></main><script src="${classic}" defer></script><script src="${script}" type="module"></script></body></html>`;

        // The pinned legacy list consumer explicitly JSON.parse()s a text response.
        await context.route('**/*', async route => {
          const url = new URL(route.request().url());
          if (url.origin !== origin || url.pathname.startsWith('/api/')) {
            const type = route.request().resourceType();
            const legacyList = url.pathname === '/api/gl/getkvforwebsite';
            const json = url.pathname.startsWith('/api/') || ['fetch', 'xhr'].includes(type);
            requests.push({kind: url.pathname.startsWith('/api/') ? 'intercepted-intake' : 'intercepted-external', host: url.hostname, path: url.pathname, resourceType: type});
            return route.fulfill({status: 200, contentType: legacyList ? 'text/plain' : json ? 'application/json' : type === 'script' ? 'text/javascript' : 'text/plain', body: legacyList ? '[]' : json ? '{}' : ''});
          }
          if (url.pathname.startsWith('/top-speech-therapy-center-india-proven-improvement-rate') || url.pathname.startsWith('/enroll-autism-')) return route.fulfill({status: 200, contentType: 'text/html', body: html});
          if (['/pinnacle-pages-scripts/protection-consumer.mjs','/pinnacle-pages-scripts/cheq-protection.js'].includes(url.pathname)) return route.fulfill({status:200,contentType:'text/javascript',body:await fs.readFile('public'+url.pathname)});
          if (assets[url.pathname]) return route.fulfill({status: 200, contentType: 'text/javascript', body: assets[url.pathname].body});
          if (url.pathname === callPath) return route.fulfill({status: 200, contentType: 'text/javascript', body: call});
          if (url.pathname + url.search === legacyPath) return route.fulfill({status: 200, contentType: 'text/javascript', body: legacy});
          return route.fulfill({status: 200, contentType: 'application/json', body: '{}'});
        });

        const page = await context.newPage();
        page.on('pageerror', error => { errors.push(error.message); errorDetails.push({message: error.message, stack: error.stack}); });
        await page.goto(origin + '/top-speech-therapy-center-india-proven-improvement-rate');
        await page.waitForFunction(() => !!window.jQuery && window.__pinnacleAdCallMeasurement?.started === true);
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));

        const snapshot = async () => page.evaluate(() => ({
          jquery: window.jQuery.fn.jquery,
          central: document.querySelector('#central').getAttribute('href'),
          centralText: document.querySelector('#central').textContent,
          centralMarker: document.querySelector('#central').getAttribute('data-pinnacle-ad-call-target'),
          branch: document.querySelector('#branch').getAttribute('href'),
          choices: document.querySelectorAll('[data-ad-call-preferences],[data-ad-call-choice]').length,
          state: {...window.__pinnacleAdCallMeasurement},
          loader: document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').length,
          commands: Array.from(window.dataLayer || [], value => Array.from(value)).map(value => {
            if (value[0] === 'js') return [value[0], '<runtime-date>'];
            if (value[0] === 'config') return [value[0], value[1], {...value[2], phone_conversion_callback: typeof value[2]?.phone_conversion_callback}];
            return value;
          })
        }));

        const before = await snapshot();
        assert.equal(before.choices, 0, 'Automatic call measurement must have no visitor choice controls');
        assert.deepEqual(before.state, {enabled: true, started: true});
        assert.equal(before.central, 'tel:+919100181181');
        assert.equal(before.branch, 'tel:+914012345678');
        assert.equal(before.loader, 1);
        assert(before.commands.some(value => value[0] === 'config' && value[1] === 'AW-10810823199/VNUcCMSy3YobEJ-kgKMo'), 'Automatic call measurement must configure the reviewed action');
        assert(before.commands.some(value => value[0] === 'consent' && value[1] === 'update' && value[2]?.ad_storage === 'granted' && value[2]?.ad_user_data === 'granted' && value[2]?.ad_personalization === 'denied'), 'Automatic call consent state must be explicit');

        await page.evaluate(() => {
          const command = Array.from(window.dataLayer || [], value => Array.from(value)).find(value => value[0] === 'config');
          command[2].phone_conversion_callback('+1 202 555 0142', '+12025550142');
        });
        const replaced = await snapshot();
        assert.equal(replaced.central, 'tel:+12025550142');
        assert.equal(replaced.centralText, 'Call +1 202 555 0142');
        assert.equal(replaced.centralMarker, 'central');
        assert.equal(replaced.branch, 'tel:+914012345678');

        await page.screenshot({path: `${out}/${engine}-${width}-${candidate ? 'candidate' : 'source'}.png`});
        await page.locator('#enquiry').click();
        assert(page.url().includes('centre=suchitra&service=speech'));
        assert(!await page.evaluate(() => Array.from(window.dataLayer || []).some(value => value?.[0] === 'event' && value[1] === 'enquiry_accepted')));
        if (errors.length) await fs.writeFile(`${out}/fixture-failure.json`, JSON.stringify({engine, width, candidate, errorDetails, requests}, null, 2));
        assert.deepEqual(errors, [], 'Valid isolated API stubs must not cause unexpected page errors');
        variants.push({candidate, before, replaced, errors, requests});
        await context.close();
      }
      assert.deepEqual(variants[0].before, variants[1].before);
      assert.deepEqual(variants[0].replaced, variants[1].replaced);
      assert.deepEqual(variants[0].errors, variants[1].errors);
      results.push({engine, width, passed: true, scope: 'Reviewed automatic source versus deterministic minified call module; phone callback, branch number, enquiry navigation and no visitor choice UI', variants});
      console.log(JSON.stringify({engine, width, passed: true}));
    }
  } finally {
    await browser.close();
  }
}

await fs.writeFile(`${out}/browser-fixture.json`, JSON.stringify({results, realCalls: 0, realEnquiries: 0, externalAnalyticsAndIntakeIntercepted: true}, null, 2) + '\n');
