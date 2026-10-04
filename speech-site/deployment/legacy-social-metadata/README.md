# Shared legacy metadata and FAQ payload repairs — 4 October 2026

The discovery extension in `RELEASE-DISCOVERY-20261004.md` reconciles the existing `/physio-therapy` menu alias with `/physiotherapy` and the exact services hub's misplaced books-host identity. It adds two tightly admitted route families, preserving the original repairs below. Use its fresh-baseline release helper rather than rerunning a historical first-deployment script.

Current scope includes the initial metadata correction below and the separately verified fingerprinted FAQ debug removal in `RELEASE-PAYLOAD-20261004.md`. The page body now differs only by that exact nonfunctional script payload where its fingerprint matches; the original metadata-only receipt remains historical.

Action: `WEB-LEGACY-SOCIAL-METADATA` / `12008ab6-e97c-46fb-bc41-8a84860e1523`.

Ahrefs' completed main-site sample reported 9,996 og:url/canonical mismatches. Live English and Hindi FAQ pages and `/physiotherapy` confirmed HTTP social URLs against their existing HTTPS self-canonicals. They are ASP.NET origin pages, outside the Astro portal. Current zone routes/custom domains confirm no existing Worker owns these families. This release repairs the evidenced families through the established Cloudflare edge approach; it does not claim all 9,996 URLs fixed or modify unavailable origin templates.

## One shared correction, bounded routing

Worker: `pinnacle-legacy-social-metadata`. Two additive routes: `www.pinnacleblooms.org/faq*` and `www.pinnacleblooms.org/physiotherapy*`. Runtime admits only HTTPS GET on www `/faq`, `/faq/…`, `/physiotherapy` and `/physiotherapy/`; wildcard neighbours retain origin behavior. Existing 189 routes, application versions, bindings, assets, authentication and commerce remain intact. Neither Astro/common-shell source nor content is rebuilt.

Only a unique HTTP `og:url` whose HTTPS equivalent exactly equals the unique HTTPS same-host self-canonical is corrected. Canonical query/fragment, duplicate or conflicting metadata, noindex and unknown cases pass through. No canonical, titles, descriptions, images, claims, navigation or page body changes.

Inspect at most 64 KiB of head, parse with Cloudflare HTMLRewriter, then stream the original body. Preserve cookies, origin private caching and Vary. Authorization, Range, non-GET, non-200, non-HTML, non-UTF-8, Set-Cookie, no-store, no-transform and BOM-bearing responses bypass. Remove conditional origin validators on eligible GET; remove representation validators/length/encoding only after a real metadata change. No response cache or database is introduced.

The routes deliberately fail open to the existing origin if this metadata-only Worker is unavailable. Workers.dev and version previews are disabled. The Worker has no bindings and no credentials in source.

## Tests and deployment

`node --test scripts/test-legacy-social-metadata.mjs` runs the real Cloudflare runtime, including stream splitting, multilingual bytes, conflicting metadata, private response handling, unchanged neighbours/methods and byte-preservation. `LEGACY_SOCIAL_FIXTURE` can supply the captured public physiotherapy HTML for exact before/after comparison. The independent reviewer identified BOM handling; it is now covered by a pass-through regression.

Receipt folder: `work/pinnacle-growth-system/legacy-social-20261004` in the main workspace. `release.mjs prepare|deploy|verify <absolute-receipt-directory>` requires a captured live `baseline.json`, checks preserved routes/versions, and refuses activation until the exact source commit is origin/main. First deployment creates the isolated Worker and adds only the two routes. Never deploy it with a broad catch-all or replace another route. Follow-on deploys need fresh baseline/guard logic; do not rerun first-deployment mode blindly.

Rollback: delete only the two newly created route IDs in the deployment receipt. Origin serving resumes; existing Workers are unaffected. Keep the source and receipt for later integration into the actual legacy template or migration; remove this shim when its owned paths are migrated and superseded by more-specific routes.

Live verification compares all HTML after removing only Cloudflare's dynamic analytics script and sorting its font-face ordering, and permits only the intended social URL change. Protected portal/Ask/Verify/enrolment/helpline/books/SEVA/sitemap and invalid-route probes must retain their prior responses. A bounded Screaming Frog list checks public crawlability. No full recrawl, mass submission or ranking/lead claim is justified by this metadata repair alone.
