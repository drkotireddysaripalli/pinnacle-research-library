# FAQ payload release — 4 October 2026

Action: `WEB-LEGACY-PAYLOAD-STABILITY` / `41def042-431f-4291-8863-2242b09090ea`.

Source commit: `f751110a19b225f518e991a8b932ad52f5e0c812`, pushed to `main` before upload.

Worker: `pinnacle-legacy-social-metadata`; deployed version `e4b76e81-3f83-4710-9699-74027cb335a5` at 100%, deployment `3bee3ee4-b461-49eb-be62-c5a5c567e02e`.
Rollback: `5b62fc46-9772-4e09-8a80-0ae1115b4026`.

## Measured public result

| Public URL | Before HTML bytes | After HTML bytes | Reduction |
|---|---:|---:|---:|
| [English ABA social skills](https://www.pinnacleblooms.org/faq/english/aba-therapy/abatherapysocialskills) | 1,849,514 | 1,653,793 | 10.58% |
| [Hindi speech: voice tone and volume](https://www.pinnacleblooms.org/faq/hindi/speech-therapy/voice-tone-volume-issues-autism-speech-therapy-pinnacle-blooms) | 2,633,202 | 2,437,481 | 7.43% |
| [Telugu ABA category](https://www.pinnacleblooms.org/faq/telugu/aba-therapy) | 1,700,290 | 1,504,569 | 11.51% |

Each fresh public response is 200 and contains exactly 195,721 fewer uncompressed bytes. The known invalid console dump is absent. Apart from normalised Cloudflare/font ordering differences, the surrounding HTML, answers, schema, navigation, metadata and styles are unchanged. Transfer compression and field performance require separate measurement.

## Verification

- 44 focused runtime tests passed, including a committed real public payload fixture, split Unicode/script chunks, exact positive removal, unknown-script retention and protected-response regressions.
- Downloaded deployed modules match the pushed source. All 191 Cloudflare route records and five Workers' binding sets remain unchanged; other four application versions unchanged.
- Seven public control responses unchanged: Physiotherapy, Verify, PinnacleAI, Ask, Enrolment, Anna Nagar and the sitemap. No authentication, route, cache-policy or shared component changes were made.
- Chrome at 390px and 1440px: the English/Hindi answer collections retain identical text hashes and counts, no horizontal page overflow, and no `Unexpected token '&'` error. Two representative post-release screenshots were visually inspected against the saved baseline. This confirms preservation for these samples, not full-site visual or physical-device certification.
- Screaming Frog's bounded three-URL check reports 200, indexable and self-canonical for every sample. Indexable does not mean indexed.
- GSC Wizard annotation `d488c2a6-6269-4af0-bddf-824a5743951d` records this technical release once. No mass URL submission or new Ahrefs crawl was started.
- Source CI: [Portal quality run 37205899041](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37205899041) completed successfully for the exact source commit, including Ask build and portal checks. These complement the focused deployed FAQ checks; they are not a whole legacy-site visual certification.

## Remaining scope

The Hindi sample still exceeds 2 MB uncompressed. A different pre-existing `Cannot set properties of null (setting 'innerText')` error remains. Legacy FAQ structured-data parse issues and broader page design are outside this repair. The historical crawler-500 samples returned 200 before this release; an invalid browser script does not establish the cause of server 500 responses. Anna Nagar has no copy of the fingerprinted dump and keeps its separate queued page task.

This is a deployed payload and script-error improvement. No ranking, AI citation, traffic, field-speed or qualified-enquiry gain is asserted.

Full local evidence: `work/pinnacle-growth-system/legacy-payload-20261004/` in the authorised main workspace, including before/after HTML, infrastructure hashes, browser records, screenshots, crawler exports, annotation and completion receipt.
