# Ability reference observed-use adapter

`qualify_observed_ability_uses.py` is an offline, stdlib-only adapter for the single
managed source `ability_reference_illustrations_v1`. It reads the accepted packet,
actual emitted HTML, metadata-only HEAD evidence and the current public feed's
ownership projection. It returns existing importer rows; it performs no requests,
database writes, publishing, scoring or respondent-data processing.

The accepted packet is source commit
`7a81a90869d3505383faddfadc877973b58cb532`: 1,899 exact image pairs on 47 existing
`/abs/` parents (951 question images, 948 example images). Its 63 unmapped objects
are outside admission scope. The 16 October founder consent authorizes these exact
public reference illustrations. Unknown copyright/licence metadata remains
unknown; this helper neither grants a licence nor adds a new approval round.

## Inputs and emitted component contract

`load_packet(path)` accepts the bootstrap ZIP, its containing directory or the
`reference-render-plan` directory. It pins the consent and render-index SHA-256
values in the helper, verifies every parent manifest and its exact consent pair
set, and rejects changed/unknown pairs. An intentional future packet change needs
owner-reviewed external pins; never derive trusted pins from an incoming packet.
The CLI hash-override flags are an owner-policy interface, not packet-supplied
configuration.

Each current, anonymously captured HTML page must emit one visible section:

```html
<section id="ability-reference-illustrations"
  data-source="ability_reference_illustrations_v1"
  data-render-manifest-sha256="EXACT_PARENT_MANIFEST_SHA256"
  data-reference-consent-sha256="EXACT_CONSENT_SHA256"
  data-observed-set-complete="true">
  <figure data-ability-reference-asset="EXACT_ASSET_ID"
    data-reference-question-id="EXACT_QUESTION_ID"
    data-reference-role="question_image">
    <img src="EXACT_AUTHORIZED_URL" alt="EXACT_PURPOSE_ALT_SUGGESTION">
  </figure>
</section>
```

Use each manifest's actual `proposed_dom_marker`, `image_url` and
`purpose_alt_suggestion`. The three asset markers may instead be on the `img`;
conflicting ancestor markers fail. Each marked figure must contain exactly one
image. Shell references, hidden/inert template content, ambiguous lazy/srcset
sources, duplicate images and unknown markers do not qualify. This checks emitted
DOM references, not external CSS, pixel visibility or JS execution. Preserve the
plan's reference context, no-response/no-scoring boundary and one separate CTA.

The observations JSON envelope is:

```json
{
  "source": "ability_reference_illustrations_v1",
  "consent_sha256": "PINNED_CONSENT_SHA256",
  "render_index_sha256": "PINNED_INDEX_SHA256",
  "complete_observed_parent_set": false,
  "parents": []
}
```

Each `parents` record needs `page_url`, `method: "GET"`, direct `status: 200`,
exact `final_url`, `content_type: "text/html"`, `publication_qualified: true`,
`body_complete: true`, timezone-aware `observed_at`, and explicit false values for
`credentials_sent`, `redirects_followed` and `media_bodies_downloaded`. Supply
`body_sha256`, `body_bytes` and either `body_hex` or a relative `body_path` beside
the observations file. The Python API also accepts `body_bytes_value: bytes`.
Capture bodies are bounded to 8 MiB, must match their hash/length, and must be at
most 24 hours old (five-minute future clock tolerance).

Retain raw response robots evidence, e.g. `response_headers: {"X-Robots-Tag": []}`
when absent. Header aliases `headers`, `raw_headers`, `raw_header`, `x_robots`
and `x_robots_tags` are supported; repeated values combine. Raw header or HTML
`noindex`/`none`/`noimageindex` vetoes override producer booleans. An HTML canonical,
if present, must be the one exact parent. Otherwise an unchanged approved feed
canonical is recorded as the basis. The caller supplies its existing current
public-parent/crawler qualification via `publication_qualified`; this helper
does not fetch robots.txt or infer eligibility from sign-in UI.

`load_heads(jsonl, summary, packet)` verifies the JSONL hash, source asset metadata
hash and zero downloaded media bodies. Each used row needs the exact `url`,
`method: "HEAD"`, a fresh aware `observed_at` or `checked_at`, direct `status: 200`,
`content_type: "image/..."`, positive `content_length`, raw robots evidence and
`delivery_verified: true` or `direct_image_delivery_verified: true`. A raw robots
veto, redirect, conflicting MIME or definitive delivery failure disqualifies the
image independently. Missing/stale/transient evidence is unknown. The source
summary fields are `delivery_receipt_sha256`, `source_asset_sha256` and integer
`media_bodies_downloaded: 0`.

The existing `../ability-parent-preflight.json` records the root owner's 47/47
parent pass at `2026-10-16T04:58:33.578671+00:00`; the adjacent
`../qualify_ability_parents.py` is its producer. This is optional readiness
evidence. It cannot replace fresh component HTML, image delivery evidence or
the feed projection, and this adapter does not rerun it.

## Existing feed integration

`feed_state_from_db(db, packet)` performs SELECTs only on the public feed's existing
`pages(url, canonical_url, decision, metadata_json)` table. It reads
`metadata_json.managed_image_ownership[image_url].owners` and
`.source_sha256[source]`, including every currently Ability-owned pair. It does
not query clinical tables. The returned JSON projection is also the CLI's
`--feed-state` input. `ownership_projection_complete: true` and an explicit
`prior_owned` list are required; absent state is never interpreted as empty.
Out-of-scope prior ownership rejects the run for owner resolution.

The owner integrates with the existing `managed_media_sources.reconcile` inside
its existing feed transaction, after registering this one source in the existing
managed-source allowlist. The row interface is unchanged:

```python
packet = ability.load_packet(packet_path)
state = ability.feed_state_from_db(db, packet)
result = ability.qualify(packet, observations, heads, state, now, body_base)
save_source_receipt_and_holds(result)  # keep status and all held reasons
if result['can_reconcile']:
    ability.assert_feed_state_unchanged(db, packet, result)
    managed_media_sources.reconcile(db, {ability.SOURCE: result['desired']})
```

Use **`desired`**, never `qualified` alone. `qualified` contains only newly
proven current uses. `desired` includes all previous Ability-owned uses, carrying
their previous hashes when evidence is uncertain, plus qualified additions,
minus explicit permitted withdrawals. `source_sha256` for current uses is the
actual HTML body hash; consent/manifest/source IDs remain separate provenance.
The fingerprint guard must run immediately before reconciliation in the same
transaction. A changed feed requires requalification. If `can_reconcile` is
false, skip applying this source and retain the hold; do not pass an empty set.
`parent_vetoes` distinguishes current proven vetoes from stale/missing evidence.
Any current veto affecting a desired relationship makes `can_reconcile` false,
even when the existing feed still says INCLUDE. `reconciliation_parent_vetoes`
records that operand. The downstream page eligibility stage must independently
remove nonindexable/redirected parents from public publication; this media helper
does not rewrite page decisions or treat a parent veto as an asset deletion.

Withdrawals require the envelope to declare **all 47 exact parents**, every
parent to pass current capture/renderer checks and every section to declare
`data-observed-set-complete="true"`. A missing source image in that complete
selection, or a rendered image with definitive current delivery/robots veto,
can then remove **only this source's ownership**. Missing/stale/unknown captures
or HEAD evidence cannot prove deletion. Other owners and retained unmanaged uses
survive existing reconciliation. Do not pass these withdrawals as the generic
global `blocked` set. Held relationships remain held in status even when their
source ownership is safely withdrawn; do not relabel them healthy. Existing
per-parent image limits and parent eligibility still apply in the importer.

## CLI and local evidence

```sh
python3 qualify_observed_ability_uses.py \
  --packet bootstrap.zip --observations captured-pages.json \
  --heads delivery.jsonl --head-receipt delivery-summary.json \
  --feed-state current-feed-projection.json --as-of 2026-10-16T06:00:00Z \
  --out observed-ability-output
python3 -B test_qualify_observed_ability_uses.py
```

The CLI writes `qualified-relationships.jsonl`,
`desired-source-relationships.jsonl`, `source-local-withdrawals.jsonl`,
`held-dispositions.jsonl` and `observed-use-receipt.json` in the supplied output
directory. Writes are staged and the receipt is replaced last; consumers must
verify its output hashes. Keep output outside input directories/files. Exit 0
means complete qualification; exit 2 means a valid held result, whose desired
snapshot may still be safely applied when `can_reconcile` is true. Malformed or
unbound input fails before output staging.

Ten focused tests pass: exact positive use, packet/provenance tampering,
unknown/changed/hidden/inert/duplicate/srcset renderer rejection, completeness
and ownership-only withdrawal, stale/missing evidence retention, independent
raw robots vetoes, incomplete/out-of-scope ownership rejection, read-only DB
projection/concurrent-change guard, HEAD receipt binding, and a fresh parent
noindex veto against a stale-positive feed (with stale-evidence retention).

`cached-packet-replay.json` is a bounded offline safety replay: accepted ZIP and
directory agree; all 1,899 scoped cached HEADs pass at the cached receipt clock;
63 extra delivery objects are ignored. With zero actual component observations
and an explicitly synthetic feed projection, the result is **0 qualified,
1,899 held, 0 withdrawals**. It proves HEAD-only evidence cannot admit assets;
it is not current production acceptance. Integration and actual rendered-page
readback remain Windows owner work. No new URL, live DB write or publication
was performed by this helper task.
