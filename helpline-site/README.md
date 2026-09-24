Current release: 24 September 2026 design correction, Worker v8. See DESIGN-RELEASE-20260924.md. Code/build/deployment remains owned by the Verify task; historical instructions and checks below retain their dates.

# Pinnacle national autism helpline — isolated Cloudflare page

The direct-answer FAQ update (version 6) is deployed and verified as of 23 September 2026. It retains the verified availability facts, factual search metadata and nearby-centre navigation, and makes the helpline number explicit in the first FAQ. Desktop and mobile review is complete; no local preview server remains running.

- Worker: pinnacle-helpline, ID 6fe0915748f44e15b05bf54d47c13099. Do not create a duplicate.
- Canonical page: https://www.pinnacleblooms.org/national-autism-helpline
- Single-page sitemap: https://www.pinnacleblooms.org/national-autism-helpline/sitemap.xml. The HTML response links it in the HTTP Link header.
- Existing narrow route: www.pinnacleblooms.org/national-autism-helpline*, ID 014c4eb47fcc422b80c254fd93f96670.
- The module serves the exact page, trailing-slash redirect, sitemap and nine explicitly bundled image paths. Other paths and hosts return404. Recognised routes accept only GET and HEAD.
- Keep workers.dev disabled. This isolated Worker does not fetch or rewrite the ASP.NET origin, shared Verify Worker, homepage, global robots file or clinical systems. Homepage/footer and robots integration is already live through the separately owned shared Worker.

## Current deployment

- Version: ed7d5f88-d0da-4e3a-825d-7be303baaf17
- Deployment: e819f197-3a89-4a88-bae5-741266469589,100% traffic.
- Entry module: worker.mjs, a single self-contained module with no imports, secrets, bindings or external runtime dependencies.
- Worker SHA-256:131cbe0eebe8223be660e9f3b310d08c395f5c363d52b1c83dbd9476a0389a08
- Worker size: **1,157,820 bytes**.
- Delivered HTML: **308,095 bytes**; SHA-256 a244ccd6841e659c14068c87f0f34a408bf22518c245a2af8f7ff3bf348e714c.
- Scope: replace only the first visible FAQ question/answer and matching FAQ JSON-LD with the exact number, operator, confirmed hours/languages and service-enquiry scope. The other four FAQs, metadata, nearby-centre navigation, artwork, design, six call targets, handler and security policy structure are unchanged. The build updates the JSON-LD CSP hash and ETag consistently.
- Root verified production GET/HEAD 200, exact bytes/hash and answer presence. All 18 local tests, six preservation checks, desktop and 390×844 mobile review passed. Evidence: ../helpline-direct-answer-20260923/deployment.json, preservation-checks.json and visual-checks.json.
- Previous version 120b4a1d-7b6e-4894-a91c-d0c477b00d8d is retained for rollback. It added the factual 153-character search description and seven-centre navigation; its historical deployment evidence remains ../acquisition-20260923/helpline-deployment.json.
- Earlier 22 September availability checks and public ETag observations are historical evidence in ../helpline-availability/, not new version 6 checks.

Historical version 3 (c1ae2b53-abae-4b42-b29c-a9570749332d; deployment df295e34-9f6a-4bed-925b-ba36d39acc32) added the fees FAQ. Its four production checks passed at 2026-09-22 12:48:29 UTC and its live FAQ expansion was browser-verified. Evidence: ../helpline-fees-faq/live-checks.json. These are earlier-version results, not fresh version 4 checks. Its source backup is ../helpline-fees-faq-backup/.

## Source and generated files

- page.html: editable page source, including responsive design, service cards, seven-stage pathway, call links, Telugu section and FAQ.
- assets/: nine existing branded artwork files copied unchanged. No new illustration or logo was generated for this redesign.
- handler-source.mjs: exact routing, canonical redirects, static image delivery, security/cache headers, HEAD, ETag and sitemap handling.
- build.mjs: embeds HTML, the Anek Telugu font and license, factual Organization/ContactPoint and visible FAQ schema, and an explicit base64 image manifest into the deployable module.
- worker.mjs, preview.html and schema.json: generated outputs. Rebuild after source, font or asset changes.
- readiness-tests.mjs and readiness-results.json: **18 passing local checks, zero skipped**, run for version 6 at 2026-09-23 09:42:00 UTC; desktop/mobile review also passed.
- preview-server.mjs: optional loopback-only preview server that maps local requests to the production host internally without weakening production host checks. It is stopped.
- anek-telugu-subset.woff2: **the full Anek Telugu font**, now kept under this legacy filename. Do not assume it is a character subset or run subset-font.py merely because of its name.
- anek-telugu-OFL.txt: redistribution license, embedded in delivered HTML. Fonts are embedded data; no external font request is needed.
- ../helpline-page-v1-backup/: retained original source and generated outputs for reference and rollback preparation.

## Explicit image assets

All images use the same-origin prefix /national-autism-helpline/assets/. The nine files total **631,722 bytes**:

- care-participation.webp, care-participation-1000.webp, care-participation-600.webp
- family-journey.webp, family-journey-1000.webp, family-journey-600.webp
- parent-review.webp, parent-review-600.webp
- logo.webp

The build accepts top-level URL-safe filenames with .png, .jpg, .webp or .svg extensions. It excludes folders, symlinks and other file types and does not fetch arbitrary URLs. An absent assets directory is supported for development, but real image delivery checks must pass before publishing a page that references images.

Each asset has its own MIME type, byte length and content-derived ETag. GET returns exact bytes; HEAD returns matching headers without a body; conditional requests support304. Images use public, max-age=300 because filenames can change content across releases. They are not marked immutable. Unknown assets return no-store404/noindex. Page CSP permits only same-origin images, embedded font data, inline styles and the hash-authorised JSON-LD block; it adds no executable page script or third-party tracker.

## Build and checks

From this directory:

    node build.mjs
    node readiness-tests.mjs

The build reports HTML bytes, Worker bytes, compressed Worker bytes, font size, asset count and total image bytes. Embedded images increase deployment size; inspect that report before upload. The optional node preview-server.mjs command is for a fresh local review and should be stopped afterward.

The 18 local checks cover page and asset GET/HEAD, canonical redirects, exact route/host boundaries, method restrictions, ETags, query non-reflection, the single-URL sitemap, CSP, exact asset bytes and headers, unknown asset404s, international telephone targets, no forms/trackers/executable page scripts, five service cards, seven lifecycle stages and schema matching the visible FAQ.

**Historical version 2: fourteen production checks passed** at 2026-09-22 12:22:20 UTC: delivered HTML matched reviewed source, all nine artwork files returned successfully with expected bytes, page HEAD worked, the sitemap returned200, the trailing-slash route redirected301 and an unknown image returned404. Evidence: ../helpline-redesign/live-checks.json. Desktop and mobile browser review passed for that redesign in addition to the automated checks; automated tests alone are not a visual accessibility audit. These checks were not rerun for version 4 because assets and routes were unchanged.

## Content and search scope

The redesign uses Pinnacle's luminous white, navy, teal and red visual language with existing branded family/care artwork, responsive service cards, the seven-stage developmental pathway, visible phone actions and an Anek Telugu section. Displayed phone: **9100 181 181**; call target: tel:+919100181181.

The five existing service destinations and centre directory remain available. The user confirmed on 22 September 2026 that the helpline is staffed 24/7 and supports English, Telugu and Hindi; provenance and scope are in ../HELPLINE-FACTS.md. This applies to the telephone parent-guidance and appointment-enquiry service, not centre hours, clinician availability or clinical diagnosis. Outside-provider referral remains unconfirmed and is not claimed. No free offer, new credential, guaranteed response time or clinical outcome claim was added. The team confirms centre service availability and assessment arrangements. MyOperator and PinnacleAI remain unchanged.

The Telugu section received an everyday-language wording pass; no independent human review is claimed. One canonical page is used, without artificial language URLs or hreflang claims. The full font supports subsequent Telugu wording changes without the prior subset limitation.

Google now confirms this URL is indexed with the inspected URL selected as canonical. Its recorded crawl at22September17:01:04 predates the redesign and fees update. Do not claim fresh content recrawl, rankings or call growth. Do not repeat unchanged submissions solely because page copy changed.

## Rollback

For the current direct-answer FAQ rollback, redeploy retained version **120b4a1d-7b6e-4894-a91c-d0c477b00d8d**. This preserves the prior search description and nearby-centre navigation. The exact prior source/module are backed up in ../helpline-direct-answer-20260923/before/. Keep the route, hostname and canonical unchanged.

For an availability-update rollback, redeploy retained version 3 **c1ae2b53-abae-4b42-b29c-a9570749332d**, preserving the branded redesign and fees FAQ. Its source, build and generated module were backed up in ../helpline-availability-backup/. For an earlier fees-update rollback, version 2 **5cd90328-ff23-4521-bfc2-e209c5d66d5d** remains available; version 1 **0885f02f-68df-4eeb-81b2-e425fd8b7a0e** is the full redesign rollback. Keep the route, hostname and canonical URL. **Do not delete the route** or alter the shared Verify Worker. Earlier source backups remain in ../helpline-fees-faq-backup/ and ../helpline-page-v1-backup/.
