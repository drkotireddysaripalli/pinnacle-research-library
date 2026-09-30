# ABA Therapy life-first release v126 — 30 September 2026

## Public result

- [ABA Therapy and behavioural support for children](https://www.pinnacleblooms.org/best-aba-therapy-center-india-proven-improvement-rate) is live with a child-and-family opening, clear call to **9100 181 181**, plain ABA answer, a respectful transition-and-break example, the visible seven-stage life-first path, conditional roles for related therapies, family-to-professional review and a realistic first conversation.
- Three new page scenes and a distinct social poster were created with **built-in ChatGPT image generation in this Codex task**. They show a capable child, family agency and a full-sleeve white-coated professional. The page uses genuine emblem assets in its HTML. The public 1200 × 630 poster remains legible at a 400 × 210 preview and includes the service name, family message and national number.
- BACB, NICE, AAP and WHO links explain relevant principles without claiming their endorsement. Nearby Verify links identify the actual MD-5/BIS software scope, study status, programme direction and centre source limits. The page makes no 97% or ABA-specific outcome claim. The 62 listings are labelled as published network locations, **not a verified ABA staffing roster**.
- The mobile **More** menu was updated in its **shared stylesheet**, so therapies appear before the long evidence list on every managed page. The footer's Verify gateway remains part of the common footer. Coarse ABA call, centre, share and enrolment events are consent-controlled.

## Source and Cloudflare state

- Reviewed source was committed and pushed to the existing GitHub `main` branch **before** deployment: `32c83e9` (`Build life-first ABA therapy page and shared mobile menu`). The source includes the narrative, generated images, evidence exports, updated child sitemap, shared CSS/measurement code and release validators.
- The complete Verify + managed-page union matched **634 Verify assets** and **830 managed assets** to its Worker inventory. Cloudflare's dry run reported **five supporting modules**, bindings `ASSETS`, `PINNACLE_LEGACY`, `PINNACLE_ASK`, and `run_worker_first: true`. The production deploy used that full configuration **without** a `--route` override. It uploaded 33 new or modified assets from a 1,490-file union.
- Cloudflare Worker `pinnacle-verify-route` version **`8aea4a71-73c5-4ca7-ada1-11b99246d380`** reached **100% traffic** and the public page served the new hero and poster. The prior v125 version **`46a23d19-cd92-436c-9201-029e7b7e7815`** is the immediate rollback reference. Wrangler's upload message said “No targets deployed”; the subsequent deployment list showed the new version at 100% and public read-back confirmed it serves the routed page.

## Verification

- Production build succeeded. The route, enrolment and consented-measurement tests passed **56/56**; shared portal checks passed **29/29**. The new rendered ABA CTA test verifies consent on/off and Global Privacy Control without exporting child details, centre IDs or destination queries.
- Local and live Chrome checks passed at **320, 390, 768, 1024 and 1440 px**. Live Edge passed the same widths. No document overflow, duplicate IDs, missing anchors, broken required images or browser page errors were found; the mobile menu opened and closed, the seven stages and eleven visible/schema-matched FAQs appeared, and keyboard disclosure worked. The More panel begins with Therapies at 390 px.
- The public canonical returned 200 and its `/aba-therapy` and `/t/aba-therapy` aliases returned direct 301s. Ten managed routes rendered the same shared header and Verify-containing footer after normalising only their expected active-page `aria-current` value. Verify, FSC, PinnacleAI regulatory journey, National Autism Helpline, root/child sitemaps and `llms.txt` returned 200.
- Public ABA JSON/text/Markdown exports, the child sitemap and the OG JPEG matched staged bytes. The social JPEG returned 200 as `image/jpeg`, **197,785 bytes**, SHA-256 **`9481cf3e1aa850309a8ea6881f43a9d876f981124eb24cbc07ae5de6b9955b06`**. The canonical's Markdown negotiation returned `text/markdown` with `Content-Signal: search=yes, ai-input=yes`.
- W3C Nu reported **zero errors and zero warnings** for both the built and published ABA HTML. One IndexNow notification for the materially changed canonical returned HTTP **200** on 30 September 2026. This confirms submission only.

## Remaining outcome conditions

This publication does not itself establish Google/Bing indexing of the revision, ranking, AI citations, social client rendering, connected calls, attended visits or enrolments. The available Ahrefs project read returned **“Insufficient plan”**, so no fresh Search Console performance or URL-inspection state was asserted in this run. Current ABA professionals, service availability, appointment capacity and fees must be confirmed for the chosen centre; staff call read-back, named clinical review, uncoached family comprehension, real iPhone/Safari, screen-reader review and field Core Web Vitals remain unobserved. The historical canonical slug still contains “best” and “proven-improvement-rate”; the page does not repeat unsupported ranking or outcome claims. See the [dated 78/100 full-work-order practical review](reviews/ABA-THERAPY-V126-PRACTICAL-REVIEW-20260930.md) for the evidence and unearned points.

## Saved receipts

- `deployment/aba-live-v126-20260930.json`
- `deployment/aba-responsive-local-20260930.json`
- `deployment/aba-responsive-live-20260930.json`
- `deployment/aba-responsive-live-msedge-20260930.json`
- `deployment/aba-w3c-local-20260930.json`
- `deployment/aba-w3c-live-20260930.json`
- `deployment/indexnow-aba-v126-20260930.json`
