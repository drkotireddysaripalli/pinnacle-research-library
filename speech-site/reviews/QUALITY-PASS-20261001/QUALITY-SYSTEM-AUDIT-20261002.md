# Quality-system audit — 2 October 2026

## Finding

TestingBot is genuinely connected and has executed real physical-device tests. The process is not yet a complete, enforced visual/device/accessibility release system. The current automated checks have value; broad claims of all-device presentation or all-aspect completion would exceed their evidence.

## Highest-value gaps, in order

1. A single candidate-bound release manifest must join local browser, page-specific, visual, physical-device and production evidence. A required missing case cannot count as passed.
2. There are captures but no approved automatic visual comparisons for the entire common shell and important page sections. Add Playwright's existing screenshot-comparison facility; do not invent a new visual engine.
3. Physical phone smoke needs natural swipes, rotation, keyboard and sticky-bar checks, plus an iPad/tablet case. Current default scrolling/reachability checks are narrower.
4. Typography and artwork checks need actual loaded fonts, text enlargement/spacing, displayed-size legibility, crop and contrast across the intended viewports.
5. CI follows one active page contract. Shared changes need representative page-family browser tests and all-route static/delivery checks from one build.
6. Performance and accessibility findings need an explicit disposition. The saved mobile LCP is 2,651.648 ms against a 2,500 ms target despite a 96 performance score. This is an open lab-budget finding, not a field result.
7. Real family comprehension, screen-reader use and perceived colour on an actual display remain human evidence. AI reviewer roles and cloud screenshots cannot replace those observations.

## Current source audit

Inspected package scripts, Playwright configuration, browser/shared-shell assertions, owner-approved fixture, page checker/contract registry, speed checker, TestingBot runner and receipts, GitHub quality workflow, V162 responsive validator and production Lighthouse receipt. Reused existing device artifacts; no new cloud-device run was needed to discover these coverage gaps.

Two independent read-only reviews:

- `pinnacleai_v162_speed_review`: functional/CI/device coverage and performance enforcement.
- `pinnacle_narrative_outcome_review`: visual/typographic/image acceptance and actual family-task evidence.

These are AI editorial/engineering reviews. No human user study, clinician approval or accessibility certification is claimed.

## Changes made by this audit

- Created `PORTAL-QUALITY-TEST-PLAN.md` with a representative matrix, actual statuses, role ownership, visual and typography acceptance, physical-screen limits, change-based test scope, release criteria and ordered implementation backlog.
- Linked it from section 7 of the governing page-creation work order and from the TestingBot operating guide.
- Preserved approved common components, site source, public assets and deployed routing.

The plan is complete as a work order. Its outstanding implementation tasks are explicitly open. This documentation change requires no site build or deployment.
