# Same-journey GA4 and existing receiver repair

## Scope

Keep the current Speech finder, portal assets/routes, PF12 and Ads settings.
The shared main-site stream must keep its browser/session identity from an
ordinary public flagship page to Enrolment. An untagged destination must not
explicitly clear collected campaign fields. The existing protected receipt
interface must be restored over the latest backend, without replacing its
other functions or creating an additional intake or reporting system.

## Source changes

- Use root-scoped main-portal cookies. Keep Book, Ask and knowledge-library
  scopes separate and unchanged. The separate helpline implementation is not
  edited. Retire only visible legacy cookies on the current ordinary page path;
  do not copy or merge old identifiers, or delete the root/other namespaces.
- Omit absent campaign configuration instead of sending empty overrides.
  Native GA4 owns session attribution. The existing permitted 30-day private
  enquiry-source envelope remains separate; it is not replayed into ordinary
  Google campaign configuration on returning visits.
- Preserve refusal, GPC, expiry, QA exclusions, denied-storage event boundaries,
  contact actions, existing accepted-receipt checks and receipt deduplication.
  No new event, property, stream, conversion action or advertising upload.

## Existing receiver restoration

The current `pbn-planetscale` version is
`0995596d-5cde-4420-a5da-74c11cd0b4e5`; its captured `index.js` SHA256 is
`a88d9ddf316467990fc17e5aedeb3eec8fbbc5c236dcf826d25f95242725d000`.
The existing `prepareCurrentReceiverBase` helper was applied with that exact
explicit fingerprint. Its signature, write-boundary and existing-export guards
passed. It adds the existing private `WebsiteEnrolmentReceipts.receive` and
SELECT-only `.analytics` interface while retaining the current backend bytes
outside the narrowly anchored edits. Optional Slack imports/hooks stay out.
No schema migration, binding change or new database is required.

Prepared module fingerprints:

- index.js: c5a95667a7dd740f8ce12731f471ed6cdd065bfda66aad1f0f06cf678d8dbd84
- website-enrolment-receipt.mjs: 86e1e8fe4f4bdef62c33398094d0e12e27aa7c250438a0f34d29a0cca8cb308e
- website-enrolment-analytics.mjs: f390e8327096edee64a0167d434cc5ef61aa3c62997ff48bcc2c55dbf9c07747

The full private provider snapshot is deliberately excluded from source control.
Reconcile a changed live fingerprint rather than applying this patch blindly.

## Acceptance

Run the existing measurement/receipt/outcome/base contracts and the existing
full-candidate Miniflare RPC check. The explicit native-SDK fixture is
`scripts/verify-ga4-native-handoff-isolated.mjs`; it requires an accepted frozen
asset union and a private output directory. Every browser request is fulfilled
or aborted. It checks browser/session continuity, original protected source,
cookie migration and once-only acceptance transport using an isolated receipt
fixture. It creates no production record or Google event.

After source CI and scoped production release, read back exact modules,
assets, routes/settings and the current protected SELECT reader. A real paid
customer acceptance and native GA4 receipt remain an independent milestone;
neither a fixture nor a successful release proves that result.

References: [Google tag configuration](https://developers.google.com/analytics/devguides/collection/ga4/reference/config)
and [GA4 campaign processing](https://support.google.com/analytics/answer/11242841).
