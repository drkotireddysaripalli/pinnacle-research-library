# Public-page cookie routing correction — v136b

1 October 2026 · Published, verified and source pushed

## Reproduced defect

The actual Chrome profile opened the old About page at the correct released canonical. All 48 anonymous public HTML reads matched the V136 asset union, but the managed document cookie gate returned to the legacy origin when `_gcl_au` or `__Host-appgarden-visitor` was present. The same gate covered the new institutional, life-outcome, policy and nine centre presentations. The observed cookie names were inspected without recording their values; the visitor cookie's issuer or authentication meaning is not asserted.

## Correction

The common `deployment/speech-handler.mjs` now recognises those two observed cookie names on the existing exact public-page routes. Visitor-cookie presentations use `private, no-store` and return a complete current response instead of a conditional 304. Visitor credentials, cookie values and advertising identifiers never reach the static asset request. Unknown/session cookies, Authorization, adjacent/private paths, range/no-transform and application methods retain the existing origin handling.

The source navigation audit found no old equivalents in the links to released destinations and all 44 managed-page fragments exist. No header/footer destinations, page narrative, assets, canonicals or sitemap content changed. Header and footer remain common components across the 48 released pages. Unrebuilt destinations remain the original site.

## Preflight and release

- 118 focused public-document, therapy, centre and discovery checks passed, including returning-visitor GET, HEAD and Markdown on all 19 public documents and a mixed session-cookie guard.
- Reuse the complete validated V136 asset union as `release-public-cookie-v136b-20261001`; this is a handler-only repair, so no content rebuild or image generation is needed.
- Six-module Wrangler dry run passed with 1,933 asset files. Deploy from `.worker-upload-public-cookie-v136b-20261001/wrangler.jsonc` without a route override.
- All 174 route assignments and four bindings match the current baseline. No trigger changes are needed.
- Rollback: restore Worker `fc9c7698-890d-4026-93b2-7efe5f153f60` at 100%; retain all route assignments and assets.
- No unchanged URL resubmission to IndexNow or search consoles.

## Production result

Source `a17723c` was pushed before Worker `36c56835-166a-44d4-a750-7943328020a5` reached 100% in deployment `db03ca9f-19a9-4a9b-979f-ca66dcb97833` at 2026-09-30T23:59:56.617699Z (1 October, 05:29 IST). All 174 route assignments and all four bindings are unchanged. Wrangler reported no updated assets to upload.

All 48 released HTML pages matched the accepted V136 bytes with the reproduced cookie-name combination, including the common header and Verify inside the common footer. Five representative public documents also passed visitor-cookie HEAD, Markdown and query-preserving alias checks. Nineteen protected controls match the prior receipt; only the already documented dynamic ePASS timestamp is normalised. Live receipt: `deployment/public-cookie-live-v136b-20261001.json`; configuration receipt: `deployment/public-cookie-cloudflare-after-v136b-20261001.json`.

The same existing Chrome profile that initially showed legacy About now displays current About, Self-Sufficient and Leadership. The Self-Sufficient link initially reused an older browser-cached not-found page; a normal refresh fetched the correct released page. Leadership was reached through the common menu and showed its current title, H1, header and Verify footer. A saved anonymous/read-only check is not a substitute for a returning browser check; this regression is now part of the reusable page release work order.

No content, image, shared navigation, API or discovery submission changed. Page counts remain 48 managed presentations and 19 of 60 linked work items released, with 41 remaining. The unrelated pending destinations retain their existing source/operational conditions.
