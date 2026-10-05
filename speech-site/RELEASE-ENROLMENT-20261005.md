# Enrolment family journey â€” 5 October 2026

Action: `2050c49e-ecb4-4e18-a326-fb0e2f0bb37c` Â· Queue: `PAGE-ENROLMENT`

## Family outcome

A parent can start with a concrete daily priority, see how an observation can inform professional and family decisions, and choose a service and centre without losing those choices on the way into the enquiry form.

## Implemented

- Retained the approved heading, existing branded creatives, two required fields, 62 centre choices and common header/footer.
- Added an explicitly illustrative water-request conversation beside the form: daily priority, starting observation, professional adjustment, family role and next observation.
- Replaced the generic review example with three distinct decisions: adult prompting remains needed, the communication method needs review, or the skill needs observing in another setting. An accessible communication aid can remain part of independent communication.
- Linked the seven PinnacleAI stages and relevant therapy, evidence, centre and first-visit destinations.
- Changed narrow-screen service choices to readable single-column tiles with whole words.
- Matched nine visible FAQs, schema, page metadata, source exports and the first-party reading representation. Kept the approved social poster.
- Preserved the existing POST integration and accepted/rejected/uncertain-request states. Added persistent regression checks for every service and centre handoff, including Autism.

## Candidate acceptance

Production build:135 pages. Astro check:140 files, no errors. Six-width layout review:320,390,393,768,1024,1440px. Visible/schema FAQ parity,62 centre options, seven linked stages, four example steps and three decisions checked. Axe serious/critical checks passed at390/768/1440; W3C Nu returned no errors or warnings. Fifteen section captures retained. The independent read-only review passed after clarifying adult prompting versus independent use of an aid.

24 local Enrolment browser tests passed across four viewport projects. Accepted, rejected and uncertain submissions were intercepted fixtures; no real customer lead was sent. The first CI attempt found an obsolete route-test fetch expectation; the correction verifies the exact reading-export bytes. It did not require a page change.29 focused route checks then passed. The subsequent complete browser run detected a pre-existing visible/spoken-label mismatch in the hero Verify link; removed the overriding aria-label from the reusable HeroProofPanel so its visible wording supplies its accessible name. The page appearance and common header/footer are unchanged. Rebuilt with the required production setting and retained only the Enrolment compiled changes.

## Release and live acceptance

Live: https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india

Source9ecebd11e28da5190e53215ced1c533a126fa6a2 was pushed before activation. CI37295443216 passed. Worker23a7f5d9-fca7-42ca-9f28-b76520386cca, deployment93109c5e-1e95-4b42-bd84-b9f80f56673b is active. All194routes/fourbindings preserved;29protected responses unchanged. Six request variants,59linked destinations, exactHTML/Markdown/source/OG bytes and invalidAPI handling passed. Final Reassess destination corrected to /reassess-review-repeat.

Physical iPhone15/iOS18Safari and RedmiNote13/Android14Chrome passed14checks each; hosted macOSSafari26.3.1 and Windows11Edge153 passed16each. These ran against fab7f0b; final change only corrected the Reassess link, independently checked live. Sessions closed. Full executed/skipped record: reviews/enrolment-device-coverage-20261005.json. No real enquiry or phone call was sent.

Lighthouse mobile performance97, other categories100; desktopall100. Mobile labLCP2.434s, CLS0,TBT0. This is lab evidence, not fieldCoreWebVitals. Focused Screaming Frog confirmed200/indexable/self-canonical. IndexNow accepted one changed URL, key validated; GSC annotation82208fdf-c383-4737-a4c1-12eb728cac48 saved. These are submission/annotation, not indexing or commercial outcomes.

Known pre-existing exception: exact /enroll?service=...&centre=... loses its query before reaching this Worker. /enroll/ and direct canonical journeys preserve it. The full verifier truthfully remains false because of this separate redirect. Rulesets/page-rules API returned403 and Cloudflare dashboard requires sign-in. No blanket route, cache or access changes were made. Track CF-ENROLL-QUERY in the canonical growth queue; use the canonical URL for delivery.

Complete receipt: deployment/enrolment-release-receipt-20261005.json.

## Scope and limits

- An accepted enquiry is not a confirmed visit, admission or demonstrated outcome. Receiving-team timing and attendance have not been measured in this action.
- The family example is illustrative, with no observed response to the proposed adjustment. It is not a patient story or individual treatment plan.
- The centre directory is not a verified current service roster. Families are asked to confirm the professional, centre, fees and appointment details.
- Source claims retain their evidence boundaries. The approved header/footer, Ask/Verify/auth, other pages and full route/binding union are protected.
- Indexing, rankings, AI citations and additional qualified enquiries require subsequent evidence; tests and notifications do not establish those results.

## Reuse for the next page

When changing activeQualityPage or adding a compiled reading representation, run the existing route suite and portal-smoke test against that page before pushing. The focused form suite alone did not cover the old route expectation or the shared hero link name. The complete gate caught both before activation. Use these existing checks instead of adding another test system.
