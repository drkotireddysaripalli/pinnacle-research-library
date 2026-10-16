# Offline Ability R2 scope patch

Base: `drkotireddysaripalli/pinnacle-research-library` main resolved at
`2026-10-16T05:53:03.115055+00:00` to
`f64e18a0ad9e51899e20e9fe202922f3f2c0ba4f`.
`base-source-receipt.json` pins each required public GitHub source file.
`base/` is unchanged; `patched/` contains the eight-file candidate change.

`ability-r2-scopes.patch` adds only these exact public metadata scopes:

- `pbn-test / Ability/Questions/`
- `pbn-test / Ability/Examples/`

The original five entries retain their indices; these append at indices 5/6.
No Guru, gallery, video or broad `Ability/` scope is added. This does not register
any asset relationship, infer rights/rendered use, edit publisher content or admit
an image to a sitemap. The Windows owner retains full source/render/association
and cloud-release integration.

The chain exports its scope-set SHA-256 and a shared page-filename validator whose
bounds follow `R2_SCOPES.length`. State, metadata pages and derived proof must carry
the current scope-set identity; state/proof also require the exact scope count.
The source verifier independently rejects old-scope proof. Rotation/progress
readers include scopes 5/6 and reject unknown/noncanonical reserved page filenames.
The Python private-checkpoint filename filter accepts numeric scope indices, then
requires the Node chain validator to enforce actual bounds. Its pointer binds the
same scope identity/count to the archived state before local replacement.

The producer derives output from the same page bytes whose chain it validated.
Existing registry hashes, page hashes, cursor continuity, terminal evidence,
two-pass absence, unstable holds, freshness and private/publication separation
remain enforced. Query budgets and continuation behavior are unchanged.

## Required owner transition

**An old five-scope checkpoint or proof is intentionally rejected.** The owner
must first retain a protected snapshot of the prior `rotation/current.json`
pointer, its referenced archive and any local observation checkpoint. Then start a
fresh seven-scope rotation state through the existing private source-state path:
current scope identity/count and registry hash, a new start time, pass/scope/page
zero, null cursor, empty page-hash index and no reused absence, proof or delta.
The accepted-publication bootstrap remains unchanged. The new current rotation
checkpoint must replace the old observation checkpoint independently so old
coverage/cursors cannot be restored as seven-scope evidence. Do not rewrite old
hashes, counts or pass counters to make five scopes appear complete under seven.
This patch provides explicit rejection, not an automatic private-state reset or a
new migration service.

Only two complete current seven-scope chains can establish absence. The tests use
14 one-page terminals; real prefixes may have additional paginated metadata pages.
Incomplete, stale or identity-mismatched evidence cannot become accepted absence.

## Validation and handoff

`git apply --check ability-r2-scopes.patch` passed against the immutable `base/`
snapshot. Root can apply the patch to its native handoff checkout and reconcile
any subsequent main changes; this task did not edit the main checkout or check in.

From the patched checkout's `speech-site` directory:

```sh
node --test scripts/test-r2-coverage-chain.mjs
node --test scripts/test-verified-r2-source.mjs
NODE_EXECUTABLE=/absolute/path/to/node python3 -B scripts/test-cloud-source-state.py
```

Bundled Node **24.19.0**: **9/9** chain contracts passed (`tests.log`) and **2/2**
adjacent verified-source contracts passed (`verified-source-tests.log`). Python:
**11/11** checkpoint contracts passed (`python-tests.log`). Meaningful cases cover:

- All seven approved synthetic scopes present in both passes: actual cached
  rotation/progress reader accepts 14 pages, including the two new prefixes,
  without performing a fetch; derived absence is zero.
- Five-scope/missing identity proofs, unknown scope filename, altered page identity,
  missing terminal, cursor/hash tampering and incomplete later scope reject.
- Stale complete metadata still fails fresh publication acceptance. Cached derived
  false deletion outputs are rebuilt from verified pages.
- Fake in-memory checkpoint transfer across two runners retains scope 6; altered
  pointer scope identity fails before replacing receiving state. Existing partial
  progress, corruption and accepted public-byte preservation tests still pass.

Only immutable public GitHub source files were fetched. All R2/S3 test data and
clients are synthetic; no cloud metadata enumeration, media bodies, production
state, credentials, database writes or deployment were used. `patch-receipt.json`
contains base/new file hashes, patch hash, scope identity and exact test results.
