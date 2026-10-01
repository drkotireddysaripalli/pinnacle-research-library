# Common monitoring and accessible-name correction · V151

## Problem and resulting behaviour

Lighthouse confirmed that the already-enabled Cloudflare Web Analytics beacon was injected into managed HTML but blocked by its Content Security Policy. The common public HTML handler now permits only its trusted script host, `https://static.cloudflareinsights.com`. Automatic injection sends performance beacons to the existing same-origin endpoint; no external collector permission or duplicate script is added. Preview pages retain their stricter policy and search exclusion.

The common helpline link's overriding accessible name omitted its visible “Free guidance · 24/7” text. Removing that redundant attribute lets the visible wording supply the name. This change is made once in `SiteHeader.astro` and reflected across48 accepted public HTML files. The link, visible wording, layout and footer are retained.

## Reusable toolkit

Lighthouse13.5.0 is pinned directly, with zero dependency-audit advisories. `check:speed` saves mobile/desktop HTML/JSON lab reports using an isolated browser, supports preview/production targets and does not submit forms. The shared page smoke also checks HTTP status, title, indexability and visible-image decoding. GitHub quality jobs add Firefox/WebKit on Linux to complement local Chromium/Edge/WebKit; physical-device testing remains distinct.

Before this correction, live OT and enrolment each scored97mobile/100desktop performance and100automated SEO/accessibility, with92best-practices caused by the blocked beacon. Cloudflare Observatory's Mumbai runs independently returned97/100, LCP2425ms/2433ms mobile, CLS0 and TBT0. These are dated lab measurements, not field INP or evidence of ranking/conversion improvement. Post-release results are recorded below after read-back.

## Frozen release boundary

Candidate `release-monitoring-v151-20261001`, paired upload `.worker-upload-monitoring-v151-20261001`, derived from V150's accepted stage/upload. Exactly48 public HTML files lose one attribute;1,879 other union files remain byte-identical. Four other runtime modules are unchanged. `speech-handler.mjs` adds one script host; the complete Worker inventory changes only48 HTML hashes. Existing asset/media/evidence/Verify files, route logic, enquiry acceptance and bindings are retained.

Rollback: V150 Worker `2ea18faa-90c4-442c-b6d0-6f8758315373`, stage `release-measurement-v150b-20261001`, paired upload `.worker-upload-measurement-v150b-20261001`. Before release:177 zone routes,78 assigned to this Worker, four bindings, fingerprint `ced794a6`. Upload through `wrangler versions upload`, with no route flag, then set the new version to100% through the established API. Source must be pushed first.

Acceptance: one production build/type pass, focused unit tests, representative responsive checks, exact public-body/CSP read-back for all48 pages, preview and protected-route controls, actual same-origin beacon acceptance and a targeted Lighthouse repeat. This technical correction needs no unchanged-URL IndexNow submission. The public key remains9eccddfeede58a1e7db0a8a2aa8286ab, verified in GSC Wizard and at its existing public root file.

## Publication

Pre-publication: Astro diagnostics81files/zero errors; production build succeeded;111focused unit tests passed; Chromium320/390/768/1440 checks passed. One new test initially assumed the retired public preview still served200; that fixture was corrected to the actual retained route contract, without changing runtime or rebuilding unchanged source. Public read-back and the deployed version must be recorded before marking publication complete.
