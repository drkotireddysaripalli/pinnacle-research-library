# Pinned public compatibility assets

These are bytes previously served publicly by pinnacleblooms.org, retained for a deterministic repair and cached-page compatibility. Their original licence notices remain in the compiled assets. They contain public client code, not account credentials or enquiry records.

- `portal-ad-call-14e25cf9a633d670.mjs`: exact historical source from commit `0c3d1afc9edea7e26ece75b7849b754361388b81`, checked out with the CRLF bytes used by the original Windows deployment. SHA-256 `14e25cf9a633d6709a52d519b6f0296fd671759763342dc16c19d8db01e07f6a`. Restore this filename with these exact bytes for cached HTML; do not silently point it at a different policy implementation.
- `google-ads-call-consent.FqeWzaS9.mjs`: original public asset read back on 12 October 2026; SHA-256 `a2e131ede01e98c72f09ec5aab665ba4519967c769c72fa0511d51aeb2c796e3`.
- `newmirracleportal-v42.js`: public ASP.NET bundle `/bundles/newmirracleportal?v=42`, read back on 12 October; SHA-256 `bf6fc446dd9840ab9b23518ca1ce94dd8b90af03851e161750cc9d2330dce0e8`. Its existing minifier reported template-literal parsing failures and returned unminified code. The modern compiler retains its globals and licence notices.

`node scripts/build-shared-assets-repair.mjs` verifies the pins, creates minified bundles under new immutable hashes, and generates the serving module and byte/hash manifest. Fresh public HTML rewrites only the two exact script/preload references. Old asset paths remain owned by their existing handlers, with original bytes preserved. Consent, call/enquiry behavior, CSP and private routes are unchanged. The missing hashed call module receives exact historical bytes.

This source pin is the repair's provenance; future maintained consent changes belong in the existing shared source/build system. Do not edit these historical assets in place or infer new consent authority from restoring or minifying them.
