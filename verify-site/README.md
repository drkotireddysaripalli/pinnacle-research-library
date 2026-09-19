# Pinnacle Verification Site

Source-led verification centre for Pinnacle Blooms Network, a brand of Bharath Healthcare Laboratories Private Limited.

## Live page

- Public website: https://www.pinnacleblooms.org/verify/
- Sites origin: https://pinnacle-verify.saripalli.chatgpt.site/

The authorised public `/verify/` route is indexable. The page describes documentary evidence and its scope; it is not an issuer or regulator verification service. Search rankings, enhanced results and inclusion in AI answers are not guaranteed.

## Included

- `content/`: page template, source-linked statistics, international context, the complete supplied HFR inventory, review conclusions and terminology.
- `scripts/`: static content builders and semantic markup generated from visible page content.
- `dist/`: 65 HTML pages, 34 permanent evidence records, reviewed public document copies, centre and statistics registers, metadata, a sitemap, and readable JSON/text exports.
- `dist/evidence/section-index.json`: page blocks and their source links, derived from the current visible content.
- The company-described 17-domain, 79-ability, 349-skill framework; source-linked ICD-11, ICF, ICHI and SNOMED CT explanations; explicitly named parent/caregiver intended users; and the full BIS module-scope quotation. Seventeen visible FAQs match their structured data.
- Stable official PNG/ICO favicon assets, a browser manifest, visible h-card/h-entry microformats, direct FAQ links and answers JSON, and an HFR Dataset description linked to its public JSON/CSV exports.
- Three responsive Pinnacle World illustrations, the authentic emblem, image descriptions and image metadata. Original generation prompts are recorded in content/image-provenance.json.
- `assets/lucide/`: pinned SVG icons and licence information.
- `.openai/hosting.json`: Sites deployment configuration.

## Build and preview

Run `node scripts/build-content.cjs` from this directory, then serve `dist/` with a local static HTTP server. No installation step is required. Core content is rendered in HTML; JavaScript adds evidence filters, centre search and expandable direct links.

The published custom-domain route rewrites Sites-origin links to `/verify/`. The scoped `pinnacle-route-v11.mjs` Worker adds the verification sitemap to the existing root robots file, gives the main homepage the official favicon declaration, and redirects root llms.txt to the verification source index. Existing robots disallows remain intact. It serves correct asset MIME types and redirects known extensionless HTML aliases to their canonical URLs. Both apex and www verification routes lead directly to the secure www canonical address.

## Sharing and performance

Individual facts, evidence records, FAQs and HFR entries include WhatsApp, X, copy-link and supported device sharing. Messages retain claim scope and link to the specific record or anchored block. Visitors edit and send messages themselves. `dist/evidence/share-index.json` records the generated drafts and destinations. X drafts reserve 23 characters for the shortened URL.

Sharing bars span their containing content area and wrap within phone, tablet and desktop layouts. All 65 pages expose a lightweight 1200×630 JPEG brand preview with explicit Open Graph image type and dimensions. Critical metadata appears within the first 5 KB of HTML; server-rendered JSON-LD remains in the document body. The Google Search Console ownership tag is retained for the authorised verification URL-prefix property. Authored product mentions use PinnacleAI®.

CSS is bundled once and CSS/JavaScript filenames are content-fingerprinted for one-year immutable browser caching. The Worker caches only the generated public static inventory, using a release key that includes file hashes and Worker transformation logic. All public assets have a one-day edge TTL. The approved static build is deployed to Cloudflare Workers Static Assets, removing the private-origin round trip on cold requests; the Sites origin remains a fallback when no ASSETS binding is configured. Browser HTML/data TTL is one minute with revalidation; stable images/documents use one hour. Cache entries are local to each Cloudflare location. The `X-Pinnacle-Cache` header reports actual HIT/MISS/BYPASS; publication changes the release key. Errors, redirects and partial responses are not cached, and visitor cookies/authentication never reach the private static origin. Range requests are ignored for rewritten text and when If-Range cannot be satisfied by the weak public validator.

The favicon is the unchanged 50×50 emblem already served by the official Pinnacle website. The ICO wraps those same PNG pixels without redrawing or upscaling. Provenance is recorded in content/favicon-provenance.json. DM Sans and Manrope are self-hosted variable WOFF2 files with font-display: swap. Repeated icons use shared SVG symbols; metadata links to full exports without duplicating whole blocks. Search indexes the existing HTML instead of downloading duplicate record datasets.

## Evidence and metadata

The brand and exact legal entity are connected through Organization and Brand data. Page sections use WebPageElement with working selectors, stable links and matching visible descriptions. Record summaries, breadcrumbs, questions and definitions retain their source-specific meaning. FAQ markup supplies semantics; Google retired FAQ rich results in May 2026. Text exports are reusable references, not a special Google ranking mechanism.

Report type, source date, counting unit, source-review status and clinical limitations remain part of each claim. HFR records combine the original source inventory with 56 exact ID matches in the authenticated NHPR dashboard on 19 September 2026: 33 Approved, 14 Query Raised, 4 Submitted, 4 Rejected and 1 Query Resolved; one masked Draft is separate. These are workflow statuses, not a claim that every listed facility is currently operating. The dated check is in content/hfr-dashboard-checks.json. Both exact UDINs and document particulars were matched as Active in the live ICAI portal on 19 September 2026, after user-completed CAPTCHA and OTP verification. The dated record is in content/issuer-checks.json. Restricted practitioner reports are not republished.

Verification contact: Gokul Rao · care@pinnacleblooms.org · +91 9100 181 181.

Last content and semantic review: 19 September 2026.

## Confirmed review, scale story and contextual links

The owner confirmed Pinnacle Clinical Committee review on 19 September 2026. The editorial record identifies the reviewed published edition and source commit. `reviewedBy` is limited to the homepage's parent explanations and the nine parent-guide editions; original issuer documents are not represented as committee-authored or committee-validated studies. Organisational coverage confirmation is recorded separately from observed portal statuses.

The post-hero scale story derives from `content/scale-story.json`. It distinguishes the owner-stated 400 billion aggregate estimate, the handout's 900 million mission, report-backed 2.7 billion structured events / 31 million services / 7.9 lakh registrations, and owner-supplied assessment/library updates. The 10.4 million report figure is explicitly 1.3 million assessments multiplied by eight reports. The 400 billion formula has not been supplied or reproduced; it is not marked as independently assured. HTML, text exports, source links and sharing retain these distinctions.

The Worker adds one contextual evidence panel to eight allowlisted parent-site pages. The seven exact Ask source paths are delegated to the existing `pinnacle-ask` Worker via an HTTP service binding named `PINNACLE_ASK`. Keep that service binding, the `ASSETS` binding and inherited `SITES_BYPASS_TOKEN` when deploying. Narrow source-path routes take precedence over the unchanged broad `pinnacleblooms.org/ask*` route; suffix paths, non-GET methods and ineligible responses pass through without alteration. The separate `www.pinnacleblooms.org/abilityscore*` route fetches the existing website origin. Only the exact public HTML pages receive a panel; private/no-store/no-transform, cookie-setting, noindex, range and authenticated responses are excluded. Original canonical links, security headers and cache directives are preserved. No new cache storage or host redirects are added for these article pages.

Release checks: `node scripts/check-editorial-confirmation.cjs`, `node scripts/check-scale-story.cjs`, `node scripts/check-hfr-presentation.cjs`. Contextual-route fixture tests cover all eight pages, response preservation and 17 routing/transformation conditions; verify the actual live Worker after deployment.

## Research and reader controls

The scale-and-mission block shares `/evidence/scale-and-mission.html`, giving it a stable canonical page and dedicated 1200×630 Open Graph/Twitter image. `render-scale-share-card.cjs` typesets the exact brand header and figures over generated text-free artwork; provenance is retained in assets. The 400B aggregate estimate and 900M mission remain labelled on the image, page and AI-readable exports. Five visible questions match FAQ data; a reusable company-explanation citation is separate from the original report citations. All 66 canonical pages and their share images appear in the XML sitemap. The common footer provides 17 grouped reference links and one dated scale summary, with no additional image or JavaScript download.

The opening offers audience-specific reading paths, a six-step illustrative workflow and an eight-report explorer. The guide contains no child data, does not run an assessment, and retains source links. Report presentation version V-1.6.9.9 is explicitly separate from the SaMD software version. Native controls and keyboard navigation progressively enhance server-rendered content, with all views available without JavaScript and when printing. WhatsApp remains directly accessible; other sharing choices expand under More. Machine-readable guide exports match the visible explanation.

The homepage groups existing source content into sixteen native expandable topics, each with a distinct Lucide icon and direct link. Four-column desktop topic cards expand to the full reading width; tablets and phones use two columns, with one column on the narrowest screens. Jump navigation, open/close controls, direct-anchor expansion and print expansion remain available. Three lightweight visual pathways connect the child journey, developmental observations and evidence review. The research topic includes authentic book covers and links to seven distinct DOI works, a Research Square alternate version, three original book PDFs, the twelve-study company portfolio and matched author profiles. Eight authentic cover/first-page illustrations load responsively. Book, ScholarlyArticle, Report and Person descriptions match visible publication stages. JSON, text and RIS exports accompany the library.

Cloudflare review on 19 September found AI bot protections disabled and existing robots rules permitting verification content. No broad security bypass was added. The 65-page sitemap includes the research library. Availability to crawlers does not guarantee ranking or citation.


## Parent guides and clinical oversight

Nine source-linked parent guides cover AbilityScore®, everyday practice and licence scope in English, Telugu and Hindi, with reciprocal hreflang, self-canonical URLs, Article/FAQ metadata, local-language sharing and text/JSON exports. Anek Telugu and Noto Sans Devanagari are self-hosted OFL fonts pinned to Google Fonts commit f2bd09badbc763d8757951d52deec29da27e85fb with the width axis fixed at 100.

The sitemap includes a unique share image for each of the 65 pages. These are discovery aids, not ranking guarantees. Pinnacle Clinical Committee is the designated review body; completed review of exact wording is not claimed. Source inspection, issuer verification and clinical review remain separate records.

## Multilingual reading

Anek now covers Latin and nine Indian scripts, self-hosted as variable WOFF2 fonts with script-specific Unicode ranges. Only rendered scripts download. Unsupported scripts use device fallbacks. The language panel always builds Google translations from the public English source, supports direct English/Telugu/Hindi guide editions and top-level switching, and offers three locally stored reading sizes. No accessibility overlay is loaded. Font source/version/hashes are recorded in content/anek-font-provenance.json; OFL notices accompany each font.
