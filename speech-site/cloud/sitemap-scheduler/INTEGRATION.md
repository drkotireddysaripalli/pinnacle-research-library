# Cloud sitemap scheduler integration contract

The scheduler runs on Cloudflare. The existing Python/Node publisher runs in
GitHub-hosted Linux Actions. Neither stage needs an awake or signed-in PC.
This component only controls dispatch; its tests do not prove production
source refresh, search submissions, publication or a real scheduled event.

## Required runner contract

- Workflow `.github/workflows/public-sitemap-upkeep.yml` on `main`.
- `workflow_dispatch` string inputs `dispatch_id` and `scheduled_time`.
- `run-name: sitemap-${{ inputs.dispatch_id }}`. This exact run name lets the
  controller reconcile a lost dispatch response against native provider data.
- One Actions concurrency group for all public-source upkeep runs. Disable
  the superseded Windows timer after cloud proof. In cloud mode, the local
  post-build hook must enqueue this same workflow and never publish locally.
- Persist private source/R2 checkpoints and publication/submission receipts in
  a private store, with durable dispatch-id deduplication. An uncertain dispatch
  is not re-posted automatically. Correct an unresolved provider ambiguity
  before resuming it. Known HTTP 429 rejection respects Retry-After/reset.
  Durable Object alarms resume explicit rate-limit delays and collect runner
  outcomes; they preserve the original native cron timestamp. Provider reads
  are bounded to 50 and dispatch attempts to three per daily identity.
- A Linux runner succeeds only after complete qualified source/R2 reconciliation,
  valid generation, source-matched tests, guarded publication or verified
  unchanged output, public readback, durable submission-outbox drain and
  checkpoint persistence. No interactive desktop dependencies or model calls.
- Submit genuine changed/added public eligible page URLs and verified retirements
  with IndexNow. Group by host and verify each host's published key. Preserve
  Google/Bing registrations; detect root graph changes from all child hashes.
  Use supported durable search credentials when available. Do not use Google's
  general-page Indexing API, retired sitemap ping, or an interactive MCP token.
- Never put credentials or clinical/private records in the public repository,
  workflow logs or public R2 prefixes. Keep incomplete source reads and uncertain
  publication state from replacing the last verified public release.

## Provider configuration and access

`wrangler.jsonc` declares the daily `30 20 * * *` UTC schedule (02:00 IST),
one SQLite-backed Durable Object and no public HTTP route. Set the real
Cloudflare account explicitly during integration, preserving unrelated Workers.

Prefer a repository-scoped GitHub App installation: set `GITHUB_APP_ID` and
`GITHUB_APP_INSTALLATION_ID` as variables and `GITHUB_APP_PRIVATE_KEY` as a
Cloudflare secret. The controller signs its App JWT locally and requests only
Actions write (including read) on this one repository, caches each short-lived
installation token until one minute before expiry, then renews it unattended.
GitHub-generated PKCS#1 and PKCS#8 RSA keys are supported. It needs no contents,
issues, organisation or clinical-data access.

An already authorized dedicated `GITHUB_DISPATCH_TOKEN` is also supported;
its provider expiry/rotation must be managed explicitly. Installation tokens
must not be saved as a fixed forever credential because they expire.
Never transfer a desktop or connector session token as a substitute. Install it
as a Cloudflare secret using the authorized credential setup, without logging it.
After correcting a known-rejected configuration, increment
`SCHEDULE_CONFIG_REVISION` to resume today's rejected dispatch safely.

The publishing runner needs separate properly scoped publishing/store access.
Its exact credential permissions and private state location belong to the
production owner's integration packet. Creating new security-sensitive access
requires the applicable action-time confirmation; absence of credentials does
not authorise bypassing that gate or claiming deployment.

## Verification

Run `node --test *.test.mjs` and the production owner's Wrangler dry-run.
After deployment, read back the provider's Worker version, bindings and daily
schedule. To verify without waiting until tomorrow, temporarily install a short
validation cron. All invocations on one IST day deduplicate to one dispatch.
Capture a real provider scheduled event linked to the completed native Actions
run and its final source/public/submission receipts, then restore the daily
configuration and read it back. Do not claim scheduled proof from a manual HTTP
call, local Wrangler simulation or a GitHub-only manual dispatch.
