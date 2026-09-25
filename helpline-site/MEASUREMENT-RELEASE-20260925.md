# Helpline measurement repair — 25 September 2026

## Delivered

The existing Cloudflare traffic beacon was blocked by the page's Content Security Policy. Version 11 permits only its documented script file/version path and same-origin reporting endpoint. The browser loaded the integrity-protected beacon with HTTP 200 and its report received HTTP 204.

Eight Pinnacle telephone links now carry fixed placement labels. Optional, consent-gated Google Analytics records a `phone_link_click` for each activation through the existing evidence stream. The main-site stream was excluded because its automatic enhanced measurement is enabled. The evidence stream's enhanced measurement was verified off. No stream, account, collector, advertising destination or subscription was created.

The unobtrusive choice panel appears above the footer. Google is not loaded until acceptance. Refusal and Global Privacy Control keep it off. Cookies use the helpline-only `ph` prefix and path, with a 180-day expiry. Withdrawal clears only these cookies and disables further events. This is consented, pseudonymous analytics, **not anonymous measurement or a complete census of visitors**.

## Data and interpretation

`phone_link_click` parameters: `schema_version=1`, `page_group=national_helpline`, `link_placement`, `destination=national_helpline_9100181181`. Allowed placements: `nav`, `hero`, `first_call`, `concerns`, `telugu`, `service_reference`, `closing`, `mobile_sticky`.

All events use the fixed canonical page and title, blank referrer and no query-string or fragment values. No child/caller details, call content, free text or case identifiers are read. Google still processes ordinary technical analytics metadata and a pseudonymous browser identifier after consent. Google advertising storage/data/personalisation and Google Signals are disabled in this integration.

A tap is not a connected call, unique enquiry, useful conversation or booking. The shared phone number does not identify acquisition source. Operational aggregates remain needed. Placement parameters are sent and verified; event-scoped custom dimensions have not been registered in standard GA reports. Event counts and the built-in page path are available independently of that registration.

## Verification

- 23 route/content/security checks and 10 consent/event/failure tests pass.
- Every one of the eight actual page controls produced exactly one accepted `phone_link_click` in the production browser test; all received HTTP 204.
- Google Analytics Realtime visibly showed **8 phone_link_click events** and **2 Pinnacle National Autism Helpline views** during verification. These are test activity, not organic performance.
- No Google requests before consent. A test tap after withdrawal sent no Google request.
- A harmless synthetic query/fragment marker was absent from both Google and Cloudflare reporting payloads. Google's page URL remained the canonical URL and referrer was blank.
- Mobile review at 390 × 844: no horizontal overflow, hero call control and fixed call bar visible; privacy choices do not cover the page or call bar.
- Production page matches the generated source. Facts, 12 FAQs, three independent resources, sitemap, share image, font, methods, HEAD and unrelated-path protection pass. Verify and homepage controls return HTTP 200.
- Telephone destinations remain `tel:+919100181181`. Browser tests temporarily prevented the operating system dialer from opening. That test-only handler was removed. **No real phone call was placed.** Failed-collector/non-interception behavior was separately tested in the first-party harness.

Exclude the **eight synthetic taps and two GA views from 25 September, approximately 11:51–11:55 UTC / 17:21–17:25 IST**, from launch performance interpretation. Browser consent/cookies created by testing were cleared without touching other analytics cookies. No test safeguard remains in the site or browser.

## Deployment and rollback

- Worker: `pinnacle-helpline`; existing route `www.pinnacleblooms.org/national-autism-helpline*`.
- Version 11: `ac7d9543-824b-4e1f-8cb0-b6ebaa8b9b45`.
- Deployment: `c14a7cbe-e46e-4564-bad4-80c4eeab6b48`, 100%, 25 September 2026 11:50:40 UTC.
- Generated Worker SHA-256: `ef4e709e380fc1a6841af6a7ad770dcc2b0217c2c4afc2b2a6a560b356a232d0`.
- Preserved: `bundled` usage model, compatibility date 2026-09-23, no bindings, workers.dev and previews disabled, existing routes/tags.
- Rollback: version 10 `23d7f82d-007a-4f83-8fc6-32188439a52a`.

Build and verify: `node build.mjs`, `node readiness-tests.mjs`, `node phone-analytics-tests.mjs`, then `node verify-live.mjs` after a reviewed version deployment. The live verification's first request briefly saw the preceding release during propagation; the subsequent comparison and full production checks passed.

All code/build/deployment remains owned by the Verify conversation. This release changes measurement and its voluntary controls; service promises, regulatory narrative, images, centre code and Verify content retain their existing scope.

Sources: [Cloudflare beacon and custom-event limitations](https://developers.cloudflare.com/web-analytics/faq/), [Google Analytics configuration](https://developers.google.com/analytics/devguides/collection/ga4/reference/config).
