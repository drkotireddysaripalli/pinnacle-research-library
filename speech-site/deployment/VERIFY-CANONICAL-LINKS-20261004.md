# Verify internal home links — 4 October 2026

Six links on the recognition, district and study source pages resolve through `/verify/index.html`. Change them to the canonical `/verify/`, preserving their three existing section fragments. Visible copy, design, claims and other links remain unchanged.

The checked-in static files and their builder are corrected. Both maintained Worker sources also normalize the legacy relative links, allowing a code-only release that keeps the current asset set intact. The existing alias remains a permanent 308 redirect for external/old links.

## Release boundary

Current production baseline: `pinnacle-verify-route` version `59c23619-de19-411a-9abf-55586c8b1495`, deployment `df1f1b91-a36c-41dc-af58-7845594f4c77`. All 185 zone routes and four main-Worker bindings must stay unchanged. Exported production modules are the upload base; only `publicBody` and its cache-release identity change. Retain the current assets with Cloudflare `keep_assets`; do not rebuild an older commerce/Ask asset union or deploy narrowed route triggers.

Current production contains a different asset-inventory ordering and omits one bookshop line present in the repository's discovery module. Those existing differences are preserved in this bounded release, not overwritten from a stale checkout. Actual current modules and hashes are retained in the local growth delivery receipt.

## Verification

- New source regression: `node verify-site/scripts/check-canonical-home-links.cjs`.
- Local comparison: six links corrected on three source pages, target fragments exist, and eight representative protected responses are unaffected by the changed transform.
- Worker syntax check passed. No styling/layout changes, so no new visual-score claim.
- Before activation, commit source and reconcile the same production baseline. After activation, check the three public pages, eight protected responses, alias, full route set and bindings.

## Published and checked

- Source commit: `e55ac6bbc07b76ea5ce6c3711b4517d51f85b44f` (includes `86b6227`). Pushed to `main` before activation.
- CI: [run 37177732033](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37177732033), completed successfully.
- Active Worker: `32d5e4f6-7d76-4bbd-8312-b3fb16691200`, deployment `dcfecd36-f702-4129-ac51-2e6cd9bd8025`, 100%, 4 October 2026 at 04:49 UTC.
- Twelve production checks passed: three modified responses, eight byte-equivalent protected responses after removing the variable analytics beacon, and the existing canonical redirect.
- All 185 zone routes and four main-Worker bindings match the pre-release snapshot. Current assets and six other Worker modules retained.
- The initial test incorrectly expected 301. The exported pre-release source confirms 308; the test and this receipt now record the actual unchanged redirect. No production redirect change was made.
- Live pages: [recognitions](https://www.pinnacleblooms.org/verify/evidence/recognition-register.html), [district records](https://www.pinnacleblooms.org/verify/evidence/district-register.html), [studies](https://www.pinnacleblooms.org/verify/evidence/study-index.html).
- Rollback version: `59c23619-de19-411a-9abf-55586c8b1495`. Reconcile intervening deployments before any rollback.
- Local proof: `work/pinnacle-growth-system/verify-links-live-checks.json`, `worker-after-verify-links-20261004.json`, `verify-links-deployment.json` in the parent workspace.
- GSC Wizard property annotation: `132cfb19-ab91-4a15-81dc-d7c39d22b154`.

No ranking, authority, AI-citation or qualified-call uplift is implied by this technical repair. No unchanged URLs were resubmitted for indexing.
