# Occupational Therapy release v112 — 29 September 2026

## Published destination

- Canonical: `https://www.pinnacleblooms.org/best-occupational-therapy-center-india-proven-improvement-rate`
- Permanent aliases: `/occupational-therapy` and `/t/occupational-therapy`
- Primary actions: call `9100 181 181`, find a Pinnacle centre, or continue to the established enrolment page

## What was released

- A complete, service-specific Occupational Therapy page organised around everyday participation, growing independence and the child's wider life.
- Pinnacle's seven-stage life-first pathway, with therapy, family observations, everyday practice, review and plan correction connected visibly.
- The shared Pinnacle header, authority navigation, centre directory, 36-record Verify gateway and complete portal footer.
- An original branded Occupational Therapy visual, a 1200 × 630 social image, responsive image delivery and descriptive alternative text.
- Service, breadcrumb and FAQ structured data that matches visible page content.
- A citation-ready evidence map in JSON and text, a first-party Markdown reading surface, sitemap inclusion and root `llms.txt` discovery.
- Permanent redirects from the two competing legacy Occupational Therapy routes.

## Claim boundaries

- PinnacleAI GPT-OS is described as a non-diagnostic Class B developmental-support SaMD.
- Regulatory records establish their documented regulatory and quality scope; they are not presented as proof of therapy outcomes.
- Occupational therapy is described as supporting abilities and participation toward family priorities. No cure, school entry, self-sufficiency, mainstream inclusion or timing is guaranteed.

## Verification

- Production build passed.
- 46 focused route, discovery, enrolment, privacy and measurement checks passed.
- Responsive review at 390, 768 and 1440 pixels found no horizontal overflow; the visual HTML did not change in the final discovery repair.
- The public canonical, Speech Therapy, enrolment, Verify, FSC record, PinnacleAI story and National Autism Helpline return HTTP 200.
- The canonical contains the expected phone, shared header/footer, FAQ markup and evidence map.
- Both legacy aliases return HTTP 301 to the canonical.
- Root sitemap exposes the managed therapy child sitemap; that child contains the Occupational Therapy canonical.
- Occupational Therapy and enrolment return `text/markdown` with `Content-Signal: search=yes, ai-input=yes` when requested by compatible agents.
- The public Open Graph image returns HTTP 200 as `image/jpeg`.

## Deployment and discovery

- Cloudflare Worker: `pinnacle-verify-route`
- Version: `e2bdc8ce-bb5b-4df4-b515-03273f9c70e1`
- Rollback version: `4bbabdcd-7f64-4d64-9de0-6bd8f7b50f53`
- Exact Occupational Therapy routes and the root sitemap route point to the managed Worker.
- Five materially changed URLs were submitted once through IndexNow and returned HTTP 200.

Publication, technical retrieval and IndexNow acceptance are verified. Indexing, ranking, AI citation, calls and enrolment remain later measured outcomes.

