# Source refresh through the existing native publishing command

The existing local `postbuild` now invokes `scripts/public-source-trigger.mjs` whenever the approved private configuration exists. CI and publisher-child builds skip dispatch, and a source-publisher ownership lock blocks overlap. The same bounded entry point can be invoked explicitly:

```text
npm run sitemap:publish-source -- --config ask-private/public-publisher-config.json --id <unique-publisher-event-id>
```

For a resource uploader's explicit object change/deletion signal, add `--r2-events <private-event.json>`. This is a publisher/release entry point, not a new recurring schedule. Database/R2 changes are reconciled at this publishing checkpoint; no claim of instant monitoring of every external console write is made.

## What the command actually does

1. Reuses the existing authorised Cloudflare login and the existing approved public Ask reader connection. No anonymous table SELECT is granted.
2. Reads two matching complete eligible Ask snapshots through `ask_portal_sitemap`. The original 10,000-URL `items` list remains unchanged. Added `source_items` uses 1,000-row bounded batches and actual SHA256 of the same selected public content fields as the reviewed source packet. Missing, unstable or truncated snapshots cannot remove URLs.
3. Reuses the approved generator-compatible feed and current public resource references. Conditional GETs and per-row checkpoints avoid recollecting successful evidence after a downstream failure. Fingerprints include actual public text/metadata/media relationships, rather than URL or crawl-time hashes.
4. Qualifies only previously approved public parent/rights relationships. New/unmapped identities and references remain held with an explicit owner and condition. Existing source/clinical/location holds are preserved.
5. For supplied known public R2 object events, looks up exact key prefixes using metadata only; it does not inventory all private objects or download video/image bodies. Storage absence needs an explicit delete signal and two matching lookups. Storage timestamps never become page lastmod. Changed videos without current required metadata are held rather than retaining stale optional facts.
6. Generates and validates public XML, human navigation and LLM files through the existing manager and shared-shell build. If public bytes are unchanged, it records the fresh source checkpoint without a redundant deployment or engine submission.
7. For a genuine public output delta, commits only the generated archive/selection, waits for exact-source CI and candidate BVT, publishes the full current asset/module/route union, verifies the live public files, and installs the accepted private source state. Checkpoints/logs remain on disk. Retired managed navigation URLs remain retired across later releases.

## Evidence and boundaries

The first current run checked 40,170 eligible Ask records twice, all 1,103 approved resource pages, and three named already-approved R2 objects. It found no Ask content or storage change, and 508 feed navigation title/description updates sourced from existing live resource pages. These are navigation metadata updates, not 508 newly authored or rewritten primary pages.

The approved seed replays the 71,047-page public feed. Unknown/private/unassociated additions are not automatically promoted. Source content/clinical records, original assessment questionnaires, paid books, advertisements, receiving systems and stopped growth jobs are not modified by this publisher command.

The trigger runs at a local build/publishing checkpoint. No periodic reconciliation job or provider write hook exists on this machine: the only Pinnacle Windows tasks discovered are the disabled retired API scheduler/gateway. Those remain stopped. External database/R2 edits therefore wait for the next publishing checkpoint or an explicit existing uploader signal. This is not continuous provider-to-machine dispatch, and requires the publishing host and its existing credentials to be available. A failed job retains its logs/checkpoint and unreconciled lock rather than silently starting another release.

The document-title parser is shared by both the public media snapshot and refresh readers. It now reads `<head><title>` and excludes SVG accessibility titles. A fixture exercises both readers. The existing 1,103 complete resource observations were reused, with bounded head-only readback for 93 affected documents; actual source fingerprints were recomputed. All 126 reviewed resource video titles were compared with the actual head titles (without the publisher suffix), and all already matched. Their descriptions and dates were preserved. The two superseded prepared archives were never promoted; the final selected archive must pass the zero SVG-title-contamination check.

The first unbounded fingerprint attempt hit the unchanged 6,000ms statement timeout. Its exact original RPC was restored and read back before the bounded additive extension was installed. Owner, security mode, EXECUTE grants, source filter and normal sitemap page size remain unchanged. The corrected complete reader passed both stable snapshots. Failed attempts remain in the private evidence; they are not green results.
