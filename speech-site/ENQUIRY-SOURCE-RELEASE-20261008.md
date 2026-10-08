# Enquiry source and accepted-receipt release — 8 October 2026

Status: **deployed and verified for the scoped source, receipt and event repair**. Owner: this Windows website chat. This is not closure of all website or Ads acceptance criteria.

## Delivered behavior

- After the existing measurement choice permits it, allowlisted campaign and click fields survive the therapy → centre → enrolment journey on the same `www.pinnacleblooms.org` origin. A direct return preserves a valid prior source for up to 30 days. Refusal, withdrawal and Global Privacy Control clear the optional source.
- The accepted request's opaque ID and sanitized source reach the protected durable receiving ledger. The original lead-content digest remains compatible. The first atomic claim fixes the source; a same-ID retry cannot overwrite it or create another intake.
- The active enrolment client requires a matching durable receipt before showing accepted success. Failed, uncertain and incompatible responses cannot generate `enquiry_accepted`. The event exposes no contact details, protected lead IDs or source JSON. Repeated completion signals and reloads do not emit another event.
- Invalid, stale or clock-skewed optional attribution is dropped without preventing a valid parent enquiry. Contact remains available when measurement is declined or unavailable.
- Explicit `validation_test` suppresses collection and optional attribution for the labelled QA journey, including after the query disappears within the same tab. All receiving tests used isolated QA tables and a non-customer intake function.

The existing analytics opt-in policy is preserved. This release does not grant default-on measurement, personalise advertising or change Ask registration rules. Bare-host Ask and the separate books journey are not silently treated as shared first-party storage.

## Live destinations and revision

- [Enrolment](https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india)
- [Speech therapy](https://www.pinnacleblooms.org/top-speech-therapy-center-india-proven-improvement-rate)
- [Suchitra centre](https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-suchitra-hyderabad-telangana-india)

Runtime source: `3b699ac26ab20d64743b56df78e1b45546b79463`.

| Component | Live version | Deployment |
|---|---|---|
| Portal `pinnacle-verify-route` | `1c0cb464-faac-4bed-9a3b-3d7d5edc617e` | `6ab35173-a23c-49dd-bebf-f12d8013e2ad` |
| Private receiver `pbn-planetscale` | `ea68cfa9-db10-4833-b510-73fa14016554` | `9e83d0bd-a137-4c0b-a197-45dbf4b890b9` |

Live module/assets read-back completed at **10:43 IST**. A read-only public browser check completed at **10:46 IST**, on a 390 × 844 viewport. It found HTTP 200, the new client, an enabled form, correct editable Speech/Suchitra preferences, no page/script errors, and no submissions, calls or Google collection.

The release preserved **260 routes**, existing bindings/settings and unrelated Worker versions. Its full asset manifest contains **3,689 files**; only **four changed client assets** were uploaded. The temporary private QA entrypoint was removed before the final receiver promotion. There was no schema migration, customer-record mutation, paid click or customer notification.

The retained local full-asset baseline is `release-enquiry-source-20261008/`, an ignored deployment artifact. All 3,689 files match the uploaded manifest exactly. Keep the prior baseline for rollback; use this newer union when preparing the next release.

## Evidence and limits

| Evidence | Result | What it establishes |
|---|---|---|
| Focused source/receipt/measurement unit tests | **78 passed, 0 failed, 0 skipped** | Source rules, receipt compatibility, retry and event semantics |
| Phone-sized and desktop browser regression | **18 passed** | Form preference, validation, intercepted response, double-tap, second-tab and reload behavior |
| Isolated browser → adapter → SQL → event scenarios | **4 passed** | Accepted/declined/unknown/QA; accepted-event counts **1/0/0/0**, no reload repost or event |
| Actual private MySQL/RPC QA checks | **9 passed** | Concurrent claim, durable source, same receipt, conflict, uncertain commit and lost acknowledgment reconciliation |
| Exact-source TestingBot build gate | **5 cases passed** | The committed Astro candidate passed the required provider BVT |
| Live read-only public browser | **Passed** | The deployed client and relevant preference controls actually load |

The isolated browser tests used Edge/Chromium at phone-sized dimensions; they are not physical-phone proof. The five-case TestingBot BVT is distinct from the separate daily coverage report. No extra daily run was started for this release.

The actual MySQL QA trace used request `qa-aa4002b0-5d4f-48e1-9064-97eb59fd8929-accepted` and durable receipt `3caccf71-5dda-466e-a59c-bf13a49cbe6d`. Its stored source was the labelled synthetic `google / cpc / ISOLATED-QA-SOURCE`, with the synthetic click fixture. These identifiers do not represent a genuine ad click or family.

Private database acceptance generated **four isolated fixture intakes, zero customer intakes and zero notifications**. Local browser scenarios separately used isolated handoffs. Actual paid self-clicks, calls and Google analytics hits were **zero**. This proves the implementation path without adding fabricated leads to production.

Evidence files:

- `deployment/enquiry-source-20261008.json` — versions, deployment, module read-back and actual private QA results.
- `deployment/enquiry-source-browser-20261008.json` — four isolated browser/source/event scenarios.
- `deployment/enquiry-source-ci-20261008.json` — exact-source workflow and five-case provider build gate.
- `deployment/enquiry-source-public-browser-20261008.json` — read-only public client verification.
- [Successful source workflow](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37730062157).

## Remaining acceptance and owners

| Remaining work | Owner / next condition |
|---|---|
| Inline service/centre callback forms and requested child age/band | This website chat; implement using the existing durable receiver |
| The newly reported legacy phone failures | This website chat; reproduce the exact routes on relevant device coverage and repair the shared cause |
| Proposed regional measurement defaults | Approved policy decision, followed by website implementation; current opt-in continues |
| GA4 page-load generated events and Ads conversion selection | Existing Ads/account owner; read back the actual rules and primary goals |
| Real source → enquiry → call/appointment/attendance/admission join | Operational and Ads owners with this website chat; use genuine supported record IDs and settled outcomes |
| Field performance, real forwarding and qualified calls | Authoritative field/call systems; no inference from unit or synthetic tests |

The Ads-chat evidence message was attempted once after completion but **was not delivered**: its host `durable` was unavailable. No repeated send was attempted while unchanged. This document is the ready handoff; website ownership and remaining implementation stay here. The requested noon checkpoint was not a committed ETA; scoped deployment and evidence were completed before noon IST.

No new indexing submission was warranted: this release changes protected source handling and client behavior, not public page content, canonicals or URLs. GSC/Ahrefs/Pitchbox growth outcomes are not implied by this release.
