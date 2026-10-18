# Measurement source repair — 18 October 2026

Prepared on `codex/measurement-coverage-20261018`, based on main `5ed3506fe07607dd6703a13427e6fa84392895fd`.

## Exact change

- `speech-measurement.js` and the shared receiver normaliser accept **only the 155 verified account 2990211780 campaign IDs** as numeric `utm_id`. Other keys, unknown numeric IDs, phone numbers (including 9100181181), personal/free-text fields, QA and private-page exclusions retain their guards. The canonical receiver adapters already import this normaliser; their published bundle still needs exact-source parity verification.
- The existing collector emits only `{event: 'pinnacle_contact_intent'}` after a trusted, consented central phone/WhatsApp click, and `{event: 'pinnacle_enquiry_accepted'}` after the existing verified accepted receipt. At most one of each per document. No caller, receipt, clinical, service, campaign or URL payload is sent to this bridge. These are traffic-protection signals, not qualified leads or new Ads conversion goals.
- `window.pinnacleProtectionAllowed()` exposes a boolean only. A deferred consumer must recheck it at actual dispatch; consent expiry/refusal, GPC, QA and private context fail closed. Declining consent dispatches payload-free `document` event `pinnacle_protection_cancel`. Consumers must permanently cancel pending page work on that event or pagehide. The source contains no ClickGUARD call, new endpoint or scheduler.
- Exact-fingerprint migration is prepared only for `/assessments/stuttering-assessment` and `/certified-courses`. It retains GTM-W9ZHX459 script and noscript, removes five known explicit legacy gtags, and adds one canonical collector and existing independent preference controls. Stuttering uses coarse measurement location `/speech-aba-autism-assessments`; courses uses `/certified-courses`. Unknown fingerprints, mismatched canonical, authorization, Set-Cookie, CSP and no-transform preserve fail-closed handling.

## Mandatory paired release gate

`deployment/legacy-route-entry.mjs` deliberately ships `reviewedPublicTemplates:false`. **The two template coverage defects are still held, not fixed in production.**

Before setting this flag true in the approved website release, publish exceptions on BOTH existing GTM GA4 configuration and legacy WhatsApp tags for exactly:

```
^/(assessments/stuttering-assessment|certified-courses)/?$
```

Keep the ClickGUARD All Pages loader/container and iframe. GTM version 6 callback publication does not itself provide these exceptions or source coverage. Stage the complete website candidate first, coordinate the short paired switch, and read back both production routes' `x-pinnacle-legacy-measurement: reviewed-public-template`, removed-tag count 5, collector/controls/container/canonical/contact preservation. Do not claim activation from library unit tests or the flag's existence.

## Validation

The production build completed using the existing Node 24 runtime with `CI=1 PINNACLE_RELEASE=production`; source publisher reported `ci-build` skipped. Focused suite: 130 pass / 0 failures / 1 existing private-source skip. Repository unit suite after the production build: 738 pass / 0 failures / 2 existing skips. After excluding unrelated regenerated page/narrative outputs, the narrow tracked tree gives 735 pass / 3 failures / 2 skips: unchanged baseline commerce bytes, obsolete discount marker in the unchanged enrolment snapshot, and unchanged enrolment Markdown drift. Their governing source/tests/snapshots are byte-identical to main 5ed3506; they are not silently bundled into this tracking fix. The final focused tracking suite still passes 130/131 with one private-source skip. Remote CI and the existing full-union publisher must regenerate accepted assets from current source. Actual full captured HTML bodies (311725 and 354756 bytes) passed offline Miniflare HTMLRewriter checks; outbound requests 0; no page JavaScript was run. Raw logs and fixture proof are in the parent acquisition evidence directory.

No website or private receiver publication occurred. Remote CI, exact private receiver candidate parity and production behavior remain release acceptance gates. No synthetic live enquiry/call/event was submitted.

## Canonical-page loader completion prepared by the website owner

Static current public source on Speech, Enrolment and Suchitra contains one collector each but no GTM/ClickGUARD loader. The collector now prepares the **existing GTM-W9ZHX459** once, only after accepted, unexpired permission and the current GPC/QA/private/public URL/referrer guards. It sets only the native Data Layer booleans `pinnacle_canonical_measurement=true` and `pinnacle_protection_allowed=true/false` before `gtm.start`. The two protection bridge messages remain exact event-only objects. No new vendor endpoint, conversion action or receiver is created.

Unknown URL keys, duplicate fields, unsafe acquisition values, unsupported routing fields/fragments, private/question referrers and unknown external referrers fail closed for protection. Contact and ordinary permitted GA4 continue. The currently supported form selectors are the fixed service, speech-assessment entry and Navratri offer values; `centre` query handoffs are intentionally held until their existing exact register is consumed. These are explicit protection coverage gaps, not an enquiry failure.

The existing public script/connect CSP receives only `https://protect.pinnacleblooms.org`, the first-party host in the actually published GTM loader. Existing directives, nonce/hash policy, all other hosts and private/unknown responses are retained; no unsafe-eval, unsafe-inline or wildcard is added. Current captured representative policies already have unsafe-inline and no nonce/hash in script-src; this is static policy compatibility, not a claim of executed CustomHTML/vendor delivery. No SDK request has been executed for this preparation; additional SDK destinations remain unverified and blocked if absent from policy.

**Additional mandatory GTM gate:** block BOTH old GA4 producer tags when the boolean `pinnacle_canonical_measurement` is true, in addition to the two exact legacy path exceptions. Use a native Data Layer variable, not Custom JavaScript/unsafe-eval. The existing protection loader tag must recheck `pinnacleProtectionAllowed()` immediately before inserting its SDK on canonical-owned pages; cancelling a pending GTM script alone cannot certify every late-script race. The callback retains its own current guard and refusal/pagehide cancellation. Loader execution, callback execution and provider installation/DNS verification remain separate milestones. No legacy activation flag was changed in this preparation.

Local focused collector/CSP checks: 88 passed; combined tracking/receipt/legacy selection: 126 passed with one existing captured-private-source skip. Separate captured actual private normalizers passed 332 parity cases; four SQLite durable-intake fixtures and eight optional-source cases passed, for 376 assertions, all without external transport. The private index bytes remain unchanged. The preserved 66-module/3,970-asset Worker passed seven offline GET/HEAD source checks before this loader delta; recompose and recheck the new exact source before release. PR-only CI39102512638 ran Ask and skipped portal checks; it is not the trusted full portal release gate.

## Existing release route and protected working set

Use the existing full-union publisher, not this worktree's rebuilt `dist` as a narrowed replacement. The 18 October saved published baseline is portal `b143e154-4f61-46fb-904c-6ec21912aa19`, deployment `5cd9fe57-8543-4b85-8fa9-82280884f5a6`, with 403 routes, 3970 assets and 66 modules. Preserve the current accepted asset union, private bindings and API baseline `9748b5aa-d3ad-49bf-8657-8cb2cae0ebee`; inspect newer owner receipts before release. Unrelated regenerated narrative files were excluded. The generated call wrapper is committed for shared-source parity, not a direction to deploy a separate service.

Existing tracked command (run only with the maintained current private configuration and approved existing source event):

```
node scripts/publish-public-source.mjs --config ask-private/public-publisher-config.json --id <approved-existing-source-event>
```

The publisher explicitly requires the shared remote Actions runner when cloud mode is configured. The current Mac is authenticated to existing Wrangler, but the ignored publisher configuration, accepted private working set and full-union baseline are absent here. Do not create credentials or a replacement pipeline. Existing maintained Windows checkout: `C:/Users/Siri Palace/Documents/Codex/2026-09-15/k/work/ask-distribution-release-20261003`; saved private complete command: `ask-private/closed-centre-release-20261018/complete.ps1`. Website owner chat: `01a0ef6b-507a-7630-828f-7ac81852a39c`. Parent owns any authorized coordination and publication.

After public/private source readback, observe a real eligible consented interaction and the vendor's installation state. GTM callback publication alone does not establish ClickGUARD protection activation, GA4/Ads attribution, or a qualified outcome. No budgets, campaign settings, conversion goals or ads statuses are part of this patch.
