# Origin-only enquiry source capture

Independent source change based on `c2a01da6057d0dd1ff37e86ad92a3900d386a4a7`. Do not delay, combine with, or undo PR152.

## Behavior

On an eligible untagged landing, retain only the observed external referrer's origin in the existing `pinnacle-enquiry-source-v1` / `source.acquisition` envelope. Paths, queries, fragments and original URLs are not retained. Example: `https://chatgpt.com/c/private?x=value` becomes `https://chatgpt.com`.

- Explicit validated campaign fields take priority and retain their existing behavior.
- Any valid retained source wins over a later origin-only arrival. Navigation/direct return neither erases it nor renews its original capture time.
- The existing 30-day expiry, receiving form identity, idempotency and receipt ledger are preserved.
- Empty campaign fields are valid only with an exact validated `referrerOrigin`. Empty/invalid/unavailable/refused-by-browser referrers remain unknown. No guessed UTM, paid attribution, visitor authenticity or OpenAI credit is created.
- The private projection distinguishes `observed_referrer`, `permitted_campaign` and `unknown`. This is not a new native analytics parameter or transmission.

Origin parsing rejects credentials, non-HTTP(S), non-default ports, all IP literals including numeric aliases, unqualified names, reserved local/internal suffixes and this site's own domain/subdomains. Host casing/trailing dot is normalized. It validates syntax, not live DNS resolution; no origin is fetched. A public-looking domain's DNS target is neither queried nor asserted.

## Focused evidence

Standalone: `node --test scripts/test-enquiry-referrer.mjs scripts/test-enquiry-analytics.mjs` — 20 passed.

Composition with PR152 `c0ff993449fcf10f9e7e278bccd0eebc5c7aa665`: 34 passed, comprising both focused suites, the existing six projection cases and one combined durable-receipt case. These counts overlap and must not be added as independent coverage. Actual SQLite storage/replay/conflict and network-isolated execution of both browser collectors were used. No production enquiry, database read, native event or broad audit was run.

## Release owner and sequence

The existing Mac Web Build remains the sole publisher.

1. Release PR152 independently when its existing checks/readback are complete. This origin correction must not hold it.
2. Apply this separate change onto the then-current main. Preserve PR152's `validation` field, normalizer and collector block. If both source branches touch the same lines, keep both refresh-script imports, both dependency filenames and both independent collector blocks. In the private projection, keep both the new origin fields and PR152's `validation` / `trafficClassification`. Package scripts retain both test registrations. The composed 34-case fixture verified this resolution; do not select an entire side of a conflict.
3. Run `node scripts/refresh-enquiry-referrer.mjs` and the focused standalone command. With PR152 present, also run its validation suite and the combined durable-origin/QA check, reusing unchanged results when their fingerprints match.
4. Update the CURRENT combined private Contact/Enrolment receiver's bundled acquisition normalizer and existing analytics projection first. Preserve every current staff/invoice function, receipt export, helper and binding. Do not replace the current combined module with the older standalone Enrolment module. No schema change or historical backfill is required.
5. Then regenerate/deploy the existing public acquisition adapter, common and helpline collectors, shared asset dependency and helpline CSP through their existing builders. Do not rebuild unrelated content. Keep stream IDs `G-H9CLX1WJ7R` and `G-2BYLRLFRDJ`, native event names/parameters and all vendor configuration unchanged.
6. Verify exact module and public asset hashes, new dependency reachability, generated CSP and both fixed stream IDs using readback. Preserve current routes/assets/bindings and invoice optimization. No new customer submission or native event is needed. Record commit, versions, hashes and rollback versions.

Backward-compatible private code goes first; public assets go second. Roll back public assets before private code, so a new browser payload cannot reach an old rejecting validator.

## Not claimed

Source READY is not a deployed release. An observed host is not proof of paid attribution, genuine activity or a received native conversion. Historical 10 October enquiries remain unclassified; this change cannot recreate missing evidence. PR152's classification remains independently client-observed or unknown.
