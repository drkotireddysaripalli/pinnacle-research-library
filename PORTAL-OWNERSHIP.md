# Integrated Pinnacle portal: one code and release owner

Owner instruction: 6 October 2026. This supersedes earlier split website/shop code ownership. The current Windows website thread owns the public **Ask, Sunshine, FAQ, Verify, Shop and Books** experience, its source changes, shared presentation, testing, releases and website integration backlog. The Mac commerce thread acknowledged that assignment, and its retained source has been transferred, verified and checked into the private Shopify component linked from this checkout.

## Start here

Latest legacy metadata release, 6 October 17:01 UTC: source `a6bd113`, version `46fa8ad2-f64c-47e1-a78b-db27d849b331`, deployment `828b9505-0332-47d4-803f-2631741f5017`. Exact physiotherapy WebPage identities are publicly verified across four variants. The Shop/Portal runtime listed below remains unchanged. Details: `speech-site/RELEASE-PHYSIOTHERAPY-IDENTITIES-20261006.md`.

Latest runtime release, 6 October 16:34 UTC: source ddcee0a5f9991f33d559918bd15476e94c69093b; Portal ba536ab4-f94d-4b65-a8c6-2d270e2021ee. The shared book-bag integrity repair is publicly verified; 228 routes, 2,160 assets, 37 other portal modules and six protected services are retained. The older release IDs below are dated history. Details: `speech-site/RELEASE-BOOK-BAG-INTEGRITY-20261006.md`; actual baseline/rollback and public proof: `speech-site/deployment/book-bag-integrity-20261006.json`. No hosted Shopify theme publication was needed.

- Canonical repository: <https://github.com/drkotireddysaripalli/pinnacle-research-library> — `main`.
- Accountable website thread: `01a0ef6b-507a-7630-828f-7ac81852a39c`.
- Working checkout: `C:/Users/Siri Palace/Documents/Codex/2026-09-15/k/work/ask-distribution-release-20261003`.
- Current task and released-page status: [active work order](speech-site/ACTIVE-PAGE-WORK-ORDER.md).
- Page acceptance standard: [governing page work order](speech-site/PINNACLE-PAGE-CREATION-WORK-ORDER.md).
- Approved common presentation: [common shell](speech-site/COMMON-SHELL-BASELINE.md) and [native typography](speech-site/VERNACULAR-TYPOGRAPHY.md).

The repository name reflects its research origins. It is also the canonical portal repository. Keep the corporate Shop frontend here in `speech-site/`; do not fork a shared header/footer or use the Mac's historical website checkout as a deployment baseline. The separately hosted Shopify theme is the pinned private `commerce-shopify/` Git component described below, under this same owner.

## Source map

All paths below are relative to this repository.

| Area | Public entry | Maintained source | Runtime/data responsibility |
|---|---|---|---|
| Ask | <https://pinnacleblooms.org/ask> | `speech-site/ask-runtime/pages/ask/`, `speech-site/src/lib/ask/`, `speech-site/ask-runtime/worker.ts` | Astro server rendering in `pinnacle-ask`; Supabase content/identity and existing WATI verification. |
| FAQ | <https://www.pinnacleblooms.org/faq> | `speech-site/ask-runtime/pages/faq/[...path].astro`, `speech-site/src/lib/knowledge/`, `speech-site/ask-public/knowledge-data/` | Same Ask runtime and reader identity; original language/slugs retained in the source-derived catalogue. |
| Sunshine | <https://www.pinnacleblooms.org/sunshine> | `speech-site/ask-runtime/pages/sunshine/[...path].astro`, shared knowledge library/catalogue | Same runtime for the collection. Existing linked topic detail routes keep their recorded owners/fallbacks. |
| Verify | <https://www.pinnacleblooms.org/verify/> | `verify-site/content/`, `verify-site/scripts/`, `verify-site/dist/`, portal deployment modules | Static evidence build served through `pinnacle-verify-route`. Its separate Astro migration remains deferred; ownership consolidation does not replace evidence pages. |
| Shop and Books | <https://www.pinnacleblooms.org/shop>, <https://www.pinnacleblooms.org/books> | `speech-site/src/pages/shop.astro`, `speech-site/src/pages/books/`, `speech-site/src/components/Book*.astro`, `speech-site/src/data/book-*`, `speech-site/public/pinnacle-pages-scripts/book-commerce.js` | Common portal frontend with Shopify Storefront cart/checkout. Public catalogue and feed generation remain here. |

Mirracles uses `speech-site/ask-runtime/pages/allmirracles.astro` and the same knowledge catalogue. Preserve its existing detail routes alongside these five areas.

The common header, footer, navigation and Anek typography stay in their shared components/styles and Worker transforms. Fix them there once, then check affected surfaces. The public site's visual/narrative quality bar is unchanged by this ownership transfer.

### Commerce source details

- Public offer, language, identifier and gallery inputs: `speech-site/src/data/book-catalog.json`, `book-locales.json`, `book-merchant-editions.json`, `book-edition-identifiers.json`, `book-gallery-assets.json`, `book-play-editions.json`, `book-cart-locales.json`.
- Cart UI and state: `speech-site/src/components/BookCart.astro`, `speech-site/src/styles/book-cart.css`, `speech-site/public/pinnacle-pages-scripts/book-commerce.js`.
- Feed generation: `speech-site/scripts/build-book-commerce.mjs`. `--feeds-only` changes the two Merchant feeds without regenerating images or routes. Inspect and use the exact current input records before changing availability, prices or identifiers.
- Deployed script wrapper: `speech-site/scripts/build-book-attribution.mjs` → `speech-site/deployment/book-attribution-assets.mjs`.
- Route/asset delivery: `speech-site/deployment/speech-handler.mjs` and `speech-site/deployment/pinnacle-route-v12.mjs`, together with the current imported modules.
- Buying-link endpoint: `/shop/cart?cart_sku=<exact-existing-PDF-SKU>&quantity=1`. The earlier proposed `/shop?cart_sku=...` is not the published interface. Cart URLs are private/no-store and noindex, with `/shop` canonical.
- Regression: `speech-site/scripts/test-book-cart-links.mjs`, `speech-site/tests/browser/book-cart-links.spec.mjs`, existing book attribution/language/feed checks.

### Private Shopify theme component

The Shopify licence supplied with Horizon limits redistribution of derived themes. Its retained source belongs in the [private Shopify repository](https://github.com/drkotireddysaripalli/pinnacle-shopify-source), pinned in this repository's `.gitmodules` at `commerce-shopify/`. The checked-in revision is `ac94d63a5fd3b6893d01103b3a61b80566cf9eca`, containing the verified 6 October export. Public portal CI does not need that private component to build or test `speech-site`.

For authorised theme work in a fresh checkout, run `git submodule update --init commerce-shopify` using the existing GitHub account. The current theme source is the exact archive and 497-file manifest in `commerce-shopify/intake/live-theme-20261006/`. Extract that archive in private working storage and verify its manifest before editing. The earlier `commerce-shopify/source/` tree and its 531-file handoff manifest remain historical provenance, not the current hosted-theme baseline.

The 6 October export for published theme `146540331074`, `pinnacle-books-horizon-draft`, Horizon 4.2.0, is received and verified here. The original export was requested at 08:17 UTC; commerce transferred the exact downloaded bytes through the existing private repository. The archive is 3,988,840 bytes, SHA-256 `17dbf710fad98a609b95cf25cd74e14cf83b63e1e14b3ea9ce3a669f8241e71c`. All 497 file sizes and hashes, ZIP CRCs and extraction paths passed. Source is extracted in this task's private working storage. The Windows Shopify sign-in dependency for source intake is resolved; no new export is required. Receipt: [fresh theme intake](speech-site/deployment/shop-theme-source-intake-20261006.json). Before an actual theme deployment, reconcile any hosted changes made after this dated export. This intake itself did not publish a theme.

## One ownership model; existing working services

Cloudflare serves and routes the portal. Supabase retains Ask content/identity, PlanetScale remains a legacy/source dependency, and Shopify retains commerce records and checkout. These services do not need to be replaced to put all public website code under one owner.

The Mac task **Plan Merchant Center offerings** (`01a0f6ef-1af3-7bf0-98aa-9db53523e555`, connected Mac mini) continues the existing Merchant Center, Shopify, Google Play, Amazon, publishing and support actions. It provides exact catalogue/source changes and verified outcomes to this website owner. It must not independently edit or deploy the corporate website or maintained theme code. The theme source now has its explicit private home above. No independently maintained Shopify Function/extension app was found in the handoff; managed integrations remain configured in their existing services.

Keep edition identity, ISBN/ASIN, availability, delivery and payment records tied to their actual systems. The original scope/coordination brief remains in the local `work/pinnacle-growth-system/COMMERCE-INTEGRATION-BRIEF-20261004.md`; its dated counts are historical until refreshed. Do not duplicate existing Merchant feeds, GSC trackers, outreach campaigns or marketplace cases. Keep credentials, customer records, paid source books and private entitlements out of this public repository.

## Release procedure for every area

1. Read the active work order and latest receipt; refresh the actual live Worker versions, affected bindings and complete route set once. Use the current `main` source and the pinned private component only when theme work requires it. Reconcile any unpublished work before editing.
2. Change the appropriate maintained source and reuse approved components/assets. One implementation/deployment owner remains in this thread. Marketplace and source handoffs are dependencies, not competing code branches that independently ship.
3. Build the affected surface once. `speech-site` has the static Astro build and `npm run build:ask` for the dynamic runtime. Verify has its own builder. A successful build alone does not authorize replacing the full public asset collection.
4. Assemble from the **current validated full asset union** with only the declared changed outputs. Preserve newer corrected pages and all unrelated modules. Historical `prepare-book-languages.mjs`, dated upload directories and old README commands are release records, not current default deployment commands.
5. Run focused regression/visual/device checks for actual changes and exact-source CI. Preserve the approved shell, Google return paths, reader identity, language fonts, relevant cart/enrolment transitions and source-linked claims. Reuse unchanged results.
6. Commit and push. Upload the full manifest with explicit asset collection identity, retain bindings/secrets, and promote only after baseline guards pass. Never use `--route`, deploy a Verify-only/Shop-only bundle, or assume `keep_assets: true` identifies the active production assets.
7. Read back the changed public URLs and protected routes. Record source commit, CI, deployment, rollback, routes/bindings and actual test coverage. Update the active work order. Submit materially changed eligible URLs through existing discovery records once; ownership-only edits need no resubmission.

### Current release reference, checked 6 October 2026

The shop/cart release source is `92455876c30e8759a83b0df7e585b143f17c569b`; its committed receipt is in `bed7363`. Portal Worker `08a768e3-d753-49bb-989f-c3654e6ab599` is live; Ask Worker `800a09a7-556c-4311-b07e-2ac548fd7c61` is live. The ownership read-back confirmed all five protected Worker versions and **209 routes** unchanged, with Ask, Sunshine, FAQ, Verify, Shop, Books and the cart document returning HTTP 200. These checks establish reachability/version preservation, not a fresh sign-in, payment or whole-site visual test.

Latest detailed release: [book bag/feed release](speech-site/RELEASE-BOOK-CART-LINKS-20261006.md) and [receipt](speech-site/deployment/book-cart-links-release-20261006.json). The current local asset union is `speech-site/release-book-cart-links-20261006` (2,160 files). It is an ignored release artifact, not a substitute for the tracked source. Reconcile the latest actual state at the next release; do not treat these dated version IDs as permanent.

## Takeover reconciliation

Ownership/source intake is complete. All 531 retained source/public-asset files (11,162,807 bytes) are preserved in private Git and available in this canonical checkout. The original archive SHA-256 is `1d7fcddc42f6d147b667b5bb2264cbda1aab213d29f250f835fbe261f4c9f32c`; upstream Horizon revision is `5acd1b6b66c02f61d3216e3adace5dd9e0404fc9`. All six transport parts and the complete Git bundle were verified before intake. The temporary public transfer branch was removed after private backup verification; no transport parts or derived Horizon files were merged into public `main`. Branch removal does not establish purging of historical GitHub objects.

Receipt: [original ownership/source verification](speech-site/deployment/portal-ownership-20261006.json). The fresh-export dependency is now resolved by the separate 497-file intake above. Source intake changed no runtime behaviour, catalogue, price, stock, payment or authentication settings and claims no new browser/device/checkout pass. The owner explicitly deleted the growth scheduler on 6 October; do not recreate it. Continue authorised work directly in this chat. Marketplace operations continue in their existing task.
