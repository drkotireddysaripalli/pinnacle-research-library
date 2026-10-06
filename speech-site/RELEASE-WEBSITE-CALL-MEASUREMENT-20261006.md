# Website-call measurement repair — 6 October 2026

## Candidate prepared; release pending

Human authority: the Google Ads owner asked to send this prepared repair to the website owner; Dr. Koti replied “Send the repair to that task.” Implementation/release remains in this website thread. Growth schedules and unrelated page work remain held.

The existing independent advertising-call preference is added through SiteFooter/AdCallPreferences, PageLayout and AskLayout. The shared call module updates displayed national numbers and their telephone targets after consent. It retains ordinary calling, local centre numbers, privacy controls, default denial and withdrawal. Analytics and advertising choices no longer overwrite each other or duplicate Google's loader. Verify's older reader is corrected through the existing wrapper on the three eligible Verify pages. The approved navigation, footer content, native Anek typography and page narratives remain intact.

Existing Google conversion action: AW-10810823199/VNUcCMSy3YobEJ-kgKMo. No bids, budgets, conversion thresholds, MyOperator settings, remarketing audiences, patient records, commerce records or real calls are changed/created by this repair.

## Candidate verification

- Production static Astro and Ask builds pass. Static build compiled135 pages.
-454 unit/regression tests pass, including consent lifecycle, withdrawal, callback display/dial handling, private-page exclusions, analytics, protected routes, enquiries and commerce.
- One independent read-only reviewer found two cross-tab restoration/withdrawal cases; both were fixed with regression checks.
- Browser checks cover default-off, refusal, analytics-only, GPC, both permission orders, one loader, withdrawal and a separate callback fixture. The direct-visit network check loaded Google only after advertising permission; no paid click, call or enquiry was generated.
- Verify's two permission orders pass. Phone320/390, tablet768 and desktop1440 presentation checks include Chromium/WebKit; inspected screenshots and final live/device evidence are recorded in the release receipt.

## Release boundary

Current portal baseline08a768e3-d753-49bb-989f-c3654e6ab599; Ask800a09a7-556c-4311-b07e-2ac548fd7c61; wrapper2fa26689-51f7-4a04-a835-a69d2627b15f. Preserve209 routes,4 portal bindings,21 Ask bindings, the wrapper binding and all2,160 current portal assets. Portal changes only the existing generated analytics-script module; unrelated generated page overlays from the full build are excluded. Ask deploys its current full build. The wrapper deploys its current bundled shared source.

Real eligible Google forwarding allocation and a naturally occurring connected qualified call remain business outcomes to observe separately. No indexing submission is needed for this measurement-only release.
