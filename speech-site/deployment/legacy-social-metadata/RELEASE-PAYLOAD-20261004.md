# Remove the invalid FAQ debugging dump

Action `WEB-LEGACY-PAYLOAD-STABILITY` / `41def042-431f-4291-8863-2242b09090ea`.

## Confirmed cause and bounded improvement

The public English answer, Hindi answer and Telugu ABA category contain the same 195,721-byte inline JavaScript payload: a `console.log` of an HTML-escaped, multilingual FAQ configuration object. The `&quot;` tokens are invalid JavaScript in a script element. Node syntax checking and Chrome both reproduce `Unexpected token '&'`. There are no other executable operations in this exact payload. It is debug output, not the answer, FAQ structured data, search logic or navigation data used by another script.

Remove only that payload when both its exact byte length and SHA-256 match:
`4a0bbd8996a569108cc0176dd270f916d9237a90a639f8dea27d340fff47a9dc`.

Keep the empty script element to avoid altering surrounding document structure. Preserve every unknown or changed script, all FAQPage JSON-LD, all visible/hidden answers, useful links, styles, brand elements and form behavior. Retain the prior HTTPS metadata correction. Shared portal components and all route mappings remain unchanged.

## Implementation

`payload.mjs` uses Cloudflare HTMLRewriter's raw-text handler. It buffers at most 256 Ki characters from a potential matching classic script, checks UTF-8 length and SHA-256, and emits the original text for every mismatch. Other document content continues streaming. No third-party dependency, new network request, public cache, storage or binding is added.

The entry handler's internal WeakSet identifies responses which actually passed the metadata guards and changed the known HTTP self-identity. An origin-supplied marker cannot authorise filtering. The independent review identified this internal-provenance requirement; a forged-marker 500/no-store/no-transform regression now preserves the entire response and ETag.

The filter is limited to existing eligible `/faq` routes. Physiotherapy, Anna Nagar, other centre routes, Astro pages, Ask and Verify are unchanged. Anna Nagar's fresh 1,602,890-byte response has **zero** copies of this known payload, so its heading/size task remains separate rather than receiving a speculative copy of this fix.

## Evidence and testing

Before this release, live HTML sizes were English 1,849,514 bytes, Hindi 2,633,202 bytes and Telugu 1,700,290 bytes. Each contained exactly one fingerprinted dump. Expected reduction: 195,721 uncompressed HTML bytes per matching page, roughly 10.58%, 7.43% and 11.51%, respectively. This is not a claim of equivalent transferred-byte or field-speed improvement.

44 focused runtime checks passed after the guard fix: byte-preservation outside the known payload; split UTF-8/script chunks; legitimate script and JSON-LD retention; a one-byte changed fingerprint; oversized unknown-script pass-through; and protected response handling. The compressed committed test fixture retains the actual public payload so CI exercises positive removal without network access; it is not a new public asset. A supplied `LEGACY_FAQ_FIXTURE` also verifies the complete captured document.

Chrome pre/post checks use 390px and 1440px widths for the English and Hindi pages. Check the actual screenshots, FAQ text hashes/counts, horizontal dimensions, search behavior and script errors. Existing legacy visual quality is outside this nonvisual repair. A separate pre-existing `Cannot set properties of null (setting 'innerText')` error is recorded; removing the debug dump does not resolve it.

The main Ahrefs crawl's observed 500 responses were transient for these two current samples, both now 200. The invalid client-side script does **not** establish the cause of server 500s. Do not claim that source incident, all 2MB-limit findings, or all slow-crawl notices solved. No stress test or cache-policy change was performed.

## Release boundary

Worker `pinnacle-legacy-social-metadata` only; baseline/rollback version `5b62fc46-9772-4e09-8a80-0ae1115b4026`. Preserve all 191 route records, five Workers' binding sets and the other four application versions. `release-payload.mjs prepare|upload|deploy|verify <absolute-receipt-directory>` checks the captured baseline and exact pushed source. No `--route` deployment and no Astro rebuild are needed for this isolated Worker revision; repository CI still performs its independent checks.

Receipt folder: `work/pinnacle-growth-system/legacy-payload-20261004` in the main workspace. Save measured public results, screenshots, source commit, deployment/version and rollback in the release receipt. A search annotation is a dated release record, not proof of rankings, AI citations or qualified enquiries. Let the existing scheduled crawl measure broader coverage; do not start another full audit.
