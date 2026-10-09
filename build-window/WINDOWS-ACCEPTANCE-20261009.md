# Windows and Mac shared procedure acceptance — 9 October 2026

Website integration owner: current Windows website chat. The owner explicitly reaffirms [PROCESS-CONTRACT.md](PROCESS-CONTRACT.md): separate scoped implementation branches, one integration/production owner, exact source evidence, preserved live route/asset/binding union, and separate physical-device, receiving and business acceptance.

**Integrated:** PR11 merged as `0f9abffd17be77a5e1b19047ea21e85079915a8f`. [Trusted corrected-source CI37920847889](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37920847889) completed successfully, including its actual TestingBot build-verification step. Both hosted jobs passed. No extra manual cloud run was started.

## Tested source and Windows setup

- Corrected source: `024b7f35db51cf8a14cef8ef00f2c20fb92d7b4d`; Git tree `24bb2c875ff24af956ca8ff86cf30661d9ec1e41`.
- Actual host: Microsoft Windows 11 Pro, 64-bit, version `10.0.26200`.
- Actual dedicated build runtime: **Node24.21.0 / npm11.13.0**. Installation and final doctor report passed. Codex's bundled Node24.19.0 was not replaced.
- Official Node Windows ZIP SHA256: `158f7685b44de51f6c0df1d153526cbcd3e1bc739a8dfc607721cef75de9e541`, checked against nodejs.org's published checksum.
- This checkout has an ignored `build-window/.toolchain/run-windows.ps1` launcher with the installed Git/npm/Python locations and an isolated Playwright browser directory. Existing working Chromium binaries are reused through local junctions. Fresh Firefox/WebKit binaries repair this checkout without deleting or replacing shared browser caches.

## Completed host gates

| Gate | Status | Actual evidence |
|---|---|---|
| Exact runtime, dependencies, doctor | PASS | Required Node/npm match; locked npm installation completed. |
| Types | PASS | 180 Astro files, zero errors. |
| Static production build | PASS | Corrected source and retained candidate fingerprint. |
| Unit suites | PASS | 606 passed, two explicit skips, zero failures. |
| Centre, TestingBot and evidence contracts | PASS | Existing selected offline contracts completed. |
| Ask authentication/content/build | PASS | Existing local tests and dynamic build completed; no real sign-in or OTP. |
| Shared focused registry | PASS | Includes guarded source, preview subprocess, receiving and Slack interface tests. Private/actual receiving acceptance is separate. |
| Chromium | PASS | 272 passed,20 skipped;320×568,390×844,768×1024,1440×900. |
| Firefox | PASS | 68 passed,5 skipped; Desktop Firefox project. |
| WebKit | PASS | 68 passed,5 skipped; iPhone13-emulated project on Windows, not physical Safari/iPhone. |
| Centre gallery / Google-feed browser regressions | PASS | 4 and6 passed on the owned loopback preview. |
| Preview shutdown | PASS | Recorded owned PID36352 stopped; listener refused connections. No unrelated process was terminated. |
| Actual source/test identity | PASS | Tool hashes and browser-test fingerprint unchanged during the accepted continuation. |

Playwright's installed engine builds: Chromium/headless1243(version153.0.8010.12), Firefox1543(version155.0), WebKit2359(version26.6). These are installed engine identifiers; WebKit does not establish Apple's physical Safari/device behavior. Local networking was unthrottled; no field speed claim is made. The selected page contract was Enrolment. Page-specific skips remain omissions, including the separate Shop/native-language page cohort.

## Failures retained, then resolved with targeted checks

1. Source review found Windows could kill only the wrapper and leave its preview child alive. `ci-local` now directly owns the server. The lifecycle helper demands child closure and listener refusal. A real subprocess test covers it.
2. The first Windows aggregate stopped at the build guard. Several existing builders rewrite their explicit generated outputs, including CRLF input; those known outputs now retain exact before/after snapshots. Later unexpected changes still fail. The therapy-reading marker missed CRLF and appended a duplicate book section; its public generated-text helper now replaces that section consistently. No private payload or repository-wide line-ending normalization was performed.
3. The next run found a test constructing CRCRLF from an already-CRLF fixture. The test now creates CRLF consistently; captured original fixture and production schema rules remain unchanged. Its21 affected checks passed.
4. The final aggregate passed11 stages and stopped because the existing Firefox installation lacked the `mozglue` assembly. Windows SideBySide event33 corroborated the launch error. A fresh isolated vendor installation resolved it. Only Firefox, WebKit and the two remaining centre stages were rerun; prior passing stages were reused after source/hash checks. The original failed aggregate receipt remains failed rather than being relabelled.

The completed15-stage coverage is recorded in ignored `results/windows-completion.json` (11 unchanged passed stages plus4 targeted continuation stages), completed `2026-10-09T11:06:34.431Z`. Receipt SHA256: `71a8be664931870c331f1bf718271a02d219b84ba438cddae2c39992614a9990`.

Raw logs, screenshots/traces and original failure receipts remain in ignored results. The corrected public speech reading output has no extra duplicated section compared with the committed approved version.

## Mac confirmation

The existing Mac coordinator reported an independently fetched matching Git tree, fresh pinned build,38/38 affected candidate/reading/schema checks and a direct owned-PID/HTTP/keep-alive/stop/exclusive-rebind check. Its2731 built files had no byte/path changes from the prior output, supporting reuse of unchanged product/browser evidence. These are the named Mac owner's returned results, not a new Windows-run physical-device test.

## Separate gates and precise next conditions

| Gate | Status / next action | Owner |
|---|---|---|
| Trusted corrected-source CI / TestingBot BVT | PASS on024b7f35, run37920847889; original5fc CI is historical only. | Windows integration |
| Production deployment for this tooling batch | Not applicable to host setup; no Worker/site deployment performed. The small generator correction will be carried by the next reviewed product release. | Windows integration |
| Private receiver/resource runtime and full live union | Not tested by this local pass. Require actual private inputs and current full-union checks at the relevant product release. | Windows integration / source owners |
| Physical devices and approved visual baselines | Not tested here. Existing device queue and actual captures remain separate; no baselines replaced. | Website QA owner |
| Field Core Web Vitals | Not tested here; existing performance work remains pending. | Website owner |
| Native connected Screaming Frog crawl | Not run. Preserve the existing manager's isolation/connection hold and evidence; no new API reservation or crawl. | Existing Frog manager |
| Real accepted TEST → person link → intended receiving member | Blocked on existing RAM question6's authorized internal TEST reference and exact audience/member. Do not invent contact records or treat unit receipts as real intake. | Windows / receiving owner |
| Qualified calls, appointments, attendance, admissions | Not established by this batch; require operational records and permitted joins. | Existing Ads/operations owners |

The Mac/Windows execution procedure is operationally accepted for the stated source and host gates. It does not certify zero gaps across the whole portal, Ahrefs100, public release, physical devices, actual lead receipt or business impact. Growth schedules remain stopped; no customer enquiry, purchase, call, OTP or native crawl was initiated.
