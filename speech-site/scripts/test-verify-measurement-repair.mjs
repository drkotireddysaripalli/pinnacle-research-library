import test from 'node:test';
import assert from 'node:assert/strict';
import {projectVerifyMeasurementHtml, repairVerifyMeasurement, VERIFY_MEASUREMENT_READER} from '../deployment/verify-measurement-handler.mjs';

const oldChoice = '<footer><button type="button" data-analytics-settings hidden>Analytics choices</button></footer><aside class="analytics-choice" hidden><button data-analytics-choice="accepted">Allow</button><button data-analytics-choice="declined">No</button></aside><p class="analytics-choice-status visually-hidden"></p>';
const oldReader = '<script defer src="/verify/_assets/reader-extras.9c5444bd34caead9.js"></script>';

test('all public Verify HTML loses legacy choices and receives one automatic reader', () => {
  const output = projectVerifyMeasurementHtml('/verify/evidence/records/md5.html', `<html><head>${oldReader}</head><body>${oldChoice}</body></html>`);
  for (const token of ['analytics-choice', 'data-analytics-choice', 'data-analytics-settings', 'reader-extras.9c5444bd34caead9.js']) assert.equal(output.includes(token), false, token);
  assert.equal((output.match(/module=verify-reader&v=4/g) || []).length, 1);
  assert(output.includes(VERIFY_MEASUREMENT_READER));
});

test('the Verify privacy route serves the current automatic-measurement policy', () => {
  const output = projectVerifyMeasurementHtml('/verify/evidence/privacy.html', '<html>obsolete optional policy</html>');
  assert.match(output, /The Google tag starts automatically on production Verify pages\./);
  assert.match(output, /does not display or store an analytics acceptance or refusal/);
  assert.doesNotMatch(output, /Change analytics choice|data-analytics-settings|class="analytics-choice"/);
  assert.equal((output.match(/module=verify-reader&v=4/g) || []).length, 1);
});

test('response repair is bounded to eligible public Verify HTML and clears stale validators', async () => {
  const request = new Request('https://www.pinnacleblooms.org/verify/evidence/records/md5.html?gclid=fixture');
  const repaired = await repairVerifyMeasurement(request, new Response(`<html><head>${oldReader}</head><body>${oldChoice}</body></html>`, {headers: {'content-type': 'text/html; charset=utf-8', etag: 'old', 'content-length': '999'}}));
  assert.equal(repaired.headers.get('x-pinnacle-verify-measurement'), 'automatic-20261019');
  assert.equal(repaired.headers.has('etag'), false);
  assert.equal(repaired.headers.has('content-length'), false);
  assert.doesNotMatch(await repaired.text(), /analytics-choice|data-analytics-settings/);
  const untouched = new Response('plain', {headers: {'content-type': 'text/plain'}});
  assert.equal(await repairVerifyMeasurement(new Request('https://www.pinnacleblooms.org/verify/llms.txt'), untouched), untouched);
});
