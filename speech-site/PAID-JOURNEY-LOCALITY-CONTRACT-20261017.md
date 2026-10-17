# Existing paid journey: locality preference contract

Status: prepared and fixture-verified, **not deployed**. Production release is held for the GA4 owner's scoped measurement patch and QA evidence so the common collector has one combined release.

## Current production boundary

Root version `e034922c-ebd0-4d50-b573-3590c40a3398`; deployment `c2e49cb4-fcc5-492f-a432-737fe698207b`; 403 routes and 65 modules. Main source baseline `b3eb8b32432e531173605d234de6e6ac495d1387`. Live collector SHA256 `8d0fdf7f21dd1cdf308c14f8ef486e501d519f2b47b6a4eab6f42a2766707187`.

## Exact functional contract

- One each of `utm_source=google`, `utm_medium=cpc`, `utm_campaign=pbn_network_[a-z0-9_]{1,48}`, and `utm_content=<published-locality>_<speech|ot|aba>` is required. Duplicates, malformed values and unrelated campaigns do not infer a preference.
- Localities match the exact existing published centre-profile path, not a fuzzy name, postcode or guessed nearby branch. The helper checks the existing available form/collector IDs.
- Required examples: `khajaguda-mehdipatnam-hyderabad-telangana_speech` → `khajaguda`; `lbnagar-hyderabad-telangana_aba` → `lbnagar`; `nallagandla-hyderabad-telangana_ot` → `nallagandla`; `suchitra2-hyderabad-telangana_ot` → `suchitraii`.
- Explicit `centre`, including the blank help-me-choose choice, takes precedence. Existing form defaults and an already selected centre take precedence over a new paid hint. The parent's subsequent edits remain editable and are not overwritten.
- Existing explicit service, Speech entry and page service defaults remain authoritative. A conflicting paid service label does not select a centre. No diagnosis, requested treatment or operating availability is inferred.
- Himayatnagar, Kondapur and Gachibowli market holds remain excluded from automatic hints. Paradise and unknown/ambiguous aliases retain help-me-choose.
- On the Speech flagship, existing same-origin Enrolment/service-information links gain the matched centre. Existing queries, click identifiers, offers and fragments remain intact. Explicit centre links and `tel:`/WhatsApp links are untouched. The original landing URL is unchanged.
- The helper is functional navigation code only. It adds no storage, analytics event, source envelope, private intake or transport. Existing consent/GPC/QA and durable-receipt handling remain separate.
- Public code marker after deployment will be `native-paid-locality-20261016`; the existing helper/enrolment asset response will expose `x-pinnacle-paid-locality`. The marker currently exists only in the candidate fixture.

## Evidence and next acceptance

Evidence directory: `speech-site/ask-private/paid-locality-20261016/`.

- `runtime-before.json`: four actual-public-HTML/script fixtures reproduced the missing locality while preserving existing service defaults.
- `unit-with-announcement.log`: 25 focused cases passed, including alias consistency, explicit choice, held/ambiguous fallbacks, malformed/duplicate values, enquiry reliability and unchanged announcement controls.
- `helper-serving-contract-expanded.log`: the affected Worker GET/HEAD/MIME/405 test passed with the new helper included.
- `runtime-candidate.json`: all four mobile Chromium fixtures passed; Speech navigated into existing Enrolment with the correct centre/service; each form accepted an editable family override. All vendor/non-GET transports were blocked; no call, conversation, enquiry or Ads conversion was created.
- `release/` retains current provider state and module/source equivalence. No production upload or promotion has occurred.

The four earlier collector variants already have exact public acceptance in `ask-private/qualified-media-20261016/selected-public-54bd034f-e05d-4526-a518-18bf3af73899/acceptance.json`: `/ma/ringtoss-therapy`, `/t/bead-stringing-therapy`, `/b/understanding-managing-spitting-saliva-tantrums`, and Android `/contact-national-autism-helpline-24-7`. Their original transformed HTML and legacy Worker are retained. Do not rerun unrelated galleries, sitemaps or daily browser suites for this repair.

Next: integrate the GA4 owner's minimal patch and production-safe nonconversion QA boundary here; check any homepage acquisition allowance against the matching private validator; run affected combined fixtures and the required trusted-source CI/BVT once; publish using the then-current full module/asset/route/binding guard; verify the public marker and changed journeys; advance the protected source baseline. Functional preselection, GA4 receipt, genuine accepted enquiries and Google Quality Score are separate acceptance milestones.
