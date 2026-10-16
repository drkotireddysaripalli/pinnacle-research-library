# PR100 daily selected-source withdrawal fix

Base: exact PR100 source `5493522055b31acce3263d1ea36d02a05b1eee66`.
Apply `guru-source-withdrawal.patch` to the existing source branch after reconciling
subsequent owner edits. `git apply --check` passed against the pinned local base.
Only three files change: selected importer, managed-media integration and its
focused tests. No canonical checkout, source DB, R2 state or public assets changed.

The original source reproduced three anti-regression failures: a current parent
`noimageindex` retained its prior Guru pair, a current image 404 retained its pair,
and the second managed-source reconciliation could restore a pair removed by the
first blocked-set pass. A missing Ability capture also incorrectly declared a
complete observed set, raising instead of using its existing unknown-carry rule.
Baseline failure logs are retained beside this patch.

The fix withdraws only Guru source ownership for fresh, bound parent/image vetoes.
Current `noindex`/`noimageindex`/canonical/HTTP vetoes cannot be promoted again by
carried ownership. The downstream reconciliation carries the current blocked set
and adds freshly confirmed image disqualifications. Other source ownership and
unmanaged images survive source-local render withdrawals.

Absence alone is not deletion. An absence-based Guru withdrawal requires a fresh,
anonymous, exact-parent GET with a complete body/hash/length proof, an intact exact
Guru section, no parser ambiguity, its expected CTA, and
`data-observed-set-complete="true"`. Missing sections/markers, partial selections,
stale/malformed captures and transient failures carry prior ownership with a hold.

**The current frozen Guru fragments do not have that optional completeness flag.**
Their full 150 positive pairs still qualify from actual current rendered use.
Future absence without the explicit flag holds prior ownership. This patch does
not change the accepted frozen packet, fragment hashes or current renderer to add
the flag. Confirmed current robots/HTTP/image vetoes still withdraw immediately.

The focused importer/reconciliation suite passed **9/9** cases with synthetic
local feed fixtures and the exact unchanged local Ability/Guru packets. It
includes positive 2,049-pair admission, veto withdrawal, explicit-complete absence,
unknown carry, preservation of other ownership, blocked-set defense and missing
Ability capture handling. The unchanged R2/source suites were not rerun.

No network request is permitted by the focused delivery probe. Test metadata uses
known exact packet hashes; no new DB service, R2, cloud or public crawl was called.
Root/Windows retain source integration, CI, current live proof and deployment.
