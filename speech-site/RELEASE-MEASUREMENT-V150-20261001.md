# Lead measurement and reusable quality tooling · V150

## Concrete change

The existing enrolment client confirms acceptance from the same-origin adapter, but did not record that boundary in optional Analytics. It now dispatches a fixed signal only after the accepted response. The shared measurement module records **consented accepted enquiry requests** once per successful page state, and covers all 48 currently managed public routes plus their approved call placements. No form/contact data, preferences, query values or request IDs are exported.

The API adapter, receiving workflow and telephone number remain the established PinnacleAI/sales system. A request count is not unique-family deduplication, an answered call or an admission. The separate Autism service preference mismatch is recorded for the next enrolment contract task.

## Reusable engineering improvement

Pinned Astro diagnostics/TypeScript, Playwright Test and axe now install from the project's lock file. `npm run check:page -- occupational` runs the bounded typing/build/unit/browser pipeline; Playwright manages an isolated loopback preview without interrupting the owner's current preview. The new GitHub Actions workflow repeats that package without deployment permissions.

Type diagnostics: 81 files, zero errors. Six focused suites: 109 passed. Phone/tablet/desktop Chromium cases at 320, 390, 768, 1440 passed; Edge and WebKit emulation passed. Firefox could not start on Windows (`spawn UNKNOWN`) and is not marked passed. The standard axe check found the OT closing guidance contrast problem, corrected by changing only `.ot-final-guidance` opacity from .93 to 1. Dependency audit reports zero advisories after removing the trial LHCI package.

## Publication contract

Candidate: `release-measurement-v150b-20261001`; paired upload: `.worker-upload-measurement-v150b-20261001`. It is derived from the verified V149 frozen stage/upload. Only two JavaScript assets, the OT stylesheet link and a new content-hashed CSS asset change. The CSS correction is derived from the frozen stylesheet and differs in that single opacity value.

1,923 other union files and all five runtime modules match V149. Page content, common header/footer, images, evidence, Verify and protected routing are preserved. Pending common-shell source changes are explicitly excluded. The Worker inventory changes only to name/hash those reviewed assets.

Rollback: V149 Worker `aee4718b-97e9-4a8b-b46b-af4e7dc43269`, stage `release-centre-voice-v149-20261001` and paired upload. Before publication: 177 zone routes, 78 assigned to this Worker, four bindings; compact route fingerprint `ced794a6`.

Upload a version through the established Cloudflare route, then deploy that version to 100% with existing routes/bindings preserved. Code must be pushed first. Verify changed public bytes, OT HTML/CSS, enrolment HTML, representative unchanged/protected routes and compact Cloudflare metadata once after publication. Do not submit unchanged URLs to IndexNow for a measurement/contrast-only patch.

## Published closure

Source commit `66ef427f8c0b566b6c6437c8b6c4be8e760bb3c0` was pushed before publication. Worker version `2ea18faa-90c4-442c-b6d0-6f8758315373` serves 100%; deployment `a86c0d6b-dd7e-4731-bc90-5593216bea33` was created at 2026-10-01T05:59:32.23273Z.

Production read-back passed: all 48 managed public HTML pages match the frozen candidate; the two scripts and new contrast stylesheet match exact bytes; eight cookie/credential/API/protected-route controls passed; Verify matches through the unchanged frozen runtime URL mapping. All 177 zone routes, 78 assignments to this Worker and four bindings are retained, with route fingerprint `ced794a6`.

Live OT browser/axe checks passed at 320, 390, 768 and 1440 pixels. No real enrolment submission was made. The [GitHub quality workflow](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/36822385410) completed successfully for the source commit. See `deployment/measurement-v150-live-20261001.json` and `deployment/measurement-v150-cloudflare-20261001.json`.

No unchanged URL was resubmitted. This release establishes instrumentation and readability, not a measured increase in enquiries, rankings or AI citations. Actual future consented accepted requests can be read as a distinct GA4 event; mixed legacy key events must not be reclassified as that count.
