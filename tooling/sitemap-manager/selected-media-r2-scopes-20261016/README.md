# Selected media R2 scope packet

This combined eight-file patch supersedes the offline seven-scope Ability packet.
Its immutable repository base remains
`f64e18a0ad9e51899e20e9fe202922f3f2c0ba4f`. The accepted seven-scope packet is
preserved in `../ability-r2-scopes-20261016/`; its patch SHA256 is
`dc4c830f261437749c5659112ffca3a1afabb15ca46a041a19a130a6a625be72`.

Use `selected-media-r2-scopes.patch` against the pinned five-scope base, or
`seven-to-eight-scopes.patch` if the accepted seven-scope patch is already applied.
Apply one route. Both `git apply --check` operations passed against their exact
offline bases. Reconcile subsequent main changes when applying to the owner's
current checkout; apply the narrow patch rather than replacing current files with
the historical `base/` snapshot. Existing status/checkpoint changes after the
pinned base must remain present.

## Exact scope change

The only additional runtime change from the accepted seven-scope packet appends
`['pbn-test','Assets/IMAGEGALLERY/']` at index 7. Indices 0 through 6 stay unchanged:

| Index | Bucket | Prefix |
| --- | --- | --- |
| 0 | pbn-test | Assets/InterventionTechniques/ |
| 1 | pbn-test | Assets/InterventionTechniquePdf/ |
| 2 | pbn-test | Assets/Materials/ |
| 3 | pbn-test | Ability/Assessments/ |
| 4 | pinnacle-ask-og | empty prefix |
| 5 | pbn-test | Ability/Questions/ |
| 6 | pbn-test | Ability/Examples/ |
| 7 | pbn-test | Assets/IMAGEGALLERY/ |

Current scope count: **8**. Ordered scope-set SHA256:
`d546e3563f80442e7e74e7b1da756ffd3ac791ab38c27c123307322b67528c21`.
The small follow-up changes only the scope array and its focused chain fixtures.
Rotation, progress readers, source-proof validation and private checkpoint transfer
already derive their bounds from the current scope set.

This prefix supports the separately prepared **new owner-selected gallery
manifest: 150 exact objects for 146 existing Guru parents**. The manifest's
selection authority is current owner authorization with a derived ID/sequence
association. This packet makes no claim about legacy upload code or historical
rendered use. Reading a metadata prefix does not register every object beneath it.
Only the explicitly selected associations may proceed through current delivery,
parent/render, canonical/indexability and robots verification before sitemap
admission. No associations, media, DB records or public pages are changed here.

## Required protected fresh-cycle transition

Old five-scope **and** seven-scope checkpoints/proofs are intentionally rejected.
Before the existing owner starts the fresh registry cycle:

1. Preserve the prior protected `rotation/current.json`, its referenced archive
   and any local observation checkpoint.
2. Start a new observation cycle with the exact eight-scope identity/count,
   current approved-registry hash, a new start time, pass/scope/page zero, null
   cursor and an empty page-hash index. Do not reuse old proof, absence, delta or
   cursors, or relabel old scope hashes/pass counters.
3. Replace only the observation checkpoint through the existing private-state
   path. Keep the accepted-publication bootstrap, verified public assets and
   rollback baseline unchanged.
4. Require two complete current-scope chains and current page freshness before
   accepting absence or using the proof for publication.

There is no automatic private-state reset or cloud migration in this patch.
Sixteen one-page terminals are the synthetic test minimum; real prefixes can
require additional pagination. Partial or stale coverage preserves last-good
publication. Existing bounded query budgets and continuation behavior remain.

## Focused verification

The affected suites passed: **9 chain contracts, 2 source-proof contracts and
11 Python checkpoint contracts: 22 cases**. They cover scope 7 in both passes,
16 terminal pages, zero-query rederivation, rejection of old five/seven-scope
proofs, dynamic filename bounds, missing final scope, stale evidence and protected
cross-runner checkpoint transfer before local replacement.

Primary Node verification used bundled **v24.19.0**. The checkpoint suite also
passed with bundled Python **3.12.14**; the initial compatibility run used shell
Node **v26.2.0** and Python **3.14.2**. The focused suites were repeated once to
verify Node 24 after detecting that shell runtime difference; both sets of logs
are retained. `runtime-test-receipt.json` records the commands' outcomes.

From `patched/speech-site`, run only if a new change or failure warrants it:

```sh
node --test scripts/test-r2-coverage-chain.mjs
node --test scripts/test-verified-r2-source.mjs
NODE_EXECUTABLE=/absolute/path/to/node python3 -B scripts/test-cloud-source-state.py
```

`patch-receipt.json` pins every changed file and both patch hashes. No cloud/R2
enumeration, DB query, media download, canonical checkout edit, commit, private
state migration or publication was performed. Root owns check-in and the existing
Windows owner owns the fresh-cycle transition and operational verification.
