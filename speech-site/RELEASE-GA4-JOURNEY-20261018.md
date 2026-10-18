# TestingBot enquiry/GA4 journey — 18 October 2026

## Shared attribution defect fixed and live

TestingBot reproduced a real defect: the Speech page passed identical Google/CPC campaign fields to Enrolment, where the shared collector replaced the original landing path and capture time. PR114 preserves the existing validated envelope when the complete field set matches. Changed campaign/click fields still replace the complete source; expiry, withdrawal, refusal, GPC and source-validation guards remain.

- PR114: https://github.com/drkotireddysaripalli/pinnacle-research-library/pull/114.
- Tested source:015cfe2a82a73698f4d070792fb1ac8756a3946d; merge:d7df52ff9b06c99f7d2ecf657a40c70dc090be37. Their Git trees match exactly.
- Portal version:0e26b810-8ebc-452c-a012-1902f22fee97; deployment:c6d5276a-cdcc-47d4-ad20-4cb831b07f42.
- Public source verification:2026-10-18T08:45:44.059Z /14:15:44.059 IST.
- Collector SHA256:9fe8541a61be52fc46d4f607475b44fea1def6a4afab9e755ea3b626b785384b.
- One shared asset changed;3971 other assets and all67 serving modules are unchanged. All403 route mappings,3972 total assets, settings/bindings and the other nine protected serving Workers are preserved. Private receiver remains e3cd08a4-de59-4bba-b722-ddc59d15b142; legacy owner remains c3bed3fb-127d-4756-8d95-387417af3168. GTM8/account configuration is unchanged.

The existing protected publisher checkpoint was advanced and read back at08:47:46.347 UTC. Archive:de6cc2921d9d46c81b756218beb25daff4e081dae3b72259d520f02f8d9f88af. Existing outbox, native job and rotation state remain; no new source/database/inventory query.

## Verified execution

| Layer | Result | Exact boundary |
|---|---|---|
| Shared measurement unit contract |90/90 pass| Includes same-tag retention, field-order changes, changed campaign/click replacement, expiry, refusal and GPC |
| Focused cloud journeys |6/6cases,64 assertions pass| Chrome155/Windows11 at390×844CSS; Google and ChatGPT accepted fixtures, rejection, uncertainty, refusal and GPC; source, durable isolated receipt, retry/reload and no private identifiers in event fields |
| Exact-source trusted CI |39112112382success| Includes actual TestingBot5/5build BVT; provider53920374,105 seconds |
| Live source handoff |Pass| Actual production Speech→Enrolment preserves the original source/capture time; withdrawal stops captured dispatch |
| Public script readback |3/3 pass| Stable collector and two existing query variants match released bytes |

The six browser acceptance cases used the actual captured private receipt module (SHA2563cf42837ad4b22283c8901ba725e67391844cc185492c4e99cccdc78d13d28f7) with a local SQLite fixture and intercepted API. They did not write to the production database, send a notification or create a customer. Matching acceptance emits once locally; rejection/uncertainty/refusal/GPC do not claim an accepted analytics event. Native calling was intercepted and no call was placed. This is desktop Chrome at a phone-sized viewport, not a physical phone or field-CWV result.

## Actual GA4 receipt observed; narrow containment test not clean

The GA4 owner independently observed a page_view in property361649365 with campaign qa_measurement_20261018_testingbot, measurement_modeqa and debug_mode1. Its displayed time was14:17:57 IST, page_groupenrolment and page_location the Enrolment URL with the fixed Google/CPC QA tuple. A user_engagement event at14:17:53 appeared in the same displayed timeline; its QA parameters were not inspected, so its association is unresolved.

The browser's later allowed native SDK page-view request received Google HTTP204 at08:49:07.707 UTC /14:19:07.707 IST. The observer did not establish a distinct later Speech receipt. SDK event time and transport time can differ; there is no safe basis to claim which request produced the observed earlier event. Common-query versus line-level page_location/page_group fields were not retained in that wire proof. The first attempt's zero-external-hit statement is retracted: it described intercepted requests and did not establish containment during SDK/unload behavior.

Status: **GA4 QA receipt observed; Speech-only containment NOT a clean pass.** This is separate from the verified shared source repair. No genuine accepted-enquiry, Ads import, connected call, receiving acknowledgement, qualification or admission is certified by this check. No production form was filled or submitted in either live observation; accepted/contact/purchase event commands were blocked before the SDK. Actual derived vendor/import outcomes are not inferred from that block alone.

All owned sessions are closed. Further production QA transport is explicitly suspended before a new provider session can start. The test-only wrapper now rejects Enrolment page views before SDK queuing and adds a one-shot fetch/beacon guard covering mixed batches and late flushes;15 offline tests pass. This correction has no new production-transport/containment pass and is not installed in the public website. The GA4 owner added the new campaign to its existing offline business-report exclusion registry;5/5registry tests pass. This is not a native GA4, Looker or Ads filter and does not certify unmarked traffic as genuine. No Admin filter/goal/Ads setting was changed here.

## Evidence and repeatable local execution

Exact private evidence:ask-private/testingbot-ga4-journey-20261018. Preserve candidate-report.json, live-report.json, both earlier attempt reports, release.json, ci.json, ci-provider-observation.json, main-ci-reuse.json, execution.json and state/upload.json. The failed/unclean attempts are not overwritten as passes.

Independent GA4 screenshots are in the GA4 owner's existing outputs/testingbot-ga4-pageview-20261018-084730 directory: campaign, mode, group, location and paused observer. The website owner visually checked the page-group screenshot. No customer identifiers or raw receipt/lead references are published in this document.

Use `node ask-private/testingbot-ga4-journey-20261018/verify.mjs` for a read-only saved-evidence verification. `run.mjs --candidate` is the isolated browser command when an actual changed input warrants another run. `--live-only` is fail-closed while the QA transport hold remains. The guarded release and checkpoint were executed by complete-release.mjs, reusing current project helpers and unchanged source artifacts. No scheduler or API-key model gateway was created.
