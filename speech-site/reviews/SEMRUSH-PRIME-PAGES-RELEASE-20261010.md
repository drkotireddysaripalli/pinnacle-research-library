# Semrush shared repair and prime-page release — 10 October 2026

## Result boundary

This release repairs shared destinations and discovery surfaces that affect many
pages. It does not relabel a Semrush snapshot as cleared before Semrush recrawls
the deployed site.

## Snapshot reconciled

Semrush project `16364820`, snapshot `6ac83afa17c82d81d88e4fcd`, reported 1,397
errors and 1,223 warnings at about 69% Site Health. The largest recorded groups
were 1,171 broken internal links, 1,564 links through permanent redirects, 1,028
resource links, 704 internal nofollow links, 556 external 403 responses, 264
broken external links, 176 unminified assets, 150 slow pages, 70 links without
anchor text, 27 structured-data errors and 767 content-optimization findings.

## Implemented here

- The historical operating-metrics destination now converges on its maintained
  evidence record.
- Repeated `/verify`, `/innovation` and `/franchises` links are rewritten to the
  maintained destinations before HTML reaches crawlers or parents.
- Internal links no longer inherit the legacy `nofollow` token; unrelated rel
  protections such as `noopener` remain.
- The root sitemap now discovers the Speech Therapy, PinnacleAI and National
  Autism Helpline child sitemaps.
- `/self-sufficient` and `/mainstream` are present in the core sitemap.
- The exact prime/acquisition pages have deterministic metadata, schema,
  sitemap, redirect and 390x844/1440 browser acceptance coverage.

The two snapshot 5xx examples (`/t/interactive-song-therapy` and
`/c/non-verbal-therapy`) already returned 200 during reconciliation. The old
Mirracles sitemap already converged on `/sitemaps/miracles.xml`. These were
recorded as stale snapshot findings rather than repaired again.

## Intentionally retained or separately owned

- WhatsApp and other third-party 403 responses are external crawler behavior;
  working parent contact destinations are not removed to improve a crawler
  score.
- Valid Verify images and JSON evidence resources remain published even when a
  crawler classifies them as page links.
- Structured-data, minification, speed and content findings require their own
  affected-template/source fixes. They are not claimed as cleared by this
  release.
- Updated counts and Site Health belong to the next completed Semrush crawl.
- Field Core Web Vitals, real calls, accepted enquiries and admissions require
  their respective production evidence and are not inferred from static tests.

## Verification

The deterministic regression command passed 61 of 61 tests. The release script
also preserves all current worker routes, bindings and portal assets, requires
the exact merged commit plus successful CI, and records Cloudflare versions,
deployments and public readback before declaring completion.
