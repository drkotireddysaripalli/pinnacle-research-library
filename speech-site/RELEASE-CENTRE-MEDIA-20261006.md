# Suchitra I and Chanda Nagar media — 6 October 2026

Use the published first-party exterior to help families recognise the centre; show interiors later and offer the centre's own Pinnacle YouTube walkthrough. Preserve existing narrative, directions, common shell, telephone and centre-selected enquiry.

Suchitra uses its nameboard/building photograph above Mahesh Bank, responsive WebP sources, existing room gallery and the official Suchitra I video `zT2fIZWRn-c`. Its evidence JSON, plain text and Markdown include the matching tour. Chanda Nagar uses the published frontage and room photograph and its official video `rPl_kZm7LiE`. Its legacy autoplay banner and video preload are removed so the building appears first. The circular image crop is replaced with a complete building frame. Captions identify published photos/tours and invite confirmation of current premises/access.

Both players use an accessible native button and inert iframe template. YouTube loads after the button is chosen; a normal YouTube link also works without JavaScript. Keyboard focus moves to the player. No autoplay, new tracking or form submission is introduced.

Local acceptance: production build passed; 13 targeted centre/routing regressions passed, including idempotence, exact centre guards and removal of the original autoplay code. Chrome inspected at 390, 768 and 1440px, with no horizontal overflow. Both correct video IDs and focus transitions were observed. Suchitra's common header/footer were not edited; the Chanda legacy shell remains its existing shell. Local Chanda preview uses its production asset base.

Release boundary: only the Suchitra embedded asset module and two Chanda media modules are promoted into current Worker versions. Preserve all 221 routes, full 2,160-asset union, bindings and five unrelated Workers. Exact-revision CI, production read-back, bounded real-device testing and a same-configuration Lighthouse comparison follow. Operational receipts: `work/pinnacle-growth-system/centre-media-20261006/`.

## Deployed acceptance

Source `46f1ecb6cf38612c123581927d994ba775803835`, successful CI run 37434608888. Portal version `9f8dc808-0ee1-4ae1-9248-42b4df128c1f`; centre Worker `442036b0-ee71-47d4-9982-62002c11cb84`. All 221 routes/bindings preserved; 13 public checks passed. Both pages passed on physical Pixel 11 / Android 17, physical iPhone 13 / iOS 18.5 and hosted Firefox / Windows 11. The first requested iPhone 16 Pro session could not start because TestingBot's remote debugger did not connect; it is explicitly not a pass. One different-device run succeeded. All started sessions closed.

Screaming Frog's bounded two-URL crawl returned both 200, indexable, with one H1 and matching canonical. IndexNow accepted ten changed URLs across this and the shared metadata release, with key validation complete; indexing is not confirmed. A GSC release annotation was saved. Suchitra's production lab scores were mobile 96/100/100/100, desktop 100/100/100/100, CLS 0. Mobile LCP 2.587 seconds triggered the follow-up in `RELEASE-CENTRE-SPEED-MEDIA-20261006.md` rather than being labelled complete performance acceptance.
