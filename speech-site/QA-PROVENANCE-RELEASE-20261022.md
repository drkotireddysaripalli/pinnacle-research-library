# Observed QA provenance — bounded release

## Result

Keep the fixed names `validation_test` and `qa_mode`, when observed with bounded values, through the existing Enrolment and Contact payload, private receiver and `source_json` record. The existing private analytics projection returns `client_marked_qa` or `unknown`. Neither a browser hint nor its absence proves genuine origin. No original marker value, URL, person, case identifier or clinical value is added.

Baseline: `c2a01da6057d0dd1ff37e86ad92a3900d386a4a7`.

The prior implementation recreated source from page/contract/acquisition before SQL insertion. The reporting projection also omitted QA metadata. This fixes future retained hints; it cannot recover the origin of the two 10 October ChatGPT-labelled receipts. Their genuine/QA status remains unknown. No historical backfill is authorized.

## Verification completed offline

`node --test scripts/test-enquiry-validation.mjs scripts/test-enquiry-analytics.mjs`

19 cases pass: explicit/absent/false/duplicate/malformed/oversized/unknown hints, tab navigation, expiry, unavailable storage, both form contracts, bounded private metadata, actual SQLite persistence, uncertain state, accepted replay, payload conflict and historical reporting. All network, customer and native analytics activity is absent from these tests. Existing GA4/Ads names, stream selection, consent behavior, acceptance events and business qualification are unchanged.

`node scripts/refresh-enquiry-validation.mjs` refreshes the identical observation helper inside both existing collectors. Normal build entry points also invoke it. Contact asset generation includes the added dependency. Additions to shared collectors are only this observation block; original code outside it is preserved byte for byte. This adds no native event parameter and does not create a second collector.

## Sole publisher: existing Mac Web Build

1. Rebase on current main if it advanced; retain unrelated owner work. Run the focused command above. Reuse unchanged UI, full-site, native GA4/Ads and device evidence; do not run a new production submission or paid click.
2. Regenerate existing Contact/shared asset outputs and the helpline inline script/CSP with their existing builders. Do not rebuild unrelated page content. Preserve the distinct `G-H9CLX1WJ7R` helpline and `G-2BYLRLFRDJ` destination streams.
3. Capture the CURRENT private receiver modules. Its latest verified baseline before this change is version `56eb4cd2-2d47-463e-9ae2-d90d7857d707`, index SHA `1e1eea53ecc8968dffdcf5b28a883ae413bcdbe51493166d68b304ff5c526886`. Preserve the full current combined Contact/Enrolment implementation, staff code, invoice optimization, exports, routes and bindings. **Do not replace its combined live receipt module with the standalone historical Enrolment helper.** Apply/compile these exact bounded normalization, source and projection deltas against that current module, then run contained receipt fixtures against the candidate. No DB schema change is required.
4. Publish through the existing guarded publisher, save previous versions as rollback, then read back exact module/asset hashes, the helper dependency and helpline CSP. Public GETs are sufficient for release readback; no synthetic production enquiry or new native vendor event is needed.
5. Return commit, versions, affected module hashes and the small verification packet to the website and GA4 owners. Until readback completes this is source-ready, not live-delivered.

## Deliberate boundaries

- Existing first-claim source precedence, accepted replay and conflicting-payload rejection are unchanged. A replay cannot overwrite an earlier classification.
- Hints carry `provenance: client_observed`; they are never an authenticated staff verdict.
- Missing, expired, invalid or unavailable hints remain unknown. Contact remains usable.
- QA hints are separate from acquisition labels and family fields, and are not included in GA4/Ads/ClickGuard/CHEQ payloads.
- No native OpenAI transmission, account configuration, new receiver, query, schema, scheduler, operational message or historical record mutation is included.
- The original 10 October receipt classification requires historical run evidence or an existing operational acknowledgement. The bounded saved-artifact review found no matching run.
