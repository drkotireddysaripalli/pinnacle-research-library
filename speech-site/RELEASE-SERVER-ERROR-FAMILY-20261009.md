# Server-error family recovery — 9 October 2026

Action ID: `7672556f-3afb-4dbc-a700-3637dbaa672e`.

## Recorded audit scope

Ahrefs project10477823, crawl completed9October08:01:54UTC:16,481 server-error URLs. The complete501-row non-Mirracles export contains491 Guru URLs and10 other public URLs. The remaining15,980 are Mirracles. These are recorded crawl results, not a fresh live failure count. The source audit Health Score was61; this release does not invent a new score.

## Why built video pages still failed

The original public library release was promoted8October01:58:47UTC. Captured Ahrefs failures occurred later that day. They were not merely a pre-release audit.

Two defects combined:

1. **Incomplete identity migration.** The legacy public handler accepted both database `Id` and alternate `F25`; the new catalogue was built from sitemap/archive URLs and did not retain the full relation. Unknown IDs returned to the legacy website. Four captured Ahrefs examples—1,1000,10000,10001—were all still on that fallback.
2. **An overlapping Cloudflare route broke a legacy dependency.** Saved8October23:08UTC responses from `mirracle.pinnacleblooms.org/api/gl/gettotalstaff` and `getfaqlang` returned the React HTML shell rather than JSON. A legacy video-page trace failed in `GetStaffandCentersData` inside `_Layout-V9.cshtml` while parsing `<` as JSON. The separate API ownership repair began23:15UTC;23:16UTC read-backs returned valid JSON. Current9October probes of two exact audit video identities returned200 through the legacy fallback, not the new library.

The route repair addressed the outage. This release closes the source-backed old-ID gap so mapped public videos no longer depend on that legacy layout.

## Shared repairs

- **23,525 authoritative old-video IDs** map to existing public canonical records:17,994 sitemap-directory targets and5,531 existing archive targets. The captured source is a single read-only projection from the existing publication store. No database writes, title guesses or new video publication occurred.
- The29,759 existing catalogue records,19,292 directory entries and57 exact alias paths are preserved. Mapped bare IDs and changed slugs redirect308 with the complete original query string. The previously proven55 exact legacy paths retain200 behavior.
- 6,949 source rows have no matching `F25` target in this catalogue and are not added by this mapping. That is a source-join category, **not** a count of failing public URLs or required new publications. Existing native IDs and fallback rules remain intact.
- **491 Guru articles** are recovered from their exact public source records, retaining full passive bodies and149 observed images. Their legacy failure was a null `CenterId` converted to a required integer. The new renderer uses published article data without inventing a centre assignment. This491-row error cohort is not an authoritative total Guru corpus count.
- The reproduced Android failure on `/t/interactive-song-therapy` is covered by the shared, fingerprint-guarded legacy mobile recovery for public resource families. It retries the same page once with the desktop rendering path only after the known legacy mobile exception; private/API/write requests remain excluded.

## Release protection and validation

The prepared release retains all3,706 prior asset keys, changes the video catalogue, and adds one Guru asset (3,707 total). All307 routes are preserved except reassignment of the existing Guru public route to the portal. Restored API routes, other workers, authentication, enquiry delivery and bindings remain guarded against drift.

Offline evidence:19 video contract tests include94,100 redirect assertions across all23,525 IDs, both URL forms and both maintained/flat runtimes. All29,759 video records and57 exact aliases render through the actual flat runtime. The491 Guru records are tested for body/identity/media preservation; an additional integration test exercises the actual portal handler and its two asset requests. Eight mobile-recovery tests cover the reproduced exception and protected cases. Public responses and hosted CI are separate acceptance stages.

## Current release status

Delivered source `976a6f14c5b8ea32093a84b9ef00f2f5177b39b8` passed exact-source Portal quality CI37950263802 and was promoted as portal version `7bb69631-bb3b-4da3-a503-164accfeb6c0`, deployment `259c6d7b-31a8-4d60-93ef-e2c435575fc3`. All491 Guru pages and all501 saved non-Mirracles audit URLs returned200 on desktop. The557-case GET read-back had555 strict passes, one genuine remaining mobile500 and one unrelated missing-H1 flag on a staff page that returned200. All38 old-ID video cases passed. Four local Chromium browser cases passed at390/1440widths; no live customer or analytics events were generated.

The remaining mobile500 exposed an overly strict heading check: real desktop content starts its H1 text on a new line. The follow-up accepts meaningful trimmed/nested heading text while still rejecting empty/script-only markup. Nine focused tests passed. Exact runtime source `514d0c5d03edf33e789028a91d6102cb2f9d36f8` passed [Portal quality CI37953162374](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37953162374), including the required TestingBot BVT. It is live as portal version `e9d560c2-55c7-4daa-874c-6fd71460fe8a`, deployment `e1251cb3-08f9-4b7b-97a0-c49ddbb39b90`; the corresponding legacy entry is also deployed. Three targeted follow-up GETs returned200 with correct content and preserved queries. The mobile page retains `tel:9100181181`. This is user-agent verification, not a new physical-device test.

The follow-up retained307 routes,49portal/9legacy modules,all3,707assets and the protected Worker versions/bindings. One deployment-helper annotation correction was necessary after Cloudflare rejected a read-only field; the rejected upload created no version, actual state was reconciled, and tested runtime source was unchanged. Full read-back is in `deployment/server-error-mobile-20261009.json`.

IndexNow accepted551 changed URLs with key validation complete (550 mainbatch,1follow-up). Receipts: `deployment/server-error-indexnow-20261009.json` and `deployment/server-error-mobile-indexnow-20261009.json`. This is notification acceptance, not indexing, ranking or a new Ahrefs crawl.

The latest available Ahrefs report at9October15:42UTC still points to the08:01:54UTC completed crawl, Health Score61. A fresh complete audit was not started: the available Ahrefs interface exposes report reads, while Windows computer control failed active-URL identification. The report's16,481 historical errors are therefore not claimed cleared. The complete recorded15,980-video error list has not been freshly crawled; the shared23525-ID mapping has offline full-coverage and live stratified evidence. Close audit clearance only against new completed provider results.

Known separate failure: `/inclusiveleaders/4236` references missing legacy view `InclusiveLeaders-V9`. It is outside the501-row non-Mirracles error export used here and is not repaired or counted as repaired by this release. Operational API-host incidents likewise retain their separate owners and evidence.
