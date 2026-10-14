// Cloud execution controller. It never reads publisher, media or clinical data.
export const REPOSITORY = 'drkotireddysaripalli/pinnacle-research-library';
export const WORKFLOW = 'public-sitemap-upkeep.yml';
export const DAILY_CRON = '30 20 * * *'; // 02:00 Asia/Kolkata on the next day.
const IST_OFFSET_MS = 330 * 60 * 1000;
const TERMINAL = new Set(['runner_succeeded', 'runner_failed', 'configuration_blocked']);

export function dispatchIdentity(scheduledTime) {
  if (!Number.isSafeInteger(scheduledTime) || scheduledTime < 0) throw Error('Invalid native scheduled time');
  const date = new Date(scheduledTime + IST_OFFSET_MS).toISOString().slice(0, 10).replaceAll('-', '');
  return `daily-${date}`;
}

export function retryAfterMillis(header, now, fallback = 300000) {
  if (header && /^\d+$/.test(header)) return Math.max(1000, Number(header) * 1000);
  const date = header ? Date.parse(header) : NaN;
  return Number.isFinite(date) ? Math.max(1000, date - now) : fallback;
}

export class ScheduledController {
  constructor({ storage, token, configRevision = '1', fetcher = fetch, clock = Date.now }) {
    if (!storage?.get || !storage?.put || !storage?.delete) throw Error('Durable storage is required');
    this.storage = storage;
    this.token = token;
    this.configRevision = configRevision;
    this.fetcher = fetcher;
    this.clock = clock;
    this.serial = Promise.resolve();
  }

  trigger(event) {
    // One Durable Object instance plus this queue serialises operations across awaits.
    // Pending is persisted before any dispatch, so an isolate restart fails closed.
    const operation = this.serial.then(() => this.process(event));
    this.serial = operation.catch(() => {});
    return operation;
  }

  async api(method, path, body) {
    if (typeof this.token !== 'string' || !this.token.trim()) throw Error('Dedicated GitHub Actions credential is missing');
    return this.fetcher(`https://api.github.com/repos/${REPOSITORY}/actions/workflows/${WORKFLOW}${path}`, {
      method,
      headers: { Authorization: `Bearer ${this.token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json', 'User-Agent': 'PinnacleSitemapCloudScheduler' },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(8000),
    });
  }

  async save(record, active = false) {
    record.updatedAt = new Date(this.clock()).toISOString();
    await this.storage.put(`day:${record.id}`, record);
    if (active) await this.storage.put('active', record);
    return record;
  }

  async reconcile(record) {
    if (TERMINAL.has(record.phase)) return record;
    const query = new URLSearchParams({ event: 'workflow_dispatch', branch: 'main', per_page: '50', created: `>=${record.createdAt}` });
    const response = await this.api('GET', `/runs?${query}`);
    if (response.status !== 200) throw Error(`GitHub run reconciliation failed with HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.workflow_runs)) throw Error('Malformed GitHub workflow run response');
    const runs = data.workflow_runs.filter(r => r.display_title === `sitemap-${record.id}` && r.event === 'workflow_dispatch' && r.head_branch === 'main');
    if (runs.length > 1) {
      // Never silently pick one of two duplicate publication executions.
      record.phase = 'duplicate_runner_attention';
      record.duplicateRunIds = runs.map(r => r.id);
    } else if (runs.length === 1) {
      const run = runs[0];
      if (!Number.isSafeInteger(run.id) || run.id < 1) throw Error('Invalid GitHub workflow run identity');
      record.runId = run.id;
      record.runHead = run.head_sha;
      record.runStatus = run.status;
      record.runConclusion = run.conclusion;
      record.phase = run.status === 'completed' ? (run.conclusion === 'success' ? 'runner_succeeded' : 'runner_failed') : 'runner_active';
    } else {
      record.phase = record.phase === 'dispatched' ? 'dispatched' : 'dispatch_uncertain';
    }
    await this.save(record, !TERMINAL.has(record.phase));
    if (TERMINAL.has(record.phase)) await this.storage.delete('active');
    return record;
  }

  async process(event) {
    const id = dispatchIdentity(event.scheduledTime);
    if (typeof event.cron !== 'string' || event.cron.length > 80) throw Error('Invalid native cron expression');
    const key = `day:${id}`;
    let current = await this.storage.get(key);
    const active = await this.storage.get('active');
    if (active && active.id !== id) {
      const previous = await this.reconcile(active);
      if (!TERMINAL.has(previous.phase)) return { id, phase: 'previous_run_pending', previousId: previous.id, previousPhase: previous.phase };
    }
    if (current) {
      current.nativeInvocations = (current.nativeInvocations || 1) + 1;
      current.latestNativeScheduledTime = new Date(event.scheduledTime).toISOString();
      if (current.phase === 'configuration_blocked' && current.configRevision !== this.configRevision) {
        // The operator corrected a provider-rejected configuration. Its earlier
        // non-acceptance is known; a revision can safely resume today's job.
        current.configRevision = this.configRevision;
      } else if (current.phase === 'rate_limited' && this.clock() >= current.retryAt) {
        // HTTP 429 explicitly rejected the prior dispatch; retry only after its limit.
      } else {
        await this.save(current);
        if (['dispatched', 'dispatch_uncertain', 'runner_active', 'dispatch_pending'].includes(current.phase)) return this.reconcile(current);
        return current;
      }
    } else {
      current = { id, configRevision: this.configRevision, createdAt: new Date(this.clock() - 1000).toISOString(), firstNativeScheduledTime: new Date(event.scheduledTime).toISOString(), latestNativeScheduledTime: new Date(event.scheduledTime).toISOString(), cron: event.cron, nativeInvocations: 1, dispatchAttempts: 0 };
    }
    if (typeof this.token !== 'string' || !this.token.trim()) {
      current.phase = 'configuration_blocked';
      current.reason = 'Dedicated repository Actions credential is missing';
      return this.save(current);
    }
    current.phase = 'dispatch_pending';
    current.dispatchAttempts += 1;
    await this.save(current, true);
    let response;
    try {
      response = await this.api('POST', '/dispatches', { ref: 'main', inputs: { dispatch_id: id, scheduled_time: new Date(event.scheduledTime).toISOString() } });
    } catch {
      current.phase = 'dispatch_uncertain';
      current.reason = 'Dispatch transport outcome is unknown; reconcile provider state before retrying';
      return this.save(current, true);
    }
    current.dispatchHttpStatus = response.status;
    current.githubRequestId = response.headers.get('x-github-request-id');
    if (response.status === 204) {
      current.phase = 'dispatched';
      return this.save(current, true);
    }
    if (response.status === 429 || (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0')) {
      current.phase = 'rate_limited';
      const reset = Number(response.headers.get('x-ratelimit-reset')) * 1000;
      current.retryAt = Math.max(this.clock() + retryAfterMillis(response.headers.get('retry-after'), this.clock()), Number.isFinite(reset) ? reset : 0);
      await this.storage.delete('active');
      return this.save(current);
    }
    if ([400, 401, 403, 404, 422].includes(response.status)) {
      current.phase = 'configuration_blocked';
      current.reason = 'Provider rejected the repository/workflow/credential configuration';
      await this.storage.delete('active');
      return this.save(current);
    }
    current.phase = 'dispatch_uncertain';
    current.reason = 'Provider mutation outcome is unknown; reconcile before retrying';
    return this.save(current, true);
  }
}
