# Google Ads call-measurement wrapper — consent correction

This existing Worker wraps five selected page routes and serves one bootstrap path. It is separate from the Astro/Verify Worker. The recovered original source is retained verbatim for comparison; the live rollback version is `462c081d-2f41-4f47-9467-c6321f2cd540` (deployment `868439d1-9ca3-49c6-a51b-cfffc6c3380a`).

`index.mjs` contains the bounded v2 correction: queue denied advertising/analytics defaults before loading Google; retain generic cookieless Ads configuration; respect Global Privacy Control; remove the phone-conversion configuration pending an independent advertising-measurement choice. Do not treat the existing **Allow analytics** control as advertising permission. Cache-bust the same bootstrap pathname using `?v=2`.

Google documents Phone Call Conversions as not yet supporting Consent Mode. A denied default alone does not establish that the helper respects the choice. Actual telephone actions, the existing consent-gated coarse call-click analytics, Verify mobile CTA, service binding and all routes remain intact. No promise of Ads-attributed connected calls is made during this hold.

Sources reviewed 1 October 2026:
- https://developers.google.com/tag-platform/security/concepts/consent-mode
- https://developers.google.com/tag-platform/security/guides/consent

## Release procedure

Use Cloudflare Worker Versions upload, then an explicit 100% deployment only after verifying the current predecessor. Metadata: main_module `index.mjs`; compatibility_date `2026-09-18`; usage_model `standard`; binding `{type: service, name: PINNACLE_VERIFY, service: pinnacle-verify-route, environment: production}`. Do not alter route assignments or use a narrow `--route` override. Preserve the original source/binding and live rollback version.

Checks: `node --test scripts/test-ads-consent-wrapper.mjs`; `node scripts/validate-ads-consent-wrapper.mjs --candidate`, then once without `--candidate` after activation. Check all five measured page representations/CTA and six existing route assignments. Keep generated browser receipts, source commit and deployment IDs in the release ledger.

Restoring the phone-conversion helper requires an explicit advertising-measurement choice with withdrawal behavior. A later common consent UI change must be made in the common component and released consistently, separately from this correction.
