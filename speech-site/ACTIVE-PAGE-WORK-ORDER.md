# Active page work order — ABA therapy and behavioural support

30 September 2026 · The user moved the active implementation from the proposed assessment page to ABA. The assessment brief is preserved in `reviews/ASSESSMENT-PAGE-BRIEF-PRESERVED-20260930.md`. Apply the reusable `PINNACLE-PAGE-CREATION-WORK-ORDER.md` and `PORTAL-CONTEXT-AND-BUILD-MODALITY.md` to this release.

## One-page contract

| Decision | ABA release answer |
|---|---|
| Canonical | Retain the live `/best-aba-therapy-center-india-proven-improvement-rate` URL and existing permanent aliases. The historical slug is not evidence for an outcome rate or a “best” ranking. Do not change URL equity without a Search Console/backlink migration case. |
| Parent question | “What may be happening in this everyday moment, and can my child be heard, make choices and participate more comfortably?” |
| Promise | A suitable professional can explore communication, health, comfort and context with the family, decide whether behavioural support fits, connect a useful goal to everyday life, and review the response. Growing self-sufficiency and mainstream participation are the care direction, never a promised result. |
| Primary action | `tel:+919100181181` for free staffed telephone guidance 24/7. The receiving team can help check a suitable professional, centre, appointment and current fees. Ordinary call charges may apply; a visit or therapy is separately priced. |
| Secondary actions | Read one worked example, inspect claims beside their sources, select a published network centre, start service-prefilled enrolment, and share the page. Selecting a centre is not a booking. |
| Evidence | BACB for an educational ABA definition; NICE for functional assessment and quality-of-life-linked review; AAP for family-centred safeguards; WHO for participation; Verify for Pinnacle's documented programme and the separate MD-5/BIS software scope. Neither regulatory source licenses ABA therapy or certifies a therapist. The 97% claim remains held off this service page. |
| Operational fact | The 62 locations are a published network directory, not an ABA-service roster. Centre-by-centre service, professional, fee and appointment information remains call-to-check. No patient result, review rating or professional credential is invented. |
| Shared boundary | `PageLayout.astro` mounts the one shared header and footer. This ABA release reorders sections in the shared mobile More menu, placing therapies ahead of the longer evidence list. The optional directory notice and coarse measurement allowlist are also shared-source changes; rebuild and check all managed routes. Preserve Verify, FSC, helpline, other managed pages, origin routing and Worker triggers. |

## Narrative contract and acceptance

| Block | Family decision it answers | Visible answer and supporting treatment |
|---|---|---|
| Hero | “Is this about my child and can I act now?” | Everyday transition, request for a break, play/class participation; hopeful child-and-family illustration; immediate sticky and hero call to 9100 181 181; no outcome promise. |
| Direct answer | “What is ABA?” | Plain educational definition, child and family goal, professional judgement, BACB source and its non-endorsement limit. |
| Recognisable concerns | “Could this relate to what we see?” | Communication, transitions, learning/play and safety, with icons and no diagnosis-by-page. |
| First conversation | “What happens if I call?” | Three steps: describe one moment, check the right starting point, decide together. An optional professional lens covers communication, health, environment, patterns, strengths and family/school information. Free-phone versus paid-visit boundary stays visible. |
| Worked example | “What would support look like in real life?” | A child signals a need for a break; adults understand the context, agree a useful goal, adapt the environment and review comfort/participation. Four visible steps and a distinct family-child-professional image; no invented patient case. |
| Why Pinnacle | “What changes beyond a technique?” | The child's life determines the purpose. Seven visible, connected stages run from understanding abilities to participation, with AbilityScore® and readiness as conditional decision support, not autonomous care or a unified metric. Link the documented paradigm and family-feedback source. |
| Integrated people | “Who does what?” | Conditional roles of ABA, speech, occupational therapy, special education, family/school and relevant health professionals. Every child does not require every therapy. |
| Review and evidence | “Can I trust the plan and technology?” | Family observations and child choices are reviewed; show MD-5, BIS and research status next to their exact limits. Professional sources explain principles without implying institutional endorsement. |
| Centre decision and close | “Where can we go?” | Search the published locations with a prominent non-roster notice; answer eleven real FAQs; call, centre, enrolment and share actions lead to a human next step. |

## Creative contract

Four new assets were made with the built-in ChatGPT image-generation tool in this Codex task. The mother, capable child, full-sleeve white-coat professional and luminous pathway carry the emotion; official emblem assets in HTML carry exact site identity. The hero image recognises a child making a choice. The transition scene shows a break request and participation with peers. The review scene shows family observation reaching a professional. The distinct 1200×630 social poster includes the service name, communication/choice/participation message, Pinnacle Blooms Network identity and phone. See `ASSET-SOURCES.md`; social text is repeated in crawlable HTML. None portrays an actual patient, employee or verified outcome.

The typography and colour palette must be inspected at 320/390 mobile, 768/1024 tablet and 1440 desktop; the image shape, heading, call, menu, seven stages, directory and footer must remain legible. Inspect the final 1200×630 image bytes and alt text, not just its metadata.

## Search, answer, measurement and release gates

One title/H1/description and indexable canonical must answer ABA-intent plainly. The JSON-LD Service, FAQ (eleven visible answers), ImageObject, organisation/brand, breadcrumb and WebPage must match the page. The revised source map, text export, Markdown reading aid, child sitemap and relevant internal links must publish together. IndexNow is a discovery notification only. Crawl, indexing, ranking, AI citation, call connection and enrolment are separate observed states.

CTA placements are coarse allowlisted identifiers only. Check call, centre, WhatsApp/share and service-prefilled enrolment actions with analytics consent enabled/disabled and Global Privacy Control. Never send child/family information or URL query strings into general analytics. Do not create dummy patient submissions.

**Release sequence:** production build → responsive/visual/metadata/evidence/route/privacy tests → source commit and push → complete Verify + managed-page union stage and Worker dry run → deploy without `--route` override → production byte/routing/read-back → one material IndexNow submission → receipt commit and push. Record the current Worker version and rollback before mutation. The external gates after page publication are actual ABA-service availability, clinician review, real family comprehension, live-device/field speed and answered-call/visit/enrolment measurement. Do not award those gates without observations.
