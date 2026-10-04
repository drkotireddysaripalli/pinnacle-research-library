# Ask answer completeness and current SEO/performance review

4 October 2026. Read-only production/template review; no page, routing, database, authentication or deployment changes.

## Conclusion

The answer template has a sound public-content and discovery foundation, but it is not complete against the owner's full intent. Current gaps are mobile arrival performance, export parity, precise evidence, perspective-specific explanation and reciprocal contextual portal links. Submission coverage is complete for the 40,170 current answers; submission is not proof of indexing, citations or conversion.

## Actual checks

- Existing release: four representative answers, 31 destinations, HTML/schema FAQ and ItemList checks, hero/OG identity, responsive Chrome at 320/390/768/1024/1440, public/private response boundaries.
- Earlier Ask Lighthouse reports inspected `/ask`, not the latest answer template. They must not be presented as the current answer's results.
- Fresh GSC Wizard on-page crawl: four live answers (OT, AbilityScore, Telugu cerebral-palsy, Pinnacle introduction); all HTTP 200, self-canonical, indexable, one H1, viewport, structured data without detected schema issues. Zero critical/high/medium and seven low heuristic findings.
- Fresh Lighthouse 13.5.0: one representative live OT answer, anonymous mobile and desktop Chrome lab measurements. No physical device, Safari, full corpus or signed-in speed claim.
- Signed-in Google Search Console domain settings explicitly displayed **Search generative AI: Include** and **robots.txt: All files are valid**. This confirms the domain control, not ranking or actual AI citation.

| Metric | Mobile | Desktop |
|---|---:|---:|
| Performance | 79 | 100 |
| Accessibility automated score | 100 | 100 |
| Best practices | 96 | 96 |
| SEO automated score | 92 | 92 |
| Largest contentful paint | 3.581 s | 0.658 s |
| Layout shift | 0.198 | 0.009 |
| Total blocking time | 0 ms | 0 ms |

### Concrete defects/findings

1. Mobile layout shifts are concentrated in `#ask-reader-gate` as its contents/logo/fonts settle. Preserve sign-in behaviour and branding; stabilise its dimensions and loading sequence.
2. The 1200x630 answer hero is the mobile LCP element. Lighthouse estimates about 54 KB savings with responsive delivery. Preserve the original answer creative and OG URL; use appropriate responsive variants for in-page display.
3. Cloudflare RUM request `/cdn-cgi/rum` on apex redirects to www and fails CORS. This affects measurement and the best-practices score. Correct only after identifying the exact responsible redirect; preserve Ask and unrelated routes.
4. One answer-body homepage link uses `here`, causing the Lighthouse SEO deduction. Use descriptive source-supported anchor text.
5. AbilityScore's meta description is only 63 characters. OT social/meta description visibly ends mid-word (`thr`); use a complete editorial sentence rather than a hard cut. Telugu length and a 64-character title are heuristics, not automatic defects.
6. GSC Wizard's image warning is not yet a verified content-image defect: live HTML has no img missing an alt attribute and two intentionally empty hidden profile-avatar alts. Lighthouse image-alt passes. Do not add noisy labels to decorative images just to satisfy a heuristic.
7. GSC Wizard calls many www Pinnacle links external to the apex Ask host. Live HTML has 372 www Pinnacle links, mostly common navigation/footer. This is not evidence of 441 unrelated external editorial citations.

## Data and reader coverage

Current HTML includes the original answer image/QR, question, short answer, full explanation, section links, dates, observation/tip fields, FAQs, sources, available attribution, facets/lenses, grouped related questions, relevant services, seven-stage PinnacleAI pathway, Verify/research, centres, enrolment/call, citation/share and public machine exports.

The current OT public record has 26 top-level fields, four FAQs, six related records, six lens links, one dimension, five reading paths, no materials/techniques records and no named reviewer. Its three sources are organisation homepages, not precise documents supporting each assertion.

| Reading path | Rendered questions | Eligible candidates |
|---|---:|---:|
| Understand the subject | 5 | 5 |
| Explore therapy and support | 12 | 33 |
| At home and in everyday life | 1 | 1 |
| Follow progress | 12 | 13 |
| Choose and access care | 3 | 3 |
| Total | 33 | 55 |

Thirteen questions appear initially, twenty more through disclosures; the broader topic collection is linked. Caps are deliberate presentation limits, not proof that all 55 candidates are displayed. The template does not show candidate totals or relationship reasons.

### Lenses and dimensions

- The current OT lenses are Parent, Adaptive, Support, Plan, Occupational-Therapy and Early Clarity; its dimension is Therapies.
- Eleven primary facet types are automatically considered: stakeholder, age, developmental age, domain, readiness, intent, lifecycle, route, score band, component and empowerment; explicit lens relationships are also used, deduplicated and capped at 24 links.
- Additional supported facet types are not all automatically shown. The answer RPC selects one ranked question record rather than aggregating every question mapped to the answer.
- A lens link opens a collection. It does not itself explain this answer for a parent, teacher, caregiver and therapist. This is a material gap relative to the owner's intent.
- Missing source records must not be filled with invented perspectives, resources, translations or reviewer names. Audit the public relationships and author useful, sourced perspective content for priority answers.

### Machine-output parity

Markdown includes the full main explanation, summary, sources, taxonomy and reading paths, but omits separate FAQs, observations, everyday tip, publication/editorial dates, resources and the computed service/seven-stage connection section. JSON includes the public record but not every computed HTML contextual link. Complete this parity in a shared serializer; existing main-answer text completeness does not mean all-page-field completeness.

### Pinnacle integration

All seven pathway destinations are linked: AbilityScore, seven readiness indexes, integrated autism therapy, everyday therapy, Fusion, reassessment and self-sufficiency. Mainstream, PinnacleAI, appropriate therapy, assessment, centres, enrolment and Verify are present too.

Service matching currently uses five fixed mappings plus title/entity keyword fallback. Add explicit governed relationships where accuracy matters. Live OT service and PinnacleAI pages each link to Ask home but do not directly link back to the specific OT answer/topic. Add focused return links in relevant content blocks; do not redesign or multiply the approved shared header/footer.

## Ordered implementation work list

1. Fix shared Ask gate layout shift, responsive image delivery, exact RUM redirect and descriptive anchor; complete snippets as sentences. Recheck only affected boundaries and run one fresh mobile/desktop Lighthouse pass after the fix.
2. Complete HTML/JSON/Markdown field parity and answer-specific metadata from a single public presentation model.
3. Improve exact source links and real review attribution for priority answers. Keep Verify claim sources attached to the specific Pinnacle assertion they support.
4. Provide useful parent/home, teacher/school and therapist/progress perspectives when applicable and sourced, using short blocks and progressive disclosure. Keep one coherent answer and canonical URL.
5. Audit multi-question answer mappings, offer clear linked coverage for further questions, and expose public resources that actually exist.
6. Strengthen explicit answer-to-therapy/topic/centre links and relevant therapy/PinnacleAI-to-Ask return links. Retain calls to 9100 181 181 and relevant enrolment routes.
7. Retain the confirmed Google Search generative AI **Include** setting; measure actual query/referral/call outcomes separately. The GSC Wizard connector exposes no direct read of that setting; it was verified in the signed-in Search Console settings UI during this review.

## Current official search guidance

- Google's generative AI optimization guide prioritises useful distinctive content, crawlability, readable structure and relevant media; no special AI schema or llms.txt ranking benefit: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google retired FAQ rich results from 7 May 2026. Useful visible FAQs and truthful schema do not imply that discontinued search feature: https://developers.google.com/search/updates
- Google Search generative AI inclusion is a separate Search Console setting, default Include; the property's actual value must be inspected, not inferred from the default: https://support.google.com/webmasters/answer/16908024

## Evidence files

- `deployment/ask-answer-seo-audit-20261004.json`
- `audits/ask-answer-20261004/summary.json`
- `audits/ask-answer-20261004/mobile.report.html` and `desktop.report.html`
- `audits/ask-answer-20261004/live-html.json`
- Source review: `src/components/ask/AskAnswer.astro`, `AskReadingPaths.astro`, `src/lib/ask/answer-presentation.ts`, `ask-runtime/worker.ts`, and answer navigation/reading-path migrations.
