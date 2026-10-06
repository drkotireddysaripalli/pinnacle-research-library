# Book bag checkout integrity · 6 October 2026

## Result and scope

The shared portal book bag now reads all Shopify cart-line pages and verifies the current PDF edition, SKU/variant, base price, INR currency, availability and shipping scope before checkout. A changed selection, quantity, line total or bag total is displayed for review and requires another deliberate checkout click. Failed verification retains the saved bag and blocks the handoff; unavailable or unrecognised selections remain removable. English, Hindi and Telugu receive specific guidance.

No catalogue, stock, price, payment, marketplace link, hosted Shopify theme, common header/footer or authentication setting is changed. Genuine discounted line totals remain valid; the catalogue comparison uses the variant's base price. Existing consent and Google-linker handling is retained.

## Validation before publication

- 42 desktop browser cases passed: direct selection/reload/retained bag, invalid input, current merchandise checks, changed-bag review, pagination and checkout consent/linker behavior.
- 76 new integrity cases passed across Chromium at 320 px and 768 px, WebKit and installed Edge. Nineteen local Firefox attempts failed at browser launch (`spawn UNKNOWN`), before exercising the page; this is recorded as unavailable local Firefox coverage, not a page pass. Exact-source hosted CI must supply its own Firefox/WebKit result.
- Four script/route/feed checks passed. The deployed script module was regenerated from these exact source bytes; measurement bytes are unchanged.
- One read-only reviewer checked the concrete patch and found the earlier incomplete final validation and truncated-cart findings resolved, with no further actionable source findings. This is a code review, not family or purchase-outcome research.

## Published and verified

- Runtime source: `ddcee0a5f9991f33d559918bd15476e94c69093b` (application patch 4ddbf00; the later commit corrects the older consent-test fixture).
- [Exact-source CI 37495775427](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37495775427): success, including hosted Firefox/WebKit. Initial run 37494905573 failed because the existing consent fixture omitted pagination metadata; its four corrected local cases passed. Application bytes were unchanged by that test correction.
- Portal version: `ba536ab4-f94d-4b65-a8c6-2d270e2021ee`; deployment `b6a3065d-15c0-42da-8534-446548329cef`; rollback `c8a94088-f27b-4e0b-be0e-df0fdc4c2797`.
- All 228 routes, 2,160 assets,bindings/settings and six protected services retained. Only `book-attribution-assets.mjs` changed; the other 37 module hashes match the captured current production baseline. The release helper recognises its own declared message annotation after version upload while checking every other setting. No assets uploaded.
- Public script bytes match the source. Both feeds return 200 with 55 retained rows and 33 PDF checkout links; seven Amazon-linked book pages retain their exact destinations.
- All 33 actual Storefront PDF variants match the expected IDs, INR prices,availability and non-shipping scope. Four live EN/HI/TE offer selections,repeat navigation and 320/768/1440 layouts passed. Production screenshots inspected; temporary bag emptied.
- Nine unavailable-item visual captures use intercepted cart responses with the real rendered public styles. English 1440, Hindi 768 and Telugu 320 error views were inspected; all nine pass overflow checks. These are controlled error states, not actual stock failures.
- Physical TestingBot iPhone 17 Pro / iOS 26.5 Safari passed the Telugu bag, ₹799 price,reload,policy links and layout checks; its session was closed and test bag emptied. Physical Android/iPad and older OS versions were not run for this patch. Local Firefox was unavailable; hosted CI supplied Firefox coverage.
- A real ₹2,499 Telugu collection refreshed its cart and generated the valid checkout handoff. The outgoing request was intercepted before hosted checkout loaded; no payment or order created. Bag emptied afterwards.

The later independent commerce-thread report reached guest Shopify checkout with the four expected lines and ₹4,896 total, without entering fields or making a payment/order. The root separately checked the reported stylesheet concern: all three exact production stylesheets returned 200 with CSS content, loaded into the page, and applied the expected dialog style. No production stylesheet fault was established; the cause of the Mac client block remains unconfirmed. Detailed proof: `stylesheet-readback.json`.

Receipt: `deployment/book-bag-integrity-20261006.json`. Detailed proof: `../../pinnacle-growth-system/book-bag-integrity-20261006/`. Public examples: [Shop](https://www.pinnacleblooms.org/shop),[Hindi books](https://www.pinnacleblooms.org/books/hi),[Telugu books](https://www.pinnacleblooms.org/books/te),[Telugu collection bag](https://www.pinnacleblooms.org/shop/cart?cart_sku=PBN-101-TE-PDF-SET4&quantity=1).

Public indexed HTML and feed content are unchanged; `/shop/cart` remains noindex/private/no-store. No duplicate search resubmission was sent for this shared-script correction. This verifies a customer-journey repair, not a purchase, new lead or ranking gain.

The current Shopify theme export is privately verified at `ac94d63a5fd3b6893d01103b3a61b80566cf9eca`, with 497 files. This shared-script repair does not publish a theme or complete all remaining native Merchant/purchase-attribution work. The website schedules remain deleted/disabled.
