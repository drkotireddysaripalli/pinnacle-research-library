# Autism Therapy integration hub — release v127

30 September 2026

## Public result

[Autism Therapy for children](https://www.pinnacleblooms.org/autism-therapy) is live. It begins with the family's everyday goals and explains how Pinnacle selects relevant speech, occupational, behavioural and special-education support alongside family and school participation. It does not prescribe every therapy to every child. A school-morning example connects those roles to one routine, and the seven visible stages end with growing independence and participation as the direction of care. The first-call block gives three clear steps and links to **9100 181 181**.

The page has a new family-led hero, first-conversation and selected-path scene, plus one complete 1200 × 630 branded social poster. The social poster was generated as one creative with its message, brand and telephone number integrated in the image; it is imported directly by the page build. The on-page claims and essential answers remain selectable HTML text. Artwork source paths and hashes are recorded in `ASSET-SOURCES.md`.

The page links to the relevant therapy pages, centres and Verify records. Autism-specific proof cards describe the scope of the MD-5 and BIS software records rather than implying licensing of therapists or a child outcome. Fifteen visible FAQs match the JSON-LD FAQ graph. The 62 centre entries are explicitly network locations, not a verified autism-specialist roster; a family can confirm a suitable professional, current service, appointment and fee when calling. No India-wide autism service area is asserted in schema.

## Source and Cloudflare state

- The reviewed source was committed and pushed to the existing GitHub `main` branch before deployment: `82c9f95` (`Refresh life-first Autism Therapy integration hub`). A live visual review then found therapy-card link wrapping; the narrow source correction and its responsive assertion were committed and pushed as `d0e6fc7` before the final deployment.
- The full Verify plus managed-page union was staged from `..\verify-site`. The Worker dry run reported **1,495 files**, **five supporting modules**, `ASSETS`, `PINNACLE_LEGACY`, `PINNACLE_ASK` and `run_worker_first: true`. The deployment did not use a `--route` override.
- Cloudflare Worker `pinnacle-verify-route` version **`ddd4aea5-caa8-4fde-b2c4-f4f064463ce7`** reached **100% traffic** and is the final corrected v127 release. The preceding version **`7c8a28fc-b520-4e4a-8f56-433b53633826`** served the initial v127 layout; v126 **`8aea4a71-73c5-4ca7-ada1-11b99246d380`** is the prior stable release. Wrangler's upload message said “No targets deployed”; the subsequent deployment list and public read-back confirmed the final version serves the routed page.

## Verification

- Production build passed. Focused route, enrolment and consented-measurement tests passed **57/57**; portal checks passed **29/29**. The Autism CTA test covers consent on/off and Global Privacy Control with coarse events only.
- Live Chrome and Edge checks passed at **320, 390, 768, 1024, 1425 and 1440 px** after the layout correction. Required images loaded; no document overflow, duplicate IDs, missing anchors or page errors appeared. All four support-card links now occupy the text column, with at least 185 px available on a 320 px phone; the Occupational Therapy link stays on one line at 1425 and 1440 px. The mobile More menu opened and closed; the first section was Therapies at 390 px. All seven stages, 15 visible/schema-matched FAQs, 62 centre entries and their service notice appeared. Keyboard disclosure worked.
- The canonical returned 200. `/autism-therapy/`, `/t/autism-therapy` and `/t/autism-therapy/` returned direct 301s. Ten managed pages served the same shared header and Verify footer after normalising expected active-page state. Verify, FSC, the PinnacleAI regulatory journey, National Autism Helpline, root and child sitemaps and `llms.txt` returned 200.
- Public Autism JSON, text and Markdown evidence exports and the child sitemap matched staged bytes. The OG and Twitter image is the same public JPEG: **205,909 bytes**, SHA-256 **`f43fd2b2f09c947f3d2edf01ef872d83ab843dae3119f8ba76d7c8a32d80bc17`**, byte-for-byte equal to the staged image. The canonical also returned `text/markdown` with `Content-Signal: search=yes, ai-input=yes` when requested.
- W3C Nu reported **zero errors and zero warnings** for local and live HTML. One IndexNow notification of the materially changed canonical returned HTTP **200** on 30 September 2026. This confirms submission only.

## What remains to observe

Publication does not establish Google/Bing indexing of this revision, ranking, AI citations, social-client previews, answered calls, visits or enrolments. The call and enrolment team owns the receiving workflow. Current autism-service staff and availability by centre, uncoached family comprehension, named clinical review, physical Safari/iOS and screen-reader checks, and field Core Web Vitals remain to be observed. A historical origin page with a competing autism-therapy URL still returns 200 and needs a Search Console/backlink-aware decision during the planned full therapy-estate review. See the [dated practical review](reviews/AUTISM-THERAPY-V127-PRACTICAL-REVIEW-20260930.md).

## Saved receipts

- `deployment/autism-live-v127-20260930.json`
- `deployment/autism-machine-live-v127-20260930.json`
- `deployment/autism-responsive-v127-live-20260930.json`
- `deployment/autism-responsive-v127-live-msedge-20260930.json`
- `deployment/autism-w3c-v127-local-20260930.json`
- `deployment/autism-w3c-v127-live-20260930.json`
- `deployment/indexnow-autism-v127-20260930.json`
