# Pinnacle reusable quality toolchain

1 October 2026. This implements the local toolkit adoption plan while preserving the governing Pinnacle page creation work order.

## Fast page loop

1. Read the compact current context, governing work order and the active page contract. Keep one page package active.
2. Reuse the common header, complete menu, footer and Verify proof components. Write the page-specific Pinnacle narrative and generate the approved complete branded creatives.
3. Finish the page and its source, share, machine and conversion package before running acceptance.
4. Run `npm run check:page -- occupational` (or speech, enrolment, aba, autism). This performs source typing, one production build, the six focused unit suites and phone/tablet/desktop smoke plus axe checks. Playwright manages an isolated loopback test preview, leaving the owner's Astro preview running. Run the established specialised page/source contract when its content changes.
5. Repair actual findings and repeat only failed/changed checks, using `test:unit` or `test:browser` directly instead of rebuilding unchanged work.
6. Use `npm run test:engines` for Firefox/WebKit/installed Edge when shared layout or interaction changes warrant it. These are engine/emulation tests, not proof of physical iPhone testing.
7. Commit/push source, stage the complete union, verify protected routing/accepted bodies, deploy through the established Cloudflare route and read back production once. Explicit release and rollback identifiers are mandatory.

Supported commands use project-local exact dependency versions in package-lock.json. Install once with `npm ci`; install the Playwright browsers once with `npx playwright install chromium firefox webkit`. Set `PORTAL_ORIGIN` only to test an already-running preview or production, and set `PAGE_PATH` and `CANONICAL_PATH` when invoking browser tests directly. No test sends a live enrolment request.

## What these checks establish

The reusable browser test checks one H1, description/canonical/share metadata, JSON-LD parsing, image alternatives/dimensions, viewport overflow, common header/footer evidence links, the national telephone action, compact-menu operation/focus and automatically detectable serious/critical accessibility findings. Retained specialised tests still validate narrative stages, exact claims, source/schema/export agreement, images, offers and delivery boundaries.

They do not establish clinical efficacy, external endorsement, ranking, AI citation, connected calls, appointments, visits or admissions. Independent editorial reviews and an actual visual inspection remain part of substantial page work.

## Type diagnostics and performance

`npm run check:types` checks source only; generated release/upload folders are excluded. The initial run checked 81 source files with zero errors and is included in the reusable page command.

The 1 October acceptance passed Chromium at 320, 390, 768 and 1440 pixels, plus installed Edge and WebKit emulation. Firefox downloaded successfully but its executable could not start on this Windows host (`spawn UNKNOWN`); Firefox is not claimed as passed. Its project remains available for a working host. The quality check found and corrected the OT closing guidance's white-text opacity; no serious/critical axe findings remained in the successful cases.

Lighthouse remains a targeted lab check for changed fonts/layout/assets, with existing local report tooling. The trial LHCI dependency introduced high-severity transitive advisories and was removed. No public report upload or new paid service was enabled. Field Core Web Vitals and the commercial outcomes remain separately observed.

## Migration order

Complete and replace the main portal's legacy URL estate first. Preserve every valid URL through a reviewed equivalent page or appropriate redirect; use exact route disposition, source-backed page-family templates and per-page quality contracts rather than redirecting everything to a homepage. Preserve protected operational endpoints. Integrate Ask from the existing Supabase corpus only after the main legacy migration; materials.pinnacleblooms.org comes last.

The historical full estate inventory is reused and refreshed at migration boundaries; it is not recrawled for every page change. The currently accepted staff directory plus representative profile package stays first in the active creation queue. Search demand informs the next centre/service package instead of derailing the active contract.
