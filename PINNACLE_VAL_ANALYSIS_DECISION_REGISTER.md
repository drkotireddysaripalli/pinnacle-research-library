# PINNACLE-VAL analysis decision register

This register separates fixed source-defined methods from choices that must be resolved and timestamped before a reproducible analysis. It does not report results. Sources: [validation protocol](https://doi.org/10.5281/zenodo.19482476), [development monograph](https://doi.org/10.5281/zenodo.19482123), and [retrospective OSF registration](https://doi.org/10.17605/OSF.IO/78WF5).

## Fixed by the released protocol

| Decision | Source-defined specification |
|---|---|
| Design | Cross-sectional multicentre psychometric validation with a nested prospective test-retest substudy. |
| Planned samples | Component A target n=300; Component B target n=60. These are targets, not achieved samples. |
| Concurrent comparators | Vineland-3, CARS-2, Bayley-4 for toddlers and ABAS-3 for children, administered to the same child in the validation session by blinded raters as specified. |
| Primary family | Pearson correlations for three primary comparisons with Bonferroni-adjusted alpha 0.017 and Fisher-z confidence intervals; Spearman correlation if normality is violated. |
| Test-retest | Repeat AbilityScore at 7 days plus or minus 2 days; ICC(3,1), SEM and Bland-Altman agreement. |
| Preliminary MCID | Therapist Global Impression of Change anchor plus 0.5 SD and 1 SEM distribution estimates; label the result preliminary. |
| Missing pairs | Complete-case pairwise analysis; no imputation in the released protocol. |
| Interpretation | Concurrent validity and reliability are planned outcomes. No completed concurrent-validity result is published. ROC work is exploratory and is not diagnostic-accuracy validation. |

## Decisions requiring an auditable implementation entry

Before a results analysis is represented as reproducible, record the dataset version and checksum, final participating centres, achieved sample and flow, assessment and scoring software versions, exact variable mappings, rater-blinding checks, protocol deviations, comparator-specific denominators, normality checks, exclusion reasons, and the final analysis-script checksum.

For each unresolved item, record: decision, rationale, evidence file, decision maker, date, whether outcome data were visible, and whether the decision amends the protocol or only implements it. Do not backfill a decision without preserving when it was actually made.

## Registration and evidence boundary

The OSF record is retrospective because some planned analyses had already run. The register must not describe it as prospective preregistration. The development monograph supplies preliminary operational evidence and explicitly says formal comparator validation is still required; it is not a completed result for this protocol.
