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

All four saved Screaming Frog profiles are included byte-for-byte, with hashes matching their original zero-credential scan receipt. The licence is intentionally retrieved through the owner's existing vendor account; Mac activation is not confirmed by this handover. Official [Screaming Frog licence FAQ](https://www.screamingfrog.co.uk/seo-spider/faq/) permits the same licensed user to use multiple devices subject to its terms; it does not license multiple human users. No additional purchase was made.

TestingBot credentials remain in the existing trusted workflow secret store. Native GSC/GA4/PageSpeed/AI authentication is not claimed by delivering a Frog profile. Existing Ads/commerce/correspondence ownership and schedule holds remain unchanged.

## Received Mac acknowledgement and next work

The Mac coordinator independently confirmed the private `6104d466` import: 183 Git blobs / 3,542,375 bytes, all 177 export hashes, 56 relocated JSON records and an offline join of 59 queue items / 97 sources. It also confirmed both local Mac chats are active at clean base `4e0b811`:

- **Pinnacle Search Engineering**: `01a11e66-9290-7160-a803-db161727035f`, branch `codex/mac-search-engineering-20261009`, port 4343.
- **Pinnacle Page Engineering**: `01a11e66-969e-72c3-a0d6-fdbe180c4c5a`, branch `codex/mac-page-engineering-20261009`, port 4344.

The coordinator retains port 4340 and the tooling/test patch. It additionally reserved `tests/browser/book-languages.spec.mjs` to align outdated font expectations with the current shared Anek contract. It reports the 36 affected enrolment cases, 24 Shop responsive cases, and full Firefox/WebKit selected suites passing after their respective corrections; these overlapping scopes must not be summed into a unique all-site total. Exact code/receipts and the single test PR are still due for integration review.

Search Engineering has supplied its first direct receipt and requested the bounded 33-ID legacy slice. That slice is delivered as an additive private supplement, with original source hashes, player metadata and explicit missing database-eligibility provenance. A same-user Screaming Frog licence supplement is encrypted to the coordinator's supplied RSA-3072 recipient key; no plaintext credential is in Git/chat. Activation remains for the Mac to verify.

Remaining: exact provider usage receipts; reviewable test patch; verified mapping patch and homepage candidate under [TEAM-CONTRACTS.md](TEAM-CONTRACTS.md). Website deployment and real business outcomes remain separate from this completed team/evidence setup.
