# Source refresh through the existing native publishing command

The website owner runs one bounded command on the existing publishing machine:

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

External publishers must invoke this existing entry point or supply their object event to its next release checkpoint. An out-of-band database/R2 console write cannot wake a stopped scheduler. Full real-time provider-to-machine dispatch is not established or claimed by a successful manual/native publishing command. The explicit fallback is current source reconciliation on each publisher/release invocation.

The first unbounded fingerprint attempt hit the unchanged 6,000ms statement timeout. Its exact original RPC was restored and read back before the bounded additive extension was installed. Owner, security mode, EXECUTE grants, source filter and normal sitemap page size remain unchanged. The corrected complete reader passed both stable snapshots. Failed attempts remain in the private evidence; they are not green results.
