import { DurableObject } from 'cloudflare:workers';
import { ScheduledController } from './controller.mjs';
import { schedulerCredential } from './github-app.mjs';

export class SitemapScheduleLedger extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.controller = new ScheduledController({ storage: ctx.storage, token: schedulerCredential(env), configRevision: env.SCHEDULE_CONFIG_REVISION });
  }
  async trigger(event) { return this.controller.trigger(event); }
  async alarm() {
    const receipt = await this.controller.resume();
    console.log(JSON.stringify({ event: 'pinnacle_sitemap_provider_reconciliation', ...receipt }));
  }
}

export default {
  async fetch() {
    // No HTTP endpoint can trigger, mutate or read the private schedule ledger.
    return new Response('Not found', { status: 404, headers: { 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store' } });
  },
  async scheduled(controller, env) {
    const ledger = env.SCHEDULE_LEDGER.get(env.SCHEDULE_LEDGER.idFromName('pinnacle-sitemap-publication'));
    const receipt = await ledger.trigger({ scheduledTime: controller.scheduledTime, cron: controller.cron });
    console.log(JSON.stringify({ event: 'pinnacle_sitemap_native_schedule', ...receipt }));
    if (!['dispatched', 'runner_active', 'runner_succeeded', 'rate_limited', 'previous_run_pending'].includes(receipt.phase)) throw Error('Cloud sitemap dispatch requires reconciliation; inspect the native receipt');
  },
};
