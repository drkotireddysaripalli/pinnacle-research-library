# V159 · complete, grouped mobile navigation

Owner request: check the mobile menu while preserving the accepted desktop menu.

## Changes

- Fixed More reopening at its previous bottom scroll position. Every fresh opening starts at the top with Therapies and Start here expanded.
- Added 34 missing desktop therapy-section destinations and 18 additional destinations from the existing shared navigation data. The compact directory now includes every internal destination in the desktop therapy menus and shared footer.
- Longer navigation groups expand individually. Each therapy has a separate page link and a labelled section disclosure; opening the disclosure keeps More open.
- Preserved the nine horizontally scrollable authority tiles, full subtitles, Search, Enrol and the accepted desktop appearance. No header counter row was restored.
- Corrected keyboard focus on closing, reopening and resizing between compact and desktop modes. Existing modal isolation and Escape remain.

## Validation and preservation

The production build and Astro type check passed. Local browser/accessibility acceptance passed at 320, 390, 768 and 1440 px. Additional menu inspection covered 844 × 390 landscape: no horizontal overflow, visible touch targets at least 44 px high, nested sections usable and reopening at scroll position zero. Desktop More link/heading coordinates, sizes and type sizes matched the live V158 menu exactly at 1440 px.

The staged union retains all 50 accepted main bodies, complete footer markup including its component scripts, 1,896 prior files and five Worker runtime modules. Only the shared header, its mobile styling, focused acceptance tests and release tooling change. Physical phones were not used.

Published 1 October 2026 at 17:38:02 IST: Worker `58f7fabb-cc45-4f15-a2bb-f9bda99885e6` at 100%, deployment `f137db56-b62d-42a5-9fd3-b4aaf24df3e7`. Union: `release-shared-shell-v159-20261001`; upload configuration: `.worker-upload-shared-shell-v159-20261001/wrangler.jsonc`. Rollback is V158 Worker `baca2d9f-4e65-48c2-ad80-499cc976e3d7`.

Source `571f30e68bfb719ed5138b4d0d5c5c76d06f6ae1` was committed and pushed before activation. [CI 36859515413](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/36859515413) passed the page quality workflow, including types, build, unit/page checks, four Chromium viewports, Firefox and WebKit.

The first read immediately after activation still served the exact V158 policy bytes; the next read served V159. The ensuing full live check passed: all 50 managed HTML files, two new assets, 15 protected representations and five cookie/credential delivery variants. The production 390 px menu capture confirms working nested therapy links and reopening at the top. Post-release route fingerprint remains `1a917340`: 180 zone routes, 81 Worker assignments and all four original bindings. No indexing resubmission was made for this navigation-only change.
