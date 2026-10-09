# GBP source transport and centre identity handoff — 9 October 2026

## Scope and status

This closes the bounded website review of the existing Google Business Profile UTM convention, protected enquiry receiver and three listing-identity exceptions. No GBP profile, Ads asset, customer record, authentication setting or database schema is changed here. The other native-matched centres can proceed independently under the existing listing owner's authority.

Source commit: `c820c8a4e8c107a4ed319cab72b42222a9890e31`. **Live and publicly verified on 9 October at 05:54 IST:** Portal version `3106a925-5e4b-4cdd-b211-d026ff52af48`, deployment `df99e622-e66f-48db-b596-00351ef51d8d`. Runtime receipt: `deployment/gbp-source-handoff-20261009.json`. All **307 routes**, the full **3,706-asset union**, bindings and seven protected Worker versions remain unchanged. Existing receiver stays `pbn-planetscale`, version `9ac540df-fdba-4b3f-85cc-4858859ae416`.

Exact-source [Portal quality run 37863680084](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37863680084) passed, including Ask build and TestingBot BVT. Provider-confirmed Windows 11 / Chrome 153 completed **five of five** cases (Shop, PinnacleAI, Speech, Enrolment, Suchitra), requested desktop viewport 1440×900. This is desktop functional BVT, not physical-phone, throttled-network, approved-visual or real-enquiry evidence. Receipt: [TestingBot result](deployment/gbp-source-handoff-20261009-testingbot.json).

Five public GET checks returned 200: the shared measurement asset both with and without its existing version query, tagged Anantapur centre, Kadapa centre, and Kadapa-selected enrolment. Both asset responses match the committed SHA-256. The three page bodies include the shared measurement script and existing enquiry endpoint. No browser SDK execution, customer submission or synthetic business event occurred in these delivery checks. Receipt: [public read-back](deployment/gbp-source-handoff-20261009-public.json).

## Existing receiver mapping — retained

| Meaning | Browser/public request | Protected receiver/record |
|---|---|---|
| Declared listing source | `pinnacleEnquirySource().fields.utm_source = google` | `WebsiteReceipt.source.acquisition.fields.utm_source`; persisted as `website_enrolment_receipts.source_json.acquisition.fields.utm_source` |
| Declared medium/campaign | `fields.utm_medium = organic`; `fields.utm_campaign = gbp` | Same fields in the protected acquisition object |
| Listing-centre key | `fields.utm_content = anathapuram-ap` | `source_json.acquisition.fields.utm_content`; independent of selected centre |
| Coarse landing surface | `landingPath = /centers` | `source_json.acquisition.landingPath`; normalization does not remove UTM content |
| Family's selected centre | `preferences.centre`, e.g. `kadapa` | Adapter resolves `centreFacilities.kadapa.id = 9353254802` into `FacilityIds[0]`; passed to existing `HandleLead` intake, independently of acquisition |
| Retry identity | `requestId` and matching `Idempotency-Key` | Unique `request_key`; persisted `receipt_id`, payload digest and first-claimed source. Same key cannot change the selected-centre payload or overwrite original attribution |
| Accepted outcome | Minimal receipt after receiver acceptance | `state = accepted` plus protected `lead_reference`; a receipt alone does not prove qualification, a call, attendance or admission |

Path: validated URL fields → consented `pinnacleEnquirySource()` → `makePayload(...).source.acquisition` → `/api/enrolment` → named private `WebsiteEnrolmentReceipts.receive` → existing MySQL receipt and receiving handler. The private lead reference is removed before returning the browser receipt. No second receiver or conversion pipeline is introduced.

The selected centre is part of the protected operational intake, not a new field copied into `source_json`. Its eventual operational record linkage remains the existing typed `lead_reference`. No production record containing both this GBP convention and that selected centre has been observed in this pass.

## Narrow precedence repair

Before this change, a later GBP-tagged return could overwrite a permitted paid acquisition record stored on the device. The fix retains that prior complete paid envelope when the new URL has only the declared Google/organic/GBP convention and no supported paid evidence. It does not mix a prior click ID into a different listing's UTMs.

- Fresh GBP-only journeys retain the exact `utm_content` listing key.
- A genuine permitted existing paid source takes precedence over later GBP-only tagging. **In that case the retained `utm_content` belongs to the retained paid source; the later GBP listing is not stored as a second touch.** This is deliberately one primary acquisition envelope, not a new multi-touch model.
- A current URL with a permitted supported paid click ID is handled as paid evidence even if its human-written UTMs say organic.
- Expiry, refusal, withdrawal, GPC, validation traffic and private-route exclusions remain in force.
- These are source-evidence rules, not verification that a click ID belongs to a billed Ads click. Google/Ads reconciliation remains separate.
- A GBP URL can be copied or visited manually. Its convention alone cannot establish organic acquisition. Do not promote it to a qualified lead or paid/organic causality claim without the appropriate evidence.

## Verification and accepted fixture

83 focused measurement/receipt/reporting checks passed. The new persisted fixture exercised the shared browser script, public payload constructor, website adapter, private receiver logic and real SQLite unique-key ledger locally. All Google SDK activity was intercepted in memory; no public enquiry POST occurred.

- Evidence class: **isolated local persisted transport fixture**, not the production MySQL table and not a family enquiry.
- Request ID: `qa-gbp-4abd5563-28e0-4165-a606-fc5b72eda623`.
- Accepted receipt ID: `a94828ee-16db-4d72-a2d0-3f2dc96d5fb6`.
- Source: `google / organic / gbp`; listing key `anathapuram-ap`.
- Selected centre: `kadapa`, facility ID `9353254802`.
- Ten concurrent attempts and three further retries produced **one committed fixture intake** and the same accepted receipt. A retry changing the selected centre returned **409**. A source-only retry did not overwrite the first source.
- Customer intakes, Google requests and notifications: **0**.

Receipt: [isolated fixture](deployment/gbp-source-handoff-20261009-fixture.json). The existing 8 October release also contains nine passing **isolated production-MySQL-table** contract checks, but its source fixture was paid, not this GBP example: [historical MySQL transport proof](deployment/enquiry-source-20261008.json). These two evidence scopes must remain distinct.

### Real receiving evidence

One fresh read of the existing private analytics RPC covers 9 October 00:00–05:44 IST. The whole receipt-creation cohort contains **zero accepted receipts**, no truncation and zero GBP-tagged accepted rows. This is only the website receipt cohort, not a total of phone calls, WhatsApp enquiries or other intake channels. No real GBP enquiry/selected-centre record ID can therefore be supplied honestly from that cohort. Receipt: [protected aggregate read-back](deployment/gbp-source-handoff-20261009-live-cohort.json).

Next trigger: the first genuine permitted GBP-tagged accepted website receipt. Website owner supplies its redacted receipt/source/operational-reference trace; the operational owner verifies the selected-centre record through the exact existing reference. No family test lead or paid self-click should be generated to fill the gap.

## Official centre-source exceptions

The original owner workbook was inspected and its SHA-256 matches the maintained register. It was last modified 7 October; those selected rows contain no dated current-premises verification. The 7 October authenticated Google identity export establishes distinct resource/CID/Place-ID values, not current duplicate or relocation status.

| Listing | Official source actually supports | Required resolution |
|---|---|---|
| Kondapur `3394473323879158651`, supplied address 13 Kondapur Main Road | Distinct Google resource, CID `7331645477039819394`, Place ID `ChIJAVcRn6CTyzsRgsoOdrc8v2U`. The workbook does not corroborate the supplied 13 address. | Confirm current operating premises and the basis for retaining this resource versus the 212/B resource. A shared URL and nearby coordinates cannot resolve it. |
| Gachibowli-labelled `8084727145258127335` | Workbook Id 17 / sheet row 15: **Plot No 212/B, Sriram Nagar, Botanical Gardens, Above Vasireddy Sweets, Chirec Lane, Kondapur, Hyderabad 500084**. Workbook name is Gachibowli, SEO slug is Kondapur. Review CID `13887297114281068762` selects this resource; Place ID `ChIJyyjmrcyTyzsR2sgHuyWXucA`. | Existing Kondapur website mapping is explained by the source. It does not authorise merging it with 339447… or establish which current profile should be canonical. |
| Kadapa proposed canonical `3498916109569948721` versus existing `1619614362612848040` | Workbook Id 59 / sheet row 53: **Apsara Circle Road, opposite Gajjala Maternity Hospital, N.G.O Colony, Kadapa 516002**. Its coordinates and review CID `227879912786520239` select **161961…**, also the current website identity map. The proposed **349891…** has CID `4325071304245924096`, a different Place ID and coordinates. | Supply current premises/address evidence for 349891… and the reason it replaces 161961…. The incoming Ads asset 235658427805 association was not independently re-read by the website owner. Its supplied target agrees with the dated workbook-derived mapping, so it is not proved wrong by the newer label alone. |

Keep the separate Grace Tower/Gachibowli branch (500032, resource `14181567949098472996`) distinct. Its raw workbook row contains a known copied address; the maintained register preserves the established Grace Tower address. Do not reimport the copied address or merge that branch into the 212/B identity.

Owner/dependency: the local-listing/operations owner must supply current premises, retained resource, CID/Place ID, canonical page and dated basis for each exception; the Ads owner supplies the dated asset association. Then this website owner aligns the maintained register and identity map in one scoped release. The other 48 native-matched centres do not depend on this resolution. No address or listing changes were made on incomplete evidence.

Sources: `src/data/centre-register.json`, `src/data/centre-google-locations.json`, original `All Centers-AllResponses.xlsx`, and the protected `ask-private/gbp-source-handoff-20261009/centre-identity-review.md` with exact row and source links.

## Follow-up identity response to Ads — 9 October

The original workbook was re-read for the requested two identities. Its SHA-256 still matches `4d07b0601749ea9866ddcf00969bbaaf34de7c634c112fce868943bac8a87596`; last modification is 7 October 2026, 07:30:59 IST. These are exact source-backed mappings, not fresh confirmation of the operating premises or Google's duplicate/canonical status.

| Field | Kondapur 212/B | Kadapa Apsara Circle |
|---|---|---|
| Workbook | Sheet1 row 15; Id 17; Name Gachibowli; ShortCode GCB | Sheet1 row 53; Id 59; Name Kadapa; ShortCode KDP |
| Workbook address | Plot No 212/B, Sriram Nagar, Botanical Gardens, Above Vasireddy Sweets, Chirec Lane, Kondapur, Hyderabad, Telangana 500084 | Apsara Cir Rd, Opposite GAJJALA MATERNITY HOSPITAL, N.G.O Colony, Kadapa, Andhra Pradesh 516002 |
| Workbook coordinates | 17.460444, 78.353944 | 14.4746398, 78.8365724 |
| Website centre / facility | `kondapur` / `3062523153` | `kadapa` / `9353254802` |
| Google resource | `locations/8084727145258127335` | `locations/1619614362612848040` |
| Google Place ID | `ChIJyyjmrcyTyzsR2sgHuyWXucA` | `ChIJdS6_9QZzszsRr2gWxZKXKQM` |
| Exact identity | [Maps CID 13887297114281068762](https://maps.google.com/maps?cid=13887297114281068762) | [Maps CID 227879912786520239](https://maps.google.com/maps?cid=227879912786520239) |
| Original review link | [Workbook review identity](https://g.page/r/CdrIB7sll7nAEBM/review) | [Workbook review identity](https://g.page/r/Ca9oFsWSlykDEBM/review) |
| Landing page | [Kondapur](https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-kondapur-hyderabad-telangana-india) | [Kadapa](https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-kadapa-ap-india) |

The Gachibowli label on the first record is a source alias. The incoming Ads asset association `235658427805` to Kadapa `1619614362612848040` agrees with the saved website mapping; its live Ads setting has not been independently re-read here. The distinct alternative Kadapa resource `3498916109569948721` has Place ID `ChIJwz1qzO9zszsRAFHQnW-9BTw` and coordinates 14.4710962, 78.8358894. A more descriptive label alone does not establish a reason to replace the existing mapping.

Remaining source limit: both maintained centre rows retain `checkedOn: 2026-09-28`. The saved authenticated 7 October Google identity export contains identifiers and coordinates, but no street-address lines or duplicate/canonical decision. HFR corroboration does not replace current operations confirmation. The listing/operations owner supplies that confirmation where the competing profiles still create a conflict; Ads applies its existing exception criteria to the exact identities above.

No newer affected source-precedence change or deployment receipt was found. The source `c820c8a4`, Portal version `3106a925-5e4b-4cdd-b211-d026ff52af48`, deployment `df99e622-e66f-48db-b596-00351ef51d8d` and 05:54 IST public verification at the top remain the latest recorded repair. Subsequent handover/tooling commits are not website releases.
