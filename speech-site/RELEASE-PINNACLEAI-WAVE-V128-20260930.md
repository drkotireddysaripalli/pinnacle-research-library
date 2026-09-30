# PinnacleAI connected product wave — release v128

30 September 2026

## Public result

Nine connected, indexable PinnacleAI® pages are live: [PinnacleAI overview](https://www.pinnacleblooms.org/pinnacleai), [AbilityScore®](https://www.pinnacleblooms.org/abilityscore), [Seven Readiness Indexes](https://www.pinnacleblooms.org/seven-readiness-indexes), [Personal Development Kernel](https://www.pinnacleblooms.org/personal-development-kernel), [Prognose](https://www.pinnacleblooms.org/prognose), [TherapeuticAI®](https://www.pinnacleblooms.org/therapeuticai), [Everyday Therapy™](https://www.pinnacleblooms.org/everyday-therapy), [Fusion](https://www.pinnacleblooms.org/fusion-module) and [Reassess, Review and Repeat](https://www.pinnacleblooms.org/reassess-review-repeat). Each page gives a specific parent-facing answer, one illustrative everyday example, its place in the connected system, sourced limitations, family questions and a call/centre/enrolment path. The child's desired everyday participation and growing independence remain the purpose; the software modules support human decisions and do not promise an individual result.

The pages use nine different complete Pinnacle-branded social creatives generated in this Codex conversation, plus a separate illustrative family scene. The artwork depicts fictional people, not documented beneficiaries. Sources and SHA-256 hashes are in `ASSET-SOURCES.md`. Essential copy stays in HTML. The shared Sintony header, navigation, Verify gateway and footer are reused from one source across all 19 managed pages; only their common navigation data changed to point to the new pages. `/verify/`, the helpline and unrelated origin paths retain their separate handling.

## Search, citation and evidence package

Every page has a unique title, description, H1, canonical, OG/Twitter image, crawlable linked module map, source rail, matching visible FAQ/JSON-LD, product or term entity and citation-ready JSON, text and Markdown. The overview's `SoftwareApplication` schema describes licensed non-diagnostic scope; the module pages use `DefinedTerm` and do not inherit a therapy `Service` claim. The [product sitemap](https://www.pinnacleblooms.org/pinnacleai/sitemap.xml) and [reading guide](https://www.pinnacleblooms.org/pinnacleai/llms.txt) are live; the root sitemap and `llms.txt` include them. `/pinnacle-ai` and `/ability-score` permanently redirect to their exact canonicals; trailing slashes converge too.

The supplied mechanism/evidence papers and Sovereign presentation guided the explanation and visual architecture. Current Verify records govern public claims where they conflict. The pages do not present a planned external comparator protocol as completed validation, a network service count as clinical benefit, an Indian FSC as foreign registration, or the MD-5/BIS records as a guarantee or therapist credential. The scope decision is documented in `ACTIVE-PINNACLEAI-WAVE-WORK-ORDER.md`.

## Source, Worker and trigger state

- Source commits pushed to the existing GitHub `main`: `a432240` (nine-page wave), `ae674c1` (embedded Worker inventory) and `e235373` (accessible overview cards and final validation scripts). The release receipt is committed separately after live read-back.
- The full Verify plus portal union was staged from `..\verify-site`. The final Wrangler dry run read 1,609 files and attached five supporting modules with `ASSETS`, `PINNACLE_LEGACY`, `PINNACLE_ASK` and `run_worker_first: true`. The deployment used no restrictive `--route` flag.
- Final Worker version `3e047f76-9b82-468a-b139-8102cebedb11`, deployment `3c1ebfc0-48e6-4b0c-9191-fbad57e5034c`, serves 100% traffic. Immediate prior wave version `f5d4a13f-4a59-4465-9d5a-bdbcedbb0f4a`; pre-wave v127 version `ddd4aea5-caa8-4fde-b2c4-f4f064463ce7`.
- Eleven exact product/alias prefix triggers were created through Cloudflare's routes API and read back after the final deploy. The zone has 154 total route records; all eleven point to `pinnacle-verify-route`. The Worker checks exact approved pathnames before serving and passes other captured prefixes to existing origin handling. Trigger IDs and patterns are in `deployment/pinnacleai-wave-routes-20260930.json`.

## Validation

- Production build: 21 pages. Focused route, discovery, enrolment, centre and measurement suite: 60/60 pass. Local Chrome responsive check: nine pages at 320, 390, 768, 1024 and 1440 pixels, 45/45 combinations; no document overflow, broken required images, duplicate IDs, missing anchors or page errors.
- Final public read-back: all nine HTML and Markdown pages HTTP 200 and matched their staged outputs after removing only the established Cloudflare delivery injection. Nine social JPEGs had distinct public URLs and matched staged bytes. Nine JSON and nine text source maps matched staged bytes. Eleven alias tests and eight sitemap/Verify/FSC/helpline controls passed. Three similarly prefixed legacy origin pages remained HTTP 200 and were not replaced by the new wildcard triggers.
- The 19 managed pages rendered byte-identical shared header and footer after normalising the current-page attribute. The Verify gateway appeared once inside each common footer.
- W3C Nu final local and public checks: **zero errors and zero warnings on all nine pages**. A three-heading warning in the first public overview was fixed in the final version.
- One IndexNow notification for the nine newly published/rebuilt canonicals returned HTTP 200 on 30 September 2026. It confirms submission, not crawling, indexing, ranking, AI citation or conversion.

Saved checks: `deployment/pinnacleai-wave-live-20260930.json`, `deployment/pinnacleai-wave-machine-live-20260930.json`, `deployment/pinnacleai-wave-shared-shell-live-20260930.json`, `deployment/pinnacleai-wave-w3c-local-20260930.json`, `deployment/pinnacleai-wave-w3c-live-20260930.json` and `deployment/indexnow-pinnacleai-wave-20260930.json`.

## Next observation

Search Console and Bing discovery/indexing, search queries, AI citations, referred visits, connected calls and actual enrolments must be observed separately. Three older origin pages remain separate: `/pinnacle-ai-innovations-revolutionizing-autism-history`, `/abilityscore-global-study` and `/therapeuticai-effectiveness-study`. The latter two have strong outcome/accuracy wording in their current page titles. Review their actual source evidence, distinct content and backlinks before changing or redirecting them; the new Worker intentionally passes them through. No automatic repeat IndexNow submission is due while the nine canonicals remain unchanged.
