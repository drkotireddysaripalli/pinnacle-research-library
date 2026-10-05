# Amazon paperback buying links — 5 October 2026

Published and publicly verified at 2026-10-05T18:05:50.955202+00:00.

Three English 44-interior-page Amazon paperback editions now have a clearly labelled **Paperback on Amazon.com** link on their existing softcover page and matching card on `/books`: six placements across four pages.

| Book | Public page | Amazon ASIN | ISBN |
|---|---|---|---|
| My Message Matters | [/books/speech-communication-101-my-message-matters-softcover](https://www.pinnacleblooms.org/books/speech-communication-101-my-message-matters-softcover) | B0HLZPP118 | 9798178590706 |
| I Belong in Everyday Life | [/books/occupational-therapy-101-i-belong-in-everyday-life-softcover](https://www.pinnacleblooms.org/books/occupational-therapy-101-i-belong-in-everyday-life-softcover) | B0HLZKRV9J | 9798178588741 |
| Learning Through Everyday Play | [/books/special-education-101-learning-through-everyday-play-softcover](https://www.pinnacleblooms.org/books/special-education-101-learning-through-everyday-play-softcover) | B0HLZJ9WKJ | 9798178764794 |

## Edition and purchase truth

The Amazon editions are explicitly separate from Pinnacle's own stock-zero softcovers and 46-page PDFs. The detail panels explain the sideways landscape illustrations within the portrait 8.5 × 11-inch book. Readers check Amazon for current price, shipping/import charges and delivery to their address. No price, date or worldwide-delivery promise was added. Actual public Amazon title/byline/description/product details were read in Chrome.

Shopify catalogue, prices, 99 variant mappings, stock, checkout, authors, covers, Product/Book/Offer schema, and previous Kindle, Google Play and hardcover links are preserved. No search resubmission or catalogue mutation.

## Source and release

- Source commit: `914b526d38b3aa366aba1855d7e6c2dbeabdc523`; pushed to `main`.
- CI: [Portal quality succeeded](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37352305627).
- Cloudflare version: `5e5cad5b-ecf4-4a12-a38b-6cd4fb2c1a7e` at100%.
- Deployment: `7ef2dbaa-3d09-4aaa-a2b1-a714f324a026`.
- Rollback: `79fd6ef1-e733-497e-9bf9-d76822d04296`.
- Exact live modules retained: only `speech-handler.mjs` changed and `book-paperback-links.mjs` added. Static assets retained.209 routes and four portal bindings unchanged. Ask, Ask MCP, legacy repair and root sitemap Worker versions/bindings read back unchanged.

## Verification and limits

-17 targeted paperback/Kindle/hardcover tests passed, including edition targeting, catalogue preservation, stale validators, private responses, HEAD and idempotence.
-135-page production Astro build completed; initial non-production invocation hit the existing SEVA production guard, then the production build passed.
-Four pages checked at390/768/1440px: no horizontal overflow, readable16px link labels and44px click targets;18 candidate screenshots saved, representative phone/tablet/desktop views inspected.
-All four public URLs match the candidate, with normal and cookie requests; HEAD empty as expected. Two live screenshots inspected. Comparisons remove Cloudflare's injected beacon and normalize the preexisting private-response Ask trailing-slash link only.
-12 protected destinations remain200 with unchanged bodies. Two additional controls, `/books/hi` and `/books/te`, already returned404 before this release and still do. This is recorded as **WEB-BOOK-NATIVE-404-20261005**, not presented as a pass.
-No physical-device run, new Lighthouse crawl, Ahrefs recrawl or repeated search notification was needed for these six added links. Responsive checks are local Chromium; CI includes Firefox and WebKit.

Full receipt: `deployment/paperback-links-20261005.json`. Evidence and screenshots: `work/pinnacle-growth-system/paperback-links-20261005` in the parent workspace. No purchase, indexing improvement or sale is inferred from the links.
