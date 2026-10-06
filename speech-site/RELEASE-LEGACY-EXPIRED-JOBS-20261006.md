# Shared expired job graph — 6 October 2026

## Problem and resulting behavior

Existing Ahrefs rich-result samples led to a reproducible current template defect: five JobPosting objects, each expiring on 31 December 2025, appear on therapy and child-story pages. The same exact graph appears on physiotherapy. The release removes only the captured obsolete graph from the existing guarded legacy response pipeline. Visible clinical content, all links, other schema, common navigation and unrelated services remain intact.

Google's [JobPosting guidance](https://developers.google.com/search/docs/appearance/structured-data/job-posting) restricts job markup to dedicated single-job pages and permits removing obsolete JobPosting structured data. This repair does not assert any new vacancy, salary, clinical outcome or business identity.

## Scope and safeguards

- Source: `8759826786f0b505b311a0ae85c3da6002dedcef`, pushed to main.
- Exact normalized payload fingerprint: `eee6f24856abce7f793489c5335315d223fb8d25b33260dd420a25a91f6b9ebe`.
- Existing public-response, canonical, privacy, route and 256 KiB script guards retained. Changed vacancies, future expiry, mixed graphs, foreign contexts, other serialization and malformed payloads pass through.
- The captured graph contains only five expired jobs and their own nested details; it has no separate unrelated evidence node.
- 59 focused runtime/schema cases passed, zero failed/skipped. One read-only reviewer verified the fingerprint and scope; the reviewer did not rerun the tests.
- Permanent CI now includes the schema regression suite.
- Baseline: legacy Worker `46fa8ad2-f64c-47e1-a78b-db27d849b331`; all 228 routes, nine modules and five protected Worker versions captured before editing. The committed baseline bundle matched the current live entry.
- A routine existing Wrangler credential refresh resolved an initial 401 without new access or a user prompt.

## Acceptance and remaining boundary

Before/after public comparison covers `/t/action-flash-therapy`, `/mirracles/20688927160/-Match-Learn-369172` and `/physiotherapy`. Each must lose only its exact five-job graph; all remaining JSON-LD, visible content and links must match. Homepage and migrated FAQ are controls. Guarded configuration read-back must preserve the full routes/bindings, eight unrelated modules and current Portal/Shop, Ask, Ask MCP, centre and helpline Worker versions.

The homepage has a different compact five-job graph and is served by another runtime owner; it is explicitly outside this bounded legacy release. Its correction remains a separate executable follow-up. Intermittent legacy 500s still need a matched failing route/time and actual origin exception evidence. Current samples returning 200 do not close that defect.

No new full crawl, paid browser/device session, enquiry, call, email, purchase, scheduler or duplicate indexing submission was made. This invisible metadata change does not require repeated visual/device testing. The exact-source CI and public-release result are recorded below after acceptance. The next completed audit, rather than sample multiplication, must establish aggregate issue reduction. No health-100, indexing, ranking or qualified-lead uplift is claimed.

Receipt: `deployment/legacy-expired-jobs-20261006.json`. Current source/public/CI evidence: `../../pinnacle-growth-system/shared-error-next-20261006/`. Private baseline: `ask-private/legacy-expired-jobs-20261006/`.

## Verified release

- [Exact-source CI 37506998612](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37506998612) passed, including the permanent schema regressions, Ask build and hosted Firefox/WebKit checks.
- Live legacy version: `cfccd72a-9465-490c-bd8f-e3d31de24939`; deployment: `a2e62b23-764e-4ae9-841d-665de11949b7`.
- All three target URLs returned 200 and removed five obsolete job entries each. Technique scripts decreased 22 to 21; child-story scripts 10 to 9; physiotherapy scripts 10 to 9. Every remaining schema value, visible paragraph and link matches the captured before state.
- Homepage and migrated FAQ controls returned 200 and retained all content/schema/links. The homepage's compact expired graph remains a recorded follow-up; it is not silently declared fixed.
- All 228 routes and bindings were retained; eight unrelated legacy modules and five protected Worker versions were unchanged. Only the bundled legacy entry was replaced with current committed source. The portal asset union was not rebuilt or modified.
- Acceptance was saved as `verified-public`. No cache purge, extra crawl, device purchase or synthetic conversion was needed.
