# Ask Astro candidate — bounded source review

3 October 2026. Independent read-only review of the candidate in this isolated release checkout. Scope: `ask-runtime`, Ask components/layout/library/styles/config and the existing shared measurement script. Three local GET requests were used to reproduce specific source concerns. No tests, builds, code edits, database changes or deployment performed by this reviewer. Main owns visual acceptance and fixes. Findings describe the inspected pre-fix source; resolve against the owner's subsequent edits.

## Findings

### P1 — Search response shape breaks search and fallback guide rendering

**Locations:** `src/lib/ask/repository.ts:16`; `ask-runtime/pages/ask/[...path].astro:22`, `:28`; `src/components/ask/AnswerCards.astro:5`.

`ask_public_search` returns `{results:[...]}`, but the adapter returns that object directly and pages assign it to `data.items`. `AnswerCards` calls `items.filter`; guide/list code calls `data.items.map`. This fails during template rendering, outside the page frontmatter try/catch.

**Reproduced:** GET `http://127.0.0.1:4330/ask/search?q=speech` and `/ask/compare` each returned **HTTP200, text/html, zero-byte body**. Control `/ask/te/conditions` returned a populated page. This blocks release.

**Small fix:** unwrap and validate `results` in the search adapter; keep its contract an array. A malformed response should throw before render and produce the existing 503/no-store state. Recheck only search and guides taking search fallback.

### P1 — Telugu topic-directory links silently switch to English

**Location:** `src/components/ask/AskListing.astro:8`.

The `i.topic` branch constructs `ASK+'/'+topic`, ignoring the locale prefix. Only the lens fallback uses `prefix`. The Telugu conditions directory therefore presents Telugu counts but links some topics to their English route.

**Reproduced:** `/ask/te/conditions` emitted an `ask-topic-card` to `https://pinnacleblooms.org/ask/adhd`, while neighbouring fallback links used `/ask/te/lens/entity%3Acondition/...`.

**Small fix:** use the Telugu route prefix when linking a topic collection in that language, then retain real translated answer slugs for individual answers. Check a topic-backed tile and an entity-fallback tile once.

### P1 — The global indexing/launch hold is not applied across page families

**Locations:** `ask-runtime/pages/ask/[...path].astro:19`, `:39`; `ask-runtime/worker.ts:24`; `src/lib/ask/overrides.ts:5`; migration `:61`–`:65`.

Answers and collections use database eligibility, but home, populated directories, lens catalogue, dataset and institutional overrides default to indexable independently. `ask_portal_catalogue` returns `indexing_enabled`, but the page never consumes it. The navigation sitemap is a static list regardless of eligibility. The previous renderer applied the launch gate to these ordinary HTML families and the institutional overrides.

**Fix:** apply the settled global launch/indexing policy to every HTML family and sitemap inclusion, preserving per-answer/collection restrictions. Do not treat a configured hold as applying only to database answer pages. Verify the policy with an injected/local fixture; do not toggle production flags for testing.

### P2 — Actual facet support remains narrower than the approved route scope

**Locations:** migration `ask_portal_members` at `:18`–`:22`, `ask_portal_directory` at `:39`–`:54`; routes `:31`–`:32`.

Membership supports topic slug, explicit `entity:*`, direct intent and question_lens. It does not implement the earlier verified primary-field mappings for domain, age, readiness, lifecycle, route, score_band, component, empowerment, gender, body_system, phenomenon or developmental age. The public lens table has only 17 populated kinds and **zero Telugu memberships**. Thus an advertised/required lens cannot be deemed implemented merely because the catch-all calls this RPC; unsupported or Telugu-only views become missing/empty. Primary-field/entity content must be checked before concluding that a view has no content.

**Scope disposition:** either add the intended explicit mappings and publication guards, or record each unsupported kind as deferred and remove misleading navigation. Preserve legitimate existing routes through the canonical route manifest. This is a significant work-order gap, not proof that every absent kind has underlying content.

### P2 — The former HTML edge cache has no implemented replacement in this candidate

**Locations:** `ask-runtime/worker.ts:34`; page `:44`; migration `ask_portal_collection:29`.

The previous Worker used `caches.default.match/put`. The replacement does not; it sets `s-maxage=300` on HTML. A cache-control header is not evidence that dynamic Worker responses are being cached by the deployment. Collection SQL materializes the matching members before limiting the visible page, so this matters for public-crawl load and latency.

**Acceptance gap:** establish the actual bounded public cache path and invalidation/version rule, or document and validate intentional uncached operation. Keep search, errors, private queries and noindex/held output outside the public cache. No load test was performed in this review.

### P2 — Imported measurement script does not enable Ask measurement

**Locations:** `src/layouts/AskLayout.astro:22`; `public/pinnacle-pages-scripts/speech-measurement.js:4`, `:35`, `:45`, `:47`, `:57`; `AskAnswer.astro:24`.

The existing script requires the `www` origin and an exact configured page. Ask uses the apex origin and its paths are absent from that map, so production is false. The new `ask-answer-call` placement is also absent from the permitted call placements. Including the script does not establish working Ask consent-based call-click measurement. The old website-call tag is no longer inserted for these HTML pages.

**Scope disposition:** implement an explicit privacy-safe Ask measurement contract or mark measurement deferred. Keep all search/query text and document titles derived from query text out of events; do not equate link clicks with connected calls.

## Significant remaining work-order items

- **Full route and language reconciliation:** the accepted work order requires the complete known URL manifest, reserved-name collisions, legacy paths, eligible translations and populated facet coverage. The reading model is a useful start but not proof this inventory passes. Current alternate generation still derives base/`-te` slugs, and x-default is not emitted by the new layout; reciprocal genuine-translation coverage remains to be verified.
- **Answer graph completeness:** `related_materials` and `related_techniques` are returned by the answer RPC but never rendered by `AskAnswer`. Entity/topic backlinks and classification context are also reduced to a parent-dimension breadcrumb. Restore useful, resolvable links called for by the answer-template work order rather than claiming full graph preservation.
- **Institutional override parity:** override precedence is correctly before ordinary answer lookup, and BHCL/non-diagnostic/dated-count qualifications survive. However `overrides.ts` replaces the preserved five FAQs with three, drops the explicit 24/7 English/Telugu/Hindi helpline statement, and assigns `published_at`/`last_reviewed_at=2026-09-23` where the prior page stated an update date. Reconcile these intentional copy/metadata changes; a previous update date does not prove a clinical review or original publication date. Their old standalone header/footer need not survive the shared-shell migration.
- **Production acceptance still separate:** this review does not establish actual route bindings, secret/runtime bindings, non-HTML fallback parity, browser/device visual checks, deployed assets, cache behaviour, performance, CI, rollback or live read-back.

## Confirmed positive boundaries

- `AskLayout` directly imports the existing shared SiteHeader and SiteFooter; no duplicate old Ask header/footer in normal content.
- Direct answer lookup does not require an associated question, preserving published/public answers lacking parent metadata. Retired/private questions are excluded from the selected parent metadata.
- New reading model filters answers to published/public, fixes language-qualified answer lookup and makes associated-question selection deterministic. Source answer/question tables are not modified by this migration.
- Markdown uses a maintained parser plus tag/attribute/scheme sanitisation. JSON-LD escapes `<`; public card links validate slugs. No browser credential exposure was found in the reviewed source.
- Search intends no-store/noindex/referrer protection; unknown routes have a 404 branch and lookup errors have a 503 branch. Fix the response-shape error so rendering reaches those contracts reliably.
- Non-HTML legacy image/font/script/XSL routes remain explicitly forwarded; MCP is not merged into this HTML Worker.

## Final targeted source verification — former blockers resolved

3 October 2026. Re-read only the three requested fixes in current source; no HTTP requests, database queries, tests, new inventory or application edits.

- **Cache/query privacy: resolved.** `ask-runtime/worker.ts:36` excludes both `/ask/search` and `/ask/te/search`, and only permits query-free requests or numeric `page` parameters into the HTML cache. Cache writes at `:44` require a successful public response without Set-Cookie. `ask-runtime/pages/ask/[...path].astro:15` now reads/renders q only when the normalized page is search, so ordinary pages do not reflect free-text query values. Shared measurement excludes both search paths at `public/pinnacle-pages-scripts/speech-measurement.js:34`.
- **Malformed search response: resolved.** `src/lib/ask/repository.ts:23` accepts a valid array or results array, including an empty array, and throws `Invalid public search response` for an invalid envelope. An upstream malformed payload is no longer silently reported as zero matching answers.
- **Migration replay: resolved in release instructions.** `ASK-ASTRO-RELEASE-20261003.md:21` explicitly prohibits alphabetical replay and lists reading model → primary facets → inline facets/catalogue → topic sitemap → exact copy correction → followup. Dependencies and final overriding definitions are ordered correctly.

**No remaining release blocker found within these three verification items.** Encoded entity-category path handling is being corrected by the implementation owner and was outside this final targeted check. This source verification does not replace the owner's candidate build, local route evidence, guarded deployment or production read-back.
