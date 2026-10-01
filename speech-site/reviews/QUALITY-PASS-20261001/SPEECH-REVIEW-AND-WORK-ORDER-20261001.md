# Speech Therapy: live review and proposed page work order

1 October 2026. Status: inspected; recommendations for owner review. No product code, shared shell, tracking configuration or production deployment changed during this review.

Canonical: https://www.pinnacleblooms.org/top-speech-therapy-center-india-proven-improvement-rate

Execution entry point: `SPEECH-EXECUTION-CHECKLIST-20261001.md` converts this review and its discovery addendum into task IDs, file scopes, completion checks and release steps. Use that checklist to work and record progress; this document retains the rationale and narrative contract.

Governing standard: `PINNACLE-PAGE-CREATION-WORK-ORDER.md`. Shared baseline: `pinnacle-common-shell-baseline-v159-20261001`, documented in `COMMON-SHELL-BASELINE.md`.

## Decision

Improve the existing Speech Therapy experience in one bounded pass. It already contains the parent promise, seven stages, home/car analogies, an illustrative speech example, family participation, first-visit offer, searchable centres, source links and call actions. Preserve that foundation. The strongest improvement is to make the reasons to choose Pinnacle easier to recognise, earlier to encounter and more concrete in speech and everyday life.

**Owner expansion, 1 October:** make Speech Therapy part of a deliberate network of contextual links; give PinnacleAI a concrete speech-specific explanation; use GSC/Bing and observed competing content to prioritise unmet intent; include only government-owned organisations in the external parent-resource block. The executable additions, actual discovery data and resource shortlist are in `SPEECH-DISCOVERY-AND-LINKING-ADDENDUM-20261001.md`. This extends this work order; it does not replace the agreed narrative or authorise a common-shell redesign.

The common header and complete footer, including Verify, are fixed. Page-body changes must not alter their typography, navigation, authority subtitles, cards, responsive behaviour or placement.

## Inspection evidence

- Source/components and the live page inspected at 390, 768 and 1440 px in Chrome. No horizontal overflow, main-page missing fragment targets or page-script errors found in those checks. This was not physical-device testing or a new Firefox/Safari visual certification.
- Live H1, title, description, canonical, index directives, OG/Twitter tags and schema present. Existing page title: `Speech Therapy for Children Across India | Pinnacle Blooms`.
- Live source check: six visible/schema FAQs; FREE INR 0 assessment schema matches the current offer. Evidence JSON/TXT, service facts, service-information and directory exports respond successfully. Checked practice/review and research fragment targets exist.
- OG image responds as JPEG, 1200 × 630, 171,973 bytes. Existing social poster is usable; no wholesale replacement is needed.
- Main body has about 2,660 rendered words. At 390 px the first-visit section starts around y=3,709, the worked example around y=9,711, the initial six centre cards occupy about 7,005 px and the main evidence section starts around y=22,197. These are one captured layout, not universal measurements. The full 62-location directory is available; six cards are shown initially.
- The apparent blank centre picture in one immediate scroll capture was lazy loading: the focused read confirmed the visible Suchitra emblem and exterior decode successfully. Do not record this as a broken production image.
- At768px the first-visit section retains two columns while fitting three fact cells inside its narrow text column. This creates unnecessarily short, fragmented lines in the duration/report/offer copy. Reflow that fact strip across usable width or stack the story at this breakpoint; keep the agreed font rather than shrinking it.
- Google URL Inspection: PASS, submitted and indexed, fetch successful, robots allowed, crawled as MOBILE at 2026-10-01 00:09:14 UTC (05:39:14 IST).
- GSC, 1–28 September: 311 impressions, 3 clicks, calculated CTR 0.965%, impression-weighted position 13.69. This period spans prior versions and cannot attribute results to today's design. Of 115 impressions in the disclosed query rows, 71 concern cost/fees/price/affordability; the cost-in-Hyderabad query accounts for 44. Query rows omit some traffic and do not reconcile to page totals. Raw page/query baseline is `SPEECH-GSC-BASELINE-20261001.json`.
- One production Lighthouse run per device: mobile performance97/accessibility100/SEO100/Best Practices77; desktop100/100/100/77. Mobile LCP1.98s, TBT153.5ms, CLS0; desktop LCP0.48s, TBT0, CLS0. Synthetic lab results, not field Core Web Vitals. Reports: `audits/lighthouse/speech-production-2026-10-01T12-27-28-733Z/`.
- Best Practices findings concern third-party cookies and DevTools Cookie issues from the injected Google Ads configuration. Investigate tag/consent behaviour; do not remove useful Ads attribution merely to raise a test score.

## What each perspective needs

| Perspective | The decision this page must help with |
| --- | --- |
| Mother, father, family, caregiver | We understand my child's everyday communication; I can see a worthwhile direction and a clear next step. |
| Child | Communication, choice, comfort and participation remain central; pictures/gestures or other suitable means are respected. |
| Therapist/clinician | Speech-specific assessment, goals, practice, observation and correction; suitable related disciplines contribute for a reason. |
| Teacher/school | See how the communication goal is used with another adult, in class or during play and how useful observations return to the team. |
| Sales/marketing/business development | A meaningful reason to call 9100 181 181, select a centre and arrange the assessment; no forced study of the entire stack first. |
| Owner/PinnacleAI | Self-sufficiency and mainstream inclusion direct capabilities, goals, people, methods, practice and review from the outset. |
| Brand/creative | Keep the strong Sintony type, vivid Pinnacle palette, organic shapes and family imagery; replace specific older professional scenes that miss the agreed branding standard. |
| Search/AI retrieval | Clear service answers, exact entities, useful queries, evidence linked to claims, readable text and coherent canonicals/structured data. |
| Engineering/operations | Preserve the common baseline and real routing; keep enquiry context, centre preference and working telephone actions; distinguish clicks from actual received calls/admissions. |

These are AI-assisted review perspectives, not endorsements by named outside teams or a family usability study. No new 100-point success claim is made; the queue's historical77/100 remains historical. The new package must be reviewed against the governing rubric after implementation.

## 1. Fix the “I'm here to” block first

Observed: white 16px text on pink, no underline, no border, no icon and transparent anchor backgrounds. Measured targets are about41.6px high. The treatment is readable but gives weak visual evidence that each item is clickable.

Use **outlined navigation link-buttons**, retaining actual `<a href>` elements. They change location; they are not form/action buttons. Keep the main telephone CTA stronger.

| Proposed label | Small icon | Destination |
| --- | --- | --- |
| Understand the first visit | Calendar/clock | `#first-visit` |
| Find a centre | Map pin | `#centres` |
| Verify our evidence | Shield/check | Page-specific `#evidence` |
| Explore citations | Book/reference | Existing Verify citation page |
| Arrange a FREE assessment | Calendar/arrow | `speechOffer.url`, preserving `entry=speech-assessment` and the enquiry fragment |

- Keep the accepted pink band, with clearly bounded white/outlined choices and dark Pinnacle text where appropriate. Icons supplement labels, never replace them.
- Use 16–18px labels and at least48px touch height. Desktop can fit a row; tablet wraps cleanly; phone uses two columns with the longer assessment choice spanning the row if necessary.
- Use a down arrow for same-page sections and a right arrow for another page. Keep hover, focus-visible and pressed states legible, with reduced-motion support.
- Current `Verify the evidence` goes to `#pinnacle-evidence` in the footer. It is not broken, but skips the speech-specific evidence section. Correct the instance prop.
- Current strip Enrol uses the generic URL; other assessment CTAs preserve speech entry context. Make the route consistent.
- Scope through SpeechPage props and an opt-in ActionStrip variant. Do not change every other page or any baseline header/footer style incidentally.

## 2. Narrative to build

**Organising message:** Help your child be understood, make choices, learn and take part. At Pinnacle, the self-sufficient, mainstream-included life you want your child to grow toward shapes the speech goals, suitable people and methods, everyday practice and review. Your family helps set priorities and see what is changing. Call us to turn that direction into a clear first step.

Keep one coherent Pinnacle voice: “we”, “with you”, “your child”. Demonstrate the difference through a practical example and linked proof. Avoid observer language and technical product names without the family benefit beside them.

| Order/block | Keep | Change or add | Visual and action |
| --- | --- | --- | --- |
| 1. Hero | “Help your child be understood”; mother/child image; FREE assessment; 9100 181 181 | Make the life-first direction explicit in one compact supporting sentence. Keep the service label and speech-specific benefit; reduce duplicate wording around the offer. | Existing organic image treatment, emblem and clear call/assessment actions. Do not regenerate a good hero without a concrete need. |
| 2. Quick choices | Five useful routes | Apply the link-button specification above. | Recognisable icons and destination arrows; clear focus/touch targets. |
| 3. Recognise the family's concern | Be understood, express a need, understand language, join in | Add a short direct answer defining speech/language support and naturally address relevant speech-delay, unclear-speech, understanding and autism/developmental-support intents within actual service scope. | Four useful concern cards. Integrate the9-month-to7-year communication artwork into this explanation, not another long introductory chapter. |
| 4. Why Pinnacle starts with life | Family purpose and one explicit analogy | Make one compact home/bricks analogy connect to speech: a word/request matters because it helps the child participate. Stop repeating both home and car analogies later. | One short illustrated explanation followed immediately by the concrete mechanism; source link to paradigm shift. |
| 5. Show one speech goal working | Existing toy-box “help me open it” example | Move it earlier. Name an illustrative communication method selected with the professional, cue/support, observation, transfer to another familiar adult/teacher and the next review question. | Three-scene complete branded creative: choose goal → practise/use → review/change. Keep the full meaning in HTML. Call or assessment invitation after the demonstrated value. |
| 6. Seven-stage PinnacleAI path | All seven stages and family involvement | Attach the speech example to the stages. Show what each stage helps the family understand or do. Keep nine technical explanations optional; link the appropriate product explanation and exact supporting source. | Compact connected diagram with all stage labels visible; expandable useful depth. The child's life remains the purpose, not an eighth metric or a promised endpoint. |
| 7. First visit and assessment value | About1hour, written report, ₹25,999 struck through/FREE, actual offer boundary | Explain the practical value: starting picture, meaningful priorities, next-step discussion and report arrangement. Make the fee/ongoing-therapy answer easy to find because current queries show demand. | Upgrade the older first-visit professional scene to approved branding. Retain call, service-information and speech-context enquiry routes. |
| 8. Other therapies when useful | OT, ABA, Special Education and Autism integration links | Show how each may support this same communication goal; avoid another generic paragraph repeating the car/home analogy. | Small role diagram or concise linked cards. No fixed bundle or requirement that every child needs every therapy. |
| 9. Why a family can trust the explanation | MD-5, BIS, research, identity/system records and source exports | Put a concise proof preview earlier in the decision flow; place the full speech-specific evidence block before the long directory. Give each selected fact its family relevance and exact source. | Three useful proof cards plus deeper references. Clinical results, service volume, software scope and system certification retain their distinct meanings. |
| 10. Choose a centre | All62 published destinations; authentic emblems/photos; national/local contact where recorded; Maps, share, citations | Use a compact service-page presentation: centre/name/location/call/choice first, richer gallery/details on expansion. Preserve searchable access to every centre. Add speech-specific availability wording and keep selected centre in the enquiry. | Opt-in compact variant; do not remove the directory or silently alter the standalone centre page. Keep full local phone if source has one. Do not invent missing contacts or ratings. |
| 11. Resources and FAQs | First-visit and teacher-observation resources; six current useful questions | Make cost, first visit, clinician/centre confirmation, communication methods, family role and progress review easy to answer. Add only questions the page answers usefully; keep visible/schema parity. | Short question-based accordions and printable/shareable guides. |
| 12. Closing invitation | Hope, national number, assessment and centre route | Connect the close to the parent's priority: “Tell us what you want your child to be able to communicate and do.” State the useful next step clearly. | Strong call, approved assessment offer, no additional competing primary CTA. |
| 13. Common footer | Entire accepted footer including Verify/citations | No change. | Reuse the tagged baseline. |

The objective is a complete story with a shorter route to understanding and action. Preserve useful detail through structure and disclosure; do not shrink body text or strip the page into a generic landing page to reduce scroll length.

Resource-block amendment: add the curated government-owned India/international guidance specified in the discovery addendum. Replace the existing private ASHA general-guidance links with relevant government sources or remove the redundant reference; do not relabel a government resource as supporting a claim it does not contain. Pinnacle's original Verify evidence and citation trail remain distinct from external parent guidance.

## 3. Creative jobs

### Preserve/reuse

- Existing mother/child hero, original speech OG poster, emblem, colour system and organic shapes.
- Age-range artwork where the scene fits. Its tiny embedded labels are not a substitute for readable nearby HTML.
- Actual centre photographs and logos; no synthetic photographs of a named real centre.

### Two priority original creatives

1. **A useful first conversation.** Parent, child and Pinnacle therapist exploring communication through play, with a visible child choice and collaborative discussion. Full-sleeve white professional coat with approved Pinnacle Blooms Network emblem/name; tasteful PinnacleAI background frame and source-backed licence reference panel. Render complete composition/typography as one branded creative, using the approved built-in ChatGPT image tool. Copy is about clear priorities and a first step; no fake certificate facsimile or invented professional qualification.
2. **From asking to using the ability.** Three connected scenes of a chosen communication method, use with another familiar adult/in an everyday setting, and parent/professional review adjusting the next practice. Same child/family visual continuity; clear labels, brand palette, approved emblem and professional attire. This replaces the existing unbranded purple-scrub professional example where it misses the agreed visual standard.

Create responsive compositions, not a wide poster shrunk until labels disappear. Art direction: landscape composition for desktop (target3:2 or16:9 appropriate to the block), a purposeful portrait/stacked mobile composition where needed, responsive WebP/AVIF derivatives, explicit dimensions, sensible file budgets and HTML labels/alt covering the useful content. Use actual available tool output sizes; do not claim a specific model version that the tool has not confirmed. No external API-key generation route is authorised by this review.

The seven-stage diagram should remain accessible HTML/SVG where text and relationships need to stay sharp. Do not regenerate every image to satisfy an asset count.

## 4. Search, answers, citations and sharing

1. Preserve the existing indexed canonical and aliases. Its national title is already present; do not revert to a Delhi/Hyderabad/Bengaluru-only title or create city keyword clones.
2. Keep the clear title; strengthen description with the parent benefit, actual FREE assessment and next action. Candidate: “Help your child be understood. Explore speech therapy at Pinnacle Blooms, find a centre and arrange a FREE assessment. Call 9100 181 181.” Review with the final visible copy.
3. Use direct, quotable HTML answers under clear headings: what speech/language therapy supports, how a first assessment works, assessment versus ongoing therapy cost, what progress review looks like, family participation and centre choice. Avoid keyword lists and hidden answers.
4. Keep the service/organisation/brand/offer/FAQ/breadcrumb identities and matching visible content. GSC indexing and valid schema do not establish a knowledge panel or AI recommendation. Google documents no special AI schema or extra machine file requirement.
5. Improve contextual interlinks: the speech worked example, relevant PinnacleAI module explanation, integrated Autism Therapy and appropriate other therapies, selected centre and exact Verify evidence. Retain links already working.
6. Synchronise evidence JSON/TXT, reading aids, source dates and FAQ/schema only where content changes. The old-edition service-facts provenance should resolve to a durable archived source or a current attributable source rather than a previous-content hash pointing only at today's URL.
7. Preserve the working OG JPEG and Twitter large-image metadata. Give the page-level family share action a clear label and offer native share with copy/WhatsApp fallback; centre-level sharing already exists. Deep links should target useful stable sections.
8. Use real centre/Google Maps/Business links and source-specific ratings only when available. The directory is not proof that all62 centres currently offer Speech Therapy or share a network-wide4.8rating.
9. After a material approved release: update relevant lastmod, record the GSC state, send one justified IndexNow notification, and monitor query groups plus page outcomes. Do not repeatedly resubmit unchanged URLs.
10. Keep off-page citations/resource distribution as an accountable separate activity after the improved page is live; page markup alone does not earn external recommendations.

Official guidance: https://developers.google.com/search/docs/appearance/ai-features ; https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html .

## 5. Tracking and practical performance

- Keep the high-performing static/Cloudflare architecture. Today's lab results do not justify another platform/tool rebuild.
- Trace the injected Ads tag responsible for Lighthouse's cookie findings. Compare its consent defaults, update timing and personalisation settings with the existing managed measurement policy; retain legitimate call-click attribution. Correct in its actual shared integration if warranted, with scoped tests. This is a behaviour review, not a claim of legal non-compliance.
- Confirm coarse route-choice/section/centre/assessment/call-click events with consent using existing taxonomy. Exclude child concerns and form details. Track connected calls/visits/enrolments through the established operations process, not inferred from a tap.
- Lazy-load below-fold images and galleries, keep the hero prioritised, stable aspect ratios and readable crops. Preserve existing good speed while changing narrative.
- Improve tablet first-visit layout: avoid nesting three narrow fact columns inside one half-width column. Keep readable line lengths, consistent heading spacing and clearly identified inline links. Icons should explain actions/stages, not become decoration on every sentence.
- Actual parent comprehension and resulting calls are not yet measured by this review. They must remain distinct from editorial opinion, Lighthouse scores and indexing.

## 6. Implementation boundary and acceptance

Primary files: `SpeechPage.astro`, `speech-content.ts`, `speech.ts`, speech evidence/reading outputs and a speech-scoped style layer. Reuse `ActionStrip`, `CentreDirectory`, `HeroSlider`, `AnalogyStories`, `LifePath` and `TherapyTogether` through explicit content/variant props where necessary. Default behaviour for other pages stays unchanged. Do not edit the baseline header/footer components or stylesheet rules to accomplish speech-body work.

1. Agree this bounded block/creative contract. Prepare complete copy, images, source relationships and route semantics together.
2. Assemble once; consolidate read-only family/sales, clinical/evidence and design/search review findings. Fix actual gaps once.
3. Check phone320/390, tablet768/1024 and desktop1440; keyboard, focus, reduced motion, actions, centres, image crops, FAQ parity, metadata and evidence. Use the existing Playwright/axe/page toolchain. Check alternate engines for changed interaction components. Do not claim physicaliOS testing unless performed.
4. Verify the tagged header/footer remain unchanged. Check adjacent pages only where a shared component default could be affected.
5. Run a focused production build and relevant suites, then one final lab speed pair after material visual changes. Correct specific failures; avoid repeating unchanged audits.
6. Commit/push reviewed code before activation, stage the preserved full union, retain all routes/bindings/Verify/FSC/helpline/application behaviour, deploy, read back production and save the exact rollback/release receipt.
7. Perform the material discovery notification once, save the new measurement baseline and close the page package. Further ideas enter the backlog.

Review artefacts: `audits/speech-live-review-20261001.json`, `audits/speech-review-*.png`, cited Lighthouse folder and `SPEECH-GSC-BASELINE-20261001.json`. No synthetic lead was submitted during this review.
