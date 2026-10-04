# Verify internal home links — 4 October 2026

Six links on the recognition, district and study source pages resolve through `/verify/index.html`. Change them to the canonical `/verify/`, preserving their three existing section fragments. Visible copy, design, claims and other links remain unchanged.

The checked-in static files and their builder are corrected. Both maintained Worker sources also normalize the legacy relative links, allowing a code-only release that keeps the current asset set intact. The existing alias remains a 301 for external/old links.

## Release boundary

Current production baseline: `pinnacle-verify-route` version `59c23619-de19-411a-9abf-55586c8b1495`, deployment `df1f1b91-a36c-41dc-af58-7845594f4c77`. All 185 zone routes and four main-Worker bindings must stay unchanged. Exported production modules are the upload base; only `publicBody` and its cache-release identity change. Retain the current assets with Cloudflare `keep_assets`; do not rebuild an older commerce/Ask asset union or deploy narrowed route triggers.

Current production contains a different asset-inventory ordering and omits one bookshop line present in the repository's discovery module. Those existing differences are preserved in this bounded release, not overwritten from a stale checkout. Actual current modules and hashes are retained in the local growth delivery receipt.

## Verification

- New source regression: `node verify-site/scripts/check-canonical-home-links.cjs`.
- Local comparison: six links corrected on three source pages, target fragments exist, and eight representative protected responses are unaffected by the changed transform.
- Worker syntax check passed. No styling/layout changes, so no new visual-score claim.
- Before activation, commit source and reconcile the same production baseline. After activation, check the three public pages, eight protected responses, alias, full route set and bindings.

Publication details and live checks are appended after activation. No ranking, authority, AI-citation or qualified-call uplift is implied by this technical repair.
