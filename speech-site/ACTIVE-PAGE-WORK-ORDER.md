# Active page work order — Autism Therapy integration hub

30 September 2026 · **v127 released**. The source, public page and release checks are recorded in [the v127 receipt](RELEASE-AUTISM-THERAPY-V127-20260930.md). The earlier ABA contract is retained in [its v126 receipt](RELEASE-ABA-THERAPY-V126-20260930.md). The user asked for a full all-therapies review **after** the therapy pages are complete. The implementation owner keeps page, code, build and deployment ownership; reviewers are read-only.

## One-page contract

| Decision | Autism integration answer |
|---|---|
| Canonical and intent | Keep `/autism-therapy` as the child-specific integration hub and its existing true aliases. It answers “Which supports could help my autistic child take part in more everyday life, and where do we begin?” The competing old `top-autism-therapy-services...` origin page is a separate search-estate conflict; assess its Search Console/backlink equity before rewriting or redirecting it. |
| Parent promise | Start with the child’s strengths, preferences and one everyday moment. Growing self-sufficiency and mainstream participation set the direction, while assessment and professional judgement select all **relevant** therapies, school/family supports and health referrals. No fixed four-therapy bundle or guaranteed endpoint. |
| First action | Call `tel:+919100181181`. The family describes one moment, Pinnacle helps check a suitable professional, centre, visit availability and current fees, then the family chooses the next step. Telephone guidance is free and staffed 24/7; appointments and therapy are separate. The owner’s team owns live call/enrolment operations. |
| Proof and limits | WHO and NICE explain individualised, integrated support; CDC separates diagnosis from screening. Pinnacle’s programme direction is documented at Verify. MD-5/BIS are non-diagnostic software and quality-scope records, not autism-therapy approval, therapist credentials or an outcome promise. The 97% claim is held off this page. |
| Local choice | The published 62-location network directory is **not** a confirmed autism-service specialist roster. The receiving team confirms service, professional, fee and appointment at the chosen centre. Structured data does not assert India-wide autism-service availability. |
| Shared boundary | `PageLayout.astro` mounts the one common `SiteHeader.astro` and `SiteFooter.astro`, including the Verify gateway. This release changes Autism content and fixed coarse measurement placements; the shared header/footer source and all protected Verify/helpline/origin routes stay intact. |

## Narrative and creative acceptance

1. Hero: recognise communication, routines, learning, play and participation. Say no therapy choice is required before calling. Keep a readable phone action in the first phone screen.
2. Direct answer: autism therapy is not one fixed programme. Begin with the everyday life the child wants to take part in and select relevant therapies, family/school supports and health referrals.
3. First call: three visible decisions — share one moment, check a suitable next step, decide together. A longer professional lens is available through a keyboard-operable disclosure.
4. Pinnacle difference: the child’s life chooses the goal, and only then the methods and people. The four therapy cards link to their distinct pages; no card implies every child needs it.
5. Seven parent-facing stages: abilities/AbilityScore®, readiness and plan, relevant integrated support, family everyday practice, track and correct, reassess and repeat, and direction toward growing independence and participation. The seventh stage is a purpose, not a guarantee.
6. Worked school morning: conditional speech, occupational, special-education and behavioural contributions, manageable family practice and teacher/family feedback. The example is not a patient story or a prescription.
7. Trust: autism-specific MD-5/BIS/research cards beside scope limits, WHO/NICE/RCI context without endorsement, JSON/text/Markdown source map, 15 visible FAQs matching schema.
8. Decision: honest centre notice, call, enrolment, internal therapy links, shared Verify footer and a complete 1200 × 630 social poster.

Artwork is original fictional campaign art: a child-led hero choice, an attentive first conversation, selected life-path possibilities and one **complete generated social poster** with brand, service message, Verify address and `9100 181 181`. The existing school-morning image remains useful. Exact source paths and hashes are in `ASSET-SOURCES.md`. The page keeps all essential answers and claims in HTML.

## Release sequence and external checks

Production build → focused route, content, privacy, shared-shell, responsive and HTML checks → source commit/push → stage the full Verify plus managed-page union → Worker dry run and binding/trigger review → Cloudflare deploy without `--route` → live canonical, alias, image bytes, JSON/text/Markdown, child sitemap and protected-route readback → one material IndexNow notification → release receipt commit/push → bounded cleanup.

After publication, real family comprehension, named clinical review, centre-specific staffing and availability, field Core Web Vitals, social-client preview, search indexing/AI citations and answered-call/visit/enrolment results remain separate observations. The later all-therapies review will compare shared navigation, cross-links, legacy competing pages and the full family journey across speech, occupational, ABA, special education and this autism hub.
