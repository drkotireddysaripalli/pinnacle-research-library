# National Autism Helpline — entity and retrieval release

Published 24 September 2026 by the Verify task, which retains ownership of this scope.

Canonical: https://www.pinnacleblooms.org/national-autism-helpline

Dedicated Worker: `pinnacle-helpline`. Version 7: `9558007b-d624-47ed-88b7-cd6b25c31f37`. Deployment: `ed07c1dc-abed-44b4-b98d-7c62d5df6b6c`, 100%. Rollback: `ed7d5f88-d0da-4e3a-825d-7be303baaf17`. Existing route `www.pinnacleblooms.org/national-autism-helpline*` remains in place. No shared Worker mutation.

## Delivered

Direct service/operator/number definition; parent concerns section; ten shared visible/schema FAQs; Service, ServiceChannel, ContactPoint, legal Organization and Brand graph linked to existing Verify entity IDs; owner-confirmed telephone hours/languages; social metadata; source/story crosslink; dated facts JSON, text and local llms reading aid; dated sitemap; preserved brand artwork, Telugu, seven-stage journey and call buttons.

Operating facts derive from the owner's confirmation recorded 22 September 2026. Telephone 24/7 and English/Telugu/Hindi apply to the phone line, not centres or clinician appointments. WhatsApp staffing and outside-provider referrals are not established. No new claim is made for either.

## Developer instructions

Keep the existing dedicated Worker route during origin website deployments. The page is served by that Worker, so copying a footer fragment into the origin does not preserve or update this page.

For updates, edit `page.html`, `build.mjs` (shared questions and entity schema), `handler-source.mjs` (exports and routing), or the existing `assets/` images. Run `node build.mjs` and `node readiness-tests.mjs`. Deploy the generated `worker.mjs` to the existing `pinnacle-helpline` Worker through version staging, inspect settings, then activate and run `node verify-live.mjs`. Runtime date is 2026-09-23; this Worker has no external bindings and embeds its nine images. Do not deploy it to `pinnacle-verify-route`.

If integrating into the origin codebase later, use generated `preview.html`, all nine assets at their exact public paths, the font licence, matching facts endpoints, canonical/redirect/method behaviour and sitemap. Validate production before removing the dedicated Worker route. Do not remove that route merely because the origin is being redeployed.

## Verification and purpose

19 local checks passed; 390px/1280px checks found one H1, ten FAQs, no horizontal overflow or broken images. Production exact-HTML comparison and page/export/image/sitemap/method/HEAD/404 controls passed. See JSON reports.

The delivery purpose is served: parents and retrieval systems now receive consistent, explicit and source-linked service facts. This does not prove new generic-query rankings, inclusion across AI assistants, or more calls. Existing search retrieval found the page on targeted queries before this release, with stale answer text in one result. Keep retrieval observations separate from post-release impact.

Cross-estate follow-up: older main-site/interventions/materials text still includes broader 16+/18+ language and free/immediate-service wording. Those are separate source/owner changes, not corrected by this isolated page release. Use the confirmed telephone fact set and avoid claiming a sitewide consistency pass is complete.
