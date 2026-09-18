# Pinnacle Verification Site

Source-led verification centre for Pinnacle Blooms Network, a brand of Bharath Healthcare Laboratories Private Limited.

## Live page

- Public website: https://www.pinnacleblooms.org/verify/
- Sites origin: https://pinnacle-verify.saripalli.chatgpt.site/

The authorised public `/verify/` route is indexable. The page describes documentary evidence and its scope; it is not an issuer or regulator verification service. Search rankings, enhanced results and inclusion in AI answers are not guaranteed.

## Included

- `content/`: page template, source-linked statistics, international context, the complete supplied HFR inventory, review conclusions and terminology.
- `scripts/`: static content builders and semantic markup generated from visible page content.
- `dist/`: 42 HTML pages, 34 permanent evidence records, reviewed public document copies, centre and statistics registers, metadata, a sitemap, and readable JSON/text exports.
- `dist/evidence/section-index.json`: all 385 meaningful page blocks and their source links, including 206 blocks across 21 homepage sections.
- The company-described 17-domain, 79-ability, 349-skill framework; source-linked ICD-11, ICF, ICHI and SNOMED CT explanations; explicitly named parent/caregiver intended users; and the full BIS module-scope quotation. Seventeen visible FAQs match their structured data.
- Stable official PNG/ICO favicon assets, a browser manifest, visible h-card/h-entry microformats, direct FAQ links and answers JSON, and an HFR Dataset description linked to its public JSON/CSV exports.
- Three responsive Pinnacle World illustrations, the authentic emblem, image descriptions and image metadata. Original generation prompts are recorded in content/image-provenance.json.
- `assets/lucide/`: pinned SVG icons and licence information.
- `.openai/hosting.json`: Sites deployment configuration.

## Build and preview

Run `node scripts/build-content.cjs` from this directory, then serve `dist/` with a local static HTTP server. No installation step is required. Core content is rendered in HTML; JavaScript adds evidence filters, centre search and expandable direct links.

The published custom-domain route rewrites Sites-origin links to `/verify/`. The scoped `pinnacle-route-v10.mjs` Worker adds the verification sitemap to the existing root robots file, gives the main homepage the official favicon declaration, and redirects root llms.txt to the verification source index. Existing robots disallows remain intact. It serves correct asset MIME types and redirects known extensionless HTML aliases to their canonical URLs.

The favicon is the unchanged 50×50 emblem already served by the official Pinnacle website. The ICO wraps those same PNG pixels without redrawing or upscaling. Provenance is recorded in content/favicon-provenance.json. Font connections start in the document head rather than through a chained CSS import.

## Evidence and metadata

The brand and exact legal entity are connected through Organization and Brand data. Page sections use WebPageElement with working selectors, stable links and matching visible descriptions. Record summaries, breadcrumbs, questions and definitions retain their source-specific meaning. FAQ markup supplies semantics; Google retired FAQ rich results in May 2026. Text exports are reusable references, not a special Google ranking mechanism.

Report type, source date, counting unit, source-review status and clinical limitations remain part of each claim. HFR identifiers are a source inventory, not a claim that every listed facility is currently operational. UDIN particulars have not been independently matched in this review. Restricted practitioner reports are not republished.

Verification contact: Gokul Rao · care@pinnacleblooms.org · +91 9100 181 181.

Last content and semantic review: 18 September 2026.
