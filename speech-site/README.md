# Pinnacle shared pages — speech and enrolment

**Latest v91:** [Enrolment story preview](https://www.pinnacleblooms.org/pinnacle-pages-preview/enrolment) now opens with a life-first family decision story, keeps the short form immediately after the promise, then explains why families choose Pinnacle, the PinnacleAI® paradigm shift and the seven-stage pathway. Three existing Pinnacle visuals now carry the story at the points where they help: home and car analogies establish the whole-life purpose, and the family-practice scene shows transfer into everyday life. Responsive image variants, descriptive alt text, explicit dimensions and lazy loading preserve speed and machine readability. The preview uses the shared portal shell, progressive optional preferences, 62 grouped locations and a prepared Cloudflare POST boundary. It cannot submit; existing live enrolment is preserved pending the owner-supplied API. See [29 September release details](RELEASE-ENROLMENT-STORY-20260929.md), the [active deployment manifest](deployment/release.json) and the [proposed API contract](ENROLMENT-API-CONTRACT.md). The bounded v91 check passed 28 relevant tests, W3C validation, responsive browser review at 390/768/1440px and exact production-byte verification while all stable Verify, FSC, helpline, robots and speech resources remained unchanged.

**Updated 28 September 2026:** [Speech therapy for children](https://www.pinnacleblooms.org/top-speech-therapy-center-india-proven-improvement-rate). The established canonical URL is retained. See [current directory and readability release](RELEASE-DIRECTORY-20260928.md) and [deployment manifest](deployment/release.json).

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

Build the production edition, then run `node scripts/prepare-release.mjs <new-output-directory> <verify-source-directory>`. The second argument points to the current sibling `verify-site` or local `pinnacle-verify-fsc` directory. The preparation step copies its complete `dist`, adds only released template resources and the explicitly noindex enrolment preview and generates the route source. Deploy all four modules: `pinnacle-route-v12.mjs`, `speech-handler.mjs`, `speech-enquiry-handler.mjs` and `centre-facilities.mjs`. It never replaces the homepage with speech HTML. Return the local preview to an ordinary build afterward.

The new enrolment route is guarded to rewrite only the exact GET request with `entry=speech-assessment`. The known origin form and v42 bundle are required; an unknown origin is returned unchanged. Untagged enrolment, private requests and other methods remain with the origin. Keep the edited public bundle, its provenance receipt and the entry handler together. The existing server contract is unchanged. A future origin bundle/form update must be reviewed before updating the guard. Route and analytics-injection rollback details are in the current release report.

**The shared Worker now requires the union of Verify and speech assets. Never redeploy only the old v11 Worker or only Verify assets.** Read [deployment instructions and rollback](RELEASE-20260927.md) before updating shared hosting. Keep all three existing bindings and `run_worker_first: true`.

## Verification

**Previous directory release (v85):** 582 live speech files matched staged hashes; 62 locations, 59 exact enquiry matches, 62 vCards and all 36 evidence records validated; four public HTML pages passed Nu validation with no errors or warnings; 23 routing/privacy/entry tests passed. Live mobile checks found no overflow or broken images. Local mobile Lighthouse: **99 performance, 100 accessibility, 100 best practices, 100 SEO**, LCP 2.0 seconds, CLS 0, TBT 40 ms. See `reviews/LIGHTHOUSE-DIRECTORY-SUMMARY-20260928.json`. An earlier release submitted four changed/new URLs to IndexNow with HTTP 200; this directory release made no repeat submission. This establishes submission only. Real staff/CRM receipt and appointment follow-through remain an operational validation condition.

### Earlier release checks

42 preview checks, 19 measurement/routing tests and 15 production checks passed, including all 30 speech resources matching staged bytes. Chrome checks covered 320/390px mobile and desktop; keyboard menu, centre filter, source navigation and fee FAQ were exercised. Existing Verify, FSC, story, homepage, helpline and enrolment text hashes matched the before-release capture; payment remained reachable.

Initial release production mobile Lighthouse 13.5.0: performance **98**, accessibility **100**, best practices **100**, SEO **100**, agentic browsing **100**. LCP 2.16 seconds, CLS 0, TBT 0. These are one lab run, not field performance or evidence of commercial results. See `PRODUCTION-PERFORMANCE-20260927.json`.

Current narration revision mobile lab audit: **99 performance, 100 accessibility, 100 best practices and 100 SEO**; LCP2.12s, CLS0 and TBT0. See `NARRATION-PERFORMANCE-20260927.json`. These are lab measurements, not field or commercial results.

The initial two released pages were submitted once to IndexNow (HTTP200), followed by the four changed/new URLs in the later guide release. On 28 September, the existing full-domain Search Console property confirmed the exact speech URL is indexed (stored crawl 22 September); a fresh live test confirmed that the updated page can be indexed. Earlier prefix-only access limitations are superseded. The known Ahrefs project covered Verify and project discovery was plan-restricted. Ranking, AI citation, connected calls and accepted leads have not been established by the page release.

Code, build and release ownership remains in the owner's current task. Reviewers are read-only.
