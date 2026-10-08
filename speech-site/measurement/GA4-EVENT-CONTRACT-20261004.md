# GA4 event contract — current 8 October 2026; historical 4 October record

## Current release boundary

The automatic accepted-enquiry, protected-reporting and three Google Ads journey events are delivered. Latest deployed portal source: `807ada10c541278a818fb8b3e295eda6b7dc2d84`; portal version `6ef726ae-6a35-4cbd-80c0-3100c61f338e`; deployment `ed491937-c682-4f32-aa98-ec74dc85c1a8`, promoted 8 October at 20:20:04 IST. Protected receiver version `9ac540df-fdba-4b3f-85cc-4858859ae416` is unchanged. The portal preserves 265 routes, 45 modules and the 3,706-asset estate. Live shared-script read-back passed on 65 callback/enrolment documents: 64 inline callbacks plus enrolment.

Evidence: `../deployment/paid-journey-20261008.json`, `../deployment/paid-journey-public-readback-20261008.json`, `../deployment/paid-journey-validation-20261008.json` and `../deployment/enquiry-analytics-receiver-20261008.json`.

**Exact-source [CI 37794182480](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37794182480) succeeded, including 5/5 TestingBot BVT page cases on Chrome 153 / Windows 11, 1440×900.** The live script passed 12/12 SDK cases in Chromium/WebKit with collection intercepted. Together with 69 focused checks and 65 public read-backs, this proves the scoped website contract. It does not prove actual Google receipt, approved visuals, new physical paid-event coverage or deployment of separate Ask/knowledge workers.

## Current event dictionary

All events target the established GA4 stream `G-2BYLRLFRDJ`. Event transport, GA4 key-event registration and Google Ads conversion/goal selection are separate states.

| Event | Trigger / counting | Measurement meaning |
|---|---|---|
| `enquiry_accepted` | Actual matching durable accepted receipt; deduplicated by request. Existing GA4 key event is once per event. | Received request, not a unique family, qualification, booking or admission. Automatic for undecided visitors with denied Analytics storage. |
| `phone_link_click` | Existing permitted central-call interaction. Raw taps can repeat; the saved 4 October key-event setting is once per session. | Call intent only. Generic optional measurement remains permission-gated. |
| `whatsapp_click` | Existing permitted central WhatsApp contact interaction. Sharing text and arbitrary phones are excluded. | Contact intent only; not message receipt or accepted enquiry. Generic optional measurement remains permission-gated. |
| `google_ads_arrival` | Currently tagged paid landing; once per page. | Navigation only. New automatic paid-journey event; no key-event/conversion registration is claimed by this source change. |
| `google_ads_phone_click` | Central phone/centrally marked forwarding-number tap on a detected Ads journey; once per page. | Interaction only, not a connected/qualified call. |
| `google_ads_whatsapp_click` | Valid central WhatsApp contact tap on a detected Ads journey; once per page. | Interaction only, not a received message or lead. |

Ads classification requires sanitised `gclid`, `gbraid` or `wbraid`, or case-insensitive `utm_source=google` plus a permitted paid medium: `cpc`, `ppc`, `paid`, `paid_search`, `paidsearch`, `paid-search`, `paid search`, `cpm`, `cpv`, `display`, `paid_social` or `paid_video`. Google referrer alone, organic Google and other platforms do not qualify. This identifies supplied tags; it does not verify an actual advertising charge.

Only current tags create an arrival. Contact events may use the existing permitted retained acquisition source on later untagged pages; current source takes precedence. Granted events use fixed `traffic_source: google_ads`, `source_basis: current_url / permitted_journey` and `attribution_method: click_id / paid_utm`, plus already sanitised campaign fields where present. The separate bookshop scope cannot borrow the therapy source record.

## Automatic transport, refusal and privacy

- Undecided: `enquiry_accepted` and the new Ads arrival/contact events use `analytics_storage: denied`. Ads events include fixed Google Ads classification and coarse public fields; they omit raw click IDs, campaign identifiers, referrer and private fields. No optional source record is created by that path.
- Granted: existing campaign sanitisation, approved/coarse page identity and recognised public referrer origin may be used. Arbitrary query, private answer/search paths, credentials, emails, phone-like/oversized values, form data, receipt/request IDs and child information remain excluded.
- Explicit refusal, GPC, labelled QA, private/search paths and nonproduction guards suppress these Google events. A later opt-in cannot replay an already sent receipt or paid-journey event. Optional browsing events stay permission-gated.
- Advertising storage follows the separate call-measurement choice; Analytics cannot overwrite it. Signals/personalisation remain off.
- Native phone/WhatsApp actions are not prevented, delayed or stopped. SDK loader/event failures cannot prevent contact or alter receipt acceptance. No `call_connected` event is emitted.

The client accepts only a matching versioned durable receipt before showing confirmation. The private server ledger supplies idempotency and exact protected intake references; the public browser/vendor payload excludes those private references. Unknown handoffs are held rather than automatically repeated.

## Owned records and account configuration

`../deployment/automatic-enquiry-ledger-readback-20261008.json` records one accepted receipt in the protected cohort, predating the new transport release, with unknown source and zero accepted rows with permitted campaign evidence. No contact fields are exposed. Whole-cohort counts are independent of the 1,000-row detail limit; `countScope`, `rowCountScope`, truncation and receipt-creation time basis are explicit. `googleDelivery` and downstream outcomes remain unknown without their authoritative records.

The 8 October Ads configuration read-back records accepted-enquiry action **7818845893** as **Submit lead form / Secondary / One**. Generic form action **7270463226** is **Secondary**, retaining **Every / INR 5,000**. Generic `form_submit` is not the durable accepted event. Primary/custom-goal selection and dependency decisions remain with the Ads owner.

GA4 read-back for 1–7 October confirms `enquiry_accepted` is registered, with zero observed events in that settled window. This is not evidence of zero business enquiries, nor a backfill of the existing protected receipt. A single 8 October standard-report read at 20:24 IST returned no rows for the four acquisition events; current-day freshness and genuine post-release traffic are unconfirmed. Evidence: `../deployment/ga4-acquisition-observation-20261008.json`. The paid-journey release has 69 passing focused checks, 5 exact-source TestingBot BVT cases, 12 intercepted SDK cases and 65 public HTML read-backs. No real test Google event, call, WhatsApp message or customer submission was manufactured.

## Reporting and remaining acceptance

Filter reports to the exact event. Keep arrivals, taps, generic forms, page-derived events, accepted receipts, connected calls, qualified enquiries, booked assessments, attendance and admission separate; never sum `allKeyEvents` into leads. Existing generic and explicit Ads interaction events can describe the same permitted tap and must not be added together as independent contacts.

The website owner retains supported destination/performance repairs and the documented traffic-quality integration in `../ACQUISITION-TRAFFIC-QUALITY-20261008.md`. The Ads owner retains actual GA4 receipt, forwarding/connected-call proof, campaign/custom-goal selection, eligible impression coverage and invalid-click/credit reporting. Operations supplies dated authoritative qualification/booking/attendance/admission joins. Reporting and source retention do not establish that chain. A brief, repeated or nonconverting visit cannot establish fraud or malicious intent.

## Historical record — 4 October 2026

The following is the preserved earlier configuration/evidence record. Its boolean-only adapter, opt-in-only accepted event, once-per-page listener, blanket campaign clearing, absent receiver deduplication and legacy coverage statements are **historical and superseded by the current 8 October contract above**. Historical QA exclusions remain relevant to their stated periods. Historical statements about unaudited Ads dependencies do not override the two 8 October action read-backs above.

Configuration verified 4 October 2026. Growth action: `MEASURE-CALL-JOURNEY`; action ID `adafc5f2-6764-488a-b164-3b6939af5b18`.

### Historical saved Analytics configuration

The existing PinnacleBlooms GA4 property now has these distinct key events. GSC Wizard read-back confirmed both registrations on 4 October.

| Event | Actual meaning | Key-event counting | Business interpretation |
|---|---|---|---|
| `phone_link_click` | A consented click on an allowed link to `tel:+919100181181` | Once per session, from 4 October | Call intent. Not a connected or qualified call. Raw event count can contain repeat taps. |
| `enquiry_accepted` | The enrolment browser received the same-origin adapter's accepted response | Once per event; no default monetary value | Request accepted by the existing intake API. Not an appointment, unique family, qualified lead or admission. |

No page-view-derived event was created. The accepted-enquiry event already exists in the released website code. Registration does not backfill historical key events or establish new enquiries. No test customer submission or Analytics event was sent during this change.

### Historical confirmed legacy definitions

The Google Analytics main stream's Custom configurations screen directly showed:

| Existing event | Matching condition | Reporting rule |
|---|---|---|
| `enroll` | `event_name equals page_view`; `page_path starts with /enroll` (case-insensitive) | Enrolment-page view, never accepted enquiries or admissions. |
| `contact_us` | `event_name equals page_view`; `page_path starts with /contact` (case-insensitive) | Contact-page view, never contact requests or calls. |
| `ads_conversion_Page_view_Page_load_www_1` | `event_name equals page_view`; `page_path starts with /enroll` (case-insensitive) | Another enrolment-page-view measure; do not add it to enquiries. |
| `form_submit` | Generic form event; not the intake API acceptance contract | Do not report as accepted parent enquiries. It can include unrelated forms. |
| `BOOKDOWNLOADFAILED` | Legacy event currently registered as a key event | A failure-labelled event is not a successful download or lead. Investigate its Ads dependencies before retiring that goal. |

The legacy definitions and their existing key-event registrations were retained. Their Google Ads conversion dependencies have not yet been audited. Do not use the property's combined `allKeyEvents` total as a lead/admission KPI, and do not let GSC Wizard automatically choose the most active legacy event for a lead report.

### Historical report selection

For GSC Wizard `get_ga4_key_events`, always supply the exact event:

- `keyEvent: enquiry_accepted` for observed API-accepted requests.
- `keyEvent: phone_link_click` for sessions showing telephone-link intent.
- Use `query_ga4_report` filtered to the event when raw event counts or repeated taps are needed. Keep the event-count and key-event-count columns separate.
- Use completed periods. The first post-configuration complete day is 5 October; wait for its settled data before assessing it. No hourly positive trend is promised.
- Measure connected/qualified calls, booked/attended visits and admissions through the existing operator/PinnacleAI/sales records. These are not supplied by GA4 alone.

### Historical acceptance, privacy and coverage — superseded runtime description

`public/pinnacle-pages-scripts/enrolment.js` dispatches `pinnacle:enquiry-accepted` only after `submitEnrolment()` returns `accepted`. `enrolment-api.mjs` requires successful HTTP plus `status: accepted`. `deployment/enrolment-handler.mjs` creates that response only after the upstream service returns successful HTTP and the exact accepted `true` value.

`speech-measurement.js` records that event only on the production enrolment route, after optional Analytics consent, without Global Privacy Control, and once per page load. It sends fixed coarse fields, not family details, contact numbers, notes, request IDs, query strings or child-health data. No monetary value or Ads conversion action was added. Consent, script blocking and interrupted requests mean Analytics is an observed subset.

The script deliberately clears campaign/referrer fields and collapses Ask and centre-detail locations. It does not prove a full source-to-admission attribution chain. The client request ID is not durable server-side deduplication; do not describe API acceptances as unique families.

The separate Kukatpally legacy repair does not currently load this consented measurement module. Its new introduction's links therefore cannot be claimed as coverage for these exact managed-page events. Add that coverage as a focused follow-up with the same privacy contract.

### Historical known QA exclusion — preserve the dated exclusion

`helpline-site/measurement-browser-receipt-20260925.json` records eight synthetic `phone_link_click` events at approximately 11:51–11:55 UTC on 25 September, with no telephone calls. The saved 2–29 September baseline contains eight such events from one user. Exclude the known eight test taps from business-growth claims; the receipt is not evidence of organic call generation. Do not delete source data or subtract the same exclusion from unrelated periods.

Future automated tests must intercept or stub Analytics and intake requests. Never manufacture production leads to make a dashboard appear active. No historical user identifier or child information is required for this reporting correction.

### Historical verification and remaining limits

- Analytics UI: saved key-event list, once-per-session call setting, and no-code-transformation enquiry registration verified.
- GSC Wizard: both event names present; a report explicitly selecting `enquiry_accepted` returned successfully. Its historical zero is not a claim that the business received zero enquiries.
- Production GET read-back: enrolment page HTTP 200, indexable, `data-preview=false`, existing `/api/enrolment`; enrolment scripts match repository bytes; measurement script matches normalized text (line-ending byte difference only).
- Local checks: 28 measurement tests passed; 17 of 18 enrolment tests passed. The remaining check read the local preview build and expected production robots metadata. Production GET confirmed the correct indexable metadata; no runtime defect was inferred from that preview-build mismatch.
- No website runtime, Cloudflare route, binding, common header/footer, Ask authentication, catalogue, stock or payment record changed in this action. This is a saved Analytics configuration change plus a versioned reporting contract, not a website deployment.

Local private proof is retained in `work/pinnacle-growth-system/measurement-20261004/` outside the public repository. Follow-up: audit legacy Ads goal dependencies, observe real settled event receipt, and add consented coverage to the separate Kukatpally repair. Only confirmed operational data can complete call-to-admission measurement.
