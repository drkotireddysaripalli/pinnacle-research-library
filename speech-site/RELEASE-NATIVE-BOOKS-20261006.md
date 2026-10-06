# Native book route and asset inventory repair — 6 October 2026

## Source prepared

Restore 46 existing Hindi/Telugu book destinations and 16 approved sample images already expected by the book route registry. Retain all published English book/collection content, PinnacleAI, the common header/footer, Verify and Ask. No catalogue, stock, payment, authentication or new marketing-copy changes.

The previous deployment inventory was stale relative to the approved active raw asset collection. Two candidates exposed this discrepancy and were rolled back to `5e5cad5b-ecf4-4a12-a38b-6cd4fb2c1a7e`; the protected public outputs were then confirmed restored. Do not reuse either rejected candidate.

The corrected frozen union is `release-native-books-20261006`: 2,160 files. All 634 Verify and 1,521 portal inventory entries were checked against their actual files. Ninety stale portal inventory hashes were reconciled. The six previously mismatching protected page/feed outputs now reproduce the approved live content exactly. All native book HTML dependencies are present and mapped; three focused regression tests passed without skips.

Approved historical raw transfer is pinned to artifact commit `4a0f1655fde09a76c04ed7a35b7cceb03d84d4cc`, `approved-raw-recovery/latest-approved-raw.json.xz`, SHA-256 `353b5769b5ac991ba922fcfbcba366c78cae45adaaa6a358df7c0fe58feea97f`. The 50 remaining historical pages were restored using bounded exact transformations and matched that approved full manifest. Twelve unused historical files were absent before and are not referenced by any restored HTML; they do not block this repair and are not claimed restored.

Upload this explicit asset manifest with the committed Worker source. Do not use `keep_assets`: it retains the most recently uploaded collection, which may differ from the active rollback version. Preserve all 209 routes and the four portal bindings. Wait for deployment propagation and verify public content against the original read-back before declaring success.

## Release state

Prepared and checked; publication, final live regression results and discovery receipt will be appended after their actual completion. No search score, indexing or lead gain is inferred from deployment.
