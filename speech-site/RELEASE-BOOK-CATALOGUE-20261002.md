# Pinnacle parent book catalogue — bounded release

Scope: an index and 14 edition pages for four approved 101 books (PDF, softcover, hardbound), plus four-book PDF and softcover collections. The current common PageLayout, header, footer, evidence library and existing page bodies are preserved. Existing approved covers and metadata are reused.

Prices: PDF ₹299, softcover ₹799, hardbound ₹1,699; four-PDF collection ₹999; four-softcover collection ₹2,499. All 14 offers currently use OutOfStock because physical stock and digital checkout/delivery are unavailable. No order, paid download, delivery date, ISBN, sales count or book-specific regulatory approval is invented. Public files contain cover images, descriptions and feed metadata only; paid PDFs are not exposed.

Release additions: exact `/books` and `/books/*` route assignments; 15 managed HTML documents; book assets; sitemap and Merchant XML. Google AI-generated title and description fields are explicitly identified; digital items exclude Shopping ads. Existing routes and all four live Worker bindings must survive activation. New route assignments do not alter or remove older assignments.

Validation: production Astro build passed; Astro reported zero type errors; 28 existing route/discovery tests passed. One independent source reviewer checked 14 SKUs/prices/statuses and additive route handling; their sole responsive image-width finding was fixed. Main inspected the actual Chrome desktop book hero, pricing selector, disabled purchase control and following content. Dedicated phone/tablet visual confirmation is not yet recorded. Google processing and approval are separate from deployment and feed submission.

Production version, source revision, live read-back and Merchant Center result will be appended after execution.
