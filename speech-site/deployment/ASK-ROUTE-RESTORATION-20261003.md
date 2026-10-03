# Ask host-route restoration — 3 October 2026

## Result

The separately hosted Ask application is accessible at both `https://pinnacleblooms.org/ask` and `https://www.pinnacleblooms.org/ask`. The www URL now returns the existing 308 redirect to the same apex path and query string. The apex remains the canonical host and continues to run through `pinnacle-ask` with its existing Supabase connection.

## Exact defect and repair

Before this repair the apex returned the Ask home page, while www returned the legacy site's 404. The live portal Worker already contained the correct GET/HEAD redirect. The Cloudflare zone lacked a route assigning www `/ask` requests to that Worker.

- Added `www.pinnacleblooms.org/ask*` → `pinnacle-verify-route`.
- New route ID: `2d92e6f6e7e04a389f82dfc76be7bcc8`.
- Preserved all 184 existing routes, including apex `pinnacleblooms.org/ask*` → `pinnacle-ask`.
- Portal Worker remains `3d088473-f2d9-4906-8460-6a0f24e0d1dc`; Ask remains `5dfcafb0-38fb-4751-87f4-87e7423cc4bd`, both at 100%.
- No application build, Worker upload, shared header/footer change, database migration, credential change or database write occurred.

This is a route-only publication. A stale portal asset bundle was not rebuilt or deployed over newer production work. The saved 2 October V164 snapshot also lacked the www route; the evidence does not establish that a later legacy migration removed it.

## Verification

`scripts/verify-ask-routing.mjs` recorded 19 passing production checks:

- www → apex, then HTTP 200 for the home page, trailing slash, search page, an AbilityScore answer, Autism topic, Telugu entry, sitemap, script and logo.
- HEAD and exact query preservation, including percent encoding; cookie-bearing request.
- Unchanged production bytes for Verify, PinnacleAI, Speech Therapy and enrolment.
- Adjacent `/asked` remains a legacy 404 rather than being redirected into Ask.

The existing Supabase `ask_answer` read returned HTTP 200 and the requested published AbilityScore article. Only the result field names and success receipt are saved; no keys or answer corpus are committed. Browser navigation through www visibly reaches the original Ask home page.

The release guard now requires both Ask host routes, so a future missing assignment fails a release check. The restoration script is idempotent and checks the deployed redirect source before adding the route. It checks that other routes, Worker versions and binding definitions remain unchanged.

## Separate existing limitation discovered

The search form submits `q` to `/ask/search`, but the current Ask Worker renders a static search landing page and does not consume `q`. A browser submission for `speech delay` returned the same landing content, without query results. Source inspection confirmed `R.kind === "search"` calls `searchPage(ctx)` and contains no `searchParams.get("q")` lookup. Therefore routing and database-backed article delivery are restored/verified; free-text search is **not** certified functional. This behavior predates this route-only repair. Retain it as an explicit functional item for the separate Ask application/migration; do not hide it behind HTTP 200 tests.

## Receipts and rollback

- `ask-route-restoration-20261003.json`: before/after route and Worker snapshots; sole added route.
- `ask-route-live-20261003.json`: 19 checks.
- `ask-supabase-read-20261003.json`: real public-answer read.
- `ask-route-live-code-proof-20261003.json`: existing deployed redirect proof.
- `ask-route-before-20261003.json`, `ask-route-after-20261003.json`: release guard snapshots.

To undo only this restoration, remove the newly added route ID above. Preserve the apex route and both existing Worker deployments. Removing it reinstates the www failure; no rollback is currently indicated.

## PinnacleAI design hold

Await the owner's block diagram before developing the scholarly block. Exact title: **PinnacleAI® for Scholars**. Exact subtitle: **4Billion Clinical Data Points Distilled**. Population Scale and Sovereign Grade remain separate blocks. No Figma or page-narrative edits belong to this repair.
