# Centre speed and missing legacy media — 6 October 2026

The centre-media release passed its live functional and physical-device checks. Its production Lighthouse measurement reported Suchitra mobile LCP 2,586.659 ms, above the 2,500 ms target. The LCP element was the introductory paragraph; two stylesheets blocked rendering, while the below-fold mobile building photograph requested high priority and more pixels than its contained display needed.

This correction embeds the same compiled CSS bytes into Suchitra's HTML, removing those two initial stylesheet requests without editing the approved common styles. The exterior uses display-appropriate responsive sizes, WebP quality 80 and normal request priority. Layout, wording and tour behaviour are retained. The reusable Lighthouse runner now recognises both centre URLs.

Existing Ahrefs findings identified 20 broken image URLs on 22 pages. Current origin HEAD responses confirmed all 19 named staff portrait files and one course image return 404. Only those exact source paths receive the existing Pinnacle logo fallback, explicitly labelled as the brand logo. Their dead image values are omitted from structured data; a logo is never assigned as a person's portrait. Unknown/working images and page/profile content remain unchanged. Existing public-response/canonical/authentication guards apply. Two exact course entry families gain the existing metadata handler.

51 focused tests passed, including the edge image replacement, unchanged healthy images/privacy headers, schema image removal without precision loss, shared metadata guards and existing centre transforms. Preserve all 221 current routes, bindings and the full asset union; add only the two declared course triggers. Exact revision CI, guarded promotion, all 22 affected page checks and the new production Lighthouse result are required for closure.

The 12 reported book hreflang pages were rechecked: all 36 current advertised alternate destinations returned 200. No rewrite was needed. Operational proof: `work/pinnacle-growth-system/shared-repair-20261006/hreflang-current.json` and `image-current.json`; release receipts in `centre-media-final-20261006`.

## Delivered and verified

Sources `4ec3d1812e62174d60d05c5f64d8be5e3b7ac783` and `229650ed5075a61e2a8aee002f40a5f7b6c86b46` are pushed. Exact-source CI runs 37437123639 and 37438217142 passed before promotion. The first live image check caught mixed-case staff URLs whose published canonicals are lowercase. The follow-up preserves the same numeric profile/slug identity and passed 36 focused checks; it does not make arbitrary paths case-insensitive or override retired-profile handling.

- Portal version: `1ad16c88-c6bf-415f-807a-c92c9a723062`.
- Legacy metadata version: `12855987-d462-481e-bed3-b51926cacb0a`.
- All 221 preceding routes retained; two declared course triggers added, for 223 total. Bindings and the full 2,160-asset union retained. Five unrelated Workers unchanged.
- All 22 reported affected pages pass the final dead-image/schema checks. Suchitra passes its CSS/tour check: **23/23 live checks**. Native Cloudflare modules were read back and matched the intended hashes.
- Suchitra production mobile Lighthouse: performance **98**, accessibility **100**, best practices **100**, SEO **100**; LCP **2,134.140 ms**, CLS 0, TBT 0. Desktop: all four scores **100**, LCP **554.234 ms**. These are lab measurements, not field Core Web Vitals or conversion results.
- The preceding centre release passed both pages on physical Pixel 11/Android 17, physical iPhone 13/iOS 18.5 and hosted Firefox/Windows 11. No broad device repeat was run for this CSS-delivery-only follow-up. Final Chrome visual inspection confirmed the exterior and course logo rendering. A requested viewport override continued to report 1440px; its screenshot is recorded as desktop, never as a new mobile pass.
- IndexNow accepted 21 newly changed, verified canonical URLs with key validation complete, batch `407e376e-5818-440b-9818-c5fde40c6ab1`. Already-notified centre and course URLs were excluded. GSC annotation `329bd293-8a31-46a0-bb51-da8aa5b93717` records the release. Acceptance does not establish indexing.

## Actual audit and remaining limits

Ahrefs main project 10477823 completed at `2026-10-06T08:02:36Z`: health **90**, 53,853 crawled URLs, 5,264 URLs with errors. That crawl predates this completed release; no replacement full crawl was started. Four bounded issue exports cost 200 API units; the final project-status read cost 0 units.

The existing Cloudflare login refreshed successfully. Analytics reads now work, but settings, cache/config rulesets and bot-management reads still return 403. The broad 504 count is from `earlyHintsCache` and `edgeWorkerCacheAPI` cache-miss subrequests. Those are excluded from visitor-error diagnosis, per https://developers.cloudflare.com/logs/faq/504-origin-status-0/ . They are not evidence of thousands of broken visitor sessions.

The visitor-filtered window from 5 October 16:30 UTC to 6 October 08:45 UTC still contains genuine legacy 500s. Four selected affected public destinations currently return 200; this does not fix or clear the intermittent origin problem. The query excludes private identifiers and stores path/status aggregates in the existing private evidence folder. Exact ASP.NET exception/origin diagnostics remain needed for root-cause repair. `/ma/wil` and the recorded ASSQ UUID also remain without a verified equivalent. Broader centre media rollout and commercial-content improvements are not claimed complete by this two-centre release.
