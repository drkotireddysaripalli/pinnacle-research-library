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
- `dist/evidence/section-index.json`: all 368 meaningful page blocks and their source links, including 195 blocks across 21 homepage sections.
- Three responsive Pinnacle World illustrations, the authentic emblem, image descriptions and image metadata. Original generation prompts are recorded in content/image-provenance.json.
- `assets/lucide/`: pinned SVG icons and licence information.
- `.openai/hosting.json`: Sites deployment configuration.

## Build and preview

Run `node scripts/build-content.cjs` from this directory, then serve `dist/` with a local static HTTP server. No installation step is required. Core content is rendered in HTML; JavaScript adds evidence filters, centre search and expandable direct links.

The published custom-domain route rewrites Sites-origin links to `/verify/`. Root-domain crawler policy is served at `https://www.pinnacleblooms.org/robots.txt`.

## Evidence and metadata

The brand and exact legal entity are connected through Organization and Brand data. Page sections use WebPageElement with working selectors, stable links and matching visible descriptions. Record summaries, breadcrumbs, questions and definitions retain their source-specific meaning. FAQ markup supplies semantics; Google retired FAQ rich results in May 2026. Text exports are reusable references, not a special Google ranking mechanism.

Report type, source date, counting unit, source-review status and clinical limitations remain part of each claim. HFR identifiers are a source inventory, not a claim that every listed facility is currently operational. UDIN particulars have not been independently matched in this review. Restricted practitioner reports are not republished.

Verification contact: Gokul Rao · care@pinnacleblooms.org · +91 9100 181 181.

Last content and semantic review: 18 September 2026.
