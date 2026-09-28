# Centre-directory measurement release

Published 28 September 2026. The directory call and enquiry buttons already worked, but their new placement names and centre-specific enquiry targets were absent from the consented analytics allowlists.

The release adds the three directory call placements and all 59 verified centre enquiry destinations. It reports fixed placement/destination fields only. No centre, query string, form value or personal information is exported. Events remain inactive before consent, under Global Privacy Control and after withdrawal. Unknown centres, extra parameters and foreign destinations are ignored.

- Worker version 86: `e5e0574b-e2de-468e-9b5e-f15967e62249`.
- Deployment: `5262a920-866c-4a5c-8797-8e039b328e1e`.
- Rollback: version 85, `9f2574dd-bd9d-41c8-ab1c-57136d80612a`.
- All 582 published speech files match staged hashes; 634 Verify files and shared Worker logic preserved.
- Twenty-five directory/routing/privacy tests passed, including nine measurement tests.
- Existing Verify, evidence register, FSC, PinnacleAI story, helpline and untagged enrolment responses remain unchanged. Payment remains available.

This verifies instrumentation and deployment. It does not establish connected calls, accepted CRM leads, appointments or commercial results. The four-module deployment and three existing bindings remain required. See `deployment/release-measurement-20260928.json`.
