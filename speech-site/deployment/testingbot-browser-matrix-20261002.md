# TestingBot desktop matrix and GSC Wizard connection — 2 October 2026

## Acceptance correction — lifecycle defect missed

The owner subsequently reported the seven lifecycle cards collapsed into narrow vertical columns below the hero. The 14 checks below passed but did not test that section's layout; screenshots covered the hero art rather than the HTML lifecycle cards. The general visual-acceptance conclusion was therefore incomplete and must not be treated as page approval. V163 isolates the conflicting CSS and adds a readable-width/row/text-wrapping contract, first verified to fail against this broken production version. See `pinnacleai-v163-release-20261002.md` for the correction and current result.

## Completed

Extended the existing API runner to hosted desktop browsers, executed it against https://www.pinnacleblooms.org/pinnacleai, visually inspected 16 section/state screenshots and connected the QA milestone to the existing GSC Wizard property timeline.

| Browser actually returned | Requested OS | Provider test ID | Assertions | Actual CSS viewport |
| --- | --- | --- | --- | --- |
| Safari 26.3.1 | macOS Tahoe | 53266400 | 14/14 PASS | 1440 × 900 |
| Chrome 153.0.8010.37 | Windows 11 | 53266427 | 14/14 PASS | 1440 × 900 |
| Edge 153.0.4234.32 | Windows 11 | 53266478 | 14/14 PASS | 1440 × 900 |
| Firefox 155.0 | Windows 11 | 53266526 | 14/14 PASS | 1440 × 900 |

Run: 2026-10-02T02:17:41.740Z to 2026-10-02T02:20:13.479Z. All sessions closed and provider results recorded successfully. A separate provider read at 02:20:35 UTC confirmed **zero desktop sessions and zero physical sessions** still running. Four videos and four screenshots per browser were then available. Videos were confirmed available, not watched end to end.

This is real Safari on macOS and hosted Windows browsers. It is separate from the earlier physical iPhone/Safari and Galaxy/Chrome runs in `testingbot-api-validation-20261002.md`.

## Checks and visual inspection

The 14 checks per browser cover requested browser family/major version and OS family, measured viewport, desktop controls, canonical/H1, horizontal overflow, nine authority destinations/subtexts, telephone destination, hover-menu opening/outside-click closure, authority rail reachability, seven stage labels/ten FAQs, FAQ interaction, lifecycle image loading, 36 Verify footer cards/policy link, the declined analytics state/cookie check, and opening the enrolment form without submitting.

Header, open therapy menu, lifecycle/CTA and footer screenshots were inspected in all four browsers. The captured text, artwork, branding and links rendered without an observed missing image, horizontal clipping or broken dropdown in those states. Rasterisation and scrollbar differences remain browser/OS-specific. These section captures are not a complete page visual audit, an automated visual-diff baseline, physical display-colour measurement, formal accessibility certification or a narrative/conversion score.

The first desktop pass used a hover-then-click sequence on a menu designed to open on hover; the click closed it and caused a false failure in the runner. Failed provider records 53266187, 53266226, 53266283 and 53266337 are retained. The test was corrected to use a genuine WebDriver pointer hover and outside click, followed by one matrix rerun. No approved header code was changed to make a test pass.

Desktop outer window sizes differed between browsers. The runner now adjusts once to the intended CSS viewport and asserts the result; a display resolution alone is no longer treated as the viewport. A focused read-only reviewer identified both the hover-sequence issue and this geometry/identity gap.

## Reusable implementation

- `npm run test:cloud-browsers`: the four pinned desktop combinations, sequentially.
- `TESTINGBOT_BROWSERS=safari` (PowerShell environment syntax in guide): focused browser selection.
- `npm run test:devices`: existing physical-phone mode.
- Live catalogue validation, returned browser identities, explicit device/browsers labels, same secure credential loader, owned-session cleanup, remote pass/fail, reports and screenshots.
- Production HTML digest at run start: `c37f312a4f86d62dc287c7d3a794e2e9a647ae048ddfa1fd1ee3941110b17025`.
- Original run reports retain a runner source digest, so the code used for an execution is identifiable. The final account-counter field was subsequently corrected from `current_concurrency` to the API's `current_vm_concurrency`; the independent provider closure file confirms this run's cleanup.
- No new runtime dependency, page build, public asset change, header/footer change, routing change or Cloudflare deployment was needed.

## GSC Wizard connection

The existing authenticated connector remains active for `sc-domain:pinnacleblooms.org` and GA4 property 361649365. Read settled Search Console device clicks and GA4 device sessions for 2–29 September; keep the two measurements distinct. Detailed analytics remain in the local Git-ignored context receipt.

Created exactly one property-scoped annotation:
- ID: `03a7f500-5c06-4789-b2f7-3d905502da89`
- Date: 2 October 2026
- Label: PinnacleAI browser QA baseline — Safari, Chrome, Edge, Firefox
- Links to this receipt and names the tested URL/provider records.
- Explicitly a **QA milestone**, not a website launch, indexing submission, ranking uplift or lead conversion.

This is an operational connection through canonical URL, dated QA evidence and the GSC chart timeline. No native TestingBot-to-GSC-Wizard connector, continuous webhook pipeline or scheduled reporting job is claimed. The exposed GSC Wizard GA4 report dimensions do not include browser/OS versions; browser-market-share optimisation therefore remains dependent on actual GA4 technology data. Do not derive Safari share from mobile traffic.

No unchanged URL was re-submitted to Google, Bing or IndexNow. No enquiry or phone call was initiated. No notification was sent to another person. No new subscription was purchased.

## Matrix to use

- Core major release: physical iPhone/Safari, physical Android/Chrome, Safari/macOS and Chrome/Edge/Firefox on Windows.
- Shared shell, sticky controls or tablet layout change: add physical iPad/Safari.
- Browser-sensitive feature or reported older-device defect: add the relevant older Safari or Android/browser combination.
- Broad geometry: existing fast local 320/360/390/430/768/1024/1366/1440/1920 coverage as the change requires.
- Small copy or isolated correction: relevant content/visual tests; avoid re-running the whole fleet.
- Lighthouse/axe and machine-data checks remain their own test layers.

Candidate-build binding, automated reviewed visual comparisons, expanded mobile gestures/keyboard/rotation, all-family selection and CI cloud-device release scheduling remain open in `PORTAL-QUALITY-TEST-PLAN.md`. This run proves the API execution path and these specific cases, not completion of those gaps.

## Local artifacts

- `audits/testingbot/2026-10-02T02-17-41-740Z/report.json`
- `audits/testingbot/2026-10-02T02-17-41-740Z/provider-closure.json`
- 16 PNG files in the same folder.
- `audits/testingbot/gsc-context-20261002.json`
- `audits/testingbot/gsc-annotation-20261002.json`
- Initial failed runner pass: `audits/testingbot/2026-10-02T02-14-53-190Z/`.

Credentials and signed provider download links are absent from committed files.

## Official references

- [TestingBot browser catalogue API](https://testingbot.com/support/api/devices)
- [Selenium browser, platform and screen capabilities](https://testingbot.com/support/web-automate/selenium/test-options)
- [GSC Wizard MCP integration](https://mcp.gscwizard.com/)
