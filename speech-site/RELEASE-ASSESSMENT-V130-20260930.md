# Child Development Assessment and shared corrections — v130

30 September 2026 · Released

## Result

The existing [Assessment canonical](https://www.pinnacleblooms.org/speech-aba-autism-assessments) now uses the managed page system. Its story begins with a child's abilities and one everyday family question, explains the life-first purpose, shows an illustrative play example and seven connected stages, then supports a suitable first conversation with AbilityScore context, original sources, centre choices and eight FAQs. Two original branded creatives were generated through the direct built-in ChatGPT image service: a responsive editorial hero and a complete 1200×630 social poster. Source text remains HTML; no API-key image route or pasted-text composite was used.

The shared header now describes the actual MD-5/BIS scope and the 0–1000 developmental ability scale. All 20 managed public routes use the same header and the same footer containing Verify. Existing menu identities/order and accepted owner-supplied 4B wording were retained. Source correction is in the common navigation data; there is no page-specific header fork.

The release also restores seven historical Autism section targets, removes that page's closing self-link and moves its child-specific-support cue into the short opening lead. Enrolment now carries the scoped FREE speech/language assessment offer when its speech-assessment entry is used and Speech remains selected. Other choices retain generic copy. The intake endpoint, payload and acceptance handling were preserved.

## Source, deployment and rollback

- Reviewed source commit: [850968e](https://github.com/drkotireddysaripalli/pinnacle-research-library/commit/850968e), pushed to `origin/main` before deployment. Release receipts and live validators are committed afterward.
- Full Verify plus portal union: 1,593 staged files; 634 Verify static and 933 managed inventory entries verified. The authoritative Verify base Worker hash stayed `0ba020a76679e1de99a8bd5aeb7ef3e2deb37be3e2a63854955598f9e2d9627a`. Final union Worker SHA-256: `94d51ecf95d2fc2a47769592bcd855b3440cdf59e138761938728ada2de4b887`.
- Worker `pinnacle-verify-route` version **`ec9b68b7-40e6-40bd-91ba-a387983e2c8c`**, deployment **`ba8bc4c2-17e2-434f-ad62-1128e53cc6f8`**, serves **100%**. Upload transferred 35 files; 1,534 were already uploaded. Worker startup was reported as 2 ms, not a field page-performance measurement.
- Existing `ASSETS`, `PINNACLE_LEGACY`, `PINNACLE_ASK` and named secret binding remain. No `--route` deployment was used. One route was added: `www.pinnacleblooms.org/speech-aba-autism-assessments*`, ID `f7ccd4b40e5947fb914736ec8ba6abab`; the handler accepts only the canonical and trailing-slash alias, with adjacent/private paths passing through. The suffix wildcard is needed for query-bearing requests under [Cloudflare's route matching rules](https://developers.cloudflare.com/workers/configuration/routing/routes/).
- Initial full route-list output was truncated by the tool serializer. The compact integrity check ran inside the Cloudflare tool against its full current 155-route response; none of the 121 prior returned route records was removed or retargeted. All 20 managed destinations passed independent public readback. The partial baseline and its limitation are recorded instead of claiming a full historical route comparison from truncated data.
- Rollback: v129 version **`4cb916cd-5683-4ea9-829d-82ccf3f812da`**. Remove only the new Assessment trigger if restoring the origin Assessment page; keep all existing routes. Other source and binding changes are not part of this rollback.

## Verification

- Production build: 22 outputs, comprising 20 public managed pages and campaign/preview outputs. Focused route/discovery/measurement/enrolment tests: **62 passed**. Shared portal validator: **29 passed** across all 20 public pages.
- Assessment: one H1 and retained canonical; eight matching visible/schema FAQs; seven stages; four claim/source mappings and eight sources; JSON/text/Markdown exports; no general zero-price Offer or unverified India-wide service availability.
- Local Chrome at 320/390/768/1024/1440 and Edge at 390/1440: **seven responsive runs passed**. No horizontal overflow, duplicate IDs, missing local anchors or page errors. Essential image, phone, common header/footer, centre list and keyboard source disclosure passed. Three enrolment entry contexts and one intercepted accepted response passed; no test data reached production intake. Two affected Autism FAQ layouts passed. Final 390/1440 hero crops were inspected after preserving the image's brand corner.
- Public readback: nine matched HTML/assets/exports; canonical Markdown, bodyless HEAD and query-preserving trailing alias; root/service reading guides; one Assessment placement in the core sitemap, with no duplicate in the service child. The **1200×630 share JPEG is 198,642 bytes**, with fresh versioned URL. New hero WebP and script bytes match the stage.
- Shared public shell: **20 pages**, identical header after active-state normalisation, identical full footer and Verify gateway inside it. Report `deployment/shared-shell-v130-20260930.json`.
- Ten protected controls retained exact pre-release bytes: Verify, FSC record/PDF, helpline, robots, root/core sitemap and three separate legacy product pages. Report `deployment/assessment-live-v130-20260930.json`.
- One Assessment W3C Nu request returned **HTTP 429**. A new Nu pass is not claimed; the request was not repeated. Physical Safari/iOS, Firefox, field Core Web Vitals, clinical sign-off and actual operational conversion remain separate observations.

## Discovery and continuation

One materially changed Assessment URL was notified through IndexNow at **`2026-09-30T16:42:50.032Z`**, HTTP **200**. Receipt `deployment/indexnow-assessment-v130-20260930.json`. This is submission, not indexing, ranking, AI citation, a call or an enrolment. The unchanged product canonicals were not resubmitted.

The initial portfolio is now **17/17 managed priority destinations**, plus **three** decision guides: **20 managed public routes**. The domain sitemap register retains its 15-child inventory and two separately advertised roots. `PORTAL-NEXT-WORK-ORDER-20260930.md` orders centre identity/local depth, legacy canonical decisions, wider sitemap quality/privacy, professional/governance facts and evidence-based visibility/conversion work.

The centre reconciliation found **60 standalone profile URLs**, plus two contact-page fragments in the 62-entry directory: Jubilee Hills and USA. The centre sitemap contains those 60 profiles and `/centers`—61 entries, with no extra unmatched profile. These two fragments are not missing standalone pages to submit. Establish current branch facts, destination and source ownership before proposing a new page. See `reviews/CENTRE-SITEMAP-RECONCILIATION-20260930.json` and the 62-entry continuation CSV.
