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
