# Publisher-driven media publication

The reviewed public archive selects 71,047 eligible pages, 66,537 image entries and 19,289 video entries. Raw R2 inventories and private operational records are excluded. The existing managed namespace is replaced inside the complete current Worker asset union; unrelated modules, routes, bindings and the accepted public-document recovery remain protected.

## Existing Git publishing path

The existing postbuild stage now reads `src/data/public-library-publisher.json`. Its actual record content controls the generated reading guide, its content fingerprint and the root navigation link. Editing or removing a record changes generated publication; an empty register retires its generated guide without changing clinical/source content. This non-care record provides a controlled production change/deletion test.

Run from `speech-site`, on the committed/pushed source branch:

```text
node scripts/publish-managed-event.mjs --id <unique-source-event-id> --baseline-receipt outputs/<last-verified-id>/release.json
```

The job verifies a supported source diff and the prior verified release, regenerates from the actual source, composes the existing shell, assembles the full asset union, waits for exact-source CI and required candidate BVT, publishes, and verifies public files, routes, bindings and protected pages. Full logs and resumable receipts stay under `ask-private/<id>` and `outputs/<id>`. It is a bounded publisher job, not a recurring scheduler. An interrupted or unknown mutation is a reconciliation gate; it cannot be blindly replayed.

The existing trusted build automatically runs generation and BVT after a Git push. Production promotion remains this explicit native release command. No background watch, new service credential or unrelated CI deployment is claimed.

## Source coverage and missing publisher signals

| Source | Implemented coverage | Remaining connection |
|---|---|---|
| Git public navigation register | Real edit/delete generation, existing postbuild, exact-source release job | Production proof is recorded in the release receipts. |
| Reviewed complete public source/media archive | Hash/version-verified import, selection, generation and full-union release | The source coordinator supplies a new reviewed complete archive when its source versions change. |
| Ask database and curated runtime content | Current public-only metadata and renderer contracts were reconciled into the reviewed archive. An Ask source diff without a corresponding new archive fails closed. | The current database/curated-content publisher must emit its committed public-version change/deletion input to the same reviewed catalogue/export path. No current database write hook or supported event endpoint has been established in this checkout. Owner: website/source publisher; trigger: its next public content publication. |
| R2 media writers | Existing public page references, genuine object identities, source versions and rights are joined; orphan/private objects remain excluded. | The uploader must emit the actual public parent/reference/version change or deletion, with publication authority, to the existing catalogue adapter. A new object or modified timestamp alone is insufficient. Owner: resource publisher; trigger: its next public media publication. |

Git-only evidence does not establish automatic database/R2 upkeep. Those explicit source-writer connections remain open until their supported publishing signal is connected and tested. Existing source holds remain in force; no care-data writes, security expansion or stopped growth jobs are introduced.

Rollback must restore the previous Worker version with its matching assets, all original modules/routes/settings, generated guide and root/discovery bytes. A version pointer alone does not complete rollback acceptance.
