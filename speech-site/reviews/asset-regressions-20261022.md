# Confirmed asset regressions — 22 October 2026

Base source: 22ff7a993a7717cc321de632d9dc779294584121. Prepared patch, not a deployment receipt.

## Call helper

Ahrefs cohort: 1,288 recorded referring pages. Exact missing URLs end in 1b357bec67c18321 and ce2939f4e8137e9f. Portal currently serves 7f1663ac50806f5c, while the separate legacy Worker embeds the two stale hashes in legacy-measurement.runtime.mjs and selected-reference-legacy-runtime.mjs.

This patch removes the three retired advertising overrides from the maintained call source, regenerates its content-addressed module and legacy measurement runtime, and registers only those three reviewed historical URLs as short-cached, one-hop 308 aliases to the full current executable module. Unknown hashes remain unmatched. No stub or blanket redirect is introduced.

The release owner must update the one embedded PUBLIC_AD_CALL_PATH in captured selected-reference-legacy-runtime.mjs (3,087,141 bytes; preimage SHA256 e6865c172dc472731d1054bca6d28b731cc098d212155922b7db90218463c8fe) while preserving the remaining bytes, and publish the generated call module to its actual portal owner. Preserve all other modules, routes, assets and bindings. Do not substitute an older Worker.

## Interventions

Current native R2 reads find no Assets/InterventionTechniquePdf/index/ objects in pbn-test (images.pinnacleblooms.org) or pbndang. The complete historical inventory and local source hold no original or approved equivalent. Do not invent replacement art.

Fresh desktop and AhrefsBot root responses already contain the catalogue correction with zero missing preview references; Android root retains exactly twenty generated index-preview image references. This patch removes only the complete ordered twenty-image pdf-viewer block on the existing root route. Desktop, genuine previews, individual resource routes, existing catalogue/navigation and contact remain unchanged.

## Validation and release boundary

`node scripts/build-public-ad-call.mjs`, `node scripts/build-legacy-measurement.mjs`, and `node --test scripts/test-asset-regressions.mjs`. Eight focused checks pass. A second private local run against the captured full desktop/mobile HTML also passed the exact-removal checks. No production calls, enquiries, vendor events, R2 writes or deployment from this patch owner.

Mac Web Build is the integration/release owner. Final acceptance: both old call URLs follow once to HTTP200 JavaScript; representative parents across ma/t/b/c/certified-courses reference the current module; current call behavior remains; Android root has zero index-preview references and keeps catalogue/contact; desktop and one existing individual resource stay unchanged. The 1,288 number is recorded impact, not a post-release clearance count.
