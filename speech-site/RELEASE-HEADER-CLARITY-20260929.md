# Reader-facing shared header — production release

**Released:** 29 September 2026  
**Worker:** `pinnacle-verify-route`  
**Production version:** `756dce57-3a2e-4432-9ec5-f1ac47489abc` (v102, 100%)  
**Deployment:** `456361df-9436-42d9-a6eb-b795110f1edf`  
**Rollback:** v101 `d1c072fb-f4d9-4527-bb9a-d8eb759f5c5a`, deployment `79f02222-d102-4edb-bf1e-05d53d7ed6da`

## Result

The shared header now tells readers what its authority destinations contain instead of presenting unexplained internal labels:

- **PinnacleAI® — Life-first paradigm shift** links to the complete approach.
- **Verify — 36 evidence records** links to the evidence register.
- **Research — Studies & publications** links to the curated research library, where methods and publication status are separated.
- Whitebook, News, Centres and Contact remain directly available, while the complete menu retains the wider site directory.

The National Autism Helpline is one visible service cluster: **National Autism Helpline**, **Free guidance · 24/7**, a high-contrast **Call 9100 181 181** action and WhatsApp. `Find a centre` is labelled rather than represented by an unexplained pin. The enrolment action reads `Enrol at Pinnacle`.

`4 Billion Data Points` was not used because no inspected source establishes that number. The current evidence distinguishes 2.7B+ structured platform records from a 2.5B+ limited-assurance floor and explicitly warns that record volume is not a clinical outcome measure. `160+ years` was also kept out of the global header; the linked paradigm page presents Pinnacle's source-bounded 160-year historical argument in its proper context.

## Responsive and accessible presentation

- Desktop preserves the two-row portal header and groups the helpline actions as one clear unit.
- Tablet removes the orphaned login icon; Login remains in the complete Menu.
- Mobile gives the helpline the full row, keeps Call, WhatsApp, Enrol, Centres, Search and Menu usable, and uses a two-column therapy grid where the labels need the width.
- The complete mobile menu includes the same authority descriptions.
- Semantic links, native disclosures, keyboard handling, visible focus treatment and minimum 44-pixel mobile controls remain.

## Verification

- Production build completed.
- Fifteen shared-portal checks passed.
- Forty-four focused routing, privacy, measurement, enrolment and release tests passed.
- W3C Nu validation returned zero messages and zero errors for the enrolment page.
- All five managed live pages returned HTTP 200 and `index, follow`; after active-state normalisation they share header SHA-256 `3827158042a08c8b6e68e4839efaeea91ed721957bc757d9ed36aec352120f73`.
- Their complete shared footer remains identical with SHA-256 `e0ed17cdfa388c28ca23e616a429754cce684fe55a10d754a75fa2a782ae7fa3`.
- The live enrolment page matches the staged release byte-for-byte.
- Desktop, 820-pixel tablet and 390-pixel mobile were reviewed. Live mobile `scrollWidth` equals `clientWidth`.
- Shared Worker logic is unchanged and all 634 carried Verify assets match their source bytes.
- `/verify/`, the evidence register, FSC PDF, PinnacleAI regulatory story, national autism helpline and `robots.txt` remained byte-identical.

The five materially updated URLs were sent once to IndexNow after the public key returned HTTP 200; IndexNow returned HTTP 200. This records notification only. Discovery, indexing, ranking, referral traffic, AI citation and conversion are separate outcomes.

## Reuse

`SiteHeader.astro` remains the only header implementation for the five managed pages. Future managed therapy pages should use `PageLayout.astro`, so one shared-header edit is rebuilt across the whole managed page system.
