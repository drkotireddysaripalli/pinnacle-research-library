# Guru selected galleries — 16 October 2026

This is a prepared source/integration packet for **150 exact image objects on 146 existing public Guru parents**. It creates no pages, feed rows, database writes or production changes. The accountable publisher owner retains integration and deployment.

The selection is NEW: derived GuruID + contiguous object sequence + exact current reference `TotalImages` count, selected now under Dr. Koti Reddy Saripalli's R2 publication instruction. **Historical gallery rendering, upload ownership and legacy URL construction remain unknown and are not claimed.** Legacy upload code is not a gate for this explicit new selection. `plan/selection-scope.json` records the authorization and every exact parent/key/selected URL/source-row hash. Copyright ownership and licence remain unknown; this packet invents no licence grant and does not request a new approval for the already instructed exact public-reference use.

## Exact scope and current result

- 156 supplied public-reference Guru records; declared image total152;8 null counts.
- 150 selected objects /146 existing parents:143 single-image galleries,2 two-image galleries (6045,6057),1 three-image gallery (6307). All sequences start at zero and are contiguous.
- 6104 and 6132 each declare one original, but none was present in the scoped cached inventory. They remain excluded; this is not a current all-storage absence/deletion claim.
- 5974,5979,6015,6380,6381,6382,6383,6385 have null counts and remain excluded. Existing thumbnails are separate evidence.
- All selected URLs are exact `https://images.pinnacleblooms.org/Assets/IMAGEGALLERY/<GuruID>_<sequence>.jpg` values already present in the input's configured URL list. Other hosts are not asserted to be aliases or historical selections.

Current bounded observations: **2026-10-16 09:26:25–09:26:52 UTC**.150/150 gallery HEADs return direct200 `image/jpeg`, positive lengths and no X-Robots veto. All150 cached ETags and sizes agree with the previous inventory metadata; this is not cryptographic byte identity or image-body inspection.146/146 parents return direct200 HTML, one equivalent canonical and no meta/header image-indexing veto, with www robots allowing Googlebot, Bingbot and Googlebot-Image. The image host's robots.txt returns direct404 (no robots file, no Disallow rule); raw status is retained.403/429/5xx/redirect/unavailable robots evidence is treated as unknown by this helper.

The bounded batch made444 requests:146 parent GETs,150 selected-image HEADs,146 deduplicated current same-ID primary-thumbnail HEADs, and 2 robots GETs. It sent no credentials, followed no redirects, performed no retries, used at most4 workers and downloaded no media bodies. Parent HTML and original repeated header pairs are saved locally with hashes. Header inspection found no Cookie/Set-Cookie/Authorization/Proxy-Authorization fields.

All146 currently selected visible same-ID `Assets/PUBLISHIMAGE/Image/<GuruID>_THUMB.jpeg` URLs return404. `preflight/primary-replacement-plan.jsonl` therefore permits sequence zero as a **new** visible-primary fallback on those 146 parents after owner integration checks.145 OG slots select the same confirmed broken thumbnail and have a separate fallback permission. Guru 6129's other existing OG emblem is preserved. These are exact-slot conditional changes, not aliases or permission to rewrite footer, related, body or shared-shell images. Preserve valid existing selections and unknown/temporary failures. The earlier147-reference broken-thumbnail cohort is separate; this packet does not claim to resolve all of it.

## Inputs, rendering and evidence

The generator pins the exact three supplied input files; changed bytes require an owner-reviewed reselection. They contain only public Guru reference metadata and cached public object associations. `source_reference.table` is a human-readable projection label, not a newly discovered SQL table contract; this work made no database query. The inherited source-file hashes retain the inventory and publisher evidence chain without duplicating those large files.

Each parent manifest binds GuruID, existing canonical parent, literal public title, selected object key/URL, sequence, candidate/projection record hashes, input hashes and selection-scope hash. Source `last_modified` is object metadata, not a publication date. Unknown dimensions, copyright, licence and historical use remain explicit. Public-title whitespace is collapsed only. Alt/caption text describes the article-gallery purpose, without asserting image contents, clinical outcomes or a licence. Each ordinary visible section has one Pinnacle Blooms Network /9100181181 CTA. No forms, scoring, patient/child responses, hidden details, scripts, styles or new URLs are created.

The source formatter emits escaped HTML fragments, `loading="lazy"`, `decoding="async"`, and these future actual-use verification markers:

- Section: `data-guru-gallery-source="guru_selected_reference_galleries_v1"`, GuruID, exact selection-scope SHA256 and parent-render-manifest SHA256.
- Figure: exact asset identity and gallery sequence; nested img `src` and purpose-alt must equal the parent manifest.

Asset identity is a hash of the exact key + newline + selected URL; it is not a media-byte hash. All150 pairs still have **`HOLD_UNTIL_RENDERED_DELIVERY_AND_PARENT_QUALIFIED`**. Preflight delivery/parent success does not prove the new galleries are rendered. Actual-use verification, source-family feed admission and publication remain pending.

`artifact-inspection.json` records an independent offline HTML parse of all 146 fragments:150 unique exact pairs,146 CTA links, exact markers, no active/hidden markup, and 150 cached ETag/size matches.10 focused tests pass; `focused-tests.log` is retained. Tests cover escaping/determinism, source-hash/scope rejection, missing sequences/counts, URI/IRI canonical comparison without decoding reserved `%2F`, robots vetoes, missing-versus-unavailable robots, primary-scope isolation, and conditional404 fallback without transient/unknown rewrites.

## Compact package and local evidence

The ZIP is metadata-only. It includes code/tests, the three input snapshots, exact selection/exclusion/relationship/index files, all 146 manifests and fragments as compact JSONL, current image/parent/primary/robots records, raw repeated-header records and the small www robots body. It contains no image/video body or private clinical/response data.

To avoid duplicating146 public page bodies in Git, their complete local bytes stay under the original `preflight-capture/raw/` directory. `local-evidence-receipt.json` pins every local raw file and gives its original capture root. Body-file paths in preflight records resolve there. `preflight/raw-header-records.jsonl` carries header-file path, original-byte hash and parsed header record; `preflight/robots-bodies.jsonl` carries the saved robots content. The image-host404 had no body read. Missing archived HTML is deliberate package compaction, not missing local capture or new proof.

Inside the ZIP, `plan/parent-render-manifests.jsonl` records each original path, SHA256 and manifest object; `plan/gallery-fragments.jsonl` records original path, SHA256 and exact HTML string. The original per-parent layout can be regenerated byte-for-byte from included pinned inputs:

```sh
python3 -B build_selected_galleries.py --inputs inputs --output regenerated-plan
python3 -B -m unittest -v test_selected_galleries.py
```

Expected regenerated index SHA256: `699385f9f689294d097578ecb0ef64ef4be98f9ab6de84992ee50d17bccbac66`.

Selection-scope SHA256: `f5c71d363e6716a2ddf3671754b6222b6add232cba248ffc35dbf59cd7b54733`.

Current capture-index SHA256: `68e734dbff277a5f97ead585e3ae3d5bf10d7932363ef152c116a5d0e8ce862a`.

For cached replay against the complete local capture only, run `preflight_selected_galleries.py summarize --plan plan --evidence preflight-capture --output NEW-results`. It hashes local raw evidence and sends no requests. The separate `capture` subcommand is a network operation for an owner-authorized fresh preflight; do not rerun the already completed batch merely to unpack/import this packet. The compact ZIP alone does not contain the parent HTML bytes needed for a complete cached replay. The initial conservative `preflight-results/` local analysis is superseded by `preflight-qualified/` and is excluded from this handoff.

## Owner integration and completion

1. Import the immutable selection and exact parent manifests into the existing Guru publisher path by GuruID and existing canonical URL. Use the exact newly selected image URLs. Do not treat filename matching as historical provenance or create individual image/article URLs. The already separate eight-scope watcher packet includes IMAGEGALLERY; this packet does not change cloud scopes, accepted publication state or R2 inventory.
2. Inject the visible escaped section into each existing article content area, retaining owner layout/CSS. Apply the primary and OG fallback plans separately, only if the current exact selected slot still matches the captured404 case (or a newly verified true absence). A changed/valid/unknown slot must be preserved/held rather than blindly overwritten. Keep6129's existing unrelated OG emblem unless separately selected by the owner.
3. Obtain deployed direct HTML readback for all 146 existing parents. Require fresh acceptable status, canonical, meta/header robots and applicable robots.txt evidence. Verify the section's selection/manifest hashes and exact figure asset/sequence + img src/alt against the pinned manifests. Require all 150 expected parent-image pairs exactly once in the intended section, visible ordinary markup, no unknown pairs, and the single section CTA. Verify actual new primary/OG output separately. A page becoming nonindexable must be excluded by downstream page eligibility independently of a stale positive feed.
4. Only after actual rendering and delivery/parent qualification, emit the owner's existing managed image association/feed schema with source-local provenance `guru_selected_reference_galleries_v1`. Retain unknown copyright/licence metadata and the explicit user publication instruction. Do not relabel the relationship as historically rendered. Any source-local withdrawal needs a declared complete observed parent set; unknown/missing observations do not authorize global deletion.
5. Root/Windows perform their existing release/XML/union/live checks. Completion is integrated public rendering plus qualified exact associations and verified current primary fallbacks; this prepared packet is not a public deployment or indexing result. Missing originals6104/6132 and 8 null-count parents remain separately held.

Adjacent `bootstrap-receipt.json` binds the immutable ZIP and packet-file manifest. `native-upload-plan.json` gives proposed repository paths, local file bytes, SHA256, Git blob SHA1 and base64 lengths for the root owner's native checkin; it performs no upload itself.
