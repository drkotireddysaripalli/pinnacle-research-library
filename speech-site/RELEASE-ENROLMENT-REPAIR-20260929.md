# Enrolment delivery and visual repair — 29 September 2026

Canonical page: https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india

## Outcome

The live enrolment page now completes its server-side POST through Cloudflare to the existing PinnacleAI/Mirracle workflow. A final organisation-owned synthetic request, labelled `SYNTHETIC DO NOT CALL` and containing no family or child data, returned HTTP 202 with `{"status":"accepted"}` through the public `/api/enrolment` endpoint. Do not call or treat that record as a lead. No further valid synthetic request is needed.

The page now uses a luminous white content canvas. The enrolment-specific pink/purple/teal surface washes and the analogy gradient were replaced by white cards with restrained Pinnacle-colour borders and icons. The established portal footer retains its original purple brand treatment. The optional service and centre selector is open on first load, with all 62 choices visible and usable.

## Root cause and repair

The public browser contract was valid, and direct POST requests to `https://mirracle.pinnacleblooms.org/api/gl/swfs` returned the established `true` acceptance body. The page Worker’s public-hostname subrequest was routed to the existing `pbn-planetscale` Worker and returned an empty HTTP 405. The repair adds `PINNACLE_LEGACY` as a Cloudflare service binding to `pbn-planetscale` and uses the binding for the server-to-server POST. The browser remains isolated from the legacy API and its facility identifiers.

## Production record

- Worker: `pinnacle-verify-route`
- Version 97: `96b9b322-41ad-4d07-b44f-06f5df1f649e`
- Deployment: `ca1ef8b5-497f-426b-be73-87e65cd5408d`
- Traffic: 100%
- Immediate rollback: version 96, `5a2c8546-5a83-443c-bd4e-f16de09a8f8e`
- Release directory: `release-enrolment-live-20260929-v4`
- Files: 1,345; bytes: 142,322,308
- Live/release HTML SHA-256: `809e3036fe0d5d7af18b2b3e6bb426ee874a4155ad1d318be61ff13298534717`

## Verification

- Production build passed.
- 46 combined routing, form, privacy, centre, measurement and release checks passed; zero failed.
- The focused enrolment suite passed 18/18, including direct-service-binding selection.
- The final live synthetic request returned HTTP 202 `accepted`.
- Invalid input still returns 422 without reaching PinnacleAI; GET remains 405.
- Live canonical HTML is byte-identical to the staged v4 release.
- Metadata audit: 144-character description, one valid JSON-LD graph, no inappropriate JobPosting/Review schema and no missing image `alt` attributes.
- Fresh accessibility-tree readback confirms the service/centre preferences are expanded and all 62 centre choices are present.
- `/verify/`, its evidence register, FSC PDF, complete PinnacleAI story, national autism helpline and `robots.txt` remain byte-identical to the pre-release baseline.
- The materially changed canonical URL was notified once through IndexNow after publication; the verified root key and submission both returned HTTP 200. This is a notification receipt, not proof of indexing or ranking.

Acceptance confirms receipt of the enquiry. It does not establish an appointment, assigned professional, agreed fee or care outcome.
