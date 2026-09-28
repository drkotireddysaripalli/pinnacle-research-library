# Pinnacle speech therapy page — live release

**Updated 28 September 2026:** [Speech therapy for children](https://www.pinnacleblooms.org/top-speech-therapy-center-india-proven-improvement-rate). The established canonical URL is retained. See [current release details](RELEASE-20260928.md) and [deployment manifest](deployment/release.json).

The current release adds two narrative illustrations, a dedicated sharing card, three supplied centre photographs, printable [first-visit](https://www.pinnacleblooms.org/speech-therapy/first-visit-guide) and [family/teacher observation](https://www.pinnacleblooms.org/speech-therapy/teacher-observation-guide) guides, expandable mobile footer groups and a speech-specific continuation into the existing enquiry form. The entry URL is managed in `src/data/speech-offer.ts`; its offer and appointment language remain consistent with the landing page.

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
node --test scripts/test-measurement.mjs scripts/test-speech-route.mjs scripts/test-release-20260928.mjs
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

Build the production edition, then run `node scripts/prepare-release.mjs <new-output-directory> <verify-source-directory>`. The second argument points to the current sibling `verify-site` or local `pinnacle-verify-fsc` directory. The preparation step copies its complete `dist`, adds only released speech resources and generates the route source. Deploy all three modules: `pinnacle-route-v12.mjs`, `speech-handler.mjs` and `speech-enquiry-handler.mjs`. It never replaces the homepage with speech HTML. Return the local preview to an ordinary build afterward.

The new enrolment route is guarded to rewrite only the exact GET request with `entry=speech-assessment`. The known origin form and v42 bundle are required; an unknown origin is returned unchanged. Untagged enrolment, private requests and other methods remain with the origin. Keep the edited public bundle, its provenance receipt and the entry handler together. The existing server contract is unchanged. A future origin bundle/form update must be reviewed before updating the guard. Route and analytics-injection rollback details are in the current release report.

**The shared Worker now requires the union of Verify and speech assets. Never redeploy only the old v11 Worker or only Verify assets.** Read [deployment instructions and rollback](RELEASE-20260927.md) before updating shared hosting. Keep all three existing bindings and `run_worker_first: true`.

## Verification

**Current release:** 49 live speech files matched staged hashes; four public HTML pages passed Nu validation with no errors or warnings; 23 routing/privacy/entry tests passed. Live mobile checks found no overflow or broken images. Local mobile Lighthouse: **99 performance, 100 accessibility, 100 best practices, 100 SEO**, LCP 1.8 seconds, CLS 0, TBT 60 ms. See `reviews/LIGHTHOUSE-SUMMARY-20260928.json`. Four changed/new URLs received an IndexNow HTTP 200 receipt. This establishes submission only. Real staff/CRM receipt and appointment follow-through remain an operational validation condition.

### Earlier release checks

42 preview checks, 19 measurement/routing tests and 15 production checks passed, including all 30 speech resources matching staged bytes. Chrome checks covered 320/390px mobile and desktop; keyboard menu, centre filter, source navigation and fee FAQ were exercised. Existing Verify, FSC, story, homepage, helpline and enrolment text hashes matched the before-release capture; payment remained reachable.

Initial release production mobile Lighthouse 13.5.0: performance **98**, accessibility **100**, best practices **100**, SEO **100**, agentic browsing **100**. LCP 2.16 seconds, CLS 0, TBT 0. These are one lab run, not field performance or evidence of commercial results. See `PRODUCTION-PERFORMANCE-20260927.json`.

Current narration revision mobile lab audit: **99 performance, 100 accessibility, 100 best practices and 100 SEO**; LCP2.12s, CLS0 and TBT0. See `NARRATION-PERFORMANCE-20260927.json`. These are lab measurements, not field or commercial results.

The two released pages were submitted once to IndexNow (HTTP200). The exact speech Search Console baseline was unavailable; the known Ahrefs project covered Verify and project discovery was plan-restricted. Indexing, ranking, AI citation, connected calls and accepted leads have not been established by this release.

Code, build and release ownership remains in the owner's current task. Reviewers are read-only.
