# Suchitra I and Chanda Nagar media — 6 October 2026

Use the published first-party exterior to help families recognise the centre; show interiors later and offer the centre's own Pinnacle YouTube walkthrough. Preserve existing narrative, directions, common shell, telephone and centre-selected enquiry.

Suchitra uses its nameboard/building photograph above Mahesh Bank, responsive WebP sources, existing room gallery and the official Suchitra I video `zT2fIZWRn-c`. Its evidence JSON, plain text and Markdown include the matching tour. Chanda Nagar uses the published frontage and room photograph and its official video `rPl_kZm7LiE`. Its legacy autoplay banner and video preload are removed so the building appears first. The circular image crop is replaced with a complete building frame. Captions identify published photos/tours and invite confirmation of current premises/access.

Both players use an accessible native button and inert iframe template. YouTube loads after the button is chosen; a normal YouTube link also works without JavaScript. Keyboard focus moves to the player. No autoplay, new tracking or form submission is introduced.

Local acceptance: production build passed; 13 targeted centre/routing regressions passed, including idempotence, exact centre guards and removal of the original autoplay code. Chrome inspected at 390, 768 and 1440px, with no horizontal overflow. Both correct video IDs and focus transitions were observed. Suchitra's common header/footer were not edited; the Chanda legacy shell remains its existing shell. Local Chanda preview uses its production asset base.

Release boundary: only the Suchitra embedded asset module and two Chanda media modules are promoted into current Worker versions. Preserve all 221 routes, full 2,160-asset union, bindings and five unrelated Workers. Exact-revision CI, production read-back, bounded real-device testing and a same-configuration Lighthouse comparison follow. Operational receipts: `work/pinnacle-growth-system/centre-media-20261006/`.
