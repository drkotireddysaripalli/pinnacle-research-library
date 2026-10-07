# Accepted-enquiry durable receipt candidate — 7 October 2026

Status: implemented and verified in isolated fixtures; receiving production activation remains pending. Default website behavior preserves the current legacy intake. This candidate does not establish qualified enquiries, connected calls, appointments, attendance or admissions.

## Implemented boundary

`deployment/enrolment-receipt.mjs` defines the private versioned receiver contract. A request key has one atomic claim in `website_enrolment_receipts`. The canonical digest includes all fields actually passed to `HandleLead`; object property order cannot create a different request. Reusing a key with different data returns 409 before another handoff. Reusing an accepted key returns the original receipt.

The permitted source evidence is only the fixed canonical page and `website_enrolment_v1` contract. Request attribution is asserted through the private website service binding. No contact fields, family notes, child data, advertising identifiers or raw query/referrer values are stored in the ledger. Actual intake references remain private. The ledger does not forward its key, source object or receipt to existing WhatsApp notification payloads.

| Durable state | Meaning | Same-key later attempt |
| --- | --- | --- |
| `claimed` | Key atomically reserved; a previous process may have stopped | Hold for reconciliation |
| `handoff_started` | Lead-write boundary may have been crossed | Hold for reconciliation |
| `uncertain` | Write or acknowledgement could not be confirmed | Hold for reconciliation |
| `accepted` | Actual write reference and receipt durably recorded, then read back | Return the same receipt; never repeat intake |

An ambiguous timeout, failed receipt commit or process interruption never causes an automatic repost. There is no lease expiry that assumes an earlier lead was unwritten. If an accepted commit succeeded but its acknowledgement was lost, a protected same-key reconciliation can return that committed receipt. No scheduler or reconciliation action is introduced by this patch.

## Exact receiving source and join reference

The preserved private source is `ask-private/acquisition-receiver-20261007/index.js`, SHA-256 `96d69dee450a771b6bc546bffdc63dd5804e3667d95c9147ea3e48a823ab5380`. `scripts/prepare-enrolment-receiver.mjs` refuses a different source hash and prepares a separate private candidate directory. The source bundle is not copied into the public repository.

The existing `HandleLead` returns a USER object. Its `Id` must not be called the new intake-history record ID. The patch adds one optional capture argument and records the actual `DataCreateOrUpdate` write/read-back result: `lead_v1:<Id>` for lead history, or `peoplenote_v1:<Id>` for the existing GENERALREACH branch. Existing callers and returned objects remain compatible. Existing notification behavior remains in place.

The new `WebsiteEnrolmentReceipts` named Worker RPC entrypoint calls that same intake code. A named service binding provides a private route without a publicly accessible URL; this follows the [Cloudflare RPC entrypoint contract](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/rpc/). Public `/api/gl/swfs` requests with `WebsiteReceipt` are rejected. All existing legacy form types and the Enroll `true` response stay intact.

## Website and browser behavior

With `ENROLMENT_RECEIPT_VERSION` absent, the adapter uses the existing `PINNACLE_LEGACY` binding and accepts its exact HTTP-success `true`, labelled `contractVersion: 0`. This transitional response preserves the existing intake; it is not a durable receiver receipt. The existing event cannot be described as a deduplicated receiving-system enquiry while this mode is active.

With `ENROLMENT_RECEIPT_VERSION="1"`, the adapter requires `PINNACLE_ENROLMENT_RECEIPTS.receive`. There is no public-fetch or legacy fallback. It returns acceptance only with the matching durably accepted receiver receipt and confirmed private write reference. It removes the protected table-qualified reference before returning `/api/enrolment` JSON. The public envelope contains only `status`, contract version, request key and opaque receipt.

The browser persists only essential request metadata in local storage. Name, number, email, service/centre preference, note and attribution are never persisted there. Pending/unknown requests remain locked across reload; accepted requests restore their success state without reposting or re-emitting acceptance. A double tap cannot submit again; modern browsers with Web Locks also serialize submissions from two tabs. An explicitly chosen "Start a different enquiry" clears only an accepted browser state and reloads the form. Unknown states require confirmation by phone.

Analytics consent or absent attribution does not affect an otherwise valid request. The acceptance event contains no private identifiers or form fields; the existing measurement listener applies consent and Global Privacy Control before sending GA4. The browser dispatches acceptance once on a newly confirmed response; restoring a stored receipt does not dispatch it. If essential browser persistence is unavailable, the form directs the visitor to the helpline because reload suppression cannot be guaranteed on that device.

## Minimum reviewed activation dependency

1. Review and apply `deployment/website-enrolment-receipts.sql` to the receiver's **existing** private MySQL database through its established migration route. No new database or vendor is proposed. Confirm only the new table's schema/index metadata and the existing connection's access; this task performed no customer queries or production schema changes.
2. Review and publish the two-module private receiver candidate while preserving every existing receiver setting, binding, public route, default export and scheduled handler. Refresh the original source hash before upload; a changed live source must be reconciled rather than overwritten. The candidate manifest is `ask-private/acquisition-receiver-candidate-20261007/candidate.json`.
3. Add this separate service binding to the website Worker while retaining all current bindings: `{"type":"service","name":"PINNACLE_ENROLMENT_RECEIPTS","service":"pbn-planetscale","entrypoint":"WebsiteEnrolmentReceipts"}`. Keep the existing `PINNACLE_LEGACY` binding untouched. No new public route or secret is needed. Preserve the receiver's existing compatibility settings and ensure the named RPC entrypoint is supported.
4. Run labelled isolated QA against the actual MySQL staging/migration environment and private binding, with existing sales/notification handlers replaced by isolated fixtures. Do not use production family records, real calls or paid self-clicks. The local SQLite fixture proves restart persistence and atomic state behavior; it is not a production MySQL or Cloudflare RPC deployment test.
5. Only after those conditions pass, set website `ENROLMENT_RECEIPT_VERSION="1"` and release/read back the adapter and client assets together. Without the new binding, receipt mode fails before intake; the default legacy mode can be released with independent centre work.

Retention is an explicit remaining policy decision. No automatic purge is installed. Uncertain records require reconciliation, and an approved purge of source/write references must preserve request-key/digest terminal tombstones so an old request cannot be silently recreated. Keep these protected records within the existing database access boundary.

The ledger provides an exact intake reference for a protected outcome export. The existing operations owner must still establish that export and the actual qualification, appointment, attendance and admission joins. Shared phone numbers or timestamp proximity cannot close that remaining condition.

## Verification recorded

The unit/fixture suite covers matching key/source/version, canonical payload consistency, ten concurrent claim attempts with one handoff, same-key success/reuse, conflicting payload, failed/empty handoff, missing storage, failed/lost receipt acknowledgements, an abandoned claim and actual new child-process persistence across restart. It also checks the guarded private receiver patch, unchanged legacy acceptance, private RPC timeout, and removal of protected IDs from public JSON and browser storage.

The intercepted browser suite on phone 390 and desktop 1440 verifies supported preferences, local validation, accepted/rejected/unknown responses, accepted and uncertain reloads, event suppression, deliberate different enquiry, double tap and a second tab. It exercises the current client source against isolated built-page fixtures. The owner must run the final production build and release checks; no physical-device, live MySQL, live RPC, real-family or business outcome is inferred from these tests.

Commands: `node --test scripts/test-enrolment.mjs scripts/test-enrolment-receipt.mjs`; `npx playwright test tests/browser/enrolment.spec.mjs --project=phone-390 --project=desktop-1440`; `node --check ask-private/acquisition-receiver-candidate-20261007/index.js`.
