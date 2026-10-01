# Common monitoring and accessible-name correction · V151

## Problem and resulting behaviour

Lighthouse confirmed that the already-enabled Cloudflare Web Analytics beacon was injected into managed HTML but blocked by its Content Security Policy. The common public HTML handler now permits only its trusted script host, `https://static.cloudflareinsights.com`. Automatic injection sends performance beacons to the existing same-origin endpoint; no external collector permission or duplicate script is added. Preview pages retain their stricter policy and search exclusion.

The common helpline link's overriding accessible name omitted its visible “Free guidance · 24/7” text. The final desktop check also found that “Find a Pinnacle centre” failed to include the exact visible phrase “Find a centre.” Removing the two redundant attributes lets the visible wording supply both names. These changes are made once in `SiteHeader.astro` and reflected across48 accepted public HTML files. Links, visible wording, layout and footer are retained. The exact label/name rule now runs alongside the normal axe check.

## Reusable toolkit

Lighthouse13.5.0 is pinned directly, with zero dependency-audit advisories. `check:speed` saves mobile/desktop HTML/JSON lab reports using an isolated browser, supports preview/production targets and does not submit forms. The shared page smoke also checks HTTP status, title, indexability and visible-image decoding. GitHub quality jobs add Firefox/WebKit on Linux to complement local Chromium/Edge/WebKit; physical-device testing remains distinct.

Before this correction, live OT and enrolment each scored97mobile/100desktop performance and100automated SEO/accessibility, with92best-practices caused by the blocked beacon. Cloudflare Observatory's Mumbai runs independently returned97/100, LCP2425ms/2433ms mobile, CLS0 and TBT0. These are dated lab measurements, not field INP or evidence of ranking/conversion improvement. Post-release results are recorded below after read-back.

## Frozen release boundary

Final candidate `release-monitoring-v151a-20261001`, paired upload `.worker-upload-monitoring-v151a-20261001`, derived from V150's accepted stage/upload. Exactly48 public HTML files lose two attributes;1,879 other union files remain byte-identical. Four other runtime modules are unchanged. `speech-handler.mjs` adds one script host; the complete Worker inventory changes only48 HTML hashes. Existing asset/media/evidence/Verify files, route logic, enquiry acceptance and bindings are retained. Compared with the interim V151 publication, V151a changes only the centre link's attribute and associated48 HTML hashes.

Rollback: V150 Worker `2ea18faa-90c4-442c-b6d0-6f8758315373`, stage `release-measurement-v150b-20261001`, paired upload `.worker-upload-measurement-v150b-20261001`. Before release:177 zone routes,78 assigned to this Worker, four bindings, fingerprint `ced794a6`. Upload through `wrangler versions upload`, with no route flag, then set the new version to100% through the established API. Source must be pushed first.

Acceptance: one production build/type pass, focused unit tests, representative responsive checks, exact public-body/CSP read-back for all48 pages, preview and protected-route controls, actual same-origin beacon acceptance and a targeted Lighthouse repeat. This technical correction needs no unchanged-URL IndexNow submission. The public key remains9eccddfeede58a1e7db0a8a2aa8286ab, verified in GSC Wizard and at its existing public root file.

## Publication

Pre-publication: Astro diagnostics81files/zero errors; production build succeeded;111focused unit tests passed; Chromium320/390/768/1440 checks passed. One new test initially assumed the retired public preview still served200; that fixture was corrected to the actual retained route contract, without changing runtime or rebuilding unchanged source. Public read-back and the deployed version must be recorded before marking publication complete.

**Published and verified:** source `11c4c1f75bbcc3d4bf91638da89f30a9de78b592` was pushed first. Worker `f139550b-cd3b-479e-8ce2-c2f1c8335513` serves100%; deployment `bc69d438-c98c-4de5-a2b5-6e6dd6aa6a02` was created at2026-10-01T06:21:45.048493Z. The immediate read-back caught the prior version during edge propagation; a subsequent exact body/policy read confirmed the new state, then the48-page verification passed. No route or body was changed to bypass that check.

All48 public HTML bodies and monitoring policies match the candidate; nine controls passed, Verify matched its unchanged runtime URL mapping, and177zone routes/78Worker assignments/fourbindings retain fingerprint `ced794a6`. Actual performance beacon requests returned204 on OT and enrolment; no browser console errors remained. The retired public preview still301s to live enrolment. No real enquiry or unchanged IndexNow submission was made. Evidence: `deployment/monitoring-v151-live-20261001.json`, `deployment/monitoring-v151-cloudflare-20261001.json`.

Interim V151 OT Lighthouse: mobile97performance,100accessibility,100best-practices,100SEO; desktop100in all four categories. Mobile LCP2364ms, desktop547ms, TBT0 and CLS0. Blocked-script findings are absent. The experimental desktop name rule found the separate centre-link label, now corrected in V151a and added to the reusable smoke check. Full interim reports remain in ignored `audits/lighthouse/occupational-production-2026-10-01T06-22-20-221Z`.

The [GitHub quality run for the source](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/36824260504) succeeded, including the new Firefox/WebKit engine checks on Linux. Documentation-only commits are excluded from future quality runs. Physical-device tests and future real-user performance/outcomes remain separate.
