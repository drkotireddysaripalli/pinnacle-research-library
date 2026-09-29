# Pinnacle enrolment: trust, choice and conversion work order

Review begun: 28 September 2026. Completed: 29 September 2026 (India time).
Reviewed: https://www.pinnacleblooms.org/pinnacle-pages-preview/enrolment
Status: Review and implementation specification. This document does not mean the redesign has been deployed.
Owner: This task retains sole code/build/deploy ownership. Independent reviewers provide read-only feedback.

## 1. Decision and score

**76/100: a good enquiry foundation, an incomplete acquisition narrative.**

Independent AI editorial reviews: parent/family 76; sales/marketing 74; evidence/discovery 78. Overall is their simple average. These are judgments from source inspection, supplemented by the primary agent's live mobile/desktop review; they are not actual parent research, conversion measurements, clinical endorsements or ratings from search/AI companies.

The sales reviewer distinguishes warm traffic (85/100) from cold traffic (63/100). Someone already convinced by a therapy page has a straightforward way to enquire. Someone arriving directly from advertising is asked to act before seeing a sufficiently specific reason to choose Pinnacle.

What works: shared portal header/footer, recognisable colour/typography, prominent national call route, only name and phone required, optional preferences, Help me choose, clear enquiry-versus-appointment expectations, preview that does not submit, no unnecessary child medical intake.

What is missing: a specific life-first proposition, explanation of the distinctive working method, relevant proof beside the decision, local centre confidence, a practical picture of the first conversation, and a visual story before the entire mobile form.

## 2. What this page sells

The immediate decision is to begin a conversation and arrange a suitable visit. The larger value is a professionally guided, family-involved journey toward the child's growing independence and participation, with meaningful goals, everyday practice and visible review.

The family retains agency. The page should recognise the importance of the decision without asking parents to surrender responsibility for their child's life. Pinnacle earns trust through what families can understand, observe, question and verify.

### Proposed narrative anchor

**Your child's life is the goal. Let's build the next step around it.**

At Pinnacle, the goal is a self-sufficient, mainstream-included life. We work toward it through child-specific assessment, appropriate therapies, everyday family practice and regular review—with you involved in the decisions.

**Primary actions:** Call 9100 181 181 / Request a visit.

### Three reasons to choose Pinnacle

1. **Start with what matters in life.** Communication, everyday routines, learning and participation give the work its direction.
2. **Keep your family involved.** Understand the priorities, practise with guidance and bring your observations into the next review.
3. **Keep reviewing the next step.** Look at what is changing in everyday life and use that information to adjust the plan.

These are promises of process grounded in the documented approach. Do not claim an exclusive or guaranteed result. Regulatory documents establish their stated scopes; they do not establish that only Pinnacle can deliver independence or that every child's outcome is assured.

## 3. Framework

There is no single universal conversion-page gold standard. Use this project-specific narrative sequence:

**Recognise the family's goal → explain Pinnacle's approach → show relevant proof → make the local choice tangible → offer a simple action → explain what happens next.**

Use first-person Pinnacle commitments for the approach, second-person language for the family's choices, and attributed sources for evidence. Do not impersonate a parent's inner voice as a testimonial.

The narrative is supported by WCAG 2.2 AA accessibility, clear HTML and truthful structured data, Core Web Vitals, and measured conversion outcomes. Technical conformance is necessary quality control, not evidence that the page converts.

## 4. Intended page order

| Order | Block | Job | Presentation and proof |
|---|---|---|---|
| 1 | Shared portal header | Recognition and site access | Preserve shared navigation and footer contract. No page-specific replacement menu. |
| 2 | Life-first hero | Make the purpose distinctive immediately | Short headline/subhead, family artwork, call and request links. Meaningful copy remains HTML. |
| 3 | Why families choose Pinnacle | Earn the next click | Three illustrated/icon-led process reasons above. Short source links to purpose, family participation and review. |
| 4 | Simple request + confidence beside it | Let ready families act immediately | Two required fields, optional preferences; near-form proof and clear first-conversation expectations. |
| 5 | Selected centre | Turn a dropdown into a real destination | Actual photo, emblem, address, profile, Maps/reviews link and contact. Appears when selected; easy to change. |
| 6 | The life-first journey | Make the mechanism understandable | Accessible seven-stage pathway, family visibly involved throughout; concise on mobile with expandable details. |
| 7 | One everyday-life example | Translate the method into something concrete | Illustrative goal such as asking for water: agree goal, practise in relevant routines, note assistance/context, review. No invented score or patient outcome. |
| 8 | Confidence you can inspect | Connect evidence to a parent's question | Four short contextual proof cards, not a second certificate wall. |
| 9 | First visit and questions | Reduce practical uncertainty | What to discuss/bring, choosing support, plan/fees, appointment confirmation and scoped offer. |
| 10 | Final action + shared evidence/footer | Close with confidence and full access | Call/request, existing 36-record prefooter and full portal footer. |

On mobile, do not put the entire form before all human imagery and distinctive proof. Keep the first trust section compact so ready visitors can reach the form through the hero button or sticky action immediately. On desktop, use useful adjacent confidence content rather than an empty sidebar or repeated paragraphs.

## 5. Complete implementation work order

P0 = required for the narrative rebuild; P1 = strengthen during the same build where verified inputs exist; Launch = required before replacing the live enrolment route.

| # | Priority | Deliverable / exact action | Acceptance condition |
|---|---|---|---|
| 1 | P0 | Rewrite hero around the child’s life and Pinnacle’s specific approach. Preserve two contact actions. | First screen answers who this is for, why Pinnacle and what to do; no guaranteed outcomes or generic headline alone. |
| 2 | P0 | Add three Why Pinnacle process cards, each with a meaningful icon and relevant evidence link. | A parent can describe the difference without opening the entire Verify register. |
| 3 | P0 | Add the seven-stage journey: identify capabilities/AbilityScore; forecast readiness/plan; integrated support; parent-guided practice; track/correct; reassess; growing independence/participation. | Life purpose determines stages; family appears throughout; stages have accessible text and no finish-date promise. |
| 4 | P0 | Add one illustrative everyday-goal example using genuine process, not fabricated patient data. | Explains how a goal becomes practice and review; visibly an example and not represented as trial evidence. |
| 5 | P0 | Put four concise evidence answers near relevant decisions: approach, software, research, organisation. | Each statement has a claim-specific source and correctly scoped status; research maturity is preserved. |
| 6 | P0 | Keep the short form; improve mobile ordering and service/centre continuity from existing links. | Name/phone remain the only required fields; Help me choose retained; no forced diagnostic choice. |
| 7 | P0 | Render a selected-centre card from the existing directory and approved image assets. | Exact branch/address/photo/profile/Maps match; no stock centre photo; absence of image has a clean text fallback. |
| 8 | P1 | Create a centre Google identity/review register, verify exact listings, expose ratings only when properly sourced and permitted. | Source URL, branch identity, rating, count and observation date are recorded; no blanket 4.8+ or unique-family count inferred from reviews. |
| 9 | P1 | Add genuine, attributable family experience where publication rights and appropriate consent are established. | Exact context/date/source, no fabricated quotes or generated patient portraits; absent source means omit the testimonial, not invent one. |
| 10 | P0 | Produce the family-journey artwork and use real centre media; build diagrams/icons as HTML/SVG. | Each image has a narrative job; people remain dignified; real photos and illustrative artwork are not confused. |
| 11 | P0 | Refine type, colour and spacing using existing Sintony and Pinnacle tokens. | Strong readable body text, clear headings/actions, no pale critical text; WCAG contrast/focus/reflow checks pass. |
| 12 | P0 | Add practical first-conversation/visit answers and scope offers by campaign. | No invented response SLA, visit duration, report package, centre service availability or free offer. Team confirms appointment/fees. |
| 13 | P0 | Complete metadata and machine-readable content: title/description, OG, canonical, dated sources, citations and consistent identities. | Visible content and JSON-LD agree; preview remains noindex and out of sitemap; published page is eligible only after launch. |
| 14 | P1 | Set up privacy-conscious enrolment measurement and explicit campaign continuity. | Enrolment has its own route context; call clicks, accepted requests, confirmed visits and enrolments are distinct; no child/free-text/contact data enters general analytics. |
| 15 | P0 | Optimise media/loading and run accessibility/responsive/browser checks. | No horizontal overflow at 320/390/768/1440, no sticky CTA obstruction, keyboard/errors/zoom usable; images sized/lazy-loaded appropriately. Record actual device coverage. |
| 16 | Launch | Integrate the supplied POST API, validate receipt/errors, release exact route, verify preservation, commit and push. | Accepted backend receipt verified with approved test data; rejection/unknown response never shows success; current live route retained until then; production smoke tests and Git SHA recorded. |

No new framework rewrite is needed. Existing Astro/static HTML and the Cloudflare route are suitable. Concentrate effort on the page's meaning, proof, local confidence, accessibility and reliable acceptance flow.

## 6. Files and component boundaries

Project root: `C:/Users/Siri Palace/Documents/Codex/2026-09-15/k/work/pinnacle-page-template-20260926`

Existing files to edit:

- `src/components/EnrolmentPage.astro`: hero, ordering, proof, journey, first-visit content, selected-centre card placement and metadata props.
- `src/styles/enrolment.css`: consolidate duplicate cascade rules while implementing narrative layout, responsive ordering, type and focus states.
- `public/pinnacle-pages-scripts/enrolment.js`: selected-centre updates, supported preference continuity, existing validation and honest submission states.
- `public/pinnacle-pages-scripts/enrolment-api.mjs`: integrate actual API contract once supplied; preserve explicit accepted/rejected/unknown distinction.
- `src/layouts/PageLayout.astro`: reuse existing metadata/citation support; make only necessary shared changes with cross-page checks.
- `src/components/Icon.astro`: reuse/extend existing icon language, no new heavy icon library.
- `src/data/centre-directory.json`: preserve sourced centre records, not a fabricated rating database.
- `src/pages/enrolment-preview.astro`: keep explicit preview safety.
- `scripts/test-enrolment.mjs`: add meaningful selected-centre and submission-state regressions; avoid tests that merely duplicate static copy.

Proposed additions:

- `src/components/EnrolmentJourney.astro`: accessible, reusable seven-stage presentation.
- `src/components/EnrolmentCentreCard.astro`: selected branch proof and contact.
- `src/data/enrolment-content.json`: reviewed page copy, proof links and source dates.
- `src/data/centre-google-profiles.json`: verified listing identities and permitted display information; design storage/refresh around the source's terms.
- `src/assets/enrolment/`: final approved artwork derivatives.
- An enrolment-specific measurement context/module if the existing shared module cannot be safely generalised. Current speech measurement is route-scoped and should not be casually reused as speech_therapy for enrolment.

Reuse the directory media pipeline from `CentreDirectory.astro`. Preserve the single shared header/footer and existing Verify/FSC/helpline/payment routes.

## 7. Evidence design: what each source contributes

| Parent question | Proposed concise answer | Source route |
|---|---|---|
| What directs the plan? | Your child's everyday life and participation give goals, support and review their direction. | `/verify/evidence/pinnacle-paradigm-shift.html` |
| Will my observations matter? | Family observations and everyday practice contribute to the review of the plan. | `/verify/#family-observations`, `/verify/#feedback-changes-plan` |
| What is PinnacleAI? | PinnacleAI GPT-OS v1.0.0 is licensed as non-diagnostic developmental-support Class B SaMD within the stated scope. | `/verify/evidence/records/md5.html` |
| What research can I inspect? | Read the published methods, research summaries and each source's status and limitations. | `/verify/evidence/research-library.html`, methodology record |
| Who is accountable for the organisation? | Pinnacle Blooms Network is operated by Bharath Healthcare Laboratories Private Limited. | `/verify/#organization`, LEI record |
| What do BIS/ISO records concern? | The named management-system/software scopes, with records available to inspect. | BIS, ISO13485 and ISO27001 records |

Keep the FSC story in the broader regulatory journey; export eligibility is not the strongest immediate reason for a parent to book a local visit. Do not turn every certificate into a claimed clinical benefit. The existing shared evidence footer can retain the broader institutional story.

No new “only provider”, “world's first”, universal success rate or all-centre rating claim is approved by this work order. Confidence comes from specific evidence and transparent process, not inflated adjectives.

## 8. Google Business and local proof

Current inspected directory: 62 entries/Maps links; 60 dedicated profiles plus 2 contact fallbacks; 57 emblems; 138 photos across 52 locations; 59 legacy facility IDs. No current rating, review-count, Place ID, hours, service roster or verified distinct branch-phone fields.

Implementation:

1. Use existing exact Maps/profile links and real photos immediately.
2. Match Google listing identity to branch address; store stable verified Place ID where available. A Plus Code is a location locator, not a review or credibility credential.
3. Offer “View on Google Maps”, “Read reviews on Google” and “Get directions”; preserve national number and add branch phone only after verification.
4. Prefer a fast local card with a link. If embedding, load only the selected centre's map on request; do not load 62 iframes/widgets.
5. Before on-page Google rating/review display, choose an authorised source and compliant retrieval/refresh method. Record rating, count and timestamp; honour Google's storage, attribution and source-link requirements for API content. A manually copied evergreen star rating is not a live integration.
6. Never infer “lakhs of unique parents recommend us” from total reviews, service counts or family counts. Distinguish reviews, reviewers, families and patient outcomes.
7. Do not promise organic Search stars from our own LocalBusiness/Organisation review markup. Google excludes self-serving business review snippets, including embedded third-party review widgets. This does not prohibit linking to genuine reviews or affect the Business Profile's own reviews.
8. Verify booking/website links in authorised Business Profiles only after the production route accepts requests. Do not send families to the non-submitting preview.

Maps URL links require no API key. An automatic rating feed may require existing API credentials/billing/terms; do not create new paid access automatically.

## 9. Visual production plan

### A. Family journey hero — produce now as a concept

Text-free photographic illustration with an Indian family listening to the child, connected to a professional conversation, home practice and participation with peers. Luminous white; vivid but restrained purple/cyan/pink/green pathway; genuine-looking human texture. Its role is to communicate partnership and possibility, not document a patient outcome. Use the existing Pinnacle master artwork as visual-style reference only.

### B. Seven-stage journey — native HTML/SVG

Use the existing icon family, short text labels and an accessible ordered list. It should reflow vertically on mobile; do not make small text inside a large generated poster. Source links remain real links.

### C. Your selected centre — real photographs

Use the actual branch exterior/nameboard first, emblem near branch name, optional interior gallery. Do not generate a photograph of a centre, staff member or supposed patient.

### D. Everyday goal example — small illustrative sequence

One concrete example (asking for water or packing a bag), with HTML labels for goal, guided practice, family observation and review. Reuse suitable approved assets before generating more. Avoid depicting guaranteed graduation.

### E. Social share image

Derive a 1200x630 composition from the approved hero; apply the actual brand mark and typeset final headline outside image generation. Alt text and page content carry meaning; critical copy must not exist only in the image.

Keep generation provenance internally. Do not add gratuitous public AI disclaimers to every block, and do not caption illustrations as actual families, clinicians, testimonials or centre photographs. The available built-in image tool is being used; a specific “Images 2.5” model version has not been independently confirmed.

## 10. SEO, AEO, AI and paid acquisition

- Enrolment targets the booking/first-visit decision. Therapy pages explain therapy intent; centre pages serve location intent; Verify substantiates claims. Link these roles rather than stuffing every therapy/city keyword into enrolment.
- Publish primary answers as readable HTML: why Pinnacle, how the approach works, how families participate, what happens next, what can be verified and where the centre is.
- Use accurate WebPage/ContactPage and breadcrumb/organisation relationships as appropriate; put full branch identity on its canonical centre profile. Add real citation relationships matching visible proof and truthful update dates.
- Preserve consistent identities for Pinnacle brand, BHCL operator, PinnacleAI software and people. Do not merge the software licence with all centre or clinician credentials.
- Google says ordinary SEO remains relevant to AI features, important content should be text-accessible and structured data should match the page. Special AI schema or text files are not required. No knowledge-panel, ranking or AI-citation guarantee.
- Existing llms resources can help readers navigate; do not treat them as submission or ingestion receipts.
- Keep preview noindex/nosnippet and out of sitemap. After API acceptance and production release, use one canonical live URL, remove preview restrictions only from that live route, update sitemap/internal links and inspect the changed URL once.
- For ads, align therapy/centre/offer promised in the advert with explicit supported page context. Preserve easy access for warm visitors and sufficient reasons for cold visitors. Do not infer diagnosis from behaviour or use child/enquiry contents for advertising audiences.
- Do not send paid traffic to the current preview. Evaluate connected calls, accepted enquiries, visits and enrolments, not just form starts or button clicks.

## 11. Performance, accessibility and measurement acceptance

- Sintony maintained. Proposed body size 17–18px mobile where layout allows; minimum form input 16px; 1.55–1.7 line height and short readable paragraphs. These are design targets, not universal standards.
- Check WCAG 2.2 AA: normal-text contrast 4.5:1, large text 3:1, non-text contrast, keyboard/focus, labels/errors and reflow. Aim for 44px practical touch controls; WCAG 2.2 AA minimum target-size criterion is 24px with exceptions, not universally 44px.
- Prefer responsive AVIF/WebP, explicit dimensions, one appropriate high-priority hero and lazy lower-page media. Do not load all centre galleries or third-party widgets initially.
- Target field p75 LCP <=2.5s, INP <=200ms, CLS <=0.1. Lab tests guide fixes; record field coverage separately and do not claim field performance from a Lighthouse score.
- Check 320/390/768/1440, landscape, 200%/400% zoom, keyboard, screen reader reading order, reduced motion, errors and connection failure. Record actual Safari/iOS testing as pending unless performed on those browsers/devices.
- Measure call-link click separately from a connected call. Record accepted enquiry only after a recognised backend receipt. Confirmed appointment and enrolment require downstream business events.
- No phone, email, child information, free text or form values in general analytics, page URLs or third-party image/map requests. Evaluate consent and health-related advertising rules before conversion exports.

## 12. Release and remaining dependencies

The narrative, imagery, centre card, source links, accessibility and preview can be completed without the enrolment API. The owner has already said the API will be supplied; do not repeatedly ask for it or search unrelated private backend repositories.

The production form cannot be declared operational until the supplied endpoint/acceptance contract is integrated and tested. Google rating publication needs actual per-centre records and a permitted display method. Specific clinical personnel, first-visit deliverables, callback timing and fees need operational evidence before becoming promises; use the known enquiry/confirmation flow meanwhile.

Completion evidence for the rebuild: changed-file manifest, before/after visual review, independent read-only reviews, relevant automated checks, accessibility findings, metadata/schema checks, exact preview URL, production acceptance receipt when available, preserved-route smoke results, deployment ID and pushed Git commit.

## Sources used for this work order

- Live enrolment preview and local EnrolmentPage, styles, evidence mapping, centre directory, PageLayout and measurement source (28 September 2026).
- Google AI features guidance: https://developers.google.com/search/docs/appearance/ai-features
- Google review-snippet eligibility: https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- Google Places attribution/storage/review requirements: https://developers.google.com/maps/documentation/places/web-service/policies
- Google Maps URLs: https://developers.google.com/maps/documentation/urls/get-started
- W3C WCAG 2.2 quick reference: https://www.w3.org/WAI/WCAG22/quickref/
- Core Web Vitals: https://web.dev/articles/vitals

## Current-turn disposition

Review and work order completed. New artwork saved as `reviews/enrolment-concepts/family-journey-concept-20260929.png`; final prompt, tool and provenance are in `reviews/enrolment-concepts/PROVENANCE.md`. No page code, live claims, review numbers or production routing changed as part of this review.
