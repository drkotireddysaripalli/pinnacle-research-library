# Pinnacle managed pages — shared therapy and enrolment system

**Operating context:** future portal pages preserve the complete released-page method through [the portal context and build modality](PORTAL-CONTEXT-AND-BUILD-MODALITY.md). [The portal page inventory](PORTAL-PAGE-INVENTORY-20260929.md) defines the canonical therapy, centre and PinnacleAI® sequence; [the Pinnacle page creation work order](PINNACLE-PAGE-CREATION-WORK-ORDER.md) defines reusable acceptance and release; and [the active page work order](ACTIVE-PAGE-WORK-ORDER.md) defines the one current page. This retains the deep narrative, sales, evidence, visual, machine and release decisions without replaying superseded exploration on every build.

**Shared managed-page system:** the reusable header, complete menu, authority strip and Verify footer cover the site's high-value therapy, conversion, institutional, evidence, team, parent-story, Ask Pinnacle, media and legal hubs. Payment & Billing links to its declared `books.pinnacleblooms.org` canonical. All ten managed HTML routes render the same header and footer; changing the shared sources changes them together on the next build. The exact authority narrative remains **Verify — 4 Billion DataPoints for 900Million Children → PinnacleAI® — CDSCO, BIS, India Certified SaMD → Research — Study Journals & Publications → AbilityScore® — Proven 0 - 1000 Universal Metric → 7 Readiness Indexes — Your Child Life As it could be → Self-Sufficient → Mainstream → 160Yrs Paradigm Shift → Citations**. [Enrol at Pinnacle](https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india) uses the same-origin `/api/enrolment` Cloudflare boundary. See [the active work order](ACTIVE-PAGE-WORK-ORDER.md), [the canonical page creation work order](PINNACLE-PAGE-CREATION-WORK-ORDER.md), [shared shell release details](RELEASE-SHARED-HEADER-FOOTER-20260929.md), and [the API contract](ENROLMENT-API-CONTRACT.md).

**Latest therapy release, 30 September 2026:** [Autism Therapy for children](https://www.pinnacleblooms.org/autism-therapy) now explains how a child's everyday life selects the relevant speech, occupational, behavioural, educational, family and school supports. A school-morning example, a readable seven-stage path, a concrete first-call sequence and autism-specific Verify proof give parents a clear next step. The page includes new campaign scenes and a complete 1200 × 630 branded social creative generated in this Codex task. Its own JSON, text and Markdown evidence trail and 15 matched visible/schema FAQs are live. See [the v127 receipt](RELEASE-AUTISM-THERAPY-V127-20260930.md), [the dated practical review](reviews/AUTISM-THERAPY-V127-PRACTICAL-REVIEW-20260930.md) and [the canonical page creation work order](PINNACLE-PAGE-CREATION-WORK-ORDER.md). The shared mobile More menu and Verify footer continue across all ten managed pages. [ABA Therapy](https://www.pinnacleblooms.org/best-aba-therapy-center-india-proven-improvement-rate), [Occupational Therapy](https://www.pinnacleblooms.org/best-occupational-therapy-center-india-proven-improvement-rate) and [Speech Therapy](https://www.pinnacleblooms.org/top-speech-therapy-center-india-proven-improvement-rate) remain live on the same system.

**Measurement follow-up:** [Directory call and enquiry measurement](RELEASE-MEASUREMENT-20260928.md) is live in v86. All 59 verified centre enquiry targets and directory call placements now have consented measurement coverage; 25 tests pass. Page publication is complete, while staff/CRM acceptance and commercial follow-through remain separate open conditions.

The latest release adds a searchable directory of all 62 sourced locations, 57 centre emblems, 138 approved photographs across 52 locations, selected-centre enquiries, sharing and citation tools, a shared 36-record Verify library, and improved typography. It retains the two narrative illustrations, dedicated sharing card and printable [first-visit](https://www.pinnacleblooms.org/speech-therapy/first-visit-guide) and [family/teacher observation](https://www.pinnacleblooms.org/speech-therapy/teacher-observation-guide) guides, expandable mobile footer groups and a speech-specific continuation into the existing enquiry form. The entry URL is managed in `src/data/speech-offer.ts`; its offer and appointment language remain consistent with the landing page.

The page uses Pinnacle’s official logos, Sintony typography and vivid purple/pink palette. Everyday communication connects to the seven-stage family pathway, nine optional technology explanations and the precise source records behind PinnacleAI. The owner-confirmed speech assessment offer displays **~~₹25,999~~ FREE**. Ongoing therapy is priced separately. Repeated AI-image captions were removed at the owner's instruction; descriptive alt text and internal provenance remain.

The narrative revision speaks consistently as Pinnacle to parents and connects 10 decision topics to 18 relevant public sources. Evidence is placed beside assessment, review, family practice, licensed software, research, centre identities and institutional accountability. JSON/TXT source maps use the same source data as the visible citations.

The current portal revision restores the homepage header/menu and purple footer as shared components, with full navigation and mobile access. See [portal restoration](PORTAL-RESTORATION-20260927.md).

## Build and review

```text
npm ci
npm run build
npm run preview -- --port 4326
node scripts/validate-sales.mjs
node scripts/validate-portal.mjs
node scripts/validate-evidence.mjs
node --test scripts/test-measurement.mjs scripts/test-speech-route.mjs scripts/test-release-20260928.mjs scripts/test-enrolment.mjs
```

Ordinary builds are noindex previews. `/speech-campaign.html` remains a comparison preview even with production mode enabled. Production mode is enabled only with environment variable `PINNACLE_RELEASE=production`.

- Service-specific content: `src/data/speech-content.ts`
- Shared typed content contract: `src/data/service-content.ts`
- Main narrative: `src/components/SpeechPage.astro`
- Shared presentation: `src/components`, `src/layouts`, `src/styles`
- Source record: `src/pages/speech-therapy/service-information.astro`
- Shared service facts and campaign offer: `src/data/speech-service-facts.ts`, `src/data/speech-offer.ts`
- Generated service exports: `src/pages/pinnacle-pages-data`
- Sitemap and reading guide: `public/pinnacle-pages-data`
- Shared evidence map: `src/data/speech-evidence.json`
- Generated evidence exports: `src/pages/pinnacle-pages-data`
- Optional consented CTA measurement: `public/pinnacle-pages-scripts/speech-measurement.js`

## Release preservation

Build and stage a production release from source:

```text
npm ci
$env:PINNACLE_RELEASE='production'
npm run build
node scripts/test-enrolment.mjs dist
node scripts/prepare-release.mjs release-current ..\verify-site
node scripts/audit-enrolment-metadata.mjs release-current
node scripts/prepare-worker-upload.mjs release-current .worker-upload-current
npx wrangler deploy --dry-run -c .worker-upload-current/wrangler.jsonc --outdir dryrun-worker-current
```

`prepare-release.mjs` copies the complete current Verify build, adds the released therapy and enrolment resources, generates the asset inventory and rebuilds `deployment/pinnacle-route-v12.mjs`. `prepare-worker-upload.mjs` then creates an isolated, disposable upload directory containing exactly the six Worker modules and its generated configuration. Deploy from that generated configuration only after its dry run reports five additional modules. It preserves `ASSETS`, `PINNACLE_LEGACY`, `PINNACLE_ASK` and `run_worker_first: true`; existing secrets remain managed in Cloudflare and are not stored here. Run `npm run clean` after release. Never deploy an old Verify Worker, a partial asset directory or the cluttered source `deployment/` directory directly.

## Verification

**Previous directory release (v85):** 582 live speech files matched staged hashes; 62 locations, 59 exact enquiry matches, 62 vCards and all 36 evidence records validated; four public HTML pages passed Nu validation with no errors or warnings; 23 routing/privacy/entry tests passed. Live mobile checks found no overflow or broken images. Local mobile Lighthouse: **99 performance, 100 accessibility, 100 best practices, 100 SEO**, LCP 2.0 seconds, CLS 0, TBT 40 ms. See `reviews/LIGHTHOUSE-DIRECTORY-SUMMARY-20260928.json`. An earlier release submitted four changed/new URLs to IndexNow with HTTP 200; this directory release made no repeat submission. This establishes submission only. Real staff/CRM receipt and appointment follow-through remain an operational validation condition.

### Earlier release checks

42 preview checks, 19 measurement/routing tests and 15 production checks passed, including all 30 speech resources matching staged bytes. Chrome checks covered 320/390px mobile and desktop; keyboard menu, centre filter, source navigation and fee FAQ were exercised. Existing Verify, FSC, story, homepage, helpline and enrolment text hashes matched the before-release capture; payment remained reachable.

Initial release production mobile Lighthouse 13.5.0: performance **98**, accessibility **100**, best practices **100**, SEO **100**, agentic browsing **100**. LCP 2.16 seconds, CLS 0, TBT 0. These are one lab run, not field performance or evidence of commercial results. See `PRODUCTION-PERFORMANCE-20260927.json`.

Current narration revision mobile lab audit: **99 performance, 100 accessibility, 100 best practices and 100 SEO**; LCP2.12s, CLS0 and TBT0. See `NARRATION-PERFORMANCE-20260927.json`. These are lab measurements, not field or commercial results.

The initial two released pages were submitted once to IndexNow (HTTP200), followed by the four changed/new URLs in the later guide release. On 28 September, the existing full-domain Search Console property confirmed the exact speech URL is indexed (stored crawl 22 September); a fresh live test confirmed that the updated page can be indexed. Earlier prefix-only access limitations are superseded. The known Ahrefs project covered Verify and project discovery was plan-restricted. Ranking, AI citation, connected calls and accepted leads have not been established by the page release.

Code, build and release ownership remains in the owner's current task. Reviewers are read-only.
