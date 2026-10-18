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

## Canonical-page protection completion prepared by the website owner

Current Speech, Enrolment and Suchitra each have one shared collector but no GTM/ClickGUARD loader. Managed pages now load the reviewed first-party external module /pinnacle-pages-scripts/protection-consumer.mjs after accepted, unexpired permission and current GPC/QA/private/public URL/referrer checks. It reuses the existing SDK on protect.pinnacleblooms.org directly, rather than adding GTM/CustomHTML/CustomJS to managed pages. This avoids another GA4 producer and does not require unsafe-eval or new inline permission. An existing collector nonce is passed to the external module and SDK when present.

The existing native Data Layer booleans pinnacle_canonical_measurement and pinnacle_protection_allowed remain for ownership and refusal handling on retained legacy GTM. The two original protection bridge objects stay event-only. The external consumer shares __pinnacleClickguardConversion with the retained callback, rechecks the live boolean guard before SDK insertion and each delayed invocation, and calls only no-argument CG.conversion() after a fixed permitted signal. Refusal/pagehide permanently cancels pending page work. An uncertain invocation is never retried. Already executed vendor code cannot be unloaded; vendor delivery and withdrawal behavior require their own evidence.

Unknown/duplicated URL fields, unsafe acquisition values, unsupported routing fields/fragments, private/question referrers and unknown external referrers fail closed for protection. Contact and ordinary permitted GA4 continue. Fixed service, speech-assessment entry and Navratri offer fields are supported. Centre query handoffs and other unknown routing values remain explicit protection coverage gaps until their existing exact register is consumed; they do not block enquiries.

The outer public response policy adds only the already approved first-party protection origin to existing script-src, script-src-elem and connect-src. It preserves none, nonce/hash directives, other hosts and private/unknown responses. No unsafe-inline/eval or wildcard is added. Strict missing/unsupported policies remain unchanged. Current captured policies allow the external first-party module; provider TLS/SDK receipt is separate.

Paired GTM gate: retain exact two legacy-path exclusions on both GA4 producer tags; add native Data Layer ownership exclusions where the canonical collector owns the page. No Custom JavaScript variable is required. The legacy Tag7 SDK loader must recheck pinnacleProtectionAllowed when that function exists before dispatch. The existing callback retains its own guard/cancellation. Both legacy activation flags remain false pending native publication clearance. Google CSP reference: https://developers.google.com/tag-platform/security/guides/csp?hl=en .

Local collector/CSP/external-consumer tests: 94 passed with mocked SDK only. Earlier focused tracking/receipt selection:126 pass/1existing private-source skip. Separate actual captured private modules passed332normalizer parity cases, four durable SQLite fixtures and eight optional-source cases,376assertions, zero external transport; private index unchanged. The complete retained Worker/source union is rechecked separately, including actual headers. PR-only CI39102512638 skipped portal checks. Superseded push39103419783 was cancelled for changed source; its completion is not reused as the new release gate. No source has been deployed or real conversion created by this preparation.

## Existing release route and protected working set

Use the existing full-union publisher, not this worktree's rebuilt `dist` as a narrowed replacement. The 18 October saved published baseline is portal `b143e154-4f61-46fb-904c-6ec21912aa19`, deployment `5cd9fe57-8543-4b85-8fa9-82280884f5a6`, with 403 routes, 3970 assets and 66 modules. Preserve the current accepted asset union, private bindings and API baseline `9748b5aa-d3ad-49bf-8657-8cb2cae0ebee`; inspect newer owner receipts before release. Unrelated regenerated narrative files were excluded. The generated call wrapper is committed for shared-source parity, not a direction to deploy a separate service.

Existing tracked command (run only with the maintained current private configuration and approved existing source event):

```
node scripts/publish-public-source.mjs --config ask-private/public-publisher-config.json --id <approved-existing-source-event>
```

The publisher explicitly requires the shared remote Actions runner when cloud mode is configured. The current Mac is authenticated to existing Wrangler, but the ignored publisher configuration, accepted private working set and full-union baseline are absent here. Do not create credentials or a replacement pipeline. Existing maintained Windows checkout: `C:/Users/Siri Palace/Documents/Codex/2026-09-15/k/work/ask-distribution-release-20261003`; saved private complete command: `ask-private/closed-centre-release-20261018/complete.ps1`. Website owner chat: `01a0ef6b-507a-7630-828f-7ac81852a39c`. Parent owns any authorized coordination and publication.

After public/private source readback, observe a real eligible consented interaction and the vendor's installation state. GTM callback publication alone does not establish ClickGUARD protection activation, GA4/Ads attribution, or a qualified outcome. No budgets, campaign settings, conversion goals or ads statuses are part of this patch.
