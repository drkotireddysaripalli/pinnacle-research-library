# Google Play purchase links — 3 October 2026

**Live and publicly verified:** the four English single ebooks, eight Hindi/Telugu single ebooks and their eight English-detail pages now offer the matching live Google Play edition. Shopify PDF purchasing remains primary. Localized copy distinguishes Google Play reading from Pinnacle's downloadable PDF.

- Source: remote `c6733bf4374daaf6ae6e21c574812a138d54b3b7`, local `0f6c68535b69d0feeb36ae9adf359759dd5813fb`; identical tree `e037fad41a24cb6c8e18bde0f25059b0094c8d16`.
- CI: [37074363744 — success](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37074363744), including Firefox/WebKit.
- Cloudflare: `3d088473-f2d9-4906-8460-6a0f24e0d1dc` at 100%. Rollback: `566997b3-0387-45f3-8da5-dd826396045b`.
- Complete release union: `release-books-play-20261003`, 2,145 files. Exactly 20 HTML files changed; 2,125 files byte-identical. No added assets. All six handler modules and Worker logic preserved; only the 20 inventory hashes changed.
- 184 routes, four bindings and all structured data preserved. Prices, availability, Shopify primary controls and existing measurement-script hash unchanged.
- Static check: 20 correct links to 12 unique editions across 81 book routes; 57 other offers and four hubs excluded.
- Verification: production build and `check:page` passed; all 12 targeted Hindi/Telugu layout checks passed. English hero captured at 390/768/1440px without overflow. Root inspected phone Hindi, tablet Telugu, desktop English-detail, and phone/desktop English captures. Independent source review accepted.
- Production: all 20 URLs returned 200, correct Google Play IDs, indexable metadata, primary bag controls and matching structured data. Existing GA4 script SHA256 remains `a62a6d1956127a523da70ea31ade2bb838afca1a1e6ef3a405c641cb0c9dcdc9`.
- Search notification: one IndexNow batch `d19edeb2-f7c2-4bf3-9c0b-6b5506928531`, all 20 accepted with validated key. Submission does not establish indexing or ranking.

Receipts: `books-play-link-check-20261003.json`, `books-play-stage-20261003.json`, `books-play-cloudflare-before-20261002.json`, `books-play-cloudflare-after-20261002.json`, `books-play-live-readback-20261003.json`, `books-play-indexnow-20261003.json`. Screenshots remain in `audits/books-languages/`.

This release adds an already-live retail purchase option. It does not establish a paid Razorpay capture, tax invoice, marketplace approval or new sales.
