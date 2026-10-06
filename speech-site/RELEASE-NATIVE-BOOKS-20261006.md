# Native book route and asset inventory repair — 6 October 2026

## Source prepared

Restore 46 existing Hindi/Telugu book destinations and 16 approved sample images already expected by the book route registry. Retain all published English book/collection content, PinnacleAI, the common header/footer, Verify and Ask. No catalogue, stock, payment, authentication or new marketing-copy changes.

The previous deployment inventory was stale relative to the approved active raw asset collection. Two candidates exposed this discrepancy and were rolled back to `5e5cad5b-ecf4-4a12-a38b-6cd4fb2c1a7e`; the protected public outputs were then confirmed restored. Do not reuse either rejected candidate.

The corrected frozen union is `release-native-books-20261006`: 2,160 files. All 634 Verify and 1,521 portal inventory entries were checked against their actual files. Ninety stale portal inventory hashes were reconciled. The six previously mismatching protected page/feed outputs now reproduce the approved live content exactly. All native book HTML dependencies are present and mapped; three focused regression tests passed without skips.

Approved historical raw transfer is pinned to artifact commit `4a0f1655fde09a76c04ed7a35b7cceb03d84d4cc`, `approved-raw-recovery/latest-approved-raw.json.xz`, SHA-256 `353b5769b5ac991ba922fcfbcba366c78cae45adaaa6a358df7c0fe58feea97f`. The 50 remaining historical pages were restored using bounded exact transformations and matched that approved full manifest. Twelve unused historical files were absent before and are not referenced by any restored HTML; they do not block this repair and are not claimed restored.

Upload this explicit asset manifest with the committed Worker source. Do not use `keep_assets`: it retains the most recently uploaded collection, which may differ from the active rollback version. Preserve all 209 routes and the four portal bindings. Wait for deployment propagation and verify public content against the original read-back before declaring success.

## Release state

Published and verified: source `56208d35a8bdf7f0a9fbeaffc668ca3dfa8c4040`, Cloudflare version `729a0f52-9f19-408d-bcf1-b50bed2cc2a3`. CI37401592822 passed before publication. All92 explicitURLs returned200/indexable, including all46 restored native destinations. All91HTML pages had a title, description, oneH1 and canonical; the remainingURL is XML. All49 required assets returned200 with non-HTML types.

Six representative native pages passed on physical Android and hosted Windows Chrome:12page/configuration checks. The knowledge matrix separately covered8pages across6configurations:48checks. Screenshots were reviewed. These are scoped tests, not whole-site or purchase certification.

Twelve protected existing outputs retained their original hashes; the two hubs now return200. All209routes/fourportalbindings and protected applications are retained. Google accepted the book sitemap at02:02:33UTC; IndexNow accepted46changedURLs withHTTP200, batch`d82d6200-c80f-4e52-8f12-d34ab58682d7`. See committed completion receipts.

The shared legacy entity repair is live as`2e2e6536-5b48-4ffb-b6e3-552cba878d16` fromsource`84bf8dbe84a082f5949d5bfc5d03966c34c47978`. Known entity types/legal organisation are corrected and visible text preserved. A separate malformed COVID-era SpecialAnnouncement remains for the next shared repair. No sitewide100health, indexing, rankings or newleadgain is inferred.


Independent commerce-browser check initially saw stale404 content at02:05:45UTC. One normal reload subsequently showed both native hubs and four product/detail pages correctly, including covers and settled enabled ebook-bag controls. Local actualChrome also confirmed the canonical Hindi hub. Cause was not established; the attempted two-URL Cloudflare purge was denied401 and is not claimed as the remedy. The successful independent reconciliation is recorded in the completion receipt. Historical14-file donor archive was retained separately; no second asset upload or needless rebuild was performed.
