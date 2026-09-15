# Pinnacle Verification Site

Static, source-led verification centre for Pinnacle Blooms Network and Bharath Healthcare Laboratories Private Limited.

## What is included

- `dist/` — the deployed static site, evidence register, 33 permanent record pages, PDFs, JSON, `llms.txt`, sitemap and robots policy.
- `content/` — reviewed page content and review queue.
- `scripts/` — deterministic content and icon build helpers.
- `assets/lucide/` — pinned Lucide SVG assets with licence and provenance.
- `.openai/hosting.json` — Sites deployment configuration.

## Live review edition

- https://www.pinnacleblooms.org/verify/
- https://pinnacle-verify.saripalli.chatgpt.site/

The review edition is intentionally marked `noindex,nofollow` until a human approval decision is recorded. It describes documentary evidence and scope limits; it is not an issuer or regulator verification service.

## Local preview

Serve `dist/` as a static directory. The page works without JavaScript; JavaScript adds filtering and centre search as progressive enhancement.
