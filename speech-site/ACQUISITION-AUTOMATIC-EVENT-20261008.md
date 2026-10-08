# Acquisition completion and automatic measurement — 8 October 2026

**Delivered and verified at the website boundary. Google Ads journey source `807ada10c541278a818fb8b3e295eda6b7dc2d84` is live on portal version `6ef726ae-6a35-4cbd-80c0-3100c61f338e`, deployment `ed491937-c682-4f32-aa98-ec74dc85c1a8`, promoted 8 October 2026 at 20:20:04 IST. Real GA4 reporting, call connection and downstream operational outcomes remain separate acceptance conditions.**

## Delivered website work

- Latest deployed portal source: `807ada10c541278a818fb8b3e295eda6b7dc2d84`; version `6ef726ae-6a35-4cbd-80c0-3100c61f338e`. The guarded release preserves **265 routes, 45 modules and the 3,706-asset estate**. One changed shared measurement asset was uploaded. The earlier franchise and callback privacy corrections remain in the retained base. Evidence: `deployment/paid-journey-20261008.json`, `deployment/paid-journey-public-readback-20261008.json` and the earlier polish read-back.
- The automatic-enquiry release checked **65 callback/enrolment pages, all passing: 64 inline callback pages plus enrolment**. These cover 59 domestic centre templates, the directory, Speech information, OT, ABA and Autism. Centre/service preferences remain editable; calling 9100 181 181 remains immediately available. Evidence: `deployment/automatic-enquiry-public-readback-20261008.json`; six physical-device cases passed in `deployment/automatic-enquiry-physical-20261008/summary.json`.
- A matching durable receipt is required before confirmation. The private receiver records accepted enquiries independently of Google, browser scripts and optional analytics choice. Its reporting RPC is active on receiver version `9ac540df-fdba-4b3f-85cc-4858859ae416`. Whole-cohort counts are separate from the 1,000-row detail limit; the time basis is **receipt creation with current states at read time**, not acceptance-event time. Evidence: `deployment/enquiry-analytics-receiver-20261008.json` and `deployment/automatic-enquiry-ledger-readback-20261008.json`.
- The protected ledger read-back contains **one accepted receipt that predates the new transport release**, with **unknown source / zero accepted records with permitted campaign evidence**. It exposes no contact fields. This proves an existing retained business record; it does not prove a new attributed lead, Google receipt, connected call, appointment, attendance or admission.
- `enquiry_accepted` is automatic on actual matching acceptance. An undecided visitor uses denied Analytics storage; explicit refusal, GPC and labelled QA suppress Google transport. Advertising storage follows its separate call-measurement choice. No request/receipt identifiers, contact details, message or child information enters Google. Intercepted SDK evidence for the accepted-event release is transport evidence, not a real Google conversion.

## Paid-journey contract — delivered

| Event | Trigger and counting | Business meaning |
|---|---|---|
| `google_ads_arrival` | Currently tagged paid landing; once per page | Navigation, not a lead |
| `google_ads_phone_click` | Central helpline/centrally marked forwarding-number tap on a detected Ads journey; once per page | Contact intent, not a connected call |
| `google_ads_whatsapp_click` | Valid central WhatsApp contact tap on a detected Ads journey; once per page | Contact intent, not a received enquiry |

Detection requires sanitised `gclid`, `gbraid` or `wbraid`, or `utm_source=google` plus an allowed paid medium. Organic Google, a Google referrer alone and other advertising platforms do not qualify.

These three events run immediately for undecided users with `analytics_storage: denied`, fixed Google Ads classification and coarse public fields. **No raw click IDs, campaign identifiers, referrer or private fields are sent in that mode, and no optional source record is stored.** Granted analytics may use the existing sanitised campaign path. Explicit refusal/GPC/QA/private/search guards remain; later opt-in cannot replay a sent event.

Only current tags create an arrival. Contact events may use an existing permitted retained Ads source on later untagged pages. Current source takes precedence; bookshop cannot borrow the separate therapy source record. Measurement neither prevents nor delays native phone/WhatsApp actions; loader/dispatch failures leave contact usable. No `call_connected` event is emitted. Existing generic optional events remain separate.

**Verification:** 69 focused checks passed; exact-source [CI 37794182480](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37794182480) succeeded, including **5/5 TestingBot BVT page cases** on Chrome 153 / Windows 11 at 1440×900. **65/65 live callback/enrolment pages** carry the new cache-busted shared script and native central phone links. **12/12 SDK cases** passed using the live script in Chromium/WebKit across undecided, accepted, declined, GPC, QA and organic cases. Google collection was intercepted: zero live test Analytics events, customer submissions, calls or WhatsApp messages. The harness corrections concerned batched POST parsing and an opened test disclosure; production code did not require another change. Visual baselines remain provisional, and no new physical paid-event proof is claimed. Evidence: `deployment/paid-journey-validation-20261008.json`, `deployment/paid-journey-sdk-20261008.json` and `deployment/paid-journey-public-readback-20261008.json`.

**Actual Google observation:** the single current-day GA4 report read at 20:24 IST returned no rows for the four acquisition events. Reporting freshness and genuine post-release traffic are unconfirmed. This neither proves zero business enquiries nor proves delivery into Google. Evidence: `deployment/ga4-acquisition-observation-20261008.json`. Standalone knowledge/Ask workers were not promoted by this release; their separate rollout is not claimed.

## Seven-item acceptance and residual work

| Work-order item | Delivered / remaining condition |
|---|---|
| 1. Actual advertising destinations | Fresh Ads-owner inventory covers 73 origin/path rows; 72 passed availability. The Ask destination is available with its retained reader gate and central calling. The recorded `mobile.pinnacleblooms.org/services` exception still ends at a legacy HTTP 500 and drops the query; no superseding repair is claimed. Two Therapy Services sitelinks were changed to the live centre directory, but both actual editors showed Ask as their previous URL. That change does not prove removal of every mobile `/services` association. Evidence: `deployment/paid-destination-coverage-20261008.json` and `deployment/ads-acquisition-settings-20261008.json`. Ads owner must reconcile active associations/mobile overrides and preserve held locations. |
| 2. Commercial opening and callbacks | Delivered across the 65-page cohort above, including OT/ABA/Autism. Exceptions outside that cohort retain their existing journeys. |
| 3. Appointment, fee and credibility information | Shared practical decision guidance and source-backed service/location evidence are delivered. Actual prices, suitable professionals, current operating capacity and appointment times must come from receiving staff; enquiry is not a confirmed appointment. |
| 4. Availability and mobile friction | Reported shared failures have scoped recovery/read-back evidence, including the latest mobile franchise repair. Reconcile new exact destination exceptions against the current manifest; preserve source, auth and native contact behavior. |
| 5. Performance | Latest simulated mobile LCP: **OT 2.840 s; ABA 2.344 s; Autism 2.676 s**, all CLS 0/TBT 0. OT and Autism remain above the 2.5 s target and require further measured optimisation. Speech/Guntur earlier samples passed; neither those samples nor physical functional checks establish field p75. Evidence: `deployment/automatic-enquiry-speed-20261008/summary.json`. |
| 6. Automatic records, Google and business outcomes | Owned receipt recording/reporting, automatic accepted transport and the three paid-journey events are delivered and verified at the website boundary. Actual GA4 receipt, forwarding/connected-call proof, campaign custom-goal selection and dated CRM qualification/appointment/attendance/admission remain open. |
| 7. Demand-led follow-through | **69 URLs submitted to IndexNow, HTTP 200**: submission only, not indexing, ranking, AI citation or conversions. GSC release annotation `a95ab1c4-ede4-491e-8d82-04c045d94fb2` is saved. Evidence: `deployment/indexnow-acquisition-20261008.json` and `deployment/gsc-acquisition-annotation-20261008.json`. Reuse settled GSC/Ahrefs/crawl and Ads feedback; existing growth schedulers remain stopped. |

## Account-side handoff and completion expectation

The 8 October Ads configuration read-back records:

- `enquiry_accepted`, action **7818845893**: **Submit lead form / Secondary / One**.
- Generic `form_submit`, action **7270463226**: demoted to **Secondary**; its existing **Every / INR 5,000** settings are retained. It is not the durable accepted-enquiry contract.
- Therapy Services sitelink assets **425382704296** (account) and **425280165686** (one campaign): both saved and freshly reopened with final URL `https://www.pinnacleblooms.org/centers`; copy unchanged. Their previous URLs both showed Ask in the actual editors. The account association was Pending / Under review; the second policy status was not read back. Evidence: `deployment/ads-acquisition-settings-20261008.json` and both sitelink screenshots.
- Changing the accepted-enquiry category removed the now-empty Contact (Website) goal from 65 account-default campaigns in the preview; other goals remained and the preview reported conversion/value effect None. No Primary action was added. Secondary actions can still matter in custom goals; the Ads owner must verify memberships.
- Website-call action **7270259012** was read back as Primary / One, central number, 60-second threshold, INR 5,000, with no change. Genuine Google forwarding and connection evidence remain open. Call asset **131059946262** still requires the Ads owner to reconcile legacy conversion **179** against intended action **7270447428** before any mapping change.

These are configuration states, not new leads or proof of Google delivery. The Ads owner retains actual GA4 receipt verification, current campaign/custom-goal selection and genuine Google forwarding-call evidence. Operations supplies dated authoritative outcome records. The website owner retains release verification and any supported destination/performance repair.

Report arrivals, phone/WhatsApp taps, accepted receipts, connected calls, qualified enquiries, booked assessments, attendance and admissions separately. Never aggregate taps, generic forms and page-derived key events into lead totals. Unknown source or unmatched outcomes remain explicitly unknown.

## Traffic quality and relevant impression coverage

The bounded completion contract is in `ACQUISITION-TRAFFIC-QUALITY-20261008.md`. Current website events establish tagged navigation and contact intent. They cannot observe missed auctions or prove a charged click. The current CHEQ callback counts responses but does not retain verdict arguments or produce an owned fraud/Ads-feedback record. Short or repeated visits are diagnostic observations, not proof of fraud, phishing or malicious intent. Actual Ads invalid-click/credit records, documented vendor decisions, Cloudflare configuration/log evidence and protected operational outcomes are required for that loop.
