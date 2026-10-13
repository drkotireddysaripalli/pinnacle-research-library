# Google/Bing-aligned review — 12 October 2026

**69/100 operating readiness.** This is our weighted assessment against published
guidance, not a score issued by Google or Bing. The generated offline XML passes
all defined catalogue-coverage, semantic and official-schema checks.

| Criterion | Score | Evidence and completion condition |
|---|---:|---|
| XML, limits and flat host indexes | 20/20 | 44 XML files pass semantics and official XSD checks; five exact-host indexes, no nesting, 33 page / two image / four video leaves. |
| Coverage of reconciled candidates | 15/15 | Exactly 71,047 current INCLUDE URLs, no repeated page membership. 23,600 current HOLD and 126,688 EXCLUDE records retained outside public outputs. This does not prove whole-estate publishing completeness. |
| Canonical/indexability evidence | 17/20 | Dated four-source reconciliation, freshness gate, current redirect correction and held preview centres. Missing complete publisher inventories and fresh serving evidence for every candidate prevent full credit. |
| Image/video eligibility | 7/10 | 364 existing image references and 19,163 existing video records pass schema and semantic checks. Individual playback, prominence, crawlable on-page imagery and rights are not re-proved across the estate. |
| Truthful freshness metadata | 5/10 | No crawl/build timestamp masquerades as page lastmod. Verified significant-content publishing dates are still absent. |
| Public discovery and engine processing | 0/15 | New host indexes are built but not publicly deployed/submitted. Full credit needs HTTP/MIME/hash readback plus Google/Bing processing evidence. |
| Repeatability and release operation | 5/10 | Manifest replay, transaction rollback, contract CI, stable output hashes, prior-release asset reconciliation and readback commands are implemented. Integration with the existing publishing/release pipeline remains pending. |

The readiness score reaches 100 only when the missing evidence and operational
steps are verified. Full indexing, rankings and qualified enquiries are separate
outcomes and cannot be promised by a sitemap score.

## Independent engineering review

One independent read-only reviewer found URL normalization, media removal,
provenance, approval replay, snapshot authority and assembly lifecycle defects.
Those defects were corrected, with targeted regression contracts. The final
bounded review reported no unresolved blockers within the **offline candidate**
scope. It did not accept production serving or engine processing.

Validation: 33 Python contracts, four Node hosting contracts; 44 official-schema
XML files, 364 image elements, 19,163 video elements; a fresh-directory rebuild
and a full input replay produce the same public release identifier.

## Acceptance queue

| Owner | Concrete next action | Completion evidence / trigger |
|---|---|---|
| This sitemap workstream | Check in the reviewed manager and candidate packet. | Source PR and exact-source scoped CI. |
| Founder / connected PlanetScale tool | Approve or decline the already-presented exact website-table CREATE statement. | Explicit reply required by that tool; local catalogue is already populated. |
| Existing Windows website owner | Integrate adapter, merge discovery additions, assemble and deploy from the refreshed full asset union. | Owner acceptance after source review; record actual versions/routes/bindings/rollback and all five host readbacks before any submission. |
| Existing GSC/Bing owner | Submit the five indexes through existing verified properties, then check last-read, processing and errors. | Trigger only after public hash/MIME readback passes. |
| Publishing owner | Supply significant-content dates, complete host inventories, approved on-page media and page equivalences. | Publishing evidence and explicit source rules; keep unresolved pages/media held. |
| Care/measurement owner | Verify source → qualified enquiry → assessment/enrolment through the existing lead ledger and helpline 9100181181. | Receiving-team outcome evidence, beyond click/call-tap counts. |

No new production deployment, table creation or engine submission is claimed.
The existing production owner is defined in [PORTAL-OWNERSHIP.md](../../PORTAL-OWNERSHIP.md).
The deployment handoff remains pending until human authorization to message that
chat; this is a concrete prepared dependency, not a resolved operational result.

Standards: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
[Google video guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps),
[Google AI guidance](https://developers.google.com/search/docs/appearance/ai-features),
[Bing sitemap/AI discovery guidance](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/).
