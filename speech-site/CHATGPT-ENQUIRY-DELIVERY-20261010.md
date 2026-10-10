# ChatGPT helpline to accepted enquiry — website delivery

Owner: existing website integration/release owner. Work order: 9 October 2026. Base: current main `2b930a238414965eb80f31f787a26810b17e7a15`.

## Delivery status — verified live, 10 October 2026

Website source commit: `b23692b13e3975167b71fb7121c032e9146e1de3`. Public/module/configuration verification completed at **01:01:13 UTC / 06:31:13 IST**. The existing website chat owns release and rollback.

- [Helpline and callback action](https://www.pinnacleblooms.org/national-autism-helpline)
- [Existing enrolment destination](https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india)
- [Exact-source Portal quality and TestingBot BVT: passed](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/38010700516)
- **116 passing local test entries, one skipped historical private-candidate fixture, zero failures; five passing isolated browser journeys.** Test-evidence commit `a748182` adds a two-tab Google fixture proving that distinct gclid/UTM/source envelopes survive concurrent durable intake even after the shared device envelope advances to the second tab. The unavailable historical fixture is not production receipt proof; current canonical receipt and concurrency tests passed separately.
- Live read-only Edge check at 390×844: helpline initialized, all eight telephone links present, callback navigation and destination form initialized, zero JavaScript exceptions. External analytics and intake requests were intercepted. This was browser emulation on Windows, not a physical phone.
- All **307 Cloudflare routes, 3,707 portal assets, existing bindings and protected Workers preserved**. Four changed public client assets uploaded. Existing private `index.js`/`HandleLead` code retained byte-for-byte.

| Worker | Live version | Rollback version |
|---|---|---|
| Private receiver | `ea776ab4-7fc0-43f9-b574-2341a15b0878` | `4933e7ee-184b-4528-b145-a977e8cf1435` |
| Portal | `30e0775d-6c42-41d9-865f-a53eadadad22` | `da5d7a3d-b0f4-47d9-badb-965791b5aacc` |
| Helpline | `32260f9d-e74f-4cd0-ad10-fd20bc9c6f27` | `28ef7505-3aca-435a-920b-3301c35a7d5e` |

One pre-upload read failed with Cloudflare authentication error 10000/HTTP 401. The existing Wrangler OAuth session refreshed successfully; no upload had happened at that failure. The resumed command reused all five passed local stages and the exact successful hosted build. Upload, promotion and verification then passed. The local runner now appends attempt-delimited logs and retains prior stage checkpoints on future retries; the initial failed upload's exception is separately recorded in the local execution incident record.

Evidence: `deployment/chatgpt-enquiry-20261010.json`, `deployment/chatgpt-enquiry-browser-20261010.json`, `deployment/chatgpt-enquiry-public-browser-20261010.json`, and private `ask-private/chatgpt-enquiry-20261010/execution/` logs/checkpoints.

## Repeatable local execution

From this `speech-site` directory, use the existing pinned runtime:

```powershell
& '../../tooling-runtimes/node-v24.21.0-win-x64/node.exe' scripts/verify-chatgpt-enquiry.mjs
```

The default verifies isolated build/contracts/browser behavior. `--release` also waits for the exact trusted CI and uses the guarded, pre-assembled release helper. A completed release must not be blindly rerun: reconcile its receipt/current live versions first. The script owns its lock, local waits, full log files and checkpoint comparison. Successful results are reused only while the recorded source, dependencies, configuration and acceptance fingerprint match. Model involvement is reserved for implementation, interpreting failures and release judgment. No model API-key gateway or growth scheduler is used.

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
