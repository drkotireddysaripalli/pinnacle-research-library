# ABA Therapy — production release, 5 October 2026

**Completed and live:** [ABA Therapy for Children](https://www.pinnacleblooms.org/best-aba-therapy-center-india-proven-improvement-rate).

- Queue item: `PAGE-ABA`
- Action: `6cfd55f0-9474-4df4-bd87-f7516a91c511`
- Deployed source: `07e189f92f844fb009eb84043be8e68b5f534c93` (committed and pushed)
- Worker: `pinnacle-verify-route`
- Version: `4157f024-aedd-496c-a842-8679501f285e`
- Deployment: `d7d17b07-c4b3-49d1-815f-3d565ff76fe0`
- Rollback version: `5f75b349-827f-4fad-8a56-472c03a2da10`
- CI: [Portal quality — passed](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37268899052)
- Detailed receipt: `deployment/aba-release-receipt-20261005.json`

## What the page now delivers

The hero explicitly connects behavioural support to the child's self-sufficient, mainstream-included life. The call and enrolment actions remain prominent. The first-conversation section explains the next professional visit, what families can bring, and how professional, location and fees are confirmed before they decide.

A concrete illustrative transition carries one example through the page: a child's existing pointing ability, discomfort in a noisy setting, an accessible break request, an adult cue, the child's response and the next support decision. The observation records the assistance and setting instead of presenting an assisted request as an independent result. Families can see both continuing useful support and pausing or adapting when discomfort continues. This is an illustrative explanation, not a patient outcome or an individual prescription.

Seven connected stages apply that example to AbilityScore, planning, integrated therapies, everyday practice, Fusion, reassessment and growing independence. Contextual links connect speech therapy, occupational therapy, special education, autism therapy, PinnacleAI and mainstream participation.

The centre directory initially shows three cards and searches all 62 published listings. Maps, selected photos, sharing, local details and the ABA enrolment preference remain available. It directs families to confirm ABA professional and appointment availability before travelling; the directory is not represented as a verified ABA staffing roster.

The four approved branded creatives, including the social poster, are reused. No new image generation or external inference API was used. CDC replaces the private BACB/AAP references; NICE, WHO and the qualified MD-5/BIS/research sources remain. Eleven visible FAQs match their structured data. JSON, text and Markdown include the worked example, review decisions, seven stages and source boundaries. The ABA sitemap entry date is updated. ABA-scoped CSS repairs a low-contrast label and makes inline links visibly distinct.

## Completed validation

| Check | Recorded result |
| --- | --- |
| Build and types | 135 pages built; 138 Astro files; zero type errors |
| Unit checks | 395 passed; subsequent focused machine-export check 5/5 passed |
| Responsive layout | 320, 390, 768, 1024 and 1440 px: no horizontal overflow, duplicate IDs, missing anchors, page errors or axe findings |
| Local browser checks | 18 passed initially; two page checks corrected and passed; ten unrelated book-language/shop checks skipped |
| W3C Nu | Zero errors and zero warnings |
| Visual inspection | Saved mobile and desktop hero, example, stages, first-visit and centre renders inspected; one independent editorial/visual review completed |
| Physical device | iPhone 15, iOS 18 Safari: 11 checks passed; screenshots inspected; session closed |
| Hosted browser | macOS Safari 26.3.1: 13 checks passed; screenshots inspected; session closed |
| Lighthouse mobile | Performance 96; accessibility 100; best practices 100; SEO 100; LCP 2.584 s, CLS 0, TBT 0 |
| Lighthouse desktop | All four scores 100; LCP 0.563 s |
| Screaming Frog | Changed URL only: HTTP 200, indexable, correct canonical, one H1, title 59 characters and description 151 characters |
| Production read-back | Exact deployed content for ordinary, cookie, Range and crawler requests; HEAD, aliases, Markdown and evidence exports verified |
| Links and assets | 293 contextual/directory internal destinations returned 200; eight asset checks passed, including the unchanged approved 1200 × 630 social image |
| Preservation | 18 protected page responses unchanged; all 194 routes and four bindings preserved; 27 Worker modules verified; 450 reused asset hashes matched |

Mobile lab LCP was 0.084 seconds above the 2.5-second target. This is recorded as a lab follow-up, not presented as a field Core Web Vitals result. No synthetic calls or lead submissions were sent.

## Discovery and measurement

IndexNow accepted the one materially changed ABA URL with its key validated: batch `cce8b079-679e-4212-ab72-44a8b02a819f`. GSC Wizard annotation `282fe688-de3e-410a-a596-701bf9f14e93` records the release on 5 October. Submission and annotation do not establish indexing, rankings, AI citations or qualified enquiries; those outcomes remain unmeasured for this release.

## Practical review and next page

The independent pre-release review scored the candidate **80/100** and found no blocking page issue. The implementation owner's post-release score is **82/100**, adding credit for confirmed production delivery and browser/device checks. This is a work-order judgement, not a clinical or search-engine rating. Uncoached family comprehension, dated centre-specific ABA staffing/fees, receiving-team acceptance and actual call/visit/admission outcomes remain unearned evidence.

The approved common header and footer were not edited. Ask, Verify, authentication, commerce, other Worker routes and existing source holds remain intact. The temporary preview and remote test sessions are closed.

**Next individual page: Fusion Module**, row 35 of the quality-pass register. The active work order now specifies its observation-comparison, professional decision and next-checkpoint narrative. This release closes ABA; it does not claim the entire portal is complete.
