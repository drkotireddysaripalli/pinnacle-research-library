# Speech therapy — visual story and conversion revision

27 September 2026 · Implemented local preview · Not a production deployment

## Result

The page now tells the story through family imagery, two illustrated analogies, large conversational headlines, a seven-stage visual pathway and clear assessment/call invitations. The child's life remains the purpose of the system. Credentials sit beside precise sources rather than carrying the emotional promise.

## Sixteen completed improvements

1. Added a first-visit illustration showing the parent, child and therapist participating together.
2. Added three connected everyday-life scenes: choosing at breakfast, playing with a sibling and joining in at school.
3. Rebuilt the mobile opening so the family image follows the headline, ahead of the longer explanation.
4. Strengthened the opening: “Help your child be understood. And take part in more of life.”
5. Added visible, colour-coded icons for being heard, choices and participation.
6. Turned the everyday “I need help” example into three visual moments: Together, Everyday and Review.
7. Restored the home analogy with a custom SVG scene: “Bricks build the house. Life makes it a home.”
8. Restored the car analogy with a custom SVG scene: “A car needs good parts. A journey needs a destination.”
9. Explained both analogies plainly in terms of skills, care methods and the child's life, without implying exclusive or guaranteed outcomes.
10. Rebuilt the seven-stage family pathway with numbered, colour-coded icons and a visible reassessment loop.
11. Kept the optional nine technology explanations with their source links, separate from the seven-stage family pathway.
12. Presented first-visit duration, report and published price as three large factual blocks beside the new illustration.
13. Added distinct icons to evidence cards and a stronger final invitation: “Your hopes deserve a clear next step.”
14. Added the real Sintony bold font and preserved Pinnacle purple/pink, white space and bright supporting colours.
15. Consolidated styling into one maintained file, removed 230 obsolete rules, retained responsive WebP, lazy loading and reserved image dimensions, and fixed the desktop header-link target size.
16. Rebuilt both routes, completed independent parent/sales/evidence review, checked responsive interactions, and recorded real local Lighthouse results.

## Measured checks

| Local Lighthouse 13.5.0 | Mobile | Desktop |
|---|---:|---:|
| Performance | 100 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| Largest contentful paint | 1.7 s | 0.4 s |
| Layout shift | 0 | 0 |
| Total blocking time | 0 ms | 0 ms |
| SEO | 66 | 66 |

SEO is deliberately limited by preview `noindex, nofollow`; other scored SEO audits passed. The original mobile preview also scored 100 for performance, with 1.5 s LCP, so the added imagery preserved the score with a measured 0.2 s LCP difference in these single runs. Local lab results do not establish production field performance, indexing, AI citations or conversions. Full measurement details and the cleanup-only Windows warning are in `PERFORMANCE-20260927.json`.

Build and 33 page checks passed. Eight consent/measurement tests passed. Root visually inspected desktop 1440 px, mobile 390 px and narrow 320 px; the narrow screen had no content overflow. The centre filter changed to one Hyderabad location and back to all three. The nine-explanation disclosure opened and closed. No phone call or lead was submitted.

## Independent review

Independent AI reviewers assessed the work from parent, sales and evidence perspectives. The parent review found no remaining blocking confusion or pressure. The evidence review found no remaining concrete claim, source, pathway, alt-text or loading defects. The sales review prompted three copy refinements and moving the first-visit section after the analogies/pathway so the explanation stays connected. Root implemented all code and carried out browser/performance verification. These are design and source reviews, not real-family user testing or clinical approval.

## Preserved foundation

Canonical URL, source links, descriptive alt text, social card, structured organization/brand/service identities, consent-aware measurement and direct existing enquiry destination remain intact. Phone links use `tel:+919100181181`; display remains `9100 181 181`. Three generated images have visible illustrative labels. No unverified exclusivity, promised independence or regulator endorsement of outcomes has been added.

Root retains all build/release ownership. Production release and indexing steps are recorded in `LAUNCH-PLAN.md`. The shared `LifePath` and `AnalogyStories` components can be reused across therapy pages, with service-specific concerns, examples and evidence.
