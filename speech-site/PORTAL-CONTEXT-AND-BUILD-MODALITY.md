# Pinnacle portal context and build modality

29 September 2026 · Authoritative operating context for the managed Pinnacle portal pages

## Why this document exists

The released Speech Therapy and Enrolment experiences were produced through a deep, multidisciplinary process. Their quality must not be traded away merely to reduce Codex usage. Efficiency comes from retaining the decisions that matter, discarding superseded exploration and avoiding repeated work on unchanged systems.

This document is the compact, durable context for future page work. It does not replace the project's evidence, code, release receipts or the deeper standards listed below. It tells the implementation owner what must be remembered, what must be loaded for the active page and what can remain historical unless a change requires it.

## Authority and context-loading order

For a new page or material page revision, read in this order:

1. `AGENTS.md` for execution ownership and claim boundaries.
2. This document for the portal-wide experience and working modality.
3. `PORTAL-PAGE-INVENTORY-20260929.md` for the canonical therapy, centre and PinnacleAI® sequence and URL roles.
4. `PINNACLE-PAGE-CREATION-WORK-ORDER.md` for the reusable page brief, production sequence and 100-point rubric.
5. `ACTIVE-PAGE-WORK-ORDER.md` for the one page currently being built.
6. The current shared components, typed content contracts and relevant evidence records.
7. The exact original sources supporting claims used on that page.
8. Historical standards or release receipts only when the active work depends on them.

The conversation history remains useful evidence of intent. Current decisions committed in these files govern implementation when old exploratory wording conflicts with a later settled decision.

Occupational Therapy's life-first correction was released in Worker v125; the ABA Therapy page and shared mobile menu in v126; and the Autism Therapy integration hub in v127. Their dated receipts and practical reviews are in this project. The accepted future-page operating standard is `PINNACLE-PAGE-CREATION-WORK-ORDER.md`. The nine PinnacleAI product narratives and images were corrected in v129. Child Development Assessment and the named cross-therapy/header corrections are released in v130. `ACTIVE-PAGE-WORK-ORDER.md` retains the completed Assessment contract; `PORTAL-PAGE-LEDGER-AND-SITEMAP-20260930.md` and `PORTAL-NEXT-WORK-ORDER-20260930.md` define the 20-route current portfolio and the next local/search-estate work.

Current continuation, 30 September: Suchitra v131 is released, making **21 managed public pages**. `ACTIVE-PAGE-WORK-ORDER.md` retains the completed Suchitra contract. The full sitemap register and navigation register distinguish released pages, retained legacy sources and exact next conditions; the remaining centre population is **59 standalone profiles plus two contact-page sections**. The older 20-route statement above describes v130 history.

Do not reread every historical release note, repeat every earlier audit or reconstruct settled design decisions for each page. Do not reduce the page to a generic template or thin prompt merely to save usage.

## The non-negotiable outcome

Every page must help a parent, family member, caregiver, teacher or professional understand how the particular service contributes toward the child's growing independence, inclusion and participation in everyday life.

The child's self-sufficient, mainstream-included and wonderful life is the purpose. That purpose shapes:

1. the capabilities to understand;
2. the goals to choose;
3. the methods and people to involve;
4. practice in therapy and everyday life;
5. observation and measurement;
6. review and correction; and
7. the next step.

Therapy is never presented as an isolated activity or an end in itself. AbilityScore®, the seven Readiness Indexes and PinnacleAI® support the journey; none replaces the child, family, clinician or desired life outcome.

## What made the released pages work

The portal experience succeeds because it combines all of these layers rather than optimizing one in isolation:

- an emotionally clear parent journey;
- a strong, confident Pinnacle sales voice;
- service-specific clinical usefulness;
- the life-first PinnacleAI® paradigm shift;
- visible proof placed beside the statement it supports;
- authentic centres, people, places and practical next steps;
- shared brand, navigation and authority systems;
- search, answer-engine and machine-readable structure;
- fast, accessible responsive delivery;
- real call, enrolment and centre routes; and
- careful regulatory and research boundaries.

Future pages must preserve this synthesis. Reusing components is expected. Reusing generic narration without adapting it to the service is not.

## The narrative contract

### Voice

Pinnacle speaks directly and confidently to the visitor. The visitor should recognise their child's life in the page and be able to imagine a clear next step. The page is neither a textbook nor a detached third-party review.

The voice should feel like an experienced founder, scientist, clinician, parent ally and responsible seller speaking together with one purpose. It must remain understandable, warm and concrete.

### Parent journey

The complete page ordinarily moves through this decision sequence:

1. **Recognition** — show the everyday concern or opportunity that brought the family here.
2. **Life outcome** — name the growing independence, communication, learning, routine or participation that matters.
3. **Service role** — explain what this therapy or service contributes in plain language.
4. **Why fragmented activity is insufficient** — show why each technique needs a purpose in the child's whole life.
5. **Pinnacle difference** — show how the life-first paradigm determines abilities, goals, methods, people, practice and review.
6. **Mechanism** — follow one understandable goal from starting picture through action, home/school use, observation and adjustment.
7. **Seven-stage journey** — connect the service to the established parent-facing lifecycle without inventing a new protocol.
8. **Family agency** — make the family informed participants in priorities, practice, observations and review.
9. **People and place** — show relevant centres, service access and verified professional facts.
10. **Proof** — place regulatory, research, operational and source links beside the claims they actually support.
11. **Practical certainty** — explain first visit, offer, fees or next-step boundaries that are truly known.
12. **Action** — call 9100 181 181, find a centre or begin the appropriate enrolment journey.

The opening should sell the meaningful outcome before asking the visitor to study the system. Deeper explanation remains available for the visitor who needs proof.

### Analogy

Use analogies only when they clarify the whole-life principle. A home is more than its bricks; a car is more than its parts; a child's life gives individual therapeutic activities their reason. Keep the wording human and brief. Do not imply that all prior practice or every professional has ignored whole-life outcomes.

### Selling discipline

The page must sell a better direction and a credible way to begin. It must not promise cure, guaranteed independence, school admission, graduation or a particular outcome. Avoid unsupported `world's only`, `world's first`, competitor denigration or regulatory endorsement language.

The practical sales proposition is:

> Start with the life you want your child to grow toward. Understand the child's current capabilities, choose meaningful goals, connect the right people and methods, carry the work into everyday life, observe what changes and keep correcting the plan with clarity.

## The seven-stage lifecycle

Use the current parent-facing lifecycle consistently:

1. Identify capabilities and establish AbilityScore® measurement.
2. Forecast readiness and form a child-specific plan.
3. Deliver appropriate integrated therapies and intervention.
4. Support parent-guided everyday practice and home generalisation.
5. Track progress and correct the plan.
6. Reassess and repeat toward readiness.
7. Work toward growing independence, school readiness, mainstream participation and a wonderful life.

The stages are a coherent explanation of the journey. They are not a promise that every child reaches the same endpoint or follows the same timing.

## Shared shell contract

The v126 shared shell is the current published foundation. Its compact phone/tablet navigation and mobile More-panel section order were changed once in the common sources and verified across all ten managed pages:

- `src/data/portal-navigation.json` is the common navigation source.
- `src/layouts/PageLayout.astro` renders `SiteHeader.astro` and `SiteFooter.astro`.
- `SiteFooter.astro` contains the shared Verify evidence library and portal footer groups.
- A deliberate shared-source change propagates to all managed pages on the next build.
- A service page changes its content area; it must not fork or recreate the global shell.

The authority sequence remains:

1. **Verify** — `4 Billion DataPoints for 900Million Children`
2. **PinnacleAI®** — `CDSCO, BIS, India Certified SaMD`
3. **Research** — `Study Journals & Publications`
4. **AbilityScore®** — `Proven 0 - 1000 Universal Metric`
5. **7 Readiness Indexes** — `Your Child Life As it could be`
6. **Self-Sufficient** — `Growing everyday independence`
7. **Mainstream** — `School & community participation`
8. **160Yrs Paradigm Shift** — `Life-first child development`
9. **Citations** — `Quote · link · download`

Do not casually rewrite this owner-supplied strip. Claim-specific detail and limitations remain available through Verify.

## Brand and visual language

- Retain the official Pinnacle identity and Sintony typography for English pages.
- Use luminous white space, deep navy copy, vivid Pinnacle purple/pink, teal and purposeful red accents.
- Avoid dull page-wide gradients, dark fantasy styling, dense certificate walls and repetitive corporate cards.
- Use human photography, organic scenes, pathways, icons, diagrams and typographic blocks to move the story forward.
- Mother, child and family participation are recurring human anchors where appropriate.
- Credentials validate the journey quietly; they do not displace the child.
- Essential narrative remains real HTML. Images enhance it rather than containing essential text.
- Use real centre exteriors, interiors and emblems only for the correct centre and with approved provenance.
- Generate new artwork only when existing assets cannot explain an important narrative moment. Lock the narrative before generating it.
- Give every meaningful image useful alt text. Decorative images use empty alt text.

Responsive presentation must work at 320 px mobile width, common mobile widths, tablet and desktop. Navigation, calls and disclosures must remain keyboard and touch usable.

## Evidence and claims

Every material claim must map to the relevant source, scope and date. Link to the specific evidence page rather than repeatedly linking to the homepage.

Key boundaries include:

- PinnacleAI GPT-OS is a non-diagnostic developmental-support Class B SaMD.
- MD-5 establishes the licensed manufacturing scope printed on the instrument; it does not prove every care outcome.
- BIS and management-system certifications support their documented scopes; they do not guarantee a child's result.
- The Free Sale Certificate supports lawful Indian marketability and export subject to the importing country's law; it is not foreign registration.
- Research preprints, protocols, datasets and peer-reviewed results must be labelled accurately.
- A profile, registry request or directory listing does not constitute institutional endorsement.
- A call click is not a connected call. A form response is not an accepted lead unless the receiving system confirms acceptance.
- Reviews, ratings, service availability, professional qualifications and centre details require current evidence.

Use the locked qualifier whenever the `97%` claim is used:

> 97% proven improvement, measured across 31 Million+ therapy services and validated across 12 clinical studies.

Do not add a free assessment, exact price, turnaround time or operational promise unless it is confirmed for the active page and current campaign.

## Search, AEO and machine layer

Each page must have one useful intent and one established canonical URL. Do not create doorway pages or near-duplicate keyword pages.

The page package normally includes:

- unique title, description, H1 and stable section anchors;
- canonical and appropriate index/follow directives;
- coherent internal links to service, centres, enrolment and evidence;
- visible direct answers that remain useful without scripts;
- structured data matching visible content and eligibility rules;
- Organization/brand/operator identities kept distinct and connected accurately;
- Breadcrumb, Service, FAQ, Dataset, Article or other types only when applicable;
- valid licence fields for datasets and other required properties;
- useful JSON/text/Markdown exports where they add machine-readable value;
- relevant `llms.txt` and sitemap inclusion;
- Open Graph and social sharing image/data;
- crawlable citations and source trails;
- performance, accessibility and semantic HTML; and
- one justified indexing notification after material publication.

Markup does not establish ranking, indexing, knowledge-panel inclusion or AI citation. Record submission, discovery, indexing, ranking, referral, citation and conversion as separate states.

## Conversion contract

The national display number is **9100 181 181** with `tel:+919100181181`. It must be prominent, readable and described accurately.

Each page should connect the visitor to the most relevant action:

- call for guidance or a service conversation;
- find a Pinnacle centre;
- begin the approved enrolment journey;
- share or save a useful resource; or
- inspect the relevant proof.

The page should explain why the action matters before repeatedly asking for it. Forms should request only what is needed for the next conversation. Privacy and consent boundaries remain intact.

## Working modality

Outcome quality has priority over an artificial turn, token or agent quota. Usage is reduced by eliminating repetition, not by removing necessary thinking.

For each page:

1. Inspect the existing canonical, search intent, current source and relevant evidence.
2. Write or update the active work order with service-specific decisions and unresolved evidence conditions.
3. Reuse the shared shell, data contracts, centre directory, evidence gateway and release plumbing.
4. Develop the complete narrative and visual system as one coherent page.
5. Obtain focused read-only reviews for parent/family, sales/acquisition and claims/evidence perspectives when the change is substantial.
6. Resolve review findings in one consolidated implementation pass where possible.
7. Validate the changed page and any genuinely affected shared systems.
8. Review mobile, tablet and desktop after the meaningful implementation is assembled.
9. Commit and push the reviewed source, then deploy the coherent release candidate once and verify production at the required boundaries.
10. Save release evidence, rollback information and the visibility ledger; commit and push the receipt.

The main task retains code, build, browser, submission and deployment ownership. Review agents remain read-only. Use them when independent review materially improves the result; do not create arbitrary agent or task-count quotas.

Do not redeploy or rerun the complete estate for every sentence edit. Do rerun broader checks when a shared component, Worker route, schema generator, evidence source or global asset changes.

## Completion gates

### Bounded page-release gate

Complete each page in one controlled pass:

- [ ] **Freeze scope.** Record the canonical, parent promise, primary action, evidence limits and acceptance checks in `ACTIVE-PAGE-WORK-ORDER.md`. Put later ideas in the backlog; they do not reopen this release.
- [ ] **Lock the image.** Select or generate the visual after the narrative is fixed. Confirm provenance, crop, alt text and responsive use; do not regenerate after it passes unless a concrete defect is found.
- [ ] **Implement once.** Assemble the page, machine and social surfaces, and resolved review findings into one coherent release candidate.
- [ ] **Run focused checks.** Test the changed page and only shared systems actually touched. Do not repeat a passing check unless code, content or a dependency changed, or a live defect appears.
- [ ] **Save reviewed source first.** Commit and push the exact candidate after the checks pass, before production deployment.
- [ ] **Deploy once.** Release that candidate through the established full-union Cloudflare route and preserve rollback details.
- [ ] **Check live once.** Read back the canonical, key image, primary action, sources and schema, responsive view, and named protected routes.
- [ ] **Record and move on.** Write the release receipt and ledger entry, commit and push the receipt, mark the work order complete and advance to the next inventory page.

Reopen a completed gate only for a specific failed check, a live defect, new material evidence or an explicit scope change. Every reopened item must identify the affected file, route or response; speculative re-analysis is not a release task.

A page is complete only when:

- its parent and sales narrative is coherent from opening through action;
- the service-specific mechanism and the Pinnacle life-first difference are understandable;
- factual claims have matching visible sources and accurate limitations;
- centre, call and enrolment actions work as represented;
- structured data agrees with visible content;
- social, machine-readable, sitemap and internal-link surfaces are updated where applicable;
- mobile, tablet, desktop, keyboard and core performance checks pass;
- production serves the intended bytes/routes without regressing protected pages;
- source is committed and pushed;
- temporary build artefacts are removed; and
- the release ledger distinguishes technical completion from later search or commercial outcomes.

## Deeper references

Load these only when the active work needs their detail:

- `LIFE-FIRST-THERAPY-PAGE-SYSTEM-20260927.md` — the organising principle and reusable therapy blocks.
- `PORTAL-PAGE-INVENTORY-20260929.md` — the canonical build sequence, page roles and cross-link graph.
- `FINAL-NARRATIVE-AND-PAGE-STANDARD-20260927.md` — detailed Speech Therapy narrative, visual, search and commercial reasoning.
- `IMPLEMENTATION-WORK-ORDER-20260928.md` — detailed 16-package implementation and release example.
- `RELEASE-OCCUPATIONAL-THERAPY-V125-20260930.md` — current managed shared-shell production state and rollback receipt.
- `PINNACLE-PAGE-CREATION-WORK-ORDER.md` — canonical reusable brief, release steps and review rubric; read this before the active page order.
- `/verify/` and its evidence records — current public proof and citation trail.

This is the operating compression of the proven work. It preserves the outcome while preventing superseded exploration and unchanged verification from consuming every future build.
