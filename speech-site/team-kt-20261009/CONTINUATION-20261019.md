# Mac continuation and release handoff — 19 October 2026

> **Current owner:** by the later direct founder transfer on 19 October 2026, this Mac Web Build thread owns end-to-end integration, production release, live verification and rollback. `../../PORTAL-OWNERSHIP.md` is authoritative. All Windows-only release, Mac-no-deployment and source-READY-to-Windows wording below is superseded.

## Mandate, source and release ownership

The founder authorised the existing Mac coordinator to continue building from current main, finish PR123 first, then the remaining website releases. This is the current delta to the existing team KT, not a replacement project or a second release owner.

- Repository: https://github.com/drkotireddysaripalli/pinnacle-research-library
- Starting main: `51f70f485234b996250b073d97b08020515ec416` (PR124). PR123 is now merged at `491f9e951fc33bc70d572b8d83b5d6c24cc96e54`; continue from current main, retaining the validated tree below.
- Website integration/production release owner: Windows website thread `01a0ef6b-507a-7630-828f-7ac81852a39c`.
- Mac coordinator: existing thread `01a11e24-3e7f-7802-8384-a6bd83d7a7a9`.
- Existing Mac Search thread: `01a11e66-9290-7160-a803-db161727035f`.
- Existing Mac Page thread: `01a11e66-969e-72c3-a0d6-fdbe180c4c5a`.
- Reuse those owners. At most two bounded implementation streams under the coordinator. Reserve shared files before editing; no competing production deploys.
- Mac returns source READY, exact source/test evidence and deployment inputs. Root integrates, releases and verifies public behavior. An exception requires an explicit single-owner transfer recorded before deployment.

After the founder restored Mac control, the native bridge successfully read **Mac Web Build** on host `remote-control:env_e_6a6d6d3366c0832888fee90c9230ce27`. The full work order was sent to that exact existing thread and acknowledged. Its active turn `01a15414-c9b1-7fb2-aee2-39d6ec55edd7` is reconciling the PR123 worktree/ownership. The actual Mac build and Git authentication are now verified: hostname `Drs-Mac-mini.local`, existing `.work/testingbot-tunnel-containment-20261019` worktree, Node24.21.0/npm11.13.0, Keychain-backed GitHub CLI authentication, repository ADMIN readback, successful dry-run and actual push. No token was copied into either chat.

## PR123 completed — accepted source and build receipt

- Tested head: `309e8f3995d7c89c328924bd414e6798cc6938ae`; includes starting main51f70f4, with a five-file final diff.
- Merge: `491f9e951fc33bc70d572b8d83b5d6c24cc96e54`. Root compared Git trees: tested and merged tree are both `f3c46683403db4282f49753036ebe9fc3e9883ff`.
- Trusted push [39252748534](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/39252748534) passed. Mac local evidence:33/33TestingBotcontracts and15/15retained legacy measurement tests.
- Actual build BVT:5/5cases,82namedassertions,3/3containmentprobes,64blockedHTTP/HTTPSpatterns, Chrome155.0.8059.40/WIN11. All five tested URLs were the exact localhost4340 build, not production-page executions.
- Provider53971626 terminal/closed;100providerseconds. This is usage duration, not a cost claim.
- BVT artifact12187170811 ZIP digest verified: `67ffeb313a2ca6231244e8b2bf8a2734685f949ff6c0bd2b2171013b5b44cf00`.
- Preserved coverage: Chrome/Edge must install CDP; unsupported native platforms retain the existing document/blacklist/tunnel/probe gate. No platform may proceed after failed containment.
- Obsolete pre-main run39251519694 was cancelled before its BVT began;0providerallocations.
- Remaining BVT warnings:11pxShoptext and an unthrottled Suchitra lab LCP observation. Captures await visual review; no field CWV or physical-device pass is claimed by this run.
- Two manifest-pending migrations (Materials/Interventions) remain explicit, outside the selected5. No fake customer, call, sale or analytics conversion was created. This merges testing infrastructure; the public website runtime was unchanged.
- Root evidence: `speech-site/ask-private/mac-handoff-20261019/pr123-ci-accepted.json`, `pr123-merge-proof.json`, downloaded full CI job logs and `pr123-final-bvt/`. Mac protected auth/build logs remain in its matching private directory.
- Root remains production release owner. Next: obtain the exact current narrowed measurement candidate/status from the existing Mac/Ads owners, then finish compatible website batches below. The frozen8c6a1a0 candidate remains excluded.

## Mac setup record and continuation procedure

1. Preserve local changes; inspect status. Fetch current main and use a separate feature branch/worktree. Do not reset, force push, copy the dirty Windows tree or deploy an old runtime archive.
2. Read `speech-site/team-kt-20261009/README.md`, `TEAM-CONTRACTS.md`, `ACCESS-AND-RUNBOOK.md`, `DELIVERED-AND-OPEN.md`, `EVIDENCE-HANDOVER.md`, and root `build-window/README.md` / `PROCESS-CONTRACT.md`.
3. Read `speech-site/reviews/GA4-AND-TESTINGBOT-COMPLETION-20261018.md`, `PENDING-DELIVERY-REGISTER-20261018.md`, and `TESTINGBOT-TEST-SYSTEM.md`, applying the dated corrections below.
4. Run `node build-window/workspace.mjs doctor` from repository root. Use the maintained focused recipe for changed behavior; retain full logs/checkpoints. Do not run every suite merely to show activity.
5. Reply on PR123 with actual host, checkout path, branch, main/base SHA, working-tree state, first command/log path and the next owned action. This receipt is required before root says a Mac build started.

Historical Mac setup was Node24.21/npm11.13 and licensed Screaming Frog24.3; that is dated evidence, not a fresh environment check. Windows DPAPI credentials, local runtime caches and private evidence are not portable secrets. Use existing Mac credentials and approved access routes; never paste keys into issues/chat. If access is missing, state the exact denied operation and continue independent source work.

## PR123 first — verified diagnostic delta and current ownership

Root subsequently tested the direct cloud `tb:intercept` route: same timeout; changing the relay alone is not a fix. Owned session53970384 closed after37seconds. A different standard ChromeDriver CDP route then passed on Chrome155/WIN11: POST `/session/<id>/goog/cdp/execute` with `Network.enable`, then `Network.setBlockedURLs` for HTTP/HTTPS patterns of all nativeBlockedHosts. Both commands installed before navigation. Existing exact plain-text document guard and3/3 public/GA/GTM probes passed;0productionpages, provider53970474 terminal/closed after5seconds. This is bounded diagnostic proof, not a passed build BVT.

The existing Mac coordinator now owns the five PR123 source files for the smallest CDP amendment; root retains integration/production ownership. Preserve tunnelv5 rules, session blacklist, positive/vendor probes, named assertions and closure; unsupported command routes fail closed. Update relevant contracts, push existing PR123, run one trusted exact-build gate using the one shared provider slot and return exact head/report/closure. Do not run old `tb:intercept` diagnostics unchanged.

### Original failed gate

PR123: https://github.com/drkotireddysaripalli/pinnacle-research-library/pull/123
- Head reviewed: `48b3d35db4140c2ab363ea9595f63c6070a3f65b`.
- PR-triggered run39239640982 passed.
- Trusted push39239636309 FAILED. Ask build, local browsers, contact receipt/asset/announcement checks and33 TestingBot contracts passed. The failure is the cloud BVT before any selected page opened.
- Exact artifact12181468911 reports Chrome155/WIN11, one provider session,110seconds; `tb:intercept` installation timed out with0/2 rules installed. Cases0, pageRuns0. Provider session53968500 is COMPLETE/closed, successfalse. There is no stale live provider session to kill.
- The v5 tunnel started and its fast-fail host rules were logged. This does not prove browser interception or containment worked.
- Independent read-only review found no additional static source blocker, preserved pre-navigation ordering, blacklist/assertions/closure, and no file overlap with PR124. Runtime failure still blocks acceptance.
- Scope: workflow, package script, native policy/test and suite only. Keep the existing PR/branch; coordinate root's current CI diagnosis before editing. Root owns the fix until a recorded file-ownership transfer.
- Do not rerun unchanged successful jobs blindly. Diagnose the timeout; make the smallest verified correction, run affected local contracts, then one bounded trusted cloud gate. Keep vendor probes and positive control fail-closed. No production-page tests when containment fails. Do not restart the suspended production GA4 QA transport.
- READY requires exact current source, relevant green trusted build/BVT, actual provider closure and retained raw evidence. Merge is not a production-site release, and a green PR event does not substitute for trusted cloud evidence.

## Delivered and merged — reuse these results

- PR120: maintained TestingBot tunnel/native tooling and retained isolated contact receipt evidence, source `dcc1345a5c7fbcd5b3956c71297995f8d92919a7`, merge `6e91e6132c72eb7cdf273614cc9af5e99cc154bb`; trusted push39127183657 passed7 focused suites. No production runtime change.
- PR119 live18Oct: held-centre links preserved honestly; Vanasthalipuram11 wrong links became0. Four held pages and active Suchitra verified. Root Worker `pinnacle-verify-route` version `24888e79-b583-470a-ad85-d48e8f978fbc` at that dated check. Preserve held centres.
- PR116 CSP and About alias fixes were live and verified18Oct. Do not undo them.
- PR121/122/124 are now merged into main. They decouple measurement preference logic from optional controls and safely project one known legacy preference centre, including homepage. Root must reconcile their deployment receipts against the actual serving versions before claiming live coverage or assembling a new release. Do not redeploy an old PR119 runtime over them.
- Current main still imports SpeechPage at `speech-site/src/pages/index.astro`; PR124 is preference control projection, not a new corporate homepage. Current callback component still lacks a child-age-band field.

18Oct finite TestingBot delivery:270/270 managed Chrome functional pages (265unchanged reused,5fresh),44/44 EdgeP2,34/34 native centre header comparisons,3/3Android,3/3Firefox,3/3Safari. All28 recorded provider sessions closed. These are scoped historical results, not blanket acceptance of later changes. PhysicaliOS containment remains unavailable; iPad held for same boundary; SE Appium issue retained. Four lab LCP and8CLS warning profiles remain; no field CWV pass claimed. Materials/Interventions were unpublished, excluded from270.

Windows detailed artifacts:
`speech-site/audits/testingbot-completion-20261018/`
and `speech-site/ask-private/testingbot-completion-20261018/`.
Use committed summaries first; request specific private sanitized evidence when needed, not a bulk private export.

## Pending website batches after PR123, with completion conditions

1. **Reconcile serving release state.** Read actual Worker deployments/modules/settings, compare PR121/122/124 source and exact public preference/script/CSP behavior. Preserve all routes/assets/bindings, Ask/Verify/auth and private receiver. Root publishes from accepted source union and records rollback/public proof.
2. **Accepted enquiry and receiving-team acknowledgement.** GA4 owner `01a12379-072d-7c13-a868-952b02e9386c`; Ads coordinator `01a14878-d07f-7373-a5b8-291b8e4f4008`. Property361649365; main G-2BYLRLFRDJ, helpline G-H9CLX1WJ7R remain separate. Durable acceptance, actual GA receipt, genuine/QA classification and human operational acknowledgement are distinct. Existing real17Octcase remains unclassified/unacknowledged. Do not fabricate a customer, resend/backfill events, infer lead volume from no GA rows or use a phone tap as a call.
3. **Care correction to18Oct register:** one founder-approved protected-case-link-only Slack DM was SENT ONCE and independently read back19Oct08:29:45IST to Tigulla Bhavani/Bhavani Goud. No reply at latest bounded check. The permission gate is closed; human acknowledgement remains open. No further message/follow-up is authorised by that one-send approval.
4. **Receiver preservation in original publisher.** Maintained upstream: https://github.com/Bharath-Innovation-Labs-P-LIMITED/PinnaclePlanetScale.git . Tested guard exists (20mutationtests plus actual3-module offline pass); original publishing owner must install it before upload and return commit/job plus negative-removal stop proof. This is not complete merely because the root receiver was restored. Private artifact exists in approved R2; obtain it via authorised route, do not post contents publicly.
5. **SEO shared survivors.** Reuse17Oct67527-page audit:1953errors,71305warnings,191797notices as dated counts, not fresh or additive to separate1000-pagecrawl. Four Ask title collision groups/eightcanonicalURLs need actual editorial/source dispositions; no blanket noindex/deletion or unsupported claim all duplicates share a formatter defect. Prioritise shared redirect/schema/metadata fixes only when actual examples prove scope. Sitemap owner `01a12dd3-0f9b-7ff1-9d4a-9351ac0016f2` owns sitemap work; do not duplicate it. Refresh only affected evidence after meaningful releases; submission is not indexing.
6. **Callback age band.** Small optional coarse age field with corresponding minimal accepted receiver contract; protect source/idempotency/receipt and keep family/clinical information out of analytics. Isolated success/reject/retry fixtures only; no fake production intake.
7. **Assessment and homepage.** Assessment H1 clarification already exists; remaining visual journey is assessment→goal→practice→review. Reuse existing Mac Page/Figma/PinnacleAI work for native corporate homepage, preserve approved narrative/header/footer/Anek and Verify-backed claims. Root approves/integrates one current-main candidate with mobile contact, accessibility and affected performance proof.
8. **Materials/Interventions migration.** Full HTML/assets/variants/source intake remains pending; aliases alone do not complete migration. Preserve existing URLs/content and common enquiry/Google sign-in journey without a mandatory wall.
9. **Device/performance gaps.** Carry the explicit coverage record and unchanged warnings; fix measured high-impact shared causes. Lab timings and emulated3G are not field75thpercentile evidence. Never replace failed visual baselines automatically or claim every physical device tested.
10. **Legacy retirement / centre proof / outreach.** Verify residual origin/API/auth/report/payment dependencies before any retirement. Centre photos/video/reviews/services need correct local source and held-location treatment. Relevant Pitchbox execution uses existing limited authority, actual correspondence/opt-outs; sent email is not placement. Reuse evidence, no new inventory treadmill.

## Reporting and protections

- Per batch return status → exact URLs → source revision → relevant tests/logs → serving deployment/public proof → remaining dependency/owner/next trigger.
- Reuse a pass only when relevant source, dependencies, config and acceptance remain unchanged; explain actual skips.
- No new scheduler, swarm, CRM, GA property, receiver or duplicate campaign.
- Do not change Ads/GTM/budgets/security/payments/held-centre status under a website test task.
- Keep clicks, calls, accepted enquiries, qualification, visits and admissions separate.
- Use native/direct apps first. Cloudflare account `862998def1cd610fdb86b8e5c1d6ed4d`; Wrangler OAuth is narrower, not proof of full-account rights. Diagnose the precise route before requesting reconnection.
