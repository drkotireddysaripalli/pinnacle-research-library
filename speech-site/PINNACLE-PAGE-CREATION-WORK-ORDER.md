# Pinnacle page creation work order

30 September 2026 · Canonical operating standard for future managed therapy, assessment, centre and PinnacleAI® pages.

This file defines **how to build and review a page**. `PORTAL-CONTEXT-AND-BUILD-MODALITY.md` defines the enduring purpose and shared architecture; `PORTAL-PAGE-INVENTORY-20260929.md` chooses the next canonical URL; `ACTIVE-PAGE-WORK-ORDER.md` holds the one current page's brief and open facts. A dated release receipt records what was actually published. Do not use an old page score as the current state of another page.

## The outcome to sell

A family comes with an everyday concern, not a request to study a technology stack. Show how the **specific service** could help their child participate in life, why Pinnacle connects the relevant people and methods to that purpose, and what will happen after the first contact. The child's growing self-sufficiency and mainstream participation determine the abilities to understand, goals, methods, people, home/school practice and review. This is the care direction, **not** a guaranteed result, a single score, or a rule that every child needs every therapy.

The commercial journey is a useful answer → a call to **9100 181 181** → suitable professional and centre guidance → a confirmed visit → attendance → enrolment when appropriate. A click, answered call, visit and enrolment are distinct observed states. The page must earn trust and invite a sensible next step, not lecture or frighten the family.

## 0. Freeze a one-page contract before building

Write these fields in `ACTIVE-PAGE-WORK-ORDER.md` for exactly one page:

| Field | Required decision |
|---|---|
| Canonical and intent | Existing URL/aliases, one primary audience question, relevant query variants, and whether this is a service, assessment, centre, product or guide page. Capture current Search Console/backlink baseline if available before considering a URL change. |
| Parent promise | One specific everyday activity or decision; the child's longer life direction; what the page can responsibly offer without promising a result. |
| First action | Exact call, centre or enrolment destination and what the receiving team can actually do. Free telephone guidance is not a free assessment, therapy, toll-free call or 24/7 appointment. |
| Evidence | Claim-level source, owner, date, definition, permitted wording and prohibited inference. Distinguish Pinnacle Blooms Network, Bharath Healthcare Laboratories Private Limited, PinnacleAI® and individual centres. |
| Operational facts | Confirmed service/clinician/availability/fee/booking by location, or explicit call-to-check language. A general centre directory is not a specialist roster. |
| Creative and measure | Each image's narrative job, approved logo source, mobile/social crop, alt, actual CTA IDs and privacy-safe event definition. |
| Release boundary | Affected shared components, protected Verify/helpline/origin routes, exact test scope, rollback state and any external condition that remains open. |

**Gate:** a colleague can say the page's job, source limits and real first step in one minute. If no one can, do not add blocks yet.

## 1. Source and clinical/operational truth

Create a dated claim table before copy or schema. Trace exact quantitative claims to numerator, denominator, time period and definition. Treat network service volume, product data, study findings, registrations, credentials and a local service offer as different things. The [Verify evidence hub](https://www.pinnacleblooms.org/verify/) should support the exact nearby sentence and state the limits.

MD-5 is the manufacturing licence for non-diagnostic Class B developmental-support software; BIS and FSC have their printed scopes. They do not certify an OT, guarantee a child's outcome or grant foreign registration. A study's preprint/publication status stays visible. Keep the held 97% outcome claim off a service page until its definition and supporting evidence have been reconciled for that use. Do not publish invented ratings, clinician credentials, exclusivity, diagnoses, appointment openings or child cases. Never expose child information in markup, exports, analytics or share media.

**Gate:** every consequential sentence has a working source and a defensible limit. Unknown local facts remain unknown rather than being inferred from the 62-centre directory.

## 2. Lock the page story, block by block

For each block, record: visitor question; one-line answer; feeling/decision it should enable; claim/source; CTA; and the job of any visual. Adapt this sequence to the page's actual intent rather than cloning copy:

1. **Recognition and first step.** Name a familiar moment and the service in plain words. Put a readable call action within the first phone screen. A humane, outcome-led line should precede technical language.
2. **Direct answer.** Explain what this service may contribute, who may find it relevant, and what a professional must first understand. A diagnosis alone does not prescribe a therapy.
3. **Why Pinnacle.** Show the life-first sequence concretely: family priorities and the child's participation choose the goal; suitable people and methods follow; home/school use is observed; the plan is reviewed. One familiar analogy can help; avoid attacking the whole profession or asserting an unproved monopoly.
4. **One worked everyday example.** Follow a realistic activity from family observation to assessment, suitable practice, life outside the centre and review. It must illustrate a process, not masquerade as a patient testimonial or guaranteed result.
5. **Seven-stage pathway.** Identify capabilities/AbilityScore®; forecast readiness and plan; provide appropriate integrated therapies; guide family everyday practice; track and correct; reassess and repeat; work toward growing independence and participation. Keep short labels visible in semantic HTML; detail can be disclosed accessibly.
6. **Human team and technology.** Explain the focal professional's role and conditional roles of other therapies, family and school. AbilityScore®, readiness indexes and PinnacleAI® support human judgement and continuity; they are not autonomous care decisions or a unified life-outcome metric.
7. **First call and visit.** Say what the family can ask, what the team can check, what a professional may observe, how location/fees are confirmed and what remains their choice.
8. **Proof at the point of doubt.** Put a few exact Verify/source links next to the claims they support; describe what each source proves and does not prove. Do not make the family scroll through a certificate wall to understand the offer.
9. **Local decision.** Offer useful centre search, maps, contact and an honest service-availability boundary. Do not imply all listed centres offer the focal service.
10. **Questions, share and close.** Answer the decisive objections, offer call/centre/enrol/share paths, and return to the child's everyday life.

**Voice test:** read the page aloud as a responsible Pinnacle parent ally and seller. A mother or father should hear a clear next step and an accountable approach, not a lesson, a software pitch or an outcome guarantee.

## 3. Visual, image and typography work

- Use the official emblem and lockup, Sintony, luminous white space, deep navy and vivid Pinnacle accents. Keep a capable child and family as the emotional heroes; credentials validate quietly.
- Give each image a distinct job: recognition, first professional conversation, everyday practice, family/school participation or social sharing. Reuse approved assets when they already tell that part of the story. Generate a new one only when it adds a missing scene or fixes a demonstrated crop/readability problem.
- Use the built-in ChatGPT image-generation tool in this task for new artwork, not a separately billed local API-key route. Generate the photographic/pathway artwork; typeset exact copy and apply genuine logo assets in the controlled final design. Inspect at final mobile, desktop and social size. Depicted Pinnacle therapists use full-sleeve white coats with approved identity, without implying medical-doctor credentials. No invented seals, certificates, staff identities, patient identities or before/after outcome scenes.
- Use icons and a connected path to clarify sequence and choices. Keep essential words in readable HTML, not baked only into images. Give informative images specific alt text and decorative marks empty alt. Record asset source/rights, sizes, responsive crops and loading priority.
- Provide a distinct 1200×630 social creative with a readable service title, human benefit, approved identity and **9100 181 181**. Fetch the live image bytes and test actual share previews where possible; OG tags alone do not prove a displayed card.

**Gate:** the image and type help a family understand and act at 320/390 phone, 768/1024 tablet, 1440 desktop and social crop. No generic decoration or illegible proof pills.

## 4. Build once in the shared managed system

- `src/layouts/PageLayout.astro` mounts `src/components/SiteHeader.astro` and `src/components/SiteFooter.astro`. Navigation lives in `src/data/portal-navigation.json`; shared styling is in `src/styles/portal-shell.css`. The Verify gateway is part of the **common footer**.
- Edit menu, telephone, Verify gateway or site-wide typography in the common source **once**, rebuild all currently managed routes and confirm matching header/footer output. This is compile-time sharing after build/deploy. `/verify/`, the helpline and legacy origin pages have separate sources; check their behaviour without assuming they inherit the managed shell.
- Use one meaningful H1, descriptive H2s, semantic lists and correctly labelled links/buttons. Keep menus, disclosures, focus and sticky actions keyboard/touch accessible. Important service and source text stays crawlable in HTML.
- A page-specific service mechanism, example and centre decision must survive without the common header/footer. Swapping a keyword in a cloned body is not a new page.

**Gate:** the focal page is useful on its own and any shared edit has no managed-route or protected-route regression.

## 5. Search, answer, citation and sharing package

- One indexable canonical, true aliases by permanent redirect, title/description/H1 matching visible intent, consistent internal links and sitemap. Retain a legacy canonical with equity until a Search Console/backlink migration case is made; do not add unsupported rate or “best” claims merely because those words occur in an older slug.
- Write direct, original answers and a real example in visible text. Connect relevant therapy, assessment, centre, PinnacleAI® and Verify pages at the point where the relationship helps a visitor. No doorway-city clones or repeated keywords for their own sake.
- Keep JSON-LD aligned with visible, sourced Organization, Brand, WebPage, Service, Breadcrumb and ImageObject facts. Use local business, reviews, rating or Offer data only when that location and offer have current records. FAQs serve families; do not assume FAQ markup will create a Google rich result.
- Where useful, provide stable source links and JSON/text/Markdown reading aids. `llms.txt`, schema, sitemaps and IndexNow are access/discovery aids, not a guarantee of ranking or AI citation. Google says ordinary crawlable, people-first content and matching structured data are the foundation for its [AI Search features](https://developers.google.com/search/docs/appearance/ai-features).
- Test Open Graph and social metadata, image dimensions/alt and canonical URLs against live bytes and visible copy. Record Search Console and Bing discovery, indexing, query/rank and referral observations separately. Notify IndexNow once for materially changed canonical URLs; do not resubmit an unchanged URL.

**Gate:** a crawler and a family can retrieve the same answer, entity identity, source and limit. Technical eligibility is reported separately from search performance.

## 6. Conversion, privacy and care handoff

- Put `tel:+919100181181` near the opening and after meaningful decision points. The receiving team must be able to explain the page and confirm a suitable location/visit; do not equate a dial click with an answered call.
- Test the actual rendered call, centre, map, share and enrolment actions. Use a fixed, coarse CTA allowlist under consent-on, consent-off and Global Privacy Control. Never send names, child concerns, centre identifiers, free text, query strings or advertising identifiers into general analytics.
- Test the enrolment POST and accepted response only against the legitimate approved endpoint/test mode; never create fake patient records. Record CRM acceptance and human follow-up separately.
- Measure dial click → connected call → service-fit conversation → appointment offered/confirmed → attended visit → enrolment as distinct states. Review failed handoffs and availability with operations rather than claiming page traffic as business success.

**Gate:** actions and privacy behave as represented; an actual receiving owner can handle the next step. Pending CRM/operator data remain explicit open gates.

## 7. Access, performance and real-family checks

- Check 320/390 mobile, 768/1024 tablet and 1440 desktop; Chrome/Edge and a real iPhone/Safari when available. Exercise keyboard, screen reader, reduced motion, zoom, text spacing, focus, disclosure and sticky controls. [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/) guides accessibility; a W3C validator pass is not conformance.
- Record field Core Web Vitals when available (LCP, INP, CLS); use lab tests to diagnose, not to claim field speed. Check hero loading, crop, overflow, readability and directory scanning. Do not delete useful crawlable locations solely to lower page length.
- Ask real families to identify the service's everyday value, find out what the first call means and locate a suitable centre. Observe confusion and intent. AI editorial review is not a substitute for their answers or named clinical review.

**Gate:** no critical access or first-step barrier. If real-device/family/field measurements are unavailable, mark those score points unearned and continue only when the core page release is safe.

## 8. Independent review, release and follow-through

1. Get read-only family/sales, service/clinical-evidence and search/accessibility reviews. The implementation owner resolves concrete findings or records an external fact gate. Do not present AI persona scores as clinician sign-off or user research.
2. Run the production build and focused page, privacy, measurement, evidence, social, responsive and shared-shell tests; broaden checks only for systems changed. Stage the **complete Verify + managed-page union** with all Worker modules, bindings and triggers. Confirm current version and rollback ID. Never narrow routes or deploy an old partial bundle.
3. **Commit and push the exact reviewed source first.** Deploy that source through the established Cloudflare route without a restrictive `--route` override. Read back canonical, aliases, key image bytes, CTA, evidence/machine outputs, all managed shells and protected Verify/FSC/helpline/origin routes.
4. Save the Worker version, rollback, production results, material discovery notification and remaining outcome conditions in a dated receipt; commit and push that receipt. Remove only disposable build/upload directories through the existing bounded cleanup process.
5. Recheck Search Console/Bing and real call/visit outcomes at a meaningful interval. Do not repeat submissions, validations or image generation while the state is unchanged.

**Release gate:** source, production, public assets, routing and measurement vocabulary agree. The user gets a clear delivered-versus-unobserved report.

## 100-point review rubric — score only demonstrated facts

Use this after each page release, with a dated evidence pointer for each row. It is an editorial/operational assessment, **not** a ranking prediction or clinical outcome.

| Area | Points | Full-credit evidence |
|---|---:|---|
| Family recognition and usefulness | 20 | First-screen everyday relevance, a plain answer and successful uncoached family comprehension tasks. |
| Focal service and life-first mechanism | 20 | Specific service role, suitable assessment, worked example, visible seven-stage relationship, family role and clinical review. |
| First action and care handoff | 15 | Working call and honest free/paid boundary; receiving team accurately explains and receives the inquiry. |
| Trust and sources | 15 | Sentence-level current evidence, correct identity/regulatory/study limits, and verified human/local claims. |
| Local decision | 15 | Dated relevant service availability, professional role, bookability/fees and a truthful path to a confirmed visit. |
| Conversion, access and distribution | 15 | Consented real CTA measurement plus separate answered-call/visit data; accessible device checks, field/lab distinction, metadata, crawlability and production read-back. |
| **Total** | **100** | State what was inspected; award no point for an assumption or a later outcome that has not been observed. |

A technically published page may score well on page-owned craft while its **operational/full-funnel score remains lower**. Record both if helpful; never call a released page 100/100 merely because the build, validator and structured data pass. See the dated [Occupational Therapy v125 practical review](reviews/OCCUPATIONAL-THERAPY-V125-PRACTICAL-REVIEW-20260930.md) and [ABA Therapy v126 practical review](reviews/ABA-THERAPY-V126-PRACTICAL-REVIEW-20260930.md) for scored examples. Keep the next page's brief and open gates in `ACTIVE-PAGE-WORK-ORDER.md`.
