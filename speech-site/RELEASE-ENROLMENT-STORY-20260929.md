# Enrolment story preview — 29 September 2026

Published: https://www.pinnacleblooms.org/pinnacle-pages-preview/enrolment

## Completed

- Rebuilt the page around the child's life, Pinnacle's seven-stage approach and the family's involvement in decisions.
- Added three reasons to choose Pinnacle, an everyday-goal example, practical first-visit answers and four claim-specific evidence cards.
- Integrated the new family-journey illustration, responsive WebP variants, image descriptions and 1200×630 social metadata image (118,660 bytes).
- Retained the shared Sintony typography, portal header, full footer, 36-record evidence section and national call links.
- Preserved the short form: only name and phone required; services, centre, email and a brief note optional.
- Added selected-centre details for all 62 choices, with sourced emblems/photos where available, exact addresses, centre profiles, Google Maps/review links and family sharing. Photos are expandable and external centre links open a new tab to preserve the form.
- Added source-linked machine-readable citations and publication/update dates. Preview remains noindex, out of the sitemap and non-submitting.

## Review and validation

Independent editorial reviews scored the rebuild 90/100 from the parent perspective, 91/100 for warm sales traffic, 87/100 for cold sales traffic and 92/100 for evidence/SEO readiness. These are AI editorial judgments, not measured conversion performance or actual family research. All actionable release findings were addressed: visible call wording, progressive disclosure of optional preferences, a shorter mobile route to the required fields, preserving form state across external exploration, exact legal-entity evidence destination and clearer first-stage wording.

34 Node tests pass; the full suite records 40 automated checks and 15 production checks. W3C Nu reports zero errors and zero warnings for the final enrolment HTML. Browser checks covered 320, 390, 768 and 1440px; no horizontal overflow was observed. Centre selection, photo disclosure, progressive disclosure, query-driven service/centre preselection, reset, invalid-input focus and non-submitting preview acknowledgement were checked. Actual Safari/iOS devices, assistive-technology sessions and field Core Web Vitals were not tested in this release.

All 699 published template assets/documents match the build. All 634 Verify assets match the preserved source. Verify, evidence register, FSC PDF, PinnacleAI story, helpline and robots match pre-release bytes. Speech content is unchanged; Astro renamed its shared stylesheet while retaining the same content hash. Existing enrolment still works at its original route. Payment responds normally; its origin-generated body varies between requests. Shared Worker logic and bindings are unchanged.

Cloudflare version 89: `6da71d90-adc8-4daa-b160-5865ddcf6eb5`.
Deployment: `2d7bbf58-a1ea-401e-b0b8-dd40c8df4ad1`.
Rollback: version 88, `12ea6637-ca79-474c-9641-a9324d2fb29b`; deployment `983fda0f-4e66-4502-85fb-8f900b3896f5`.

## Work-order disposition

Packages 1–7, 10–13 and the preview portion of 15 are implemented. Package 8 uses existing sourced Google Maps destinations; fresh per-centre rating/count verification remains separate. Package 9 is omitted until consented, attributable material is available. Package 14 and live launch in package 16 require the owner's API and actual downstream acceptance/appointment events. The preview does not send analytics or enquiries, and no blanket 4.8+ rating, invented testimonial or guaranteed child outcome has been published.

The design and preview release are complete. This is not a declaration that live enrolment integration, paid campaign readiness, ranking gains or API delivery are complete. No search submission was made for the noindex preview.
