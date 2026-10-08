# Five mobile destinations and Materials image transport — 8 October 2026

Completed source `dcaf6eeb7a91413d79b8fd0fa5f3a61ef75773db`; exact-source [Portal quality run 37800612998](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37800612998) passed, including the existing TestingBot build gate. Nine focused recovery/media tests passed before that build. This is a bounded availability and image repair, not a new page design or a full-site acceptance.

## Delivered public behaviour

Each of these reproduced HTTP 500 with a mobile user agent before the release and HTTP 200 with a desktop user agent. All now return HTTP 200 to mobile in both plain and campaign-tagged public checks, retain their exact request URL, clean self-canonical and existing central phone links:

- https://www.pinnacleblooms.org/yoga-therapy
- https://www.pinnacleblooms.org/physiotherapy
- https://www.pinnacleblooms.org/hydro-therapy
- https://www.pinnacleblooms.org/autism-speech-aba-parent-family-resources
- https://www.pinnacleblooms.org/autism-speech-aba-news

The five failures shared the ASP.NET JSON parser exception in the staff/centre layout. The guarded edge recovery serves the successful original desktop rendering only after checking the known failure, page title and canonical identity. This restores the mobile response; the underlying ASP.NET exception remains an origin-source dependency. Unrelated routes, private requests and other failures are not silently redirected.

https://materials.pinnacleblooms.org/ now references its four available affected photographs directly over final-host HTTPS. Missing photograph 309 is explicitly labelled Image unavailable; the Kids Play Jungle Tunnel card and description remain. The shared correction applies to qualifying material-image references in this worker, but public verification is scoped to the reported root. It does not claim 674 repaired pages or completed Materials migration. Existing root title/H1 and older presentation issues remain outside this repair.

## Release and preserved estate

| Worker | Live version | Deployment |
|---|---|---|
| pinnacle-verify-route | 37f604d5-aea9-4b4a-b4b3-211072a66b22 | b06035f2-199a-40fe-9436-c23360deed3d |
| pinnacle-legacy-social-metadata | 59d4873f-bc13-4809-90c9-923d08910f1c | 98cb60a6-4097-4cb2-bf4d-94792df98388 |
| materials-mobile-desktop-tracker | 553a24de-4848-43d0-ad9a-4afa0a695374 | 0757fad2-9b1c-4921-93f4-474237a5017c |

Configuration read-back confirms 265 unchanged routes, retained bindings, 3,706 unchanged portal assets and six unchanged protected workers, including Ask and the enquiry receiver. Exact live module hashes match the candidate. Per-worker prior versions are retained in the release receipt for rollback. No campaign, audience, conversion, database, catalogue or checkout changes were made.

## Evidence and practical limits

- `deployment/semrush-targeted-recheck-20261008.json`: actual five mobile failures and desktop successes before release.
- `deployment/semrush-mobile-media-20261008.json`: source, three deployments, rollback, module hashes and configuration verification.
- `deployment/semrush-mobile-media-public-20261008.json`: 10/10 public plain/tagged mobile response checks and Materials image-reference checks.
- `deployment/semrush-mobile-media-browser-20261008/report.json`: Edge 154 on Windows at 390 × 844, mobile user agent, three representative URLs; no page-width overflow. This is browser emulation, not a physical iPhone. No artificial network throttling.
- Captures in that browser folder were inspected: Yoga and Resources preserve the existing legacy layout; the unavailable-image tile is visibly labelled while the material text remains. Image loading measured before scrolling is not a final lazy-image result; the scrolled capture is the visual evidence for the tile.
- Analytics, vendor tracking and APIs were intercepted in browser checks. No calls, WhatsApp messages or customer enquiries were submitted. No growth or Ads outcome is inferred from these tests.

Next owner work for traffic quality remains in `ACQUISITION-TRAFFIC-QUALITY-20261008.md`; this release leaves the deployed acquisition events and protected receipt receiver intact.
