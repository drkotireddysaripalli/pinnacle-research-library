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

## Deduplicated engineering register

Residual counts below remain the recorded snapshot counts until the scheduled
post-release crawl finishes. They must not be interpreted as live counts.

| Priority | Semrush finding/opportunity | Affected cohort | Exact change | Accountable owner | Acceptance test | Status | Residual count |
| --- | --- | --- | --- | --- | --- | --- | ---: |
| P0 | 5xx responses | `/t/interactive-song-therapy`, `/c/non-verbal-therapy` | Reconcile against public origin before changing code | Website owner | Both public URLs return 200 | Fixed before this release; snapshot stale | 2 recorded, 0 reproduced |
| P0 | Broken internal destinations | Legacy navigation/evidence ribbons | Rewrite the retired operating-metrics path and repeated shared aliases at the edge | Website owner | Public destination returns 200; rendered links point directly to it | Implemented; deployment/public readback required | 1,171 recorded |
| P0 | Links through permanent redirects | Legacy page templates | Rewrite `/verify`, `/innovation` and `/franchises` to their maintained targets | Website owner | Representative rendered pages contain final destinations and preserve query/fragment | Implemented; deployment/public readback required | 1,564 recorded |
| P1 | Internal nofollow | Legacy same-origin navigation | Remove only the `nofollow` token while preserving other rel tokens | Website owner | Edge HTML test and public sample contain followable internal links | Implemented; deployment/public readback required | 704 recorded |
| P1 | Missing discovery coverage | Root/core sitemap | Add three child sitemaps plus Self-sufficient and Mainstream canonicals | Website owner | Sitemap index/core public assertions | Implemented; deployment/public readback required | Updated crawl required |
| P1 | Broken external/403 destinations | Third-party links including WhatsApp | Preserve working parent contact; classify provider/crawler behavior from genuine broken destinations | External destination owner + website owner | Human/browser destination check and external owner evidence | Accepted with evidence where contact works; remainder open | 264 broken + 556 403 recorded |
| P2 | Resource links classified as page links | Verify images/JSON evidence | Retain valid evidence resources; change markup only where semantic source proves a defect | Verify owner | Resource 200/MIME and referring-markup review | Accepted with evidence; no destructive bulk rewrite | 1,028 recorded |
| P2 | Unminified JavaScript/CSS | Legacy, portal and Verify assets | Minify at each canonical build source without changing route behavior | Respective template owners | Byte/content checks, BVT and performance comparison | Remaining | 176 recorded |
| P2 | Slow pages | Shared and legacy templates | Fix measured response/render bottlenecks by affected template | Website owner | Field CWV where available; reproducible mobile lab evidence otherwise | Remaining | 150 recorded |
| P2 | Structured-data errors | Affected templates | Repair the actual invalid graph at its canonical generator | Respective page owners | JSON-LD parse plus rich-result eligibility check | Remaining | 27 recorded |
| P3 | Links without anchor text | Mainly Verify image/brand references | Retain valid accessible image links; repair only links lacking an accessible name | Verify owner | DOM accessible-name audit | Accepted/remaining after row review | 70 recorded |
| P3 | Content not optimized | Intent-specific landing/content pages | Improve unique answers and service-to-centre pathways using verified claims | Page-content owners | Unique intent, useful links, indexability and query-aligned GSC validation | Remaining, handled page by page | 767 recorded |

## Verification

The deterministic regression command passed 61 of 61 tests. The release script
also preserves all current worker routes, bindings and portal assets, requires
the exact merged commit plus successful CI, and records Cloudflare versions,
deployments and public readback before declaring completion.
