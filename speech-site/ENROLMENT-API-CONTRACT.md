# Enrolment page: Cloudflare POST boundary

## Current state

The new page uses the shared Pinnacle header, navigation, evidence prefooter and footer. It is published as a **non-submitting, noindex design preview** at `/pinnacle-pages-preview/enrolment`. The current live enrolment route and backend are preserved. No API endpoint or credential is configured in this preview.

The owner will supply the API; PinnacleAI will handle the downstream workflow. This document describes the **proposed frontend contract**, not an assertion about an existing backend. The implementation owner in this task will connect the supplied API and perform the final release. The backend repository is not required.

## Page source and activation

- Shared page: `src/components/EnrolmentPage.astro`.
- Preview entry: `src/pages/enrolment-preview.astro`.
- Interaction and submission state: `public/pinnacle-pages-scripts/enrolment.js`.
- Single transport/response boundary: `public/pinnacle-pages-scripts/enrolment-api.mjs`.
- Styles: `src/styles/enrolment.css`.

Once the supplied API contract has been matched and tested, build the live page with `previewOnly={false}` and its approved same-origin `/api/…` endpoint. Activate the exact existing canonical `/enroll-autism-speech-aba-therapies-india`; retain `/enroll` redirect and inbound service/centre preferences. The preview route remains noindex. Do not enable a simulated success response in production.

## Proposed request

HTTPS POST, `Content-Type: application/json`, `Accept: application/json`. A generated `Idempotency-Key` header matches the body request ID. No key or token belongs in client code or a URL. If the backend uses a different envelope, adapt the single transport boundary after its contract is supplied.

```json
{
  "schemaVersion": 1,
  "requestId": "generated-uuid",
  "contact": {
    "name": "Parent or guardian name",
    "phone": "Contact number supplied by the visitor",
    "email": ""
  },
  "preferences": {
    "service": "help",
    "centre": ""
  },
  "message": "",
  "source": {
    "page": "/enroll-autism-speech-aba-therapies-india"
  }
}
```

- Required: name (1–100 characters) and phone (7–15 digits; formatting characters permitted; preserve international intent).
- Optional: email (up to 254 characters), short note (up to 500 characters), service, preferred centre.
- Service values: `help`, `speech`, `occupational`, `aba`, `education`, `other`. `help` is the default.
- Centre values: the 62 public slugs in `src/data/centre-directory.json`, or empty for assistance. These are **location preferences**, not proof of service or appointment availability. Three lack a verified legacy facility ID. Never silently map an unknown preference to a different centre.
- Existing `entry=speech-assessment` selects speech. An explicit allowlisted `service` value takes precedence. An allowlisted `centre` is editable. Personal contact data is never read from or written into query parameters.
- No child name, birth date, diagnosis, medical upload, advertising ID, URL query or free-text analytics event is collected by the page.

## Proposed response contract

- Accepted: HTTP 2xx plus JSON `{"status":"accepted"}`. Return this only after durable acceptance into the PinnacleAI enquiry workflow.
- Rejected without acceptance: HTTP 400/422/429 plus JSON `{"status":"rejected"}`. The page preserves the details so the visitor can correct/retry or call.
- A bare 200, another JSON envelope, HTML, server failure, timeout or network loss is **uncertain**, not success. The page asks the visitor to call before sending again. It does not automatically retry or promise a booking.

The accepted message means receipt of an enquiry. It does not assert delivery to a particular staff member, a connected call, a booked appointment or an enrolment.

## Backend responsibilities when connected

Validate lengths and allowed values server-side; enforce request size, origin/CSRF rules and appropriate rate limits; honour idempotency; return `Cache-Control: no-store`; keep credentials server-side and personal details out of general logs/analytics. Route help/unspecified preferences to the appropriate enquiry workflow rather than rejecting parents who do not know which therapy to select.

The frontend sends no automatic analytics events for form start, field changes, validation or submission. API acceptance and CRM outcomes must be separately verified before any Ads/GA conversion is enabled. No acceptance is currently claimed or tested against production.

## Release checks after API details arrive

Use an approved test environment or destination. Verify one accepted request, explicit rejection, duplicate protection, timeout ambiguity and downstream receipt; then activate the live exact route. Maintain the call option `tel:+919100181181`. Retain a rollback to the current enrolment page.
