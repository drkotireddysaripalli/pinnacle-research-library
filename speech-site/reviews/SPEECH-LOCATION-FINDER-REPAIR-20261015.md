# Speech flagship: earlier location choice

15 October 2026. Base `a366c60aa64b84b281a633c3a6044767915e7bcd`.

Visitors arriving for a local speech-therapy search had to reach the existing national directory before filtering by area. This bounded repair adds a location finder immediately after the Speech hero/action strip. It reuses that directory, offers a Hyderabad shortcut, focuses its existing search control and retains the current entry URL. It does not add a centre page, alter the canonical or assert that a location has a particular professional or appointment available.

Source scope: `src/components/SpeechPage.astro`, new `src/components/SpeechLocationFinder.astro` and `tests/browser/speech-location-finder.spec.mjs`. The approved narrative, seven stages, offer, national phone, shared shell, receiving service and consent/measurement code remain in place. No query values are stored or sent by the new component. Without JavaScript, both location links reach the server-rendered directory.

## Verification performed

- Pinned Node24.21.0/npm11.13.0; locked dependency installation and Astro type checking passed.
- Astro compilation and its builders completed. The strict build-window candidate gate FAILED twice because pre-existing builders mutate additional input files during the build, including `deployment/legacy-measurement.runtime.mjs` and the untracked managed-sitemap composition report. No guard or generated-output allowlist was changed to suppress this failure. The second run followed inspection of the first failure; there was no third unchanged retry.
- Diagnostic checks against the compiled, loopback-only Astro preview passed12 Chromium cases at320/390/768/1440px and6 Firefox/WebKit cases. They verify locality selection, focus, no-match recovery, paid-query preservation, no enquiry POST and JavaScript-off fallback. These checks do not make the strict candidate gate pass.
- Existing route, measurement and form-reliability unit suites:104 passed,0 failed.
- Changed section inspected at320/390/768/1440px. No horizontal overflow. The retained production canonical is `/top-speech-therapy-center-india-proven-improvement-rate`.

The local first browser attempt preceded a successful preview-server start and failed as infrastructure; the corrected-server run above is retained separately. Build logs, screenshots and diagnostics are in the acquisition owner's local work receipt, not in this public repository.

## Remaining release boundary

This is a tested patch for the existing integration/website owner, not a production deployment or a certified Google landing-experience improvement. Resolve the existing candidate input-mutation gate, complete trusted exact-source CI and the owner-required release checks, preserve the current complete route/asset/binding union, then verify the actual public Speech page and enquiry/call links. Reassess affected keyword landing experience and genuine receiving outcomes after sufficient real traffic. No100% impression-share or score guarantee is made.
