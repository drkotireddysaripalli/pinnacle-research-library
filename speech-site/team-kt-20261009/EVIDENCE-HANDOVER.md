# Evidence handover completion — 9 October 2026

## Delivered artifact

The Mac coordinator confirmed receiving the original KT at `49462a0`. The follow-up read-only tool evidence is now on the existing **private** shared repository, isolated branch `handoff/mac-tool-evidence-20261009`, commit **`6104d466f9d038d8627d83f731bd2f5092fe28ee`**:

[Private evidence handover](https://github.com/drkotireddysaripalli/pinnacle-shopify-source/tree/handoff/mac-tool-evidence-20261009)

This branch is transport only. It does not change Shopify main, the portal's pinned private component, theme/catalogue records or production. Do not merge it into either main branch. It contains 177 existing source files (about 3.4 MB), manifest hashes, a portable materializer, a validation receipt and test summaries. Credential-bearing fields were redacted; licence keys and provider secrets were not transferred into Git.

The actual queue/region/evidence-sources snapshots and referenced saved inputs are included. The Mac can run the **existing** `growth-evidence-profile.py` against the relocated snapshot. One Windows path/glob issue initially omitted saved TestingBot reports; explicit report enumeration fixes that in the transfer adapter without changing production code or test outcomes.

## Verified offline result

At **9 October 07:17 IST**, the relocated inputs successfully produced:

| Evidence | Actual count |
|---|---:|
| Existing queue items | 59 |
| Saved sources reused by the join | 97 |
| Joined URL observations | 274 |
| GSC query/page sample records | 110 |
| Dated TestingBot observations | 101 |
| Missing source files in the transfer manifest | 0 |

These counts describe saved evidence, not new site improvements or fresh account totals. Dates and completed-vs-running audit status stay intact. Qualified-call and admission outcomes remain unavailable in this aggregate join. No new crawl, indexing submission, customer enquiry or paid browser session was run to validate the transfer.

## Test handover: preserve the failures

The latest saved complete daily report here is **8 October**, source `85f6f1742cc3549a9a66b281c640fcfe820eb05d`:

| Suite | Passed | Failed | Relevant limitation |
|---|---:|---:|---|
| Daily critical | 31 | 1 | Mirracles structured-data/social-image assertion and header visual comparison failed in that older run. |
| Daily presentation | 5 | 3 | Shop and Suchitra paragraph checks; Hindi Books Anek typography check. |
| Daily records | 28 | 0 | Named selected records only. |
| Daily browser | 3 | 0 | Named browser/case scope only. |
| Daily physical | 0 | 3 | PinnacleAI, Speech and Enrolment failed the actual requested browser/OS identity assertion. Other functional checks cannot clear that coverage failure. |
| **Daily total** | **67** | **7** | **74 selected runs; failed/incomplete overall. Two library cases pending.** |

The **9 October** exact-source BVT at `c820c8a4e8c107a4ed319cab72b42222a9890e31` separately passed **5/5 Chrome/Windows cases**, with **provisional visual references**. Runner hash `dd6e028c92a0a31908355844ba0ae5e3bc950d2ced90deab5d23baa59f3355df`; manifest hash `e177d58a26cc3f176a537d3a8c4fb4ed18652a7a544652e5b4e0e8ec4e8b588f`. Full reports, hashes and provider references are in the private package and existing deployment receipt. This narrower later pass does not erase the seven older findings across other suites/browsers. Reconcile each affected case against current source before a targeted retest.

## Mac-reported current work and reservation

The Mac coordinator reports **252 responsive local browser passes, 20 explicit skips and four failures** at source `49462a0`. It reserved only `tests/browser/enrolment.spec.mjs` for a narrow asynchronous assertion fix: wait for the mocked POST and accepted/unknown state while preserving replay, privacy and no-real-enquiry assertions. That reservation is accepted; Windows will not edit that test concurrently. This is a Mac report pending its actual PR/receipt, not an independently repeated run here.

The Mac also reports five Ahrefs 500 samples now returning 200 with self canonicals, and ongoing Ahrefs/Semrush crawls. Preserve the exact URLs/timestamps and completed snapshot IDs in its handoff; do not start duplicate crawls or call an incomplete crawl a clean audit.

One completed Mac patch should receive the existing trusted-source CI/BVT. Coordinate that run once; do not separately start the same cloud test from Windows and Mac. Windows' local daily lock was absent when packaged, but external provider occupancy was not queried. The Mac names the source/cases before a bounded session; the narrow daily job stays with Windows. This agreement is not a provider-enforced global lock. No same-source Windows/Mac build-speed comparison has been measured; do not rebuild just to manufacture one.

## Usage, profiles and access

The Mac reported **100 Ahrefs units** and **10,400 Semrush units**, including a 10,000-unit completed-snapshot retrieval. These are now recorded once in the owner's existing ledger as **reported actual use after execution**, not an advance reservation or independent provider verification. Exact request receipts/timestamps remain requested. No second budget ledger or schedule is created. Future Ahrefs spend must use the existing reservation before querying.

All four saved Screaming Frog profiles are included byte-for-byte, with hashes matching their original zero-credential scan receipt. The additive private supplement at `d4251ef1619e78b642318f5877147bc460e767d2` transferred the existing same-user licence encrypted to the Mac coordinator's own RSA key. The coordinator subsequently confirmed that the receipt, ciphertext and recipient fingerprint verified; decryption occurred only in mode-0600 private local storage; and the existing official local licence matched exactly. Its native window displayed **Screaming Frog SEO Spider 24.3 (Licensed)**. This is a recipient-confirmed activation, not a Windows UI observation. No additional purchase, plaintext disclosure or public crawl was performed.

The coordinator reported the app idle and its local MCP server displayed active. This does not establish that every MCP operation or external account integration has been tested. Keep one coordinated licensed instance and do not start a duplicate Windows crawl. Official [Screaming Frog licence FAQ](https://www.screamingfrog.co.uk/seo-spider/faq/) permits the same licensed user to use multiple devices subject to its terms; it does not license multiple human users.

TestingBot credentials remain in the existing trusted workflow secret store. Native GSC/GA4/PageSpeed/AI authentication is not claimed by delivering a Frog profile. Existing Ads/commerce/correspondence ownership and schedule holds remain unchanged.

## Received Mac acknowledgement and next work

The Mac coordinator independently confirmed the private `6104d466` import: 183 Git blobs / 3,542,375 bytes, all 177 export hashes, 56 relocated JSON records and an offline join of 59 queue items / 97 sources. It also confirmed both local Mac chats are active at clean base `4e0b811`:

- **Pinnacle Search Engineering**: `01a11e66-9290-7160-a803-db161727035f`, branch `codex/mac-search-engineering-20261009`, port 4343.
- **Pinnacle Page Engineering**: `01a11e66-969e-72c3-a0d6-fdbe180c4c5a`, branch `codex/mac-page-engineering-20261009`, port 4344.

The coordinator retains port 4340 and the tooling/test patch. It additionally reserved `tests/browser/book-languages.spec.mjs` to align outdated font expectations with the current shared Anek contract. Its local results included 36 affected enrolment cases, 24 Shop responsive cases, and full Firefox/WebKit selected suites passing after their respective corrections; these overlapping scopes must not be summed into a unique all-site total. The single test/tooling PR has now completed the integration boundary below.

Search Engineering has supplied its first direct receipt and requested the bounded 33-ID legacy slice. That slice is delivered in private supplement `d4251ef1619e78b642318f5877147bc460e767d2`, with original source hashes, player metadata and explicit missing database-eligibility provenance. The coordinator confirmed all three source-file byte counts and SHA-256 hashes and forwarded the exact private source path to active Search Engineering. The same recipient receipt confirms licensed Screaming Frog activation as recorded above; no plaintext credential is in Git/chat.

The coordinator's completion receipt reaffirms the offline join: 59 queue items, 97 sources, 274 URL observations, 110 query/page samples and 101 testing observations. The two implementation teams retain their isolated scopes, and Windows retains production release ownership. Their pending product changes are not deployed by this handover.

## Tooling integration completed

[PR 10](https://github.com/drkotireddysaripalli/pinnacle-research-library/pull/10), exact feature head `04b40586638b6a581fa0d6685ebf692d546dd05c`, was reviewed and merged at `5412d8c8d0545bc38cdbc185c0b40b571e600196`. The Windows checkout fast-forwarded successfully while preserving its unrelated local changes. Scope: 12 files, shared build tooling and the two reserved browser assertions; no application, route, API, consent or production deployment change.

Both [trusted push CI 37874141530](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37874141530) and [PR CI 37874145411](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37874145411) completed successfully. The trusted-run log independently read here establishes:

| Check | Result |
|---|---|
| Ask build and its preceding contracts | Passed |
| Types | 0 errors |
| Unit checks | 599 passed; 1 explicit skip |
| Responsive browser cases | 256 passed; 20 page-specific skips |
| Firefox / WebKit cases | 128 passed; 10 page-specific skips |
| Centre contract | 62 passed |
| TestingBot contracts | 13 passed |
| Centre gallery / Google feed candidate checks | 4 and 6 passed respectively |
| Exact-build TestingBot BVT | 5/5 Chrome cases passed: Shop, PinnacleAI, Speech, Enrolment, Suchitra; 0 failed/unavailable; 2 library cases remain pending |
| Independent Windows candidate guards | 6/6 passed; three added/changed tooling modules also passed syntax checks |

These are separate scopes, not a sum of unique pages or proof of physical-phone coverage. The TestingBot report records 91 provider session seconds; this is duration, not a monetary cost. Artifact `11592152021`, SHA-256 `944e428221a59f5e853247b55de2239cbd267fddb2b9aaf47ca32106d25c5066`, retains the exact-build reports. The merge reuses these completed checks rather than launching another unchanged paid run. Product releases still require their own affected-source acceptance and public read-back.

## Product source received; runtime integration remains

Both isolated source packets are privately published at `b9b6aecaeb40f2fb81da2f1da1ae3dedde2a5c8e` and now copied to the Windows handover area. No private transport branch is merged into production source.

- **Search:** source `7ce008e0ad86b2710a2acad439da291f52bc38b6`, base `4e0b811`. Windows verified bundle SHA-256 `afe75026a2d1ac3539b4abb1eefe8a6e3b6b79f65ffe98959f5cd2130a9376e9`, prerequisite and commit, and imported the review ref. The package reports 28 proven recoveries / 55 aliases, 1 already-native identity and 4 unresolved IDs. The separate flat-runtime patch is proposed, not applied. Runtime integration, flat-module validation, affected build/BVT and deployment/public proof remain with Windows. The four unresolved identities prevent declaring the family or legacy-origin retirement complete.
- **Page:** source `7b54e757714ae5332474673d40860f9ae2a977ca`, base `4e0b811`. Windows independently verified all three published transport file lengths and Git blob hashes. The source patch adds seven isolated homepage files and preserves the existing root. Its local mobile lab result remains 86 / LCP 3.60 seconds; actual compressed-root performance, shared root integration, visual acceptance and production proof remain open. Local layout passes do not close that performance gap.

Next: integrate the proven Search source with its actual flat runtime, and review the homepage's root/performance changes under [TEAM-CONTRACTS.md](TEAM-CONTRACTS.md). Coordinate acceptance at the actual combined release boundary; do not create separate paid runs solely for transporting these intermediate source packets. Exact prior provider usage receipts remain due. Website deployment and real business outcomes remain separate from this completed team/evidence/tooling setup.
