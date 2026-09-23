# PINNACLE-TRAJ cohort-construction specification

This implementation aid translates the released PINNACLE-TRAJ protocol into deterministic cohort rules. It does not report results. The canonical protocol is [Zenodo DOI 10.5281/zenodo.22761832](https://doi.org/10.5281/zenodo.22761832), version 1.1, 15 September 2026.

## Required sequence

1. Fix the comparable scoring era and eligible centre-by-calendar intervals from deployment and measurement records before inspecting outcome values or changes.
2. Require each interval to allow the complete 210-day primary follow-up opportunity under the comparable system. Under the proposed 30 June 2026 database close, 2 December 2025 is the latest permissible baseline.
3. Enter each child at the first valid AbilityScore assessment within an eligible interval, provided age is at least 0 and under 13 years and the score, date, age and scoring version can be established.
4. Treat this as the first eligible observation in the comparable measurement era; do not imply that it is the child's first-ever therapy contact. Summarise prior recorded care where available and impose no arbitrary washout.
5. Require the documented scoring-age range to cover the child's full primary window. Administrative ineligibility for insufficient follow-up opportunity is not a missing six-month outcome.
6. Do not require a later visit, minimum therapy duration, home-practice activity or score improvement. Children who discontinue or transfer remain in the baseline cohort.
7. Use a stable network child identifier across centres. Each child contributes one baseline; a transfer does not create a new participant. The baseline centre is the primary clustering unit.
8. Remove test, demonstration and training records using documented production flags. Resolve duplicates and superseded records by identifiers and completion status; for same-day records use the last finalised non-superseded timestamp.
9. Do not exclude a record merely because a score is unusually high, low or declining. Check impossible ages, invalid dates and out-of-range values against source metadata and record unresolved exclusions with reasons.
10. Define the primary endpoint as the comparable score nearest day 180 within days 150–210. Determine the eligible risk set from baseline and database close before checking whether follow-up occurred.

## Required reconciliation

The cohort report should reconcile candidate unique children, deterministic baseline exclusions, calendar/version/age exclusions, the final baseline cohort, observed valid primary-window endpoints, no assessment in the window, and incompatible or invalid window records. Reasons must be mutually exclusive or explicitly labelled as overlapping.

Postbaseline care exposure does not determine cohort membership or the primary contrast. The uncontrolled observational design can describe score change and reassessment patterns but cannot estimate treatment effectiveness, isolate an AI contribution or establish an important clinical difference.
