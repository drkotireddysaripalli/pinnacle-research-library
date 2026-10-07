# Shared template repair — delivered 7 October 2026

Website implementation owner: this chat. Deployed source: `c0cff6c85e9e41c3b81f23a5d7ca2e11e9ee1c63`.

## Verified result

| Check | Delivered evidence |
|---|---|
| Public template coverage | 32 named legacy roots and two sampled assessment detail pages verified live |
| Malformed JSON-LD in those captures | 40 before; one remaining MedicalStudy block after |
| Canonical and social URL agreement | 34 of 34 verified template pages |
| Known old alias links | Zero remaining in those captures; eight explicit alias mappings reused by shared navigation |
| Titles | Six exact source titles corrected at a phrase boundary |
| Centre URL variants | Known variants of 62 registered centre paths redirect to the lowercase public page; Karimnagar and Uppal variants verified live, including source parameters |
| Cloudflare routes | All 229 previous routes retained; 26 narrow patterns added; 255 total confirmed |
| Assets | All 3,263 portal assets retained; zero new asset uploads |
| Automated checks | 82 focused tests pass; final Portal quality workflow passes with Firefox/WebKit and the required five-page Chrome TestingBot build check |
| Public acceptance | 51 initial requests returned 200 at their final destination; final targeted checks verify two campaign collections and preservation of a functional query |
| IndexNow | 36 changed URLs accepted, zero failures, HTTP 200 with key validation |

Live examples:

- [Music therapy](https://www.pinnacleblooms.org/music-therapy)
- [Parent training](https://www.pinnacleblooms.org/parent-training)
- [Research studies](https://www.pinnacleblooms.org/research-studies)
- [Question comprehension study](https://www.pinnacleblooms.org/question-comprehension-study)
- [Speech and language evaluation](https://www.pinnacleblooms.org/assessments/speech-and-language-evaluation-assessment)
- [Karimnagar centre](https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-karimnagar-telangana-india)
- [Uppal centre](https://www.pinnacleblooms.org/centers/best-autism-speech-aba-occupational-therapy-center-uppal-hyderabad-telangana-india)

## Release proof

- Portal version: `81e9351b-a30e-4772-9f27-22b9096dc1bd`; deployment `cd67e4d3-b31a-4eef-a943-386f66bb36c0`.
- Legacy version: `e41ea6bf-15cf-4e68-8c91-98b03baf3858`; deployment `de8aea1b-0f76-4d1b-97ba-839b7c197add`.
- [Successful exact-source build](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37653200199).
- IndexNow batch: `42b37ad4-c81b-4e69-a19b-c2f1a80395e9`.
- GSC Wizard release annotation: `5badebbe-0b74-4498-8684-1305bc424772`.
- Sanitized closeout: `deployment/shared-template-closeout-20261007.json`.
- Detailed protected capture, route read-back and action receipt: `work/pinnacle-growth-system/shared-repair-20261007/` in the calling workspace.

The initial live check exposed missing route coverage. That was corrected before completion. It also exposed entity-escaped campaign identities inside service collection JSON-LD; the correction has its own regression check and verified live campaign captures.

## Remaining corrections

1. [TherapeuticAI effectiveness study](https://www.pinnacleblooms.org/therapeuticai-effectiveness-study): one malformed MedicalStudy object remains. Reconcile the scientific fields and patent wording with the current evidence ledger before publishing a valid replacement. Owner: this chat; next trigger: source-based graph correction.
2. [Everyday Therapy programme](https://www.pinnacleblooms.org/everyday-therapy-program): this legacy URL declares the different home-study canonical. Establish content equivalence before choosing a redirect or replacement. It intentionally bypasses the self-canonical repair. Owner: this chat; next trigger: canonical/content decision.
3. The attached conversion brief identifies unfinished durable receipt, attribution and genuine call/visit/admission linkage. The ordered website work is in `CLAUDE-CONVERSION-BRIEF-DISPOSITION-20261007.md`; the receiving contract is in `ACQUISITION-RECEIPT-REMAINING-20261007.md`.
4. Broad audit warnings about metadata length, discovery and performance require their own evidence-based decisions. No new whole-site health score or field LCP improvement is claimed by this release.

## Outcome limits

JSON parsing and canonical agreement do not prove every rich-result requirement. The build check is scoped coverage; it is not a new all-device or all-page visual certification. IndexNow acceptance does not establish indexing, Google inclusion, ranking, AI citation, qualified calls or admissions. No production family enquiries or calls were generated as tests.
