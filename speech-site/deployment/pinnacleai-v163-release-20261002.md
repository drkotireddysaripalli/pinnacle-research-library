# PinnacleAI V163 — lifecycle layout correction

## Defect and responsibility

The owner supplied a production screenshot showing the lifecycle cards below the hero compressed into narrow columns with letter-by-letter wrapping. The earlier browser suite counted the seven stages and checked page overflow, but never asserted this section's usable geometry. Section screenshots skipped the lifecycle cards. Those passes did not establish acceptable page rendering; the prior broad acceptance claim is withdrawn.

## Cause and bounded correction

The PinnacleAI overview reused `.life-stages`, also defined globally by `life-outcomes.css` for another page. The global style made the outer navigation a four-column grid, while the overview's nested list created seven more columns inside the first track. Inherited item padding and last-item spanning compounded it. `min-width:0` and emergency wrapping hid it from overflow checks.

Renamed this overview component's class and scoped rules to `overview-lifecycle`. Global styles and the approved shared header/footer are unchanged. The page's text, images, metadata and source exports are retained.

## Validation before activation

- New semantic-landmark geometry contract failed against the actual broken production page, reporting collapsed cards, incorrect widths and excessive text wrapping.
- Corrected production-mode build passed phone 320/390, tablet 768, desktop 1440, local WebKit and Edge tests, including fallback fonts.
- Focused page review at 320/390/768/1024/1440 verifies card geometry, seven mechanism chapters, ten matching FAQs, images, links and reading exports. Added explicit lifecycle and previously omitted section captures.
- The same geometry contract and a lifecycle-card screenshot now run in TestingBot; counting elements alone cannot pass this requirement.
- Candidate union retains 1,974 predecessor files byte-for-byte; only PinnacleAI HTML and one new CSS file have different delivered bytes. Five source/reading files are copied unchanged. Other 49 managed pages, common header/footer markup and all routing modules are retained.

## Deployment status

Candidate staged; source check-in, CI and production activation/read-back follow. This document will record the actual version and results after activation.

Rollback predecessor: Worker `6e08f069-1216-42e2-b9d9-3bfcb6f34c8e`. Preflight confirmed 180 zone routes, 81 main Worker assignments and ASSETS/PINNACLE_ASK/PINNACLE_LEGACY/SITES_BYPASS_TOKEN bindings.

Local captures: `audits/pinnacleai-v163/local/`. Original failing regression artifacts: `audits/pinnacleai-v163/before/`. Focused responsive receipt: `pinnacleai-v163-responsive-20261002.json`. Union receipt: `pinnacleai-v163-staged-20261002.json`.
