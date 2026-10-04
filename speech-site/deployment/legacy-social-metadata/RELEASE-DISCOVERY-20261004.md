# Reconnect the existing physiotherapy navigation — 4 October 2026

Action `WEB-LEGACY-INTERNAL-DISCOVERY` / `4b873988-d047-41ed-baac-2101d37ef676`.

## Findings and decision

Ahrefs main project 10477823 reported 7,019 indexable orphans in its 06:11:18 UTC crawl. The configured 10,000-internal-page ceiling, excluded Ask/Verify sections and absence of JavaScript rendering limit its incoming-link graph. It is not a verified inventory of 7,019 genuinely disconnected public pages. Reuse that snapshot; no new broad crawl or paid query is needed.

The public `/services` alias already redirects to `/top-autism-therapy-services-india-proven-improvement-rate`. That hub and the approved portal navigation already link to `/physio-therapy`. This alias returns the same physiotherapy page as `/physiotherapy`, but declares `https://d.pinnacleblooms.org/physio-therapy` as its canonical. The services hub similarly declares the books subdomain as canonical and social identity. These are concrete competing identities on an existing visitor path.

The two sampled staff profiles are not linked from the current 241-profile directory and contain dated employment-status notices. Do not manufacture current-practitioner discovery links from their sitemap presence. Preserve the directory and individual profiles for the separate staff review.

## Bounded repair

1. Redirect HTTPS GET/HEAD `/physio-therapy` and its trailing-slash variant on www to `/physiotherapy` with 301. Keep query strings; ordinary browser fragment inheritance keeps existing `#why-section` links useful. Other methods, paths, authorization and range requests retain origin behavior.
2. On the exact services hub, replace only its observed books-host canonical/social pair with the current www HTTPS self identity. Existing HTML/response guards must pass. Unknown metadata or protected responses pass through.
3. Point that hub's existing physiotherapy link directly to `/physiotherapy`, preserving the wording and design. No new advertising, service-availability or staff claim is introduced.

The managed Astro common-header/footer source remains untouched. Its existing Physio Therapy link becomes functional through the shared alias redirect. No page redesign, migration, asset replacement or full Astro rebuild is required. Both physiotherapy URLs have identical body content after normalising their self-reference URL strings and Cloudflare analytics injection; section IDs agree.

## Release

Existing Worker `pinnacle-legacy-social-metadata`, with the earlier FAQ debug and social corrections preserved. Baseline/rollback version `e4b76e81-3f83-4710-9699-74027cb335a5`. Add only `www.pinnacleblooms.org/physio-therapy*` and `www.pinnacleblooms.org/top-autism-therapy-services-india-proven-improvement-rate*`; runtime admission remains exact and unknown wildcard neighbours pass through. Preserve all 191 existing route records, five binding sets, and four other application versions. Total expected routes: 193.

`release-discovery.mjs prepare|upload|deploy|verify <absolute-receipt-folder>` captures the current source and guards each release. Upload requires committed, pushed source. Rollback removes only the two new route IDs recorded in the receipt and restores the baseline Worker version; do not remove or replace existing routes.

48 focused runtime tests passed, including exact alias/query behavior, protected requests and neighbours, services identity/link-only edits, previous FAQ debug removal and metadata guards. Public before/after HTML must differ only where specified; browser checks cover the real menu-to-page destination and inherited section anchor. A bounded Screaming Frog list verifies the repaired path. IndexNow is a change notification, not proof of indexing, ranking, AI citation or leads.

This repair does not resolve every audit orphan, legacy schema self-reference, content claim or visual issue. Record remaining services/physiotherapy structured-data HTTP identities for the later source/template migration; avoid claiming full SEO completion.

Main-workspace evidence: `work/pinnacle-growth-system/internal-discovery-20261004/`.
