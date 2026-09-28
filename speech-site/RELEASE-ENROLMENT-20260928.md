# New enrolment page — design and POST boundary

The owner requested a new, simple, outcome-oriented enrolment page using the shared Pinnacle header/footer. The owner will supply the Cloudflare API; PinnacleAI owns downstream processing. Backend repository discovery is no longer a prerequisite for this page.

## Delivered

[Review the new page](https://www.pinnacleblooms.org/pinnacle-pages-preview/enrolment).

- Full shared portal shell, official brand assets, Sintony typography, vivid Pinnacle colours and the 36-record Verify prefooter.
- A clear family goal, prominent `9100 181 181` / `tel:+919100181181`, short form and next-step explanation.
- Only name and mobile required. Service choice defaults to “Help me choose”; 62 centre preferences are grouped and sorted. Email and short note are optional and collapsed.
- Existing speech entry and valid centre preferences are preserved and editable. The three locations without verified legacy facility mappings remain preferences, never invented IDs.
- Error summary, keyboard focus, native autofill hints, visible focus states and no-JavaScript call fallback. Fields and button remain disabled until handlers load; native form method is POST.
- Proposed same-origin JSON POST adapter with idempotency key, explicit accepted/rejected envelopes, timeout/uncertain state, no automatic retry and no client secret. See the [proposed contract](ENROLMENT-API-CONTRACT.md).

The review page explicitly does not submit and cannot make a booking. Its button checks the preview. It has noindex/nofollow/nosnippet, no-store, no-referrer, `connect-src 'none'`, `form-action 'none'`, and rejects POST with HTTP 405. It is excluded from sitemap/submission. Existing live enrolment is unchanged.

## Shared-page corrections in this release

Service-specific enquiry labels/URLs now drive the hero and mobile action instead of leaking the speech FREE offer into every future service. Centre directory callers can supply their own page/enquiry context. Speech guides now have their own canonical measurement context and breadcrumb parent. Revision dates and social-image MIME metadata are populated.

The conversion research card now links to the research-status library instead of repeating the historical numerical comprehension claim. Original source/navigation remain accessible. The research evidence export carries its actual revision date.

## Validation

- 34 automated tests passed: form boundaries, explicit acceptance semantics, timeout behaviour, fixed analytics vocabulary, consent, exact routes and existing enquiry runtime.
- Five HTML documents passed Nu validation with zero errors/messages (four public speech documents and enrolment preview).
- Enrolment layout checked at 320, 390, 768 and 1440 pixels in Chromium. No horizontal overflow; browser-verified no-JavaScript fields/button disabled, clear errors and focus, valid local synthetic preview with no transmission, selected speech/centre retained. This is not physical iOS/Safari certification.
- Independent parent/family, sales and evidence source reviews completed; the no-JavaScript privacy issue was corrected and the final preview cleared.
- All **587 template assets** matched production hashes. All **634 Verify assets** and existing shared Worker logic were preserved.
- Verify, evidence register, FSC PDF, PinnacleAI story, helpline and live enrolment matched pre-release bytes. Payment remained HTTP 200; dynamic payment page bytes are not claimed identical.
- Production preview responds 200; POST responds 405. No real family data or production API request was submitted. No ranking, AI citation or conversion improvement is inferred from these checks.

## Hosting and rollback

- Worker: `pinnacle-verify-route`, version **87**, `8f09e142-9bda-491b-9b56-1e3160ac22a0`.
- Deployment: `c15a2009-3bf8-43a1-b89a-69fcaaf69fc3`.
- Four modules and three existing bindings retained; complete union contains 1,221 files.
- New route: `www.pinnacleblooms.org/pinnacle-pages-preview/enrolment*`, ID `813b27a610824301acee958f485f4778`. Handler serves only the exact preview path; unrelated suffixes fall through.
- Roll back to v86 `e5e0574b-e2de-468e-9b5e-f15967e62249` and remove that single new preview route to restore pre-release routing. Preserve other routes and bindings.

## Remaining activation condition

Connect the owner-supplied API, reconcile its actual field and response contract, verify an approved test request and downstream receipt, then activate the existing live enrolment canonical. The frontend is built; API acceptance and live enrolment activation are not claimed complete. Code/build/release ownership stays in this task.
