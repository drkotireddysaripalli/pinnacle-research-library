# Pinnacle Mac and Windows build workspace

9 October 2026. Same canonical repository, separate working branches, one production release owner. The owner requested this additional Mac build workspace and explicitly authorized coordination with the existing Windows task.

Canonical source: https://github.com/drkotireddysaripalli/pinnacle-research-library, `main`.
Initial Mac base: `10425a0b86aafb5e1d7ada114cc2325e943abc5b`.
Mac setup branch: `codex/mac-build-window-20261009`.
Windows task: **Build Pinnacle verification page (3)**, `01a0ef6b-507a-7630-828f-7ac81852a39c`, host `DESKTOP-92AD1ES`.

## Working together

| Team | Owns | Completion condition |
| --- | --- | --- |
| Mac, this build task | Development environment, bounded assigned implementation/test branches, local preview and evidence | Reviewed commit/PR, exact scope, test receipt and dependencies handed to Windows |
| Windows, existing website task | Canonical integration, active work order, cloud/device test coordination and production release | Integrated source, required candidate CI/device checks, preserved full route/asset union and verified public release |

The existing [portal ownership](../PORTAL-OWNERSHIP.md), [page instructions](../speech-site/AGENTS.md) and [active work order](../speech-site/ACTIVE-PAGE-WORK-ORDER.md) remain authoritative. This launcher does not change production ownership. Mac product work begins with an agreed bounded assignment, affected files, base revision and completion checks. Shared-component edits need an explicit cross-team reservation. Each implementation team keeps its own checkout and branch; GitHub carries committed handoffs. Files and local uncommitted edits do not synchronize between machines.

Before a new assignment, fetch main, inspect the changes and reconcile the feature branch. Never reset another team's worktree or push the Mac branch to main. A handoff records the commit, affected paths, local test receipt/screenshots, cloud/device status, remaining dependencies and rollback implications. Windows integrates/reviews that commit and owns release acceptance.

## Commands

Run from the repository root, on a feature branch:

```sh
node build-window/workspace.mjs doctor
node build-window/workspace.mjs install
node build-window/workspace.mjs build
node build-window/workspace.mjs unit
node build-window/workspace.mjs contracts
node build-window/workspace.mjs browser
node build-window/workspace.mjs browser-webkit
node build-window/workspace.mjs preview
```

The extended verification commands are:

```sh
node build-window/workspace.mjs types
node build-window/workspace.mjs ask-auth
node build-window/workspace.mjs ask-content
node build-window/workspace.mjs ask-build
node build-window/workspace.mjs evidence-contract
node build-window/workspace.mjs browser-all enrolment
node build-window/workspace.mjs browser-firefox enrolment
node build-window/workspace.mjs browser-webkit-all enrolment
node build-window/workspace.mjs browser-shop shop
node build-window/workspace.mjs speed enrolment
node build-window/workspace.mjs frog-local
node build-window/workspace.mjs seo
```

The full browser profiles run every registered local case; page-specific skips are real omissions. `browser-shop shop` covers the separate Shop and Hindi/Telugu cohort. `browser-enrolment enrolment` isolates the response/receipt/reload regression. The installed Chromium, Firefox and WebKit are local engines, with emulated sizes. Edge requires an actual installed browser. `speed` enforces existing Lighthouse budgets on the local candidate; retain live measurements separately because the original quality server's uncompressed transport differs. `frog-local` calls the native vendor CLI for exactly three loopback URLs and six basic CSV exports, after the application first-run agreement is completed. It neither uses connected vendor APIs nor crawls the public estate.

`seo` generates an offline interactive `results/dashboard.html` and JSON from local test/search receipts, completed committed Frog exports and the private handover's aggregate evidence. It makes no API call and starts no scheduler. Missing local evidence is shown as missing. Keep search/account/queue data and copied private files under ignored results; publish only the code and scoped sanitized verification receipt.

Each browser run retains a separate timestamped HTML report, traces and screenshots under `results/browser-evidence/`. Its receipt records actual command arguments, source, build fingerprint and browser-test fingerprint. Browser-test-only edits can reuse the unchanged candidate; served scripts, evidence and unexpected generated changes still invalidate it. A test edit during execution invalidates that run.

Parallel teams use distinct loopback ports by setting `PINNACLE_PREVIEW_PORT` for both preview and browser commands. Start that checkout's preview first for a custom port. See the [actual team roster](TEAM-ROSTER-20261009.md), [verification receipt](VERIFICATION-20261009.md) and [tool handover](SEO-HANDOVER-20261009.md).

`doctor` reports the branch, source SHA, runtime and installed scripts. `install` uses the existing npm lockfile. `build`, `unit`, `contracts` and `ask-build` call the original portal scripts. Before unit execution, the launcher refreshes the three existing call/bootstrap/commerce script modules used by byte-parity tests, so fixtures match this checkout's source and line endings. Generated tracked changes are shown in the receipt and must be reviewed separately from authored changes. The two browser commands reuse the existing public-page and PinnacleAI layout tests: four Chromium viewport profiles and one emulated WebKit profile. They establish those selected cases only. Broader changed-page acceptance uses the existing registered page contract and relevant tests; do not repeat an unchanged build just to launch the same browser cases.

The preview serves the built static candidate at **http://127.0.0.1:4340**. Its root `/` is the Speech Therapy candidate; the production homepage has a separate legacy handler. Other entries include `/pinnacleai`, `/enroll-autism-speech-aba-therapies-india` and `/shop`. Run preview in one terminal and local tests in another; the launcher recognizes its running preview. Ctrl+C stops the owned preview. This static server cannot establish Ask Worker authentication, protected APIs, bindings, production dispatch or the complete public asset union. `ask-build` is a distinct existing dynamic build.

The existing CI uses Node 24. Use an installed Node 24 runtime or install a local ignored copy:

```sh
npm install --prefix build-window/.toolchain --no-save --package-lock=false --no-audit --no-fund node@24
```

The launcher automatically uses that copy when the shell's Node major differs. Install the actual selected browser runtimes once from `speech-site` using `npx playwright install chromium firefox webkit`. All three engines were installed and executed on this Mac. Edge requires a separately installed Edge browser; an emulated viewport is not physical-device acceptance. Other coverage remains in the existing Playwright configuration.

Receipts are under ignored `build-window/results/`; existing browser evidence is under `speech-site/audits/`. Preview/browser commands require a successful candidate receipt with matching input bytes, including uncommitted/untracked source. Only verified before/after bytes of declared generated outputs are normalized; unexpected edits still invalidate the candidate. Root tooling/docs changes permit reuse of the unchanged portal build. A receipt reports the command outcome and source SHA, with any tracked site changes visible. It is not a production release receipt. `pinnacle.code-workspace` provides optional editor tasks; the source, browser and terminal can also be opened directly in Codex.

## Existing tools and their role

| Tool/system | How this workspace uses it |
| --- | --- |
| Git/GitHub | Canonical source, separate branches, reviewed handoffs and existing CI |
| Astro, npm lockfile | Existing static and Ask builds |
| Node unit tests, Playwright, axe | Existing functional, responsive, shared-shell and accessibility checks |
| TestingBot | Existing trusted exact-build CI and Windows-coordinated physical/cloud coverage; see [test system](../speech-site/TESTINGBOT-TEST-SYSTEM.md) |
| Lighthouse | Existing page speed command when a meaningful performance change needs it |
| Cloudflare | Existing Windows-owned full-union release, protected route checks and production evidence |
| GSC, Ahrefs, Semrush, Screaming Frog | Demand and affected-family discovery/technical evidence from current authorized tools and saved records |
| Windsor/GA4/call systems/CRM | Supported outcome evidence, with unmatched/stale records visible; tests do not prove qualified calls or enrolments |
| Pitchbox | Existing outreach work only under its existing authority; build success sends nothing |

Availability of a connector in this Mac session is not verification of its account/data access. Use the appropriate current tool when an assignment needs it, retain its dated evidence, and avoid a duplicate crawl or inventory.

## Cloud cost and credentials

The existing `portal-quality.yml` has qualifying `push` triggers without a branch restriction. Source pushes can start hosted TestingBot even from feature branches; PR runs omit cloud secrets but still run local CI. Coordinate one review-boundary push and reuse its result. Root `build-window/` changes alone do not match those workflow path filters. The GitHub concurrency group serializes CI checks, not separately launched Windows/Mac cloud sessions.

Windows remains the coordinator for the existing daily job and account session capacity. This setup starts no cloud sessions or schedulers. TestingBot secrets remain in the existing encrypted repository/Windows storage. Mac's shared TestingBot client requires explicit credential environment variables if separately authorized; the old Windows-only PowerShell runner is not a Mac fallback. No credentials, private Shopify source, customer/child records or clinical free text are added here. Public-site tests never submit an enquiry or place a call.
