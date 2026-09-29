# Shared navigation completion · v107 · 29 September 2026

## Result

The reusable Pinnacle header, complete menu, authority strip and Verify footer are now complete for the managed-page system. The five live speech and enrolment pages use the same rendered header and footer.

The global navigation now covers every high-value site hub that should be available from every managed page. Version 108 subsequently replaced the Payment & Billing link with that page's declared `books.pinnacleblooms.org` canonical:

- therapy entry points and the all-services hub;
- centres, enrolment and the National Autism Helpline;
- PinnacleAI®, Verify, research, AbilityScore®, 7 Readiness Indexes, the life-first paradigm shift and citation exports;
- About, leadership, Bharath Healthcare, Koti Group, team, parent stories, recognition, awards, news, media, events, careers and contact;
- Ask Pinnacle and the parent resource library;
- privacy, terms of use, cookies, payment and billing, copyright and intellectual-property, cancellation/refund and grievance destinations.

Navigation links now use the established canonical destinations rather than the older redirecting aliases for About, Contact, News, Resources and Assessment. Donate remains intentionally absent. Individual centre pages, staff profiles, parent-story entries, evidence records and Ask answers remain contextual or sitemap destinations instead of crowding the global shell.

## Reuse contract

- `src/data/portal-navigation.json` is the shared navigation source.
- `src/layouts/PageLayout.astro` renders `SiteHeader.astro` and `SiteFooter.astro`; the footer renders `VerifyFooter.astro` and the `PortalFooterGroup.astro` navigation groups.
- A change to those shared sources propagates to every managed page on the next build and release.
- New therapy pages must reuse this shell and add service-specific narrative, evidence and conversion content inside it.

## Publication and verification

- Cloudflare Worker v107: version `cb991aad-fa53-45f0-8df3-a02fc6f58321`; deployment `4eaf8e22-239d-403e-811f-904cf33c8677`; 100% traffic.
- Rollback: v106, version `0beccce9-a7fa-4cc2-8233-ea0c382f3c27`, deployment `264410d0-05e4-468a-b1ed-becdcef0ec9f`.
- All five managed pages return HTTP 200 and share header SHA-256 `9ea028fa9d75b1c13a0b22bc8b762435ebfd1e5d56f74b164daebfa203048b20` and footer SHA-256 `bd5baf3479634571695573254986a24eab53c6544a294ba6ef4393202879e3fb`.
- The Verify library is inside the shared footer on every managed page.
- 29 portal checks, 322 sales/search checks, 44 route/form/privacy checks, 17 evidence-link checks and 18 enrolment checks passed.
- 708 public release assets match the staged release. The retired enrolment preview is separately verified as a 301 redirect to the canonical page.
- All 16 newly added or corrected hub, canonical and primary legal destinations return HTTP 200. The v107 Payment & Billing URL declared a different canonical host; v108 corrected the shared link.
- HTML and Markdown delivery match the staged build; Organization, telephone and structured-data signals remain present.
- Homepage, Verify, evidence JSON, FSC PDF, PinnacleAI regulatory story, National Autism Helpline and `robots.txt` remained byte-identical.
- The five materially changed URLs were submitted to IndexNow at `2026-09-29T10:10:22.675Z`; HTTP 200 confirms notification only, not discovery, indexing, ranking, AI citation or conversion.

## Ranked next build order

1. Occupational Therapy
2. Autism Therapy
3. ABA / behavioural support
4. Special Education
5. Assessment / AbilityScore®
6. Find a Centre
7. Child Psychological Counselling
8. All-services hub
9. Hyderabad centre hub, after confirming its established canonical
10. Sensory Integration, after defining distinct intent and one canonical
11. Child Physiotherapy, including canonical repair
12. Parent Training / Everyday Therapy™

Receipts: `deployment/release-navigation-completion-v107-20260929.json`, `deployment/production-navigation-completion-v107-20260929.json`, `deployment/shared-shell-production-v107-20260929.json`, `deployment/indexnow-navigation-completion-v107-20260929.json`, and `deployment/production-before-navigation-completion-v107-20260929.json`.
