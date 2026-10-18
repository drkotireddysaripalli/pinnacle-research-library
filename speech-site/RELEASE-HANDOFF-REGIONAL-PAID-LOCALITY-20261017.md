# Existing regional paid routes: centre and service handoff

Current native Search routes for24existing centres carry valid service/locality labels, but the published shared helper accepts only `pbn_network_hyderabad`. For example, `pbn_network_anantapur` with `anathapuram-ap_aba` leaves the centre unselected. Manual choice works; this is not proof of a lost enquiry.

The patch admits exactly72existing campaign/content pairs from20regional campaign labels. It also resolves the family's explicit service before deriving the shared-link centre hint. No Ads URLs or keyword/campaign entities change. Nine held or ambiguous Himayatnagar/Kondapur/Paradise routes retain fallback; explicit choices (including blank centre), unknown labels, duplicate parameters, unavailable options, service mismatches and original link fields remain protected.

Base: current canonical main `0b54751f5fe1035319598769df7ea35db67e59de`. Earlier PR105 was superseded by merged PR104; do not replay it.

## Validation

- Node24.21.0/npm11.13.0 production build passed with `PINNACLE_RELEASE=production`. An initial build without this required mode stopped on SEVA's production assertion; retained in local logs. The generic build-window wrapper cannot fingerprint symlinked dependency directories in this task worktree; the original pinned npm build ran directly.
- Focused unit/runtime suite:69tests,68passed,0failed,1existing private-receiver test skipped.
- Fixture covers all150actual existing native ad URL variants:69previously working retained;72newly infer the intended centre/service;9intentional fallbacks retained.
- Independent pure execution against the fetched public minified before-helper confirms the same69→141automatic resolutions, with no other changed result.
- Local headless Chromium:24regional centres at320px and1440px,48checks passed; intended centre/service and `tel:+919100181181` all matched;0POSTrequests,0external requests. No enquiry submitted or real call placed.
- Screenshot inspection: existing header, helpline rail and readable content retained at both declared widths. No layout source changed.

## Integration and release owner

The existing website chat retains merge, release and production acceptance. Do not deploy from this Mac worktree. Use the current complete routes, bindings, protected-service versions and full ASSETS union with declared rollback.

Required changed runtime sources:

- `public/pinnacle-pages-scripts/enrolment-routing.mjs`
- `public/pinnacle-pages-scripts/enrolment.js`
- `public/pinnacle-pages-scripts/speech-measurement.js` (must enter the full ASSETS union)
- `deployment/site-announcement-assets.mjs` (only compiled enrolment/routing payloads change)
- `deployment/site-announcement.mjs` (response contract marker)

Tests/fixtures and unit registry are included. The local browser script takes an evidence output path; it intercepts all requests and never submits. Unrelated generated page/bundle churn is excluded. The legacy-measurement runtime does not embed the changed import and need not be replaced for this patch.

Production completion requires exact integrated source/CI, guarded owner release ID and public served-helper/import-marker readback, plus representative regional form/header/footer routing and explicit-choice/held fallback checks. Use navigation only; no paid ad click, test call, enquiry POST or synthetic conversion. Local passing tests are not public deployment, receiving acceptance, walk-ins or enrolments.

Integration found and repaired a real service-page caller gap: the old analytics centre filter excluded Gajuwaka and Jagadamba from header/footer preference handoff although their forms support both choices. Functional navigation now uses the existing published alias IDs; analytics categories and all measurement logic remain unchanged. Four bounded local browser regressions (two centres at 320/1440 px) are retained in Portal quality. Five successful public-document candidate checks were reused; only the two real caller failures and two closed-preference test mismatches were repeated, all four passed.

No budgets, bidding/CPC ceilings, campaign/ad-group/ad statuses, goals, audiences, geographies, call/WhatsApp assets, consent, intake endpoints, source envelopes, storage or analytics events are changed. No new campaign or scheduler.
