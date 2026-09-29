# Live enrolment release — 29 September 2026

Canonical page: https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india
Design preview: https://www.pinnacleblooms.org/pinnacle-pages-preview/enrolment
Browser API: `POST https://www.pinnacleblooms.org/api/enrolment`
Downstream system: `POST https://mirracle.pinnacleblooms.org/api/gl/swfs`

## Outcome

The completed Pinnacle enrolment narrative is now the live, indexable enrolment page. The form sends a small, versioned public payload to a same-origin Cloudflare endpoint. The Worker validates and translates that payload into the established PinnacleAI/Mirracle enrolment contract. The browser never calls the Mirracle endpoint directly.

The live page keeps the full Pinnacle portal header and footer, the life-first sales narrative, PinnacleAI® paradigm-shift and seven-stage explanation, four source-linked evidence cards, the 36-record Verify gateway, 62 centre choices, centre profiles and imagery, the public national number `9100 181 181`, and the short decision form. Name and phone are required; service, centre, email and a note remain optional.

## Cloudflare production record

- Worker: `pinnacle-verify-route`
- Production version 92: `6cc7fea2-f3a0-4d76-93c1-1c60a2d4de0a`
- Deployment: `5e1113e5-78df-4531-931b-fd6e844d35ba`
- Traffic: 100% on version 92 at release verification
- Immediate rollback version 91: `216165e3-3297-41ca-8209-20bc13287601`
- Rollback deployment: `1876dbd9-6434-479a-9cda-2363192a220a`
- Release directory: `release-enrolment-live-20260929` — 1,345 files, 142,322,725 bytes
- Live HTML SHA-256: `af738b0cd12516d3a7bdf47c67eeb16ea31a3b2f8240e102cb60d3a00cdc908e`

The release retained the existing `ASSETS`, `PINNACLE_ASK` service, and `SITES_BYPASS_TOKEN` secret bindings. No credential value is recorded in this receipt.

### Routes

| Purpose | Pattern | Route ID |
|---|---|---|
| Canonical enrolment page | `www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india*` | `667cfaeb19e245ebbd4fbf306c664698` |
| Same-origin enrolment API | `www.pinnacleblooms.org/api/enrolment*` | `bec1beb181ed45e7b954acfcb66a8a07` |
| Short enrolment alias | `www.pinnacleblooms.org/enroll/*` | `1d51510694904b169652466fc5279e2e` |

The canonical trailing-slash variant and the tested short aliases return permanent redirects to the canonical URL. The design preview remains available for comparison but is `noindex` and `no-store` and does not accept form submissions.

## Form and privacy boundary

The release uses a deliberately small contract:

- public input: name, phone, optional email, optional service, optional centre and optional note;
- exact same-origin `Origin` required on browser POST requests;
- `POST` and JSON only, with a 16 KiB request-body limit;
- strict server-side validation before any downstream request;
- no credential, internal facility ID or Mirracle implementation detail exposed to the browser;
- no form payload, phone number, email address or other personal data written to Worker logs;
- no automatic retry that could create duplicate enquiries;
- `Cache-Control: no-store`, `X-Content-Type-Options: nosniff`, a restrictive response CSP and no-referrer policy;
- an invalid public request returns `422 rejected` without contacting Mirracle;
- an accepted downstream response must be HTTP success with the exact body `true`; the browser then receives `202 accepted`;
- an indeterminate or failed downstream response returns `502 unknown` rather than claiming delivery.

The adapter maps the selected service to one established Mirracle value and maps 59 verified centres to their existing facility IDs. Gajuwaka, Jagadamba and USA keep their selected centre name in the message while using the established blank-facility fallback. A missing public email is translated to the documented non-personal placeholder required by the legacy contract.

## Acceptance tests in the live downstream system

Two synthetic organisation-owned test enquiries were submitted before release to prove the downstream contract. Both returned the exact Mirracle acceptance body `true`.

1. A complete synthetic record used the Gachibowli mapping.
2. A minimal synthetic record exercised the no-email and blank-facility fallback.

Both records were explicitly marked **SYNTHETIC — DO NOT CALL**, used Pinnacle's public organisation number `9100 181 181`, and contained no child, parent or family data. These are test records in the operational system and must not be treated as leads. No additional valid synthetic enquiry was sent after the same-origin adapter went live; validation then used rejected input so it could prove the browser boundary without creating another record.

## Verification completed

- Production build completed with `PINNACLE_RELEASE=production`.
- Focused automated suite: 33/33 passed.
- Live canonical page: HTTP 200 and byte-identical to the staged release.
- Live HTML: indexable, self-canonical and carrying the expected search and AI-reading signals.
- Preview: `noindex`, `no-store`; POST rejected with HTTP 405.
- API: GET rejected with HTTP 405; invalid same-origin POST rejected with HTTP 422; the invalid request did not reach Mirracle.
- Three tested aliases returned HTTP 301 to the canonical enrolment page.
- The sitemap and `llms.txt` both contain the canonical enrolment URL.
- W3C HTML validation: zero errors and zero warnings.
- Narrative validation: 62 centre choices and three purposeful visual-story images present.
- Browser accessibility-tree review confirmed one H1, full portal navigation/footer, enabled form, query-driven service selection, 62 centre options, correct phone number and the expected PinnacleAI/evidence sections.
- `/verify/`, its evidence register, the FSC PDF, the PinnacleAI regulatory journey, the national autism helpline and `robots.txt` remained byte-identical to the pre-release baseline.
- Existing `/payonline` behaviour remained available through its origin redirect.
- Cloudflare readback confirmed all expected bindings after deployment.

The checks establish deployment integrity and form transport. They do not establish organic ranking, campaign conversion rate, an appointment outcome, physical Safari/iOS behaviour or field Core Web Vitals; those require observed production data or device testing.

## Ranked next-page sequence

The score is an editorial build-priority score out of 100, based on search intent, conversion value, relationship to enrolment and the amount of reusable work already available. It is not a traffic or revenue forecast. Existing indexed URLs should be improved in place; do not create competing slugs.

### Wave 1 — highest therapy demand and closest to the proven page system

1. **Occupational Therapy — 97**
   Preserve `/best-occupational-therapy-center-india-proven-improvement-rate`. Reuse the life-first framework around participation in routines, learning, play, self-care and suitable support.
2. **Autism Therapy — 96**
   Rebuild `/autism-therapy` as the multidisciplinary journey hub connecting assessment, the seven-stage pathway, family participation, therapy pages and enrolment.
3. **ABA / behavioural support — 94**
   Preserve `/best-aba-therapy-center-india-proven-improvement-rate`. Use child-respecting, function-led language and precise evidence boundaries.
4. **Special Education — 92**
   Preserve `/best-special-education-center-call-9100181181`. Focus on learning access, participation, communication and practical school readiness.

### Wave 2 — decision and navigation infrastructure

5. **Child Development Assessment / AbilityScore® — 91**
   Improve the established `/assesments` route in place unless Search Console and redirect evidence justify a controlled spelling migration. Explain what families learn and how measurement changes the next step.
6. **Find a Pinnacle Centre — 90**
   Build `/centres` as the canonical network directory using the verified centre dataset, local profiles, sourced photos/emblems, Maps links, national and branch contact routes, and enrolment preselection.
7. **Child Psychological Counselling — 86**
   Improve `/child-psychological-counseling` with a clear audience, boundaries, supportive outcomes and a direct next step.
8. **Services hub — 85**
   Rebuild `/services` as the parent decision map that routes each need to the correct therapy, assessment, centre and enrolment journey.

### Wave 3 — local and supporting demand

9. **Hyderabad centre hub — 84**
   Consolidate the existing Hyderabad canonical rather than launching a competing city slug; connect every verified branch and service page.
10. **Sensory Integration — 82**
    Consolidate legacy routes and explain participation-focused support without overclaiming a diagnosis or result.
11. **Child Physiotherapy — 79**
    Improve `/physio-therapy` around mobility, access, participation and coordinated goals.
12. **Parent Training / Everyday Therapy™ — 78**
    Improve `/parent-training` as the family-guided everyday-practice and generalisation page, linked from every therapy journey.

The immediate next build is Occupational Therapy, followed by Autism Therapy, ABA and Special Education. The same shared header, footer, typography, centre data, Verify evidence gateway, phone treatment, enrolment preselection, machine layer and release checks should be reused rather than rebuilt for each page.

## Source of truth

- Public source release: https://github.com/drkotireddysaripalli/pinnacle-research-library/commit/f524e559d76541f93cf8737725b7bf434c21721f
- API contract: `ENROLMENT-API-CONTRACT.md`
- Live adapter: `deployment/enrolment-handler.mjs`
- Release configuration: `deployment/wrangler-enrolment-live-20260929.jsonc`
- Production validation record: `deployment/enrolment-live-production-20260929.json`
- Machine-readable release receipt: `deployment/release-enrolment-live-20260929.json`
