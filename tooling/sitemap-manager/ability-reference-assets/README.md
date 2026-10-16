# Ability reference asset source

This source-only package supports 1,962 public reference images, including 1,899 planned uses on 47 existing assessment pages. Metadata delivery passed on 16 October 2026; visible integration and sitemap admission are separate gates. No patient/responses/session data, credentials, media bodies or new question pages are included.

Verify bootstrap-receipt.json, then unpack the ZIP under data/. The original complete object CSV and parent-join input are existing owner artifacts; their hashes are pinned in the bootstrap. Read ABILITY-ASSET-METADATA-README.md for fields and input arguments and ABILITY-REFERENCE-RENDER-PLAN.md for the exact production integration contract. The latter includes the required Questions/Examples R2 observer extension.

All four Python commands use the standard library and explicit input paths. Run copies in this folder, point source arguments to the unpacked data and existing owner inventory, and write outputs beneath generated/. This folder restriction keeps output separate from caller source files and public serving. No command obtains database credentials or publishes a release. The renderer/import bridge and native schedule acceptance remain with the existing Windows publisher.
