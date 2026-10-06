# Anek vernacular typography — released 6 October 2026

**Completed, checked in, deployed and publicly verified.** Source `8726afb0789d5b7543a0ace1d3d598f3d5c4208b`; initial typography source `7a5f4435386b74f222e8c66ecc3c12e1f57cb106`.

## What changed

One common typography contract applies Anek to native Indian-script HTML in the portal, Ask/FAQ and Verify. Native book styles, Ask's older Telugu fallback and partial FAQ font definitions now reuse the contract. Headings use 800 ExtraBold, body copy 600 SemiBold and controls 700 Bold. Negative native letter spacing is removed. Existing English font definitions, content and brand colours remain. Native mobile call actions retain the complete 9100 181 181 number on one line.

All nine already-hosted Anek script fonts were inspected as real variable WOFF2 fonts and verified against live bytes. They cover Devanagari, Telugu, Tamil, Kannada, Malayalam, Bangla, Gujarati, Gurmukhi and Odia. Only scripts used by the document load. The assets and their licence files were reused.

## Release

- Portal: `52ba9d40-eddb-4864-a08b-fae511f6f1f2`.
- Ask/FAQ: `800a09a7-556c-4311-b07e-2ac548fd7c61`.
- All 209 routes, 4 portal bindings and 21 Ask bindings retained; 36 portal modules.
- The exact 2,160-file approved portal asset union was retained with **zero new asset uploads**.
- Both source revisions passed Portal quality CI. Local Astro compiled 135 pages and Ask/FAQ compiled successfully.
- Text, links, images, canonical metadata and structured data matched the before-state across 11 representative native documents. Fourteen protected public controls were checked.

## Rendered and physical coverage

- **30/30** local presentation checks: Chromium at 390/768/1440px and WebKit at 390px, covering native books, six native FAQ languages, Telugu Ask, English Speech Therapy control and a nine-script font specimen.
- **8/8** additional phone-number grouping checks: Telugu/Hindi at 320/390px in Chromium and WebKit.
- **9/9** physical page checks: Pixel 8 / Android 17 Chrome and iPhone 17 Pro / iOS 26.5 Safari. Eight checked the full typography release; the ninth rechecked the final Telugu number-grouping fix.
- No horizontal overflow found in that scope. Screenshots were inspected. Chromium platform-font inspection identified `AnekMalayalam-ExtraBold` on the native FAQ heading.
- All TestingBot sessions closed. Sign-in, payment and lead submission were not part of these typography tests. This is representative coverage, not a claim that every URL/device was tested.

## Live examples

- https://www.pinnacleblooms.org/books/te
- https://www.pinnacleblooms.org/books/hi
- https://pinnacleblooms.org/ask/te
- https://www.pinnacleblooms.org/faq/tamil
- https://www.pinnacleblooms.org/faq/kannada
- https://www.pinnacleblooms.org/faq/malayalam
- https://www.pinnacleblooms.org/faq/marathi
- https://www.pinnacleblooms.org/verify/guides/te/abilityscore.html

`VERNACULAR-TYPOGRAPHY.md` and `AGENTS.md` retain the standard for future pages. The detailed receipt is `deployment/vernacular-typography-release-20261006.json`. Existing artwork and PDFs were not re-typeset. No recrawl or indexing resubmission was needed for this typography-only change.
