import test from 'node:test';
import assert from 'node:assert/strict';
import { ScheduledController, dispatchIdentity, retryAfterMillis } from './controller.mjs';

const T = Date.parse('2026-10-14T04:40:00Z');
const event = { scheduledTime: T, cron: '* * * * *' };
class Store {
  constructor() { this.data = new Map(); }
  async get(key) { return structuredClone(this.data.get(key)); }
  async put(key, value) { this.data.set(key, structuredClone(value)); }
  async delete(key) { return this.data.delete(key); }
}
function setup(reply = () => new Response(null, { status: 204 })) {
  const storage = new Store(), calls = [];
  let now = T;
  const fetcher = async (url, init) => { calls.push({ url, method: init.method, body: init.body }); return reply(url, init); };
  const controller = new ScheduledController({ storage, token: 'unit-test-placeholder', fetcher, clock: () => now });
  return { controller, storage, calls, advance(ms) { now += ms; } };
}
function runs(values = []) { return Response.json({ workflow_runs: values }); }
function run(id, status, conclusion = null) { return { id, display_title: 'sitemap-daily-20261014', event: 'workflow_dispatch', head_branch: 'main', head_sha: 'a'.repeat(40), status, conclusion }; }

test('native 20:30 UTC belongs to the following IST day', () => {
  assert.equal(dispatchIdentity(Date.parse('2026-10-13T18:29:59Z')), 'daily-20261013');
  assert.equal(dispatchIdentity(Date.parse('2026-10-13T18:30:00Z')), 'daily-20261014');
  assert.equal(dispatchIdentity(Date.parse('2026-10-13T20:30:00Z')), 'daily-20261014');
  assert.equal(dispatchIdentity(T), 'daily-20261014');
  assert.throws(() => dispatchIdentity(NaN));
});

test('only the fixed main workflow receives the stable scheduled identity', async () => {
  const s = setup();
  const result = await s.controller.trigger(event);
  assert.equal(result.phase, 'dispatched');
  assert.equal(s.calls.length, 1);
  assert.match(s.calls[0].url, /pinnacle-research-library\/actions\/workflows\/public-sitemap-upkeep.yml\/dispatches$/);
  assert.deepEqual(JSON.parse(s.calls[0].body), { ref: 'main', inputs: { dispatch_id: 'daily-20261014', scheduled_time: '2026-10-14T04:40:00.000Z' } });
});

test('concurrent cron deliveries dispatch once and reconcile thereafter', async () => {
  const s = setup((_, init) => init.method === 'POST' ? new Response(null, { status: 204 }) : runs([run(120, 'in_progress')]));
  const [first, second] = await Promise.all([s.controller.trigger(event), s.controller.trigger(event)]);
  assert.equal(first.phase, 'dispatched');
  assert.equal(second.phase, 'runner_active');
  assert.equal(s.calls.filter(c => c.method === 'POST').length, 1);
  assert.equal(second.nativeInvocations, 2);
});

test('an isolate restart reconciles a dispatch persisted before a crash', async () => {
  const s = setup();
  await s.storage.put('day:daily-20261014', { id: 'daily-20261014', phase: 'dispatch_pending', createdAt: '2026-10-14T04:39:59Z', nativeInvocations: 1 });
  const c = new ScheduledController({ storage: s.storage, token: 'unit-test-placeholder', clock: () => T, fetcher: async (_, init) => { assert.equal(init.method, 'GET'); return runs([run(121, 'queued')]); } });
  assert.equal((await c.trigger(event)).runId, 121);
});

test('uncertain transport never retries a possibly accepted mutation blindly', async () => {
  const s = setup((_, init) => { if (init.method === 'POST') throw Error('transport: unit-test-placeholder'); return runs(); });
  assert.equal((await s.controller.trigger(event)).phase, 'dispatch_uncertain');
  assert.equal((await s.controller.trigger(event)).phase, 'dispatch_uncertain');
  assert.equal(s.calls.filter(c => c.method === 'POST').length, 1);
  assert(!JSON.stringify([...s.storage.data.values()]).includes('unit-test-placeholder'));
});

test('completed provider run is tracked without calling it public SEO verification', async () => {
  const s = setup((_, init) => init.method === 'POST' ? new Response(null, { status: 204 }) : runs([run(122, 'completed', 'success')]));
  await s.controller.trigger(event);
  const result = await s.controller.trigger(event);
  assert.equal(result.phase, 'runner_succeeded');
  assert.equal(await s.storage.get('active'), undefined);
  const count = s.calls.length;
  await s.controller.trigger(event);
  assert.equal(s.calls.length, count);
});

test('an existing active prior-day run prevents a second publication dispatch', async () => {
  const s = setup((_, init) => init.method === 'POST' ? new Response(null, { status: 204 }) : runs([run(123, 'in_progress')]));
  await s.controller.trigger(event);
  const result = await s.controller.trigger({ ...event, scheduledTime: T + 86400000 });
  assert.equal(result.phase, 'previous_run_pending');
  assert.equal(s.calls.filter(c => c.method === 'POST').length, 1);
});

test('known failed prior-day run permits the next scheduled recovery job', async () => {
  const s = setup((_, init) => init.method === 'POST' ? new Response(null, { status: 204 }) : runs([run(124, 'completed', 'failure')]));
  await s.controller.trigger(event);
  const result = await s.controller.trigger({ ...event, scheduledTime: T + 86400000 });
  assert.equal(result.id, 'daily-20261015');
  assert.equal(result.phase, 'dispatched');
  assert.equal(s.calls.filter(c => c.method === 'POST').length, 2);
});

test('multiple matching runner identities cause attention rather than arbitrary acceptance', async () => {
  const s = setup((_, init) => init.method === 'POST' ? new Response(null, { status: 204 }) : runs([run(125, 'completed', 'success'), run(126, 'in_progress')]));
  await s.controller.trigger(event);
  assert.equal((await s.controller.trigger(event)).phase, 'duplicate_runner_attention');
  assert.equal(s.calls.filter(c => c.method === 'POST').length, 1);
});

test('rate-limit rejection resumes only after the provider retry interval', async () => {
  let posts = 0;
  const s = setup((_, init) => {
    assert.equal(init.method, 'POST');
    return ++posts === 1 ? new Response(null, { status: 429, headers: { 'Retry-After': '120' } }) : new Response(null, { status: 204 });
  });
  assert.equal((await s.controller.trigger(event)).phase, 'rate_limited');
  await s.controller.trigger(event);
  assert.equal(posts, 1);
  s.advance(120001);
  assert.equal((await s.controller.trigger(event)).phase, 'dispatched');
  assert.equal(posts, 2);
});

test('403 rate-limit rejection uses reset and retry-after rather than treating it as auth', async () => {
  const s = setup(() => new Response(null, { status: 403, headers: { 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': String((T + 600000) / 1000), 'Retry-After': '60' } }));
  const result = await s.controller.trigger(event);
  assert.equal(result.phase, 'rate_limited');
  assert.equal(result.retryAt, T + 600000);
});

test('provider rejection is retried only after a corrected configuration revision', async () => {
  const s = setup(() => new Response(null, { status: 401 }));
  assert.equal((await s.controller.trigger(event)).phase, 'configuration_blocked');
  await s.controller.trigger(event);
  assert.equal(s.calls.length, 1);
  s.controller.configRevision = '2';
  s.controller.fetcher = async () => new Response(null, { status: 204 });
  assert.equal((await s.controller.trigger(event)).phase, 'dispatched');
});

test('missing credential fails closed without an outbound request', async () => {
  const s = setup();
  s.controller.token = undefined;
  assert.equal((await s.controller.trigger(event)).phase, 'configuration_blocked');
  assert.equal(s.calls.length, 0);
});

test('unrelated and wrong-branch workflow successes never resolve this dispatch', async () => {
  const wrongName = { ...run(127, 'completed', 'success'), display_title: 'another workflow' };
  const wrongBranch = { ...run(128, 'completed', 'success'), head_branch: 'feature' };
  const s = setup((_, init) => init.method === 'POST' ? new Response(null, { status: 204 }) : runs([wrongName, wrongBranch]));
  await s.controller.trigger(event);
  assert.equal((await s.controller.trigger(event)).phase, 'dispatched');
});

test('malformed provider read cannot silently release the publication guard', async () => {
  const s = setup((_, init) => init.method === 'POST' ? new Response(null, { status: 204 }) : Response.json({ unexpected: [] }));
  await s.controller.trigger(event);
  await assert.rejects(s.controller.trigger(event), /Malformed/);
  assert.equal((await s.storage.get('active')).id, 'daily-20261014');
});

test('retry-after supports HTTP dates', () => {
  assert.equal(retryAfterMillis(new Date(T + 60000).toUTCString(), T), 60000);
  assert.equal(retryAfterMillis('invalid', T), 300000);
});
