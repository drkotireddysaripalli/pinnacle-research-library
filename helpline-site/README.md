# Pinnacle National Autism Helpline

Current release: 25 September 2026, Worker version 11. Measurement repair, privacy choices, tests and deployment: [MEASUREMENT-RELEASE-20260925.md](MEASUREMENT-RELEASE-20260925.md). The underlying narrative/source release remains documented in [RETRIEVAL-RELEASE-20260924.md](RETRIEVAL-RELEASE-20260924.md).

## Live service

- Canonical page: https://www.pinnacleblooms.org/national-autism-helpline
- Number: **9100 181 181**, `tel:+919100181181`.
- Free guidance for anyone, 24 hours a day, seven days a week. Telephone languages: English, Telugu and Hindi.
- Operator: Pinnacle Blooms Network; legal operator: Bharath Healthcare Laboratories Private Limited.
- Free guidance/access/24-hour availability confirmed by the owner on 24 September 2026; languages confirmed on 22 September. Free guidance does not establish a telecom toll-free number or free assessments/therapy.
- Three independently operated family resources are listed separately with official source links. Their numbers are not Pinnacle contact points.

## Source and build

- `page.html`: responsive design and page copy; generated FAQ/resource placeholders.
- `build.mjs`: shared FAQ and structured data, source-linked resource cards, service exports, HTML/asset packaging, ETag and JSON-LD CSP hash.
- `service-facts.json`: owner-confirmed service facts; questions/resources are synchronized by the builder.
- `resources.json`: separately operated helplines, their numbers, scope and official sources.
- `handler-source.mjs`: route, asset, canonical, sitemap, method and security handling. Do not restore the old hardcoded SERVICE_EXPORTS copy here.
- `phone-analytics.js`: voluntary Google Analytics consent and fixed, privacy-conscious call-placement events through the existing evidence stream; no call interception.
- `phone-analytics-tests.mjs`: consent, privacy, one-event-per-activation and collection-failure regression checks.
- `worker.mjs`, `preview.html`, `schema.json`: generated release outputs.
- `assets/`: nine existing branded WebP images, one dedicated JPEG share card and the unchanged full Telugu font.
- `share-card.svg` and `render-share-card.cjs`: editable native share-card layout; render with the installed Sharp package available to Node.js.
- `anek-telugu-subset.woff2`: the full Anek Telugu font under its historical filename. Preserve it and its OFL license; do not resubset it by accident.

Build from this directory:

```text
node build.mjs
node readiness-tests.mjs
node phone-analytics-tests.mjs
node preview-server.mjs
```

The preview binds only to 127.0.0.1:8787. Stop it after visual review. After production deployment run `node verify-live.mjs` from this directory.

The current release passed 23 route/content checks, 10 analytics checks, a 390 × 844 mobile review, exact production checks and accepted browser telemetry with GA Realtime read-back. The preceding narrative release additionally had four responsive viewport and 28 destination checks. These verify delivery, not search growth or real call outcomes.

## Deployment ownership and persistence

Code, build and deployment remain owned by the existing Verify task. This repository preserves the exact source. No new task or external team has been given build ownership.

- Existing Worker: `pinnacle-helpline`.
- Existing route: `www.pinnacleblooms.org/national-autism-helpline*`.
- Version: `ac7d9543-824b-4e1f-8cb0-b6ebaa8b9b45` (11).
- Deployment: `c14a7cbe-e46e-4564-bad4-80c4eeab6b48`, 100%.
- Compatibility date: 2026-09-23; bindings: none.
- Entry module: worker.mjs, self-contained, with ten images and the full font served as separate cacheable assets.
- Rollback: retained version 10 `23d7f82d-007a-4f83-8fc6-32188439a52a`.

Use the existing Cloudflare Worker/route. Do not create a duplicate or remove the route. Keep workers.dev disabled. This Worker serves only the helpline page, its exports, sitemap and bundled assets; it does not rewrite the ASP.NET origin. An origin-only redeployment does not replace this Worker. A future Cloudflare deployment must preserve this route and include these changes.

The coordinated Verify version 72 adds a helpline link to its 84 shared page footers and reading indexes. Its FSC/story, clinical content and existing routing logic are otherwise unchanged.

## Search and evidence

- One canonical page; same number/operator in visible text, Service/ContactPoint/Organization/Brand graph and 12 FAQs.
- Matching title/description/share metadata, dedicated share image, facts.json, facts.txt, llms.txt, dated sitemap and a visible service reference with stable FAQ links.
- llms.txt is a reading aid, not a promise of ingestion.
- Source-linked government/NGO resources help families; listing them does not create an earned backlink, institutional endorsement or partnership.
- Historical releases and their original checks remain in RELEASE.md and DESIGN-RELEASE-20260924.md and Git history. Their older facts/counts are not the current release.
