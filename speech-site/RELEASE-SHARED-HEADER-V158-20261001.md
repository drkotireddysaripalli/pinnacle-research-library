# V158 · simpler mobile authority menu and clear Search

Owner request: keep the mobile Enrol control, improve Search, and remove the redundant line counting the nine already-scrollable header links.

- Removed the header-only arrow/counter/Citations shortcut row. All nine original cards and full subtitles remain in the native horizontal scroller, with Citations as the final card and available through More.
- Mobile Search has a stronger 20 px magnifier, visible 11 px Search caption, a light Pinnacle background and 44 × 44 px target. The existing form, destination and keyboard dismissal remain.
- Enrol and the selected desktop appearance remain. Header height at 390 px is 277 px, down from 329 px.
- The footer and its 36-record controls remain unchanged. Astro relocates the identical shared controls script from the removed header instance to the remaining footer instance; the stage checks exact script collections and footer markup separately.
- All 50 main bodies, original assets and five Worker runtime modules are retained. Four local Chromium viewport/accessibility tests passed, including native horizontal scrolling to the last Citations card and Search opening/Escape. Local screenshots at 320, 390, 768 and 1440 px were inspected.

Published 1 October 2026 at 17:26:18 IST: Worker `baca2d9f-4e65-48c2-ad80-499cc976e3d7` at 100%, deployment `9d101dc2-5dcc-4f9b-8595-ecb8661cbd7d`. Rollback: V157 Worker `cd8b3cbd-8e22-4a47-b8ae-9d7cdcae3df4`. All 180 routes, 81 Worker assignments, fingerprint `1a917340` and four bindings retained.

Source `9176258727b3234233fb46c8829ad760732853bf` was saved and pushed before activation. The initial mobile WebKit test used unsupported mouse-wheel input; test-only commit `b108403e88f5bb8c605684d9f49e7e6fe9c24918` checks native focus revealing the last link instead. Final [CI run 36858204357](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/36858204357) passed types, build, 116 unit tests, policy contracts, four Chromium sizes, Firefox and WebKit. Product files did not change after the initial successful local build.

Live read-back matched all 50 managed HTML files and the new CSS asset, with all main bodies, 15 protected representations and five cookie/credential delivery variants retained. The production phone capture confirms a 277 px header, no counter row and working Search. The footer content, component scripts, 36-record controls and desktop geometry remain. No indexing resubmission was made for this navigation-only refinement.
