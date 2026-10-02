# Unattended browser and physical-device testing

TestingBot supplies physical mobile devices and hosted Windows/macOS browsers. Node runs the checked-in smoke test directly through its HTTPS REST and W3C WebDriver APIs. No interactive browser login, model API key, local emulator, Appium server or new runtime package is required for a run. The cloud browsers render normally so screenshots/video are available; the orchestration is unattended through the API.

## Run

From `speech-site`:

```powershell
npm run test:devices
```

Defaults: production `/pinnacleai`, physical iPhone 13/iOS 18.5 and Galaxy S24/Android 14.0, sequentially. Device IDs are checked against the current available-device catalogue. Unavailable devices are reported, never silently replaced by emulators.

```powershell
$env:TESTINGBOT_URL = 'https://www.pinnacleblooms.org/top-speech-therapy-center-india-proven-improvement-rate'
$env:TESTINGBOT_DEVICE_IDS = '22,29'
npm run test:devices
```

The default checks reuse the existing portal's header, footer, telephone and enquiry contracts. PinnacleAI-specific checks run only on `/pinnacleai`. Other pages need their own content assertions before this is a full acceptance test for them.

### Desktop browsers

```powershell
npm run test:cloud-browsers
```

The pinned 2 October matrix is actual Safari 26 on macOS Tahoe and Chrome 153, Edge 153 and Firefox 155 on Windows 11. The runner checks those entries against the live catalogue before opening sessions, saves returned browser versions, and asserts browser identity and a 1440 × 900 CSS viewport. Desktop screen resolution is requested separately at 1920 × 1080. Local Playwright WebKit remains useful but does not replace actual Safari.

For a focused run after a Safari-specific change:

```powershell
$env:TESTINGBOT_BROWSERS = 'safari'
npm run test:cloud-browsers
Remove-Item Env:TESTINGBOT_BROWSERS
```

Desktop navigation is tested by real pointer hover and an outside click, matching the shared header's interaction. Physical mobile mode retains its menu-button interaction. The same assertions, credential loader, report format and cleanup serve both modes.

## Credentials

- Local Windows: the supplied account credentials are stored outside the repository in `%USERPROFILE%\.testingbot\pinnacle-credentials.clixml`. Windows DPAPI encrypts the secret for this Windows user. The script decrypts it only inside the child process and does not print it.
- CI: provide `TESTINGBOT_KEY` and `TESTINGBOT_SECRET` through the runner's secret store. Never add them to source, report artifacts or command examples.
- This uses the TestingBot service API only. It does not change ChatGPT/Codex authentication or use the OpenAI API.

## Limits and artifacts

- Runs one remote session at a time; hard session cap five minutes and idle timeout one minute.
- Takes screenshots and requests a provider recording. Provider artifacts may become available after the session ends.
- Writes a dated JSON report and PNG screenshots to the Git-ignored `audits/testingbot/` directory.
- Records the public HTML digest at run start and actual browser/viewport details. This is a production observation, not yet a candidate-build release gate or per-resource hash manifest.
- Records pass/fail in TestingBot and closes the remote session in `finally`.
- Never submits an enquiry, enters child/family details or initiates a telephone call.
- An unavailable device or failed assertion produces a non-zero exit status.

This is a bounded interaction check, not a ranking, conversion, comprehensive accessibility, field-performance or every-device certification. Existing Lighthouse, local browser-engine, machine-data and release checks remain separate. A programmatic rail scroll verifies reachability; it does not prove a physical swipe gesture.

## Efficient release use

The full cross-device, visual, typography, accessibility and release coverage plan is [PORTAL-QUALITY-TEST-PLAN.md](PORTAL-QUALITY-TEST-PLAN.md). This runner implements bounded physical-phone and desktop-browser smoke checks; its existence is not evidence that the complete matrix, visual comparisons or release gate is active.

Run the local suite first. Use this small physical-device matrix after meaningful mobile interaction changes and before major releases; add iPad/other hardware only when the changed feature warrants it. Re-run failed cases after a relevant fix rather than repeating the whole portal. Keep live-device results attached to the exact released URL and version being reviewed.

## Search and business reporting connection

Use the existing authenticated GSC Wizard connector; no new copy of its key is required. The integration is a shared release record and chart annotation, not a claimed native TestingBot plugin.

1. Read GSC `query_devices` and GA4 `query_ga4_report` with `dimension: device` for a settled window. Use these to weight coverage. These exposed connector reports do not supply browser/version or OS breakdowns; do not infer Safari share from mobile share. Obtain actual GA4 technology data before trimming browser coverage by market share.
2. Run the selected cloud matrix; retain per-case results, exact URL, public HTML digest, actual browser versions, screenshots and provider IDs.
3. For a meaningful completed release or new QA baseline, check `list_annotations` before adding one property-scoped `create_annotation` with date, tested URL, receipt link and summary. A QA-only run must be labelled QA, not a website release. Routine unchanged reruns need no new annotation.
4. Review GSC clicks/impressions/CTR and Bing traffic against the same page and comparable settled periods. Review GA4 behaviour and call/enquiry events separately. Testing success is not proof of ranking gain, answered calls or admission.
5. Do not submit IndexNow/sitemaps for a tooling-only change, send new notification emails, or collect family details in test artifacts.

The existing Lighthouse and local Playwright/axe checks complement this cloud matrix. No additional paid platform is required for this integration. Device availability and future account entitlement remain provider-controlled.

Official references: [Selenium desktop capabilities](https://testingbot.com/support/web-automate/selenium/test-options), [mobile web](https://testingbot.com/support/web-automate/mobile), [physical capabilities](https://testingbot.com/features/automation/appium), [devices API](https://testingbot.com/support/api/devices), [test results](https://testingbot.com/support/api/tests), [GSC Wizard MCP](https://mcp.gscwizard.com/).
