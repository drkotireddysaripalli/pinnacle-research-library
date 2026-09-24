# Pinnacle National Autism Helpline

Current release: 24 September 2026, Worker version 9. Full details and source checks: [FREE-GUIDANCE-RELEASE-20260924.md](FREE-GUIDANCE-RELEASE-20260924.md).

## Live service

- Canonical page: https://www.pinnacleblooms.org/national-autism-helpline
- Number: **9100 181 181**, `tel:+919100181181`.
- Free guidance for anyone, 24 hours a day, seven days a week. Telephone languages: English, Telugu and Hindi.
- Operator: Pinnacle Blooms Network; legal operator: Bharath Healthcare Laboratories Private Limited.
- Free guidance/access/24-hour availability confirmed by the owner on 24 September 2026; languages confirmed on 22 September. Free guidance does not establish a telecom toll-free number or free assessments/therapy.
- Three independently operated family resources are listed separately with official source links. Their numbers are not Pinnacle contact points.

## Source and build

- `page.html`: responsive design and page copy; generated FAQ/resource placeholders.
- `build.mjs`: shared FAQ and structured data, source-linked resource cards, service exports, HTML/font/image embedding, ETag and JSON-LD CSP hash.
- `service-facts.json`: owner-confirmed service facts; questions/resources are synchronized by the builder.
- `resources.json`: separately operated helplines, their numbers, scope and official sources.
- `handler-source.mjs`: route, asset, canonical, sitemap, method and security handling. Do not restore the old hardcoded SERVICE_EXPORTS copy here.
- `worker.mjs`, `preview.html`, `schema.json`: generated release outputs.
- `assets/`: nine existing branded WebP images.
- `anek-telugu-subset.woff2`: the full Anek Telugu font under its historical filename. Preserve it and its OFL license; do not resubset it by accident.

Build from this directory:

```text
node build.mjs
node readiness-tests.mjs
node preview-server.mjs
```

The preview binds only to 127.0.0.1:8787. Stop it after visual review. After production deployment run `node verify-live.mjs` from this directory.

This release passed 21 local checks, four responsive viewport checks and exact production checks. See `readiness-results.json` and `production-results.json`. These verify the release; they do not prove a new Google crawl or AI citation.

## Deployment ownership and persistence

Code, build and deployment remain owned by the existing Verify task. This repository preserves the exact source. No new task or external team has been given build ownership.

- Existing Worker: `pinnacle-helpline`.
- Existing route: `www.pinnacleblooms.org/national-autism-helpline*`.
- Version: `b5f9f079-e020-4412-b67c-9acfe3075824` (9).
- Deployment: `0fc1ccf8-d2d1-431c-9147-42e79c1618f3`, 100%.
- Compatibility date: 2026-09-23; bindings: none.
- Entry module: worker.mjs, self-contained, with nine embedded images and full font.
- Rollback: retained version 8 `a109916b-662d-46ed-b32d-eb9bcbe8443a`.

Use the existing Cloudflare Worker/route. Do not create a duplicate or remove the route. Keep workers.dev disabled. This Worker serves only the helpline page, its exports, sitemap and bundled assets; it does not rewrite the ASP.NET origin. An origin-only redeployment does not replace this Worker. A future Cloudflare deployment must preserve this route and include these changes.

The shared Verify Worker, main-site footer integration, FSC/story and clinical systems are separate and were not changed by this release.

## Search and evidence

- One canonical page; same number/operator in visible text, Service/ContactPoint/Organization/Brand graph and 12 FAQs.
- Matching title/description/share metadata, existing share image, facts.json, facts.txt, llms.txt and dated sitemap.
- llms.txt is a reading aid, not a promise of ingestion.
- Source-linked government/NGO resources help families; listing them does not create an earned backlink, institutional endorsement or partnership.
- Historical releases and their original checks remain in RELEASE.md and DESIGN-RELEASE-20260924.md and Git history. Their older facts/counts are not the current release.
