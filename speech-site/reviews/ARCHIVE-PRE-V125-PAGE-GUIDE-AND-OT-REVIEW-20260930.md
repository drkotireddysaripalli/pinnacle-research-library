# ARCHIVED — pre-v125 Pinnacle page guide and OT review

This is a dated development snapshot. Its 80/100 Occupational Therapy score, proposed corrections, shared-route count and release sequence describe the **pre-v125 state**; several actions were subsequently completed. Do not use this file as the current page-creation standard, current OT score or release procedure. Use `../PINNACLE-PAGE-CREATION-WORK-ORDER.md` and `OCCUPATIONAL-THERAPY-V125-PRACTICAL-REVIEW-20260930.md` instead. The remainder is preserved only as historical rationale.

30 September 2026 · Accepted implementation guide for managed therapy, assessment and PinnacleAI pages. It defines what a 100-point page must **demonstrate**; a score is not a claim of clinical success, ranking or calls. `ACTIVE-PAGE-WORK-ORDER.md` remains the one current implementation destination.

## The 100-point gate — score observable evidence, not enthusiasm

| Criterion | Points | Evidence required for full credit |
|---|---:|---|
| Family recognition and usefulness | 20 | A parent can identify their own everyday concern in the first screen, understand who OT may help, and complete a real three-task comprehension check without coaching. |
| Service mechanism and life-first difference | 20 | The service-specific activity, individual assessment, family role, connected seven-stage path and professional review are visible in ordinary HTML, understandable on phone, and clinically reviewed. |
| First step and handoff | 15 | The prominent 9100 181 181 link works; free telephone guidance and paid visit boundaries are plain; the call team can accurately explain and hand off the current OT pathway. |
| Trust and accountable sources | 15 | Exact organisation/device/study claims link to records with scope limits; dates and source owners are current; people and local OT service claims have their own verified operational sources. |
| Local decision | 15 | Each promoted OT location has a dated service/professional/appointment/fee record and a truthful route from centre choice to a confirmed visit. General listings remain clearly general. |
| Conversion, accessibility and distribution | 15 | Real rendered actions have consent-safe analytics; answered calls, visits and enrolment are measured separately; mobile/tablet/desktop access, metadata, canonical, social preview, crawlability and production read-back pass. |
| **Total** | **100** | Full credit requires all six evidence sets. Unknown operational data earns no invented points. |

**Current OT baseline:** the 80/100 editorial review below records the pre-correction page. This implementation batch addresses the early story, connected stages, review creative, shared navigation and actual CTA measurement. It cannot by itself earn the unobserved centre roster, call-team read-back, family tasks, real iPhone/Safari or downstream conversion points. Record those as open operational gates after publication. The guide is 100-point complete; the page is not declared a measured 100 without that evidence.

## 1. Outcome and governing idea

A page succeeds when a mother, father, family member, caregiver, teacher or clinician can answer four questions without needing to decode a technical framework:

1. **Is this about the moment my child and I care about?**
2. **What can this service contribute to my child's daily life?**
3. **Why would I trust Pinnacle to choose, connect and review the right help?**
4. **What exactly happens if I call, choose a centre or start enrolment?**

The child's growing self-sufficiency, mainstream inclusion and wonderful life are the purpose that determines capabilities to understand, goals, people, methods, family practice and review. This is a direction of care, not a guaranteed result, a single score or a mandatory bundle of therapies. The commercial path is useful guidance → an answered call to **9100 181 181** → a suitable professional/centre conversation → a confirmed visit → attendance → enrolment when appropriate. Measure each state separately.

There is no universal page formula or special AI markup that guarantees ranking or sales. This work order combines the project's parent-first narrative with source-backed service information, the common Pinnacle shell, accessible design, Google Search fundamentals, real centre facts and observed conversion data. Google's current [AI Search guidance](https://developers.google.com/search/docs/appearance/ai-features) says normal Search eligibility, people-first content, crawlability, textual information, useful images, internal links and matching structured data remain the foundation; it does not require a special AI file or schema. The [2026 generative AI guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) prioritises distinctive, expert-led content over artificial AEO tactics.

## 2. Occupational Therapy release review — editorial score 80/100

This score judges the deployed page against the agreed brief. It is an editorial assessment by independent read-only family/sales, technical/search and shared-architecture reviewers plus the implementation owner's live inspection. It is **not** parent research, a clinical sign-off, a Google position or evidence of new calls.

| Criterion | Score | What the live page establishes | What limits the score |
|---|---:|---|---|
| Family recognition | 19/20 | The hero names play, meals, dressing and learning; five activity routes make OT relatable. | A parent task test has not confirmed which entry concern resonates most. |
| OT mechanism serving the whole life | 18/20 | Child + activity + setting, the spoon/mealtime story, home practice and seven visible stages connect OT to participation. | The distinctive Pinnacle mechanism arrives several screens below the first call. |
| First step clarity | 14/15 | Call, first professional conversation, centre choice and fee-check boundaries are explained. | Actual operator capability and current local OT staffing are not independently confirmed. |
| Trust and evidence | 12/15 | Verify links distinguish service volume, non-diagnostic software scope and publication status; no held 97% claim is used. | Proof about the actual OT people and branch-level availability is thin. Shared 4B wording needs source reconciliation before expansion. |
| Local decision | 7/15 | Sixty-two real published centre listings, photos and links are available. | The directory is not an OT roster and does not prove a named therapist, opening, fee or appointment at any one location. |
| Conversion and measurement | 10/15 | Calls, centre choice, service-prefilled enrolment and sharing work as actions. | The main OT-specific call and final enrolment clicks are absent from the shared analytics allowlists; answered calls and visits are unmeasured here. |
| **Total** | **80/100** | Strong, responsible parent-facing page. | The highest-value next gain is operational and measured, not another generic text expansion. |

### Verified publication strengths

- Live HTTP 200, index/follow, one H1, self-canonical, direct 301 aliases, child sitemap, accessible source-linked HTML, JSON/text/Markdown evidence, matching visible/structured FAQs, and complete branded Open Graph poster.
- The source-backed answer explains OT as work with the child, activity and surroundings, consistent with [WFOT's profession description](https://wfot.org/about/about-occupational-therapy). External profession links are context, not Pinnacle endorsements.
- The mother/child, father/child, professional-conversation, mealtime and life-path visuals create a coherent family story. The social poster includes the official identity and readable telephone.
- Chrome and Edge checks passed at 320, 390, 768, 1024 and 1440 px; W3C Nu reported zero errors and warnings. These are technical checks, not a full WCAG or real-device sign-off.
- The 31,052,382 count is labelled dated network service volume rather than an OT outcome; the MD-5/BIS references are limited to non-diagnostic software scope.

### Concrete gaps found in this review

1. **P0 — primary OT clicks are not measured.** `OccupationalPage.astro` emits `ot-hero-call`, `ot-first-call`, `ot-final-call` and `ot-final-enrol`. The common `public/pinnacle-pages-scripts/speech-measurement.js` allowlists omit them, so consented `phone_link_click` and `enquiry_link_click` events are not sent for those actions. The links themselves work. The existing measurement test simulates `hero-assessment`, which is not the OT hero action. Centre-jump and WhatsApp-share placements are also unmeasured. Fix the common event vocabulary or use its approved shared IDs, then test the **actual rendered OT links** under consent, no consent and Global Privacy Control. Never place child details, names, query strings or centre choices in general analytics.
2. **P0 operational truth — centre-specific OT access.** Confirm current OT professionals, service availability, first-contact process, visit times and fees by location in a dated operational register. Until then, keep the page's truthful “call to confirm” wording. Do not convert 62 published centres into 62 verified OT locations.
3. **P1 — first-screen differentiation.** The hero gives a good family moment, but the fuller reason to choose Pinnacle's life-first approach sits much lower. Test a concise three-part explanation near the opening: start with the child's life; choose the relevant OT goal and people; bring practice and observations back for review. Keep the detailed seven stages below for visitors who want them.
   - Shorten the two-line mobile eyebrow to a compact service/brand label. Test a benefit-led H1 that still names Occupational Therapy visibly, such as “Occupational therapy for children. More ways to take part in everyday life.” Retain the existing H1 until an actual fit/readability review selects the final wording; never promise a result.
   - At 390 px, the fixed call/centre bar and both large hero buttons repeat the same actions. Test one prominent in-flow call with its free-telephone-guidance cue, move the secondary full centre action below the human image, and keep the sticky actions accessible. The longer mechanism paragraph can follow the image. Verify no sticky control obscures text at 320/390 px.
4. **P1 — mobile scanning and shell.** At 390 px the common header takes about 296 px of the first 844 px and the horizontal therapy label can be clipped. The complete menu remains available, but the cue is not obvious. Improve the **shared** navigation once, retaining visible Verify/Citations and a clear way to reach every link. Test all managed pages after the change.
5. **P1 — real outcomes.** The page was published and IndexNow accepted a notification. Current revised-copy indexing, impressions, rank, AI citation, connected calls, suitable visits and enrolments are not established. The connected Ahrefs project lookup returned `Insufficient plan`; use the actual Search Console property and existing operator/CRM records for the baseline.
6. **P2 — URL and asset trust.** The retained canonical contains `best` and `proven-improvement-rate` while the copy does not claim a proven OT rate. Decide on migration only after a Search Console baseline and backlink inventory; if chosen, change redirects, internal links, sitemap, canonical/schema IDs, social metadata and machine exports together. Do not switch URLs merely for aesthetics.
7. **P2 — page length and field speed.** The live HTML is about 499 KB uncompressed / 55 KB compressed, with 62 centre cards, 202 image elements and about 28,000 px of mobile document height. Only a few images load initially, so this is **not proof of poor speed**. Measure field LCP/INP/CLS, full-page transfer, DOM interaction and family scan behaviour before restructuring the directory. Keep useful centre content crawlable.
8. **P2 — human and platform review.** Check a real iPhone/Safari, a screen reader, reduced motion and actual WhatsApp/Facebook/LinkedIn previews. Run brief family task tests. A W3C validator pass does not establish [WCAG 2.2 conformance](https://www.w3.org/WAI/WCAG22/quickref/). A generated branded professional scene should not be mistaken for a particular staff member or patient; use a brief factual illustration caption where needed.

### Direct comparison with the live Speech Therapy page

This comparison uses the live 30 September [Occupational Therapy](https://www.pinnacleblooms.org/best-occupational-therapy-center-india-proven-improvement-rate) and [Speech Therapy](https://www.pinnacleblooms.org/top-speech-therapy-center-india-proven-improvement-rate) versions, not an older cached text snapshot. The first-screen observations came from fresh Chrome captures at 390, 768, 1024 and 1440 px, Edge captures at 390, 1024 and 1440 px, and the existing 320 px OT release captures. They are viewport observations, not a family study or Safari sign-off.

| Visitor or distribution need | Speech Therapy | Occupational Therapy | Decision for OT |
|---|---|---|---|
| **First phone screen** | An emotionally direct “Help your child be understood” headline and mother/child art appear early. At 390 px the explanation starts near the screen bottom; the in-page call is below it, though the sticky call remains visible. | The service, everyday-activity lead and in-page call appear within the first 844 px; the father/child art does not. At 320 px the sticky call remains usable. | Keep OT's early actionable answer. Shorten the process-led headline and compact the shared shell so a meaningful part of the human image can appear sooner. Do not move the call out of reach merely to show art. |
| **Header and navigation** | Same common header as OT. | Same common header as Speech. | At 390 px it consumes about 296 px; at 1024 px about 514 px. This is a **shared-shell** problem. Preserve all destinations, Verify/Citations visibility and telephone prominence while redesigning the breakpoints in common files once. |
| **Branded visual journey** | A larger mother/child age-to-school artwork, coloured path and visible lifecycle help a visitor picture progress. Several tiny evidence pills are hard to read and compete with the family image. | Four relevant family scenes already show play, the first conversation, mealtime and home-to-school participation. The seven-stage labels are small isolated tiles; at 390 px the final tile sits alone. | Keep the existing OT photos. Join the seven semantic HTML stages with a responsive path and short OT-specific clues. Use evidence links in readable HTML rather than packing tiny certificate tokens into an image. |
| **Service explanation** | Speech's worked toy-box example makes observation and plan correction concrete. It also has a service guide, first-visit guide and teacher resource. | The early direct OT definition, WFOT/AOTA context, mealtime example and honest first-call boundaries are more explicit. | Keep the OT explanation; consider a short OT parent-observation/first-visit takeaway only after clinical and operational review. Do not invent session length, written-report timing or an assessment offer from Speech. |
| **Pinnacle proof and citations** | More evidence groups and an institutional story; 21 schema citations and about 40 main-content Verify links. | Three scoped proof cards, page-specific JSON/text sources and about 10 main-content Verify links; nine schema citations. | Link a source at the exact claim and add a compact accountable-organisation bridge if it helps the decision. More links or schema citations alone are not more authority. Keep software licences separate from OT staffing or results. |
| **Search and sharing** | Indexable canonical, matching title/description, service graph, image metadata and a branded 1200×630 poster. Confirmed free speech-assessment offer is visible and marked up. | The same technical foundation, plus a concise authored Markdown answer and current dated source map. Its 1200×630 poster is live and branded. OT intentionally has no nationwide service availability or free-assessment Offer claim. | No bulk keyword/schema addition. Preserve the matching visible/structured content and test actual social previews. A new OT poster must solve a measured crop/readability or positioning problem; the existing one does not justify automatic replacement. |
| **Conversion measurement** | Main hero/final actions use recognised event names. | Main `ot-*` call and enrolment IDs miss the common analytics allowlist even though links work. | Fix the common vocabulary and test the real rendered OT actions. Measure answered calls and appointments separately from clicks. |

**Browser observations:** both pages returned HTTP 200 in Chrome and Edge at all sampled widths, had no page errors or horizontal document overflow, and expose one H1 and a live OG image. At 390 px, OT's H1, activity lead and main call were visible above the fold; Speech's hero image was visible while its in-page call and most explanation were lower. At 1024×900, the shared header ended at y=514 on both pages, leaving little first-screen story. Playwright's WebKit and Firefox executables are not installed on this host, so no Safari/Firefox appearance is claimed; physical iOS/Safari remains a release check. Automated checks do not establish how quickly a family understands or trusts the page.

**Group judgement:** parent/sales reviewers favour Speech's immediate emotional promise but OT's clearer first action; the service-content review favours OT's mealtime example and cautious fee/availability wording; visual reviewers favour Speech's connected pathway but OT's four service-specific scenes; search reviewers find a sound baseline on both and no basis for claiming ranking or AI citation; engineering reviewers identify the shared header and OT measurement mismatch as the highest-value fixes. These are internal editorial role reviews, not sign-off by a named clinician or real family panel. This remains the same **80/100 OT editorial score** above, with visual hierarchy and observed fulfilment holding it back.

## 3. Shared header/footer contract — confirmed, with exact scope

The managed Astro pages have one shared shell:

- `src/layouts/PageLayout.astro` mounts `src/components/SiteHeader.astro` and `src/components/SiteFooter.astro` and imports `src/styles/portal-shell.css`.
- `SiteFooter.astro` contains the Verify gateway as part of the common footer. Navigation comes from `src/data/portal-navigation.json`; local Verify cards/register data are shared snapshots.
- All **ten current managed public HTML routes** (seven main pages and three speech guides) were checked live in this review: each returned indexable HTTP 200 and the same normalized header and footer HTML, with one Verify section per footer.

**Implementation rule:** edit a shared element in those common files once, then rebuild the entire managed-page bundle and deploy it. The change reaches all ten managed pages **after that build/deployment**; it is compile-time sharing, not an instant runtime include. Never fork a header, footer or Verify block inside one therapy page.

**Boundary:** `/verify/`, the National Autism Helpline, older origin pages and individual legacy centre profiles use other page systems. An edit to this Astro shell does not change those URLs. Their design and facts may be coordinated, but their own source and release routes must be handled explicitly. The current five-page shared-shell checker should be expanded to all ten managed routes and include preservation checks for Verify, helpline and representative origin pages.

The header's hardcoded “36 evidence records” and the local Verify card snapshots can drift from the live evidence hub. Treat those as a shared-source reconciliation task, not a reason to make a one-page patch.

## 4. Reusable page-development work order

Execute one complete page or bounded corrective batch at a time. Keep the active page in `ACTIVE-PAGE-WORK-ORDER.md`; preserve source, published state and GitHub together. Do not repeat settled audits or regenerate artwork without a specific visual job.

### Package 0 — define the page's commercial and evidence contract

**Deliverable:** one-page brief with canonical, audience, primary concern, exact first action, secondary actions, service scope, source map, related pages and outcome measures.

- Name the parent's practical question before choosing keywords. For OT: “Can my child join meals, dressing, play or school routines with more confidence, and where do we begin?”
- Choose one primary search intent; map real variants such as “occupational therapy for children”, autism/ADHD/developmental-delay questions, self-care/sensory participation and “near me” without repeating a keyword mechanically.
- Define the exact promise the page may make, the claims it may quote with scope/date, and the claims it must hold. Separate BHCL legal identity, Pinnacle Blooms Network brand, PinnacleAI software and real centre identities.
- Identify the receiving service: call team, centre choice and enrolment. Confirm whether any offer is truly free; free telephone guidance does not imply a free assessment, therapy or toll-free call.
- Capture a pre-edit baseline: page status/canonical, current Search Console data if available, meaningful rankings/queries, existing backlinks, operator call outcomes and page event health. Record unavailable data instead of substituting guesses.

**Gate:** a reader can state the page's single job, the first next step and the evidence limits in one minute.

### Package 1 — source and operational fact sheet

**Deliverable:** dated claim table: sentence, source URL/document, status, owner, scope, permitted wording, prohibited inference and review date.

- Pull exact Verify records and original licences; confirm current centre service roster, named professional facts, phone, hours, fees, maps and matched media with the operations owner.
- Tag every number by numerator/denominator, time window, definition and whether it is service volume, product data, study result, mission scale or credential. Do not let a network-wide count become an OT-specific outcome.
- Treat MD-5 as Class B non-diagnostic software manufacturing scope, BIS as its printed standards/module scope, FSC as Indian sale/export certificate subject to importing-country law, and research according to actual publication status. None proves a particular therapy result or foreign approval.
- Keep the held 97% outcome claim out until its definition and supporting research are reconciled; the locked wording in `AGENTS.md` is not a substitute for that reconciliation. Do not use “world's only/first”, cure, guaranteed independence, universal service availability or invented ratings.
- Never expose child records or clinical details in page HTML, JSON-LD, exports, analytics or share previews.

**Gate:** every material claim has a working source and a defensible sentence-level scope; unknown centre facts use a call-to-check fallback.

### Package 2 — lock the story before design or code

**Deliverable:** a block storyboard with one purpose, visitor question, desired feeling, exact claim/source, action and visual job per block.

Recommended order, adapted to each service rather than copied verbatim:

1. **Recognition and promise:** name a real everyday moment, the life direction and one visible call. The headline should contain the service subject in plain words. The first screen must work at 320 and 390 px.
2. **Direct answer:** explain what the service does, for whom it may be relevant and what assessment decides. Include condition-specific questions only where useful; a diagnosis alone does not select a therapy.
3. **Why Pinnacle's approach is different:** in a short, concrete sequence, show how the child's life chooses the goal, then the appropriate people and methods, then home/school use and review. One useful analogy may clarify this; avoid a long attack on the rest of the profession.
4. **One worked everyday example:** follow an activity from parent observation through professional assessment, manageable practice, real-life use and review. Never fabricate a testimonial, case result or child identity.
5. **The seven established stages:** identify capabilities; forecast readiness/plan; appropriate therapy; guided everyday practice; track/correct; reassess/repeat; grow independence and participation. Keep all labels visible; put longer details behind an accessible disclosure only if comprehension improves.
6. **The people and technology:** state OT's role and conditional roles for speech, behavioural support, special education, family and school. Explain AbilityScore®, Readiness Indexes and PinnacleAI as tools that support human decisions, not as a single outcome metric.
7. **What the first call and visit mean:** tell the family what to say, what the team can check, what a professional may observe, how fees are confirmed and what they can decide before committing.
8. **Proof beside the claim:** use a small number of exact Verify links at the points where trust matters. Name what each source establishes and what it does not. The full evidence library remains one click away.
9. **Local action:** offer a genuinely useful centre finder. If the service roster is unverified, say so in plain language and route to a call; do not label every general listing a specialist centre.
10. **Decision help and close:** concise answers to remaining questions, call, centre choice, enrolment and a share action. Keep the final message about the child's life, not a form or technology stack.

**Voice test:** read the page aloud as a Pinnacle parent ally and responsible seller. A family should hear “we will listen, explain and keep reviewing,” not a lecture. The page should sell clarity and an accountable next step while leaving room for professional judgement.

### Package 3 — visual system and creative production

**Deliverable:** visual storyboard and asset ledger before generation; approved exports, alt text and responsive crops after generation.

- Use the approved logo/emblem, Sintony, luminous white space, deep navy and vivid Pinnacle accents. Make the family and child's growing capability the visual hero; use icons, organic shapes and a connected path where they explain a decision.
- Assign each image a narrative job: recognition, first conversation, everyday practice, school/community participation or social share. Do not fill a page with generic stock-like therapy scenes or credential collages.
- Reuse verified assets when they do the job. The OT page already has four on-page scenes and a working branded social poster. First fix the shared header, hero composition and connected HTML pathway, then decide whether a new scene has a distinct narrative job. For new artwork use the built-in ChatGPT image tool in this task, not a local API-key route. Generate text-free photography/pathway artwork; apply the genuine logo/emblem asset and final copy in the page or a controlled design export. Inspect coats, faces, identity, telephone and crop at final size. Therapists shown as Pinnacle professionals wear full-sleeve white coats with approved brand marks; do not label them medical doctors. Do not fabricate seals, licences or actual staff/patient identities.
- **OT-specific creative candidate A — only if the recomposed hero still lacks emotional pull:** a parent and a 3–7-year-old child sharing one everyday activity, with two soft-edged glimpses of family and school participation connected by the approved colourful path. Keep a luminous white field and clean space for the HTML headline and call. Use the official Pinnacle Blooms Network lockup as a real asset overlay. The child is capable and engaged; no implied before/after, guaranteed school placement, false professional or tiny credential collage. Produce desktop and mobile crops from one composition; compare comprehension and loading against the current father/child hero before replacing it.
- **OT-specific creative candidate B — observation and correction:** one 16:9 text-free vignette at `#review-progress` showing a parent observing a familiar activity and later discussing the next suitable step with an occupational therapist in a full-sleeve white Pinnacle coat. Use the real emblem asset as an overlay and a restrained teal/cyan/purple path. Desktop: beside or directly below the four review questions. Mobile: full width after those questions, before team/technology cards. Proposed alt: “A mother and occupational therapist discuss a child's everyday activity and the next suitable step.” Proposed HTML caption: “What you notice at home helps shape the next professional review.” Generate this only if the four review cards alone fail to make that feedback loop clear in a family task test.
- **No generation needed for two useful diagrams:** turn the seven stage tiles into one responsive CSS/SVG path with all seven HTML labels visible (wide row, balanced tablet groups, vertical numbered mobile path); and add a compact HTML PinnacleAI® support loop in the current technology card: family observation → AbilityScore®/readiness support → professional and family interpretation → adjusted everyday practice. Keep the connector decorative/`aria-hidden`, the labels readable and links to the relevant Verify scope. Do not invent a score, dashboard, separate PinnacleAI logo, medical approval seal or autonomous care decision.
- Generated family scenes may illustrate concepts; genuine centre photos must match the actual location and have usable rights. A caption should prevent a branded illustrative professional from being mistaken for a documented employee.
- Keep essential words in HTML; image text supports rather than replaces the story. Write meaningful alt for informative images, empty alt for decorative ones. Build responsive sizes and keep the hero image's loading priority deliberate.
- Produce a distinct 1200×630 social image with title, one emotional benefit, approved brand and 9100 181 181. Verify live bytes and an image URL that social caches can refresh; test actual share cards, not just metadata tags.

**Gate:** at mobile, tablet, desktop and social-crop sizes the composition remains readable, on-brand and factual.

### Package 4 — build with shared components and real service data

**Deliverable:** page content in the managed site, with shared shell unchanged unless a deliberate site-wide change is needed.

- Use `PageLayout.astro`, `SiteHeader.astro`, `SiteFooter.astro`, common navigation and footer snapshots. Put only service-specific narration, images and modules in the page component.
- When changing menu, phone, Verify gateway, footer or sitewide typography, edit their common source **once**. Rebuild all managed pages; review all ten outputs. Keep separate Verify, helpline and origin systems out of an assumed automatic propagation.
- Use semantically structured HTML: one meaningful H1, descriptive H2s, lists for stages, correct links/buttons, visible focus and accessible disclosure labels. Touch and keyboard users must reach every action.
- Where the centre directory makes the page very long, keep important facts crawlable while testing whether an early location chooser and progressive presentation improve scanning. Do not delete useful locality information merely to chase a lab score.
- Every therapy page must explain its own contribution. A shared shell is reusable; a cloned body with swapped keywords is not.

**Gate:** page-specific value is clear without the footer, and shared-component tests show no divergence or protected-route regression.

### Package 5 — search, answer and sharing package

**Deliverable:** one canonical HTML page and matching discovery/metadata surfaces, with a baseline to assess real pickup later.

- Keep one indexable canonical for the intent, permanent redirects for true aliases, consistent internal links and sitemap entry, and a clear title/description that match the visible content. Avoid `best` or result-rate wording that the page does not substantiate.
- Put concise direct answers and useful original examples in visible HTML. Link related therapy, assessment, centre, PinnacleAI and Verify pages contextually. Do not create doorway city pages or repetitive keyword variants.
- JSON-LD should describe visible, evidenced Organization/Brand, WebPage, Service, ImageObject and Breadcrumb relationships. Use centre-level LocalBusiness facts only for real centres with current source records. Never insert unsupported ratings, reviews, nationwide OT availability, fake offers or a government helpline designation.
- Keep FAQs because they help families, but do not count `FAQPage` markup as a Google rich-result win: [Google removed FAQ rich results in May–June 2026](https://developers.google.com/search/updates). Keep `llms.txt` and Markdown as optional reading aids; [Google says neither is needed to appear in its AI Search features](https://developers.google.com/search/docs/appearance/ai-features).
- Set and test Open Graph/Twitter title, description, image, image dimensions, alt and canonical URL. Verify actual WhatsApp/Facebook/LinkedIn previews where the platform permits a refresh; never infer a preview from a successful JPEG fetch alone.
- Inspect Google Search Console URL status and performance after material publication. Notify IndexNow once for changed canonical URLs; record submission separately from crawl, indexing, rank, referral and AI citation. Do not resubmit unchanged URLs.

**Gate:** a crawler can retrieve the same factual answer, entity identities and source boundaries that a family sees; a live technical pass is recorded, with no invented visibility outcome.

### Package 6 — conversion, privacy and care handoff

**Deliverable:** tested action path and privacy-safe measurement specification.

- Keep a clear national telephone action (`tel:+919100181181`) near the opening and after the key proof/decision sections. Confirm the call team knows the page's language and can distinguish guidance from a booked appointment.
- Enrolment links may preselect a service/centre; the actual POST success response, CRM receipt and human follow-up must be verified separately. Do not create fake patient records for testing.
- Define a fixed allowlist of actual rendered `data-cta` values. Test each call, centre jump, map, WhatsApp/share and enrolment action on the page under consent, declined consent and Global Privacy Control. Static tests must derive from the page's real DOM so fictional placement IDs cannot pass.
- Send only coarse events: page group, fixed placement, fixed destination. No names, child concerns, centre ID, free-text, query strings or advertising identifiers in general analytics.
- Match page events to the existing operator and PinnacleAI/sales workflow: dial click → connected call → OT-fit discussion → appointment offered/confirmed → visit attended → enrolment. No stage may be inferred from the preceding one.
- Review nonresponse, wrong-service handoffs and appointment availability with operations; a beautiful page cannot compensate for a failed call path.

**Gate:** live page clicks work, consented events fire once, privacy exclusions hold, and the responsible team can receive and report the next real stage.

### Package 7 — accessibility, speed and family testing

**Deliverable:** evidence from devices, assistive use and field or lab performance, with issues fixed before release.

- Test 320/390 mobile, 768/1024 tablet and 1440 desktop; Chrome and Edge plus a real iPhone/Safari pass. Test keyboard, visible focus, screen reader announcements for menus/disclosures, reduced motion, zoom and text spacing. Use [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/) as the accessibility reference; an HTML validator is one check, not conformance.
- Record mobile Core Web Vitals at the 75th percentile when field data exist: LCP ≤2.5 s, INP <200 ms, CLS <0.1 as described by [Google Search Central](https://developers.google.com/search/docs/appearance/core-web-vitals). Use lab tests to diagnose, not to claim field success.
- Inspect first-screen call visibility, hero image load, font readability, clipped rails, image crops, sticky action obstruction and directory scan cost. Check that the shared footer remains useful without making the route unreadably long.
- Give at least a small set of real families three tasks: identify how OT could help an everyday moment, find out what happens on the first call, and locate a suitable centre. Observe confusion and call intent; do not substitute AI reviewer scores for these observations.

**Gate:** no critical access barrier, no unresolved first-step confusion and measured performance within the agreed budget or a recorded exception.

### Package 8 — independent review and release

**Deliverable:** one resolved review log, one production release, exact Git source and a factual public receipt.

- Request independent read-only family/sales, OT/clinical/evidence and search/accessibility reviews. Resolve each concrete finding or record its gate. AI editorial scores are not named clinical sign-off or real user research.
- Run the production build and focused route, content, privacy, measurement, evidence, social, responsive and shared-shell checks. Reuse existing checks; expand them only for a changed risk.
- Stage the full Verify + managed-page union. Confirm current Worker version, rollback ID, assets, bindings and triggers; never narrow the route list or deploy a partial/old Verify bundle. Deploy once after the release gate, then read back canonical, aliases, protected routes, machine outputs, image bytes and all ten managed shells.
- Save the release note and test receipt; commit and push the exact source to the existing GitHub repository. Clean disposable build/upload directories. Preserve historical receipts, approved source images and evidence ledgers.
- For a material page update, make only the justified discovery notification. Monitor Google/Bing and operator/CRM outcomes on a defined interval without repeating unchanged submissions.

**Gate:** source, production, rollback, public assets and measurement vocabulary agree; the user is told what was published and what remains an observed-outcome question.

## 5. Specific OT correction order and release status

| Priority | Work package | Exact acceptance result |
|---|---|---|
| P0 | Repair common measurement vocabulary for OT's real call/enrol/share/centre actions. | Consent-on tests emit one event per actual action; consent-off/GPC emit none; no child/query/centre identifiers escape. Shared routes are regression checked. |
| P0 | Establish dated OT operational register and call-team script. | For each promoted centre: current service, professional/role, bookability, hours, fees, source owner/date. Unknowns remain call-to-check. Operator can explain the first OT step and report answered-call outcomes. |
| P1 | Tighten the common header at phone/tablet widths, shorten OT's process-led hero, and move a concise Pinnacle difference statement closer to it without burying the early call. | Parent task test can explain why the service is life-first, see the human scene sooner and reach all header links; all ten managed pages show the same header/footer after one build. |
| P1 | Connect the seven visible stages and the PinnacleAI support loop as accessible HTML/CSS diagrams. | The mobile stage seven is not orphaned; each stage and the human decision role is clear without opening a disclosure or reading tiny image text. |
| P1 | Validate actual GSC status, social previews, real iOS/Safari, screen reader and mobile Core Web Vitals. | Baseline and defects recorded; no claim of index/rank/AI citation/field speed without observed evidence. |
| P2 | Place the new review illustration and test comprehension; decide clean canonical, centre-directory presentation and shared 4B wording after their source/baseline checks. | New asset depicts the family observation → professional review loop with approved Pinnacle identity and human-readable HTML; any migration is one controlled map with preserved links; no unsupported figure is added to OT proof. |

## 6. What not to do

- Do not turn this into another long course for parents, a wall of certifications, a keyword collage, a copied therapy template or a generic “AI-powered” promise.
- Do not claim that a software licence proves OT effectiveness, that every published centre provides OT, or that all children need every therapy.
- Do not advertise a guaranteed mainstream placement, cure, universal improvement rate, foreign device approval or unverified review score.
- Do not assume publication, IndexNow, schema, a sitemap, `llms.txt`, an AI answer test or an OG tag produced ranking, AI citation, a connected call or a visit.
- Do not change a shared header/footer inside one page component or assume this managed shell controls Verify, helpline and legacy origin pages.
- Do not spend a new development cycle on old reports, repeated validations or image regeneration when the next real bottleneck is centre access, measurement or first-call operations.

## 7. Execution and context cleanup sequence

1. Complete the OT corrective code and source assets in the common managed site. Run focused content, measurement, visual, accessibility, shared-shell and protected-route checks. Commit and push that exact source **before** deploying, as the owner requested.
2. Deploy the full union Worker with preserved routes and bindings, verify the public build once, save its version and release receipt, then commit and push the receipt. Keep the dated OT service register, connected-call reporting, family tasks and real Safari/assistive checks open until observed.
3. Keep Child Development Assessment as the next new page at the established `/speech-aba-autism-assessments` canonical; do not create a competing URL.
4. Keep the refreshed `README.md` and `PORTAL-CONTEXT-AND-BUILD-MODALITY.md` current after each release. The shared-shell regression now covers ten managed routes. Reconcile the displayed 36-record Verify count against its source register whenever that register changes.
5. Keep historical release receipts, regulatory originals, claim ledgers and approved creative sources as audit history. Delete only disposable build/upload directories through the existing bounded cleanup script. Do not erase source evidence to save context.
6. Keep one concise active-context document and this guide; treat exploratory drafts as historical. Read-only reviewers end when their review is delivered. Do not create parallel owner threads or schedules for the same codebase.

## References used for current platform expectations

- [Google Search Central: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google Search Central: generative AI optimisation guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google Search documentation updates: FAQ rich-result retirement and llms.txt clarification](https://developers.google.com/search/updates)
- [Google Search Central: Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [W3C: WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)
