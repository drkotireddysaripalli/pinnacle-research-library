# Existing acquisition trace and implementation handoff — 8 October 2026

This consolidates existing production records and deployed code. No production enquiry, call, test event, new export endpoint or database was created. The Ads owner has acknowledged receipt of the earlier handoff through the existing chat; the failed outbound attempt needs no retry.

## Exact deployed boundary

- Latest website runtime source: `dcaf6eeb7a91413d79b8fd0fa5f3a61ef75773db`.
- Portal version: `37f604d5-aea9-4b4a-b4b3-211072a66b22`; deployment `b06035f2-199a-40fe-9436-c23360deed3d`.
- This source adds the bounded mobile/media recovery and retains the acquisition implementation from `807ada10c541278a818fb8b3e295eda6b7dc2d84`.
- Shared measurement: https://www.pinnacleblooms.org/pinnacle-pages-scripts/speech-measurement.js . The reported source hash is `07f9110ff4399885a43db122eea699da259a10147477d07fa17a028c86565514` in the Ads owner's 21:08 IST read-back; this handoff does not claim a new network hash check.
- Receiver source: `ad95dc058cfc70cc79831316bb13ff4641852c12`; worker `pbn-planetscale`; version `9ac540df-fdba-4b3f-85cc-4858859ae416`; deployment `36c4ed79-1cfb-4772-bc1c-463733a91831`.
- Maintained evidence: `deployment/semrush-mobile-media-20261008.json`, `deployment/semrush-mobile-media-public-20261008.json`, `deployment/enquiry-analytics-receiver-20261008.json`, `deployment/automatic-enquiry-ledger-readback-20261008.json`, `measurement/GA4-EVENT-CONTRACT-20261004.md`.

## One complete inspection of an existing record

Source is the existing protected `ask-private/automatic-enquiry-20261008/live-receipt-cohort.json`, read from the production receiver on 8 October at 19:31:05 IST. The retained read-back contains one accepted record and is not a current live count. The following trace accounts for every stage, including those without a match; it is not a claim that every stage is connected.

Public evidence alias: `sha256:362562d91020613d`, derived from the opaque receipt identifier. This is only a redacted handoff reference, not a tracking identifier or an Analytics upload. Exact receipt and lead identifiers remain in protected source storage.

| Stage | Existing evidence | Status |
|---|---|---|
| Ad impression, paid click, billed cost | No association in this record | Unmatched; Ads source required |
| Campaign/source envelope | `acquisition: null`, `sourceStatus: unknown` | Unknown; do not reconstruct from timestamps |
| Browser arrival, contact tap or form event | No browser/session association in this read-back | Unmatched |
| Durable receipt created | 8 October 2026, 15:38:55.350 IST | Recorded |
| Receiver accepted state | `state: accepted`, nonempty protected `leadReference`, `event: enquiry_accepted`; last state update 15:39:01.951 IST | Recorded production intake acceptance |
| Google receipt | `googleDelivery: unknown` | Unmatched; SDK QA is separate |
| CHEQ verdict / Cloudflare action | No fields or association in this schema | Not implemented in this record |
| Connected call / received WhatsApp message | No provider reference | Unmatched |
| Qualification / appointment / attendance / admission | Each explicitly `unknown` | Unmatched; operational records required |

This production receiver record predates the 20:20 IST acquisition transport release. It proves retained intake acceptance, not a new Ads-attributed enquiry, verified customer identity, call connection, or downstream business outcome. No new synthetic customer record was created to fill the gaps. Genuine record authenticity beyond the existing receiving-system evidence is not independently assessed here.

## Receipt and source contract

The public adapter responds HTTP 202 accepted only after matching schemaVersion/requestId/opaque receipt identity and a nonempty protected lead reference. The client sees `{status, contractVersion, receipt:{schemaVersion,requestId,id}}`; the lead reference stays between private services.

The receiver stores a unique `request_key`, payload digest, opaque receipt ID, protected lead reference, state, source JSON and timestamps. `INSERT IGNORE` plus the unique request key claims the operation. An accepted retry returns the same receipt; the same key with a different payload returns conflict. An uncertain earlier handoff remains unknown rather than issuing another legacy lead write. This is request-level deduplication, not identity or family deduplication.

Permitted acquisition is `{schemaVersion:1, consent:'analytics_accepted', capturedAt, landingPath, fields}`. `landingPath` is a coarse approved public surface; fields contain only validated allowlisted campaign/click values. Unknown or unpermitted attribution does not prevent an enquiry. The current protected read projection does not expose `request_key`; it exposes the corresponding receipt and receiving reference. Do not invent a request-key export or a caller/session mapping.

## Supported private reporting path

Cloudflare service-binding RPC:

```text
service: pbn-planetscale
entrypoint: WebsiteEnrolmentReceipts
method: analytics({startMs, endMs, limit})
```

There is no public HTTP report URL. The existing local owner-controlled driver/config is `ask-private/automatic-enquiry-20261008/analytics-driver.mjs` and `analytics-driver.toml`; it was used through a loopback-only report reader. The saved JSON is an existing protected export. Starting a new network-accessible endpoint or granting a new service binding is not part of this handoff.

The schema is version 1: generatedAt, timeZone, cohort, timeBasis, countScope, counts, rowCountScope, rowCounts, rows and truncated. Cohorts span at most 31 days; returned details are limited to 1,000, with counts calculated over the whole creation cohort. A row contains receiptId, leadReference, state, createdAtMs, updatedAtMs, event, acquisition, sourceStatus and explicit unknown Google/downstream states. The time basis is receipt creation with current durable state at read time, not acceptance-event date.

Website owner supplies the authorized masked export or operates this existing private read path. Ads/operations own supported receiving-system linkage; precise identifiers are exchanged only through an authorized protected route.

## Smallest remaining shared work

| Work | Evidence needed / next action | Accountable owner |
|---|---|---|
| CHEQ verdict association | Documented callback/export fields and current account integration/retention configuration; then a permitted verdict/reason/time/decision reference and supported request association in the existing private reporting path | Website implementation; Ads owner supplies any existing vendor/configuration evidence |
| Cloudflare action association | Actual available action/rule/request reference and configuration read-back; no fabricated association or new security control | Website implementation |
| Branch contact coverage | Keep explicitly requested genuine branch alternatives; extend the existing contact model with coarse central/branch scope where needed, validate one affected directory/centre journey, preserve immediate native action | Website implementation; receiving records belong to Ads/operations |
| Google events and campaign goal selection | Genuine reporting receipt and exact active/custom goal membership; no current-evening repeated polls | Ads owner |
| Calls, qualification and admissions | Provider/CRM identifiers and supported joins; native central or branch taps alone cannot identify callers | Ads/operations |
| Reach, spend, filtered traffic and credits | Settled source evidence by confirmed location/service/intent; retain exclusions and identity holds | Ads owner |

Current CHEQ callback only counts responses and discards the arguments. No supported vendor verdict fields, protected retention/export, blocking record or automatic Ads feedback is proven. Browser-only responses are not treated as authenticated security evidence. No new event family, dashboard, database, blanket IP blocks, automatic Ads exclusion, health audience upload or scheduler is requested.

Next substantive website update: the documented vendor/configuration association is available or a bounded branch-contact change has actual source/live proof. Unmatched stages remain open; this handoff does not represent them as resolved.
