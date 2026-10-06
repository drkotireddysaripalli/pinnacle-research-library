# Direct PDF book bag — 6 October 2026

## Scope and authority

The owner's 4 October commerce brief authorises coordinated website source fixes and public purchase-flow improvements. Commerce's subsequent bounded request selects the existing 33 PDF offers. Catalogue, payment, pricing, stock and Merchant activation remain with commerce.

A GET to `https://www.pinnacleblooms.org/shop/cart?cart_sku=<exact-SKU>&quantity=1` opens the existing first-party bag with the precise available PDF. No sign-in or automatic checkout navigation. The browser validates live SKU, price, INR currency, availability and non-shipping status before adding. Existing items and quantities survive; repeated visits do not add another copy. A failed saved-bag read retains its identifier and prevents replacement.

The bag identifies English/Hindi/Telugu edition, PDF count, price, email delivery and existing policies. Secure checkout stays a deliberate separate click. Measurement and Google's permitted linker remain behind the existing consent checks. No child/customer information is added to analytics.

## Delivery design

- `/shop/cart` uses the already-deployed `/shop/*` route. No Cloudflare route is added or removed.
- HTTP and HTML canonical stay `/shop`; the cart endpoint is private/no-store and noindex.
- Both existing XML feeds retain all 55 offers. Only 33 PDFs gain `checkout_link_template`; 22 physical offers stay unchanged and every PDF retains `Shopping_ads` exclusion.
- The native-edition XML asset already existed but returned HTTP404 because it was absent from the live inventory. It is now explicitly included in that inventory.
- Frozen active asset union is reused, with only the cart script and two feeds replaced. No historical Astro page rebuild is used as the deployment baseline.

## Acceptance evidence

Case folder: `work/pinnacle-growth-system/book-cart-links-20261006/`.

- All33 public Storefront variant IDs, INR prices, availability and requiresShipping=false matched the exact commerce mapping.
- Four unit checks cover feed counts/values, existing shared script bytes, the private cart endpoint, canonical, CSP and unrelated-route pass-through.
- Browser regression covers three languages, a four-book bundle, reload idempotence, previous items/quantities, invalid and physical selection, changed price/currency/availability, duplicate SKUs, saved-bag read failure and mutation failure. Existing seven attribution scenarios remain.
- Candidate real Storefront bag exercised EN, HI, TE and a bundle; 320/768/1440 presentation inspected. Its temporary bag was emptied. No checkout navigation or order.
- Final CI, production bytes, feeds, live bag, protected controls and deployment IDs are recorded in `deployment/book-cart-links-release-20261006.json` after release.

## Search/commerce state

This is website delivery, not Merchant acceptance or a sale. Commerce owns the existing Google recheck and feed ingestion. This release sends no new Merchant request, search submission or duplicate feed fetch.

Google requirements consulted: [checkout link template](https://support.google.com/merchants/answer/13580733?hl=en-GB), [matching rendered checkout domain](https://support.google.com/merchants/answer/14994242?hl=en). A first-party populated basket is used; a direct different-domain Shopify URL is not submitted as the attribute.

## Published and verified

- Source commit: `92455876c30e8759a83b0df7e585b143f17c569b`. Portal production: `08a768e3-d753-49bb-989f-c3654e6ab599`; rollback: `52ba9d40-eddb-4864-a08b-fae511f6f1f2`.
- CI `37408245020`: success. Four unit checks, 16 cart scenarios across three local configurations (48 case executions), and the existing 21 attribution checks passed. The final CI also exercises Firefox and WebKit.
- Production EN/HI/TE/bundle, repeat navigation, existing items, and 320/768/1440 layout checks passed. Physical iPhone17Pro/iOS26.5/Safari passed; its screenshot was inspected. Both fresh validation bags were emptied; no checkout navigation or order.
- All55 feed rows and33 PDF checkout links match released source bytes. Native feed recovered from404 to200. Seven protected Amazon book destinations verified.
- All209 routes, four portal bindings, 36 modules and four protected Worker services reconciled; only the three declared modules changed. The shared Anek release remains.
- Website delivery is complete. Google Merchant activation/ingestion and any subsequent sales are separate outcomes, owned by commerce.
