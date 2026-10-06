# Therapy page development and independent review

## Required context loading

Before building or materially revising a managed portal page, read:

1. `PORTAL-CONTEXT-AND-BUILD-MODALITY.md` for the settled outcome, narrative, visual, evidence, machine and release system.
2. `PORTAL-PAGE-INVENTORY-20260929.md` for the canonical URL and build sequence.
3. `PINNACLE-PAGE-CREATION-WORK-ORDER.md` for the reusable page brief, release steps and 100-point review rubric.
4. `ACTIVE-PAGE-WORK-ORDER.md` for the one page currently being built.
5. Only the source records and historical receipts required by that active work.

The conversation history remains useful context, but committed current decisions supersede abandoned exploration. Preserve the depth that produced the released pages. Reduce usage by avoiding irrelevant history and unchanged checks, not by simplifying the outcome or replacing the page with a generic template.

The main agent in the owner's current task retains code, build and release ownership. Independent agents may research and review read-only. Do not delegate source edits, public submissions, browser control or deployment to reviewers.

## Execution discipline after the V163 acceptance failure · 2 October 2026

- Keep one page or bounded repair active and one implementation/release owner. Normally use one independent reviewer with the combined family, commercial, evidence and rendered-page checklist. Add another only for a named independent issue that materially needs it; do not create a separate agent for each persona or ask reviewers to spawn reviewers.
- Reviewers inspect one identified revision, sources or rendered captures and return concrete findings, locations and uncertainty. The owner resolves them in one consolidated fix list. Reopen only affected findings after a change; repeated opinion scores or repeated approvals are not progress.
- Existing completed reviewers are historical work, not an active team. Do not reactivate them without a specific bounded task or reload all their old reports. Do not archive threads or discard useful evidence just to reduce a displayed count.
- `ACTIVE-PAGE-WORK-ORDER.md` alone names the current page, next queued page and live release. Other work orders describe requirements or historical work, not competing priorities. Keep the full governing page standard; a smaller review team does not justify thinner narrative, weaker creatives, claims without sources or missing search/conversion work.
- Complete the candidate before acceptance. Use one local production build per source revision and the independent CI build; reuse unchanged assets and completed evidence. Repeat a test only after a relevant change, a failed check, or a distinct production/device boundary.
- Inspect the rendered changed sections, including the section immediately after the hero, at phone/tablet/desktop sizes. Element counts, HTTP success, image decoding, no overflow and Lighthouse scores do not establish visual acceptance. Preserve approved common-shell checks and the V163 readable-card regression.
- A release needs the exact source revision, declared test scope, inspected screenshots, preserved routes/shared shell, deployment ID and production read-back. Keep automated, visual, physical-device and business evidence separate. Do not claim a test was run from its configuration, a comprehensive pass from a narrow check, or real family feedback from an AI persona.
- Stop a loop when the same question or action recurs without new evidence. State the exact unresolved defect or external condition, select one diagnostic that can distinguish the cause, and continue independent useful work. Do not expand the review committee or reopen the entire agreed narrative.

Audit and bounded remaining toolchain improvements: `reviews/WORKFLOW-AUDIT-20261002.md`.

## Settled common header and footer

The owner requested a Git baseline on 1 October 2026. Annotated tag `pinnacle-common-shell-baseline-v159-20261001` is the approved common-file recovery point. Read `COMMON-SHELL-BASELINE.md` before any shared-shell change. Individual-page work must reuse these components; do not replace, fork or redesign them. A later explicit owner-directed shared change may supersede this baseline through its own coherent release and review.

The owner-approved Speech/Occupational Therapy presentation is fixed. Use the common navigation data, SiteHeader, SiteFooter (including VerifyFooter), portal-shell.css and readability.css. Do not compact, rewrite or hide their authority subtexts, fonts, colours, navigation lists or evidence descriptions during individual page work. Change that presentation only in response to a direct owner instruction. Keep current working URLs and policy additions. The independent wording and historical visual fixture is `tests/fixtures/shared-authority-owner-approved.json`; the browser acceptance suite enforces it. A shared change must rebuild and verify every managed page while retaining its main content and unrelated routes.

V157 applies the owner's explicit responsive follow-up in `shared-shell.css` and common components: Enrol at the right, readable phone rails, a properly isolated compact menu, initially expanded footer links and usable evidence controls. Preserve these responsive fixes together with the selected desktop design. Judge the footer's initial state and actual interactions; do not open everything in a test before asserting the initial mobile experience.

V158 removes the separate mobile header arrow/counter row at the owner's request: the nine cards already scroll, including Citations. Keep the clearer mobile Search icon/caption and existing Enrol control. Footer evidence controls remain separate and unchanged.

V159 groups the compact More directory and restores the desktop therapy subsections and footer destinations there. Opening More starts at the top; Therapies and Start here start expanded. Preserve the separate therapy page links and section disclosures, visible-opener focus restoration, and unchanged desktop presentation. All destinations stay in the server-rendered HTML.

For every substantial therapy-page change:

1. Establish the visitor's concern, a clear first step and the source-backed service facts.
2. Keep the child's self-sufficient, mainstream-included life as the purpose that shapes abilities, goals, methods, people, everyday practice and review. Do not redefine this as a score or merely a connected plan.
3. Preserve the seven family-facing stages. Optional technical explanations must not be presented as a new clinical protocol.
4. Request independent parent/family, evidence/claims and sales/acquisition reviews. Reviewers must identify inspected sources, concrete problems and remaining uncertainty. Their scores are AI editorial opinions, not user research or clinical sign-off.
5. The implementation owner resolves findings, records dispositions, and checks desktop/mobile and keyboard interactions. Verify the real enquiry destination without creating fake patient records.
6. Run the build, page checks and relevant measurement tests. Keep preview pages noindex. No ranking, AI citation, field speed, outcome or conversion claim may be inferred from markup or a passing build.
7. Save source and release notes in the existing repository. A production release must identify exact paths, preserved origin behaviour, assets, canonical, rollback and post-release checks.

Use public evidence for claims. MD-5 is non-diagnostic developmental-support software scope; BIS's named modules do not guarantee a child's outcome; FSC does not constitute foreign registration. Do not invent exclusivity, reviews, clinician credentials, appointments, patient cases or completed research findings.

Retain the established Sintony typography and vivid Pinnacle palette. The owner's 6 October vernacular requirement is implemented in `VERNACULAR-TYPOGRAPHY.md`: native Indian-script HTML uses the shared Anek contract (800 headings, 600 body, 700 controls), reused through `VernacularTypography.astro` and the common Worker transform. Keep native `lang` attributes; do not create page-specific native-font overrides. Keep the page readable on a 320 px viewport. Use selected source-backed facts and clear actions; avoid repetitive explanations and disclaimer-heavy blocks.

## Standing image standard — owner instruction, 30 September 2026

- Depicted Pinnacle therapists wear full-sleeve white professional coats with the approved Pinnacle Blooms Network emblem and name; this attire must not imply that therapists are medical doctors.
- Use tasteful PinnacleAI background frames and verified BIS/licence references as designed brand/evidence panels. Do not fabricate certificate facsimiles, regulator seals, endorsements or professional qualifications.
- Make typography, font size, vivid Pinnacle colours, clothing and expressions communicate hope, confidence and growing capability. Keep the child/family story dominant and `9100 181 181` prominent and readable at social-preview size.
- Generate complete branded creatives through the approved image-generation workflow. Preserve official logo references; avoid generic photos with pasted text boxes or a dense wall of credentials.

No child or family personal data, free-text concerns, query strings or advertising identifiers belong in general analytics. A call-link click is not a connected call; an enquiry-link click is not an accepted enquiry.
