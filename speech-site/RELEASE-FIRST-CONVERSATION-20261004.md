# First Conversation — original free family resource

## Purpose and scope

Publish the original one-page English planning sheet supplied by the owner-authorised commerce workstream. Help a family collect observations and questions before speaking with a professional or enquiring about an appointment. Lead to the existing Pinnacle-operated helpline on **9100 181 181**. This is a planning aid, without diagnostic, screening, clinical-review or outcome claims.

- Canonical: `https://www.pinnacleblooms.org/books/resources/first-conversation`
- Original PDF: `https://www.pinnacleblooms.org/books/resources/Pinnacle-First-Conversation-v1.pdf`
- PDF: 4,165 bytes; SHA-256 `7e9f848f90d166684444184c9c537a6122eb9843a017e8bd6cd1dfc134bec5a1`.
- Companion: recognition → download → four practical preparation steps → privacy → call/service scope → ownership, citation and sharing.
- Exact original PDF is unchanged. The document preview is a faithful render of that PDF, not a new campaign illustration. Social metadata uses a 1200 × 630 contained document preview.
- Shared header/footer/Verify/footer presentation remains in the established common components. No redesign.

## Delivery and preservation

The Astro page is the source. `build-first-conversation.mjs` derives a small additive Worker bundle from that build, with its required hashed dependencies. `prepare-worker-upload.mjs` includes this bundle in subsequent complete builds. It allows this release to retain the exact current asset binding, whose contents include newer files absent from older local union snapshots.

The handler serves only the exact new public resource paths, aliases and dependencies. Everything else continues through the existing Worker. `/books` receives one contextual resource link in its existing help section; future full builds include the same common link markup. Root sitemap and reading aid include the resource. Paid catalogue, prices, stock and download entitlements are unchanged.

The current live baseline is `e53a1016-15ab-462b-b005-b996261db856`. Preserve 185 routes, four bindings and the separately deployed centre/Ask/auth workers. The existing saved Bookshop reading-aid line was absent from live discovery code; this release preserves the live baseline rather than incidentally deploying that old difference.

## Measurement and validation

The page reuses the consent-aware measurement source through a resource-specific versioned URL. `resource_download_click` carries the fixed `first_conversation_v1` identity, PDF format and English language only. Download clicks and phone taps are separate from actual downloads, connected calls and qualified enquiries. No form, sign-in gate, completed notes, child details or diagnosis is collected by this page.

Production build: 134 pages. Focused routing, original-byte, cookie/cache, discovery, existing collection-link and measurement checks passed. Local Chromium checks covered 320, 390, 768 and 1440 pixels; desktop/phone hero and tablet steps were visually inspected. Source review found no blocking defects. Physical-device testing was not performed for this small resource page.

Activation, Git, public byte readback and discovery receipts are recorded separately after deployment. Source/compiled page readiness alone is not a publication, index or business-result claim.
