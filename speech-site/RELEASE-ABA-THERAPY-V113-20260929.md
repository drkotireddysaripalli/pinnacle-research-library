# ABA Therapy release v113 — 29 September 2026

## Published destination

- Canonical: `https://www.pinnacleblooms.org/best-aba-therapy-center-india-proven-improvement-rate`
- Permanent aliases: `/aba-therapy`, `/t/aba-therapy` and trailing-slash variants
- Primary actions: call `9100 181 181`, choose a published Pinnacle centre, or continue to the established enrolment page

## What was released

- A complete ABA and behavioural-support page organised around communication, choice, routines, participation and the child's wider life.
- A clear parent narrative that starts with an everyday moment, considers communication, health, sensory and environmental context, and connects the chosen goal to Pinnacle's seven-stage life-first pathway.
- Distinct roles for behavioural support, Speech Therapy, Occupational Therapy, Special Education, family, school and relevant health professionals.
- A non-diagnostic explanation of PinnacleAI measurement and review, with direct links to the relevant Verify evidence records and their limitations.
- The common Pinnacle header, authority navigation, full centre directory, 36-record Verify gateway, complete portal footer and call/enrolment actions.
- Three service-specific visuals, descriptive alternative text and a branded 1200 × 630 Open Graph image.
- WebPage, Service, BreadcrumbList and FAQPage structured data that agrees with the visible content.
- Citation-ready JSON and text source maps, a first-party Markdown reading surface, sitemap and `llms.txt` discovery, and permanent consolidation of competing legacy ABA URLs.
- Consent-aware, service-specific action measurement that reports only approved placement and destination fields.

## Claim and dignity boundaries

- ABA is explained as one possible support within the child's whole developmental context, not as obedience, normalisation or suppression of harmless differences.
- The child's communication, comfort, preferences and assent, together with family and school knowledge, remain part of review.
- PinnacleAI GPT-OS v1.0.0 is described within its documented scope as non-diagnostic Class B developmental-support SaMD.
- Regulatory and quality records establish their documented scope; they are not presented as proof of therapy effectiveness or a guaranteed outcome.
- No cure, compliance, school entry, independence, mainstream inclusion, fixed intensity, universal centre availability, timeframe or staff credential is claimed.
- NICE, AAP, WHO and BACB references provide external context and do not imply endorsement of Pinnacle.

## Verification

- The production build passed, followed by 54/54 focused route, discovery, privacy, enrolment and measurement checks.
- Responsive review at 390, 768 and 1440 pixels found no horizontal overflow. The shared authority header, Verify gateway, complete footer, centre directory and fixed conversion actions remain available across the three layouts.
- The live canonical, Speech Therapy, Occupational Therapy, enrolment, Verify, the FSC record, the PinnacleAI regulatory journey, National Autism Helpline and payment route return HTTP 200.
- Five canonical and legacy trailing-slash variants return HTTP 301 to the canonical while preserving the checked campaign query parameter.
- The root sitemap exposes the managed child sitemap; the child sitemap and both `llms.txt` surfaces expose ABA Therapy.
- Compatible agents receive `text/markdown` with `Content-Signal: search=yes, ai-input=yes`; the Markdown includes the legal operator and national number.
- All seven managed HTML pages match the staged build after removing only Cloudflare's injected Web Analytics beacon.
- The public social image returns HTTP 200 as a 1200 × 630 JPEG.

## Deployment and discovery

- Cloudflare Worker: `pinnacle-verify-route`
- Version: `f7bc9cc8-874d-400d-9268-54de72013ede`
- Deployment: `178f79d5-dec8-4934-9b8f-aa6e352bedc8` at 100%
- Pre-ABA rollback version: `e2bdc8ce-bb5b-4df4-b515-03273f9c70e1`
- Worker source SHA-256: `d8bfc0ad229f8a47c160c8aa19464f2373a8e146a78d2d4d25a804e450190424`
- The canonical and legacy ABA routes point to the managed Worker. An exact dynamic redirect prevents the legacy origin rule from dropping campaign query parameters.
- The canonical, root and child sitemaps, and root and child `llms.txt` URLs were notified once through IndexNow; the endpoint returned HTTP 200.
- The currently signed-in Google account exposed the `/verify/` URL-prefix property, which does not cover the ABA canonical. No direct URL Inspection request was made from an ineligible property. Sitemap discovery remains available.

Publication, responsive rendering, technical retrieval and IndexNow acceptance are verified. Discovery, indexing, ranking, referral traffic, AI citation, calls, walk-ins and enrolment remain outcomes to measure separately.
