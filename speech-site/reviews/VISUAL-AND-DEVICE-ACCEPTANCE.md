# Visual and device release acceptance

## Approved design and review evidence

The owner-approved common header and full footer remain the annotated tag `pinnacle-common-shell-baseline-v159-20261001` (commit99ef1634bc1147198d248f63fa1d23d0105c3cbe). `COMMON-SHELL-BASELINE.md` and `tests/fixtures/shared-authority-owner-approved.json` define the exact authority labels, subtexts, mobile behaviour, typography and footer content. Changes belong in common files once.

`enrolment-device-coverage-20261005.json` records15 hash-identified changed-section reference images and four actual cloud-device/browser runs. The Enrolment images are implementation-reviewed candidate references. They do not replace the owner's approved common-shell design or falsely record new owner approval. Future deliberate replacements require a dated reason and explicit authority; never update screenshot expectations merely to make a test green.

## Required release decision

1. Select affected journeys, templates and browsers before testing. A text/link-only correction can reuse unchanged layout/form evidence with its exact delta recorded.
2. Inspect the changed sections and shared shell: complete words, readable line lengths and contrast, image crops, non-overlapping CTAs, errors, keyboard focus, expanded menu and full footer. No-overflow assertions alone are insufficient.
3. Keep service-selection and centre handoff browser regression in `tests/browser`. Accepted/rejected/uncertain form fixtures must intercept requests; no valid production test lead without an approved destination.
4. Run local Chromium at320/390/768/1024/1440 as relevant; CI Firefox/WebKit for changed interactions. WebKit is not a physical iPhone pass.
5. For important mobile form changes use physical iPhone/Safari and Android/Chrome, plus hosted macOS/Safari and Windows/Edge. Use physical iPad, landscape, keyboard/200percent zoom and text enlargement for shared-shell/layout changes. Record skipped coverage and its risk instead of claiming every device works.
6. Compare English/Telugu glyphs and line wrapping when a translated template changes. Test default, expanded and validation-error states. Pixels do not certify physical panel colour calibration.
7. Keep source commit, live version, actual device/OS/browser version, viewport/DPR, session ID, check result, screenshot path/hash, inspector and skips together. Close paid sessions. Do not repeat the same unchanged matrix after a link-only correction.
8. Retain meaningful failures and their corrected tests in the receipt. Lighthouse is a lab measurement; field performance, real users and actual admissions need separate evidence.

## Current Enrolment boundary

Physical iPhone15/iOS18Safari and RedmiNote13/Android14Chrome passed14checks each. Hosted Safari26.3.1/macOS and Edge153/Windows11 passed16each. Tablet viewport checks ran; physical iPad did not. Older versions, landscape,200percent zoom/text and calibrated display colour are not certified. All provider sessions closed. No real enquiry or call was sent. The exact `/enroll` query-loss defect remains separate from the canonical form and is recorded as an access-dependent exception.
