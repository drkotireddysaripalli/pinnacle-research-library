# Physiotherapy page identities — 6 October 2026

## Problem and resulting behavior

The existing CollectionPage repair is live, but two captured WebPage scripts still identify the page with HTTP URLs, including campaign parameters. This correction changes their three self-reference strings to `https://www.pinnacleblooms.org/physiotherapy`. Every other schema value and visible clinical paragraph remains intact. No new identity is invented.

The repair requires the existing public-response/canonical/privacy guards, the physiotherapy request scope, a known tracking-only query, valid JSON and one of two exact captured payload fingerprints. Other pages, malformed scripts, unknown/functional queries and changed source payloads pass through. String splicing preserves numeric precision and all non-identity bytes. The source is idempotent.

## Source and checks

- Source commit: `a6bd1134d84d19a631cfa64a878e3c87535e6a02`, pushed to main.
- 57 focused schema/social runtime cases pass. New cases cover both exact scripts, campaign encodings, changed/foreign identities, no scope, malformed URL escapes and functional queries with clean canonical metadata.
- One read-only source reviewer identified the malformed-token and functional-query edge cases. Both were corrected and confirmed resolved; this is source review, not independently repeated test execution.
- Current live legacy baseline: `b215ba6e-d850-493f-9bf0-133f01ea7a16`; all 228 route records captured. The current Shop/Portal version is protected by the existing release guard.
- Live version: `46fa8ad2-f64c-47e1-a78b-db27d849b331`; deployment `828b9505-0332-47d4-803f-2631741f5017`.
- [Exact-source CI 37499537094](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37499537094) passed, including Ask build and hosted Firefox/WebKit.
- All four public before/after comparisons pass: ten scripts parse, only the intended self-reference strings differ, and visible clinical text, all links, telephone and enrolment destinations match.
- All 228 routes and legacy bindings are preserved; the other eight modules match the captured baseline. All five protected Worker versions remain unchanged, including current Shop/Portal, Ask and authentication owners.
- An initial read immediately after promotion received an old response. Fresh diagnostic and final acceptance reads passed without another code change or cache purge. Propagation is an inference, not a separately confirmed cause.

## Acceptance

Verify the canonical URL and three known campaign variants. All ten JSON-LD blocks must parse; only the two captured WebPage identities may change. Existing collection identity, visible text, telephone links and enrolment query selections must match the captured before state. Preserve every route, binding, unrelated module and protected service version. No new search submission is required for this follow-on identity correction.

Private live baseline and module capture: `ask-private/physiotherapy-identities-20261006/`. Release receipt: `deployment/physiotherapy-identities-20261006.json`. Public comparisons and CI evidence: `../../pinnacle-growth-system/physiotherapy-identities-20261006/`.

The website schedules remain deleted/disabled. A verified metadata repair does not establish indexing, ranking or qualified-lead gains.
