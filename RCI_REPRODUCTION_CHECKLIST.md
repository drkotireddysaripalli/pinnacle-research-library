# RCI register analysis reproduction checklist

This auditable run receipt supports a fresh run of the version 2.0 analysis associated with [DOI 10.5281/zenodo.22761810](https://doi.org/10.5281/zenodo.22761810), study ID `BHCL-PUB-2026-09-02`. It does not replace the official Rehabilitation Council of India source or establish current approval status. Use one copy per run and retain it beside the generated outputs.

## Run receipt

- Run timestamp (UTC):
- Operator or execution agent:
- Acquisition mode and source URL:
- Observed source SHA-256:
- Script SHA-256:
- Exact command:
- Python version (minimum 3.10):
- `pdfplumber` version (reference run: 0.11.9):
- Output directory:
- Exit status:
- Output-file SHA-256 list:
- Exceptions or deviations:

## Source integrity

- [ ] Obtain the official 113-page PDF from the URL in `workforce_source_manifest.json` and record the acquisition mode above.
- [ ] Confirm source snapshot date: 4 February 2026.
- [ ] Confirm SHA-256: `cd8486f239a95740d5baa814211edb4c51eb77159eccbf190a16c8fbdbb8f476`.
- [ ] Stop if the checksum differs; document a new source as a new version rather than silently substituting it.

## Environment and execution

- [ ] Use Python 3.10 or newer and install the dependency in `requirements.txt`.
- [ ] Keep `reproduce_workforce.py`, `workforce_source_manifest.json` and `workforce_label_crosswalk.csv` together.
- [ ] Run the script into a new output directory and complete every run-receipt field above.
- [ ] Retain the generated extraction, validation, counts, Lorenz and metrics files together.

## Required validation

- [ ] Exactly 1,068 distinct institution codes are present once each.
- [ ] Printed serial numbers form the complete 1–1,068 sequence.
- [ ] Every geography assignment agrees with the source heading and code-prefix cross-check.
- [ ] Final display labels match normalized source text or have a documented exception/change reason.
- [ ] State/UT counts sum to the national total and all 36 jurisdictions are represented in the count table, including source-zero rows.
- [ ] No contact-address directory or private data has been introduced.

## Interpretation check

Describe the analytical unit as one distinct institution code in the selected source snapshot. Do not convert listed entries into active programmes, annual seats, graduates, practitioner supply, clinical quality, ownership, current approvals or population-adjusted access. HHI and Gini describe concentration of listed entries across jurisdictions; they are not competition-law findings or workforce-shortage estimates.

Validation is computational and AI-assisted with targeted source inspection. It is not independent human double extraction or RCI endorsement.
