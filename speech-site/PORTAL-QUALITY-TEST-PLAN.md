# Pinnacle portal quality and release test plan

2 October 2026 · Implementation owner: this task's main agent

## Decision and current status

The existing engineering checks and successful TestingBot connection are useful foundations. They do **not** establish full visual, accessibility, device or family acceptance. This document makes the remaining work explicit. A planned check is not a passed check.

The business outcome is a family understanding the page's service and PinnacleAI purpose, trusting its sourced explanation, and being able to reach **9100 181 181**, a relevant centre or enrolment without friction. The page-creation work order continues to govern narrative, approved branding and evidence. This plan governs how those outcomes are tested.

Do not redesign the approved common header/footer while adding tests. Use `COMMON-SHELL-BASELINE.md` and its immutable V159 tag. A new baseline must not silently accept a regression.

### What is established as of this audit

| Area | Evidence | Status / limit |
| --- | --- | --- |
| Types, build, unit/contract checks | `scripts/check-page.mjs`, `package.json` | Wired to CI for the selected page; does not itself certify every page |
| Responsive interaction | Playwright projects at 320, 390, 768, 1440; separate V162 receipt also includes 1024 | Real execution receipts exist; the generic project matrix omits some useful widths/states |
| Browser engines | Chromium, Firefox and WebKit in CI; Edge configured locally | WebKit on a desktop runner is not a physical iPhone |
| Shared presentation | `shared-shell-contract.mjs` and owner-approved fixture | Exact copy and selected desktop typography/geometry locked; complete image comparison is absent |
| Physical mobile automation | TestingBot receipt dated 2 October: iPhone 13, iPhone XR and Galaxy S24 | API runs, screenshots and recordings confirmed; on-demand smoke coverage for PinnacleAI |
| Visual acceptance | Page-specific screenshots and inspected physical lifecycle/footer captures | No general approved screenshot comparison gate; all important page blocks are not covered by the device runner |
| Accessibility | axe WCAG 2.0/2.1 tags, serious/critical and visible-label checks; keyboard shell interactions | Not full WCAG 2.2 conformance, screen-reader testing or manual accessibility acceptance |
| Performance | Existing Lighthouse runner; saved V162 production result: mobile 96, desktop 100, mobile LCP 2,652 ms | LCP exceeds 2,500 ms budget. CI execution is optional; budgets fail only with `--enforce`; field INP is separate |
| Search/machine layer | Canonical, robots, metadata, JSON-LD parsing, dedicated exports and route tests | Generic checks do not prove schema meaning, indexing, ranking or AI recommendation |
| Conversion | Telephone destinations, enrolment navigation, existing form/measurement unit tests | Physical smoke does not demonstrate accepted CRM delivery, connected calls or admissions |
| Release enforcement | Source/deployment receipts, protected route checks, QA workflow | TestingBot and visual acceptance are not yet automatic prerequisites of deployment |

**Concrete open performance finding:** the saved V162 production lab report (`deployment/pinnacleai-v162-lighthouse-20261001.json`) records mobile performance 96, desktop 100, but mobile LCP **2,651.648 ms** against the declared **2,500 ms** budget. The score does not erase this warning. Inspect the recorded image-delivery/render-blocking opportunities, then rerun only after a relevant change or justified variance check. Do not call the full speed budget passed.

## 1. Team and accountability

| Role | Responsibility | Actual staffing / evidence rule |
| --- | --- | --- |
| Implementation and release owner | Build, fix, preserve common sources, run tests, reconcile results, deploy and retain rollback | Main agent in this task; never handed away |
| Independent QA reviewer | Challenge coverage, false passes, regression scope and failed-test dispositions | Read-only agent review; independent of source edits |
| Visual, family and conversion reviewer | Inspect rendered page, typography, art, hierarchy and first-action clarity | Read-only AI review is editorial evidence, not real user research |
| Accessibility specialist / real assistive-technology user | Keyboard/screen-reader tasks and standards judgement | Human review not yet recorded; keep this row open rather than inventing sign-off |
| Pinnacle operations / actual families | Receiving-call process, legitimate intake acceptance and uncoached comprehension | Existing owner/team supplies real operational evidence; no fake enquiries or invented participants |

Use at most two independent reviewers for a normal page; bring a third only for a specific evidence/domain question. Do not keep a large pool running or repeat the same review without a new change or unresolved finding.

## 2. Coverage matrix

Select by risk and visitor usage, not every possible device/browser permutation. The initial matrix below is provisional until first-party device/browser traffic is reviewed. Preserve a smaller/older supported device even when its share is low if it represents an important accessibility or performance risk. Record exact acquired hardware, OS, browser, CSS viewport, device pixel ratio and orientation in each receipt.

### Responsive layout grid — inexpensive local coverage

- Widths: **320, 360, 390, 430, 768, 1024, 1366, 1440, 1920 CSS pixels**.
- Include a short phone viewport (320 × 568) and landscape phone (844 × 390).
- Test immediately below/at/above each breakpoint touched by the change. Discover breakpoints from the actual changed CSS; do not assume all pages use the same values.
- Chromium covers the broad layout grid. Firefox and WebKit cover representative phone/tablet/desktop cases for engine differences; Edge runs on Windows where its actual runtime is available.
- CSS pixels, screenshot pixels and the device's marketing resolution are different. Retain all relevant values instead of inferring one from another.

### Physical / hosted browser matrix

| Tier | Environment | Trigger |
| --- | --- | --- |
| Core | A supported iPhone/Safari and Android/Chrome | First substantial page release; mobile layout, navigation, form, image or sticky-action changes |
| Small/short phone | iPhone SE class or equivalent small-screen hardware | Header, enlarged text, keyboard and sticky-control changes |
| Mid-range Android | Galaxy A / Redmi class selected from available hardware | Image-heavy, memory-sensitive or low-performance experience changes |
| Tablet | Physical iPad/Safari, portrait and landscape | Tablet layout, menus, diagrams and shared-shell changes |
| Android tablet | Appropriate available hardware; otherwise explicitly untested | Tablet-specific features or traffic evidence warrants it |
| Desktop | Windows Chrome, Edge and Firefox; macOS Safari on the hosted grid | Shared shell, typography, form or browser-sensitive CSS changes |
| Extended | Additional older/current OS, Samsung Internet, in-app browser | Material audience share, observed defect or capability-specific need |

Desktop grid VMs establish actual desktop-browser rendering; do not label them physical laptops. Do not label emulated tablets as physical devices. Device availability is checked at runtime; unavailable cases remain open or are replaced by a documented equivalent. Never silently use an emulator and call it physical.

## 3. What each page must demonstrate

### A. Visual composition and approved identity

Capture the header, hero, all distinct narrative/diagram blocks, source/proof block, first-step CTA, important local-centre area, Verify footer and final footer. Inspect at displayed phone/tablet/desktop size, not only a zoomed desktop image. For PinnacleAI this includes the architecture, home, Self-Sufficient and Mainstream sections in addition to the lifecycle circle.

- Preserve the approved logo, emblem, palette, authority subtexts, complete footer and prominent number.
- Check hierarchy, whitespace, columns, button alignment, heading wraps, section transitions and mobile reading order.
- Confirm faces, brand marks, phone, purpose and important labels are not cropped, distorted, hidden or covered.
- Check `srcset`/`sizes`, actual chosen image resource, aspect ratio, decoding and resolution for high-density displays. A successful `naturalWidth` check proves loading only.
- Embedded poster text must remain legible in its intended use. Where it is too small, provide the same important meaning as readable HTML; do not declare success because the whole poster fits.
- Check social OG image bytes, size, MIME type, crop-safe content and preview use. A correct meta tag alone is insufficient.

### B. Typography and colour

- Verify the actual loaded Sintony font/weight, not merely the CSS family string. Inspect regular/bold font availability and fallback behaviour.
- Record computed font size, weight, line-height, spacing and colour for headings, leads, body, links, buttons, authority subtitles, source notes and footer. Compare to the accepted design at each breakpoint.
- Body copy target is at least 16 CSS px unless an approved role-specific design specifies otherwise. Do not apply that target indiscriminately to the locked common-shell values or redesign them without authorisation.
- Check 200% text enlargement, real browser zoom, 320 CSS-pixel reflow, WCAG text-spacing overrides, long words/labels and font-load failure. A CSS transform is not a substitute for browser zoom.
- WCAG AA targets: normal text contrast 4.5:1; qualifying large text 3:1; applicable controls/focus graphics 3:1. Apply the actual criterion and exceptions; do not compare every decorative pixel.
- Check hover, focus, active, visited, error and disabled states against their real backgrounds, including gradients and photographs. Do not rely on colour alone for a distinction.
- Check dark colour-scheme preference, forced-colours/high-contrast mode and reduced motion. A dark-mode preference must not make a deliberately light design unreadable.
- A screenshot can establish rendered pixels and CSS colour/contrast. It cannot certify a physical OLED/LCD panel under glare, low brightness, Night Shift/True Tone or different calibration. Record an in-person screen check for those claims; never promise identical perceived colours on every screen.

### C. Interaction and assistive technology

- Navigate with normal scrolling, physical swipes, taps, keyboard and browser Back. Programmatically centring a control is useful for a bounded click test but is not proof of a natural touch journey.
- Reach all nine authority links including Citations, open/close/reset More, search, use disclosures and traverse the footer.
- Test address-bar expansion/collapse, safe areas, sticky CTA, rotation and the software keyboard together. No required action or error should be trapped behind fixed UI.
- Use practical 44 × 44 CSS-pixel touch targets where feasible; WCAG 2.2 AA target-size minimum is 24 × 24 with defined exceptions/spacing. Distinguish the ergonomic target from the normative minimum.
- Exercise meaningful focus order, visible/non-obscured focus, skip link, Escape, labels, names/roles/states and live error/status messages.
- Combine axe with VoiceOver/Safari, TalkBack/Chrome and keyboard/NVDA desktop tasks. Automated audit results alone are not accessibility conformance.

### D. Families, narrative and conversion

An independent reviewer follows the actual page work order: the focal service, the child's self-sufficient/mainstream-included life as purpose, family participation, evidence and next action must form a coherent page. Check the language in Pinnacle's voice and the role of each creative; a count of blocks cannot establish this.

For each major template, run a short uncoached study with a small, varied group of actual adult parents/caregivers (suggested starting point: five, not statistical proof). Ask them to identify the page's service/purpose, explain what the first call leads to, find evidence, find a relevant centre and find the next action. Record task completion and misunderstandings without collecting child health details. AI personas remain a separate editorial review.

Verify actual rendered call, WhatsApp, centre/map, evidence/citation and enrolment destinations. Use approved test mode or the receiving team's legitimate acceptance process for intake. Do not create false patient records or call the line during automated smoke runs. Page clicks, accepted enquiries, answered calls, visits and admissions have separate evidence.

### E. Performance, machine reading and delivery

- Lighthouse mobile/desktop for an initial release and relevant image/CSS/JS changes. Enforce the existing budgets deliberately (`--enforce`) rather than reporting a successful process exit as a passing budget. Investigate noise before repeating; never run until a lucky score appears.
- Existing lab targets: performance 90+, LCP at most 2.5 s, TBT at most 200 ms, CLS at most 0.1. TBT is a lab diagnostic, not field INP.
- Record real-user/CrUX field LCP, INP and CLS where available. Targets at the 75th percentile: LCP 2.5 s, INP 200 ms, CLS 0.1. Insufficient field data stays unavailable.
- Cover the cold first visit, cached return, slow network and failed optional resources on representative tasks. No-JavaScript reading and important links must be assessed separately from enhanced interactions.
- Validate rendered and source HTML, canonical, robots, sitemap, structured-data meaning/visible agreement, titles/descriptions, image metadata, internal links, stable citations and reading exports. Use standard validators, not a regex-only conformance claim.
- Reuse existing protected-route/cookie/alias/union-release tests. Search indexing and AI citations require actual observations; accessible markup does not prove recommendations.
- Check accepted/declined analytics and GPC with network assertions. Cookie absence alone does not establish absence of requests or privacy compliance.

## 4. Visual regression implementation

Use Playwright's built-in `toHaveScreenshot()` comparisons first. TestingBot's visual-testing integration can centralise cloud comparisons if it adds value; another paid visual platform is not a prerequisite.

1. Seed controlled reference captures from the approved shared-shell design and reviewed page candidate; record source commit, OS, pinned browser version, viewport/DPR, font files and baseline reviewer.
2. Keep each browser/OS reference separate. Rasterisation differences between environments are not automatically defects.
3. Capture stable sections and key states. Wait for real font/image readiness and stable rendering; retain meaningful loading/failure-state tests separately.
4. Compare expected, actual and difference images. Review the cause. Do not silently regenerate expected images to make CI green.
5. Mask only documented truly variable elements. Never mask logos, phone, headings, source labels, images or navigation to hide a defect.
6. A baseline matching the current page prevents regressions; it does not prove the current page is attractive, readable or useful. Those need the design and family reviews above.

**Current status: planned, not yet implemented or baselined.** Existing standalone screenshots must not be called visual regression coverage.

## 5. When tests run; how to keep cost and time bounded

| Change | Required scope |
| --- | --- |
| Small copy/link change | Relevant content/link contract, wrapping and changed-section capture at smallest/desktop view; no unrelated fleet rerun |
| Page narrative/creative/layout | Page contract, broad local geometry, representative engine/visual/a11y checks, core physical phone pair and new imagery at displayed size |
| Common header/footer/fonts | Every managed route gets static/delivery checks; rendered representatives for therapy, PinnacleAI, enrolment, centres, policy and the assembled Verify evidence shell; small phone/tablet/desktop, all engines, core physical phones and iPad |
| Form or consent | Unit/API contract in approved mode, errors, retry/unknown-response handling, keyboard, privacy network checks and physical phone pair |
| Routing/cache/release assembly | Existing protected-route and returning-visitor contract plus production read-back; retain rollback |
| Cosmetic rendering unrelated to speed | Focused visual/interaction check; do not repeat indexing submissions or an entire Lighthouse suite |

Build once for the candidate. Share that exact build across local checks and representative page tests. Use two local workers initially, one cloud physical session at a time under the observed account allowance. Save traces/video on failures and release evidence; do not stream every step through model calls.

The release manifest must name candidate commit/content hashes, page URLs, changed shared files, required cases and exact results. Result states: **PASS, FAIL, NOT RUN, BLOCKED, NOT APPLICABLE**. Skips and unavailable devices cannot satisfy a required gate. No physical result from an older release is silently reused after a relevant change.

**Candidate versus production:** the current TestingBot runner accepts production Pinnacle URLs, so its present role is post-deployment acceptance. It cannot certify an unpublished candidate. P0 implementation must provide an explicitly allowlisted, noindex candidate route or a provider tunnel tied to the built content hashes, then run physical pre-release tests there. After publication, read back those same hashes and run the focused production smoke. Until that candidate path exists, report physical validation as post-release only and retain rollback for material failures; never count a pass on yesterday's production page as today's candidate result.

Failing call/enrolment access, missing evidence/navigation, clipped essential content, incorrect canonical/noindex, critical accessibility barriers, protected-route regressions or unexplained baseline changes block the affected release. Review medium/lower-severity failures with the actual user impact; no severity filter should erase them from the ledger.

One rerun follows a relevant fix. An infrastructure failure may get one documented retry or equivalent-device substitution; do not loop on an unchanged failure. Escalate the exact unresolved condition and continue independent page work.

## 6. Ordered implementation work order

| Priority | Task / owner | Completion evidence | Status on 2 October |
| --- | --- | --- | --- |
| P0 | Main owner: make one release acceptance manifest linking local, cloud, visual and production receipts to the candidate | A mismatched/stale/missing required result prevents the release gate passing | Not implemented |
| P0 | Main owner + visual reviewer: baseline the approved common shell and PinnacleAI's distinct sections | Reviewed references and actual/expected/diff artifacts; intentional regression is detected without changing public site | Not implemented |
| P0 | Main owner: expand physical journey to normal swipes, keyboard, rotation and sticky controls; validate tablet-specific assertions | iPhone/Android/iPad results with exact hardware and honest per-case states | Narrow phone smoke only |
| P1 | Main owner: extend typography, image/crop, contrast and breakpoint contracts using existing Playwright/axe | Role-specific measurements, full image/section review and enlarged-text/fallback results | Partial |
| P1 | Main owner: coverage selection across every page family after shared changes | Shared build; complete route census plus representative rendered family matrix | Per-release checks exist; automatic family selector absent |
| P1 | Main owner: wire budget enforcement and WCAG 2.2/contrast findings into release summary | Fail/warning dispositions retained; no silent success on unmet required budget | Runners exist, incomplete enforcement |
| P0 | Main owner: provide the candidate device-test path and bind remote receipt to commit/content digest; strengthen canonical/FAQ/footer assertions | Pre-release candidate and post-release production results identify the exact intended content | Current remote test production URL/time only |
| P1 | Main owner: preserve routine successful artifacts and enable an explicit device release job | Results retained for releases, secrets in legitimate CI store if CI used, bounded concurrency | Local runner works; CI device job absent |
| P2 | Human specialist / users: assistive-technology, own-screen and comprehension acceptance | Actual dated task observations and issue dispositions | No completed human evidence in this audit |
| P2 | Owner with operations: connect real lead/visit/admission measurement | Distinct accepted intake / answered call / visit / enrolment records | Separate operational verification |

This audit completes the plan and gap inventory. It does not mark the implementation rows completed. Start with the accepted shell and PinnacleAI, then apply the same tested process to each page in the existing priority ledger. No new page redesign or migration is implied by this plan.

## References and inspected sources

- [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/) and [W3C evaluation guidance](https://www.w3.org/WAI/test-evaluate/).
- [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots): same-environment references and reviewed baseline changes.
- [TestingBot visual regression](https://testingbot.com/support/web-automate/playwright/visual-regression-testing).
- [Lighthouse overview](https://developer.chrome.com/docs/lighthouse/overview) and [Core Web Vitals](https://web.dev/articles/vitals).
- Local: `package.json`, `playwright.config.mjs`, `.github/workflows/portal-quality.yml` in the repository root, `scripts/check-page.mjs`, `scripts/check-speed.mjs`, `scripts/page-quality-contracts.mjs`, `scripts/test-testingbot.mjs`, `scripts/validate-pinnacleai-v162.mjs`, `tests/browser/portal-smoke.spec.mjs`, `tests/browser/shared-shell-contract.mjs`, `tests/fixtures/shared-authority-owner-approved.json`, and the dated physical-device receipt.

Two independent read-only agent reviews informed the gap inventory: automation/coverage and visual/family-conversion. They were not physical-device operators, real parents or clinical/accessibility signatories.
