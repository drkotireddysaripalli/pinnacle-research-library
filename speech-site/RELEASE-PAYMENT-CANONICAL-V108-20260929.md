# Canonical Payment & Billing footer link · v108 · 29 September 2026

## Result

The shared footer now links Payment & Billing directly to `https://books.pinnacleblooms.org/payment-and-billing`, the canonical URL declared by the published payment-policy page. This closes the sole canonical mismatch found in the independent v107 live-navigation audit.

The v107 header/menu completion remains intact: all high-value therapy, conversion, institutional, authority, team, parent-story, Ask Pinnacle, media and policy destinations remain present. The owner-supplied authority narrative, National Autism Helpline presentation and all page content are unchanged.

## Shared-shell contract

- `src/data/portal-navigation.json` is the common navigation source.
- `src/layouts/PageLayout.astro` renders the shared `SiteHeader.astro` and `SiteFooter.astro`.
- `SiteFooter.astro` includes the common `VerifyFooter.astro` and `PortalFooterGroup.astro` groups.
- Future pages reuse this shell; one shared-source change propagates across every managed page at build time.

## Publication and verification

- Cloudflare Worker v108: version `e60437f5-06d5-4697-b3ea-6d74871f58ad`; deployment `56d7bc84-62dd-4579-8bdf-1a5b461fdf95`; 100% traffic.
- Rollback: v107, version `cb991aad-fa53-45f0-8df3-a02fc6f58321`, deployment `4eaf8e22-239d-403e-811f-904cf33c8677`.
- All five managed pages return HTTP 200 and share header SHA-256 `9ea028fa9d75b1c13a0b22bc8b762435ebfd1e5d56f74b164daebfa203048b20` and footer SHA-256 `17554b0bc802512594e66c1c6e036a7c154cb260d15a7f4db062f07d02a39d6d`.
- All 80 placements of the 16 restored/corrected destinations were present in the independent audit; the final Payment & Billing destination now matches its declared canonical.
- 29 portal checks, 322 sales/search checks, 44 route/form/privacy checks, 17 evidence-link checks and 18 enrolment checks passed.
- 708 publicly served assets match the staged release; the retired enrolment preview remains a 301 to the live canonical.
- HTML and Markdown machine delivery match the staged build; structured data, Organization identity and telephone data remain present.
- Homepage, Verify, evidence JSON, FSC PDF, PinnacleAI regulatory story, National Autism Helpline and `robots.txt` remained byte-identical.
- The five materially changed pages were notified through IndexNow at `2026-09-29T10:19:08.570Z`; HTTP 200 confirms notification only, not discovery, indexing, ranking, AI citation or conversion.

The shared header/footer is now complete for global navigation. Individual centres, staff profiles, parent-story entries, evidence records and Ask answers remain contextual or sitemap destinations.

Receipts: `deployment/release-payment-canonical-v108-20260929.json`, `deployment/production-payment-canonical-v108-20260929.json`, `deployment/shared-shell-production-v108-20260929.json`, `deployment/indexnow-payment-canonical-v108-20260929.json`, and `deployment/production-before-payment-canonical-v108-20260929.json`.
