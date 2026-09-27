# Pinnacle speech therapy page — unreleased preview

The speech page rebuild uses Pinnacle's Sintony typography, purple/pink palette and familiar site navigation. Its narrative connects speech therapy to everyday communication, growing independence and participation, with links to the precise public evidence behind the PinnacleAI story.

**Status, 27 September 2026:** implemented and independently reviewed local preview. This directory is source preservation, not a production deployment. Both preview routes deliberately emit `noindex, nofollow`. Existing public speech, Verify, helpline and enrolment routes remain unchanged.

## Run and check

Requires a current Node.js version compatible with the pinned Astro dependency.

```text
npm ci
npm run build
npm run preview -- --port 4326
```

In another terminal, with the preview running:

```text
node scripts/validate-sales.mjs
node --test scripts/test-measurement.mjs
```

- Service preview: http://127.0.0.1:4326/
- Compact navigation variant: http://127.0.0.1:4326/speech-campaign.html
- Main content: `src/components/SpeechPage.astro`
- Content and sources: `src/data/speech.ts` and `src/data/site.ts`
- Shared presentation: `src/components`, `src/layouts`, `src/styles`
- Optional consented measurement: `public/pinnacle-pages-scripts/speech-measurement.js`

## Current checks

Build succeeds for both routes; 33 page checks and eight measurement tests pass. Browser inspection covered desktop and mobile, including 320 px width, disclosures, the centre selector and the existing live enquiry form destination. The visual-story rebuild adds two generated campaign images, home/car illustrations, icon-led stages and stronger typography. Shared styling is consolidated in `src/styles/page.css`.

Final local Lighthouse 13.5.0 reports: performance 100, accessibility 100 and best practices 100 on both mobile and desktop. Mobile LCP 1.7 seconds; desktop 0.4 seconds; both CLS 0 and TBT 0 ms. SEO is 66 because this unreleased preview is deliberately blocked from indexing. These are local lab results, not production field data, indexing or conversion results. See `PERFORMANCE-20260927.json`.

See `VISUAL-STORY-20260927.md` for the latest 16 completed improvements, `IMPLEMENTATION-REVIEW-20260927.md` for the preceding review implementation and `LAUNCH-PLAN.md` for remaining release work. Generated campaign artwork is clearly labelled as illustrative; it is not a patient photograph or outcome. See `ASSET-SOURCES.md` and `IMAGE-PROMPTS-20260927.md`.

## Measurement and release boundaries

Analytics is disabled on localhost and unapproved paths. On the exact approved production origin/routes, it loads only after explicit consent and measures selected call/enquiry link activations. These events do not establish connected calls, bookings or accepted enquiries. No advertising pixel or new lead endpoint is included.

Retain the established speech canonical URL. Production routing, robots, sitemap, rollback, live analytics payloads and lead acceptance still require a coordinated release. Do not copy `dist/index.html` over the whole website or enable a catch-all route.
