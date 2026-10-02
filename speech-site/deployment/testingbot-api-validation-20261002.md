# TestingBot API integration — 2 October 2026

## Outcome

Connected the supplied account credentials and ran unattended, physical-device WebDriver sessions against the production `https://www.pinnacleblooms.org/pinnacleai` page. This is real-device interaction evidence, not emulated viewport evidence.

| Physical device | Browser / OS | Provider test ID | Result | Provider duration |
| --- | --- | --- | --- | --- |
| iPhone 13 | Safari / iOS 18.5 | 53265242 | 12 smoke assertions passed; initial distant-scroll screenshots were not visually usable | 37 seconds |
| Galaxy S24 | Chrome 147 / Android 14.0 | 53265383 | 12 smoke assertions passed after correcting runner scroll alignment; images inspected | 29 seconds |
| iPhone XR | Safari / iOS 18.7 | 53265416 | 12 smoke assertions passed; settled lifecycle and footer screenshots inspected | 38 seconds |

TestingBot's authenticated results API confirmed all three as successful, with a video and four screenshots available for each. Final account read-back: zero active physical sessions and zero active VM sessions.

## Coverage

Canonical/main heading, no horizontal page overflow, nine authority destinations/subtexts, telephone destination, mobile menu open/close, programmatic authority-rail reachability through Citations, seven stages/ten FAQ questions, FAQ disclosure, loaded lifecycle art, 36 Verify footer cards/policy link, analytics-off control and enrolment destination load. Footer controls were clicked and captured. No form was submitted and no telephone call was initiated.

## Findings resolved in the runner

- Initial Galaxy S24 test 53265311 failed because WebDriver's default scroll positioned a FAQ and footer control beneath the fixed call bar. The runner now centres a control before using a normal WebDriver click. The original failure remains in TestingBot with its explanation; it was not relabelled as a pass.
- The first iPhone run passed DOM/interaction assertions but captured blank content during distant scrolling. Instant scroll and a short paint-settle interval produced usable images in the iPhone XR run. The iPhone 13 was unavailable for the follow-up, so an explicitly selected physical iPhone XR was used.
- Read-only review tightened consent checks to include Pinnacle's `ps_ga` cookie prefix and the saved declined state, added an owned-session stop fallback, and avoided phone-only controls when testing larger viewports.

No site source, public assets, common header/footer, Worker routes or deployed version changed.

## Saved local artifacts

Git-ignored reports and screenshots:

- `audits/testingbot/2026-10-02T01-56-49-914Z/` — first iPhone and initial Android attempt.
- `audits/testingbot/2026-10-02T01-59-00-707Z/` — passing Android retest.
- `audits/testingbot/2026-10-02T02-00-11-259Z/` — passing Safari retest and usable screenshots.

Run future tests with `npm run test:devices`; see `TESTINGBOT-DEVICE-TESTING.md` for overrides and credential setup. Credentials are outside Git, with the secret encrypted by Windows DPAPI. API artifact links with access signatures are not committed.

## Practical limits

The account reported Free Trial, 3,600 seconds and one physical parallel session. It continued to report 3,600 seconds after these sessions; this is the observed API balance, not a claim of unlimited use or final billing.

This pass establishes a working unattended API path and a narrow production mobile smoke check. It is not a full tablet/desktop test, swipe-gesture test, accessibility certification, conversion test, SEO ranking or AI citation result. The existing Playwright/Lighthouse/source checks serve those separate technical purposes. No additional paid subscription was purchased.
