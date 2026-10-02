# Unattended physical-device testing

TestingBot is the remote device provider. Node runs the checked-in smoke test directly through its HTTPS REST and W3C WebDriver APIs. No interactive browser login, model API key, local emulator, Appium server or new runtime package is required for a run.

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

## Credentials

- Local Windows: the supplied account credentials are stored outside the repository in `%USERPROFILE%\.testingbot\pinnacle-credentials.clixml`. Windows DPAPI encrypts the secret for this Windows user. The script decrypts it only inside the child process and does not print it.
- CI: provide `TESTINGBOT_KEY` and `TESTINGBOT_SECRET` through the runner's secret store. Never add them to source, report artifacts or command examples.
- This uses the TestingBot service API only. It does not change ChatGPT/Codex authentication or use the OpenAI API.

## Limits and artifacts

- Runs one physical session at a time; hard session cap five minutes and idle timeout one minute.
- Takes screenshots and requests a provider recording. Provider artifacts may become available after the session ends.
- Writes a dated JSON report and PNG screenshots to the Git-ignored `audits/testingbot/` directory.
- Records pass/fail in TestingBot and closes the remote session in `finally`.
- Never submits an enquiry, enters child/family details or initiates a telephone call.
- An unavailable device or failed assertion produces a non-zero exit status.

This is a bounded interaction check, not a ranking, conversion, comprehensive accessibility, field-performance or every-device certification. Existing Lighthouse, local browser-engine, machine-data and release checks remain separate. A programmatic rail scroll verifies reachability; it does not prove a physical swipe gesture.

## Efficient release use

The full cross-device, visual, typography, accessibility and release coverage plan is [PORTAL-QUALITY-TEST-PLAN.md](PORTAL-QUALITY-TEST-PLAN.md). This runner currently implements only its bounded phone smoke subset; its existence is not evidence that the complete matrix or release gate is active.

Run the local suite first. Use this small physical-device matrix after meaningful mobile interaction changes and before major releases; add iPad/other hardware only when the changed feature warrants it. Re-run failed cases after a relevant fix rather than repeating the whole portal. Keep live-device results attached to the exact released URL and version being reviewed.

Official references: [mobile web](https://testingbot.com/support/web-automate/mobile), [physical capabilities](https://testingbot.com/features/automation/appium), [devices API](https://testingbot.com/support/api/devices), [test results](https://testingbot.com/support/api/tests).
