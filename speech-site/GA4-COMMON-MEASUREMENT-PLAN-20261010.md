# One Pinnacle measurement system

Decision proposal, 10 October 2026. This is the shared operating design requested by the founder, not a claim that these settings or integrations have all been activated.

## Outcome

Answer: which acquisition sources and public journeys produce accepted enquiries, answered/qualified calls, visits and admissions; where parents encounter friction; which shared repair or content improvement is worth doing next. Keep books, careers, registrations and clinical enquiries separate.

## Existing foundation verified in source / supplied by Ads owner

Shared measurement module, public enrolment component, idempotent receiver, durable private receipt/lead reference, optional 30-day acquisition envelope, native phone/WhatsApp actions and existing GA event vocabulary already exist. The current helpline repair reuses them.

The 10 October Admin readback for property 361649365 confirms the main web stream G-2BYLRLFRDJ, a separate Verify stream, the existing enquiry_accepted key event and four custom definitions: link_placement, measurement_mode, page_group and destination. G-H9CLX1WJ7R is used by the separately deployed National Autism Helpline implementation but was not listed as a data stream in that property readback. Its account/property ownership remains an Ads/Analytics-owner reconciliation item; this release does not create or move a stream, merge browser identifiers or change helpline consent.

## Shared release boundary — 10 October 2026

The common G-2BYLRLFRDJ module now includes the root homepage in its explicit route allowlist, supplies a non-empty page_group and measurement_mode on consented shared events, and supplies fixed link_placement/destination values on approved contact and navigation actions. A 10% in-page sample reports LCP, INP and CLS only as rating and coarse value buckets, tagged with a fixed release ID and page family. It sends no raw timing, URL/query, referrer, campaign, browser trace, visitor ID or form detail.

The durable-receipt gate for enquiry_accepted is unchanged. Private Ask/auth/search routes remain excluded; knowledge searches remain excluded; QA-tagged journeys remain excluded; Verify remains on its separate stream and choice; and National Autism Helpline G-H9CLX1WJ7R remains outside this shared release.

## Collection design

Google's advanced consent mode permits tags to load with configured regional defaults and limited cookieless signals while storage is denied. Universal blocking until a button click is not the only supported technical design. Implement the region/choice decision once, independently for analytics and advertising purposes. This is not a claim that Indian law exempts all processing or that every visitor may be tracked without restriction.

Do not recreate a consent component per page. Preserve explicit refusal, withdrawal and GPC, and make contact independent of any analytics choice. Existing helpline/main choices must not silently become interchangeable. A future unified disclosure must explicitly cover its scope and migration.

The durable receiving system records the actual enquiry regardless of optional analytics availability. GA receipt, browser dispatch and backend acceptance remain different facts. Blockers, network loss and vendor processing mean 100% delivery to Google cannot be promised.

## Common event contract

Reuse an existing name when it already represents the same action. One owner emits each event; automatic enhanced measurement and custom implementations must not both count it.

| Group | Events / inputs | Decision enabled |
|---|---|---|
| Acquisition | page_view, existing approved campaign attribution, existing google_ads_arrival where applicable | Which channels and landing families bring useful visits? |
| Parent engagement | user_engagement; bounded visible-section/proof/media interactions | Which explanations help a parent reach a relevant next step? |
| Navigation | existing enquiry_link_click and knowledge_service_click; centre/directions actions | Can knowledge visitors find the relevant service or centre? |
| Contact intent | phone_link_click, whatsapp_click; existing Google Ads contact events kept as channel-specific diagnostics | Which placements generate contact intent? These are not connected calls. |
| Form reliability | one form_start, sanitized form_error category, submit attempt, existing enquiry_accepted after durable success | Where do requests fail and how many are actually accepted? |
| Registration | sign_up only for a newly created account; login only for an actual login | Do Ask/FAQ/Sunshine users register? Registration is not a clinic enquiry. |
| Commerce | existing view_item, add_to_cart, begin_checkout; purchase/refund only from verified store records | Book revenue and checkout completion, separate from clinic acquisition. |
| Experience | sampled LCP/INP/CLS, missing-route and controlled error categories, release revision | Did a release or slow template reduce useful journeys? |

No raw email, phone, child detail, form message, free-text search, private answer path, recording, request ID, receipt ID or lead ID enters Google Analytics. Do not create health-interest advertising audiences from these interactions.

## Parameters and grouping

Use Google's built-in source/medium/campaign, device, country, language and time dimensions where applicable. Add only fixed, useful event parameters: page_group, destination, link_placement, measurement_mode, schema_version, public content family, language variant, controlled error category and release revision. Preserve existing scope/parameter meanings. Do not attach every parameter to every event.

Branch, selected treatment and operational identifiers stay in the protected enquiry/CRM records unless a separately reviewed, necessary Google contract establishes otherwise. No user/session ID or timestamp custom dimensions. Low-cardinality grouping prevents reports collapsing into `(other)`.

## Six reusable reports

1. **Acquisition to accepted enquiry:** channel/campaign, landing family, device and language; website accepted receipts alongside GA-reported acceptance and explicit missing-attribution counts.
2. **Knowledge to service:** Ask, FAQ, Sunshine, Mirracles, Materials and Interventions → relevant service/centre → contact/form.
3. **Mobile enquiry reliability:** attempts, validation/transport failures, actual acceptance, duplicate prevention and time to response.
4. **Regional demand:** Hyderabad, remaining Telangana, Andhra Pradesh, then confirmed operating centres. Public discovery and protected operational outcomes remain separate datasets.
5. **Experience by release:** real-visit CWV where sufficient, engagement and form outcomes; browser fixtures shown separately.
6. **Books and registrations:** commerce and account creation, explicitly excluded from clinic-lead totals.

First-party operational reports add received/answered call, qualification, appointment, attendance and admission only from their real authoritative records. Short visits and repeated clicks are diagnostic signals, not automatic fraud labels. Do not synthesize a call-ID association from time proximity.

## How the existing tools work together

| Tool | Useful contribution | Combined action |
|---|---|---|
| GSC | Google query/page impressions, clicks, CTR, position, index state | Join settled page/date aggregates to GA landing/engagement and first-party accepted outcomes; no invented per-user search-query conversion link. |
| Screaming Frog | Status, redirects, canonical, indexability, links; supported GA4/GSC API inputs | Prioritise broken or slow templates affecting pages with visits or accepted outcomes. Reuse saved crawl findings. |
| Ahrefs / Semrush / Moz | Available keyword, competitor, backlink and technical evidence | Join existing exports by canonical destination; choose opportunities using observed visits/contact/acceptance, not another duplicate crawl or assumed universal connector. |
| Pitchbox | Relevant outreach, replies and verified placements | Use stable approved resource URLs and permitted referral attribution. Measure referral visits/accepted outcomes separately from sent messages. |
| TestingBot / Lighthouse / Cloudflare | Functional regressions, reproducible lab results, delivery/server diagnostics | Correlate a release and affected template with observed loss/failure; keep field speed and lab speed separate. |
| Windsor / existing reporting | Supported connected-source extraction, IDs, freshness | One reconciled report with unavailable/stale sources visible; do not add another mandatory warehouse or paid service. |

GA4 does not submit URLs to search engines or directly command Ahrefs/GSC/AI assistants. Its value is identifying which fixes and destinations actually help families contact Pinnacle.

## Smallest high-value sequence

1. Read back existing GA configuration, enhanced-measurement settings, filters, key events, links and actual recent event receipt once. Reconcile them to the event dictionary.
2. Implement one shared regional analytics policy and one common dispatcher; migrate existing page-family hooks instead of duplicating them. Preserve truthful enquiry/commerce boundaries.
3. Finish receipt-grounded acceptance and source continuity; verify actual Google receipt separately from browser dispatch and isolated fixtures.
4. Build the six reports using existing connections. Add a BigQuery export only if existing supported reporting cannot answer the joins; assess actual cost and limits first.
5. Feed one ranked repair queue with dated, settled evidence. Run changed-template BVT on release; reuse unchanged evidence. Existing stopped growth schedules stay stopped.

Acceptance: one event per real trigger, correct current policy by region/choice, no sensitive payloads, no accidental conversion on page load, intact calling, useful reports with source dates, and one redacted genuine accepted-enquiry trace when activity arrives. No claim of completed calls, admissions or AI visibility from configuration alone.

## Official references checked 10 October 2026

- Google consent modes: https://support.google.com/analytics/answer/10000067
- Analytics PII restrictions: https://support.google.com/analytics/answer/6366371
- Custom definitions: https://support.google.com/analytics/answer/14240153
- Cardinality: https://support.google.com/analytics/answer/12226705
- GSC linking: https://support.google.com/analytics/answer/10737381
- BigQuery export: https://support.google.com/analytics/answer/9358801
- Screaming Frog GA4/GSC integration: https://www.screamingfrog.co.uk/seo-spider/user-guide/configuration/
