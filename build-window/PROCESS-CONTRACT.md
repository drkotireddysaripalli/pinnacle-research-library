# Shared Mac and Windows acceptance procedure

Both implementation teams use this repository and the same declared gates. Windows holds the current integration/production claim. Separate branches and operating systems do not imply separate product standards; uncommitted files do not synchronize.

## Development and local verification

1. Agree one bounded assignment, affected files and base SHA. Fetch main, inspect/reconcile its changes on a scoped branch, and preserve unrelated dirty work. Transport exact Git objects or immutable private blobs with hashes; never normalize private payload bytes. Regenerate the existing byte-parity fixtures through the launcher before unit execution, rather than rewriting the repository's line endings.
2. Use `build-window/.node-version` and `.npm-version`: Node24.21.0/npm11.13.0. `doctor` reports both; execution refuses mismatches. The existing ignored Node runtime is reused where present. Install missing tools on their host, then `install` runs locked `npm ci`; do not upgrade dependency versions or native apps merely to obtain parity.
3. Run `node build-window/workspace.mjs ci-local [registered-page]` once per relevant source revision. It uses the active CI page by default, the same type/build/unit/page contract, centre and TestingBot contracts, evidence tests, Ask tests/build and shared focused registry as CI. It checks the full registered Chromium cohort, Firefox/WebKit and the centre gallery/feed browser regressions against its own loopback preview. Another process on that port is a refusal, not a process to terminate.
4. `ci-focused` is the identical offline registry consumed by hosted CI. Launcher/Frog settings tests and public receiving/Slack contracts are included. The registry deliberately does not substitute for private original-source/full-runtime receiver or resource inputs. Their missing-input state remains missing, never a complete private-runtime pass.
5. Keep logs, command/source identities, before/after generated changes, per-engine reports and explicit skips. A failed stage stops the aggregate; repair the finding and repeat affected checks. A local PASS proves this selected boundary only. Local browsers use OS-specific binaries; WebKit/emulated sizes are not physical Safari or actual family/device feedback. Edge is an additional assigned channel, not part of the hosted local-engine gate.

`ci-local` starts no paid cloud session, native Frog, provider API, scheduler, deployment, real enquiry or call. Existing browser commerce tests retain their declared non-purchase boundary.

## Integration and release

Windows integrates scoped commits, then requires trusted CI and the exact-source TestingBot BVT contract. Pull-request code receives no TestingBot secrets; trusted source BVT is a separate gate. Reuse successful unchanged evidence. Required physical-device/visual review has its own actual captures and hardware/browser record.

Before deployment, read the current live module/route/asset/binding/settings union, preserve protected services/Ask/legacy fallback and the current receipt interface, declare rollback, deploy one coherent candidate and read back the changed public journeys. Historical route counts and green Astro builds do not establish the current complete union. Resource private input bundles must be supplied explicitly when their source candidate is integrated. No parallel Mac deployment while the existing Windows claim is active.

## Real lead and downstream acceptance

Reuse the existing RAM question6 for an approved internal TEST contact/reference, environment, exact audience/member and exclusion. Windows accepts ONE real versioned intake, retains its receipt and exact typed intake history, then resolves `lead_v1.TOId = people.Id`. The protected link is `https://therapeuticai.org/?l=lead-<people.Id>`; history IDs and phone matching are not substitutes.

The existing Slack owner can supervise one labelled TEST delivery through the working connector, record readback/permalink and confirm the intended member opens the matching protected record. This does not require production Slack bot setup first. Automatic routing additionally requires the server-side adapter, reviewed journal, replay/failure controls and intended routing acceptance. No clinical/contact data in Slack or public Git; TEST is excluded from acquisition/enrolment outcomes.

## Upstream and downstream coordination

Use one existing issue/owner queue. ScreamingFrog supplies dated exact-URL/profile/source evidence; Search/Page produce bounded tested source; Windows integrates/releases; Slack/operations prove receiving; GSC/GA4/Windsor/Optmyzr supply demand/journey evidence; Ahrefs/Semrush supply their actual scoped authority/audit evidence; commerce and operations prove their own outcomes. Preserve existing native-app stops, paid-tool quotas and schedule holds. A connected tool, crawl count, click or successful build does not prove qualified enquiries or business impact.

Every meaningful batch records its exact source and artifacts, PASS/FAIL/NOT RUN/NOT APPLICABLE for each assigned gate, one owner, next action and closure receipt. Both teams reaffirm this matrix against actual evidence. Percentages such as “zero gap” are not certifications; every missing assigned gate must be explicitly resolved before claiming end-to-end completion.
