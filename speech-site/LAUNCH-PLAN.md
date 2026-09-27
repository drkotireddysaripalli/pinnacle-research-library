# Speech pilot — current release plan

Updated 27 September 2026 after the independent-review implementation.

## Current state

The complete local review implementation is in `IMPLEMENTATION-REVIEW-20260927.md`, followed by the visual rebuild in `VISUAL-STORY-20260927.md`. Both pages build, 33 page checks and eight consent/measurement tests pass. Parent, sales and evidence reviewers checked the revised source independently. Final local mobile and desktop Lighthouse performance/accessibility/best-practices scores are each 100; details and limits are in `PERFORMANCE-20260927.json`. This is an unreleased preview, not a replacement of the public speech page.

Implemented: first-visit information, dated assessment price, everyday-life example, seven-stage family pathway, optional nine technology explanations, accurate evidence, three example centres, direct enquiry-form handoff, social image/meta, structured data and optional consented CTA measurement. The old design plan is preserved in `LAUNCH-PLAN-20260926-HISTORY.md` as historical context, not current feature status.

## Retain the established URLs

| Route | Release treatment |
|---|---|
| `/top-speech-therapy-center-india-proven-improvement-rate` | Existing canonical; first selected-route release |
| `/speech-therapy` | Existing alias; retain canonical relationship until search/backlink review justifies a redirect |
| `/enroll` | Continue to existing form; the new CTA includes `#contact-form-title` |
| `/enroll-autism-speech-aba-therapies-india` | Existing form canonical; preserve processing |
| `/verify/` and `/national-autism-helpline` | Existing releases; this prototype does not change them |

`/speech-campaign.html` is a local comparison preview, not a new public destination. Do not index both designs.

## Remaining release work, in order

1. Confirm this edition's service facts through a genuine clinical/service review. Preserve the archived legacy process evidence and prepare a dated service-information record before replacing its URL. Do not invent clinician qualifications or resolve inconsistent therapy tariffs by guessing.
2. Record the public URL, Search Console and enquiry baselines. Retain useful indexed content, titles, links and canonical history when selecting the final edition.
3. Build a production-only output for the exact speech paths. Remove preview chrome/noindex only in that release; keep drafts excluded. Publish the assets under their owned namespaces.
4. Prepare the existing Cloudflare route change, current configuration snapshot and rollback. Match exact pathnames internally; preserve query behaviour, GET/HEAD, POST, private/payment paths and unrelated origin fall-through. No whole-site catch-all replacement.
5. Keep the ordinary existing enquiry handoff until the admission system's accepted-lead contract is verified. Do not show success or fire an accepted-lead conversion from a click. Test staff receipt only with an authorised test path that cannot create fake patient work.
6. Verify production consent, content-security policy and actual analytics network payload/ingestion before enabling reporting. Register the fixed placement/variant dimensions if needed. Current code excludes query strings, free text and ad identifiers; campaign attribution and connected-call measurement are not implemented.
7. Check production page/assets/metadata/canonical/robots, mobile keyboard use, social-card rendering and structured-data alignment. Run lab performance, then observe real field Core Web Vitals separately.
8. Save the exact release source, deployment version and rollback. Add only the released canonical URL to the existing sitemap if required; preserve other sitemap entries and extend existing discovery material rather than creating duplicate indexes.
9. Link the released page from relevant existing services, centres and evidence pages. Inspect/request indexing once for the material release. Track submission, discovery, indexing, queries, referrals and AI citations as different states.
10. Use real parent feedback and accepted enquiry → contacted → assessment → admission results to improve the page. Do not call an AI review score evidence of commercial success.

## Reusable page development

The same shared shell and seven-stage purpose-led narrative can support occupational therapy, behavioural support and other services. Each requires its own concerns, worked example, service facts, professional evidence, FAQs and sources. Centre pages require unique current location and team information; do not mass-generate keyword doorway pages.

The main agent in the owner's current task keeps source/build/release ownership. Independent reviewers remain read-only. The checkpoints are recorded in `AGENTS.md`.
