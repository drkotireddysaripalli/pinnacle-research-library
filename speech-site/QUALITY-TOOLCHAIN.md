# Pinnacle reusable quality toolchain

1 October 2026. This implements the local toolkit adoption plan while preserving the governing Pinnacle page creation work order.

## Fast page loop

1. Read the compact current context, governing work order and the active page contract. Keep one page package active.
2. Reuse the common header, complete menu, footer and Verify proof components. Write the page-specific Pinnacle narrative and generate the approved complete branded creatives.
3. Finish the page and its source, share, machine and conversion package before running acceptance.
4. Run `npm run check:page -- occupational` (or speech, enrolment, aba, autism). This performs source typing, one production build, the focused unit suites and phone/tablet/desktop smoke plus axe checks. Playwright manages an isolated loopback test preview, leaving the owner's Astro preview running. Run the established specialised page/source contract when its content changes.
5. Repair actual findings and repeat only failed/changed checks, using `test:unit` or `test:browser` directly instead of rebuilding unchanged work.
6. Use `npm run test:engines` for Firefox/WebKit/installed Edge when shared layout or interaction changes warrant it. These are engine/emulation tests, not proof of physical iPhone testing.
7. Commit/push source, stage the complete union, verify protected routing/accepted bodies, deploy through the established Cloudflare route and read back production once. Explicit release and rollback identifiers are mandatory.

Supported commands use project-local exact dependency versions in package-lock.json. Install once with `npm ci`; install the Playwright browsers once with `npx playwright install chromium firefox webkit`. Set `PORTAL_ORIGIN` only to test an already-running preview or production, and set `PAGE_PATH` and `CANONICAL_PATH` when invoking browser tests directly. No test sends a live enrolment request.

## What these checks establish

The reusable browser test checks HTTP 200, a useful title and production indexability, one H1, description/canonical/share metadata, JSON-LD parsing, image alternatives/dimensions and visible-image decoding, viewport overflow, common header/footer evidence links, the national telephone action, compact-menu operation/focus and automatically detectable serious/critical accessibility findings. Retained specialised tests still validate narrative stages, exact claims, source/schema/export agreement, all relevant lazy images, offers and delivery boundaries.

They do not establish clinical efficacy, external endorsement, ranking, AI citation, connected calls, appointments, visits or admissions. Independent editorial reviews and an actual visual inspection remain part of substantial page work.

## Type diagnostics and performance

`npm run check:types` checks source only; generated release/upload folders are excluded. The initial run checked 81 source files with zero errors and is included in the reusable page command.

The 1 October acceptance passed Chromium at 320, 390, 768 and 1440 pixels, plus installed Edge and WebKit emulation. Firefox downloaded successfully but its executable could not start on this Windows host (`spawn UNKNOWN`); Firefox is not claimed as passed. Its project remains available for a working host. The quality check found and corrected the OT closing guidance's white-text opacity; no serious/critical axe findings remained in the successful cases.

Lighthouse 13.5.0 is now pinned directly in this project; dependency audit has zero reported advisories. The trial LHCI wrapper was removed because its dependency tree introduced advisories. The speed runner uses an isolated Playwright browser; this Windows host can launch its headless shell, while the full Chromium executable returned `spawn UNKNOWN`. It never attaches to the owner's browser or profile.

### Targeted speed commands

```text
npm run check:speed -- occupational
npm run check:speed -- occupational --production
npm run check:speed -- enrolment --production
```

The local command expects a completed production build and serves it on an isolated loopback port 4341. `--origin http://127.0.0.1:4338` selects an existing preview. Each command makes one mobile and one desktop simulated lab run, saves HTML/JSON plus a compact summary in ignored `audits/lighthouse`, and closes only the browser/server it started. `--enforce` makes the documented lab targets fail the command; otherwise genuine findings are reported without turning network variability into a fictitious defect. Targets: performance at least90, LCP at most2500ms, TBT at most200ms and CLS at most0.1. TBT does not measure field INP.

Use this at a substantial page/layout/image/font boundary and after a relevant repair, not after every copy edit. GitHub Actions repeats the normal page check and Firefox/WebKit engine checks on Linux; a manual `speed` input also saves Lighthouse reports. Code/config/asset path filters avoid rebuilding for documentation and release-receipt-only commits. The final source `91fc6e7` passed Chromium, Firefox and WebKit on Linux in [Portal quality](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/36824875159). Installed Edge remains a local engine check. None of these establish physical iPhone/iPad/Android coverage.

## Verified Cloudflare use · 1 October 2026

The zone is Enterprise. HTTP/2, HTTP/3, Brotli, Early Hints, HTTPS enforcement, lossless Polish and Speed Brain are enabled. An existing automatic Web Analytics ruleset is enabled. Live HTML includes its beacon and Speculation-Rules header. These settings are not proof that each feature benefits every Worker response; notably Cloudflare documents that Speed Brain does not prefetch Worker routes. Do not enable Rocket Loader or indiscriminate HTML/API caching to achieve a feature count.

Cloudflare Observatory Mumbai tests completed for OT and enrolment: both 97 mobile / 100 desktop, mobile LCP 2425 / 2433 ms respectively, CLS 0 and TBT 0. Local Lighthouse live runs also returned 97 / 100. After the shared policy correction, OT's Lighthouse best-practices score rose from 92 to 100; final mobile/desktop accessibility and automated SEO scored 100, mobile LCP 2349 ms, desktop 583 ms, CLS 0 and TBT 0. The common header keeps the exact “Find a centre” accessible name at compact widths and avoids overriding the helpline's visible wording. These are dated synthetic results; future real-user LCP/INP/CLS remain separate. The existing auto-injected beacon now executes: actual same-origin performance requests returned 204 on both OT and enrolment with no console errors. No manual second beacon is added. Compiled preview policy remains strict; the retired public enrolment preview still 301s to its existing live canonical. Cloudflare Web Analytics records page/referrer/performance information and documents that query strings are not logged.

GSC Wizard's IndexNow configuration and the public key file are verified. Its CrUX history is not configured because it requires a separate Google CrUX API key. This optional report does not block page creation or the existing Cloudflare measurement path. Google AI Search uses ordinary crawl/index/snippet eligibility, helpful text, internal links and visible-content-matching schema; no special AI schema or extra text file guarantees inclusion. Existing reading/citation exports remain useful access aids.

Official references: [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/), [Cloudflare monitoring CSP/privacy](https://developers.cloudflare.com/web-analytics/faq/), [Speed Brain limits](https://developers.cloudflare.com/speed/optimization/content/speed-brain/), [Google AI features](https://developers.google.com/search/docs/appearance/ai-features).

## Next package and bounded acceptance

`ACTIVE-PAGE-WORK-ORDER.md` is the sole current priority and release pointer. Staff and remaining centre work are deferred until the individual-page pass is complete. When staff work resumes, register those routes in `scripts/page-quality-contracts.mjs` and add one focused source/behaviour suite for allow-listed public fields, unmatched-source fallback, no-JS completeness, filtering/reset/count, authentic portraits and profile compatibility. Reuse the current frozen estate and shared shell; no recrawl or new generic tool package is needed to begin. Main legacy retirement precedes Ask/Supabase and materials.

## Migration order

Complete and replace the main portal's legacy URL estate first. Preserve every valid URL through a reviewed equivalent page or appropriate redirect; use exact route disposition, source-backed page-family templates and per-page quality contracts rather than redirecting everything to a homepage. Preserve protected operational endpoints. Integrate Ask from the existing Supabase corpus only after the main legacy migration; materials.pinnacleblooms.org comes last.

The historical full estate inventory is reused and refreshed at migration boundaries; it is not recrawled for every page change. This technical guide does not set the next page or override the owner's current priority. Search demand informs later centre/service packages instead of derailing the active contract. The 2 October workflow audit is recorded in `reviews/WORKFLOW-AUDIT-20261002.md`; the governing execution rules are in `AGENTS.md`.
