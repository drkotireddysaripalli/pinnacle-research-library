# Shared Google tag response-policy repair — 18 October 2026

## Delivered

The existing response policy blocked the installed Google Tag Manager image origin. Current GET responses reproduced the omission on Speech, Enrolment and Suchitra. PR116 adds only `https://www.googletagmanager.com` to the existing shared `img-src` augmentation. It adds no vendor, script, event, consent permission, advertising goal or intake.

- PR: https://github.com/drkotireddysaripalli/pinnacle-research-library/pull/116
- Source: `693bebee37ed6e3c942a6796bfb79ffbd4c70c10`; merge `be708aac599cfa335c323de41926da6fe68ec850`.
- Trusted exact-source CI: `39115222400`, successful.
- Worker: `pinnacle-verify-route`; serving version `2e5bd347-2fa9-4a5b-a023-c1e6ddd9ebb3`.
- Deployment: `b000a595-6067-4ea1-ae8e-22cfaeec67f5`, 2026-10-18T09:27:02Z.
- Runtime rollback: `0e26b810-8ebc-452c-a012-1902f22fee97`.

Release owner: the existing website thread, acting on the founder's request to complete the website GA4 journey and repair test failures. The Ads coordinator did not grant a separate approval from its lane. Further Ads/protection changes remain with their existing owners.

## Verification and preservation

29 focused checks and14 actual captured-module/local Chrome checks passed. The latter verified unchanged response bodies and call links, the exact one-origin header delta, and a browser fixture in which the former policy blocked the image and the repaired policy permitted it. External Google requests were intercepted; no intake or call was created. Google documents the CSP requirement in its [tag-platform guidance](https://developers.google.com/tag-platform/security/guides/csp?hl=en).

The 74-route public readback found71 HTML responses explicitly containing the repaired image origin. The homepage returned200 without a CSP header, so it was not blocked by this directive. One existing redirect was retained. The remaining `/about-us`404 was repaired separately through one exact Cloudflare rule, with8/8 affected HTTP checks; see `reviews/ABOUT-US-ALIAS-20261018.md`.

All66 other root modules,3,972 assets,403 Worker route mappings and the other9 protected Workers/settings/bindings were preserved. Private receiver `e3cd08a4-de59-4bba-b722-ddc59d15b142`, current GTM8 and the64,407-byte common measurement collector were unchanged. The accepted cloud runtime checkpoint was advanced and read back; no new source inventory or scheduler was created.

Private evidence: `ask-private/ga4-completion-20261018/` contains the actual serving captures, `csp-proof.json`, `delivery.json`, `release.json`, `public-last.json`, exact CI records and accepted checkpoint readback. Initial CI dependency-closure failure and propagation assertions remain in their original logs; they are not relabelled as passes.

## Business acceptance stays separate

This release verifies the response-policy correction. It does not establish that Google's diagnostic has refreshed, ClickGuard exclusions were delivered, GA4 received an accepted enquiry, an actual caller connected, or the receiving team acknowledged a family. The existing GA4 and operational owners retain those distinct receipts. Known QA-containment uncertainty remains recorded and further production QA transport remains suspended; the release does not backfill or manufacture conversions.

The unchanged common collector already permits a minimal `enquiry_accepted` event with analytics storage denied for an undecided visitor, only after the existing form returns a matching durable receipt. Explicit refusal or GPC stops that Google event. A permitted consented journey can carry its validated campaign fields. Reloading an accepted receipt does not emit it again. Thus an empty aggregate report is not evidence that every accepted enquiry was blocked by an undecided analytics choice; the actual record's event-time eligibility and transport remain to be established.

For the one protected17October record, the existing case owner attested intake/person/staff linkage. Genuine versus QA classification, immutable emission time, measurement eligibility and receiving acknowledgement remain unknown. Two bounded GA4 reports for17–18October returned no accepted-event rows, including a diagnostic without optional-field exclusions. No more unchanged queries are planned. The existing receiver dispatches through its Telegram/WATI path; an inactive Slack candidate is not treated as deployed. The concrete Care acknowledgement request is prepared privately and remains unsent pending the founder's exact message approval.
