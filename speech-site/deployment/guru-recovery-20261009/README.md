# Guru public article recovery — 9 October 2026

## Scope and evidence

Recover the 491 exact public Guru article identities in the saved Ahrefs non-Mirracles 500 inventory. The legacy article template attempts to convert a null CenterId into an integer. This handler renders the original published article independently of that unrelated operational field. It does not invent a centre identifier, rewrite error status alone, or own private/API routes.

- Input inventory: `work/pinnacle-growth-system/server-error-repair-20261009/ahrefs-non-mirracles.json` (491 Guru rows; other families remain outside this module).
- Published source: `https://psapi.pinnacleblooms.org/api/getgurudatabyid?id=<exact ID>`; 491 successful Current records, captured once with concurrency 3.
- Original media: 149 article pages declaring a gallery, fetched once with concurrency 3; all 149 returned 200 and exposed one exact source-backed image each. No filename or identity inference.
- Output: 491 articles, 491 exact canonical paths, 149 observed gallery images, zero held records. Published dates run from 2023-09-25 to 2025-10-18.
- Public capture/export records timestamps and SHA-256 hashes per source; the allowlist excludes operational CBPI, UBPI and CenterId fields. Private capture files stay under `ask-private/guru-recovery-20261009/` and are not deployed.
- Dataset: 1,251,099 bytes; SHA-256 `9a802f33235da5d1632f67bfeadac48df4042d2405c9bd8418fc8873015d13a7`.

## Integration contract

Import `createGuruRecovery` from the deployed flat module `guru-recovery.mjs` (copy of this folder's `handler.mjs`). Call `createGuruRecovery({loadJson, shell})` once and reuse the returned asynchronous request handler.

- `loadJson('articles')` reads the new ASSETS key `/guru-recovery-data/articles.json`, uploaded from `data/articles.json` in this folder.
- `shell` is either the established object `{head,header,footer}` or an async function returning it. Reuse `/mirracles-library-data/shell.json`. That source supplies the current common navigation and all nine self-hosted Anek font declarations. No new font or auth gate is introduced.
- Call the handler from the existing public portal document dispatch. A returned Response is handled; null preserves existing ownership/fallback.
- The release owner must add this one data asset while preserving every other existing asset-manifest entry. A source commit by itself does not update the deployed asset.
- Keep the existing `/guru/*` Cloudflare route identity and move its worker association only after the candidate is promoted and checked. This folder does not change any route, worker, account or deployment.

## Behaviour

Only public HTTPS GET/HEAD numeric Guru routes are eligible. Authorization, range, private, malformed and unrelated requests pass through. Exact recorded article paths return the authentic full passive body, title and observed media with the common header/footer. Known bare IDs or alternate slugs redirect to the exact recorded canonical, retaining the entire query string. Unknown identities pass through; there is no inferred mapping.

Original dated text is retained, with a compact archive-context note linking current Verify and information policy pages. New structured data identifies the article and the existing Verify organization identity; it does not introduce clinical outcomes or ratings. Native phone links dial `+919100181181`, with an assessment link and mobile contact rail. Cookie/query responses are private and not stored. A source/shell loading failure produces a genuine temporary 503 with Retry-After and phone fallback.

The build keeps passive paragraph/list/table formatting and visible text while stripping executable content, inline events/styles and unsafe URLs. Blob emoji images retain their original alt text. Source linked media stays a link rather than an eager third-party embed. No authentication, form submission, sales record, OTP or call is performed by this module.

## Reproduction and validation

Run with Python 3.14 and Node 24.21.0 from the speech-site folder:

```text
python deployment/guru-recovery-20261009/build-data.py ask-private/guru-recovery-20261009/public-capture.json ask-private/guru-recovery-20261009/media-capture.json deployment/guru-recovery-20261009/data/articles.json
python -m unittest discover -s deployment/guru-recovery-20261009 -p test_content.py -v
node --test deployment/guru-recovery-20261009/handler.test.mjs
```

Verified locally: 5 Python tests and 6 Node tests pass, none skipped. The Node corpus contract covers all 491 canonical documents, original stored full body/media, one H1, verified publisher identity, calls, privacy fields, both known redirect forms with repeated/encoded query parameters, guards, HEAD/cache behaviour, temporary failures and shell/Anek continuity. The sanitization checks include every stored article body and hostile fixtures.

## Remaining release acceptance

The release owner must verify the actual flat module plus this exact asset are promoted, read back representative public URLs, and confirm mobile rendering/navigation against the deployed common shell. No production deployment, new crawl, search submission, cloud-browser run, field-vitals improvement or recovered rankings is claimed by this source package. The 491-row repaired cohort is not a claim to migrate all historical Guru content; unknown identities retain their prior owner.
