# Public website delivery and remaining acceptance — 8 October 2026

## Verified delivery

The website owner in this chat delivered the shared repairs, fresh public Mirracles library, restored Everyday Therapy study and centre-to-enquiry improvements below. This is a scoped release receipt, not a claim that every item in the Ads brief or all seven priorities is resolved.

- Final portal source: `85cf7b62974f99c1e3794c67eb64186b9f5981ef`.
- Final portal version: `b9be28f3-cd77-49b7-9b89-d0fb69879cf4`; deployment: `02bb5911-4a97-43cc-be5a-5f81ccb8b09f`.
- Exact-source successful CI: <https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37716467614>. Includes the required Chrome TestingBot BVT on the built source and Firefox/WebKit checks.
- Earlier library/study asset release: source `38340ae567d8674fd45fab01fbff842a4e3f05d6`, deployment `66235fad-e754-4318-a0f8-a3dec50f587a`. The final module follow-up retains its full 3,688-asset union; the preceding 3,621 assets were preserved.
- Latest legacy directory version: `9a898e2e-d4fb-4bf9-afbc-2f38f6b33fde`; deployment: `c4c5f203-c0ae-4a76-87d8-fb713d437e7d`; bundled source `38340ae`.
- All 260 current routes and existing bindings remain accounted for. The initial release changed three declared public-library route owners and added a broad public fallback while preserving every prior route. The final module follow-up changed no routes or bindings. Ask authentication, Verify, account/report/payment services and protected Workers were retained.

## Delivered public destinations

| Area | Delivery | Public example |
|---|---|---|
| Centre journeys | All 62 recorded centre URLs return 200. 59 standard pages gained 236 therapy-specific enquiry links. Three special/status pages retain their existing handling. The Guntur phone-size journey preserves editable centre and Speech selections. These counts are website coverage, not a newly verified operating roster. | [Guntur](https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-lakshmipuram-guntur-ap-india) |
| Public Mirracles | Fresh server-rendered main, category and individual-video templates; 24 cards per directory page; pagination, related videos, current common shell and persistent contact. Source-derived routing covers 19,292 current sitemap URLs and retains 28,334 older archive links. All 11 category destinations are live. Hashtag headings are made readable, with original source titles retained. | [Library](https://www.pinnacleblooms.org/allmirracles), [Materials](https://www.pinnacleblooms.org/allmirracles/category/Materials), [Techniques](https://www.pinnacleblooms.org/allmirracles/category/Techniques), [Bean Bag](https://www.pinnacleblooms.org/mirracles/20708156700/-BeanBag-pinnaclemirracles-1autismtherapycentresnetwork) |
| Everyday Therapy study | Restored the source-equivalent study, observations from 80 parents over three months, methods, limitations and three optimized original illustrations. The program URL redirects to the canonical study and retains campaign parameters. One new entry appears exactly once in the 73-entry child sitemap. | [Study](https://www.pinnacleblooms.org/everyday-therapy-home-study), [old program URL](https://www.pinnacleblooms.org/everyday-therapy-program) |
| Mobile origin availability | Known mobile ASP.NET exceptions recover on homepage, contact, careers and research. Root Google/Facebook query variants now return 200. `/enrol` redirects to the maintained enrolment page without dropping query parameters. Recovery validates the exact known exception, destination title and canonical, preserves cookies and excludes private/API/submission requests. It does not repair the unavailable maintained ASP.NET source. | [Home](https://www.pinnacleblooms.org/), [Contact](https://www.pinnacleblooms.org/contact-national-autism-helpline-24-7), [Careers](https://www.pinnacleblooms.org/careers), [Research](https://www.pinnacleblooms.org/research-studies), [Enrol](https://www.pinnacleblooms.org/enrol) |
| Legacy reading | Nine initially closed native topic groups retain 2,001 unique directory links on each affected family. Redundant font declarations and the obstructing desktop ticker positioning were corrected; national phone handling was preserved. | [Materials record](https://www.pinnacleblooms.org/ma/therapy-materials-medicine-ball), [Ability record](https://www.pinnacleblooms.org/abilities/imitation), [Behaviour guide](https://www.pinnacleblooms.org/b/understanding-managing-spitting-saliva-tantrums) |
| Consented measurement | Validated campaign/click identifiers survive into the common GA configuration after consent. Central WhatsApp contact emits exact `whatsapp_click` once. Arbitrary private query fields are excluded; withdrawal stops measurement. Current consent defaults remain opt-in. The browser verification blocked vendor delivery and generated no production Google hits, calls or customer records. | Shared measurement source and `campaign-browser-proof.json` |

The private React account/report application at `mirracle.pinnacleblooms.org` was preserved. The fresh public library is integrated inside the main portal; no account/payment/report rebuild is claimed.

## Actual verification

Evidence folder: `C:/Users/Siri Palace/Documents/Codex/2026-09-15/k/work/website-completion-20261008/`.

| Check | Actual result | Evidence |
|---|---|---|
| Public mobile HTTP and aliases | 12/12 pass, including campaign-bearing root, contact, careers and research; both study URLs reach the restored canonical. | `public-live/report.json` |
| New-template production browsers | 12/12: Edge at 390/1440 and WebKit at 390 across main/category/video/study. Checks include overflow, common shell, phone, one H1, JSON-LD, directory cards and click-to-load player. Screenshots inspected. | `public-live/report.json` |
| Recovery phone-sized browsers | 8/8: Edge and WebKit with actual mobile user agents across home/contact/careers/research. No exception page or horizontal overflow. Legacy ten-digit national dial links are recorded separately from the international form. | `mobile-recovery-browser/report.json` |
| Physical iPhone | 4/4 templates on iPhone 13 / iOS 18.5; the changed video heading was checked again separately on that actual model/version. No real contacts or submissions. | `testingbot-public-library/report.json`, `testingbot-public-library/video-title-85cf7b6297/report.json` |
| Hosted desktop | 3/3 directory pages on TestingBot Chrome/Windows, including native summary interaction. Earlier physical-directory evidence remains dated to its original release. | `testingbot-directory/chrome-only-38340ae567-eIB4pi/report.json` |
| Bounded Screaming Frog | Eight changed URLs: all 200, indexable, self-canonical, H1 and description present. This ran before the video-title follow-up; its final title is covered by the subsequent live and physical proof. | `screaming-frog-summary.json` |
| Lighthouse — public library only | Mobile: performance 98, accessibility 100, best practices 100, SEO 100; LCP 1,868 ms, TBT 7.5 ms, CLS 0. Desktop: 100 in all four categories; LCP 475 ms, TBT 0, CLS 0. Simulated lab data, not field p75 or a whole-site result. | `audits/lighthouse/mirracles-directory-production-2026-10-08T02-20-51-519Z/summary.json` |
| Search submissions | IndexNow accepted all 80 changed canonical URLs, response 200/key validated, zero failed. Google accepted the updated study-containing child sitemap; download remains pending. | `indexnow-submission.json`, `speech-sitemap-submission.json` |

No new Ahrefs query units were consumed. The last saved completed main-site audit remains 96/100, dated 7 October, with 52,695 crawled URLs and 2,026 overlapping-error URLs. It is not post-release acceptance of this work. The existing Guru validation is started/pending; submission is not indexing or a rich-result pass.

## Remaining work and exact boundaries

| Work | Status / dependency | Owner and next condition |
|---|---|---|
| Campaign-to-CRM source and inline callback | **Not complete.** The current durable receiver has a fixed source contract; it does not yet persist landing page, UTMs and click IDs through to the CRM. Existing enquiry navigation is not the requested three-field callback form. | Website owner in this chat. Next implementation boundary: extend the protected source contract and shared callback component, with consent/minimization, idempotency and backend-accepted receipt proof. |
| Genuine call/qualified enquiry/attendance/admission linkage | **Not tested with a genuine family journey.** Production receipt table had zero rows at the recorded check; this is not zero clinic enquiries. Windsor's connected accounts do not supply the missing CRM/MyOperator outcomes. Latest mutable enrolment status is not a dated admission event. | Website owner plus existing Ads/operational owners. Trigger: a genuine accepted receipt and supported MyOperator/CRM records, with defined qualification/attendance/admission events. No synthetic lead was created. |
| Default-on measurement / notice | **Policy decision remains.** The brief itself requires counsel confirmation for its regional default-on proposal. Existing opt-in, withdrawal and personalization-off are preserved. Measurement access is still not the requested first-screen consolidated notice. | Owner/counsel for defaults; website owner for an approved accessible shared notice and accurate privacy copy. |
| Ask paid-arrival exception | **Not changed.** Conflicts with the prior owner instruction requiring human readers to sign in. A clarification is pending; public centre/service ad destinations remain usable. | Owner decision; website/Ads implementation follows it. |
| GA4 legacy key events | **Account-side status not tested.** Source emission fixes do not prove `enroll`/`contact_us` have been unmarked as key events. | Existing Ads/analytics owner, with account read-back. |
| Whole affected-site LCP goal | **Not closed.** Library lab target passes; earlier legacy-directory lab LCP was 3.6–4.5 seconds. No claim that all pages or field p75 meet 2.5 seconds. | Website owner. Next targeted performance work must use the actual remaining slow template and avoid repeating unchanged crawls. |
| Medicine-ball original photograph | **Source held.** The recorded image URL returns HTML/404. The actual MATERIAL record has no verified photo mapping; similarly numbered speech-milestone media is unrelated. | Original photo/source mapping from the owner or asset custodian. Do not fabricate or substitute an unrelated image. |
| Pitchbox | **No new reply/placement.** Inbox was empty at the recorded check. Source holds are retained; CAAS follow-up is due 16 October, not today. Prior sent email is not a placement or return on investment. | Current growth owner. Trigger: relevant reply, verified new fit or a due qualified follow-up. |
| Google/Ahrefs post-release feedback | **Pending external feedback.** Updated sitemap is accepted; IndexNow batch is accepted. Neither establishes ranking, citations or qualified enquiries. | Current website/growth owner when the existing validation/audit/download has new settled evidence. Schedulers remain stopped. |

The highest-value next website boundary is **campaign source → accepted callback/enquiry → durable CRM receipt**, followed by the real operational join. Remaining work stays accountable here; no fresh inventories, standing agents or duplicate campaign sends are needed to begin it.
