# Approved common header and footer baseline

Owner instruction, 1 October 2026: record the current common files in Git as the baseline.

**Annotated Git tag:** `pinnacle-common-shell-baseline-v159-20261001`

This tag preserves the accepted desktop presentation and the V159 mobile-menu corrections. Its parent is the completed release record, commit `8dd53e85d37f01285821fb5c51f75b7d9fda4f1c`. The production implementation was committed as `571f30e68bfb719ed5138b4d0d5c5c76d06f6ae1` and is served by Worker `58f7fabb-cc45-4f15-a2bb-f9bda99885e6`.

## Common files

| Responsibility | Sources |
| --- | --- |
| Header and desktop/mobile navigation | `src/components/SiteHeader.astro`, `src/data/portal-navigation.json` |
| Complete footer, including Verify | `src/components/SiteFooter.astro`, `src/components/VerifyFooter.astro` |
| Footer groups, evidence cards and controls | `src/components/PortalFooterGroup.astro`, `src/components/VerifyCard.astro`, `src/components/ScrollRailControls.astro`, `src/components/Icon.astro` |
| Evidence content | `src/data/verify-cards.json`, `src/data/verify-register.json` |
| Common presentation | `src/styles/portal-shell.css`, `src/styles/readability.css`, `src/styles/shared-shell.css` |
| Shared assembly and supporting defaults | `src/layouts/PageLayout.astro`, `src/styles/page.css`, `src/data/site.ts` |
| Common footer analytics preferences | `public/pinnacle-pages-scripts/speech-measurement.js` |
| Official branding | `src/assets/pinnacle-blooms-network-lockup.png`, `src/assets/bhcl-emblem-official.png`, `src/assets/portal-footer-shapes.png` |
| Shared fonts | `public/pinnacle-pages-fonts/sintony-latin.woff2`, `public/pinnacle-pages-fonts/sintony-latin-bold.woff2` |
| Regression checks | `tests/fixtures/shared-authority-owner-approved.json`, `tests/browser/shared-shell-contract.mjs` |

The repository tag also preserves the referenced brand assets, fonts and other dependencies. It is a recovery point for the common presentation; it does not freeze individual page content or prevent authorised evidence updates.

## What must remain

- The approved desktop logo, nine authority tiles, exact subtitles, typography, colours, phone prominence and navigation arrangement.
- Mobile authority scrolling without the rejected extra 1–9 counter row; the clearer Search control and Enrol position.
- The complete mobile More directory, therapy subsection disclosures, initially expanded Therapies and Start here, reset on opening, and accessible closing/focus behaviour.
- The full footer: Verify and its 36 current evidence cards, citations, brand/operator identity, navigation, locations and community links. Verify is part of SiteFooter.
- One common implementation reused across all managed Astro pages. Individual pages must not create private header/footer copies.

## Change and recovery rules

1. Preserve this baseline during individual-page creation and improvement.
2. Make an owner-directed common change in the shared sources once; build and release it coherently across all managed pages.
3. Keep the existing owner-approved fixture and relevant mobile/desktop acceptance checks. Do not weaken a test merely to accept a changed design.
4. Compare against the tag before recovering a common file. Restore only the explicitly needed paths; do not reset unrelated page work or deploy an older whole-site snapshot.
5. Record any later approved replacement baseline with its own release evidence. Do not move or overwrite this tag.

## Validation status

V159 passed local viewport/accessibility checks, Chromium/Firefox/WebKit CI, production checks of all 50 managed pages and protected route checks. Complete main bodies, footer content, route assignments and bindings were retained. See `RELEASE-SHARED-MOBILE-MENU-V159-20261001.md` and its deployment receipts.

This baseline commit adds source comments and documentation only. It does not change rendering or runtime behaviour and requires no new production deployment.
