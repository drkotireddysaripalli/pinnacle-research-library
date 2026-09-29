# Public enrolment preview retired — 29 September 2026

The former public design-preview URL now returns HTTP 301 to the canonical live enrolment page. This removes the non-submitting preview form that could display “Preview checked” after the live release.

- Former preview: `https://www.pinnacleblooms.org/pinnacle-pages-preview/enrolment`
- Live canonical: `https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india`
- Worker version: 98 (`bf5b4a52-7ee8-4d73-a621-b80f3c8998ad`)
- Deployment: `ee471b0f-31f0-4d09-a3e3-bc02a67c7871`, 100% traffic
- Verification: former preview returns 301 to the canonical; canonical returns 200 with `data-preview="false"` and `/api/enrolment`; API GET remains 405; invalid POST remains 422 without reaching the upstream; all 46 combined checks pass.

No valid lead was submitted during this repair. The prior confirmed service-binding acceptance remains the live transport verification.
