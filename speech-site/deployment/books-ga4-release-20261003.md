# GA4 bookshop routing release — 3 October 2026

**Deployed and publicly verified:** managed-page and bookshop analytics now target the verified main GA4 stream, and the Hindi/Telugu catalogue routes can emit the existing consented book events.

- Main property: **361649365**; web stream **4811231552**; measurement ID **G-2BYLRLFRDJ**. The script previously targeted G-H9CLX1WJ7R. The separate Verify stream was not changed.
- Route handling now accepts the exact catalogue-derived native product and English merchant landing paths, plus `/books/hi` and `/books/te`. Unknown/malformed destinations remain excluded.
- Consent, Global Privacy Control, withdrawal, event names, permitted payloads and purchase semantics are unchanged. No synthetic purchase events were introduced.

| Release evidence | Verified result |
|---|---|
| Remote source | `c8efed52a69e563bc09c7d77c94c62e61df4fa15` |
| Local source | `cbf8799` |
| Source tree | `36c82bac94fbfda18dabe1ed6354f80c86a1c78a` |
| CI | [37063134826 — SUCCESS](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37063134826) |
| Cloudflare version | `566997b3-0387-45f3-8da5-dd826396045b` |
| Live measurement-script SHA256 | `a62a6d1956127a523da70ea31ade2bb838afca1a1e6ef3a405c641cb0c9dcdc9` |
| Validation | 26 measurement tests passed; production build passed; broader CI checks passed |
| Deployment scope | One changed deployed asset: `speech-measurement.js`; 2,144 other files byte-identical; 184 routes and four bindings preserved |

The main agent applied three source files: the measurement script, targeted measurement regressions and the existing Ads-consent validator’s expected GA4 ID. The main agent confirmed the deployed script’s hash, G-2BYLRLFRDJ and nested-route handling. No UI changed; previously accepted visual evidence was reused. This record incorporates that verified release handoff; it does not claim another browser or payment test.

Shopify Google & YouTube Analytics setup was separately saved at **2 of 2 tasks complete** for the same property/measurement ID; see `shopify-google-analytics-link-receipt.json`. That account configuration and this website release are complete. Receipt of a real successful Shopify purchase event, captured payment and correct customer download/email delivery remains unverified. `purchase` already exists as a key event in the main property; do not create a duplicate or treat legacy BOOKDOWNLOADSUCCESS as proof of a paid book sale.

Investigation and patch history: `ga4-routing-repair/FINDINGS-AND-APPLY.md`. The prepared patch has now been applied and released; do not reapply it.
