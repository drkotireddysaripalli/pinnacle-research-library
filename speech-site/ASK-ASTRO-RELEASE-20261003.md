# Ask Astro release — 3 October 2026

## Delivery
Delivered at https://pinnacleblooms.org/ask on3October2026. Implementation4e3449523e18d18e4682a76db40abb032529a068 was pushed before release; production Worker2dd39a2f-4f2b-43a9-80b5-a1ab7b3800f1 serves100%.
One common source for SiteHeader, SiteFooter and VerifyFooter. No design change to those three components.
One dynamic answer template. Supabase remains the content store. Ask's apex canonicals, legacy assets and independent MCP stay supported.

## Final production acceptance

- 43 production route/metadata checks and14 focused asset/privacy/export checks passed.
- All185 zone routes retained. Main portal3d088473-f2d9-4906-8460-6a0f24e0d1dc and MCP5fc3a111-be9d-401e-9856-674534594d5e unchanged. Seven protected main-site URLs returned200. The www Ask alias still redirects308 to apex.
- 40,665 unique eligible sitemap URLs:40,170 answers,478 topics and17 navigation entries. Duplicate institutional entries removed. Sitemap membership is not an indexed-page count or a page-deletion manifest. All41,165 public/published records remain eligible for the dynamic answer route; non-indexable records stay out of sitemaps.
- Hosted Safari26, Chrome153, Edge153 and Firefox155 passed the14 defined interaction checks. Physical iPhone15/iOS18, Pixel8/Android17 and iPad9/iOS26.6 passed all13 final interaction checks, including both approved Sintony weights loading. Android14 could not start a session; the available Android17 device completed.
- Menu, all nine authority destinations, call destination, answer readability, FAQs, citations, full36-card Verify footer, analytics decline and real enrolment destination checked. No call or fabricated lead submitted.
- Approved shared fonts now bundle from the same source files into Ask's own asset path, correcting the cross-origin font failure discovered by Lighthouse.
- Final Lighthouse13.5 lab: mobile98 performance/100 accessibility/96 best practices/100 SEO; LCP2.20s, CLS0. Desktop100/100/96/100; LCP0.51s, CLS0.024. No target warnings. These are lab results, not field Core Web Vitals.
- GitHub Actions run37101849287 passed, including the independent Ask build job. The final subsequent source change only deduplicated the navigation sitemap.
- GSC Wizard changed-page recheck: zero critical/high/medium issues; one low title-length heuristic. IndexNow accepted30 changed canonical URLs, HTTP200, key validated; batch913d3a44-3765-4bf6-9a8f-8ad835c0907b. Annotation21e47263-4971-4963-9179-20ad8ff87a74 records the release. Existing Google/Bing sitemap registration and tracker retained.

## Delivered entry points

- Home: https://pinnacleblooms.org/ask
- Example answer: https://pinnacleblooms.org/ask/what-happens-during-occupational-therapy-sessions
- Fourteen directories: /ask/conditions, /behaviours, /skills, /abilities, /domains, /ages, /life-skills, /assessments, /readiness, /therapies, /techniques, /people, /standards-icf, /standards-icd (all beneath /ask).
- Populated lenses: https://pinnacleblooms.org/ask/lens
- Topic: https://pinnacleblooms.org/ask/autism
- Guidance: /ask/abilityscore, /how-to, /materials, /myths, /compare, /parents/wellbeing, /access/financial, /access/legal (all beneath /ask).
- Search: https://pinnacleblooms.org/ask/search?q=speech
- Telugu: https://pinnacleblooms.org/ask/te
- Cite/retrieve: https://pinnacleblooms.org/ask/dataset
- Machine map: https://pinnacleblooms.org/ask/sitemap.xml

Complete canonical URL manifest, sitemap delta, production contracts, focused checks, browser/device sessions and Lighthouse summary are saved in deployment/ and reviews/. Shared source changes must build and deploy both targets from the same revision.

## Remaining bounded issues and external outcomes

1. Cloudflare's automatic RUM beacon is redirected apex-to-www and blocked by CORS, accounting for the96 best-practices score. The shared consent-controlled measurement works separately. A narrow Cloudflare configuration rule can disable automatic RUM on apex /ask, as already done for selected Speech pages. Wrangler configuration access returned403; cache purge returned401; the browser dashboard requires sign-in. No success or purge is claimed. This does not block page reading, navigation, sharing or contact links.
2. The unchanged shared therapy rail at601–900px has tight label spacing. More still opens the full usable menu. Any shared visual refinement must be released across both targets, not privately patched into Ask.
3. One existing browser initially reused its old homepage cache; refresh delivered the new version. New HTML uses max-age0 and versioned edge caching. A server cannot erase an already-open browser's local cache.
4. New rankings, AI citations, connected calls and admissions require later evidence. This migration is not a new clinical review of the corpus. OpenAI directory publication retains its separate publisher/attestation gate. Held PinnacleAI scholar/Figma work remains held for the owner's diagram.

## Validation already completed
- 43 local route/metadata checks passed, including the home, 14 dimensions, all eight guidance entrances, answer, two institutional overrides, Telugu home/directory, search, missing paths and machine resources.
- Desktop visual inspection at1440; answer width checks320/390/768/1024/1440, no horizontal overflow or compressed card columns.
- 21 shared measurement tests passed using retained compiled therapy fixtures for the three unrelated rendered-page cases.
- One independent source reviewer. Findings fixed: search shape; Telugu topic locale; global indexing; cache isolation; source-bound references; institutional FAQ/date preservation; coarse consented Ask events.
- Direct public answer availability includes 41,165 published/public answer rows. Collection membership excludes retired question links; this does not remove published answers.
- Images: reuse of existing approved Pinnacle family creative on Ask home; existing per-answer social image contracts retained.

## Source-sensitive work
A repeated institutional-exclusive diagnosis sentence was corrected in published answer text/summary with an exact-match update. Original fields are recoverable in access-restricted ask_copy_revision_20261003. This was not a new clinical review of the corpus. Source update/review dates were not fabricated.
One expanded catalogue query was too costly and was replaced with the bounded existing catalogue plus indexed direct facet queries. Supabase briefly rejected connections, then reported ACTIVE_HEALTHY; the corrected catalogue and43route checks succeeded.
No new private visitor/query store. Search no-store and noindex; no search text in public cache or analytics. Optional consented events use the fixed Ask root and fixed title, not question slugs or query values. A click is not a connected call.

## Migration replay order (do not sort alphabetically)
1. ask-runtime/migrations/20261003_public_reading_model.sql
2. ask-runtime/migrations/20261003_public_primary_facets.sql
3. ask-runtime/migrations/20261003_inline_facets_catalogue.sql
4. ask-runtime/migrations/20261003_topic_sitemap.sql
5. ask-runtime/migrations/20261003_exact_copy_correction.sql
6. ask-runtime/migrations/20261003_exact_copy_correction_followup.sql
The copy correction followup is bounded by a120second transaction timeout. The first30second attempt rolled back. No guard was bypassed.

## Build and release
npm run build:ask builds the Ask SSR target; npm run build retains the existing static portal target.
npm run preview:ask runs local4330. Stop preview before rebuilding on Windows to release the asset directory.
Both targets import the same shared components and common measurement source. Any future shared-shell change must build/release both targets from the same source commit.
Deploy the generated dist-ask/server/wrangler.json with versions upload --keep-vars, then promote only the verified Ask version. Never pass --route.
Secrets remain in ignored local files/Cloudflare bindings. Source repository has no copied credentials.
The release script preserves the whole zone route set and the main portal/MCP versions, records Ask rollback, and verifies the candidate bindings before cutover.

## Limits
This is a presentation/routing/data-access migration, not independent clinical validation of41kanswers, a ranking guarantee or proof of AI citation.
Language facets use actual public data; a missing translation is not invented. Only populated directories are linked from the lens catalogue. Primary-field routes also resolve their exact stored values.
The current remote MCP registry publication remains a separate publisher-auth task.
