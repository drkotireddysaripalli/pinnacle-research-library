# Legacy schema term correction · 4 October 2026

Action DATA-COMPLETED-AUDITS / 336af2d7-abe4-4589-9703-c519c1a5ccfd.

## Observed defect and scope

The existing Ahrefs main crawl (project 10477823, completed 2026-10-04T06:11:18Z) reports 10,009 schema.org notices. One bounded three-row follow-up cost 50 API units and returned no field-level error detail. A due read of Ask project 10477830 still has no completed crawl; no crawl was started or restarted.

Current public captures establish two incorrectly capitalised Schema.org terms: `Webpage` instead of `WebPage`, and `SpeakableSpecification.xPath` instead of `xpath`. Official references: https://schema.org/WebPage and https://schema.org/xpath . The Telugu ABA category, physiotherapy page and services hub contain these defects. The sampled English/Hindi detailed FAQs do not and remain content controls.

The existing legacy Worker applies this correction only after its private public-response/canonical guard succeeds. No route is added or reassigned. No Astro/common header/footer, visible narrative, phone link, claim, identity, commerce record or authentication setting is edited.

`schema.mjs` parses only JSON-LD scripts with the known schema.org root context. It corrects the exact observed property/type spellings, preserves every unrelated byte through exact token replacements, skips conflicting xpath declarations, and passes through malformed or over-limit scripts. Script buffering is bounded at 256 Ki characters. Unknown root or nested contexts, context resets, duplicate keys and unrelated JavaScript remain unchanged. Large integers and precise decimals retain their exact original tokens. The existing response privacy and route guards remain authoritative.

## Explicit remaining work

The detailed FAQ pages include a malformed shared Organization graph with trailing commas and stale identity/claim fields. This release leaves that graph unchanged: merely making it parseable would activate unreviewed legacy claims. Its source reconciliation requires a separate, bounded repair. No assertion is made that these two term corrections resolve all Ahrefs notices or provide comprehensive structured-data validity.

## Release and verification

Fresh baseline: all 194 routes, five Workers' binding sets and active versions; legacy Worker rollback `78567d26-c85c-44e9-ae42-35c0f0ed4b91`. `release-schema.mjs prepare|upload|deploy|verify <receipt-directory>` requires the exact source to be origin/main, checks concurrent changes, uploads four modules, changes only this Worker's active version, and checks preserved infrastructure. It never invokes a narrowed route deployment.

Focused local runtime suite: 60 passes, zero failures, including five current production HTML captures. After the independent reviewer identified context inheritance and numeric precision concerns, the transform was made lossless; 12 affected checks passed, including the three changed production captures. The prior 48 unchanged metadata/payload checks are reused. Tests cover split UTF-8/script chunks, malformed/oversized JSON, context guards, private/authenticated responses, legacy payload removal and aliases. Public acceptance compares all HTML bytes after normalising only pre-existing dynamic Cloudflare analytics/font order and allowing the exact JSON-LD term change. No rendered layout change is intended or claimed; no physical device test is implied.

Receipt directory: `work/pinnacle-growth-system/legacy-schema-20261004` in the main workspace. Final public/deployment receipt follows release. Use the next scheduled audit for new audit counts; do not recrawl or claim indexing, ranking, AI citation or enquiries from this repair.
