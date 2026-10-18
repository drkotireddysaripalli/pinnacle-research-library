# Original API publisher — receiving preservation handoff

The existing pbn-planetscale receiver is live at e3cd08a4-de59-4bba-b722-ddc59d15b142. A repeatable pre-publish guard is now delivered to the existing private Cloudflare source bucket. It is tested and retrievable by the already authorised account; installation in PinnaclePlanetScale is not yet verified.

## Retrieve using the existing authorised Cloudflare account

Account: 862998def1cd610fdb86b8e5c1d6ed4d. Private bucket: `pinnacle-sitemap-state`.

```sh
wrangler r2 object get pinnacle-sitemap-state/handoffs/upstream-receiver-preservation-20261018/26c42f8c4fefad3dee9e8d5c4ad09a2d4e5e8397f721ca3796de246562cb7c6d.zip --remote --file upstream-receiver-guard.zip
```

Verify SHA256 `26c42f8c4fefad3dee9e8d5c4ad09a2d4e5e8397f721ca3796de246562cb7c6d` before extraction. The package contains private captured API fixtures: retain it in the maintained private API workspace and do not put those fixtures in a public repository or analytics.

Extract the `receiver-preservation` directory under `ops/`. After the EXISTING candidate bundle and effective metadata are produced, before EVERY existing version upload/deployment, run:

```sh
node ops/receiver-preservation/receiver-preservation-guard.mjs dist effective-worker-metadata.json > receiver-preservation-result.json
```

Use the real candidate path and resolved effective metadata. This command has no npm or network dependency. A nonzero exit stops publication. The accompanying pipeline-step.yml is the insertion. Preserve existing current-version, route, binding and strict-inheritance guards. Do not regenerate the baseline from the candidate merely to get a pass.

## Delivered proof

- 20/20 targeted mutation cases pass; missing receiving boundaries/modules/bindings, changed resource identity and compatibility drift are rejected. Unrelated API edits remain possible.
- Actual CLI passes on the accepted captured candidate. Actual three-module Miniflare RPC rejects invalid isolated input with422. No external request, database write or real enquiry.
- Eight binding identities/types, four receiver boundaries and two receiving module hashes are protected. No secret values are included.
- Private object upload and downloaded-byte SHA256 readback are verified: 802580bytes. This created one handoff artifact; serving Workers/settings were unchanged.

## Completion owed by original publishing owner

Return the upstream commit and job proving this guard runs on every actual publishing path, plus a dropped-export/dropped-binding candidate refusing to deploy. Next legitimate publication must preserve receiving exports/bindings and return actual serving version/module/settings readback. Until then, status is delivered guard, upstream installation unverified. The current website owner retains integration accountability; original source access remains the dependency.
