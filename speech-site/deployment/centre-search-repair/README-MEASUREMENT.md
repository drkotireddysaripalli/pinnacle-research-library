# Regional centre contact measurement · 5 October 2026

The four released legacy centre journeys had working phone/enrolment links but did not send the named `phone_link_click` and `enquiry_link_click` events used by the newer portal pages. The existing GTM container did not define either event at inspection.

`centre-measurement.mjs` adds one invisible script after a successful existing journey transformation for Kukatpally, LB Nagar, Labbipet and Anna Nagar. It reuses the page's existing `gtag` connection. All previous content, links, images, styles, Analytics/GTM/Ads tags and enquiry destinations remain unchanged. `entry.mjs` applies this module after the current centre transform. No other route is instrumented.

## Measurement contract

- A valid, unexpired `pinnacle-speech-analytics-v1` opt-in is required on **every click**. No default opt-in, new tag loader, consent UI, or automatic page-view event is added.
- This intentionally measures only the existing consented subset. First-time visitors who have not chosen analytics on a managed Pinnacle page are not measured by this bridge.
- GPC, unavailable storage/gtag, an Analytics disable flag, withdrawn/expired/future consent and a modern measurement panel all prevent the added events.
- Exact national phone targets send `phone_link_click`, representing a tap only. Existing centre-specific numbers remain untouched and are not included in this national-phone event.
- Known enrolment destinations send `enquiry_link_click`, representing navigation only. The existing enrolment handler alone dispatches `enquiry_accepted` following actual API acceptance; it already requires consent and is unchanged by this release.
- Event parameters contain a fixed centre placement label, generic `/centers` location/title, blank referrer and the existing GA4 destination. They exclude visitor-entered text, form fields, query parameters, ad IDs and clicked URLs.
- The module neither proves nor modifies consent behaviour of inherited legacy tags. It only governs its added contact events. Do not describe this narrow release as a site-wide consent audit or complete call attribution.

## Verification and release

Run the focused centre/measurement tests in `scripts/test-centre-measurement.mjs`, `scripts/test-measurement.mjs`, the four centre journey tests and `scripts/test-centre-media.mjs`. They use local mocks; never generate production Analytics events or fake enquiries to validate this bridge.

Use `release-centre-measurement.mjs upload|deploy|verify <receipt-directory>` with a fresh baseline captured from the live Worker. It preserves all 194 currently captured zone routes, existing bindings and the other four protected Workers, requires the exact source to be pushed before activation, and verifies deployed module bytes. The existing six source modules besides the entry remain byte-identical. The release receipt contains the current rollback version.

Receipt directory: `work/pinnacle-growth-system/regional-measurement-20261005/` in the parent website workspace. Before/after public checks cover the actual desktop/mobile origin variants, cookie/campaign/HEAD responses, 11 protected destinations and unchanged enrolment acceptance source. Removing the inserted script reproduces each local source fixture exactly, so this is not a visual or narrative redesign. No new indexing notification is required for an invisible measurement-only change.

Business outcome: enables observation of consented contact intent from these routes. Settled actual events, qualified calls, walk-ins and admissions must be measured separately; this change establishes none of those counts by itself.
