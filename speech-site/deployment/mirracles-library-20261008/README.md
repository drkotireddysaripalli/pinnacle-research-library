# Public Mirracles library candidate — 8 October 2026

This is a fresh, lightweight server-rendered implementation. It imports no React app, authentication, account, payment, family-report or operational database code. The module is integrated by the bounded public-completion release helper; consult deployment/public-completion-20261008.json for actual deployment status. It does not install routes or bindings itself. The offline builder also emits the flat deployment modules `../mirracles-library.mjs` and `../mirracles-library-assets.mjs` for the existing public portal capture.

## Public inputs and preservation

- Saved corrected public video sitemap: `work/website-completion-20261007/after/video-map.xml`. Its SHA and exact inventory are in `data/provenance.json`.
- Directory core: 19,292 existing sitemap page URLs; 19,163 have public player metadata. All source categories come from `video:category`; `null`/empty is missing metadata. The source's distinct `Techniques` and `techniques` remain distinct.
- Existing `ask-public/knowledge-data/mirracles-*.json` supplies older published titles, thumbnails and URL aliases. All 28,334 published archive links are retained. Archive-only identities remain accessible detail records; absent player/date/category fields are not invented. They are not added to the 19,292-item current sitemap directory.
- Shared brand/navigation inputs: `src/components/SiteHeader.astro`, `SiteFooter.astro`, `src/data/portal-navigation.json`, `src/data/site.ts`. Default candidate chrome uses the current logo/contact/brand identity and those public navigation labels/links. Production integration can supply the actual common server-rendered `head`, `header` and `footer` through the `shell` option; this module does not modify those components.

## Rebuild and tests

From the speech-site directory:

```
python deployment/mirracles-library-20261008/build-data.py
node --test deployment/mirracles-library-20261008/library.test.mjs
python deployment/mirracles-library-20261008/test_legacy_identities.py
```

The builder reads saved files only. It generates chunked detail assets, the catalogue, provenance and `assets.mjs` here, and synchronizes the two flat runtime/asset sibling modules used by integration. It uses the authored CSS/player script and unchanged approved logo.

## Source-verified legacy numeric aliases — 9 October 2026

`data/legacy-identity-aliases.json` records dated original public-page evidence for **28 recovered numeric identities / 55 exact paths**. For example, old ID `2652` identifies the same primary/schema YouTube video and Stream thumbnail as current sitemap record `20688754201`. Recorded old paths render their current record with its current canonical/OG/video identity. A bare old ID or changed slug redirects to the current canonical, preserving the complete query string. These aliases add no listing or sitemap record; the source retains 29,759 primary records and reports recovered alias IDs separately.

`legacy_identities.py` validates the original player/thumbnail pair, successful source receipt, exact current public-sitemap target and absence of identity collisions before the builder emits aliases. Identical media pairs with competing targets are rejected. The same player with different thumbnails can resolve only to the uniquely matching pair; this distinguishes old ID `1160`. Runtime loading rejects conflicting/missing targets and alias chains. Missing provenance remains unresolved; titles are never used to infer equivalence. The original HTML is retained privately outside the repository, with its hash in the manifest.

The verified private supplement at `d4251ef1619e78b642318f5877147bc460e767d2` supplies all 33 historical incident groups: one is already native, 28 are recovered here and four remain unresolved (`15843`, `20980`, `20067`, `18253`). Neither their original players nor their thumbnails occur in the maintained catalogue. They retain the existing owner/fallback. The precise private source lookup slice goes to Windows for original database/publication/consent disposition; no separate eligibility/consent export was available. Thirty-one exact original-page reads and the reused 2652 observation supplied the immutable-media joins; no broad crawl was run. The sample is not a full legacy population or a current error total.

Integration must synchronize `library.mjs` into the flat sibling `../mirracles-library.mjs` with the existing import replacement and validate the recovered aliases against that flat module. The full builder also writes flat sibling assets and needs its original saved video-map input; this scoped patch does not run it or edit those integration-owned siblings. Thirteen candidate Node tests and seven offline identity-evidence tests cover the source patch. Browser/cloud/build/deployment and flat-alias verification remain integration coverage; the existing flat homepage-equivalence assertion alone does not cover the new cross-ID behavior.

## Integration contract

`createMirraclesLibrary({loadJson, shell, responseHeaders})` returns `async handle(request)`. It returns a `Response` only for eligible public library routes, or `null` to preserve the existing owner. Root chooses integration and deployment separately. `responseHeaders` is a trusted Headers-compatible policy override for actual common-shell CSP and related headers. The router still enforces its HTML content type, cache policy and robots policy.

```js
import {createMirraclesLibrary} from './mirracles-library.mjs';
const handle = createMirraclesLibrary({
  loadJson: async name => {
    // Map only the generated catalogue/details assets through the existing
    // public asset service. Reject unexpected names before constructing a path.
    if (!/^(catalogue|details-\d+)$/.test(name)) throw Error('asset');
    const response = await publicAssets.fetch(
      'https://assets.internal/mirracles-library-20261008/data/'+name+'.json'
    );
    if (!response.ok) throw Error('source');
    return response.json();
  },
  shell: async ({currentPath}) => existingServerRenderedCommonShell(currentPath),
  responseHeaders: existingTrustedCommonShellResponseHeaders
});
// In the existing public handler, before its old public library fallback:
const result = await handle(request);
if (result) return result;
```

Routes: `/allmirracles`, `?page=`, `?q=`, `?category=<actual source value>`, `/allmirracles/category/<actual source value>`, source category shorthand and all known `/mirracles/<Id>/<slug>` URLs. CSS, the player script and approved logo are served under `/allmirracles/_assets/`. Listings contain 24 records, with up to 6 related records on a detail page. Known old aliases render the same record with its source canonical. Unknown numeric identities pass through; a known identity with an unrecorded slug redirects to its recorded URL.

The 10,836,269-byte catalogue is a server input, never embedded in browser HTML. A compact `aliasPaths` map replaces 29,759 mostly empty per-record alias arrays, saving 386,822 bytes without losing any recorded path. The factory caches its parsed catalogue; instantiate it once per public worker, and serve data through the existing internal public-asset service. Detail data is loaded one 500-record chunk at a time. A failed catalogue load clears its cached promise so the next request can recover; a transient shell-load failure also recovers on the next request. Cold asset loading and the final common shell still require integration validation.

## Privacy, evidence and incomplete records

No analytics, tracking, sign-in, enquiry submission, payment or database request is added. Search is capped at 100 characters, escaped, noindexed and privately uncached; terms are absent from canonical/OG URLs and JSON-LD. Cookie-bearing main/category/detail HTML is also `private, no-store`; the public data is unchanged. Default HTML and player assets use `Referrer-Policy: no-referrer`. The YouTube iframe is created only after pressing Play; the poster has reserved geometry and the player uses YouTube's privacy-enhanced host. A direct player link works without JavaScript.

VideoObject requires a source title, description, permitted thumbnail, valid publication timestamp and verified YouTube embed identifier. Legacy scale/percentage/patent/superlative/guarantee claims are retained in candidate source data but withheld from rendered description and JSON-LD. This can make schema counts lower than source video-entry counts; no clinical evidence is invented. Titles remain the published record titles, with a visible individual-experience limitation.

The default CSP permits only the candidate's self-hosted scripts/styles, approved image hosts and the click-triggered player. If Root supplies common-shell HTML, its existing CSS/scripts must be supplied through the trusted shell head and its CSP requirements reviewed. Supply the established common response policy through `responseHeaders` where required. Local fixture tests are not public-live or field performance proof.

## Recorded validation

Ten targeted Node tests pass: source URL/category preservation, 24-item pagination, category variants, safely escaped search, detail/alias behavior, complete-source VideoObject, protected-route fallthrough, HEAD/error/shared-shell behavior, common-shell header overrides/cookie caching, flat runtime equivalence and transient source/shell failure recovery. The earlier isolated Playwright fixture passes at 390px: no horizontal overflow, 52px call target, no initial iframe, one blocked privacy-enhanced player request after Play. It used invented poster responses and blocked all external requests. See `browser-fixture-result.json` and the two candidate screenshots. The final deployment adjustments were covered by the targeted Node tests; no additional browser pass was necessary.

The current source yields 19,010 candidate VideoObjects after completeness and legacy-claim checks. This is a source/rendering result, not Google validation, indexing, live performance or conversion evidence.
