# Rendered public entry check · v137 · 1 October 2026

This is the bounded rendered follow-up to the earlier source-only contract capture. Three direct public GET navigations ran in separate fresh headless Chrome contexts, with scripts enabled and all non-GET/HEAD requests blocked. All reached `networkidle` and HTTP 200; no controls were clicked or submitted. Existing browser sessions were not used or changed. No hidden-field values, request headers, phone/account input values, or script query secrets were output in the browser facts.

| Public GET | Current visible result | Contract finding |
| --- | --- | --- |
| `https://www.pinnacleblooms.org/epass` | Homepage-style family/service content, service icons, navigation and footer; visible header search text field `q` and its submit button. No visible account, phone/password/OTP, invoice, amount or payment controls. | A working account entry does not appear in this anonymous rendered context. Retain origin handling pending the actual account contract. |
| `https://www.pinnacleblooms.org/payonline` | Redirects through HTTP 302 to `https://www.pinnacleblooms.org/epass?landing=PayOnline`; the same visible homepage/service content and header GET search form. | Exact `landing=PayOnline` intent survives the rendered navigation. A payment interface does not appear in this anonymous context. |
| `https://www.pinnacleblooms.org/search?q=speech` | Native shortcuts for Speech Therapy, music therapy and Services, followed by a populated Google CSE results overlay for “speech.” Visible result titles include “Speech vs Language: What's the Difference in a Child?”, “What is Speech and Language Skills in child development?”, “Structured Speech at Home: Easy Activities - Pinnacle Blooms,” “Speech Readiness & Your Child's Independence,” and a Nizamabad centre result. | Search retrieval via the existing public `q` GET works after scripts render. Source-only home-style observations cannot establish absent search results. Preserve `/search` and its query/script contract. Interactive query submission was intentionally untested. |

The visible search page has a Google CSE field named `search`; its header input currently has no name in the rendered field inventory. The managed-page header search contract remains GET `/search` with `q`, and the harmless direct GET proves that the target consumes the `q=speech` route and renders results. Do not replace the search endpoint with a static home response or drop the query/CSE behavior.

Each ePASS/PayOnline context blocked seven automatic POST requests, all to Google measurement/Ads endpoints or same-host `/cdn-cgi/rum`. The search context blocked five automatic POST requests: Google measurement/Ads endpoints, `mirracle.user.com/api/v2/user-chatping/`, and `/cdn-cgi/rum`. No first-party account, OTP, invoice, payment or enquiry POST was attempted. No blocked POST was needed for the visible native shortcuts or CSE search results to render. Blocking limits this check to the visible public experience; it does not verify telemetry or chat operation.

Source scripts automatically requested ordinary public page/article/widget GETs. Their request records retain only method, host and pathname, excluding query strings. No source endpoint or credential was separately probed.

The ePASS/PayOnline H1 found in raw source is not visibly rendered in these desktop contexts. This does not affect the observed absence of account/payment controls. Screenshots were visually inspected and agree with the visible DOM observations.

Private receipts and screenshots:

- `epass-rendered.facts.json` and `epass-rendered.png`
- `payonline-rendered.facts.json` and `payonline-rendered.png`
- `search-speech-rendered.facts.json` and `search-speech-rendered.png`
- `rendered-contract-summary.json`: compact current findings and blocked-request classes
- `rendered-browser-summary.json`: complete bounded public rendered facts

No product edits, Git operations, route changes, deployment or release action occurred. This check leaves the earlier account/payment operational gate intact and provides current positive evidence that the public search GET renders results.
