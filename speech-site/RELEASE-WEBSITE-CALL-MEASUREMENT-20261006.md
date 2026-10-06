# Website-call measurement repair — 6 October 2026

## Deployed and verified

Core source `05c4ca7674de0f9a181b00024a8b76c6cbef26e5`; final wrapper correction `3d2cd929903d692df70b57caca8c3e4010ffff3f`. Both revisions are pushed and their Portal quality CI runs passed. Final receipt: `deployment/website-call-release-20261006.json`.

| Component | Live version | Pre-release rollback |
|---|---|---|
| Portal | `1243d4af-45f6-4af2-9ba5-5aa4211a46ea` | `08a768e3-d753-49bb-989f-c3654e6ab599` |
| Ask | `0d82cf35-b143-4ed4-866e-f87abd08366f` | `800a09a7-556c-4311-b07e-2ac548fd7c61` |
| Call wrapper | `3bb558bd-2575-44d4-a74c-476648ec34af` | `2fa26689-51f7-4a04-a835-a69d2627b15f` |

Human authority: the Google Ads owner asked to send this prepared repair to the website owner; Dr. Koti replied “Send the repair to that task.” Implementation/release remains in this website thread. Growth schedules and unrelated page work remain held.

The existing independent advertising-call preference is added through SiteFooter/AdCallPreferences, PageLayout and AskLayout. The shared call module updates displayed national numbers and their telephone targets after consent. It retains ordinary calling, local centre numbers, privacy controls, default denial and withdrawal. Analytics and advertising choices no longer overwrite each other or duplicate Google's loader. Verify's older reader is corrected through the existing wrapper on the three eligible Verify pages. The approved navigation, footer content, native Anek typography and page narratives remain intact.

Existing Google conversion action: AW-10810823199/VNUcCMSy3YobEJ-kgKMo. No bids, budgets, conversion thresholds, MyOperator settings, remarketing audiences, patient records, commerce records or real calls are changed/created by this repair.

## Verification and corrected findings

- Production static Astro and Ask builds pass. Static build compiled 135 pages.
- 454 unit/regression tests pass, including consent lifecycle, withdrawal, callback display/dial handling, private-page exclusions, analytics, protected routes, enquiries and commerce. The final wrapper correction passed 13 focused checks and its own CI run.
- One independent read-only reviewer found two cross-tab restoration/withdrawal cases; both were fixed with regression checks.
- Browser checks cover default-off, refusal, analytics-only, GPC, both permission orders, one loader, withdrawal and a separate callback fixture. The direct-visit network check loaded Google only after advertising permission; no paid click, call or enquiry was generated.
- Seven live Speech consent cases and four live Ask route checks passed. Anonymous `/ask/account` redirects to public `/ask`; the private Telugu search route retains no call module or visible preference. These checks did not exercise a signed-in account.
- The first release's Verify reader rewrite was mistaken for an already-installed call bootstrap. The panel stayed hidden; the first physical iOS run correctly failed that Verify check. A focused script-detection correction, unit regression, CI and wrapper-only deployment resolved it. The earlier failed evidence remains in the device coverage record.
- The final delivered Verify scripts passed both permission orders and withdrawal in live Chromium, with Google requests blocked in those two cases to avoid QA reporting. Three Verify documents retain their original text, titles and links and now load one reader script plus one call bootstrap.
- Inspected local/candidate and live screenshots cover widths 320, 390, 768 and 1440 using Chromium/WebKit. Physical Speech checks passed on iPhone 15 / iOS 18 Safari and Pixel 8 / Android 17 Chrome. The corrected Verify panel passed on iPhone 17 Pro / reported iOS 26.5 Safari. These are narrow consent-control checks, not an exhaustive site/device certification. All sessions closed; exact observations and screenshots are in `deployment/website-call-proof-20261006/`.

## Release boundary

All 209 routes, four portal bindings, 21 Ask bindings and the wrapper binding are preserved. All 2,160 portal assets were reused. Of 36 Portal modules, only the existing generated analytics-script module changed; unrelated generated page overlays from the full build were excluded. Ask deployed its current full build. Text, title and link checks passed across 19 public control pages, with the three Verify documents checked again after the wrapper correction. AskMCP, legacy-social and root-sitemap versions remain unchanged.

Public examples: [Speech](https://www.pinnacleblooms.org/top-speech-therapy-center-india-proven-improvement-rate), [Ask](https://pinnacleblooms.org/ask), [Everyday practice](https://www.pinnacleblooms.org/verify/guides/everyday-practice.html), [AbilityScore guide](https://www.pinnacleblooms.org/verify/guides/abilityscore.html) and [Paradigm Shift evidence](https://www.pinnacleblooms.org/verify/evidence/pinnacle-paradigm-shift.html).

Real eligible Google forwarding allocation and a naturally occurring connected qualified call remain business outcomes to observe separately. This Ads repair does not establish resolution of the separate organic Ask GSC/GA4 coverage discrepancy. No indexing submission is needed for this measurement-only release. Growth automation and unrelated page work remain held.
