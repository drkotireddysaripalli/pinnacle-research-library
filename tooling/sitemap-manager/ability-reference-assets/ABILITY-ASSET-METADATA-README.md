# Ability reference asset metadata

This local adapter creates one metadata record per exact Questions/Examples image object. It joins the saved, read-only `eipassessment` reference projection to the existing object inventory and `/abs` parent-candidate evidence. It reads no patients, responses, sessions or clinical uploads, makes no requests and writes no database or public source.

Current output: **1,962 image asset records** (984 Questions, 978 Examples). **1,960** have exact source reference context; **2** retain object metadata with an unresolved noncanonical filename. **1,899** have an existing candidate relationship to **47** accepted `/abs` parents; **63** lack that mapping (61 missing qualified assessment parents, two noncanonical filenames). The directory marker and `Ability.zip` are the **two excluded nonimage objects**. This accounts for all 1,964 scoped inventory records. All 988 source definitions have at least one exact matched image; 16 definition-role slots lack an exact object (six question images, ten example images), listed by ID in the summary. No asset is invented for those slots.

The metadata is useful independently of sitemap admission. Source Question, Keyword and E1–E3 are retained as reference-question semantic context for search, AEO and AI/LLM consumers; they do **not** describe a visually verified depiction. `alt_text` stays null. Question/assessment IDs, role, exact configured object URL/key, ETag/object dates, source snapshot/row/query hashes and prior parent evidence are explicit. Source dates remain null where unknown. No clinical claims, image contents, licence or ownership are invented.

All F2 values remain `UNVERIFIED_PUBLIC_OR_CANONICAL_USE` and are never accepted as a parent or turned into a new URL. The saved question-627 F2 probe is retained as 404 on its two linked asset records. All 1,962 retain unknown actual rendered/public-parent use and pending asset-specific rights; **zero** are admitted to sitemaps. The 1,899 candidate mappings are historical source associations, not proof of a current published reader. The separate `ability-asset-brand-context.json` contains Pinnacle Blooms Network, enquiry **9100181181** and CTA; it is not injected into source text or alt text.

Repeat from the workspace root with Python's standard library:

```sh
python3 work/url-reconciliation/planetscale-asset-source-20261016/export_ability_asset_metadata.py \
  --definitions work/url-reconciliation/planetscale-asset-source-20261016/ability-reference-definitions.json \
  --parent-join work/url-reconciliation/assessment-definition-image-join-20261015.json \
  --objects work/sitemap-r2-exports-20261013/public-resource-inventory/public-resource-objects.csv \
  --declared-url-probe work/url-reconciliation/planetscale-asset-source-20261016/question-source-page-probe.json \
  --out work/url-reconciliation/planetscale-asset-source-20261016/ability-assets
```

Outputs are deterministic `ability-asset-metadata.jsonl`, `ability-asset-exclusions.jsonl`, a hash/accounting `ability-asset-summary.json`, and the separate brand file. Files stage locally and the summary publishes last. Output paths remain under this source-artifact folder and cannot overwrite inputs. Reference fields are allowlisted; unexpected fields and duplicate IDs/objects are rejected. Conflicting old parent mappings become explicit held conflicts. URLs must already appear in the inventory; encoding is checked against the exact object key, without guessing aliases.

`validate_ability_asset_metadata.py` takes the same four source arguments and `--export` instead of `--out`. Nine checks passed, including exact source text and source hashes, input replay producing identical JSONL, the F2 404, no invented publication/licence, brand/alt separation and rejection of a synthetic unexpected private field. It writes `ability-asset-validation.json` only.

The exact source field map used here is `eipassessment.Id → question_id`, `AId → assessment_id`, `Type/Seq → cohort/ordinal`, `Question/Keyword/AllOptions/E1–E3 → semantic_context`, `F2 → unverified declared reference`, and `CDT/UDT → declared source dates`. R2 object identity and the prior parent relationship remain separate provenance. This adapter is an analysis/export artifact for the existing owner to map into ASSETS. No production ASSETS schema, public route, migration or complete 31-table schema implementation is claimed.
