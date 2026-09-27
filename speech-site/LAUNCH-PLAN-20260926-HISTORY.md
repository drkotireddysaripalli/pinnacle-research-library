# Pinnacle page platform — decision and launch plan

**27 September sales rebuild:** The current implemented local page supersedes the first prototype narrative described below. See `SALES-BUILD-20260927.md` and `SALES-VALIDATION-20260927.json` for the current feature and validation record. The release gates and selected-route migration constraints remain applicable.

26 September 2026 · Owner: this conversation · Status: local working prototype, not a production replacement.

## Decision

Keep the recognised Pinnacle homepage design: authentic large wordmark, white header, two navigation layers, photographic slider with purple copy panel, pink “I’m here to” strip and purple multi-column footer. Rebuild these as a shared, accessible template. Give each service its own specific narrative, photographs, FAQs, evidence and conversion journey.

Build and release one existing URL at a time. Keep the established site connected through ordinary links. Use an explicit route allowlist; unknown paths must continue to the existing application, not resolve to the new homepage.

The Speech Therapy prototype is working at http://127.0.0.1:4326/ while the local preview process runs. It is deliberately noindex. All business, payment, contact and navigation links lead to the existing public site. No lead collection, real booking submission, tracking pixels, Cloudflare route changes or search submissions were performed for this prototype.

## What is already built

- Astro 7.3.5 static output, with lockfile and small vanilla-JavaScript slider. No client-side application framework is needed for the public page.
- Reusable header, service navigation, slider, action strip, footer and layout components; shared navigation and phone data.
- A first Speech Therapy narrative: communication in everyday life, clear next step, seven-stage purpose-led journey, evidence links, FAQ and call actions.
- Original homepage logo, two original homepage images and the same Sintony typeface; local responsive WebP image variants, fixed image dimensions and a self-hosted font.
- Accessible native menu and FAQ disclosures, manual slider controls, visible focus, skip link, responsive layout and phone call bar.
- Title, description, canonical, language and JSON-LD for the page, service, breadcrumbs and visible FAQs. These are implementation foundations, not claims of rich-result eligibility.
- Links to Verify, the PinnacleAI story, existing research, helpline, centres and enrolment.

The prototype deliberately has a shorter footer link selection than the original’s large directory. Final template work must account for all important existing footer destinations and its social links. The layout is faithful to the current visual language, not an exact extraction of legacy HTML.

## URL evidence and migration rules

Read-only checks on 26 September returned HTTP 200 for all four paths below:

| Existing URL | Declared canonical | Treatment |
|---|---|---|
| `/top-speech-therapy-center-india-proven-improvement-rate` | Same long path | Speech pilot canonical; retain it |
| `/speech-therapy` | Long speech path above | Alias; serve the same completed content with the same canonical initially. Decide redirects after Search Console/backlink review |
| `/enroll` | `/enroll-autism-speech-aba-therapies-india` | Preserve alias and its application flow until migration testing |
| `/enroll-autism-speech-aba-therapies-india` | Same long path | Enrolment canonical; do not replace with a new slug by assumption |

Cloudflare route patterns consider query strings. A suffix wildcard can capture ad landing URLs with query parameters; the Worker must then check the exact pathname internally, so similarly prefixed paths are not accidentally replaced. The most specific route wins. Preserve the existing Verify and helpline routes, service bindings and private-route protections.

Each release needs a named build, asset namespace, source commit and previous route configuration. Rollback is restoring the selected route to its former handler/origin, with a verified last-good build available. Do not change unrelated zone configuration.

## Stack and alternatives

**Chosen:** Astro static HTML + typed page data + small native interactive components; Cloudflare Workers Static Assets for published marketing pages. Existing application services continue to own accounts, payments and admissions processing until their contracts are deliberately integrated.

Astro is appropriate for content-led marketing pages: it renders HTML ahead of time and ships JavaScript only for interactions that need it. [Astro architecture](https://docs.astro.build/en/concepts/why-astro/).

**Full React/Next application:** useful if the task becomes an authenticated product; unnecessary runtime and migration scope for this first service page.

**Copy the legacy page and all scripts:** preserves old appearance but also carries its dependency, tracking and layout costs. We retain the visual language and valid destinations, rebuilding the delivery layer.

**Replace the whole site at once:** creates avoidable risks around canonical URLs, legacy forms, private sessions and payments. Selected-route releases are independently testable and reversible.

## The business system behind each page

| Perspective | Required page behaviour | What we measure |
|---|---|---|
| Parents and families | Understand the service, a useful next step, fees/availability discussion, care-team role and evidence | Successful enquiries and appointments, friction, unanswered questions |
| Therapists, clinicians and teachers | Accurate communication information, appropriate goals, home/school participation; clinical review recorded only when performed | Content corrections, relevance and quality of enquiries |
| Sales and business development | Reach the existing BDC workflow; retain source, centre assignment and follow-up | Accepted lead → contacted → assessment → admission/closure |
| Branding and PinnacleAI | Recognisable Pinnacle shell; child’s life determines goals, measurement, people and methods | Message clarity and consistent factual identity |
| Ads and CRO | Match ad promise to service and locality; prominent action; preserve attribution across a real enquiry | Cost per accepted qualified lead and admission, not page views |
| Social and video | Purpose-specific image, concise share text, accessible video with a poster and load-on-demand player | Relevant visits and accepted enquiries from shared content |
| Search and AI retrieval | Useful HTML answers, stable URL, evidence-linked claims, accurate entity/schema, contextual internal links | Discovery, indexing, query impressions/clicks, cited sources separately |
| Engineering and accessibility | Fast, stable, keyboard-usable pages; resilient form states; isolated release and rollback | Core Web Vitals, errors, failed submissions, accessibility findings |

The existing MyOperator → BDC → centre assignment → admission/closure flow remains the destination. A `tel:` click is not a connected call; a page visit or submit-button click is not a server-accepted enquiry. The conversion event must reflect a real confirmation/receipt, with deduplication and permitted attribution.

Do not send child names, diagnoses, assessment answers, medical records, free-text concerns or private phone details into advertising pixels or general analytics. Marketing integrations need platform-specific configuration and consent; they are not all added automatically to every page.

## First pages and order

1. **Shared shell + Speech Therapy** — complete service-specific content, clinical review, asset provenance, metadata, production tests and a controlled release at the retained canonical/alias.
2. **Enrolment** — inspect the real ASP.NET form contract, validation/CSRF, duplicates, errors, consent, centre routing and confirmation. Build a new experience that reaches the same staff workflow. Do not create a second lead inbox or show success before acceptance.
3. **Assessment and contact/centre-finder journey** — remove friction across the full route from interest to staff follow-up.
4. **Other major service pages** — occupational therapy, autism support, behavioural support, special education and counselling, prioritised using actual enquiries, paid demand and Search Console evidence.
5. **Priority centre pages** — unique current address, access/location, service availability, team and appropriate local evidence; no mass-generated doorway pages.

Verify remains the source of proof. Each new page links to the specific relevant evidence as well as the hub. Enrolment should remain short and task-focused; the shared layout can use a compact hero rather than forcing a large slider above every form.

## Launch gates for the Speech Therapy pilot

1. Preserve canonical/alias behaviour and record current Search Console and enquiry baselines.
2. Inventory and retain useful existing content/backlinks before removing old sections.
3. Complete service-specific content and obtain an actual clinical/editorial review; never invent a reviewer.
4. Confirm rights for the reused photographs on the new page; existing public use alone is not independent licence proof.
5. Complete important header/footer destinations, social links and mobile search.
6. Confirm and test every enquiry/assessment/call destination without creating fake patient leads.
7. Add the final service-specific OG/Twitter share image and alt text; verify the actual rendered share preview.
8. Finish visible structured-data alignment and inspect eligible Google structured-data results; no fabricated ratings or guarantees.
9. Add only released canonical pages to the existing sitemap; preserve root robots and other owners’ sitemap entries.
10. Link released pages from relevant service, centre and evidence pages. Extend the existing AI reading index where useful, not a duplicate crawler file.
11. Validate robots/noindex removal on the production build; prevent private/staging URLs entering the sitemap.
12. Test mobile/desktop, keyboard, text zoom, contrast, slider, navigation and image stability.
13. Measure Lighthouse lab performance and field Core Web Vitals separately. Targets: LCP ≤2.5 seconds, INP ≤200 ms, CLS ≤0.1 at the 75th percentile. No score is claimed before measurement. [Web Vitals](https://web.dev/articles/vitals).
14. Integrate permitted analytics/attribution with the actual lead workflow and verify event deduplication. Do not enable all ad pixels indiscriminately.
15. Commit the release source to the existing GitHub repository, deploy selected routes and test same-domain HTML with/without query strings and cookies, GET/HEAD, assets and origin fall-through. Preserve POST handling and private/payment traffic.
16. Inspect production, record version and rollback, then request indexing only for a material released update. Compare conversion and search results over meaningful periods.

## AI integration and distribution

Start with public, inspectable content, accurate organisational identity and useful source links. Google says existing SEO practices remain relevant to its AI features; special AI markup or a new AI text file is not a requirement. [Google’s guidance](https://developers.google.com/search/docs/appearance/ai-features).

Any on-page assistant should be an optional later enhancement grounded in approved public information, give sources, help visitors find the right service/centre and offer a human next step. It must not diagnose, fabricate availability, collect unnecessary child data or block ordinary page navigation.

Distribution is separate work after publication: update authorised owned profiles and relevant existing listings; place useful source-based references where permitted; use appropriately evidenced editorial contributions. A framework, sitemap, schema or llms.txt cannot guarantee Google rankings, a Knowledge Panel, Wikipedia inclusion or an AI citation.

## Current limits

This is a working design/template prototype. The enrolment form has not been rebuilt, Cloudflare routes have not been changed, and no replacement service page has been indexed. No Lighthouse or field speed score is claimed. The final OG asset, clinical review, complete footer inventory, production integration and release gates above remain before launch.

The code stays owned and built here. An origin deploy will not overwrite a separately routed Cloudflare page, but it can still change shared application endpoints; therefore route configuration, source and integration contracts must be recorded together.

## Files and commands

`npm ci` then `npm run build`; `npm run preview -- --port 4326` serves the built preview on loopback only. Set `ASTRO_TELEMETRY_DISABLED=1` when running the tools.

Source: `src/components`, `src/layouts`, `src/data`, `src/pages`, `src/styles`; provenance: `ASSET-SOURCES.md`; frozen dependencies: `package-lock.json`. Production output is generated in `dist/`, not the source of truth.
