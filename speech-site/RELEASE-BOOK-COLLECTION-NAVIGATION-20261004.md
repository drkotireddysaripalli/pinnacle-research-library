# Complete-library navigation repair — 4 October 2026

The English PDF, softcover and hardbound complete-library pages linked to an absent `#collections` section. Their comparison action now links to `/books#collections`, where visitors can compare actual offers and formats. All other book actions retain their existing destination.

## Source and deployment

- Shared source: `src/pages/books/[slug].astro`.
- Existing asset compatibility: `deployment/speech-handler.mjs` replaces only the exact obsolete action on these three routes. It invalidates their old ETags and removes stale content-length/digest headers. Future full builds generate the correct link directly.
- Exact current live modules retained; only the serving module changes. `keep_assets:true` preserves the current asset set, including newer commerce galleries and contact measurement. The local full-release asset snapshot was older than production and was deliberately excluded from this release.
- Baseline/rollback: `32d5e4f6-7d76-4bbd-8312-b3fb16691200`.
- Uploaded candidate: `e53a1016-15ab-462b-b005-b996261db856`. Activation and public read-back are recorded in the subsequent release receipt.
- No route, binding, catalogue, price, stock, checkout, feed or primary-image change.

## Verification

- Bounded Screaming Frog crawl: 114 explicit public URLs; separate semantic reconciliation: 81 corporate pages and 99 variants from 33 public Shopify product metadata endpoints.
- All 99 live variants matched source identity and price; all 66 physical variants remained unavailable.
- 29 targeted route/cache tests passed. The new four regression cases are included in `test:unit`.
- Astro built 133 pages successfully; this build was a source validation, not the deployed asset union.
- Three screen widths and live deployment/route verification are saved in the dated external release receipt.

Receipt directory: `work/pinnacle-growth-system/books-integration-20261004` in the website workspace. Indexing requests are not repeated for this small navigation repair.
