# V157 · shared phone and tablet navigation correction

The owner requested a responsive correction after selecting the later Speech/Occupational Therapy desktop design. This release moves Enrol to the extreme right of the utility row and fixes phone/tablet access in the common components. It retains the desktop nine-tile wording, natural subtitle flow, brand sizing, colours and rich four-column footer.

## Concrete corrections

- At 901–1100 px, nine authority columns and the seven-part therapy row replace the accidental three-row tablet layout. The measured 1024 px header falls from 514 to 316 px without reducing its 12 px authority text.
- Phone controls have readable 11 px captions, 12 px authority text, a 16–18 px telephone number and larger helpline support text.
- The duplicated mobile Verify shortcut row is removed. The complete nine-card authority rail remains, with previous/next buttons, a position count and a direct Citations shortcut. The primary Verify card retains its full owner-supplied subtext.
- Tablet strip dropdowns no longer open inside a clipping scroll container. The persistent More control exposes the complete destination list.
- Compact More isolates background interaction and scrolling, wraps keyboard focus, supports Close/Escape, and restores focus to its actual opening control, including touch browsers that do not focus clicked buttons. Desktop hover and outside-click behaviour remain.
- All footer navigation groups are expanded on first load, including phones. Mobile groups can be collapsed individually; button names track Show/Hide state.
- Policies wrap within the page instead of a 190 px nested scroller. Narrow-screen brand marks wrap instead of being squeezed into one row.
- The mobile evidence rail keeps all 36 server-rendered cards and adds previous/next buttons plus a position count. The last record was reached using the buttons at 320 px.

## Candidate verification

- Ten Chrome viewport checks: 320×568, 390×844, 600×960, 768×1024, 820×1180, 844×390 landscape, 901×960, 1024×768, 1100×960 and 1440×960.
- No page overflow or browser exceptions; exact desktop typography fixture retained; initial footer visibility, branding bounds, arrow navigation, menu focus isolation/restoration and disclosure labels checked. Header, footer and landscape-menu screenshots were visually inspected.
- Local shared-page tests passed for four Chromium sizes and Microsoft Edge, including the combined accessibility audit. Production type/build checks passed. Linux Firefox/WebKit CI is a release gate.
- The full union retains all 50 accepted main bodies, 1,894 prior non-page files, all Verify assets and five unchanged Worker runtime modules. All 50 managed HTML files share the updated header/footer; only one new CSS asset is added.

## Deployment state

Published 1 October 2026 at 17:13:34 IST. Worker `cd8b3cbd-8e22-4a47-b8ae-9d7cdcae3df4` serves 100%, deployment `7f6ded20-8cef-424c-b90f-8daa7819bad6`. Rollback is `2bfae56e-90e7-44c2-833e-20cda9b573a0`. All 180 zone routes, 81 Worker assignments, route fingerprint `1a917340` and the four bindings were retained.

Final source `563c3f2c9fb467f4fa850dedda621c93b9060a8f` was committed and pushed before activation. [CI run 36856846546](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/36856846546) passed types, production build, 116 unit tests, policy contracts, four Chromium sizes, Firefox and WebKit. Local Edge checks also passed. The screenshot review caught an over-narrow evidence-card width in the initial candidate; that rule was removed, a spacing assertion added, and affected checks rerun. The superseded uploaded version was never activated, and its unused local CSS candidate was removed.

Live read-back matched all 50 staged HTML files and the new CSS asset. All 50 main bodies remained identical; 15 protected representations, five representative cookie/credential deliveries, retired-profile 410s and Books billing 301 were retained. Live Chrome checks at 390, 1024 and 1440 px passed. The deployed header/footer were visually inspected after publication. Evidence is in the `deployment/shared-shell-v157-*` receipts and actual browser screenshots under ignored `audits/`.

This changes shared presentation and interaction. Page narratives, enquiry APIs, original evidence, public identities, sitemaps and separate legacy routes are unchanged. Browser emulation is not physical iOS/Android device testing. No indexing resubmission is justified by this navigation-only correction.
