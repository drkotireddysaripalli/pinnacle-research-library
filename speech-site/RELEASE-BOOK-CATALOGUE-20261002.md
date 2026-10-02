# Pinnacle parent book catalogue — bounded release

Scope: an index and 14 edition pages for four approved 101 books (PDF, softcover, hardbound), plus four-book PDF and softcover collections. The current common PageLayout, header, footer, evidence library and existing page bodies are preserved. Existing approved covers and metadata are reused.

Prices: PDF ₹299, softcover ₹799, hardbound ₹1,699; four-PDF collection ₹999; four-softcover collection ₹2,499. All 14 offers currently use OutOfStock because physical stock and digital checkout/delivery are unavailable. No order, paid download, delivery date, ISBN, sales count or book-specific regulatory approval is invented. Public files contain cover images, descriptions and feed metadata only; paid PDFs are not exposed.

Release additions: exact `/books` and `/books/*` route assignments; 15 managed HTML documents; book assets; sitemap and Merchant XML. Google AI-generated title and description fields are explicitly identified; digital items exclude Shopping ads. Existing routes and all four live Worker bindings must survive activation. New route assignments do not alter or remove older assignments.

Validation: production Astro build passed; Astro reported zero type errors; 28 existing route/discovery tests passed. One independent source reviewer checked 14 SKUs/prices/statuses and additive route handling; their sole responsive image-width finding was fixed. Main inspected the actual Chrome desktop book hero, pricing selector, disabled purchase control and following content. Dedicated phone/tablet visual confirmation is not yet recorded. Google processing and approval are separate from deployment and feed submission.

## Published — 2 October 2026

- Source: `43db202ca98cc259cddf1e68ec67336e190a5872` (tree identical to locally tested `52ffa5d`). GitHub app saved it to main; Portal quality run `36973472701` passed before activation.
- Worker: `1e838dfd-4648-468d-b70b-4591461ef911`, 100%; deployment `5f646584-7f39-4235-bdb6-af611f16b06c`.
- All 180 prior routes and four bindings preserved. Added only `www.pinnacleblooms.org/books` and `www.pinnacleblooms.org/books/*`. Receipt: `deployment/books-cloudflare-after-20261002.json`.
- Live browser read-back: `/books` rendered the four covers, all edition links, approved prices and unavailable ordering status. The public XML contained all 14 exact SKU IDs.
- Merchant Center account `9634043`, source `10755858618`, **Pinnacle 101 Books — English — India**: India, English, free listings only, daily URL fetch. Google displayed **14 total updated products, 14 new products added, all attribute names recognized, no issues found**. Google product review/serving is separate and not yet confirmed; the product dashboard had not populated at this read-back.
- All nine physical and five digital offers remain out of stock/unavailable: physical stock is zero; PDF checkout/delivery is not active. Paid book PDFs are not public assets.
- Rollback Worker: `503426b1-3352-4476-82ba-455a88f7a147`; remove only the two newly added book routes if rolling back this catalogue.
- Blinkit brand is under review; its product-request UI is locked until approval. Nine physical listing records are prepared locally; no Blinkit products submitted.
