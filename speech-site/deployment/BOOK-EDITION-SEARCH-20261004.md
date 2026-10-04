# Distinct English summaries for native book editions

Queue `COMMERCE-DESCRIPTIONS`; action `5a01e0eb-c8e5-49b3-aa43-ce293d1f5207`.

## Exact problem and intended behavior

Twenty English information pages for Hindi/Telugu PDF editions repeat four generic descriptions. A reader or search system cannot distinguish the speech, OT, behaviour and early-learning subjects from those summaries. Each replacement identifies the language, subject or two included subjects, PDF format and an invitation to preview the existing book(s).

The scope is four single books and six pairs per language. The two four-book collections keep their current description. Prices and page counts remain in the product content; the new summaries do not duplicate volatile prices. No new therapeutic outcome claim is introduced.

## Source and release contract

- `src/data/book-edition-search.mjs`: ten subject-specific patterns, selected using exact `included_books` keys and language.
- The existing edition Astro page passes the derived summary to the common layout. No common layout, header or footer edits.
- Existing catalogue JSON remains byte-identical. Titles, identifiers, Product/Book/Offer records, authors, prices, stock, covers, visible text, language identity, canonical/hreflang and Merchant feeds remain intact.
- Postbuild generates an exact 20-route map from the source helper and current catalogue. The existing Worker replaces only three meta summaries and the exact WebPage description, requiring a matching canonical and all four expected previous fields. A partial or unexpected source returns unchanged.
- Preserve current live immutable ASSETS through `keep_assets`; change only the existing speech handler and add two search-summary modules. Future full union builds emit the same summaries and require no compatibility rewrite.
- Baseline main version `d334d820-ac6e-45c6-90e3-70db6519c9b3`; all 194 routes, four bindings, 16 original modules and other Worker versions protected.

## Independent review and validation

One read-only reviewer confirmed the 20/22 scope, exact locale/subject identity and that pairs are separate PDF books. Adopted those boundaries. Summaries use the subject names and preview invitation instead of repeating prices; current commercial figures remain on the page. Preserve native `inLanguage` for products and `en-IN` for these English information pages.

Production build passed; 333 unit tests passed. Built metadata and WebPage descriptions match the intended values for all 20 pages. Captured live-source candidates change only the intended summaries; body hashes, product records and links match the baseline for every page. No visual layout change, new image generation, purchase or enquiry submission is involved. After publication verify the same 20 public pages, request variants, 14 protected destinations and Cloudflare module/binding/route state. Run only the changed-URL crawl, one IndexNow batch and one GSC annotation.

This is a search/social description correction. Search engines choose whether to use the supplied snippet; no indexing, ranking, click or sales gain is implied by publishing it.
