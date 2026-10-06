# Campaign, schema and enrolment completion — 6 October 2026

## Delivered result

Campaign landing pages retain their incoming tracking parameters while sharing clean HTTPS canonical, Open Graph and repaired navigation/schema identities. The captured physiotherapy CollectionPage now parses and uses its canonical identity. The existing exact www/mobile `/enroll` redirects preserve the incoming therapy and centre query, so official `service`/`centre` choices reach the live form.

The offline growth evidence profile uses the newest completed Ahrefs crawl per project, retains newer incomplete attempts separately, and explicitly compares crawl dates with release dates. It reuses saved Ahrefs, GSC, Screaming Frog, queue and Windsor evidence without another provider query.

## Source and deployment

- Shared campaign source: `d8b82d67b01709f105385ba199cf65ef623ab808`.
- Exact physiotherapy source: `a02a5802d5bbcb975c8fc6b1163f0ccaf7729d65`; Portal quality run `37484073703` succeeded.
- Live metadata Worker version: `b215ba6e-d850-493f-9bf0-133f01ea7a16`, deployment `2346b23a-fd5f-404b-b9ff-7f6b01fe6b68`; rollback `b787435a-7f7b-4c05-b44b-3a7d89a4cba0`.
- 228 routes, bindings and all nine deployed module hashes verified. Five protected Workers unchanged. Approved common header/footer unchanged.
- Cloudflare's existing `centers` bulk list `42d1bd24721b4d5d807eecd8cd641391`, under enabled `ALL CENTERS` rule `2fe3b1e2c4b54546b317934a0260fd1e`: only the two exact enrolment entries had Preserve query string enabled. Source/target,301 status and other flags were retained. No replacement redirect rule was added.

## Acceptance

- 56 focused schema regressions passed, including exact captured source, unknown-source bypass and preserved source description/images.
- Cloudflare accepted a targeted purge of 17 exact cached variants. Eight campaign URLs then passed HTTP200, clean canonical/OG, zero known broken navigation targets, zero invalid JSON-LD and preserved call links.
- Four physiotherapy variants each parse all 10 JSON-LD scripts; the repaired CollectionPage retains its description/images and canonical identity.
- Six enrolment URLs return200 at their intended final page with query parameters preserved, including the mobile hostname and trailing-slash/control cases. Browser read-back confirms Autism/Kukatpally and Speech/Suchitra selection through `/enroll`. No real enquiry was submitted.
- The initial enrolment propagation failure is retained alongside the later passing evidence.
- Eight offline evidence-profile tests passed. The report reused 61 saved sources and 54 existing queue records. Main90, Ask96 and Verify100 are dated completed baselines that predate the final releases; they are not post-release clearance.
- GSC annotation `06f482e1-68c4-46b3-bb11-0d0ec86b311d` records the campaign/schema change once. Unchanged and tracking-variant URLs were not resubmitted.

Operational evidence: `work/pinnacle-growth-system/ecosystem-review-20261006/` in the owner workspace. Key receipts: `campaign-completion.json`, `campaign-cache-purge-ui.json`, `campaign-post-purge.json`, `physiotherapy-schema-live.json`, `enroll-shortcut-final.json`, `enroll-rule-before.json`, `enroll-rule-after.txt` and the two browser selection records. The portable setting snapshot is `deployment/enroll-query-20261006.json`.

## Practical limits and next actions

This closes the bounded campaign/cache/CollectionPage and enrolment-shortcut defects. It does not claim every schema identity or every Ahrefs issue is fixed. Two other valid legacy physiotherapy WebPage scripts retain old identity values; use their exact captured source for any follow-on repair. Match intermittent500s with the actual owning failure before changing an unrelated Worker.

Qualified calls, walk-ins and completed admissions still need the receiving operation's aggregate outcome source. Pitchbox has one earlier sent message and no verified new placement. Current sitemap submissions need subsequent crawler/index evidence. The privately verified497-file Shopify source is available for implementation; intake alone is not a deployed shop redesign or measured sales.

Schedulers remain deleted/disabled. Direct work has one accountable owner; no standing agent swarm or new whole-site crawl was started in this completion pass.
