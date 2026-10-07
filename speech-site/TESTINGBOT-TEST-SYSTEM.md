# Pinnacle TestingBot build and daily verification

7 October 2026. Accountable owner: this website task. Purpose: protect a readable, usable parent journey to **9100 181 181**, assessment enquiries and the relevant Pinnacle resources across actual browsers and physical devices.

## Definition of success

A report must identify the source commit, test-source hashes, exact URLs, actual browser/OS/device, delivered CSS viewport, assertions, screenshots and provider session. A missing session, missing case, empty assertion list, unconfirmed cleanup or failed result write cannot pass. Functional, visual, accessibility and performance results remain separate. A screenshot or HTTP 200 does not prove that a page is good.

No production test places a phone call, sends a WhatsApp message or OTP, signs into a family account, submits an enquiry, adds an Ads conversion, buys a book or changes a customer record. Production reader tests cover the anonymous Google gate and public server-rendered document. The real signed-in reader/profile, payment and backend accepted-enquiry paths need their existing controlled acceptance mechanisms.

## Suites and coverage

`tests/testingbot/page-manifest.mjs` is the canonical register. It reuses the current page contracts, 62 centre release records, policy/institutional data, book catalogue and language editions. `verify-paths.json` records the **84 URLs in the actual public Verify sitemap** captured on 7 October; it does not infer the live collection from an old export.

The initial register defines **264 cases: 262 published URLs and two explicitly pending libraries**. This is a managed-page/template register, not a claim to enumerate every dynamic Ask/FAQ/database record or legacy URL.

| Suite | Scope | Completion rule |
| --- | --- | --- |
| BVT | Seven public cases: Shop, PinnacleAI, Speech, Enrolment, Suchitra, one Ask answer, Verify root | All selected cases pass on each requested browser; no unavailable coverage counted as green |
| Exact-build BVT | Five Astro candidate cases: Shop, PinnacleAI, Speech, Enrolment, Suchitra | Test the candidate through the official tunnel, with the same source commit and test hashes; public production smoke cannot substitute |
| P1 | BVT plus 25 important page cases, including therapies, PinnacleAI modules, care outcomes, books index, knowledge templates and helpline | Critical content/navigation/contact and incoming service/centre preference survive |
| P2 | BVT/P1 plus 37 presentation/support records, including two unpublished libraries | Actual image decode, readable paragraphs, serious/critical accessibility findings, native Anek fonts, anchors and network checks; pending libraries stay pending |
| P3 | 195 further centre, offer, edition and Verify document records | Detect page-specific delivery, canonical, content, shell, asset and navigation regressions without duplicating every record across every browser |

New library paths must be added from their real migration manifest when published. The current Materials/Interventions source dependency is not waived by this test setup.

## Checks implemented

- Correct document/route, indexable response header, meaningful title/description, one main H1 and exact canonical.
- JSON-LD parses and an HTTPS social image is declared. This does not certify every schema vocabulary or search-engine rich-result eligibility.
- Approved common header/footer, exact authority labels/subtitles, 36 evidence cards, footer location/community links and Policies link.
- Actual mobile menu open/close, modal/inert behavior and focus restoration; actual desktop therapy hover behavior; real content disclosures.
- No whole-page horizontal overflow; readable paragraphs and valid in-page destinations.
- The PinnacleAI seven-card width/whole-word regression that catches the previously broken narrow-column layout.
- All four incoming Enrolment therapy preferences, enabled submit control and labels that keep words together. No live form submission.
- Centre-selected assessment destination; status/held-location pages are not required to invent an operational booking.
- Opening images decode with a bounded wait. P2 explicitly loads and checks the rest of the main-body images; untriggered lazy images are not treated as a completed decode.
- P2 uses the existing axe-core installation for serious/critical WCAG main-content findings and verifies Anek Telugu/Devanagari on the relevant native reading blocks.
- Browser errors, opening/content/footer screenshots, and browser lab navigation/LCP/layout-shift evidence.

Verify and the national helpline currently have dedicated shells. Their actual shells are tested and the difference from the common Astro shell is recorded. The suite does not pretend their common-shell migration is complete.

## Browsers, devices and dimensions

| Profile | Requested coverage | Actual identity rule |
| --- | --- | --- |
| `chrome` | Latest catalogue Chrome, Windows 11, 1440 × 900 CSS viewport | Confirm browser/OS, actual CSS viewport and provider capabilities |
| `firefox` | Latest catalogue Firefox, Windows 11, 1440 × 900 | Same |
| `safari` | Latest catalogue Safari, macOS Tahoe, 1440 × 900 | Same; this is desktop Safari |
| `edge` | Latest catalogue Edge, Windows 11, 768 × 1024 | Responsive tablet-size layout; **not a physical tablet claim** |
| `ios` | Available physical iPhone/Safari | Record the device actually allocated, iOS version, browser, CSS size and DPR |
| `android` | Available physical Android/Chrome | Same; device allocation/boot gets a bounded five-minute request window |
| `ipad` | Available physical iPad/Safari | Filter for an actual iPad; no phone substitution |
| `iosSmall` | Available physical iPhone SE/Safari | Filter for actual SE; no large-phone substitution |

The account currently permits limited concurrency. Sessions are reused across page cases and matrix jobs are sequential. A requested unavailable device is reported unavailable. Historical device screenshots are not current execution proof. Landscape, Windows high-contrast mode, 200% zoom, screen-reader operation and all older browser versions are not established by these default runs; add a targeted profile/check when a change makes one relevant.

For the 768 × 1024 Edge CSS viewport, the runner now requests a supported 1920 × 1200 VM display so browser chrome does not clamp the content height. The earlier 1920 × 1080 VM actually delivered 768 × 961; those five failures are retained. CSS viewport assertions are unchanged. Provider support: <https://testingbot.com/support/web-automate/puppeteer/change-screen-resolution>. The 1440 × 900 desktop profiles keep their existing display setting.

The viewport fitter reads actual outer-window bounds after real navigation and uses up to three adjustments, allowing for driver clamping and changing browser chrome. A still-unavailable viewport fails and stops the remaining same-profile cases rather than repeating that setup fault. The intermediate taller-display attempt delivered 768 × 1058 and remains recorded separately; it is not a successful tablet test.

## Visual references

The existing accepted source is `COMMON-SHELL-BASELINE.md`, tag `pinnacle-common-shell-baseline-v159-20261001` and the owner's exact fixture `tests/fixtures/shared-authority-owner-approved.json`. These are reused, not replaced.

With `--visual`, the runner invokes TestingBot's real `tb:visual.snapshot` comparison for the shared desktop header, using a stable browser/OS/viewport identifier. The physical browser provider did not resolve CSS cropping, so physical profiles use an exact-page opening viewport identifier instead; the repaired viewport mode is not yet remotely accepted. TestingBot automatically creates its first baseline. The runner labels that first capture **provisional** until its actual image and visual ID have been reviewed and registered in `visual-references.json`. It never automatically calls the baseline-replacement command after a difference. A registered visual-ID change or pixel mismatch fails the check.

Desktop pixel comparison covers the named header only. An approved reference whose comparison is unavailable fails verification; it cannot silently become a skipped pass. Page body/footer screenshots, semantic checks, geometry, typography and accessibility remain necessary. A passing pixel match does not assess whether the story is persuasive or appropriate. Review the current page against its agreed work order before accepting a new body reference.

The first actual Chrome/Windows 11 1440 × 900 provider reference is visual ID **20711**. Its Shop and Speech opening screenshots were reviewed against the approved common design and exact wording fixture; Speech, Enrolment and Suchitra returned zero changed header pixels in that CI run. PinnacleAI's first capture reported 146 differing pixels and remains recorded; it is not erased or called a visual pass. Approval is implementation review against the owner's existing design, not a new owner sign-off on all page bodies.

The funded P1 run subsequently established that authority/therapy/About links have intentional `aria-current` highlighting and reader gates dim the header through their backdrop. The test now keys references by those deterministic header states rather than comparing them with the neutral header. Original mismatches remain in the raw report; the new state references remain provisional until their own visual review. The viewport image check excludes native closed disclosures and horizontally offscreen images; full image loading remains the separate P2 sweep. Mirracles retains the existing public `reader={false}` source contract, while Ask/FAQ/Sunshine retain their required reader gates. None of these test corrections change production design or authentication.

## Network and performance

`--network` applies TestingBot's **3G** command on supported Chrome/Edge sessions, records command acceptance, actual Speech/Enrolment navigation/contact/overflow/timing evidence and network-log availability, then restores the connection. Unsupported browser control is explicitly skipped. No Safari/physical network throttle is inferred from a Chrome run.

The initial network run uses an already warmed browser. Its timings are labelled accordingly; it is not a cold-cache benchmark, local internet speed test, universal bandwidth guarantee or field Core Web Vitals result. Use the existing Lighthouse workflow for a controlled cold-load investigation after a meaningful performance change, and GSC/field data for actual visitor experience. LCP above 2500 ms and CLS above 0.1 are recorded warnings, not rewritten as pass scores.

## Every trusted source build

The existing `.github/workflows/portal-quality.yml` retains its Ask/runtime/unit/local-browser checks. Its trusted source-build job additionally:

1. Starts an isolated preview of the newly built `dist`.
2. Uses the official TestingBot tunnel action pinned to verified commit `10358e89858c67a0e5c7aadb1b03ef0e2d320d20`.
3. Runs `npm run test:bvt` against that candidate, with the actual GitHub source SHA.
4. Runs `node scripts/assert-testingbot-release.mjs audits/testingbot-build/report.json` to reject stale production reports, missing build cases or changed test sources.
5. Keeps the evidence artifact and stops the preview/tunnel.

TestingBot credentials were installed as encrypted repository secrets and their names read back. Credentials are not committed. Untrusted PR code receives no cloud credentials; existing local browser tests still run, and the trusted source build must pass before release.

Cloudflare promotion must use the exact green build/receipt. This workflow is the build verification path; it does not silently patch every historical standalone deployment script or claim branch-protection/account policies were changed. Worker-only/Ask/Verify runtime changes retain their own focused runtime and public-route checks because the five Astro candidate cases cannot establish those protected deployments.

## Daily operation

`npm run test:daily` runs one bounded plan in this workspace and keeps a local lock and coverage state under ignored `audits/testingbot-daily/`:

- 32 BVT/P1 public cases on Chrome every day.
- Eight P2 cases on tablet-size Edge: five critical page presentations plus three rotating support pages.
- 28 P3 records on Chrome: six bounded slots for unresolved failures, saved search/reference demand or a reproducible varied sample, plus 22 oldest records. All 195 published P3 records receive execution in at most nine completed daily rotations when the manifest is unchanged; execution does not mean a pass.
- Three critical cases on a rotating secondary desktop browser. An unresolved failure outside the other jobs replaces this slot with a three-case retry on its actual browser/suite; no additional session is added.
- Three critical cases on a rotating physical iPhone, Android, iPad or small iPhone profile.
- 3G checks on Tuesday/Friday. Explicit one-off runs can add a network check after a relevant release.

This is **74 selected page runs across five sequential jobs** per normal completed daily plan. Counts of actual executed/passed/failed/unavailable cases are recorded separately. A queue wake is not a pass. The plan runs the full critical suite daily and broader records in rotation; it does not claim all 264 pages were tested in every device each day.

### Existing-tool evidence feeds the daily selection

Before allocating a session, the daily launcher runs the existing offline `growth-evidence-profile.py` once. Versioned `tests/testingbot/evidence-inputs.json` supplies saved TestingBot report roots, the dated aggregate Pitchbox snapshot and existing Windsor observations; the local `evidence-sources.json` retains Ahrefs inputs and release boundaries. No provider query, new crawl, email or index submission happens in this step.

The profile joins existing work records by exact URL to GSC landing demand, saved Ahrefs India queries/completed audit state, completed Screaming Frog exports, browser execution and aggregate Pitchbox/Windsor observations. Each observation retains its own date/source. Screaming Frog URL evidence now selects the newest successful completed receipt by timestamp, including the existing `crawl/` exports; folder names and failed exports cannot replace it.

Rotating P2 has one evidence/failure/sample slot and two oldest support pages, alongside its five fixed important presentations. P3 has six such slots and 22 oldest records. The varied sample is reproducible from the day and case ID. Same-suite/browser failures receive priority; a P1 pass cannot clear a P2 finding, Chrome cannot clear Safari, and an interrupted retry cannot clear a confirmed failure. Coverage state stores last execution, last pass and unresolved failure separately by browser and suite. Failed/missing cleanup never advances completed coverage. Individual visual approval/provisional/skipped state stays visible alongside functional results.

This is a local evidence integration and selection mechanism. It does not make Pitchbox send from a test pass, make GSC certify visuals, make Ahrefs repair code, or establish actual calls/admissions. A promoted Cloudflare revision still needs its exact green candidate receipt and protected-runtime/public verification. Existing growth schedulers stay stopped.

Automation: `daily-pinnacle-testingbot-regression`, daily 09:10 IST in this native Codex thread. The previous broader website-quality automation was paused, in keeping with the owner's scheduler stop. Other growth schedulers are not restarted. The new job reports only new/changed material failures, essential missing coverage or a required action; unchanged passes and repeated known findings remain quiet.

Do not use `--force` for ordinary scheduled execution. It exists for a meaningful corrected runner/new-release rerun. If `active.lock` remains after interruption, read its owner and exact provider reports, reconcile owned sessions and only then remove that lock. Do not overlap CI/provider sessions beyond account capacity or stop unrelated sessions.

## Commands and evidence

Use the bundled Node executable when `node` is absent from PATH. Windows credentials come from the existing DPAPI-encrypted TestingBot record; CI uses the encrypted repository secrets.

```text
npm run test:testingbot-contract
npm run test:bvt:live -- --matrix chrome
npm run test:bvt:live -- --matrix ios,android
npm run test:p1 -- --matrix chrome
npm run test:p2 -- --matrix edge --cases shop,pinnacleai,speech,enrolment,centre-suchitra
npm run test:p3 -- --matrix chrome --cases <explicit case IDs>
npm run test:all-pages -- --matrix chrome
npm run test:daily
node scripts/testingbot-daily.mjs --plan
```

Each raw report remains under ignored `audits/testingbot-suites/` or `audits/testingbot-daily/`; compact release/coverage receipts are saved in `reviews/`. Each real remote session links to its TestingBot dashboard. Videos/logs may become available after provider processing; local screenshots are saved during the test. Tests never print credentials or signed asset URLs in committed receipts.

Manual P3/all-page runs use at most 28 cases per reused browser session and proceed sequentially. Defaults use one browser; wider matrices are explicit, rather than silently multiplying all records by every platform. Pending libraries never count as passed. The launcher stops allocating more shards after a provider/account startup rejection and retains all unexecuted IDs.

## Open acceptance boundaries

- Materials/Interventions import and their final paths are pending the original complete HTML source. Their two manifest cases are not passed.
- Verify/common-shell and helpline/common-shell integration are not claimed delivered by this test-only change.
- Small secondary Shop text was observed at 11 px in initial testing. It is a P2 readability finding and must stay visible until corrected; BVT's purpose is critical functional smoke, not suppressing that finding.
- The Ads task supplied four separate acquisition gaps on 7 October: central website-call helper route coverage, accepted-enquiry attribution, reachable consent choices and OT alias parameter preservation. That handoff is **not a deployed correction or TestingBot pass**. Fold its focused acceptance into the next acquisition release, preserving existing holds and measurement boundaries.
- Publication/indexing, actual Google registrations, qualified calls, walk-ins, enrolments, sales and AI citations are not inferred from these suites.
- On 7 October, after the successful public/physical/candidate BVTs, TestingBot rejected the wider daily run with **“Insufficient credits. Please add credits on testingbot.com.”** The API account reports Free Trial. The next condition is TestingBot funding or a funded account's secure credentials; the wider P1/P2/P3 and other-browser runs have not executed. Do not repeat that rejected run while the condition is unchanged. The new daily job remains configured and reports unchanged credit failure quietly.

### Funding condition cleared — 7 October

Subsequent acceptance supersedes the execution gaps in the historical paragraph below: complete corrected production P1 is **32/32 Chrome/Windows functional pass**; final Edge P2 at actual **768 × 1024** is four pass/Shop readability fail. The two earlier Edge viewport-setup attempts remain in the receipt. All four owned sessions are closed with provider result read-back. 13 Node and 11 Python guards pass. CI for `9b2f944357728a561df274d3315d53536ea9b9fe` is independently observed successful; the final integration/fitter commit requires its own CI. See `reviews/TESTINGBOT-INTEGRATION-20261007.md` and its compact JSON receipt. The full 74-case daily plan, remaining P2/P3/device/dynamic-record and visual acceptance are not claimed completed.

After the owner's upgrade, `/user` reports **Automated Pro - 1 Sessions - Unlimited**, one desktop slot and one physical slot. A new actual Chrome session executed all 32 P1 cases. The initial 18/32 result contained reference-state/visibility/reader-contract mistakes described above; it is retained and is not rewritten as a clean P1 pass. Targeted corrected cases are recorded separately under `audits/testingbot-upgrade-20261007/`. Nine local contract guards pass. The wider P2/P3/other-platform and final candidate-build acceptance still need their own execution; the prior account-credit dependency no longer applies. Reuse sessions sequentially within the actual slot limits. The provider's raw seconds counter is not interpreted as purchased time, usage cost or physical-device plan entitlement.
