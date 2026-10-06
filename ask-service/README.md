# Ask service — preserved production source and 3 October 2026 repair

**Current source entry:** [integrated portal ownership](../PORTAL-OWNERSHIP.md). The public Ask/FAQ/Sunshine application now starts at `speech-site/ask-runtime/worker.ts` and its Astro pages, with common code in `speech-site/src/`. This directory's legacy worker remains an imported fallback and the MCP bundle remains a separate protected service. Preserve those dependencies; the 3 October versions below are historical and must not overwrite the current runtime.

This directory records the exact deployed Ask and MCP bundles, focused repair source, SQL migrations, tests and sanitised receipts. It is a recovery baseline, not the completed Astro migration. No credentials or Cloudflare binding values are committed.

## Historical release — 3 October 2026

| Service | Live version | Before this repair |
|---|---|---|
| pinnacle-ask | 1aef7f2e-7b2c-4b65-be98-d125b39e6e4b | 5dfcafb0-38fb-4751-87f4-87e7423cc4bd |
| pinnacle-ask-mcp | 5fc3a111-be9d-401e-9856-674534594d5e | 58e6ad4e-babe-4cb9-9807-21b250275f13 |

The portal Worker was preserved at 3d088473-f2d9-4906-8460-6a0f24e0d1dc. All 185 zone routes and the inspected Worker bindings/assets were preserved. The previously repaired www Ask aliases still redirect to the apex canonical.

## Result

- /ask/search?q=... now returns published answers through indexed, read-only ask_public_search instead of ignoring the query.
- Search has explicit empty/no-match/error states, escaped output, canonical answer links and telephone contact. Internal results are noindex, follow in both HTML and HTTP; responses are private/no-store and omit the legacy Google Ads injection.
- The search RPC does not record queries or call an AI model. This is not a promise that all infrastructure or the older MCP search records no queries.
- Ask's existing shared small-screen navigation/footer overflow is corrected. This is not yet the Astro shared shell.
- A genuine missing answer offers search/browse; it no longer claims that the answer necessarily exists.
- MCP home now reports MD-5 MFG/MD/2026/000248, the non-diagnostic scope, the current canonical citation root, dated and qualified network counts and 16 patent applications (13 PCT plus 3 Indian). The historical release ledger remains historical.
- Supabase inventory checked: 41,165 published answer records (32,903 English, 8,262 Telugu). Published is not identical to indexable, clinically reviewed or cited.

## Source and verification

- worker/index.js plus the adjacent WASM are the exact final deployed Ask bundle.
- mcp-worker/index.js is the exact final deployed MCP bundle.
- build-patch.mjs / build-mcp-patch.mjs record bounded transformations against SHA-guarded original bundles.
- migrations contains the applied public search and home metadata SQL, and the retained home rollback definition.
- test-search.mjs passed result, escaping, limits, outage, no-store and robots cases.
- verify-release.mjs checked 12 live destinations, host/query forwarding, search outputs and the corrected MCP response. Recorded counts describe the test date; future inventory growth is not a regression.
- Phone 390, tablet 768 and desktop 1440 browser inspections found no horizontal overflow after the targeted fix. Search was filled and submitted in the browser. Screenshots are local evidence; no physical-device or Safari pass is claimed.
- receipts contains sanitised deployment and production read-back evidence.

## Reuse and deployment

Keep Cloudflare credentials and Supabase credentials in their existing private configuration. Never place them in source, a zip or a receipt. The deploy helper expects a local private evidence directory containing live captured settings, binary-preserved modules and expected versions; it is not a generic overwrite command.

Before a future deployment, capture current versions/settings, require the expected version, preserve assets/bindings and compare the full route table. Do not publish using a narrowed --route argument. Only touch the intended worker. Run focused checks for the changed contract and verify production once.

For recovery, redeploy the listed original Cloudflare versions. Restore the original home SQL only if its correction is the failing change; dropping a new read-only RPC is normally unnecessary. Keep the repaired www Ask routing separately.

## Distribution state

Google/Bing sitemap and IndexNow actions are recorded in the existing Ask discovery ledger. Search result URLs must not be submitted for indexing. Crawl success, indexing, referral traffic, calls and AI citations are separate states.

openai-draft is a prepared local directory package, not uploaded/submitted/approved/published. READINESS.md lists the actual publisher, policy, demonstration and review gates. The live MCP service is version 4.0.0; the existing official MCP Registry entry is still 2.0.0 and needs its existing publisher-auth update.

## Next owner-directed work

The owner has requested a verified Ask route map and an Astro integration work order. Preserve the database and canonical URL graph; replace page templates using the existing common header/footer components. Do not turn 41,165 records into separately maintained pages. See speech-site/ASK-ASTRO-MIGRATION-WORK-ORDER-20261003.md.
