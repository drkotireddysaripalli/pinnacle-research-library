# Shop, Books and national helpline lead paths · 6 October 2026

## Result

The bounded contact and measurement check is complete. No source correction was justified; no production deployment or account-setting change was made. Portal remains source `ddcee0a5f9991f33d559918bd15476e94c69093b` / version `ba536ab4-f94d-4b65-a8c6-2d270e2021ee`; latest legacy repair remains source `a6bd113` / version `46fa8ad2-f64c-47e1-a78b-db27d849b331`.

Ten actual public URLs returned 200: Shop; Books; Hindi/Telugu libraries; actual English/Hindi/Telugu speech-book pages; national helpline; Speech enrolment; and Occupational enrolment with the actual Suchitra II option ID. All shared Shop/Books phone links use `tel:+919100181181`. The helpline's eight marked Pinnacle call placements use the same number; its three identified external support numbers remain distinct.

Public shared measurement SHA-256 `f2f1d9add9a7b4856921fd0d07992d7b1c08d8b3722bf124dd601d03431b9f62` exactly matches source. Helpline inline logic matches after CRLF/outer-whitespace normalization. The first read guessed a nonexistent English slug and a non-ID centre value; both were replaced with actual catalogue/form values, retaining initial evidence rather than calling this a production defect.

## Event meaning and provider acceptance

- `phone_link_click` records a consented tap, not an answered or qualified call. Calling remains available with measurement off. Existing optional advertising forwarding-number handling is preserved separately.
- `enquiry_link_click` is navigation, not accepted contact.
- `enquiry_accepted` requires the production enrolment route, consent, no GPC block, no prior acceptance event, and an accepted client response. Server acceptance requires an OK upstream response whose trimmed/lowercased body is exactly `true`. An HTTP success alone, rejection, timeout or uncertain response is not acceptance.
- Validated service/centre preferences enter the existing workflow. Centres without a legacy ID retain their labels in the upstream message. Analytics receives fixed coarse fields, without names, contact details, question text, health details or centre/query values.
- Existing commerce consent, edition IDs and prices remain. Checkout initiation is not a purchase.

Source: `public/pinnacle-pages-scripts/speech-measurement.js`, `enrolment.js`, `enrolment-api.mjs` and `deployment/enrolment-handler.mjs`. One brief read-only reviewer found no actionable gap in these gates.

## Actual Analytics configuration

Signed-in Admin confirms both streams under **PinnacleBlooms property 361649365**:

| Stream | Measurement ID | Stream ID |
| --- | --- | --- |
| Main managed website, Shop and Books | `G-2BYLRLFRDJ` | `4811231552` |
| Existing Verify/evidence, also used by dedicated helpline | `G-H9CLX1WJ7R` | `15806421407` |

Both panels report collection active within 48 hours; evidence-stream enhanced measurement is off. `phone_link_click` and `enquiry_accepted` are listed as property key events. These are configuration facts, not new visitor-conversion proof. The different stream ID is a valid same-property arrangement and needs no replacement.

## Coverage

54 current measurement/enrolment tests and 10 dedicated helpline tests passed, with 0 skipped, using isolated provider/Google stubs. No actual call, enquiry, email, payment, synthetic production conversion, new access/secret or search submission occurred. No new visual/device suite was needed for unchanged code. Earlier bag-release evidence covers 320/768/1440 px, Edge/Chromium/WebKit, hosted Firefox and physical iPhone Safari. Physical Android/iPad and older operating systems were not run for that patch. Existing enrolment browser regressions cover supported services with centre preselection and were reviewed, not redundantly rerun here.

## Remaining outcome dependency

Actual answered calls, qualified enquiries, walk-ins and admissions remain unavailable, not zero. The authorised commerce/operations thread reports MyOperator case **685868**, provider reply **6 October 10:37 UTC**, awaiting clarification of session versus agent-leg IDs, Connected versus human-answer meaning, outcome/Notes joins, forwarding and receiver acknowledgements at the already booked **7 October 11:30–12:00 IST** meeting. No duplicate escalation or routing/webhook change here.

Closure requires privacy-safe aggregates with period, channel/centre, answered/qualified definitions, duplicate/test exclusions and corresponding walk-in/enrolment outcomes. Use the existing evidence adapter. Property-wide `contact_us`, `enroll`, generic `form_submit` and total key events must not substitute for that evidence.

Detailed evidence: `../../pinnacle-growth-system/lead-path-closeout-20261006/public-readback.json`, `ga4-stream-readback.json`, retained initial read-back and existing regression/release receipts. Schedulers stay deleted/disabled. Website event semantics and stream mapping are closed; wider site health, placements, purchases and qualified-outcome programmes remain open.
