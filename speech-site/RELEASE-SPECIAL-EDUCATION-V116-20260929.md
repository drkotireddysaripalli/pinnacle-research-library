# Special Education release v116 — 29 September 2026

## Published destination

- Canonical: `https://www.pinnacleblooms.org/best-special-education-center-call-9100181181`
- Consolidated aliases: `/special-education`, `/Special-Education`, `/t/special-education` and trailing-slash variants
- Primary actions: call `9100 181 181`, choose a published Pinnacle centre, or continue to the established enrolment page

## What was released

- A complete parent-facing Special Education page organised around learning access, communication, participation and the child's wider life.
- A direct plain-language answer, recognisable concern patterns, a child-specific assessment lens, the seven-stage Pinnacle life-first pathway and a concrete teaching-to-everyday-life example.
- Distinct roles for special education, Speech Therapy, Occupational Therapy, ABA/behavioural support, family, school and relevant health professionals.
- PinnacleAI's non-diagnostic measurement and review role within its exact documented MD-5 and BIS scope, linked to Verify rather than presented as outcome proof.
- The common Pinnacle header, authority navigation, complete centre directory, 36-record Verify gateway, portal footer and call/enrolment actions on desktop and mobile.
- Two original service visuals, descriptive alt text and a branded 1200 × 630 Open Graph image.
- WebSite, Organization, Brand, WebPage, ImageObject, Service, FAQPage and BreadcrumbList structured data matching the visible page.
- Citation-ready JSON/text source maps, a first-party Markdown reading surface, sitemap and `llms.txt` discovery, and permanent consolidation of competing Special Education URLs.

## Evidence and claim boundaries

- Special Education is presented as child-specific educational support that may adapt teaching, communication, materials, activity, pace or environment according to assessment.
- PinnacleAI GPT-OS v1.0.0 remains non-diagnostic Class B developmental-support SaMD. The software scope does not certify a special educator or prove an individual educational outcome.
- Regulatory and quality records establish only their documented scope. No cure, school admission, guaranteed mainstream placement, independence, universal service availability, fixed timeframe or individual result is claimed.
- UNESCO, UNICEF, RCI and other external references provide context and do not endorse Pinnacle.

## Verification

- Production build and the focused route, discovery, enrolment, privacy and measurement checks passed.
- Responsive review at 390, 768 and 1440 pixels found no horizontal overflow and retained the common header, Verify gateway, portal footer, centre directory and call action.
- W3C Nu returned zero errors for the live canonical.
- The live canonical and seven protected pages returned HTTP 200. The managed page bytes match the staged build after normalising only Cloudflare's injected analytics beacon.
- Compatible agents receive valid `text/markdown` with `Vary: Accept` and `Content-Signal: search=yes, ai-input=yes`; an explicit Markdown quality of zero receives HTML.
- Evidence JSON/text, root and child discovery surfaces and the public 1200 × 630 JPEG were retrieved successfully.

## Deployment and discovery

- Cloudflare Worker: `pinnacle-verify-route`
- Version: `2a9ef5ca-6ada-4fdb-a246-7c3ca16461ce`
- Deployment: `e1267f7d-a69f-4af7-a50f-01116093ae46` at 100%
- Immediate rollback version: `aace1602-7860-4bf9-853e-e5c57000e044`
- Pre-Special-Education version: `1191544d-b51f-4a1d-81f5-77f7881b4ec0`
- Worker source SHA-256: `c78f7c83dd88cddaf68224e14f18ef272388782d2ed360132aa4a0cc4add3be3`
- The canonical, root and child sitemaps, and root and child `llms.txt` URLs were notified once through IndexNow; the endpoint returned HTTP 200.

One inherited zone-level redirect owns the exact no-slash `/special-education` alias and drops its query string before the Worker runs. It still reaches the correct canonical. All other tested variants preserve the query. The canonical, discovery, content and conversion paths are unaffected; the inherited rule requires Cloudflare Rulesets write access to change.

Publication, responsive rendering, HTML validity, technical retrieval and IndexNow acceptance are verified. Discovery, indexing, ranking, referral traffic, AI citation, calls, walk-ins and enrolment remain separate outcomes to measure.
