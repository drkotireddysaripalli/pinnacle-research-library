# Helpline design correction — 24 September 2026

Owned, built, reviewed and deployed directly in the Verify task. No delegated code or deployment.

## User-reported problem and correction

The user identified design/layout/mobile experience as the problem. Review of production at 390 × 844 showed an oversized generic heading and illustration before the call action; the primary hero call button was below the initial screen. Supporting mobile text was often 10–13px, practical first-call help appeared late, and the seven-stage pathway used cramped columns.

The updated page uses National Autism Helpline as the prominent H1, followed by the family-facing promise, a concise introduction, phone hours/languages and the main call button before artwork. Five section links provide direct navigation. First-call guidance follows the hero. Body and FAQ text are larger, centre links have larger targets, and the seven-stage mobile journey is a single-column timeline. The existing family artwork, nine assets, Telugu content, source links, ten FAQs and entity graph are preserved. The life-first purpose is explicit in the journey note.

## Checks and release

- 19 local route/content/asset/schema checks passed, zero skipped.
- Browser layout measurements at 320, 360, 390, 430, 768 and 1280px: no horizontal overflow, no broken loaded images, one H1, ten FAQs; hero call button fits in the initial viewport and above the fixed mobile call bar.
- 320 × 640: call bottom 485.61px, availability bottom 392.56px, fixed bar top 559.81px.
- Live 390 × 844: hero call bottom 488.34px, fixed bar top 775px, document width 375px excluding scrollbar, no horizontal overflow. First-call link navigates to its visible target.
- Manual screenshot review covered small-phone hero, 390px journey and 1280px desktop. Browser viewport emulation is not physical-device or Safari certification.
- Worker `pinnacle-helpline` version 8: `a109916b-662d-46ed-b32d-eb9bcbe8443a`; deployment `ce3ee9f6-aaca-4aee-9549-49491d5b239d`, 100%. No bindings, compatibility date 2026-09-23, existing route preserved.
- Rollback version: `9558007b-d624-47ed-88b7-cd6b25c31f37` (v7).
- Initial immediate readback encountered deployment propagation. Subsequent canonical readback exactly matched the built HTML; all production page/export/image/sitemap/method/HEAD/404 and homepage/Verify checks passed.
- Verify/FSC/PinnacleAI story production checks rerun successfully. Verify stays at release `3fb4d77a66085582`, 36 records and 84 sitemap pages. Google Dataset fix validation remains pending; this helpline design release makes no change to that validation.

## Honest scope

The supplied retrieval notes are implemented through public, consistent service identity, contact information, visible answers, structured data, crawlable exports and source links. Third-party model weights, forced search behaviour and guaranteed ranking are not website-controlled deliverables. No new ranking, backlink or AI-citation gain is claimed for this design correction.
