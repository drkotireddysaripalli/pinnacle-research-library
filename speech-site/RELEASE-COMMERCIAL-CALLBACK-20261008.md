# Shared commercial callback — 8 October 2026

## Result and scope

Give parents a short, usable callback form on the existing commercial landing page. Name and mobile number are required; service and centre are visible and editable, and email/note remain optional. Calling 9100 181 181 remains immediately available. An enquiry is distinct from a confirmed appointment.

The shared component covers 59 domestic centre detail pages, the centre directory and `/speech-therapy/service-information`. The enrolment page receives the same revised client. Suchitra's separate component, international and location-status variants are excluded from this callback cohort; their existing enquiry journeys remain. The exact 62 changed HTML URLs are in `ask-private/commercial-callback-20261008/html-paths.json`.

The established `/api/enrolment` contract remains responsible for durable acceptance, request IDs, deduplication and uncertain outcomes. This change preserves consent-dependent measurement and adds inline accepted-receipt coverage, reload protection and approved call placements. A fresh speech information visit maps to the existing coarse Speech attribution family. No receiver/database migration or customer test submission is required.

## Verification before release

- Production Astro build completed.
- 64 focused enquiry/measurement checks passed.
- 28 unique browser cases passed across Chromium phone 390, tablet 768, desktop 1440 and WebKit phone emulation. Twelve layout cases were rerun after correcting a test selector that also matched a hidden fallback link; this is not 40 unique cases.
- Browser receiver responses were intercepted. No customer enquiries, calls, OTPs, registrations or real conversion records were created.
- Centre phone, Speech tablet and directory desktop captures were reviewed. Physical keyboard/submit reachability remains a required targeted post-release check.
- Existing receiver acceptance/database evidence is reused from `ENQUIRY-SOURCE-RELEASE-20261008.md`.

## Release state

Deployed and publicly verified at source `3502d5b1df058dd3703fa1c2001cf4fc0f6cdf43`, Portal version `d358f2f7-7624-4a9c-8e57-4b705dab5cf8`, deployment `63bbac45-2b65-46b6-8fef-1a3940463a8f`. The release retains all 260 routes, 45 modules and 3,690 prior assets; it changes 71 assets and adds six, for 3,696 total. Only the shared route, enrolment assets and autism/centre assets modules change. Seven protected services retain their versions and bindings. Rollback: `d347b65a-404f-44cb-bc02-f5d7b8d8d9d5`.

Exact-source CI and five TestingBot BVT cases passed. All 62 HTMLs and both public client hashes matched the release. Six physical functional cases passed on iPhone 13/iOS 18.5/Safari and Galaxy S24/Android 14/Chrome for centre, Speech and directory. Android showed a reduced keyboard viewport and reachable submit control; iOS demonstrated focus and reachability without a recorded reduced keyboard viewport. Provider network was not throttled. This is not visual-reference approval or field performance.

Simulated mobile Lighthouse: Speech Performance 100, LCP 1.52 seconds; Guntur Performance 97, LCP 2.29 seconds. Both Accessibility/Best Practices/SEO 100, CLS 0, TBT 0. These are two lab samples, not field p75 or estate-wide scores. Evidence: `deployment/callback-public-readback-20261008.json`, `deployment/callback-physical-20261008/summary.json`, `deployment/callback-speed-20261008/summary.json`.

Operational forwarding, qualified calls, CRM appointment/attendance/admission joins, account-side conversion selection, paid-destination mapping and field Core Web Vitals remain separate acceptance milestones. This release does not prove lead growth, indexing or improved Ads landing-page experience.

Owner: this website chat. Next release extends the shared callback to OT/ABA/autism and fixes immediate denied-storage accepted-event transport for undecided visitors. This first callback release's optional-consent gate is superseded only when that next release is verified live. Existing growth schedulers remain stopped.
