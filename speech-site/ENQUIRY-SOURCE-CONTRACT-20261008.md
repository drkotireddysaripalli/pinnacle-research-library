# Enquiry source and accepted-receipt contract — 8 October 2026

## Purpose

Attach permitted paid-source evidence to the existing durable website enquiry
receipt. Keep contact, campaign navigation, accepted enquiries, connected calls
and actual admissions as separate records.

## Released behaviour to verify

- A supported public landing page validates recognised campaign fields and click
  identifiers. After analytics permission, the common script keeps the bounded
  record in first-party storage for up to 30 days. A direct return does not erase
  that retained source. Refusal, withdrawal or Global Privacy Control removes it.
- The form retrieves that record at submission, validates it again and sends it
  with the existing opaque request ID. Unknown, unavailable or invalid optional
  source never prevents a parent's valid enquiry.
- The public adapter and private receiving helper validate the source independently.
  Only the existing receipt table's protected `source_json` stores it. The public
  receipt returns schema version, request ID and receipt ID; private intake join
  IDs, contact details and source JSON do not return to the browser.
- An atomic first claim fixes the source attached to that request. Same-key
  retries cannot overwrite it or repeat the legacy intake. The legacy payload
  digest remains compatible with existing accepted receipts. Source changes do
  not rewrite a previously claimed receipt.
- The active form requires a matching durable receipt. Only then does it dispatch
  the minimal public receipt event. Measurement checks that receipt and records
  each request once, only with permission. Stored acceptance/reloads stay silent.
- `validation_test` marks a tab-only QA journey for at most 24 hours. Its Google
  collection and optional acquisition record remain disabled after navigation.

## Boundaries

Campaign fields are limited to `utm_id`, `utm_source`, `utm_medium`,
`utm_campaign`, `utm_term`, `utm_content`, `utm_source_platform`,
`utm_creative_format`, `utm_marketing_tactic`, `gclid`, `dclid`, `msclkid`,
`fbclid`, `gbraid` and `wbraid`. Reject duplicate URL fields, nested/encoded
values, email addresses, phone-like values, credentials and private labels.

The source carries a coarse approved public landing path, consent marker and
capture time. Centre selection remains the actual editable form preference.
No raw referring URL, arbitrary query, search, child detail, question slug,
Google profile or family note enters the acquisition record or accepted event.
The essential pending-request store continues to exclude optional attribution.

This release preserves the current opt-in policy. It neither enables advertising
personalisation nor resolves the separately requested regional-consent decision.
Bare-host Ask identity and campaign storage do not silently cross into the `www`
origin. Downstream qualification, call connection, attendance and admission need
their authoritative operational interfaces; acceptance/source proof does not
prove any of those outcomes.

## Verification and deployment

Use the targeted unit/SQL fixture tests, intercepted phone browser journey and
the existing trusted-source Portal quality/TestingBot build gate. The isolated
private MySQL verification writes only to the existing QA receipt/intake tables;
it never invokes customer intake, WhatsApp notifications or real conversions.

The release script snapshots the actual current portal and receiving Workers,
preserves the full asset union, all 260 routes, existing bindings and unrelated
Worker versions. Temporarily expose only a private named QA entrypoint, verify
its fixture, then remove it before the paired public promotion.

Completion requires a committed/pushed source revision, successful exact-build
quality run, private MySQL source/receipt read-back, public client hashes and
verified portal/receiving versions. See the dated deployment receipts; this
source contract alone is not a completed-production assertion.
