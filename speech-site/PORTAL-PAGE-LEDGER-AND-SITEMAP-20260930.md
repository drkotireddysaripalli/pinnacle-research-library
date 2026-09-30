# Pinnacle portal page ledger and delivery sitemap

30 September 2026 · Current bounded portfolio and next decisions

This is the operational ledger for the **17 priority destinations** in `PORTAL-PAGE-INVENTORY-20260929.md`: two reference pages, six parent-demand pages and nine PinnacleAI product pages. It distinguishes a live URL from a page that has passed editorial review. It does not count every legacy, centre-profile, Verify or Ask page in the wider domain.

## Exact bounded status

| State | Count | Meaning |
|---|---:|---|
| Priority destinations | 17 | Two references + six Layer 1 + nine Layer 2. |
| Published as managed pages in v129 | 16 | All except the planned Assessment rebuild. |
| Published product pages corrected in v129 | 9 | The nine live pages now use distinct module stories, original illustrations and revised source maps. |
| Planned managed page not built | 1 | Assessment URL is a **live legacy/origin page**, not a 404; the new managed page is pending. |
| Additional managed decision guides | 3 | Speech first-visit, teacher-observation and service-information pages; outside the 17-page priority denominator. |
| Total managed public HTML routes in v129 | 19 | Sixteen priority pages plus the three guides. Preview and shell/test index are excluded. |

**Released correction:** nine new editorial scenes, a distinct overview, eight module-specific examples, readable mobile hero hierarchy and compact proof layout are live. Source `8330346` was pushed before the full-union Worker release. Worker `4cb916cd-5683-4ea9-829d-82ccf3f812da` serves 100%; all nine public pages, nine illustrations, nine share images, 27 source/reading exports, 11 aliases and protected routes passed read-back. The v128 rollback version is `3e047f76-9b82-468a-b139-8102cebedb11`. See `RELEASE-PINNACLEAI-CORRECTION-V129-20260930.md`. The correction kept every canonical and the shared header/footer source intact.

## Page-by-page route and work ledger

| ID | Canonical URL | Audience job | Current state | Next meaningful work |
|---|---|---|---|---|
| REF-01 | `/top-speech-therapy-center-india-proven-improvement-rate` | Speech entry point and life-first care decision | Managed, published reference | Preserve; change only for a specific defect or new evidence. |
| REF-02 | `/enroll-autism-speech-aba-therapies-india` | Human enrolment conversation and consented form | Managed, published reference | Keep call and centre choice; independently verify downstream accepted-lead state when an approved real/test response is available. Do not submit synthetic child data. |
| A-01 | `/best-occupational-therapy-center-india-proven-improvement-rate` | Daily participation through occupational therapy | Managed, published v125 correction | Preserve accepted narrative; monitor actual search/call outcomes separately. |
| A-02 | `/best-aba-therapy-center-india-proven-improvement-rate` | Respectful behavioural support | Managed, published v126 | Preserve; review only factual service changes. |
| A-03 | `/best-special-education-center-call-9100181181` | Learning access and school participation | Managed, published | Retain; verify current centre-specific delivery before adding local claims. |
| A-04 | `/autism-therapy` | Child-specific integration of relevant therapies | Managed, published v127 | Preserve integration; legacy competing autism-service URL requires separate content/backlink review. |
| A-05 | `/centers` | National directory and centre selection | Managed, published v118; 62 listings | Reconcile branch phones, service availability, GBP identity, hours, ratings, registrations and matching media from current branch evidence. Do not infer a specialist roster. |
| A-06 | `/speech-aba-autism-assessments` | First assessment decision and non-diagnostic distinction | **Legacy/origin HTTP 200; managed rebuild pending** | Build from the preserved assessment brief, validate and release through the common shell after the product correction. |
| B-01 | `/pinnacleai` | Whole life-first system | **v129 live, checked** | Observe discovery and audience behaviour; preserve the full seven-stage explanation. |
| B-02 | `/abilityscore` | Observed ability → interpreted starting picture → useful goal | **v129 live, checked** | Reconcile any wider-site “proven universal” wording against the actual external-validation status before repeating it as evidence. |
| B-03 | `/seven-readiness-indexes` | Seven distinct planning views | **v129 live, checked** | Maintain the version-dependent scale note and `Study IQ` boundary. |
| B-04 | `/personal-development-kernel` | Child-specific continuity across settings | **v129 live, checked** | Keep consent and authorised-access wording current as workflows evolve. |
| B-05 | `/prognose` | Revisable planning forecast | **v129 live, checked** | Keep estimated next step distinct from observed results and external predictive validation. |
| B-06 | `/therapeuticai` | Professional activity choice for a child goal | **v129 live, checked** | Preserve human choice, guided use and feedback; no autonomous prescription claim. |
| B-07 | `/everyday-therapy` | Manageable family-guided daily practice | **v129 live, checked** | Preserve a manageable routine and therapist responsibility. |
| B-08 | `/fusion-module` | Relevant observations into human review | **v129 live, checked** | School input remains conditional on consent and current access workflow. |
| B-09 | `/reassess-review-repeat` | Longitudinal comparison and next decision | **v129 live, checked** | Keep setting/support comparison and individual outcome boundaries. |

## Public discovery sitemap and source graph

1. `/sitemap.xml` is the domain's sitemap index. On 30 September it returned HTTP 200 and listed **15 child sitemaps**. The managed product child sitemap `/pinnacleai/sitemap.xml` listed all **nine** B-01–B-09 canonicals; `/speech-therapy/sitemap.xml` listed nine managed speech/service URLs. The centre URLs are in the indexed legacy `/sitemaps/centres.xml` (61 entries, including `/centers`); the managed `/pinnacle-pages-data/centres-sitemap.xml` also returned 200 with 61 entries. **`/centers/sitemap.xml` returned 404** and must not be advertised or submitted. Decide whether to expose that friendly route only after checking it adds a real discovery benefit rather than a duplicate. Do not add aliases or preview pages.
2. `/speech-aba-autism-assessments` appears once in the legacy `/sitemaps/core.xml`. The future managed rebuild must retain that canonical, replace its content deliberately and avoid a duplicate sitemap entry.
3. The nine product pages have unique title, description, H1, canonical, Breadcrumb/FAQ/entity JSON-LD, social image, visible source links, and JSON/plain-text/Markdown aids at `/pinnacle-pages-data/{slug}-sources.{json,txt}` and `{slug}-reading.md`. The correction updates page-specific claim/source mappings; machine-readable status must match the visible copy.
4. `/pinnacle-pages-data/pinnacleai-llms.txt` is a reading guide. Verify is the source of record for the MD-5, BIS, FSC, methodology, research and scale boundaries. A submitted sitemap, IndexNow event or reading guide is not indexing, ranking, AI citation, referral or a lead.
5. The retained aliases `/pinnacle-ai`, `/ability-score`, `/centres`, `/locations`, `/t/occupational-therapy` and `/t/aba-therapy` were live-checked as HTTP 301 to their corresponding canonicals. Leave their route rules and backlinks intact. The older origin pages `/pinnacle-ai-innovations-revolutionizing-autism-history`, `/abilityscore-global-study` and `/therapeuticai-effectiveness-study` remain HTTP 200 pending a content, source and backlink decision; do not silently redirect them.

### Whole-domain sitemap register at the 30 September live check

These are **sitemap entries, not confirmed indexed pages or unique URLs**. All 15 child files returned HTTP 200. The wider legacy families need their own quality, canonical, privacy and eligibility audits before promotion in this managed build queue.

| Child sitemap in `/sitemap.xml` | `<loc>` entries | Next audit or owner question |
|---|---:|---|
| `/sitemaps/core.xml` | 45 | Confirm current core canonicals, including the Assessment URL, helpline and competing service pages. |
| `/sitemaps/centres.xml` | 61 | Reconcile every branch URL/phone/GBP identity and the 62-listing directory without duplicate or missing locations. |
| `/sitemaps/staff.xml` | 251 | Confirm current public personnel profiles, consent and role accuracy. |
| `/sitemaps/bots.xml` | 727 | Review distinct search value, canonical status and Ask/AI page overlap. |
| `/sitemaps/miracles.xml` | 10,000 | Audit child privacy, consent, unique value and index eligibility before amplification. |
| `/sitemaps/faq-en.xml` | 659 | Sample and reconcile factual, canonical and quality status of English FAQs. |
| `/sitemaps/faq-te.xml` | 659 | Check Telugu naturalness and translated-answer parity. |
| `/sitemaps/faq-hi.xml` | 659 | Check translated-answer parity and useful distinct language targeting. |
| `/sitemaps/faq-kn.xml` | 659 | Same language and canonical audit. |
| `/sitemaps/faq-mr.xml` | 659 | Same language and canonical audit. |
| `/sitemaps/faq-ta.xml` | 659 | Same language and canonical audit. |
| `/sitemaps/faq-ml.xml` | 659 | Same language and canonical audit. |
| `/verify/sitemap.xml` | 84 | Verify owner maintains the evidence routes; this release made no Verify source edit. |
| `/speech-therapy/sitemap.xml` | 9 | Preserve managed service canonicals and guide value. |
| `/pinnacleai/sitemap.xml` | 9 | Preserve the nine corrected product canonicals and source exports. |

`/robots.txt` also advertises two **additional** sitemap roots outside that 15-child index. `/national-autism-helpline/sitemap.xml` returned HTTP 200 with one canonical URL; retain its distinct service ownership and measure actual search/call results. The apex `/ask/sitemap.xml` returned HTTP 200 and lists five child sitemaps (`sitemap-0.xml` through `sitemap-4.xml`), all HTTP 200, with 10,000, 10,000, 10,000, 10,000 and 3,288 `<loc>` entries respectively. These **43,288 entries are not 43,288 indexed pages**. A sample-based Ask indexability, duplicate, quality and privacy audit is the next evidence gate before any mass canonical or noindex change.

## Ordered remaining work after the nine-page correction

| Priority | Work package | Completion condition |
|---|---|---|
| 1 · DONE v129 | Release the corrected B-01–B-09 product pages as one coherent source candidate | Build and 36 responsive checks passed; `8330346` pushed; full Verify+portal Worker deployed; nine HTML/illustration/share/source groups and controls passed public read-back. |
| 2 | Build A-06 Assessment on the retained canonical | Follow `reviews/ASSESSMENT-PAGE-BRIEF-PRESERVED-20260930.md`; show the first conversation, assessment versus diagnosis, AbilityScore role, suitable care routing and exact sources; release through common header/footer. |
| 3 | Named cross-therapy fixes | Resolve the three bounded items in `ACTIVE-PAGE-WORK-ORDER.md`: legacy Autism anchors, confirmed speech-assessment context through Enrolment, and the Autism hub self-link/opening cue. Do so in a focused shared candidate, without reopening accepted therapy narratives. |
| 4 | Centre-level depth | Match each centre to first-party address, phone, real media, GBP/Maps URL, service availability and hours; publish only individually useful location pages and keep the national `/centers` list accurate. |
| 5 | Legacy search-estate convergence | Assess competing autism/service/product-origin pages and `/ask` duplicates using content, source status, backlinks and Search Console before canonical/redirect/noindex decisions. Remove unsupported claims and protect private child data through the appropriate incident workflow. |
| 6 | Decision guides and governance | Publish focused first-visit/service guides only for recurring audience questions; add verified professional/team and clinical-governance facts. Do not create thin keyword variants. |
| 7 | Visibility and conversion measurement | At material release, make one justified indexing notification. Then separately observe crawler discovery, indexing, query visibility, AI citation, call clicks, connected calls, accepted leads, appointments and enrolments. Use existing Search Console/Bing/Ahrefs and call/CRM owners; do not infer commercial results from a 200 response. |
| 8 | Whole-domain sitemap eligibility | Audit the 15 indexed child files and the two additional robots-advertised roots by audience value, canonical/index status, factual quality and child privacy, prioritising Ask's five children, `miracles`, `bots`, staff, FAQs and centre identity. Repair only verified defects in their actual owner source; the `<loc>` count is not an SEO success metric. |

The full Verify/off-page contribution ledger remains in `work/verify-visibility/QUEUE.md` at the workspace root; this document is the **portal page** sitemap, not a replacement for its destination-by-destination backlink ledger.
