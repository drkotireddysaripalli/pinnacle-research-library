# Enrolment page: production API contract

## Public page and boundary

- Canonical page: `https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india`
- Simple alias: `https://www.pinnacleblooms.org/enroll`
- Browser endpoint: same-origin `POST /api/enrolment`
- Existing PinnacleAI workflow: `POST https://mirracle.pinnacleblooms.org/api/gl/swfs`, contacted only by the Cloudflare Worker through the `PINNACLE_LEGACY` service binding to the existing `pbn-planetscale` Worker

The public form asks only for a name and contact number. Service, centre, email and a short note are optional. It does not collect a child’s name, date of birth, diagnosis, medical file, advertising identifier or URL query values as personal data.

## Public request

The browser sends JSON with an `Idempotency-Key` header matching `requestId`:

```json
{
  "schemaVersion": 1,
  "requestId": "generated-uuid",
  "contact": {"name": "Parent or guardian", "phone": "+91…", "email": ""},
  "preferences": {"service": "help", "centre": ""},
  "message": "",
  "source": {"page": "/enroll-autism-speech-aba-therapies-india"}
}
```

Cloudflare enforces the exact host, path, method, JSON content type, production origin, 16 KiB body limit, field limits and allowlists before contacting PinnacleAI. Personal details are not added to URLs, analytics or Worker logs, and responses use `Cache-Control: no-store`.

The server-side adapter calls the existing `pbn-planetscale` Worker through a Cloudflare service binding. This avoids sending a Worker subrequest back through the public `mirracle.pinnacleblooms.org/api/gl/*` route, which Cloudflare rejected with an empty HTTP 405 even though a direct external POST to the same endpoint was accepted.

## Translation to the existing PinnacleAI workflow

The Worker creates the legacy envelope required by the supplied endpoint:

- `FormType`: `Enroll`
- `Name`, `MobileNumber`: the visitor’s validated values
- `EmailId`: the visitor’s email, or the established non-person placeholder when omitted
- `Services`: one exact legacy value (`Assements - Treatments`, `Speech Therapy`, `Occupational Therapy`, `Behavioral Modification`, or `Special Education`)
- `FacilityIds`: the verified legacy facility ID when available; otherwise an empty value while the named preference remains in `Message`
- `Title`: `Mx`, the legacy form’s prefer-not-to-say value
- `Languages`: `English`, the language of this page
- `Message`: a bounded summary of the service and centre preferences plus the optional visitor note

Unknown services and centre slugs are rejected. A centre without a verified legacy facility ID is never silently changed to another centre.

## Acceptance behavior

- The existing endpoint’s exact HTTP-success body `true` becomes HTTP 202 `{"status":"accepted"}`.
- Invalid public input becomes HTTP 422 `{"status":"rejected"}` without contacting PinnacleAI.
- An origin failure, timeout, unexpected body or upstream failure becomes HTTP 502 `{"status":"unknown"}`.

The browser shows success only for `accepted`. An uncertain result asks the visitor to call `9100 181 181` before trying again, avoiding accidental duplicate enquiries. No automatic retry is performed. Acceptance confirms receipt of an enquiry; it does not claim a booked appointment, assigned professional, enrolment or agreed fee.

## Verification boundary

Before release, the supplied upstream was checked with clearly labelled organisation-number integration records containing no family or child data. Its exact accepted response was `true`, including the optional-email and no-centre fallback used by this adapter. Release validation must use local adapter fixtures and invalid production requests; it must not create repeated synthetic leads.
