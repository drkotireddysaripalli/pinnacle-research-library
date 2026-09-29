# Shared Pinnacle header and evidence footer — production release

**Released:** 29 September 2026  
**Worker:** `pinnacle-verify-route`  
**Production version:** `d1c072fb-f4d9-4527-bb9a-d8eb759f5c5a` (v101, 100%)  
**Deployment:** `79f02222-d102-4edb-bf1e-05d53d7ed6da`  
**Rollback:** v100 `e4e2c877-77a0-4a3d-af3a-0dd02b5e5db5`, deployment `1497423b-007e-4335-85c2-4cdab3e451ba`

## Result

All five managed production pages now render one maintained header and one maintained footer. `SiteFooter.astro` owns the footer boundary: `VerifyFooter` is its first section and the complete purple Pinnacle portal footer follows within the same semantic `<footer>` element. The Verify library is therefore part of the footer itself, rather than a separate page block.

The header prioritises PinnacleAI®, Verify, Research, Whitebook, News, Centres, Contact and Enroll. Donate was removed. The header and footer centre/enrolment destinations use their canonical routes, and the national telephone remains `9100 181 181` / `tel:+919100181181`.

Managed routes:

- `https://www.pinnacleblooms.org/top-speech-therapy-center-india-proven-improvement-rate`
- `https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india`
- `https://www.pinnacleblooms.org/speech-therapy/service-information`
- `https://www.pinnacleblooms.org/speech-therapy/first-visit-guide`
- `https://www.pinnacleblooms.org/speech-therapy/teacher-observation-guide`

## Evidence and presentation corrections

- The MD-5 footer card now describes the exact manufacturing-for-sale-or-distribution scope and retains Class B, non-diagnostic, version and age boundaries.
- The Verify opening has all 36 source records, status/scope context and the PinnacleAI regulatory-journey link.
- A CSS namespace collision that visually separated the evidence section and hid the evidence-button label was removed before v101.
- Enrolment-specific footer colour overrides were removed so the maintained purple footer is identical across every managed page.

## Verification

- Production build and thirteen portal checks passed.
- Forty-four focused routing, privacy, measurement, enrolment and release tests passed.
- W3C Nu validation returned zero messages and zero errors on the public HTML set.
- All five live pages returned HTTP 200 and `index, follow`; their normalised header SHA-256 and complete footer SHA-256 were identical.
- The live footer SHA-256 is `e0ed17cdfa388c28ca23e616a429754cce684fe55a10d754a75fa2a782ae7fa3`.
- Desktop, 390×844 mobile and 768×1024 tablet layouts were reviewed; each responsive viewport had `scrollWidth == clientWidth`.
- The final production page was visually checked at the Verify opening, the Verify-to-portal-footer transition and the footer ending.
- The shared Worker module was unchanged and 634 carried Verify assets matched their source bytes.
- `/verify/`, the evidence register, FSC PDF, PinnacleAI regulatory story, national autism helpline and `robots.txt` remained byte-identical to the staged preservation set.

The routes were already public and their URLs did not change, so no repeat IndexNow or console submission was made. Publication and crawl eligibility are verified; ranking, referral traffic and AI citation are separate observed outcomes.

## Reuse

New managed therapy pages must use `PageLayout.astro`, which mounts the same `SiteHeader` and `SiteFooter`. Edit the shared components once; rebuild and deploy to update every managed page. Service-specific content and evidence remain inside the page body.
