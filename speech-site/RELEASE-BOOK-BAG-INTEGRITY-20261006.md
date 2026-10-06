# Book bag checkout integrity · 6 October 2026

## Result and scope

The shared portal book bag now reads all Shopify cart-line pages and verifies the current PDF edition, SKU/variant, base price, INR currency, availability and shipping scope before checkout. A changed selection, quantity, line total or bag total is displayed for review and requires another deliberate checkout click. Failed verification retains the saved bag and blocks the handoff; unavailable or unrecognised selections remain removable. English, Hindi and Telugu receive specific guidance.

No catalogue, stock, price, payment, marketplace link, hosted Shopify theme, common header/footer or authentication setting is changed. Genuine discounted line totals remain valid; the catalogue comparison uses the variant's base price. Existing consent and Google-linker handling is retained.

## Validation before publication

- 42 desktop browser cases passed: direct selection/reload/retained bag, invalid input, current merchandise checks, changed-bag review, pagination and checkout consent/linker behavior.
- 76 new integrity cases passed across Chromium at 320 px and 768 px, WebKit and installed Edge. Nineteen local Firefox attempts failed at browser launch (`spawn UNKNOWN`), before exercising the page; this is recorded as unavailable local Firefox coverage, not a page pass. Exact-source hosted CI must supply its own Firefox/WebKit result.
- Four script/route/feed checks passed. The deployed script module was regenerated from these exact source bytes; measurement bytes are unchanged.
- One read-only reviewer checked the concrete patch and found the earlier incomplete final validation and truncated-cart findings resolved, with no further actionable source findings. This is a code review, not family or purchase-outcome research.

## Release boundary

Publication is pending exact-source CI, the guarded current portal module release and public acceptance. `scripts/release-book-bag-module.mjs` captures the current production baseline, preserves all 2,160 union assets without upload, changes only `book-attribution-assets.mjs`, and guards routes, settings, bindings and six protected services. The release receipt is `deployment/book-bag-integrity-20261006.json`.

The current Shopify theme export is privately verified at `ac94d63a5fd3b6893d01103b3a61b80566cf9eca`, with 497 files. This shared-script repair does not publish a theme or complete all remaining native Merchant/purchase-attribution work. The website schedules remain deleted/disabled.
