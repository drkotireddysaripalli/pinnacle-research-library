# Public knowledge collection recovery — 5 October 2026

## Change

Replace the oversized legacy FAQ family with focused answers and compact language/topic collections. Reuse the approved common header/footer and Ask Google reader identity. Replace the Sunshine hub and the 17 MB Mirracles archive with linked, paginated directories.

- 4,564 FAQ records across seven languages retain their original slugs; supported old short aliases resolve to one canonical answer.
- All 295 FAQ/Sunshine URLs in the saved GSC window resolve in the candidate. That window records 197 clicks and 13,537 impressions, 5 September–2 October; it is not a whole-site traffic share.
- Sunshine links 1,826 source records matched to actual public paths. Individual topic pages retain their existing route owners. This is not a migration of every Sunshine detail page.
- Mirracles retains 28,334 unique numeric-record destinations. The 2,043 malformed `UPLOADED` paths in the captured archive are not promoted; no detail URL is deleted or remapped by this release.
- Collection pagination exposes ordinary HTML links to every retained item. Three child sitemaps, exact canonicals, answer/schema parity, language alternatives, source images/social fallback and contact paths are included.
- No database writes, new identity scopes, private patient import, shared-shell redesign or API-key model gateway.

## Validation before promotion

30 focused content/authentication tests pass. All retained FAQ records have corresponding detail data, supported routes and reciprocal language alternatives. The 27 HTTP acceptance checks include seven languages, irrelevant-answer-parameter redirects, unknown-page 404s, private searches, three sitemaps, canonical/social metadata and qualified evidence text.

Visual coverage: Chromium at 320/768/1440 px on six templates, anonymous Google overlay at 390 px; final answer render in Chromium at 390 px and WebKit at 768 px. Read-only independent review found four concrete issues; telephone/email preservation, canonical parameters, structured qualifier parity and decoded entities were corrected. Authored line breaks remain readable. Local Firefox failed to start (`spawn UNKNOWN`), and is not reported as passed. Local identity service has no production secrets; signed-in layout uses an explicitly synthetic browser response. Live anonymous identity must pass before close-out.

Production build succeeds. Preview raw HTML: FAQ 160,685 bytes (legacy 3,362,779); Sunshine 159,846 (legacy 694,195); Mirracles 207,845 (legacy 17,062,921). Final live bytes and exact release proof are recorded in the deployment receipts.

## Release controls

Check in and push the exact candidate, pass CI, upload an inactive Ask version, preserve 21 Ask bindings and the existing Portal/MCP versions. Change only the two existing FAQ/Mirracles route owners and add the four apex/www knowledge-family routes. Preserve all other original routes. Record rollback version and exact public read-back before calling this deployed. No narrowed `--route` deployment.

## Health-score limit and next work

Ahrefs main-project snapshot at 14:24 UTC is still an in-progress crawl: 21/100, 10,828 crawled URLs, 8,562 error-bearing URLs, 7,981 orphans and 610 oversized pages. These groups overlap. The 250-URL oversized sample contains 249 FAQ URLs and the Mirracles archive. The orphan sample includes staff and story URLs; staff directory eligibility/discovery and the remaining broken destinations require their own bounded corrections. Do not equate this release with 100/100 or trigger duplicate unchanged crawls. A completed subsequent audit must measure the residual errors.

Release status and public evidence: `deployment/knowledge-recovery-20261005.json`, `deployment/knowledge-recovery-20261005-routes.json`, `deployment/knowledge-public-20261005.json` and the final delivery receipt. Until those show promotion and public proof, this document describes the prepared candidate.
