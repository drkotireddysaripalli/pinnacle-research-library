# Enrolment final release — 29 September 2026

The canonical enrolment page is complete and live at:

`https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india`

## Final correction

- The enrolment body, main content and full footer now use a white canvas.
- The remaining inherited purple–pink footer gradient and footer artwork were removed only for the enrolment routes.
- Footer structure, navigation, centre links, Verify evidence links, policies, organisation identity and telephone remain intact with dark, accessible text colors.
- The retired `/pinnacle-pages-preview/enrolment` URL continues to return a permanent redirect to the canonical live form.

## Production

- Worker version 99: `7383bc5f-13c8-412a-b6ec-40c95de1f4b6`
- Deployment: `1f21b67f-1161-4024-a018-5dd7a66918d6`
- Traffic: 100%
- Immediate rollback version 98: `bf5b4a52-7ee8-4d73-a621-b80f3c8998ad`
- Live/release HTML SHA-256: `547d7866b2bdd432913fc7f4a379c27ca638480e9dc118444a9f53835a214994`

## Verification

- Canonical returned 200 and matched the staged release exactly.
- Body, main and footer computed to white with no background image or gradient.
- The mobile 390 × 844 check had no horizontal overflow; the fixed call/conversation bar rendered.
- Form remained live with `data-preview="false"` and `/api/enrolment`.
- API GET remained 405; an invalid POST returned 422 without contacting the upstream.
- All 18 focused form, adapter, routing and safety tests passed.
- Meta description is 144 characters, the JSON-LD graph parses, no review/rating schema is invented and every image has alt text.
- `/verify/`, evidence JSON, FSC, PinnacleAI regulatory journey, national autism helpline and `robots.txt` remained byte-identical.

No valid or synthetic family enquiry was submitted during this final visual release.
