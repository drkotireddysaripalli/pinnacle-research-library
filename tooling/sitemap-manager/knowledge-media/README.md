# Maintained knowledge media metadata export

Analysis artifact only. The exporter reads local maintained publisher data and an
approved parent feed/release. It makes no network calls, production edits, cloud
changes, authentication requests or submissions. Python 3.10+; no dependencies.

Run on Windows against the owner's latest accepted source and parent baseline:

```text
python export_knowledge_media.py --source-root "PATH/TO/sitemap-manager-repo" --approved "PATH/TO/approved-public-feed.sqlite3" --output "PATH/OUTSIDE/REPO/new-export-run"
```

`--source-root` can also be the `speech-site` directory. `--approved` can instead
be a sitemap-manager release directory or its `manifest.json`; all listed page
XML hashes, sizes, entry counts and total parents are checked. SQLite inputs use
a consistent read-only backup that includes committed WAL rows. Eligibility,
curation and supplied public-source/publication policies remain in each joined
row. The receipt hashes the actual logical approved rows used, not a potentially
stale SQLite main file. Output must be a new directory outside the source repo.

Files in each complete run:

- `source-backed-relationships.jsonl`: exact approved canonical parents with
  source-backed hero/gallery/body images. Ready for owner import review; it does
  not grant media publication approval. Registration-gated records remain here
  with that access class; sign-in does not imply private/noindex.
- `association-candidates.jsonl`: those relationships plus legacy Sunshine
  metadata-only candidates, unapproved source parents and rejected images.
- `parent-accounting.jsonl`: one disposition for every approved FAQ, Guru,
  Sunshine collection and legacy Sunshine-family parent, plus unmatched source
  parents. Unknown media and external detail owners remain explicit.
- `source-inputs.json`: every consumed source file and its SHA-256, plus exporter
  hash. Source paths are relative to `speech-site` for portability.
- `report.json`: approved scope coverage, family counts, relationship/use/URL
  counts, dispositions, input provenance and hashes of the four data files.

Selection contract:

- FAQ: resolve `faq-index` identity to `faq-<language>-<id>.json`, require exact
  ID/language/URL/image agreement, export detail `image`. Current FAQ sanitized
  HTML has no inline images; unexpected inline images require contract review.
- Sunshine: replace base records by recovered ID exactly as `sunshineRecords`;
  recovered topic `image` has rendered use. Remaining index images are metadata
  for their linked legacy detail URL, never for the collection page. The
  collection's link list supplies no record image use.
- Guru: export `records[id].images[].src` and `bodyMedia`; verify `bodyMedia`
  exactly agrees with `<img src>` in maintained sanitized `body`. Eight original
  articles listed outside the recovery dataset retain their other source owner.
- Shared shell images, known fallback images and logo/favicon/lockup filenames
  are rejected. Plain FAQ/Guru video links are never turned into video players.

`actual_rendered_use=true` means the maintained template directly renders the
selected field; it is not a fresh live response, accessibility test, R2 inventory
check, licensing decision or media-publication approval. Retain the separate
approved-parent eligibility and source/access policy for the owner's decision.
Source dates are provenance, not new sitemap `lastmod` assertions.

Relationships deduplicate exact parent+image+role+record. `source_use_count` and
`selected_use_ordinals` retain repeat uses; distinct parent-image pairs, distinct
URLs and use totals are reported separately. Different public parents are never
collapsed together. There are no inferred image filenames or invented parents.

Acceptance: every approved in-scope parent has exactly one accounting row; family
disposition totals equal those parent counts; every relationship has an exact
approved parent, a valid selected image URL, renderer and source hash; metadata-
only/unknown/rejected cases cannot enter source-backed relationships. The owner
must separately resolve publication policy and promote approved relationships
through the existing pipeline, then verify the resulting public release.

Run the portable contracts locally:

```text
python -m unittest discover -s . -p test_export_knowledge_media.py -v
```

Check a completed export's hashes, exact parent coverage, retained eligibility,
candidate/relationship separation and all family counts:

```text
python validate_export.py --data "PATH/TO/new-export-run" --approved "PATH/TO/approved-public-feed.sqlite3" --output "PATH/TO/new-verification.json"
```

Optionally pass `--approved-release "PATH/TO/accepted-release"` to also require
the approved feed and hash-verified release to contain exactly the same parents.

Repeating with unchanged inputs into another new directory produces identical
data and reports. Renderer marker changes, malformed/conflicting source data,
release hash failures and source changes during the run fail before a final run
directory is written. Existing output is never overwritten.
