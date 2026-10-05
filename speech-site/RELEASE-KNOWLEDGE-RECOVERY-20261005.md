# Public knowledge and site-health recovery — 5 October 2026

## Delivered

This release repairs shared legacy causes behind thousands of crawl errors. It does not certify a 100/100 Ahrefs score. The main project last displayed 22/100 on the old crawl; one post-release audit started at 22:02 IST and is running.

### Public collections

- **4,564 FAQ answers**, 652 source records across seven languages, retain original slugs. Focused answer pages replace repeated full-answer lists. Supported short aliases redirect to the exact answer.
- **Sunshine:** nine topic types, 1,826 source records matched to actual public destinations. Individual topic pages retain their existing owners; this is not a rewrite of every topic detail.
- **Mirracles:** 28,334 unique numeric-record destinations remain reachable through 60-item pages. The 2,043 malformed `UPLOADED` placeholders are not promoted. Real story detail URLs remain intact.
- Ordinary HTML pagination, three collection sitemaps, metadata, reciprocal FAQ language links, visible-answer/schema parity, retained source images and contextual therapy/centre/evidence/contact paths are included.
- The approved v159 common header/footer and Ask Google reader identity are reused. No database mutation, new authentication scope, synthetic registration or private patient import.
- All 295 FAQ/Sunshine URLs in the saved GSC baseline resolve through the supported route map. That window records 197 clicks and 13,537 impressions (5 September–2 October); it does not establish a 99% site traffic share.

| Public collection | Previous raw HTML bytes | New raw HTML bytes | Reduction |
|---|---:|---:|---:|
| `/faq` | 3,362,779 | 160,685 | 95.2% |
| `/sunshine` | 694,195 | 159,846 | 77.0% |
| `/allmirracles` | 17,062,921 | 207,845 | 98.8% |

Live examples:
- https://www.pinnacleblooms.org/faq
- https://www.pinnacleblooms.org/faq/english/speech-therapy/autism-speech-therapy
- https://www.pinnacleblooms.org/faq/telugu
- https://www.pinnacleblooms.org/sunshine
- https://www.pinnacleblooms.org/sunshine/techniques
- https://www.pinnacleblooms.org/allmirracles

### Shared staff, canonical and sitemap repair

- 1,505 source-confirmed retired staff IDs return an accurate branded 410 response with useful directory/centre/contact choices. No private reason is disclosed. 132 retired URLs from the Ahrefs sample were checked live. The current directory remains intact; conflicting ID45748 and unresolved ID1954 retain existing behaviour.
- The three reported staff 404s now use that retirement response. Do not count all 1,505 IDs as individually live-tested URLs or inferred error reductions.
- `/franchise-autism-therapy-center` now has one self-canonical and matching social URL. Conditional requests cannot reuse the old incorrect canonical response.
- `/sitemaps/core.xml` lists 47 canonical pages, adds FAQ/Sunshine and corrects the physiotherapy URL.
- 147 targeted public checks passed, including current profiles, the preserved 45748 exception, canonical aliases, conditional canonical handling and protected Ask/Verify/knowledge pages. Both 320 and 1440 px retirement-page screenshots were visually inspected.

## Committed production versions

| Surface | Source revision | Live Cloudflare version |
|---|---|---|
| Ask/FAQ/Sunshine/Mirracles, final readability | `818fe1bb4b3ac30f8f380b1fab47b32c0f771fc4` | `66c17f39-e6bd-441b-ba6a-3abb0049cc68` |
| Legacy shared staff/canonical handler | `1fb282372e62d1bbce80bc8efbe3bb939ef463b8` | `6f6f7985-1d62-47d3-843f-52bd1edd2c20` |
| Root sitemap handler | `1fb282372e62d1bbce80bc8efbe3bb939ef463b8` | `a31e8e05-4af3-453b-a726-aa0b2d43703c` |

The original 200 routes were reconciled; final count is 209. Only the two authorised FAQ/Mirracles owners transferred, plus nine specific route additions. All 21 Ask bindings and protected Portal `79fd6ef1-e733-497e-9bf9-d76822d04296` / MCP `5fc3a111-be9d-401e-9856-674534594d5e` versions remain intact. Rollback identities and exact routes are in the deployment receipts. The first shared-health candidate was superseded without promotion.

Both final source revisions passed CI before promotion. Final readability CI: https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37341826935

## Validation and honest coverage

- 30 initial focused content/auth tests; 34 final auth/content tests after the sign-in geometry change; 32 measurement tests; 37 shared staff/canonical checks. These are scoped suites, not an additive count of unique requirements.
- 27 initial public HTTP checks; 147 shared-repair public checks; three final real anonymous Google-load checks on FAQ at390/1440 and Ask at390. No browser errors or horizontal overflow in those final views; correct return paths and underlined answer links confirmed.
- Six knowledge templates at320/768/1440:18 Chromium checks. Final answer also reviewed at390 Chromium and768 WebKit. Screenshots were inspected, not only measured.
- TestingBot hosted Safari26.3.1: the initial run exposed consent persistence failure. Shared consent code was corrected; the targeted Safari retest passed. This is hosted desktop Safari, not a physical mobile device.
- Local Firefox could not launch (`spawn UNKNOWN`). The selected physical device was unavailable, so no physical-device session/pass is claimed. Successful Google account sign-in was not repeated; the actual anonymous Google button/iframe and preserved session endpoint were verified without creating a registration.
- Source FAQ text is server-rendered. No user-agent-specific alternate answer is served.

### Final live Lighthouse — one representative FAQ answer

| Lab mode | Performance | Accessibility | Best practices | SEO | LCP | CLS |
|---|---:|---:|---:|---:|---:|---:|
| Mobile |96|100|100|100|2.133s|0.085|
| Desktop |100|100|100|100|0.506s|0.030|

The earlier97 accessibility score identified links distinguished by colour alone. Underlines fixed that. Reserved sign-in space reduced the observed mobile CLS from0.120 to0.085. These are Lighthouse lab observations on the named answer, not field Core Web Vitals, all-page certification, rankings or Ahrefs Health Score.

## Discovery actions completed once

- GSC Wizard accepted four sitemap submissions: FAQ, Sunshine, Mirracles and core. Processing/indexing remains external.
- IndexNow returned HTTP200 for5,631 changed knowledge URLs and137 changed profile/canonical URLs. Notifications are not confirmation of indexing.
- GSC release annotation saved (`3e3fab5f-7d18-4fe6-9233-356c3a711ede`).
- Ahrefs main-project audit: max pages10,000→50,000 within the existing plan; parameter stripping disabled so `?page=` links can be crawled; three exact collection sitemaps added. Existing speeds, sources and scope exclusions retained. Ask and Verify retain their separate audit projects.
- One fresh full crawl started22:02IST. Screenshot at22:05 shows169 crawled,20,726 scheduled,102 billed and436,211 crawl credits left. No duplicate crawl or hourly recrawl.

## Still open for the genuine100 target

1. Read the completed new Ahrefs audit, then batch its residual errors by shared cause. The old report had8,562 error-bearing URLs,7,981 orphans,610 oversized pages,5 404s and5 500s; groups overlap. The250-row orphan/oversize samples are not the full corpus distribution.
2. Two old404 destinations still need an evidenced source fix: `/ma/wil` and `/viewassessments/autism-spectrum-screening-questionnaire-assq-/7446b58c-0160-49b2-aad8-fc66ec3bfb60`. The current public assessment hub is200 and no longer exposes the old record list. No irrelevant homepage redirect was invented.
3. Source conflicts45748 and1954 remain explicitly unreclassified. They are not removed to improve a score.
4. Warning counts (social/canonical, schema, redirect links and descriptions) require completed post-release evidence; no blanket zero-error claim is made. All five previously reported500 destinations returned200 in the bounded live check, but four had already recovered before this release.

This website chat owns the remaining health work. The existing hourly automation stays paused. The next trigger is the completed post-release crawl or a concrete source record resolving the two old destinations. Overall100/100, indexing gains and qualified enquiries remain unverified.

## Evidence

Deployment/public receipts in `deployment/knowledge-*-20261005.json`, `site-health-*-20261005.json` and `ahrefs-post-release-crawl-20261005.json`; final compact Lighthouse report `deployment/knowledge-lighthouse-final-20261005.json`. Full source/GSC records stay in the local growth-system case folder. The deployed action receipt is `deployment/knowledge-health-delivery-20261005.json`.
