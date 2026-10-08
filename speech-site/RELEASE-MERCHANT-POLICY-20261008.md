# Book policy and service discovery: verified release — 8 October 2026

## Delivered

Public policy: https://www.pinnacleblooms.org/books/refund-and-delivery-policy

The common portal now serves the accepted Shopify book refund and corrected digital-delivery wording. Book detail pages and the bag link to it. The separate clinic refund policy remains intact. Catalogue, stock, variants, feed records, Amazon links and checkout were not edited.

Policy source `cdb3952551e98610117e86db5bbac01fff61aad8`; Cloudflare version `aa53bcb1-b85e-48eb-9368-02e072488f54`; deployment `addbc4bc-8824-4b84-82a7-70d425026536`. Exact-source CI: https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37812828272 . Immutable provider receipt: `deployment/merchant-completion-20261008.json`.

## Cookie-bearing browser discrepancy: resolved

A normal Chrome inspection found the old assessment Offer even though an anonymous public fetch passed. A controlled cookie-bearing request reproduced it: the public speech page becomes `private, no-store`, and the first release skipped that response. The earlier anonymous check was too narrow to establish browser coverage.

The correction permits only this exact public speech path through the existing fingerprinted Service repair. It removes the assessment Offer, retains the Service and enquiry destination as ServiceChannel, preserves all private caching and cookie headers, retains authorization bypass, and leaves unrelated private pages untouched.

Correction source `da47a7efa5311a36b6b5f7a2673e8047e55ca10d`; version `19dd529c-d388-4aa8-9cf5-c0a961eaba77`; deployment `310e7959-4dcf-40fb-aed5-d1ae25a2089e`. CI: https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37816878777 . Receipt: `deployment/service-offer-cookie-20261008.json`.

## Verification

- 11 focused checks passed, including the cookie/private-response regression and book-feed/cart guards.
- Exact-source Portal quality CI passed with the existing TestingBot BVT. Actual session evidence is in `deployment/merchant-policy-public-20261008.json`.
- Normal Chrome DOM in the original reproducing tab now has zero assessment Offers, retains the assessment Service, three assessment enquiry links and 73 central call links. No call or enquiry was initiated.
- Five fresh HTTP cases passed: anonymous speech, cookie-bearing speech, cookie-bearing book, book policy and clinic policy. Assessment Offer is absent in both speech cases; Service and enquiry URL remain. Private/no-store remains private/no-store.
- Visible HTML outside JSON-LD is byte-identical for all five before/after cases. Sampled book Product/Offer data is identical.
- The prior policy release retains its responsive Edge evidence at 390, 768 and 1440 pixels, plus the direct bag check. These are reused unchanged results, not new physical-device coverage.
- 265 routes, 47 modules and 3706 assets retained; zero asset uploads. Only `merchant-policy-handler.mjs` changed in the deployed correction. All eight protected workers and bindings remain unchanged.

## Commerce completion boundary

The website dependency is delivered. The commerce owner can retain the accepted policy URL and complete its existing Merchant review, service-discovery exclusions and historical service-item retirement. This release is not proof of Merchant approval, reindexing, credits, ranking or sales. No policy/feed resubmission was made here.

The 46-page served Speech v4 evidence was reconciled upstream; the public delivery policy now correctly says page counts vary by edition. The accepted refund wording is unchanged. No 45-page correction to the catalogue is required.
