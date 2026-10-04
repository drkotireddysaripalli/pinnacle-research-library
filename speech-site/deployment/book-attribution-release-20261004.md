# Book measurement continuity — 4 October 2026

Action `6e73b3d9-0bc5-4309-a80e-9c3f4ac52b99`, item `COMMERCE-ATTRIBUTION`.

## Actual remote settings

Main GA4 property 361649365, stream 4811231552, G-2BYLRLFRDJ, tag GT-WF4DP2S. Cross-domain list previously had only `Contains: pinnacle`. Added the suggested existing store as **Exactly matches: qg10s5-ie.myshopify.com**, saved and reopened to verify. Existing condition preserved. Unrelated irraa.com suggestion not accepted. Unwanted referrals remain `Referral domain contains: pinnacleblooms.org`; no guessed payment-provider exclusion. Enhanced measurement is enabled in the final loaded stream UI; it was not changed in this action. The earlier transient loading-state switch must not be treated as its saved state.

Screenshot: ga4-domains-saved.png. Existing connection and settings source: authenticated Analytics UI.

## Website defects and bounded correction

1. Every book page previously used a different cookie path. Book pages now use the separate `pbn_books` namespace at `/` on www.pinnacleblooms.org. Other portal/Ask configuration is unchanged. Withdrawal clears these root cookies and visible legacy book-path cookies, not therapy/Ask cookies. Historical sessions cannot be repaired retrospectively; this is a measurement break in the comparison baseline.
2. All acquisition data was previously blanked. Only exact known public search/social/answer-platform origins may now be sent, after optional book consent. Paths, search terms, arbitrary campaign labels, unknown/private domains, customer data, query strings and advertising identifiers remain excluded. Unrecognised sources therefore remain unattributed by design; this is not complete acquisition coverage.
3. Cart revalidation overwrote any `_gl` decoration before JavaScript navigation. Preserve only Google's generated linker from the clicked anchor, on the newly validated HTTPS Shopify destination, while consent is still active and GPC off. The checkout's server-issued functional parameters remain intact. No extra query parameters copied. New credentials/ports/wrong-host destinations fail closed.

Google's supported mechanism: https://developers.google.com/tag-platform/devguides/cross-domain and https://support.google.com/analytics/answer/10071811?hl=en. The former documents click-time decoration and destination acceptance; the latter explicitly identifies JavaScript navigation/redirect loss as a failure case. Preserving a linker is necessary, not proof the native Shopify pixel consumed it.

Consent and INR event vocabulary retained. Corporate `item_id` remains SKU. No duplicate tag or purchase sender. Existing 99-SKU/variant/product map remains the reconciliation source until an actual native Google purchase payload establishes its item ID format. Shopify's supported line-item contract exposes SKU, variant ID and product ID: https://shopify.dev/docs/api/web-pixels-api/standard-events/checkout_completed.

## Shopify evidence received from the authorised commerce owner

Read-only authenticated observation 09:15–09:23 UTC, commerce thread 01a0f6ef-1af3-7bf0-98aa-9db53523e555. Google & YouTube Analytics Active with G-2BYLRLFRDJ / property361649365; Ads2990211780 connected. Three app pixels: Google & YouTube (1780363, Server+Web/Optimized), Meta (2329312, Server+Web/Optimized), Amazon MCF/Buy with Prime (44186959873, Web); zero custom pixel rows. Native Google item_id payload not visible, so its format remains unknown.

Saved consent: automated banner31regions, Accept/Decline/Manage preferences; checkout banner unchecked; data-sharing opt-out15USstates. Google pixel says Permission Not required / pixel will always run. This UI statement is not evidence of actual consent-mode storage behavior; no visitor network test was performed. Do not silently bypass consent or add a second pixel.

Existing owner payment-flow evidence changed: INR799 sale and INR799 refund both successful on4Oct, independently matched by commerce to Razorpay. UPI charged INR817.86 (799 +15.98fee +2.88feeGST), captured08:14IST; refund799 processed08:43IST; fee18.86outside refund. Settlement remains to be processed. This refunded owner check is separate from the zero-charge QA order and is **not organic revenue, GA4 purchase ingestion or delivery verification**. No new order/payment was created in this run.

### Merchant account conflict — separate commerce scope

Live Google app now shows Merchant522637926 connected, sync on, with1,147not-approved records citing Sale of services. This differs from the authoritative Merchant9634043 and its107-record catalogue. Do not attribute the1,147rejections to9634043. No disconnect, swap, catalogue mutation, feed refresh or new support case was made here. The commerce owner has the authenticated evidence and retains correction ownership.

## Verification and remaining acceptance

- 31 measurement tests passed; 33 route/resource/script tests passed.
- 14 intercepted checkout tests passed: Chromium desktop and WebKit phone profile, seven cases each (accepted, declined, GPC, withdrawal while refresh pending, expired cart, wrong host, server failure).
- All test Google/Shopify/navigation requests were intercepted. No synthetic GA event or purchase reached either production service. These are behavioral tests, not physical-device tests or an actual Shopify purchase receipt.
- Public JavaScript hashes, route/binding preservation and protected-page hashes are release acceptance below; no new page UI was built and unchanged layout checks were not repeated.
- Full acquisition-to-purchase proof remains **waiting on native Shopify item-ID/event evidence and a legitimate consented cross-domain receipt**. Settled real data must establish source/session continuity. Do not repeat unchanged analytics queries hourly or fabricate a purchase to close this item.
- JavaScript measurement-only change: no IndexNow resubmission of unchanged page content.

## Public release verified

Source `2cfac85ed5a18e287af666d52362d479534c2758`; Cloudflare version `ab2b41e5-17bf-4b84-a6ac-0ca2c25e4ce4`, deployment `17b511fa-dea0-4523-b332-d6b39fb7f3dc`; rollback `688e7809-d9e9-4506-a916-b69c03dc166e`. CI run37192185115 succeeded. Ten public script checks, seven protected HTML response comparisons and the original resource-PDF hash passed. All185routes and four bindings unchanged. Google real-tag isolated check confirmed generated linker, stable book client cookie across sibling routes and withdrawal cleanup; four measurement requests intercepted, zero events transmitted. This does not test destination acceptance.

GSC Wizard annotation `b6ed89dc-e531-4b9d-bc97-349a09156147` records the measurement break. Parent task stays open for the exact remaining native evidence; partial delivery is not full attribution completion.
