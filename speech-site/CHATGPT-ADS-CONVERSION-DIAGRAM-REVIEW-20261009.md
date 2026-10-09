# ChatGPT Ads conversion diagram: production reconciliation
Reviewed 9 October 2026, 21:12 IST. Scope: the owner's supplied diagram, maintained website code, saved production evidence, current public measurement script and current ChatGPT Ads account configuration.

## Conclusion
The website's acquisition foundation exists. The diagram adds an uncompleted OpenAI conversion connection and an unverified operational journey from received calls/enquiries through qualification to admission. Describing all conversion tracking as complete would overstate the evidence.

The existing form and receiver should be reused. A second form, receiver, lead database or parallel conversion count is unnecessary.

## Current account read
Account: Pinnacle Blooms Network of Bharath Healthcare P LIMITED.
- One connected conversion source: **Pinnacle Blooms helpline**.
- One configured conversion setting: **Accepted enquiry**, standard event **lead_created**.
- Its returned campaign associations are empty.
- Configured attribution window: 30-day click / 1-day view.
- Latest-15-minute diagnostic sample: no events returned. This is not a lifetime conversion total.
- Event Quality Score: unavailable, not zero; no dated assessment supplied.

These are configuration observations, not proof of event delivery or campaign attribution.

## Diagram reconciliation

| Step | State | Evidence and remaining condition |
|---|---|---|
| Consented campaign source and returning visits | Implemented for generic UTMs and supported existing click IDs | Shared measurement retains optional source for 30 days; direct visits do not silently erase it. OpenAI oppref is absent from the allowlist. |
| Page views and contact taps | Browser instrumentation implemented | Google-specific arrival/phone/WhatsApp events require Google paid-source detection. A ChatGPT visitor must not be relabelled as Google Ads. A tap does not establish a connected call. |
| Callback and enrolment forms | Deployed | Existing release covers 64 inline callback pages plus enrolment. Reuse these. |
| Durable acceptance | Implemented and deployed | Matching opaque request/receipt IDs, persisted pending attempt, unique database claim and payload digest. Accepted retries return the same receipt; uncertain handoffs are not automatically repeated. This is request deduplication, not family deduplication. |
| Private automatic enquiry record | Implemented | Does not depend on Google delivery or optional analytics consent. The reporting layer is a protected database projection, not a server-side advertising exporter. |
| GA4 enquiry_accepted | Browser implementation and intercepted transport tests exist | Actual reporting receipt for an attributed post-release enquiry remains unproven in inspected evidence. There is no server GA4 exporter in the inspected path. |
| OpenAI accepted-enquiry event | Account setting exists; website sender absent | No OpenAI pixel initialization, oppref transport or OpenAI lead_created dispatch in maintained acquisition source. |
| MyOperator human-answered call linked to enquiry | Unverified | Needs actual call ID and exact enquiry association; phone tap or timestamp proximity is insufficient. |
| RAM/care qualification and centre handoff | Unverified in this integration | Exact operational IDs and dated state are required. |
| Appointment, attendance, admission | Unverified in this integration | Existing outcome scaffolding retains unknown values; no complete real journey demonstrated. |

## Fresh public verification
The public shared measurement script returned HTTP 200, 42,573 bytes:
https://www.pinnacleblooms.org/pinnacle-pages-scripts/speech-measurement.js

SHA-256: 07f9110ff4399885a43db122eea699da259a10147477d07fa17a028c86565514.
This matches the dated deployed-script hash in the acquisition handoff. It contains google_ads_arrival and enquiry_accepted, but no oaiq, oppref or lead_created. The deployed bundled file is not byte-identical to the current unbundled source; no equivalence is assumed from that comparison alone.

The fresh Cloudflare settings capture exposes no OpenAI/Ads conversion credential binding in the portal or receiving Worker. No secret value was read or printed. This observation covers those bindings, not every possible external secret store.

## What the previous tests establish
Fresh GA4 standard-report read at approximately 21:15 IST on 9 October, scoped to www.pinnacleblooms.org for 8–9 October: the four new events (google_ads_arrival, google_ads_phone_click, google_ads_whatsapp_click, enquiry_accepted) returned no rows. A comparison read returned 539 page views, 15 whatsapp_click events and 7 legacy enroll events on 8 October; 787 page views on 9 October. The paid-source comparison returned 28 google / cpc sessions on 8 October; this daily figure does not distinguish activity before versus after the 20:20 IST release, and its 45 key events are not 45 qualified leads. Current-day reporting is incomplete and these are event counts, not qualified leads. The comparison establishes that the selected reporting property does contain website activity; it does not prove the cause of missing new events. Actual GA4 receipt is a concrete outstanding acceptance condition. See deployment/chatgpt-diagram-ga4-readback-20261009.json. The old enroll event must not be treated as an accepted enquiry.

Saved release evidence records 69 focused checks, 5 TestingBot BVT cases and 12 intercepted SDK transport cases. The latter deliberately sent zero live Google test events. Physical enrolment UI checks covered iPhone 13/iOS 18.5 Safari and Galaxy S24/Android 14 Chrome, 19 assertions each. Receiver/MySQL fixtures did not create customer leads.

The 8 October 19:31 IST protected read-back contained one accepted pre-release record with unknown source and no matched downstream outcome. It proves accepted intake, not ChatGPT attribution, a connected call or admission. It is not a current registration/lead total.

## Smallest completion sequence
1. Retain the existing callback, consent controls, receiver and opaque receipt identity.
2. Resolve the permitted OpenAI measurement design before enabling transmission. The diagram itself marks this branch conditional. OpenAI Conversion Terms exclude prohibited data; the linked Ad Tools Terms include health and disability data. Omitting a diagnosis field or hashing a contact does not by itself settle whether a child-therapy enquiry event is permissible.
3. Where eligible, add the documented OpenAI click reference unchanged to the protected attribution path and send the supported lead_created event only after genuine durable acceptance. Use one stable event identity for retries and any browser/server duplicate reporting. Keep private receipt identity and clinical/customer details out of analytics payloads.
4. Associate the accepted-enquiry goal with the intended campaign; verify account-side receipt and attribution separately. Do not create another source or another lead count.
5. Join authorised MyOperator and operational records by exact IDs. Preserve unmatched/unknown states. Report answered call, qualified enquiry, booked assessment, attended visit and admission separately.
6. Validate failures/retries without manufacturing a customer enquiry. Close the business loop only using an authorised real accepted record and genuine operational evidence.

OpenAI's GA4 connection is currently documented as beta connection setup with event mapping coming later; a GA4 connection alone must not be claimed to complete OpenAI conversion reporting.

## Browser diagnosis
The official bundled diagnostic commands found:
- Chrome running.
- ChatGPT extension installed and enabled in the selected Default profile.
- Native-host registration exists and matches the expected host and extension origins.

Separately, the computer-control tool twice refused to proceed because it could not confidently determine the active browser URL. It stopped before navigating to Ahrefs. This does not demonstrate an Ahrefs login failure, a website block, missing owner permission or a disabled extension.

The precise internal cause of the URL-identification failure is unresolved. Repeating clicks, bypassing the guard or claiming reinstall is necessary would not be supported by the evidence. Dedicated browser-control tools are not exposed in the current tool catalogue; account APIs and code deployment remain available.

## Sources
- Existing implementation: public/pinnacle-pages-scripts/speech-measurement.js; enrolment-source.mjs; enrolment-api.mjs; enrolment.js.
- Receiver and joins: deployment/enrolment-receipt.mjs; enrolment-analytics.mjs; enrolment-lead-resolver.mjs; enrolment-outcomes.mjs.
- Dated evidence: ACQUISITION-AUTOMATIC-EVENT-20261008.md; ACQUISITION-EXISTING-TRACE-HANDOFF-20261008.md; WEBSITE-COMPLETION-RECEIPT-20261008.md.
- OpenAI supported events: https://developers.openai.com/ads/supported-events
- OpenAI Conversions API: https://developers.openai.com/ads/conversions-api
- Conversion Terms: https://openai.com/policies/conversion-terms/
- Ad Tools Terms: https://openai.com/policies/ad-tools-terms/
- GA4 connection status: https://help.openai.com/en/articles/20001562-connect-google-analytics-4-to-openai-ads-manager

No ad setting, new tracking vendor, advertising budget or customer record was changed by this review. Before any new conversion transmission is deployed, its data handling must meet the existing privacy/consent contract and applicable provider terms.

