# Pending work and Ahrefs recovery — 9 October 2026

Owner: current website integration chat. This reconciles the current main release, the completed Ahrefs crawl and a bounded live sample. It replaces stale pending status, not original acceptance requirements. No product code was deployed during this review.

## Current audit, read directly from Ahrefs

Main project 10477823, Pinnacle Blooms — Search & Enquiries: **61/100**, crawl completed **9 October 2026 08:01:54 UTC / 13:31:54 IST**. Scope: pinnacleblooms.org and subdomains, both protocols. 76,074 internal URLs; 29,340 with errors; 46,069 with warnings.

| Error family | Recorded affected URLs |
|---|---:|
| HTTP 500 / 5xx | 16,481 (same group; do not add twice) |
| Canonical points to redirect | 9,622 |
| Non-canonical page in sitemap | 5,839 |
| Indexable orphan | 1,604 |
| 4xx | 685 (includes 678 404s) |
| Canonical points to 5xx | 486 |
| Indexable page links to broken page | 457 |
| 5xx in sitemap | 322 |
| Broken images / pages with broken image | 25 each, overlapping |
| Oversized image | 11 |
| Broken redirect | 8 |

Counts overlap. Warnings/notices include 35,173 pages linking through redirects, 32,353 schema.org validation notices and 20,329 OG/canonical mismatches. They need meaningful repair too; a Health Score alone does not certify their absence, search ranking or leads.

Ask and Verify API snapshots report In_progress, so their displayed 100 scores are not treated as fresh completed all-clear results. Ask still reports19 error URLs despite rounded100.

## Live reconciliation prevents duplicate repairs

The crawl finished today, but inspected individual observations are dated7–8October. On9October:

- All13 deliberately selected URLs recorded as500 now return200 with recognisable original identities. Sample spans /a, /abs, assessment, /c, Guru and old numeric Mirracles.
- Three sampled native Mirracles records now self-canonicalise to the exact200 mixed-case source URL. Their lowercase aliases redirect to that correct final record. The reported canonical-to-redirect defect is no longer present on those three.
- Child psychological counselling now self-canonicalises on www, correcting its observed mobile-host canonical.
- **Still present:** /franchise-autism-therapy-center returns200 but declares /franchises as canonical, which redirects back. Existing franchise repair source is not evidenced in that live response; reconcile effective route ownership before changing its code again.
- These are selected examples, not proof that all16,481 server errors or9,622 canonical findings are cleared.

Page Explorer returned at most250 rows even for higher limits. The 250-row sample was NOT called a complete export or estate census. No new broad crawl was launched. Six paid API reads reported50 units each:300 total, matching the reserved300; project summary and documentation reads reported no units.

Local raw evidence: work/pinnacle-growth-system/ahrefs-health-20261009/{project-snapshot,issues,samples,live-sample}.json. Live sample includes23 requested URLs (originals and compared canonicals), all200 after redirects. Its correct title/content recognition is limited to the captured metadata, not a full visual or clinical review.

## Immediate execution sequence

1. **Refresh the main audit after the actual releases, while preserving scope.** The current browser was signed out by Ahrefs due to another-device use; existing Google chooser was opened. API remains usable. A new crawl has not started. Once authenticated, inspect whether another main crawl is already running; reuse it or start one post-release crawl. Do not restart Ask/Verify or change exclusions to inflate the score.
2. **Close surviving shared availability/canonical/sitemap causes.** Start with current failing examples, not the historical total. Integrate existing reviewed Search Engineering work before writing duplicate fixes. Add the confirmed franchise canonical/route defect to that shared source/release boundary.
3. **Publish the ready source work at coherent boundaries.** Mirracles packet7ce008e recovers28 old IDs through55 paths; all29,759 primary records,19,292 directory/sitemap items and28,334 archive paths retained. Four sample IDs remain unresolved (15843,20980,20067,18253). This packet is prepared, not deployed; flat-runtime integration and current full-union release remain required. Existing navigation604b504, metadata72a27a5, directory019ae7e and resources223af579+909cab35 require their actual integration dispositions; source packets are not live proof.
4. **Validate changed families, then submit only eligible changed canonicals once.** Use existing Frog profile and focused assertions; use trusted CI/BVT for changed runtime. Preserve307routes/3706assets and protected receipt/API/auth services. Read back live affected URLs, then evaluate the next completed Ahrefs crawl with unchanged scope.

Success: real affected content/links/canonicals work; no unresolved critical regression is hidden; the completed comparable Ahrefs crawl confirms the score. Goal100 is not a promise of rankings, citations or leads.

## Wider pending work, ordered by outcome

| Priority | Work | Present state and next acceptance |
|---|---|---|
| 1 | Search recovery above | Current completed score61. Several sampled top errors already resolved; current all-family clearance is unverified. Integrate existing patches and use fresh results to isolate survivors. |
| 2 | Enquiry to receiving team and qualified outcome | Durable receipt and source storage delivered; optional Slack integration remains inactive candidate. Complete exact receiving linkage and an approved real internal test, then genuine GA4 receipt/call/appointment/admission joins. Do not infer these from browser events. |
| 3 | Native corporate homepage | Existing candidate and review packet received. Integration and production acceptance pending; candidate mobile lab LCP3.60s needs correction/real serving verification before calling it passed. Preserve current Speech root build. |
| 4 | Remaining legacy families | Sunshine directory is not migration of every original body. Remaining knowledge details, staff/careers, Guru/news/resources and discovery/origin dependencies require importer/template batches. Legacy origin stays available until independence is proved. |
| 5 | Testing and performance | Reconcile stale callback-navigation assertions, /allmirracles metadata/schema, Shop/Suchitra readability, iPad matcher and unavailable iPhone SE coverage. Use changed-case evidence; do not repeat today's daily run. Current saved OT2.840s/Autism2.676s lab LCP need scoped improvement, distinct from field CWV. |
| 6 | Shopify discovery and platform follow-through | Hosted theme accepted: 33 product pages, 99 variant combinations, 132 reciprocal language alternates, Anek rendering and zero native theme-check issues. Exact seven changed files pinned in private source commit d66f86ccb323b8ffbafb4214a85470f8485861cf. The complete current sitemap index declares one collection range containing only frontpage; the existing commerce administrator must reconcile native eligibility for the four published collections. Reviews and refund/support remain separate milestones. Preserve catalogue, stock, payments and source ownership. |
| 7 | PinnacleAI and libraries | Continue approved editable V164. Scholars needs promised engineering diagram. Materials/Interventions require complete original HTML/assets intake; no reconstruction of missing content. |
| 8 | Search demand and distribution | High-intent topic/service/centre journeys, verified branch media/identity and due qualified Pitchbox follow-through. CAAS next dated follow-up16October unless a reply changes it. Measure settled discovery/clicks separately from actual enquiries. |

## Delivered work that the old pending list must not reopen

-65 callback/enrolment pages:64 inline callback pages plus enrolment. Original child age/band requirement remains unfulfilled; do not silently claim it.
-Automatic acquisition arrival/tap/accepted-event transport is delivered with refusal/GPC/QA safeguards. It is not blanket consent, verified live GA4 receipt or connected-call evidence.
-Reproduced API shadowing repaired with42 explicit restored routes; final307route configuration retained.
-Private receipt RPC restoration PR13 delivered.
-Books/Shop retailer choices PR14 delivered;64/64 affected public checks and one64-URL IndexNow accepted batch. IndexNow acceptance is not confirmed indexing.
-ExistingFAQ4564-answer import, centre narratives, shared Anek, Ask identity and Verify evidence are retained.

No new schedule, paid subscription, customer lead, purchase, broad crawl or unsupported improvement percentage was created by this review.

## Shared tooling closeout — 9 October, 11:13 UTC

PR11 merged at 0f9abffd17be77a5e1b19047ea21e85079915a8f. Corrected source 024b7f35db51cf8a14cef8ef00f2c20fb92d7b4d passed the trusted CI run 37920847889, including TestingBot BVT. The Windows acceptance at documentation commit 669e347171db2b95313866df15b351c2c855cc99 records 606 unit passes (2 skips), Chromium 272 passes (20 skips), Firefox 68 passes (5 skips), WebKit 68 passes (5 skips), 4 centre-gallery passes and 6 centre-feed passes. Failed attempts and targeted corrections remain in the evidence. The dedicated build runtime is Node 24.21.0; the Codex runtime was not replaced.

This closes shared host/build tooling integration. It does not close physical-device or visual approval, field performance, the next full Worker release, real receiving-team linkage, qualified calls, admissions or the Ahrefs error families above. No portal production deployment occurred in this tooling closeout.

