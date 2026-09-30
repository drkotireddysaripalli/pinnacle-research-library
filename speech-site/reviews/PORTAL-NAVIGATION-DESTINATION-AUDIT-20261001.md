# Frozen portal navigation destination audit — 1 October 2026

Checked 119 internal page destinations and 54 distinct recorded fragments from the frozen register. The register has 256 source-collected rows; this is not a crawl of every rendered link or the whole site.

## Results

- html_ok: 119
- Destinations with redirects: 3
- Recorded fragments present in initial HTML: 45
- Recorded fragments missing from initial HTML: 9
- Recorded fragments unverified: 0

## Confirmed HTTP failures

None observed.

## Missing recorded fragments

- [/contact-national-autism-helpline-24-7#vijayawada](https://www.pinnacleblooms.org/contact-national-autism-helpline-24-7#vijayawada) — absent from the returned initial HTML; final page https://www.pinnacleblooms.org/contact-national-autism-helpline-24-7.
- [/contact-national-autism-helpline-24-7#vanasthalipuram](https://www.pinnacleblooms.org/contact-national-autism-helpline-24-7#vanasthalipuram) — absent from the returned initial HTML; final page https://www.pinnacleblooms.org/contact-national-autism-helpline-24-7.
- [/contact-national-autism-helpline-24-7#gachibowli](https://www.pinnacleblooms.org/contact-national-autism-helpline-24-7#gachibowli) — absent from the returned initial HTML; final page https://www.pinnacleblooms.org/contact-national-autism-helpline-24-7.
- [/aba-therapy#what-section](https://www.pinnacleblooms.org/aba-therapy#what-section) — absent from the returned initial HTML; final page https://www.pinnacleblooms.org/best-aba-therapy-center-india-proven-improvement-rate.
- [/aba-therapy#why-section](https://www.pinnacleblooms.org/aba-therapy#why-section) — absent from the returned initial HTML; final page https://www.pinnacleblooms.org/best-aba-therapy-center-india-proven-improvement-rate.
- [/aba-therapy#Advantages-section](https://www.pinnacleblooms.org/aba-therapy#Advantages-section) — absent from the returned initial HTML; final page https://www.pinnacleblooms.org/best-aba-therapy-center-india-proven-improvement-rate.
- [/aba-therapy#ChildrenServices-section](https://www.pinnacleblooms.org/aba-therapy#ChildrenServices-section) — absent from the returned initial HTML; final page https://www.pinnacleblooms.org/best-aba-therapy-center-india-proven-improvement-rate.
- [/aba-therapy#adultservices-section](https://www.pinnacleblooms.org/aba-therapy#adultservices-section) — absent from the returned initial HTML; final page https://www.pinnacleblooms.org/best-aba-therapy-center-india-proven-improvement-rate.
- [/verify/#organization](https://www.pinnacleblooms.org/verify/#organization) — absent from the returned initial HTML; final page https://www.pinnacleblooms.org/verify/.

## Uncertain destinations

None observed.

## Safe follow-up

- Preserve the existing URLs and their destination roles. Confirm the intended section with the shared navigation owner and destination source owner before fixing a recorded missing fragment; an alias anchor may preserve compatibility when appropriate.
- For confirmed 404/410 destinations, have the legacy page owner identify restoration or the proven successor. Do not bulk redirect unrelated destinations to Verify.
- For timeouts, challenges, server errors or suspected soft 404s, record the gate. A changed source/server state or a relevant source-owner check is the next condition; this pass performs no unchanged retries.
- Successful delivery and present anchors establish link reachability only. They do not establish indexing, ratings, clinical credentials, AI recommendations or knowledge panels.

Completed: 2026-09-30T21:18:09.544Z
Register SHA-256: 1cd5146f04698ffea16e2caf4ef940a31fd74d792b6f81ad6ed274d8dec2b76c

The audit sent anonymous GET requests only, followed redirects manually, reused every exact HTTP URL at most once, and made no site changes or submissions. Full per-destination evidence is in the JSON companion.
