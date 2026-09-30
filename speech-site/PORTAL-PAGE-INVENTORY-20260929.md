# Pinnacle portal page inventory and build sequence

29 September 2026 · Canonical plan for the next managed pages

**30 September current-state note:** The priority-zero bullets below are the original build-time audit, not a current open-defect list. The six checked aliases `/pinnacle-ai`, `/ability-score`, `/centres`, `/locations`, `/t/occupational-therapy` and `/t/aba-therapy` now 301 to retained canonicals; `/pinnacleai/sitemap.xml` lists all nine product pages. The readiness page has a live title and H1. The nine-product v128 release is being editorially corrected in source. See `PORTAL-PAGE-LEDGER-AND-SITEMAP-20260930.md` for exact page states and remaining work.

## Decision

The proposed inventory is the correct first portfolio. It must be built as one connected parent journey and one connected entity graph, not as a batch of independent keyword pages.

The portal has three layers:

1. **Find the right help** — therapy, assessment, centres and enrolment.
2. **Understand the PinnacleAI® system** — measurement, readiness, child-specific planning, everyday practice, feedback and reassessment.
3. **Inspect the evidence** — the existing Verify library, original regulatory records, research, methods, source dates and limitations.

Verify remains the evidence source of record. New service and product pages explain why the subject matters to a family, show how it works and lead to an appropriate next step. They link to the precise Verify record rather than copying the evidence library or making a licence carry a claim it does not establish.

## Priority zero: repair the search estate while building

New pages will not achieve their full value while older URLs send conflicting facts, unsupported superlatives or obsolete product descriptions to search and answer engines.

Before or alongside the first releases:

- retain one canonical URL for each intent and permanently redirect true aliases;
- converge `/centers/`, `/centres`, `/centres/` and `/locations` on `/centers`, remove the duplicate centre-sitemap entry and map each legacy `/centres/{slug}` page to its verified current centre URL;
- redirect the indexable `/t/occupational-therapy` and `/t/aba-therapy` duplicates to the retained service canonicals;
- keep `/autism-therapy` as the Autism Therapy hub, and reposition the competing long `top-autism-therapy-services...` URL as a genuinely general services hub or redirect it;
- repair `/ability-score`, which currently errors, to redirect permanently to `/abilityscore`;
- add the rebuilt `/abilityscore`, `/seven-readiness-indexes` and `/therapeuticai` canonicals to the main sitemap; the live pages are currently omitted, and the live readiness page also lacks a usable title/headline structure;
- make head-term product pages own their subjects; keep only useful distinct Ask Pinnacle questions and canonicalise or noindex generic Ask taxonomy duplicates;
- remove noindex Ask pages from the Ask sitemap unless their indexing decision changes;
- remove old aliases from navigation and sitemaps after redirects are in place;
- audit legacy service, skills, abilities, article, book and asset-subdomain pages for claim accuracy, duplication and privacy;
- validate privacy and index controls for report and asset routes, remediate any unauthorised public access through the private incident workflow and prevent recurrence;
- correct or retire unsupported `#1`, `world's first`, patent, outcome, scale, price and service promises;
- keep personally identifiable and child-specific clinical material out of public pages, snippets, machine exports and training feeds;
- preserve useful backlinks by redirecting retired pages to the closest genuinely equivalent destination; and
- distinguish publication, submission, discovery, indexing, ranking, AI citation and conversion in the release ledger.

This is a release gate, not a reason to delay all new page work. High-value pages and the cleanup can move in bounded batches.

## Layer 1: parent demand and conversion

| Order | Page | Canonical destination | Job of the page | Primary next step |
|---:|---|---|---|---|
| 1 | Occupational Therapy | `/best-occupational-therapy-center-india-proven-improvement-rate` | Connect sensory, motor, self-care, play, learning and routine participation to the child's everyday life, with current service facts and boundaries. | Call, choose a verified centre or enrol |
| 2 | ABA Therapy / behavioural support | `/best-aba-therapy-center-india-proven-improvement-rate` | Explain respectful, observable, function-led behavioural support and how goals transfer into daily participation. Avoid compliance-first or cure language. | Call, choose a verified centre or enrol |
| 3 | Special Education | `/best-special-education-center-call-9100181181` | Explain how individual teaching support can serve learning access, communication, participation and school readiness. | Call, choose a verified centre or enrol |
| 4 | Autism Therapy integration hub | `/autism-therapy` | Show how speech, occupational, ABA/behavioural and special-education contributions can be coordinated when the child-specific plan indicates them. Never imply every autistic child needs all four. | Understand the pathway, choose a centre or enrol |
| 5 | Find a Pinnacle Centre | `/centers` | Convert national and local demand into a verified location choice using accurate services, phones, hours, map/GBP links, centre emblems and matched exterior/interior media. | Call the network or contact the chosen centre |
| 6 | Child Development Assessment | `/speech-aba-autism-assessments` | Answer “where do we begin?”, distinguish assessment from diagnosis, explain the first conversation and route families into AbilityScore® and service planning. | Call, choose a centre or begin enrolment |

Speech Therapy and Enrolment are already released shared-system references. The new therapy pages reuse their production shell, evidence gateway, centre data, measurement and release plumbing while keeping service-specific narration and clinical facts.

### Centre architecture

`/centers` is the national directory and must remain distinct from individual centre pages. The directory should use a crawlable list and real filters. Each eligible centre page should contain unique, current local evidence: name, address, geo, local and national telephone, available services, hours, directions, HFR or other applicable registration context, correct team facts, genuine photos and the matching Google Business Profile/Maps destination.

Do not manufacture city doorway pages. A local page is published only when it describes a real centre or a genuinely useful regional service hub with distinct evidence.

## Layer 2: PinnacleAI® system and product knowledge graph

| Order | Page | Canonical destination | Parent-facing question | Evidence boundary |
|---:|---|---|---|---|
| 7 | PinnacleAI® overview | `/pinnacleai` | How does Pinnacle connect my child's present abilities, meaningful goals, professional support, everyday practice and review? | Class B non-diagnostic developmental-support SaMD for ages 0–12; human and professional review remain part of the journey |
| 8 | AbilityScore® | `/abilityscore` | What can my child do now, what sits behind the 0–1000 profile and what should we discuss next? | A company-developed measure and research programme; not a diagnosis, IQ score or promise of future independence |
| 9 | Seven Readiness Indexes | `/seven-readiness-indexes` | How do the seven focused views help us discuss speech, behaviour, motor, study/IQ, school, self-sufficiency and mainstream participation? | Use “seven readiness views” across versions; exact titles and 0–100/0–1000 scales must match the cited source and report version. Readiness is not diagnosis or guaranteed timing |
| 10 | Personal Development Kernel | `/personal-development-kernel` | How does the child's history, measurements, goals, circumstances and authorised feedback stay connected to the next review? | A child-specific planning record; define the full name before any acronym and do not imply neural mapping, causal certainty or an automatically unique best intervention |
| 11 | Prognose® | `/prognose` | What direction is the plan working toward, what informs that expectation and what could change it? | Use `progress forecasting` and `readiness tracking`; distinguish forecast from observation and never promise a date or predictive accuracy without evidence |
| 12 | TherapeuticAI® | `/therapeuticai` | How does the documented intervention-support layer connect an agreed goal to selected professional and everyday activities? | Retain human judgement and distinguish recommendation support from autonomous treatment, diagnosis or proof of effectiveness |
| 13 | Everyday Therapy™ | `/everyday-therapy` | Why was this activity chosen, which goal does it serve and how can the people around the child take part appropriately? | Public prose uses Everyday Therapy™; quote the BIS form “Every Day Therapy Programme through Therapeutic AI®” only when describing that source. Version-specific quantities, languages and delivery details need current proof |
| 14 | Fusion Module | `/fusion-module` | How do parent, family, caregiver, therapist and clinical observations return to review and correction? | Feedback, preference, observed response and clinical effectiveness are different measures; access and workflow details require current-version confirmation |
| 15 | Reassess, compare, correct and repeat | `/reassess-review-repeat` | What changed, what remains difficult and why should the next plan change? | Reassessment cadence and like-for-like comparison must match current methods; repeat **toward** readiness, growing independence and participation, without guaranteeing an endpoint |

The overview page is the commercial and explanatory hub. The component pages are substantial knowledge nodes, not thin product cards. Existing indexed routes `/abilityscore`, `/seven-readiness-indexes` and `/therapeuticai` should be rebuilt in place so their history is retained. The concise top-level product URLs remain connected through visible navigation and structured relationships; URL nesting is not required to create the hierarchy.

The older `/pinnacle-ai-innovations-revolutionizing-autism-history` page should redirect to `/pinnacleai` after the new overview is released. `/pinnacleai` and `/pinnacle-ai` are currently unused/404; select `/pinnacleai` as the exact-brand canonical and redirect the hyphenated alias.

The existing Verify destinations remain separate by intent:

- `/verify/evidence/pinnacleai-regulatory-journey.html` — complete source-linked regulatory and export story;
- `/verify/guides/abilityscore.html` — evidence-led AbilityScore® reading guide;
- `/verify/#report-explorer` — reviewed report formats and readiness context;
- `/verify/evidence/records/bis.html` and `/verify/evidence/records/md5.html` — original regulatory scope; and
- `/verify/evidence/pinnacle-paradigm-shift.html` — the source-linked life-first philosophy.

## Shared page contract

Every new page must earn its own URL by answering a distinct audience question. It must contain:

1. a direct, plain-language answer near the top;
2. the meaningful child/family outcome before deep system explanation;
3. the service or module's specific role, mechanism and limits;
4. one visual explanation that cannot be replaced by a generic card grid;
5. visible source links next to the statements they support;
6. a concise “what this means for your family” block;
7. stable question/answer anchors for search and answer engines;
8. relevant links upward to the hub, sideways to connected pages and downward to evidence;
9. one primary action: call `9100 181 181`, find a centre, enrol or inspect proof;
10. unique title, description, H1, canonical, social image and share text;
11. accessible HTML, useful alt text, responsive media and fast delivery; and
12. a dated owner/reviewer/source trail where the subject needs it.

No page exists merely to repeat a keyword with a different city, condition or adjective. Long-tail questions belong as useful sections until there is enough distinct evidence and audience need for a separate page.

## Search, AEO and AI package

### Entity and internal-link graph

- Keep Bharath Healthcare Laboratories Private Limited, Pinnacle Blooms Network, PinnacleAI® and named people as separate, accurately connected entities.
- Make `/pinnacleai` the parent of the product/module explanations, while AbilityScore® and the Seven Readiness Indexes retain their established public canonicals.
- Link every therapy page to the relevant PinnacleAI mechanism and exact Verify proof, without making regulatory documents evidence of therapy outcomes.
- Link the Autism Therapy hub to all four component therapies and link each component back with context.
- Link every service and product page to Find a Centre and Enrol; link centre pages back to the services actually available there.
- Use descriptive anchor text. Avoid a footer-only link graph or repeated generic “learn more” links.

### Machine-readable layer

- Use `WebPage` and `BreadcrumbList` consistently.
- Use `Service` for a real therapy/service page and `CollectionPage` plus `ItemList` for the centre directory.
- Use an accurate `LocalBusiness`/applicable medical-business subtype on individual centre pages only when visible name, address and other location facts match the markup.
- Represent PinnacleAI® and its components with a consistent entity graph. Use `Product`, `SoftwareApplication`, `DefinedTerm`, `isPartOf`, `hasPart`, `citation` and `isBasedOn` only where their visible facts support the relationship.
- Use `FAQPage` only for genuine visible questions and answers; do not treat it as a guaranteed rich result.
- Use `Dataset` only for an actual described dataset with creator, temporal/spatial scope, methods, licence and download or access conditions. Do not label operating counts or a marketing page as a dataset.
- Provide concise JSON, text or Markdown reading aids where they add independent value; keep HTML as the authoritative human-readable page.
- Add new canonical URLs to the sitemap and relevant `llms.txt` reading guide after publication. `llms.txt` is a reading aid, not a universal AI submission channel.

### Local discovery and conversion

- Maintain one source of truth for centre name, address, phone, coordinates, services, hours, photos, HFR context and GBP/Maps URL.
- Do not invent or self-aggregate review ratings. Display or link only current, source-backed review facts within platform and structured-data rules.
- Measure call clicks, centre selections, directions, enrolment starts and explicit API acceptance without sending child or parent personal data into analytics.
- Keep connected calls, accepted leads, appointments and enrolments as separate funnel states.

## Build waves

### Wave A — immediate conversion

1. Occupational Therapy
2. ABA Therapy
3. Special Education
4. Autism Therapy integration hub
5. Find a Centre
6. Child Development Assessment

### Wave B — PinnacleAI® entity authority

7. PinnacleAI® overview
8. AbilityScore®
9. Seven Readiness Indexes
10. Personal Development Kernel
11. Prognose®
12. TherapeuticAI®
13. Everyday Therapy™
14. Fusion Module
15. Reassess, compare, correct and repeat

### Wave C — local depth and decision support

- rebuild priority individual centre pages from verified data and approved local assets;
- reposition the existing general services page so it does not compete with `/autism-therapy` for the Autism Therapy intent;
- add service-specific first-visit, observation and decision guides only where they answer a real recurring question;
- strengthen professional/team and clinical-governance destinations with verified roles and qualifications;
- consolidate or retire conflicting legacy skills, abilities, articles and asset pages; and
- expand into additional services only after demand, evidence and a distinct conversion path are established.

## Release and measurement rule

Build and validate one complete release candidate at a time. After a material page release, update the shared navigation where appropriate, sitemap, social image, machine-readable exports, evidence/source map, analytics events and visibility ledger. Submit the changed canonical once through the applicable search/indexing route. Then measure discovery, indexing, ranking, AI citation, referral and conversion separately.

This inventory is the default portal sequence. Occupational Therapy's v125 correction, ABA Therapy's v126 release and the Autism Therapy v127 integration hub are complete. `ACTIVE-PAGE-WORK-ORDER.md` records the finished Autism page contract and the later whole-therapy review; the proposed Child Development Assessment brief is preserved in `reviews/ASSESSMENT-PAGE-BRIEF-PRESERVED-20260930.md` for a future selection. Use `PINNACLE-PAGE-CREATION-WORK-ORDER.md` for reusable brief and release gates.
