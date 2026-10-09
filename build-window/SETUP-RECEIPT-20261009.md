# Mac build workspace acceptance — 9 October 2026

Base source `10425a0b86aafb5e1d7ada114cc2325e943abc5b`, matching the Windows owner's reported HEAD. Authored scope is repository-root `build-window/` only. Dependencies and Node 24.21.0 are installed locally; the npm dependency lockfile and portal input source are unchanged.

| Check | Actual result |
| --- | --- |
| Launcher syntax/status | Passed; feature branch, source and Node 24 reported |
| Existing static Astro build | Passed; original prebuild/build/postbuild executed once |
| Existing unit suite | 600 registered tests: 599 passed, 1 explicit skip, 0 failed |
| Existing TestingBot contract suite | 13 passed, 0 failed; no provider session allocated |
| Existing portal smoke and PinnacleAI layout, Chromium | 8 passed at 320, 390, 768 and 1440 CSS-pixel widths |
| Same two existing cases, emulated WebKit | 2 passed; no physical iPhone/Safari claim |

The first unit run produced three byte-parity failures after generated modules were restored to committed bytes. The launcher now runs the three original small call/bootstrap/commerce generators before unit execution so the generated test modules match the actual source bytes/line endings. The unchanged full unit suite then passed. Initial failure output and the generated diffs are retained locally. No assertion, fixture standard or production input was weakened. Generated tracked outputs are excluded from the setup handoff and restored after acceptance; a future build/unit command will regenerate them and show them in its receipt.

The skipped unit case is `narrow private receiver candidate preserves legacy response and notification payload`. This setup does not complete that operational boundary. The existing Ask dynamic build, all-page/browser coverage, cloud exact-build BVT, real devices, production authentication/API dispatch, deployment, qualified calls and enrolments were not executed here.

Local raw logs/receipts are in ignored `build-window/results/`; Playwright's current report is in `speech-site/audits/playwright-report/`. The last browser invocation writes the existing shared report location; the separate run logs/receipts preserve both executions.

The loopback preview is available at `http://127.0.0.1:4340/`, where the static build serves Speech Therapy. Source, terminal and browser panels were requested in the calling Codex task; the app returned `queued`. Browser automation rejected localhost navigation with `net::ERR_BLOCKED_BY_CLIENT`, so no visible in-app preview is claimed. Local Playwright execution independently verified the selected candidate cases. Open the loopback address directly in an ordinary browser on the Mac, or run the documented preview command after restarting the workspace.

Windows explicitly acknowledged production-release ownership, no `build-window/` overlap and the Mac reservation in its local active work order. Its unrelated 30 tracked changes and 279 untracked entries remain outside this setup. Next integration owner: Windows website task. Acceptance trigger: inspect the returned scoped commit/PR and reconcile the launcher/runbook without mixing unrelated unpublished work. No deadline was specified. Existing cloud-test capacity and schedule holds remain under that owner.
