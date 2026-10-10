# ChatGPT helpline to accepted enquiry — website delivery

Owner: existing website integration/release owner. Work order: 9 October 2026. Base: current main `2b930a238414965eb80f31f787a26810b17e7a15`.

## Implemented scope

- One secondary **Request a callback** link from `/national-autism-helpline` to the existing `/enroll-autism-speech-aba-therapies-india`. Eight central phone links and native calling remain unchanged. No assumed centre or treatment.
- Existing `pinnacle-enquiry-source-v1` envelope accepts the exact coarse helpline route and only the two approved ChatGPT/paid campaign tuples. Capture time and original path survive untagged navigation and private acceptance; source fields remain separate from family fields.
- Helpline permission renewed as **v4**, with explicit 30-day device retention and protected enquiry handoff disclosure. v3 does not grant this purpose. Destination keeps its own consent. Both permissions, GPC, withdrawal and expiry are rechecked before optional source use. No attribution never invalidates an otherwise valid enquiry.
- Receipt-triggered `enquiry_accepted` uses the submitted source snapshot; another tab or a weaker GBP URL cannot relabel it. No IDs, family details or free text enter GA. Unset main-site choice retains the existing minimal denied-storage behavior; refusal/GPC suppress it. This change does not broaden denied-storage measurement.
- Existing request key, receipt, conflict handling, durable private lead reference and `HandleLead` path retained. No duplicate receiver, database, CRM, notification channel or analytics property.
- Helpline build normalises inline-script line endings before its CSP hash, ensuring the generated policy works from Windows and Linux builds.
- No OpenAI transmission, matching, campaign association, Google goals or account settings changed.

## Verification and release evidence

The machine-readable release record is `deployment/chatgpt-enquiry-20261010.json`; browser fixture results are `deployment/chatgpt-enquiry-browser-20261010.json`. Treat only the recorded phase as delivered. Deployment requires exact-commit Portal quality and its TestingBot BVT, then public module/CSP/callback readback.

Isolated fixtures cover both campaign tuples, separate consent choices, v3, refusal, withdrawal, expiry, GPC, malformed/duplicate/unapproved fields, source precedence, optional storage failure, ten concurrent submissions, receipt reuse, conflicts and missing/unknown outcomes. SQLite fixture records and intercepted browser transport are test evidence, not production ingestion.

Browser fixture: Edge on Windows, 390×844 and 1440×1000 viewports. Five paths: both campaign successes, explicit refusal, uncertain response, rejection. All external requests intercepted; no calls, OTPs, production enquiries or GA hits. Physical devices, actual GA reporting, field performance and real operational acknowledgements are separate evidence.

Essential request-idempotency storage failure retains the existing phone fallback and does not submit. Optional acquisition storage failure permits a valid enquiry with source unknown. These are distinct failure cases.

## Operational acceptance still requiring genuine activity

| Item | Status | Owner and next checkpoint |
|---|---|---|
| Actual accepted enquiry/source/private reference | Not tested with a live customer | Website owner: inspect the next genuine consented ChatGPT callback through the existing protected receipt/lead projection; do not manufacture a lead. |
| Receiving-owner acknowledgement and next action | Not yet evidenced for this journey | Gokul coordinates, RAM uses existing report conversations. Check the first genuine accepted record; founder remains accountable. |
| Corresponding permitted GA event/report | Not tested by website fixtures | Ads owner: verify the next genuine event in existing property 361649365 / main stream G-2BYLRLFRDJ. Existing dimensions are configuration, not receipt proof. |
| Real call to MyOperator/CRM/qualification/admission | Open with operational owner | Provider/CRM owner: supported call-ID bridge, or source unknown/self-reported. A static telephone link supplies no MyOperator UID. |
| Native OpenAI conversion transmission/association | Intentionally outside this release | Ads owner: establish permitted design before the separate phase. |

No synthetic output establishes a paid call, qualified lead, visit or admission. Production rollback uses the three exact prior versions recorded before upload; retain all 307 routes, full 3,707-asset union and existing bindings.
