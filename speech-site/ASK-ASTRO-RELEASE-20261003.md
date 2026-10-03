# Ask Astro release — 3 October 2026

## Delivery
Candidate built; local route and responsive checks completed; production deployment receipt will confirm cutover.
One common source for SiteHeader, SiteFooter and VerifyFooter. No design change to those three components.
One dynamic answer template. Supabase remains the content store. Ask's apex canonicals, legacy assets and independent MCP stay supported.

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
