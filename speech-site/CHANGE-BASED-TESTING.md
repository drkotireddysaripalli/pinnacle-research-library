# Change-based acceptance

Use `node scripts/change-test-plan.mjs --base <accepted-source> --head HEAD --run` from `speech-site`. `--full` forces the existing broad gates. Plans, full logs, passed input fingerprints and reuse lineage are saved in `audits/change-testing/`.

This command runs only its declared focused suites. Exit 2 means the plan requires the existing Ask/full-portal pipeline; it is not a test failure or a completed release. An unavailable/invalid comparison selects full coverage. Unknown code, shared shell, dependency and unregistered workflow changes retain the full pipeline. No production account or page is changed by this command.

| Change | Necessary acceptance | Reuse |
|---|---|---|
| GTM configuration alone; no website-source change | Exact container/version/tag/trigger readback; affected runtime path/dispatch check | Existing website build and unchanged journey evidence |
| Narrow response-only CSP condition | Policy cases; actual affected Worker GET/HEAD/header composition; deployed source/version readback | Astro/Ask output, unchanged scripts and visual/device evidence |
| CSP nonces, hashes, directives or execution changes | Browser behavior plus existing full gates | Only independently unchanged evidence |
| Browser measurement / consent / enquiry | Fixed-source events, refusal/withdrawal/GPC, source retention, actual durable success, rejection/unknown and once-only behavior; affected browser journeys | Unchanged markup/layout only when artifact hashes prove it |
| Receiver / validation | Private module parity, durable claim/retry/conflict/unknown/acceptance; browser when contract changes | Unchanged API entry and validated inputs |
| Legacy activation | Actual serving owner for each exact route; preserved GTM and phone/form behavior; one collector and removed-tag counts | Unchanged portal assets and page layouts |
| Page/layout/CSS/assets/shared routes or dependencies | Current existing build, page contract, affected mobile/desktop/engine checks and trusted BVT | Results only when tested inputs and acceptance remain identical |
| Ask-owned source only | Ask auth/content tests and build; existing trusted BVT gate retained | No automatic BVT waiver |
| Documents/test-selector only | Selector tests where changed; source review | Production build/browser/provider tests |

## Registered component gates

`change-test-profiles.mjs` is an explicit registry. Known receiver and managed discovery-route policy changes run their receiving/route suites (including the actual managed-route ownership/ambiguity contracts) without rebuilding unchanged Astro or Ask output. Receiver and Contact changes retain the isolated form browser contract, durable receipt/idempotency/conflict/retry tests, held-centre checks and private module parity as release acceptance. A Contact presentation change also requires the fully styled document at 320, 390 and 1440 pixels; the compact functional fixture alone cannot pass layout.

Known page-local and browser-measurement changes use one Astro build, affected static/unit contracts and affected browser journeys across all six existing projects: 320/390 phone, 768 tablet, 1440 desktop, Firefox and WebKit. Measurement changes retain consent, source, receipt, protection and relevant commerce-attribution regression checks. Every fresh trusted Astro build still runs the existing five-case TestingBot BVT. Unchanged unrelated page families and Ask builds are omitted. Mixed known components union their checks; any unknown input or deletion restores full coverage.

Run `npm run check:page -- <page-id> --plan audits/change-testing/plan.json` for a component plan. The workflow executes the plan and retains its logs. Focused runtime CI does not replace actual serving-owner/module, route/binding, deployment and public-readback acceptance. It cannot claim a production enquiry or a physical-device pass.

## PR107 actual change and evidence

PR107 changed measurement/source compatibility, protection dispatch, receiver normalization and two reviewed legacy templates. The subsequent activation and CSP correction did not change page layouts. Reused trusted CI39103977043 and its 5/5 desktop BVT cases/82assertions by component-byte proof; reused 376 private assertions. Executed 11 legacy unit cases, 28 root-template assertions, 14 actual legacy-owner assertions, four CSP unit cases and three full-Worker public no-store cases. Public verification covered three exact changed assets and five documents. The certified-courses serving owner was a separate legacy Worker; a root-only fixture was insufficient to prove its publication.

## Reuse rules

A focused pass is reused only when its source/imported inputs, test code, package/toolchain files, Node/runtime/platform, relevant configuration, command and acceptance scope match, and its successful receipt, complete log and output artifacts still match their hashes. Receiver reuse also checks Python/SQLite versions. Component browser receipts include a ten-minute freshness window; built-page unit reuse includes the generated build hash. A stage that changes its tracked inputs is not reusable. Failures and missing evidence rerun. Reused results retain the original tested source. Browser/device, private receipt, deployed version and genuine business evidence remain separate. The source/diff planner never authorizes deployment or fabricates a live enquiry/call.

Daily regression stays separate from the blocking change gate. Unrelated page owners do not wait for a fresh full-site audit or unchanged provider suite for a response-only policy release.
