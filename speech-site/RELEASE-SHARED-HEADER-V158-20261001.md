# V158 · simpler mobile authority menu and clear Search

Owner request: keep the mobile Enrol control, improve Search, and remove the redundant line counting the nine already-scrollable header links.

- Removed the header-only arrow/counter/Citations shortcut row. All nine original cards and full subtitles remain in the native horizontal scroller, with Citations as the final card and available through More.
- Mobile Search has a stronger 20 px magnifier, visible 11 px Search caption, a light Pinnacle background and 44 × 44 px target. The existing form, destination and keyboard dismissal remain.
- Enrol and the selected desktop appearance remain. Header height at 390 px is 277 px, down from 329 px.
- The footer and its 36-record controls remain unchanged. Astro relocates the identical shared controls script from the removed header instance to the remaining footer instance; the stage checks exact script collections and footer markup separately.
- All 50 main bodies, original assets and five Worker runtime modules are retained. Four local Chromium viewport/accessibility tests passed, including native horizontal scrolling to the last Citations card and Search opening/Escape. Local screenshots at 320, 390, 768 and 1440 px were inspected.

Candidate prepared; final CI and production read-back pending. Rollback: V157 Worker `cd8b3cbd-8e22-4a47-b8ae-9d7cdcae3df4`. Preserve 180 routes, 81 Worker assignments, fingerprint `1a917340` and four bindings. No indexing submission is needed for this navigation-only refinement.
