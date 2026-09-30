# Occupational Therapy life-first release — 30 September 2026

## Public destination

- Canonical: https://www.pinnacleblooms.org/best-occupational-therapy-center-india-proven-improvement-rate
- Existing `/occupational-therapy` and `/t/occupational-therapy` aliases still return 301 to that canonical.
- Main family action: `tel:+919100181181`; secondary actions lead to the centre directory, service-prefilled enrolment and exact Verify sources.

## What changed

- Rewrote the page around an everyday activity the family wants the child to join, followed by a first call, a relevant professional assessment, a shared goal, guided home practice and review. Five OT activity routes, a mealtime example and seven visible life-first stages now make the mechanism concrete without promising a particular outcome.
- Kept the 62-location directory as a published-centre finder, with a call to confirm current OT availability, professional, appointment and fees. It is not presented as a verified roster of OT staff.
- Added two family/activity scenes and reused the approved first-conversation and life-path artwork. The complete Pinnacle-branded 1200 × 630 social poster was generated with ChatGPT's built-in image tool in this Codex task, without an OpenAI API-key call. Its source, prompt and reviewed export are recorded in `ASSET-SOURCES.md` and `og-release-20260930/`.
- Updated page title, description, visible/source-matched eight FAQs, Open Graph/Twitter metadata, evidence JSON/text/Markdown, child sitemap and `llms.txt`. A fresh versioned social-image URL reduces reuse of the previous card by image caches.
- Tightened the **shared** mobile header: the helpline, Verify and Citations are readable at 320 px, and the full navigation opens from an accessible More control. The existing common footer and Verify gateway remain shared across managed pages.

## Evidence boundary

- The 31,052,382 figure is dated, defined **network service volume**; it is not an OT outcome count. The page does not use the held 97% claim.
- MD-5 and BIS support the printed scope of non-diagnostic PinnacleAI software, not OT centre licensing, therapist credentials or an individual result. External profession sources supply context, not an endorsement of Pinnacle.
- Growing self-sufficiency and mainstream participation remain the direction of work, not a guaranteed result. Free, staffed 24/7 guidance refers to the telephone, not therapy, appointments or toll-free calling.
- The owner-approved 4B wording in the shared header was not repeated as OT-body proof. Its source derivation and the long canonical's promotional wording remain separate review decisions.

## Verification and deployment

- Production build passed for 12 pages. The staged union preserved Verify's index and matched 634 Verify assets plus 822 managed assets to the Worker inventory. Dry run retained five additional modules, `ASSETS`, `PINNACLE_LEGACY`, `PINNACLE_ASK` and `run_worker_first: true`; deployment used no `--route` option.
- Cloudflare Worker `pinnacle-verify-route`: final version `83328294-bd66-44a4-ae6e-64acced0b29e`, deployment `b24e3f2b-a3e1-4440-b5c4-2c796290e090`, 100% traffic. Immediate rollback is v123 `d9274e62-0d98-4909-8118-2c22c1d2515b`; the pre-revision v122 is `e25e507a-97d1-49f9-9049-00b1df706b61`.
- The live canonical, two redirects, Verify, FSC, national helpline, root and child sitemaps, `llms.txt`, Markdown delivery and evidence exports returned the expected states. Managed HTML matched the staged build after normalising Cloudflare's analytics beacon.
- Chrome and Edge checks at 320, 390, 768, 1024 and 1440 px passed for horizontal overflow, required images, local anchors, phone link, 62 centre listings, eight visible/schema FAQs, seven stage labels, keyboard disclosure and the compact More menu. W3C Nu reported zero errors and zero warnings for the final live HTML.
- The public social image returned HTTP 200, JPEG, 155,793 bytes and SHA-256 `d6fce9fb1970e6f3d5628d980672c2ce20e813f5cbd7eaf899a83792eb439399`, matching the reviewed poster. Open Graph and Twitter reference the same fresh versioned URL.
- IndexNow accepted one notification for the materially changed canonical with HTTP 200 at 03:39 UTC. The later social URL correction did not trigger a redundant second notification.

## What this release does not establish

Publication and technical checks do not prove Google indexing of the revised copy, ranking, AI citation, social-platform cache refresh, connected calls, walk-ins or enrolment. Safari/iOS and field Core Web Vitals were not measured here. Current centre-by-centre OT staffing, fees and a named clinical sign-off remain operational review items; the public page asks families to confirm those details on the call.
