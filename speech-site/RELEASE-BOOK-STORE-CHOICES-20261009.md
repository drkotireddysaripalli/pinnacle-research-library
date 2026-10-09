# Book store choices — delivered 9 October 2026

## Result

The shared retailer-choice block is live on **64 existing public routes**: 33 English/Hindi/Telugu parent editions, 22 English-language summaries of native editions, five relevant physical-format pages and four discovery pages. Each discovery page includes all 11 mapped offers. The exact Pinnacle cart SKU, Google Play edition and approved Amazon/Flipkart destinations are preserved. Format details distinguish PDF, paperback and combined hardcover editions; stock, prices and existing commercial records were not changed.

- [Speech PDF and store choices](https://www.pinnacleblooms.org/books/speech-communication-101-my-message-matters)
- [Speech paperback](https://www.pinnacleblooms.org/books/speech-communication-101-my-message-matters-softcover)
- [Hindi Speech](https://www.pinnacleblooms.org/books/hi/speech-101)
- [Telugu Speech](https://www.pinnacleblooms.org/books/te/speech-101)
- [Books](https://www.pinnacleblooms.org/books) / [Shop](https://www.pinnacleblooms.org/shop)

## Exact release

| Evidence | Value |
|---|---|
| Tested implementation | `04db8279873357e4e996ccaf672c2127b5abaf20` |
| Source integration | [PR14](https://github.com/drkotireddysaripalli/pinnacle-research-library/pull/14), merged as `a66e39bc93e7aabb1f0a0f62c8d3834901e97426` |
| Exact-source CI | [37913981740 — success](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37913981740), including trusted TestingBot candidate BVT |
| Portal Worker version | `0eb2b445-f488-425a-a2e5-c506bb6ef463` |
| Deployment | `a605572b-fdfc-47b9-b131-9b3d0ac4f1bb` |
| Promoted | 9 October 2026, 15:33:23 IST |
| Rollback | `3106a925-5e4b-4cdd-b211-d026ff52af48` |
| Preserved | 307 routes, all 3,706 assets, settings/bindings and eight protected services |

Only `speech-handler.mjs` was replaced and the new `book-store-choices.mjs` added. All 48 resulting module hashes were read back. The repaired `pbn-planetscale` receipt backend and the Ask/authentication, legacy, helpline and sitemap services remain unchanged.

## Acceptance

- **64/64 public URLs pass** HTTP status, exact release header, canonical, expected retailer/cart links, helpline and JSON-LD parsing. All prior anchor destinations remain on the seven captured representative pages.
- The production build and 23 focused edition/retailer checks passed. The corrected collection expectation and new component suite passed 10/10; this subset overlaps the focused suite and is not an additional independent coverage count.
- 12 local responsive cases passed at 320/768/1440 CSS px. Production Speech desktop (1440×1000), Speech phone (320×800), and Telugu tablet-size (768×1024) renders were captured and visually inspected. All three show no store-block overflow; Telugu uses Anek. These local browser dimensions are not physical-device claims.
- Eight isolated checkout/measurement scenarios passed. Google/Shopify requests were intercepted; no actual purchase, refund, customer record, call, enquiry or vendor consent event was created.
- **64/64 changed URLs accepted by IndexNow**, HTTP 200, key validated, batch `e7747c75-295a-4001-b34b-f082a047306f`. This is submission evidence, not indexing, ranking or AI citation evidence.
- Existing GSC books sitemap was already submitted, with zero returned warnings/errors; unchanged sitemap URLs were not resubmitted. Existing connected GSCWizard/Bing inventories did not contain the Shopify host. That scoped absence does not establish its state in other accounts.

Receipts: [configuration preservation](deployment/book-store-choices-20261009.json), [all 64 public results](deployment/book-store-choices-public-20261009.json), [IndexNow response](deployment/book-store-choices-indexnow-20261009.json). Private browser captures and complete source snapshots remain under `ask-private/book-store-choices-20261009/`.

## Remaining commerce acceptance

1. Hosted Shopify theme: prepare a private bounded patch for conditional PDF delivery language, native title language, reciprocal language links and accurate book/author/language relationships. Compare the six October source snapshot with current hosted files before applying. The existing Mac administrator session is available; Windows is signed out. Preserve all 33 product descriptions and existing ProductGroup/Offer, 74 retailer links, 76 therapy links, stock and prices. Theme application is not included in this portal release.
2. Google Customer Reviews: the widget badge alone does not establish supported order-confirmation opt-in or primary Merchant account 9634043 collection. Existing account 522637926, product-sync state, required agreement/data approval and provider case `8-0776000041647` remain with commerce administration.
3. Genuine refund reporting: needs supported managed behavior or an existing authorized sender with original transaction/client/consent identity. No repeated transaction, invented identity or refund event was sent.
4. Real calls, accepted enquiries, fulfilment, sales and admissions are independent operational outcomes and are not claimed by these release checks.

Accountable source/release owner remains the existing website chat. No scheduler, crawler, new campaign, provider account or credential was created.
