# Call and enquiry measurement contract

Configuration verified 4 October 2026. Growth action: `MEASURE-CALL-JOURNEY`; action ID `adafc5f2-6764-488a-b164-3b6939af5b18`.

## Saved Analytics configuration

The existing PinnacleBlooms GA4 property now has these distinct key events. GSC Wizard read-back confirmed both registrations on 4 October.

| Event | Actual meaning | Key-event counting | Business interpretation |
|---|---|---|---|
| `phone_link_click` | A consented click on an allowed link to `tel:+919100181181` | Once per session, from 4 October | Call intent. Not a connected or qualified call. Raw event count can contain repeat taps. |
| `enquiry_accepted` | The enrolment browser received the same-origin adapter's accepted response | Once per event; no default monetary value | Request accepted by the existing intake API. Not an appointment, unique family, qualified lead or admission. |

No page-view-derived event was created. The accepted-enquiry event already exists in the released website code. Registration does not backfill historical key events or establish new enquiries. No test customer submission or Analytics event was sent during this change.

## Confirmed legacy definitions

The Google Analytics main stream's Custom configurations screen directly showed:

| Existing event | Matching condition | Reporting rule |
|---|---|---|
| `enroll` | `event_name equals page_view`; `page_path starts with /enroll` (case-insensitive) | Enrolment-page view, never accepted enquiries or admissions. |
| `contact_us` | `event_name equals page_view`; `page_path starts with /contact` (case-insensitive) | Contact-page view, never contact requests or calls. |
| `ads_conversion_Page_view_Page_load_www_1` | `event_name equals page_view`; `page_path starts with /enroll` (case-insensitive) | Another enrolment-page-view measure; do not add it to enquiries. |
| `form_submit` | Generic form event; not the intake API acceptance contract | Do not report as accepted parent enquiries. It can include unrelated forms. |
| `BOOKDOWNLOADFAILED` | Legacy event currently registered as a key event | A failure-labelled event is not a successful download or lead. Investigate its Ads dependencies before retiring that goal. |

The legacy definitions and their existing key-event registrations were retained. Their Google Ads conversion dependencies have not yet been audited. Do not use the property's combined `allKeyEvents` total as a lead/admission KPI, and do not let GSC Wizard automatically choose the most active legacy event for a lead report.

## Report selection

For GSC Wizard `get_ga4_key_events`, always supply the exact event:

- `keyEvent: enquiry_accepted` for observed API-accepted requests.
- `keyEvent: phone_link_click` for sessions showing telephone-link intent.
- Use `query_ga4_report` filtered to the event when raw event counts or repeated taps are needed. Keep the event-count and key-event-count columns separate.
- Use completed periods. The first post-configuration complete day is 5 October; wait for its settled data before assessing it. No hourly positive trend is promised.
- Measure connected/qualified calls, booked/attended visits and admissions through the existing operator/PinnacleAI/sales records. These are not supplied by GA4 alone.

## Acceptance, privacy and coverage

`public/pinnacle-pages-scripts/enrolment.js` dispatches `pinnacle:enquiry-accepted` only after `submitEnrolment()` returns `accepted`. `enrolment-api.mjs` requires successful HTTP plus `status: accepted`. `deployment/enrolment-handler.mjs` creates that response only after the upstream service returns successful HTTP and the exact accepted `true` value.

`speech-measurement.js` records that event only on the production enrolment route, after optional Analytics consent, without Global Privacy Control, and once per page load. It sends fixed coarse fields, not family details, contact numbers, notes, request IDs, query strings or child-health data. No monetary value or Ads conversion action was added. Consent, script blocking and interrupted requests mean Analytics is an observed subset.

The script deliberately clears campaign/referrer fields and collapses Ask and centre-detail locations. It does not prove a full source-to-admission attribution chain. The client request ID is not durable server-side deduplication; do not describe API acceptances as unique families.

The separate Kukatpally legacy repair does not currently load this consented measurement module. Its new introduction's links therefore cannot be claimed as coverage for these exact managed-page events. Add that coverage as a focused follow-up with the same privacy contract.

## Known QA exclusion

`helpline-site/measurement-browser-receipt-20260925.json` records eight synthetic `phone_link_click` events at approximately 11:51–11:55 UTC on 25 September, with no telephone calls. The saved 2–29 September baseline contains eight such events from one user. Exclude the known eight test taps from business-growth claims; the receipt is not evidence of organic call generation. Do not delete source data or subtract the same exclusion from unrelated periods.

Future automated tests must intercept or stub Analytics and intake requests. Never manufacture production leads to make a dashboard appear active. No historical user identifier or child information is required for this reporting correction.

## Verification and remaining limits

- Analytics UI: saved key-event list, once-per-session call setting, and no-code-transformation enquiry registration verified.
- GSC Wizard: both event names present; a report explicitly selecting `enquiry_accepted` returned successfully. Its historical zero is not a claim that the business received zero enquiries.
- Production GET read-back: enrolment page HTTP 200, indexable, `data-preview=false`, existing `/api/enrolment`; enrolment scripts match repository bytes; measurement script matches normalized text (line-ending byte difference only).
- Local checks: 28 measurement tests passed; 17 of 18 enrolment tests passed. The remaining check read the local preview build and expected production robots metadata. Production GET confirmed the correct indexable metadata; no runtime defect was inferred from that preview-build mismatch.
- No website runtime, Cloudflare route, binding, common header/footer, Ask authentication, catalogue, stock or payment record changed in this action. This is a saved Analytics configuration change plus a versioned reporting contract, not a website deployment.

Local private proof is retained in `work/pinnacle-growth-system/measurement-20261004/` outside the public repository. Follow-up: audit legacy Ads goal dependencies, observe real settled event receipt, and add consented coverage to the separate Kukatpally repair. Only confirmed operational data can complete call-to-admission measurement.
