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

Release candidate: `release-shared-shell-v159-20261001`; upload configuration: `.worker-upload-shared-shell-v159-20261001/wrangler.jsonc`. Rollback is V158 Worker `baca2d9f-4e65-48c2-ad80-499cc976e3d7`. Source is committed and pushed before activation. Production publication and final browser-engine CI results will be recorded below after verification.
