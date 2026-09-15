# RCI-listed institution geography: reproducibility package

Study: **Geographic Concentration of RCI-Listed Rehabilitation Training Institutions in India: A Reproducible National Register Analysis**

Manuscript: BHCL-PUB-2026-09-02, version 2.0. Source snapshot: 4 February 2026. Reconstruction: 15 September 2026.

## What these data represent

One row in `workforce_institutions_audited.csv` represents one distinct institution code printed in the selected 113-page RCI register. All 1,068 codes are included once. The sequence of printed serial numbers is exactly 1–1,068.

These data do **not** establish current institutional activity, valid course approvals, training seats, admissions, graduates, professional supply, ownership, clinical quality or population-adjusted access. An institution code need not equal one physical campus. A zero jurisdictional count means no entry was present in this particular source document.

## Reproduce

Requirements: Python 3.10 or newer; pdfplumber 0.11.9. The analysis also uses Python standard-library modules. A fresh run normally takes a few minutes, depending on the computer.

1. Keep `reproduce_workforce.py`, `workforce_source_manifest.json` and `workforce_label_crosswalk.csv` together in this directory.
2. Install the requirement from `requirements.txt` in your chosen Python environment.
3. Download the official PDF from the URL in the manifest, or let the script download it.
4. Run one of these commands:

```text
python reproduce_workforce.py --source /path/to/RCI_source.pdf --output-dir reproduced
python reproduce_workforce.py --output-dir reproduced
```

The second command downloads the official source if absent from the output directory. The script checks its SHA-256 checksum before analysis and stops if the document differs. No previous course CSV, private clinical data, user directory or workspace-specific path is required. The output directory can be anywhere you choose.

The reference source checksum is:

```text
cd8486f239a95740d5baa814211edb4c51eb77159eccbf190a16c8fbdbb8f476
```

The source PDF remains a government publication. The derived dataset does not replace the official list for admissions or regulatory decisions. Consult RCI for current academic-year status.

## Files

| File | Contents |
|---|---|
| workforce_institutions_audited.csv | 1,068 source-linked institution records |
| workforce_state_counts.csv | Counts, shares and descending cumulative shares for all 36 jurisdictions |
| workforce_lorenz.csv | Origin plus 36 ascending cumulative coordinates for Figure 2 |
| workforce_record_validation.csv | Record-level code, serial, geographic and label checks |
| workforce_source_headings.csv | 32 source headings and canonical jurisdiction names |
| workforce_label_crosswalk.csv | Prior display labels, final source-supported labels and change reasons |
| workforce_change_log.csv | 14 restored/corrected labels and one serial-parser correction |
| workforce_metrics.json | Exact concentration statistics and validation results |
| workforce_source_manifest.json | Source URL, date, checksum, software version and analytical scope |
| reproduce_workforce.py | Portable complete source-extraction, validation and analysis workflow |
| requirements.txt | Tested non-standard Python dependency |

## Institution fields

| Field | Definition |
|---|---|
| source_serial | Number printed in the RCI serial-number column |
| institute_code | Distinct RCI code; the analytical identifier |
| institution_label | Source-supported display label; not asserted to be a full current legal name |
| source_name_address_excerpt | Contact-stripped excerpt from the name/address column; a vertical bar represents a line break; a page-spanning excerpt may be incomplete |
| state_ut | Canonical jurisdiction derived from the source heading |
| source_page | One-based PDF page on which the institution code appears |
| source_y_top_pt | Top coordinate of the printed code, in PDF points, for locating the record |
| listing_scope | Explicit reminder that current activity was not assessed |

Other files label counts as `institutions_listed`. `rank_order` is a display order with alphabetical ordering for ties, not an inferential ranking. State names in the source can use historical spellings. The heading crosswalk documents their normalisation. Delhi denotes the National Capital Territory of Delhi. `source_name_address_excerpt` intentionally preserves source spelling and institutional terminology; no contact directory is provided.

## Validation actually performed

- Every one of the 1,068 codes was reconstructed directly from the PDF's institution-code column.
- Every printed serial was extracted and the full 1–1,068 sequence verified.
- Every state was assigned from the source heading, then cross-checked against the institution-code prefix.
- Every final display label was matched to source name/address text after case and punctuation normalisation. Fourteen exceptions in prior labels were corrected using source text.
- Table cells supplied 980 name/address records; coordinate-bounded extraction supplied 88.
- The initial reconstruction was compared against the earlier institution table: all codes and canonical states agreed. The earlier table is not needed to reproduce this release.
- Automated contact-token checks, count totals and concentration formulas were verified. A fresh portable run reproduced the institution table and statistics.

Validation was computational and AI-assisted, with targeted inspection of source pages and exceptions. It was not independent human double extraction. The source itself was not verified against institutions or RCI's underlying systems. Display labels may be shortened, and address excerpts are not guaranteed complete. Source text uses some historical disability terminology within institutional names; preserving an identifier does not endorse that terminology.

## Statistics and figures

For count `nj` in jurisdiction `j` and national total `N`, HHI is the sum of `(nj/N)^2`; its reciprocal is the equivalent number of equal-share jurisdictions. Gini is the sum of pairwise absolute differences in jurisdiction counts divided by `2*K*N`, with `K=36` in the main analysis. The 32-jurisdiction sensitivity calculation omits source-zero jurisdictions.

Both measures weight jurisdictions equally. They measure concentration of institutional entries, not population-adjusted inequity, market competition or workforce shortage. No competition-law thresholds are used. The Lorenz diagonal is an equal-count reference, not a policy target.

Figure 1 uses the `institutions_listed` column from `workforce_state_counts.csv`, with all 36 jurisdictions retained. Figure 2 uses `jurisdiction_fraction` and `institution_fraction` from `workforce_lorenz.csv`; include the equal-count diagonal. The CSVs retain full numerical precision. Manuscript tables round percentages to two decimal places and Gini/HHI to four.

## Version 2.0 changes

The earlier course/intake analysis was removed because institution-level text tokens could not support validated programme-period counts or annual seats. This package excludes the original course-approval file and all unvalidated capacity-derived fields. It also omits prior ownership classifications, field flags and population-adjusted rates. Institution geography was reconstructed from the source rather than adopted solely from the earlier CSV.

The package is provided with the manuscript for review and reproduction. No repository deposition, dataset DOI, third-party certification or RCI endorsement is asserted.
