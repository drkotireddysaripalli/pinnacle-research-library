# Exact About alias recovery — 18 October 2026

The live `/about-us` URL returned404 during the shared response-policy verification. Its maintained destination is `https://www.pinnacleblooms.org/about-pinnacle-proven-improvement-rate`, verified200 with that self-canonical. The existing Cloudflare redirect ruleset now contains one exact permanent recovery rule. Worker code, assets, forms, consent and analytics configuration are unchanged.

| Field | Verified value |
|---|---|
| Account | `862998def1cd610fdb86b8e5c1d6ed4d` |
| Zone | `8b13f18e0589996b5d6512552372b434` |
| Existing redirect ruleset | `cfec803096ba4d5d9479e338c8f4ed3f` |
| New rule | `c1c7c172702c422c8bd3bf873228bf6e` |
| Stable ref | `pinnacle_about_us_recovery_20261018` |
| Ruleset versions |33before,34after |
| Earlier rules preserved |12of12;13rules after |
| Saved time |2026-10-18T09:40:11.253559Z |
| Methods |GET and HEAD only |
| Hosts |`pinnacleblooms.org`, `www.pinnacleblooms.org` |
| Exact paths |`/about-us`, `/about-us/` |
| Result |301to the canonical destination; query string preserved |

Eight public GET/HEAD checks cover plain/slash and untagged/approved-tagged variants on www. All8passed. The target returned200 with its self-canonical. No paid ad was clicked, call placed, intake submitted or analytics event dispatched. These are HTTP/static checks, not an actual enquiry or Google indexing result. Existing bare-host canonicalisation remains separate.

Private raw readback: `ask-private/ga4-completion-20261018/about-rule-readback.json`. Public HTTP evidence: `ask-private/ga4-completion-20261018/about-alias-public.json`; repeatable affected-only command: `node ask-private/ga4-completion-20261018/verify-about-alias.mjs`.

Rollback: remove only rule `c1c7c172702c422c8bd3bf873228bf6e`. Do not replace the ruleset or remove its other12rules.
