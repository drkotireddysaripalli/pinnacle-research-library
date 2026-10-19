# ABA landing-page correction — live 19 October 2026

## Outcome

The canonical ABA Therapy page is live at:

`https://www.pinnacleblooms.org/best-aba-therapy-center-india-proven-improvement-rate`

The release corrects the damaged hero-poster presentation and makes the immediate parent decision clearer. The first screen now names ABA Therapy for children, connects it to communication, useful everyday skills and participation, states that support begins with individual needs, and provides call and first-conversation actions. It uses the approved complete ABA creative rather than the retired corrupt-black poster.

The existing common shell, long-form clinical boundaries, centre and enquiry journeys, consent/measurement runtime and unrelated public pages are retained. No synthetic call, enquiry or analytics event was sent.

## Source and deployment

- Pull request: `#127`
- Merge commit: `42edf357162e02f8fc886ea62645ab1a5ab0acd3`
- Worker version: `736ad674-af03-48ba-9e1d-4144411f47af`
- Worker deployment: `0961e24b-2591-4d5e-9fff-182d44ae90c4`
- Rollback version: `170bfb75-1cf9-4f6f-b070-aa519161f7bf`
- Changed runtime module: `aba-assets.mjs`
- Preserved runtime: 69 modules, 403 routes, all bindings and protected Workers
- Static assets: existing live asset binding retained; no bulk asset replacement

## Acceptance evidence

The deterministic `npm run verify:aba` gate passed:

- Astro/type validation and a 201-page build
- Canonical, sitemap, schema, unique page content and internal-link contracts
- 107 contextual inbound sources, including 61 verified centre-page sources
- No internal links to the redirecting ABA aliases
- Five focused unit contracts
- Responsive browser checks at 320, 390, 768, 1024 and 1440 pixels
- No serious or critical accessibility issue and no horizontal overflow
- Campaign-source continuity into the centre, enrolment and WhatsApp paths
- Mobile Lighthouse 99 performance, 100 accessibility, 100 best practices and 100 SEO; LCP 2.112 seconds, TBT 0 and CLS 0
- Desktop Lighthouse 100 in all four categories

CI run `39271665523` passed the full portal suite and five exact-build TestingBot journeys. Its tested commit `f74971ec90b6c60760d19df7a70980ace0a22350` and merge commit `42edf357162e02f8fc886ea62645ab1a5ab0acd3` resolve to the identical Git tree `2bb27767d5828ca3d3d9f0ceef6f6f3a1f4bc9ea`, so the successful result is reused only for byte-identical source, dependencies and configuration.

The uploaded candidate was first exercised at zero percent normal traffic with Cloudflare's version-override header on the production hostname. The page and approved poster matched their assembled hashes, and the prior one-version deployment was restored before promotion. The promoted version then produced three consecutive successful public responses and a separate read-only re-verification.

Public readback verifies:

- HTTP 200, one H1 and the self-canonical URL
- Organization, Service, BreadcrumbList and FAQPage structured data with 13 visible/schema FAQs
- The approved poster and four responsive derivatives return 200 and match their recorded hashes
- `/aba-therapy`, `/aba-therapy/`, `/t/aba-therapy`, `/t/aba-therapy/` and the canonical trailing-slash form redirect once to the canonical path while preserving the query string
- The canonical page remains present in the retained XML sitemap
- Speech Therapy, Occupational Therapy, National Autism Helpline and Verify control pages remain available
- Contained 390 px and 1440 px browser checks show the full creative, one H1, no overflow, working call/first-conversation/centre/enrolment paths and preserved campaign parameters
- The contained browser run blocked third-party telemetry and produced zero production events

## Evidence locations

- Release receipt: `deployment/aba-landing-live-20261019-mac.json`
- Local gate checkpoint: `ask-private/aba-landing-upgrade-20261019/release-candidate/checkpoint.json`
- Lighthouse summary: `ask-private/aba-landing-upgrade-20261019/release-candidate/lighthouse/summary.json`
- Live browser receipt: `ask-private/aba-landing-live-20261019-mac/browser-contained.json`
- Mobile visual: `ask-private/aba-landing-live-20261019-mac/public-390-hero.png`
- Desktop visual: `ask-private/aba-landing-live-20261019-mac/public-1440-hero.png`
- Candidate/public release logs: `ask-private/aba-landing-live-20261019-mac/`

This release removes preventable page-level presentation, relevance, internal-authority and journey defects within the work order. Search rank, Ads impression share, organic CTR and qualified enquiries are observed outcomes; they require later GSC, Ads and receiving-system evidence and are not inferred from deployment.
