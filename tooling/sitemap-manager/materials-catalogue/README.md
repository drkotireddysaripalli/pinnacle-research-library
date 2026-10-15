# Materials catalogue source adapter

This standard-library Python helper converts owner-captured public source proof into metadata-only image relationships. It performs no HTTP requests, database writes, source-repository edits, deployment, scheduling or publication.

Its complete scope is `https://materials.pinnacleblooms.org/`. It selects observed `img.pb-img[src]` images inside `#pb-ho .pb-wrap .pb-track .pb-cols .pb-col .pb-card` under `document-content`, using the 20 observed track IDs. Repeated `pb-ho` IDs occur in the current source and are tolerated; the card ancestry and known track ID must still match. Images must exactly match `https://www.pinnacleblooms.org/Assets/Materials/<numeric>.jpg`. It does not select related-page cards, shell images, CSS images, placeholders, other extensions, query variants, arbitrary hosts, video links or players.

The parser is a bounded port of the reviewed current-render `CardHTML` parser with explicit catalogue scope. Existing public-reference permission is a required input. Accepted parent membership, actual render use, source selection, delivery and reference permission are retained separately. The helper claims neither original object/R2 identity nor use on a card's linked detail page.

## Daily pipeline hook

After the existing owner pipeline captures this exact public catalogue HTML and its HEAD metadata, run:

```sh
python3 catalogue_source_adapter.py \
  --html "$CATALOGUE_CAPTURE/catalogue.html.gz" \
  --page-proof "$CATALOGUE_CAPTURE/page-proof.json" \
  --heads "$CATALOGUE_CAPTURE/heads.jsonl" \
  --heads-receipt "$CATALOGUE_CAPTURE/heads-receipt.json" \
  --permit "$CATALOGUE_PUBLIC_REFERENCE_PERMIT" \
  --approved-release "$CATALOGUE_ACCEPTED_RELEASE" \
  --previous-candidates "$CATALOGUE_PREVIOUS_ACCEPTED_SOURCE/candidates.jsonl" \
  --as-of "$CATALOGUE_RUN_TIME_UTC" \
  --output "$CATALOGUE_RUN_OUTPUT"
```

The output directory must be new. First admission may omit `--previous-candidates`; daily runs supply the previous **accepted source** relationships. The completed 663-candidate packet is compatible as the initial previous source. The adapter accepts a single page-proof JSON object, or the existing current-capture JSONL file containing exactly one matching root record. Gzip and uncompressed HTML are supported. The approved release is a sitemap-manager release directory or manifest with file hashes, byte sizes, XML entry counts and exact approved parent membership; database inputs are unsupported.

The owner's HTML proof must retain `page_url`, `final_url`, `status`, `method`, `observed_at`, `response_headers`, canonical fields, robots fields, body hash/bytes and explicit false values for `credentials_sent`, `redirects_followed`, `media_bodies_downloaded`, `noindex`, `noimageindex` and `canonical_conflict`. A gzip file also requires its gzip hash. The body must have a complete HTML closing tag, matching explicit catalogue canonical and the expected renderer. Body and header robots are checked independently of the supplied flags.

HEAD JSONL records use `url`, `method: HEAD`, `status`, `content_type`, `direct_image_delivery_verified`, and optional `location`, `final_url`, `redirects_followed`, `x_robots`, content length and validators. Raw robots restrictions are checked independently of the producer boolean: `noindex`, `none` or `noimageindex` in `x_robots` or a case-insensitive `X-Robots-Tag` at the record root, `headers` or `response_headers` keeps the image held even when `direct_image_delivery_verified` is true. All supplied header variants are combined, so a blank normalized field cannot hide a restrictive raw header. Only exact matching image addresses are joined. Missing, failed, redirected, restricted or non-image HEAD results remain held. The owner's existing HEAD producer supplies current evidence for newly observed numeric image URLs; a new tile without exact HEAD proof is held rather than guessed. The HEAD receipt supplies `checked_at` and explicit false values for `redirects_followed`, `credentials_sent` and `media_bodies_downloaded`. For replay, the existing 15 October receipt's exact attested scope string is also supported. All used input files are hashed in the output report. HTML and HEAD timestamps must be at most 24 hours old by default, with five minutes of clock skew; the configurable freshness bound cannot exceed 48 hours.

The supplied permit must have `scope: current_public_sitemap_references`, the recorded direct owner request, and its reference-permission statement. No new rights prompt is generated. The adapter does not turn that reference permission into a redistribution licence.

## Outputs and reconciliation

- `catalogue-use-qualified-candidates.jsonl`: the same candidate relationship fields as the current source packet, plus `managed_source_id: materials_catalogue_pb_card_v1`. It retains the source image URL, actual catalogue use, labels, DOM/source lines, parent evidence, current body/source hashes, HEAD metadata and permit hash.
- `held-relationships.jsonl`: exact failed or unqualified source placements and their reasons. Duplicate placeholder placements may appear separately; these are records, not unique public image URLs.
- `proposed-source-withdrawals.jsonl`: previously accepted relationships absent or currently held, with reasons and `withdrawal_scope: this_managed_source_only`. These are proposals, never database commands.
- `report.json`: source counts, input/output hashes, approved-release provenance, cap calculation and zero network/database/publication actions.

Feed this candidate set into the existing reconciliation/publication pipeline under the declared managed source. Join the owner's exact approved-original alias registry there before selecting or counting physical assets. Do not infer aliases by filename or numeric ID. Reconcile proposed withdrawals only against this source's relationship ownership; preserve another source's association to the same URL. If the adapter exits nonzero, keep the prior accepted source and stop that release's source update. Never import an empty fallback after a rejected capture. A changed image-selection field, wrong/redirected parent, changed canonical, noindex/noimageindex, stale proof, missing permit or tampered evidence fails before output creation.

The 1,000-image limit uses the conservative union of all image URLs in the supplied approved catalogue baseline and the new qualified subset. The release contains no per-source ownership ledger, so the adapter never subtracts previous URLs from this cap calculation. It rejects overflow without truncation. The owner's final source-aware reconciliation and XML validation still run before promotion. Output is staged and renamed atomically and never overwrites an existing result.

## Saved acceptance

`python3 -m unittest -v test_catalogue_source_adapter.py` runs 15 meaningful fixture contracts, including new-tile admission, source-scoped removal, foreign/corrupt withdrawal rejection, redirects, canonical/robots restrictions, raw HEAD robots overriding a true producer verdict, partial renderer changes, related-card exclusion, failed or missing HEADs, permit/freshness checks, evidence tampering and the 1,000-image union limit.

The `cached-replay-robots-fix/` run reuses the completed 15 October HTML and HEAD proof with no requests. It reproduces exactly the same **663 candidate pair identities**, retains **9 failed image URLs** and **2 inline “Image unavailable” SVG placements** as held records, proposes **0 withdrawals**, and gives **690 exact image URLs** when combined with the 27 approved baseline URLs. `replay-validation.json` records the exact equality and output-hash checks. This is source-helper acceptance, not production deployment. Earlier replay directories are retained historical evidence.

The portable transfer archive contains only this helper, its test file, this README and the two synthetic HTML fixtures. Captures, candidate data, permits and local replay outputs are excluded. `helper-transfer-manifest.json` lists exact source hashes.
