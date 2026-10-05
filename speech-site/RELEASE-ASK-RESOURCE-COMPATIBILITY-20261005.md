# Ask published-answer availability repair — 5 October 2026

Action: `ASK-ANSWER-503` / `fbeccdba-3813-4939-b3e2-5d55f254ba6d`.

## Confirmed problem and correction

Ahrefs project10477830, completed crawl2026-10-05T01:00:37UTC, reports4520 answer5xx responses. Database inspection found exactly4520 published answers whose related resources use the legacy `{count, items}` format:3807 technique records and713 material records. The page spread/map operations expected arrays and threw despite the actual answer being available. The remaining36645 published records have no related-resource value.

Normalise both supported shapes at the shared answer repository boundary. Keep every actual resource field, full answer, sources, publication policy and related navigation. HTML and public JSON/Markdown consumers receive consistent lists. Missing answers remain404 and genuine lookup failures remain503. No answer records, authentication settings, shared header/footer or portal routes are changed. The HTML edge-cache version advances to avoid serving older rendered pages after release.

## Checks

- Two focused regressions cover legacy envelopes, array values, missing values, full content/source preservation, missing records and failed lookup behaviour.
-23existing authentication tests passed with the two regressions (25total); local Google-only overlay/account compatibility checks passed, with no sign-in or OTP sent.
- Local rendered checks pass on six real answers: three Ahrefs failures, two material-envelope failures, and an unaffected AbilityScore control. Each has its actual explanation, canonical, indexable policy, matching OG URL, parseable JSON-LD and public JSON/Markdown exports.
- Seven controls cover home, lens, Telugu entry, sitemap, search, genuine404 and private anonymous session. Test script:`scripts/verify-ask-resource-repair.mjs`.
- Production receipt must include the committed code, promoted version, preserved194routes and bindings, unchanged portal/MCP versions, and public read-back. A build or upload alone is not delivery.

## Search evidence and remaining work

GSC inspected the failing eye-contact URL as indexed, but its last successful Google crawl was19September. This historical result does not contradict the current503. In the settled5September–2October window, the sampled expressive/receptive answer had1click/6impressions and pretend-play had0clicks/7impressions. These are pre-repair observations, not attributed gains.

Ahrefs'4520sitemap5xx/noindex groups overlap the failing answer group. Do not add them as independent affected pages. Other findings remain separate:746canonical URLs without incoming links,381orphans, and10not-found destinations. The10destinations are malformed translated link tokens (`L000`/`L002` and wrapped variants), not evidence that real new destination pages should be invented. Source translations need exact destination restoration; no blanket redirect or soft200.

Notify IndexNow only for the materially restored URLs, once after public verification. Add one dated GSC repair annotation. Wait for subsequent natural/scheduled crawls to update Ahrefs/GSC findings; do not claim the historical audit is already cleared or that indexing/rankings/enquiries improved.
