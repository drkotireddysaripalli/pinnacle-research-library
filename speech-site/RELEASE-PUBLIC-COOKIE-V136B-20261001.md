# Public-page cookie routing correction — v136b

1 October 2026 · Prepared; production read-back pending

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

Production and actual-browser verification will be appended after deployment.
