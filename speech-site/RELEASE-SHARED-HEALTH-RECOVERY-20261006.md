# Shared health recovery — 6 October 2026

## Delivered result

Shared causes were repaired once, across the eligible legacy templates and common portal shell. This is a deployed release, not a claim that all reported Ahrefs errors have been cleared.

| Work | Production evidence |
|---|---|
| Broken shared navigation | All 12 original Ahrefs sample pages previously carried the same 41 broken targets. The final public read-back contains zero of those targets on each page: 492 repeated failures removed from the checked sample. Ahrefs reported 2,022 pages linking to broken destinations overall; that total is not asserted to be fully cleared. |
| Useful destinations | 39 records recovered from the saved PlanetScale source into distinct Sunshine topics. Old URLs redirect once to their actual equivalents. Two invalid placeholder links were removed. |
| Backlink recovery | `/ma/wil` redirects to `/ma/wilbarger-brush-therapy-tool`. The published Podimo episode supplied both the shortened link and the full target; no guessed destination. |
| Wider legacy coverage | Shared OG, canonical, schema and navigation handling now also covers the `skills`, `abilities`, `abs`, `m` and `a` families. Earlier `t`, `c`, `b`, `ma`, staff and other repairs remain. |
| Loading | Common footer artwork uses native lazy loading, preserving the same artwork and approved layout. Suchitra's frontage no longer competes at high priority with its text LCP. |
| Discovery | Sunshine sitemap has 199 entries and contains every restored topic. GSC accepted the changed sitemap; IndexNow accepted 40 changed destinations with key validation. Indexing/ranking/citation gains are not yet measured. |

## Exact release

- Code: `773eae9a725c0d454c2c87fe57787c28d273fcc1` (rendering), `eb7fbc4d9fe1f30b5df62142135d1a017806ed72` (topics), `7e7f0442b13f32fe728709198f036dbb98a80090` (Wilbarger), final `7e80586403c9d1b372717bdf973c1b96906688e0` (encoded link attributes). All pushed to main before production promotion.
- Final CI: [Portal quality passed](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37445639377).
- Ask/Sunshine Worker: `ee53aed5-fdca-4f78-8580-9b28026a0d15`.
- Portal Worker: `c8a94088-f27b-4e0b-be0e-df0fdc4c2797`.
- Legacy repair Worker: `deb35181-fed0-46c1-a474-dafdc0895196`.
- All **223 existing routes preserved**; **five exact legacy families added**, total **228**. Binding read-back matched the baseline. Ask auth, WATI, Supabase, Verify and MCP configuration retained. Approved common header/footer content, nine authority tiles, fonts and proof cards retained.
- Previous versions and intermediate release receipts are retained in the local release record. No broad `--route` deployment.

## Acceptance and coverage

- 40 old URLs: correct one-hop HTTP 301 destinations.
- 39 new topics: HTTP 200, indexable, one H1, self-canonical, parseable JSON-LD and telephone CTA.
- 12 original affected legacy pages: HTTP 200; all 41 targeted broken links absent; canonical/OG alignment recorded.
- Six protected surfaces: Sunshine, FAQ, Verify, Ask, Ask session and PinnacleAI return HTTP 200.
- Screaming Frog list audit: **40/40 HTTP 200, indexable and self-canonical; no missing H1 or description**. This was a bounded 40-URL audit, not a duplicate full crawl.
- Local topic template inspection: 320, 768 and 1440px; anonymous Google overlay and correct return URL checked. Preview profile was synthetic, not a real signup.
- Physical TestingBot: iPhone Air/iOS26.2 Safari and Pixel 8/Android17 Chrome pass the actual Suchitra frontage, call link, no-horizontal-overflow and lazy-footer checks. Screenshots inspected. Two obsolete selector failures were kept in the record; final selector targets the real frontage figure. No call, sign-in or form was submitted by these tests.
- The last deployment only changes URL normalization for encoded ampersands. The unchanged rendered design/performance was not retested after that URL-only patch. Desktop/tablet evidence is local Chromium at the documented widths; no claim that every page/browser/device was tested.

### Production Lighthouse, same configured mobile/desktop lab runner

| Measure | Mobile | Desktop |
|---|---:|---:|
| Performance | 98 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 1,999ms | 555ms |
| CLS | 0 | 0 |
| TBT | 0ms | 0ms |

Suchitra's earlier lab LCP was 2,586ms after the media change, then 2,134ms after the first optimization. The final reading is 1,999ms. These are lab observations with network variability, not field Core Web Vitals or proof of conversion lift.

## Steps 1–5: cumulative status

1. **Identified sitemap sources delivered:** earlier removal of 702 retired staff entries, correction of 31 stale slugs and the 4,564-entry canonical FAQ map retained; changed Sunshine sitemap now submitted as well. Next completed audit determines any remaining sitemap defects.
2. **Shared broken-link batch delivered:** `/Ask` compatibility retained; `/ma/wil` resolved; 39 topic destinations restored. The ASSQ UUID route still lacks a verified equivalent and remains an honest 404.
3. **Shared social/schema repairs delivered and coverage expanded:** earlier issue families behind 41,522 OG/canonical mismatches and 43,912 schema notices are targeted. These historical notice counts are not an audited post-release clearance total.
4. **Intermittent 500 cause still open:** current public probes succeeded, and the saved 07:30–09:30 UTC Worker execution window has no runtime failures for Ask, Portal or the legacy repair Worker. That does not exclude origin HTTP 500 responses. Matched ASP.NET/origin exception diagnostics are still required; no speculative cache policy or retry loop was deployed.
5. **Identified broken media and first two centres delivered:** earlier 20 dead image sources across 22 pages are repaired; Suchitra and Chanda Nagar exterior/interior/video journeys are live. Shared footer optimization is now live. Wider centre rollout remains separate unfinished work.

Latest recorded main Ahrefs completed crawl: **90 health, 53,853 crawled URLs, 5,264 error URLs**, 6 October 08:02 UTC, before this final release. Overall health remains open. The 40-URL crawler check and Lighthouse SEO100 do not supersede that whole-site score. No additional full crawl was started during this batch.

## Delivered examples

- [Independence and autonomy](https://www.pinnacleblooms.org/sunshine/topic/independence-and-autonomy-1646)
- [Building blocks](https://www.pinnacleblooms.org/sunshine/topic/building-blocks-1058)
- [Recovered Wilbarger backlink](https://www.pinnacleblooms.org/ma/wil)
- [Originally affected shared-navigation example](https://www.pinnacleblooms.org/skills/climbing)
- [Suchitra](https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-suchitra-hyderabad-telangana-india)

## Evidence and resource record

Committed receipt: `deployment/shared-health-recovery-20261006.json`; compact public/crawler/discovery evidence: `deployment/shared-health-recovery-20261006/`.

Full local release evidence: `work/pinnacle-growth-system/render-links-20261006/` in the owner workspace. Action `59d19e1c-ec20-4f5c-8499-9c6eb9229231`; health item `WEB-HEALTH-POSTRELEASE-20261005` remains open. This batch used 50 Ahrefs units, one bounded 40-URL Screaming Frog run, one two-profile production Lighthouse run and no additional agents or full-site recrawl. Existing automation hold is retained.
