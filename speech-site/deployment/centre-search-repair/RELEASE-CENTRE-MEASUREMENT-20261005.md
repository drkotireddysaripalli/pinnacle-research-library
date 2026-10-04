# Regional centre measurement release — 5 October 2026

## Live release

- Source commit: `7d686c139eb4137a29657d598e266746eba9c8ca`.
- Cloudflare Worker: `pinnacle-centre-search-repair`; version `a58bebc5-1ade-4e61-90b1-1dbc2d3ee482`.
- Deployment: `0b7c101e-341d-4de8-831a-631066b5fd9f`.
- Rollback: `6fabd1b2-5edc-48d4-b2c1-7d321f0df8d0` at100%.
- All194zone routes, bindings and unrelated protected Worker versions preserved.

## Delivered

Deployed consented national-call and enrolment-link events on four regional centre journeys using existing Analytics only. Added fixed centre labels to the two existing GA4 custom dimensions so GSC Wizard can report them. Source pushed, CI passed,32live centre variants and11protected destinations passed,194routes/bindings and other Worker versions preserved. No new Analytics events or fake enquiries sent by verification; business uplift remains unmeasured.

The common header/footer, visible narratives, links, artwork, styles and current enquiry handoffs were preserved. National-phone taps are intent; enrolment-link clicks are navigation. The existing enrolment page alone records API-accepted requests.

## Public URLs

- https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-kukatpally-hyderabad-telangana-india
- https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-lbnagar-hyderabad-telangana-india
- https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-labbipet-vijayawada-ap-india
- https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-anna-nagar-chennai-tamilnadu-india

## Evidence

- [Exact-commit CI run](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37242906382): successful.
-138focused unit tests passed;6affected tests rerun after adding registered reporting labels;4local Chromium centre cases passed with all external requests blocked.
-32live desktop/mobile/cookie/tracking/HEAD cases passed;11protected destinations passed. Local script removal reconstructed the8captured HTML fixtures exactly. No live test Analytics events or customer submissions.
- GSC Wizard annotation: `19552713-c2f8-4595-aab9-1a048516c122`.
- GA4 property361649365 already registers `customEvent:event_category` and `customEvent:event_label`; fixed labels use `centre_contact` and `<centre>-call|enquiry`.
- Evidence directory in parent website workspace: `work/pinnacle-growth-system/regional-measurement-20261005/` (`completion.json`, `public-after.json`, `cloudflare-after.json`, `ci.json`, local browser and test receipts).

## Limits and next observation

- New events require an existing valid analytics opt-in from managed pages; first-time or unconsented visitors are intentionally unmeasured.
- Existing legacy Analytics/GTM/Ads consent behavior is untouched and not certified by this release.
- phone_link_click is contact intent; enquiry_link_click is navigation. Neither is an answered or qualified call.
- enquiry_accepted remains gated by actual API acceptance on the enrolment page; no production submission was made.
- No observed new organic events, qualified calls, admissions, rankings or AI citations are established by this release.

Use the existing daily feedback with settled post-release dates. This change increases measurement coverage; it does not itself establish additional calls, enquiries, rankings or citations. No unchanged URLs were resubmitted.
