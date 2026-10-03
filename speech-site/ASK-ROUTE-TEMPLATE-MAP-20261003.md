# Ask: deployed route and template map

Verified 3 October 2026 by a bounded, read-only inspection. No application code, account, route or deployment was changed. This report maps the exact deployed-bundle snapshot supplied by the main agent; it is not a new live crawl.

**Source:** `C:/Users/Siri Palace/Documents/Codex/2026-09-15/k/work/ask-distribution-release-20261003/ask-service/worker/index.js` (798,268 bytes; SHA-256 `B43A5ED356F50A79964D0FCFBB500CDB6C16A3D0412720EA84DA0D6C1D065353`). All `index.js:L` references below refer to that file.

## 1. Architectural conclusion

**Yes: one shared answer renderer, `atomPage(ctx, answer)`, serves the published answer records.** It is not tens of thousands of individual page templates. The supplied current database receipt contains **41,165 published answer rows: 32,903 English + 8,262 Telugu**, with other rows in draft. Those are database row counts, not a count of independently verified public URLs. The earlier sitemap inventory had a different scope and should not be substituted for this count. See `../ask-service/receipts/database-architecture.json:2` and `index.js:3279`, `3770`.

The complete application also has a home renderer, five browse/wayfinding renderer families, a real search renderer, two protected institutional answer overrides, 404/503 handling, assets, share cards, sitemaps and machine text. Almost all ordinary HTML passes through one `shell(ctx)`; the two institutional overrides produce their own full HTML. An Astro migration needs to preserve these contracts while replacing their presentation.

## 2. Actual router and render mapping

Paths below are relative to `/ask`. Trailing slashes are stripped internally. `/ask/te/...` is the supported non-default language prefix.

| URL pattern | Actual template / result | Data dependency and relevant lines |
|---|---|---|
| `/` | `homeMain` -> `shell` | `ask_home(p_lang)` with no-argument fallback; only `data.counts.kinds` is placed into page context. Six fixed chambers supply the navigation content. `1955`, `2426`, `2659`, `3723`. |
| `/conditions`, `/skills`, `/abilities`, `/domains`, `/ages`, `/life-skills`, `/assessments`, `/readiness` | `dimensionPage` -> `universalPage` -> `shell` | **8** fixed `DIMS` entries; tiles come from fixed `V[kind]`, with optional counts from home. No category/list RPC. `2755`, `2827`, `3767`. |
| `/abilityscore`, `/how-to`, `/materials`, `/myths`, `/compare` | `toolPage` -> `universalPage` -> `shell` | **5** fixed `TOOLS` entries and links; these are navigation/content pages, not five executable assessment/comparison tools. Several tiles link back to their own page. `2780`, `3011`, `3801`. |
| `/lens/{kind}` | `lensIndexPage` -> universal -> shell | Accepted only when `V[kind]` exists; lists fixed values. `2882`, `3122`, `3768`. |
| `/lens/{kind}/{value...}` | `lensValuePage` -> universal -> shell | For a registered kind, any remaining nonempty path becomes a value (including extra `/` segments). Known label or title-cased fallback; fixed siblings + six generic Ways in. Does **not** query matching answers or validate the value. `2905`, `3126`, `3769`. |
| `/{slug}` after reserved names above | First published answer; otherwise known entity hub; otherwise 404 | `routedAskAnswer` -> `ask_answer`; if answer exists, `atomMeta` + `atomPage` -> shell. If absent, `knownAskEntityHub` checks one joined published question, then `entityHubPage` renders static journey links. Lookup failures are 503 rather than false 404. `1993`, `2001`, `2014`, `2962`, `3770`. |
| `/search?q=...` | `searchResultsResponse` -> shell | `ask_public_search(p_q,p_k:10)`, minimum 2 characters, query capped at 200; published result cards, empty state and 503 error state. Private/no-store, noindex/follow, no-referrer. `3034`, `3802`. |
| `/what-is-pinnacle-blooms-network` and `/what-is-pinnacle-blooms-network-and-how-does-it-help-my-child` | `renderVerifiedNetwork`, separate full HTML | Hardcoded evidence-qualified institution content takes precedence over the database answer and HTML cache. GET/HEAD only; other methods 405. Own canonical, organisation/WebPage/FAQ schema, CTAs. `3921`, `3933`, `3949`, `3979`. |
| Unmatched multi-segment path or missing single slug | `notFound` -> shell, HTTP 404 | Noindex/nofollow, no-store; search/browse recovery links. Canonical points to Ask root. `3811`, `3815`, `3835`. |

`universalPage` is a common assembly layer for hero, connector, sections, navigation blocks and closing block (`2742`); it does not fetch content. The old `searchPage` function remains in the bundle (`3073`) but is **not called by the active router**: search dispatch returns `searchResultsResponse` directly.

### Aliases and host behaviour

- On host `ask.pinnacleblooms.org`, paths without `/ask` are internally rewritten to `/ask/...` (`3425`–`3429`). Thus the legacy subdomain root and its short paths can resolve through the same logic; this is not an HTTP redirect.
- The two institutional overrides explicitly accept their short paths on the old Ask subdomain as well (`3951`).
- Trailing-slash stripping is internal, not a redirect (`3430`). Repeated interior slashes are filtered by archetype parsing, but the canonical uses the original normalized path; avoid treating that as a deliberate alias policy (`3116`, `3440`).
- There is **no explicit alias table or redirect mapping** in this bundle for renamed dimension keys, alternate category terms, `/home`, or `/lens`. A single-segment name not in DIMS/TOOLS is merely tried as a database answer/entity slug.
- `www`/apex route assignment and any front-router redirects are outside this Ask bundle and need their separate route receipts preserved.

## 3. Registered navigation versus database architecture

### Counts and exact differences

| Layer | Verified scope |
|---|---|
| Worker `DIMS` | 8 route keys listed above (`2755`). |
| Worker `TOOLS` | 5 route keys listed above (`2780`). |
| Worker `V` | **24 routed lens kinds** (`1148`–`1180`). |
| Worker navigation `LENSES` | **26 advertised kinds** (`1286`–`1313`), a different set from V. |
| Database `ask_dimension` receipt | **17 active rows**; see `../ask-service/receipts/database-architecture.json:40`. These do not create Worker routes automatically. |
| Database lens/graph totals reported by main agent | 26 `pinnacle_lens` kinds, 63,265 `pinnacle_question_link`, 55,432 `pinnacle_question_lens`, 24,131 `pinnacle_qfacet` rows. These are whole-table totals, not guaranteed published links. |

The 24 routed V kinds are: `condition`, `phenomenon`, `intent`, `age`, `domain`, `gender`, `skill`, `ability`, `readiness`, `stakeholder`, `institution`, `route`, `assessment`, `empowerment`, `lifecycle`, `rag_status`, `score_band`, `body_system`, `component`, `lifeskill`, `self_voice`, `icd11`, `icf`, `sdg`.

**Advertised but not registered:** `dev_age`, `organ`, `language`, `ichi`, `snomed` appear in LENSES/navigation but not V. `/ask/lens/{one-of-these}` and child paths fall to 404 in this code. **Registered but absent from LENSES:** `institution`, `lifeskill`, `self_voice`. These still have navigation in other sections. See `1352`–`1359`, `1423`–`1427`, `1466`–`1470`, `3122`.

Database dimension keys are `conditions`, `behaviours`, `skills`, `abilities`, `domains`, `ages`, `assessments`, `abilityscore`, `readiness`, `therapies`, `techniques`, `materials`, `myths`, `lifeskills`, `people`, `standards-icf`, `standards-icd`. For example, database `lifeskills` versus Worker `life-skills`, `techniques` versus `how-to`, and source kinds such as `instrument` versus Worker lens `assessment` require explicit mappings; they are not proved aliases.

### What the current HTML actually uses

`dimensionPage` and `lensIndexPage` use fixed V arrays. Home blocks use fixed DOORS/V entries (`1283`, `2635`). `lensValuePage` uses fixed siblings and generic links to search, early signs, how-to, therapies and assessments (`2928`). `entityHubPage` builds eight fixed journey links (`2964`), after a one-row publication-existence check; it does **not** render the entity's real question list.

**There is no `ask_category` call in the bundle.** The database receipt's `ask_category(p_kind,p_value,p_k default 200)` already groups published questions through `ask_intent_cluster`, supplies answer URLs, code mappings, dimension/provenance metadata, and an indexing flag requiring at least eight matching questions plus the indexing switch (`../ask-service/receipts/database-architecture.json:218`). Main agent confirms seven intent clusters in the database. This RPC is designed around entity-kind/key or slug; it is not automatically a universal resolver for all lens facets.

Two adapter details matter: `p_k` is declared but not applied as a limit in the captured category SQL, and the returned canonical path is `/ask/{entity_slug}`. Do not assume bounded pagination or make `/lens/...` and entity URLs competing self-canonicals without a deliberate mapping.

**Actual answer crosslinks are real data-driven links:** `a.parent.category`, entity/dimension/domain/persona tags, authority links, and up to eight `a.related` answers. These survive through `atomTags`, `atomSchema` and `atomPage` (`3208`, `3222`, `3285`, `3292`, `3295`). The existence of a large database graph does not establish that every edge is rendered.

## 4. Answer and shell contracts to retain

`atomPage` (`3279`–`3322`) renders title/question, summary, breadcrumb, entity/tag strip, generated SVG, answer Markdown, optional What to watch and home tip, authority links, review/provenance text, FAQs, related questions, CTAs and share-card link. `atomMeta` (`3326`) supplies title, description, answer canonical, genuine translation alternates where provided, PNG/SVG URLs and indexability. `atomSchema` (`3222`) emits MedicalWebPage/FAQPage, about/codes, publication/review dates, speakable selectors, collection membership, mentions and breadcrumbs.

`shell(ctx)` (`2418`) currently combines head/schema, skip link, masthead/navigation, optional masthead band, main content, search band, authority band, lead rail, optional about FAQ and footer. Menu closing and native-share/copy-link behaviour lives in `/m.js` (`3136`). Google website-call tracking is added at the response layer, except private search (`3963`). The Astro shared shell should own common layout once and preserve the page-specific content/metadata contracts without duplicate headers, footers, schema or tracking tags.

## 5. Non-HTML endpoints and dependencies

| Endpoint relative to `/ask` | Function / data |
|---|---|
| `/gads.js`, `/m.js` | Tracking and menu/share JavaScript, `3441`, `3448`. |
| `/f/archivo.woff2`, `/f/te-serif700.woff2`, `/f/te-sans600.woff2`, `/f/te-sans400.woff2` | Embedded font bytes, `3459`, `3469`. |
| `/logo.png` | Embedded PNG, `3480`. |
| `/og/{token}.svg` or `.png` | `ogResponse` / `buildCard`; token-based share-card rendering, R2 storage, PNG renderer, QR fetch, `3456`, `3847`, `3874`. |
| `/{slug}.svg` or `.png` | R2 object -> cached/RPC `ask_card_hash` mapping -> `ask_answer` + render fallback; R2/KV caching, `3492`–`3554`. |
| `/robots.txt` | Ask-scoped text crawl instructions, `3558`. This is not the canonical host-root robots policy. |
| `/llms.txt` | Fixed machine-readable navigation map and external MCP URL, `3639`. |
| `/sitemap.xsl` | Human-readable sitemap stylesheet, `3663`. |
| `/sitemap.xml` | `ask_sitemap(p_page:0,p_size:1)` total -> shard index, minimum one shard, `3670`. |
| `/sitemap-{n}.xml` | `ask_sitemap(p_page:n,p_size:10000)`; 6h KV cache, en/te/x-default alternates, optional image; empty shard 404, `3689`. |

The separate `https://ask-mcp.pinnacleblooms.org/mcp` service is linked, not implemented by this Worker. No JSON API, form-submission backend, `/llms-full.txt` text handler or `/dataset` handler is implemented here. The latter two are advertised at `1491`–`1492` but fall into single-slug answer/entity lookup; they are not proved working machine endpoints.

RPC/data inventory in this bundle: `ask_launched`, `ask_home`, `ask_answer`, `ask_public_search`, `ask_card_hash`, `ask_sitemap`, and one REST read of `pinnacle_question` joined to `pinnacle_answer`. The RPC helpers rewrite retired Ask/Workers host strings to the canonical origin/base recursively (`1904`–`1944`). Generic RPC failures return null after retry; checked answer/search lookups throw after retry so active routes can distinguish outages from missing content (`1972`).

## 6. Language, canonical, indexing and cache behaviour

- English and Telugu are the only active LOCALES (`1737`). Hindi/Kannada/Tamil are menu entries marked not live (`1473`). English is unprefixed; only supported nondefault prefixes are stripped (`1818`, `1825`). `/ask/en/...` is not a supported English alias.
- Telugu answer request first tries `{slug}-te`, then the original slug (`2014`). Actual returned `a.lang`, canonical and translation metadata govern the answer (`3784`). Static browse copy is mostly English with partial Telugu chrome/dictionary; a Telugu path alone does not prove full translation.
- Answer canonical prefers the RPC canonical; alternates prefer `a.i18n.alternates` with x-default; fallback is en + x-default at the same canonical (`3328`). Browse/home generate en/te alternates mechanically (`3434`). Sitemaps also generate both regardless of per-answer translation availability (`3709`).
- Search sets canonical to the English `/ask/search`, strips query from canonical, uses noindex/follow, private/no-store and no-referrer (`3038`, `3063`). Its inherited hreflang context should be reconciled during migration.
- Answer robots respect `index_state`, `meta_robots` and launch state (`3340`, `3795`). Browse pages use only launch state, not category threshold. `ask_launched` is memoized on env and defaults to launched if its RPC returns null (`1956`).
- General HTML is cached only for query-free GET, status 200, HTML and indexable header; versioned cache key `?__ask_html=20261003-search-citations`; 600s shared cache with 86400s stale allowance (`3839`, `3982`). Network overrides bypass that HTML cache. Search is never stored. Avoid confusing HTML caching with separate sitemap/card KV/R2 caches.

## 7. Migration order and concrete pitfalls

1. **Keep explicit endpoints and protected network articles before the dynamic slug route.** Reserved dimension/tool/search names currently win over a DB answer of the same slug (`3114`). Images/sitemaps/assets also win before HTML (`3441`–`3722`).
2. **Build real category and facet question-list adapters.** Preserve the eight current dimension routes, five thematic routes and 24 valid lens kinds, while explicitly mapping all 17 DB dimensions and 26 DB lens kinds. Use published questions and actual links; apply publication/indexing thresholds and bounded pagination. Do not recreate fixed loops as the finished browse experience.
3. **Validate lens kind and value.** Current registered-kind/unknown-value paths return generic indexable pages; extra path segments are accepted as a value. Unknown lens kinds 404. Preserve intended URLs while correcting invented empty categories deliberately.
4. **Resolve advertised paths lacking handlers.** `/parents/wellbeing`, `/access/financial`, `/access/legal` are emitted at `1440`–`1447` but unmatched by this router. `/home`, `/code`, `/milestones`, `/transitions`, `/adulthood`, `/family`, `/counselling`, `/rights`, `/outlook`, `/lens`, `/dataset`, `/llms-full.txt` have no explicit template mapping; their availability depends on answer/entity lookup. Do not count navigation text as an implemented feature.
5. **Retain confirmed 404 versus upstream 503, search privacy, multilingual canonical/alternate contracts, related answers, evidence overrides, card endpoints and sitemap contracts.** Do not replace them all with one catch-all page.
6. **Move presentation claims through the evidence review already underway.** This bundle still contains hardcoded counts and offers in home/chrome/tool/CTA text (for example `1759`, `2679`, `2784`, `3271`). A layout migration must not silently treat those strings as current database facts or new offer authorisation.

Recommended acceptance coverage: one published English and translated Telugu answer with metadata/related links, one absent answer, one unavailable-data response, every registered dimension/tool/lens kind, a valid and invalid lens value, real category pagination, both protected institutional answers, search successful/empty/error cases, legacy-host/canonical paths, cards/fonts/scripts and sitemap index/shards. Compare route bindings separately; this source inspection does not prove those bindings or search indexing.
