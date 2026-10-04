# Speech and Occupational Therapy: useful book companions

Queue `COMMERCE-CONTEXT-LINKS`; action `f2887fd0-a86b-4a54-a9bd-6c834a3b2356`.

## Purpose and exact scope

Help parents continue a relevant family conversation, choose an English/Hindi/Telugu illustrated guide and read a free sample. Individual care and enquiries to 9100 181 181 remain the primary therapy journey. This is a contextual connection to existing resources, not a therapy-page rewrite or a new offer.

- Speech: after the first-visit/family-practice content, before integrated therapy. Book: My Message Matters.
- Occupational Therapy: after review-progress, before the evidence section. Book: I Belong in Everyday Life.
- Each block: original branded cover, concise discipline-specific copy, free English sample, three native-language edition links, clear free-sample/paid-book distinction.
- All six public edition pages and their six free sample PDFs were verified before implementation. Catalogue matching uses exact English-page identity; the OT native key is `ot`.

## Source and delivery

`TherapyBookCompanion.astro` is the shared source for both pages. `therapy-reading.mjs` derives the actual book/language links from the current catalogue. Postbuild compiles the rendered section, including its isolated CSS, into `therapy-reading-content.mjs` and updates the two corresponding reading aids.

The current live Worker uses an immutable union asset store. This release inserts only the source-built section into each existing public HTML body, plus matching text into the two reading aids. It does not replace the asset store with a newly generated site. Canonical identity and a unique section anchor are required; insertion is idempotent for future union builds. A changed validator prevents old body reuse.

Release baseline: main version `78b37416-df98-43e4-aac6-d7d11ee573a8`; 194 routes, four main bindings and all other Worker versions preserved. Keep all 14 baseline modules, changing only `speech-handler.mjs`, and add two reading modules. `release-therapy-reading.mjs` checks live source, routes and bindings, requires pushed source before activation, and checks uploaded module bytes afterwards. Keep current ASSETS through `keep_assets` and binding inheritance. The full union upload helper also includes every current required module for future releases.

## Validation and limits

- Production Astro build passed. 123-file type check: zero errors. 310 unit tests passed, including insertion isolation, aliases, private caching, GET/HEAD and conditional requests.
- Candidate Chromium at 320/390/768/1440 CSS px and WebKit at 390 passed for both blocks: no horizontal overflow or page errors, correct links, readable text, keyboard focus, loaded images and existing call/enquiry controls.
- Screenshots inspected for desktop and mobile. These are browser-engine checks, not physical-device certification.
- Responsive original covers served through existing Cloudflare image optimisation: 400px WebP 45,820/50,660 bytes and 800px 136,224/161,398 bytes. Images load lazily; the hero and common shell remain unchanged.
- Candidate HTML is byte-identical to captured production outside the one inserted section per page. The six existing PDFs remain original public sample files.
- After release, verify two pages and reading aids, request variants, 14 protected destinations and all routes/bindings. Run a bounded two-URL crawler check, then one changed-URL IndexNow submission and one GSC annotation. Attach results to the release receipt.

No catalogue, stock, price, publishing, payment, Ask/authentication, common header/footer or claim changes. No purchase or customer enquiry test. Deployment does not establish indexing, ranking, sales, AI citation or qualified-enquiry improvement.

## Delivered receipt

Published 4 October 2026 from `b7162830ac6206f7b33695f03ecd347f9a6b74da`; main Worker `d334d820-ac6e-45c6-90e3-70db6519c9b3`. Exact-source CI successful. Ten live browser checks, 13 response/reading-aid checks and 14 unchanged protected responses passed. All 194 routes and four bindings retained, all 16 deployed modules match intended bytes. Screaming Frog returned both URLs as 200/indexable/self-canonical. IndexNow accepted both with key validation; GSC annotation `d788e532-04d8-49ea-a63b-e315bf6b290a`. Full proof is in `therapy-reading-release-receipt-20261004.json`.
