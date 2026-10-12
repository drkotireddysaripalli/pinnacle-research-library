# Shared public announcements

The website owner controls one active public announcement through the isolated `pinnacle-site-announcements` configuration namespace. There is no public write endpoint and no scheduler.

## Navratri approval

- Pinnacle Navratri 2026 Offer: regular ₹25,999/- struck through; ₹14,499/- prominent.
- One full month of **one** ST, OT, BT or SE service; services are not bundled.
- Only for the first 4,999 kids and families in total. Care confirms eligibility and remaining availability. This is a global limit, not a separate quota for each centre.
- The founder confirmed the monthly offer cutoff on 12 October: **25 October 2026, 11:59 pm IST** (`2026-10-25T23:59:00+05:30`).
- Cannot be combined with other promotional discounts. The separate ₹4,999 paid-plan discount is a different offer and is not subtracted from ₹14,499.
- Native central call: `tel:+919100181181`.
- Terms: `https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india#navratri-one-service-month-offer`.
- Enquiry: `https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india?offer=navratri-one-service-month-2026#enrolment-form`.

## Presentation and coverage

A normal-flow announcement bar appears before the existing header. It never opens a modal automatically. Details opens the native keyboard-accessible dialog; Escape and Close restore focus. Dismissal lasts for the browser session and announcement revision. This functional choice stores no personal information and is independent of analytics/advertising preferences.

The same implementation serves public portal, Ask/FAQ/Sunshine and legacy-topic HTML. Existing bodies, headers, footers, route assignments, authentication, intake, payment and consent systems remain owned by their existing handlers. A duplicate-response marker prevents double insertion through service-bound Workers.

Payment/account/private-report routes, non-HTML responses, downloads, authorization/range requests, Verify evidence and the two recorded location-status pages are excluded. A centre enquiry retains the known centre ID; unknown centre/service/clinical preferences are not inferred.

## Protected operational commands

Use the existing project Node runtime and Cloudflare OAuth login:

```text
node scripts/control-site-announcement.mjs --read
node scripts/control-site-announcement.mjs --disable --expect-id navratri-one-service-month-2026
node scripts/control-site-announcement.mjs --enable --expect-id navratri-one-service-month-2026
node scripts/control-site-announcement.mjs --publish src/data/site-announcement.json --expect-id navratri-one-service-month-2026
```

Publishing another approved announcement changes the one configuration record; copy, prices, navigation and dates do not require a new component or page rebuild. Blank price/limit strings are supported for non-price announcements. Use a new ID/revision so old dismissals do not suppress new content. Keep the central number and same-origin links. Publishing unrelated content does not authorize unsupported claims, pricing or expanded data collection.

Writes are read back through the protected API. KV changes can take up to 60 seconds to propagate between network locations; visible pages recheck once per minute and on return to the tab. Automatic expiry is also checked on every server response and timed in the browser using the server clock. Manual stop also removes the monthly section and its offer label from new Enrolment responses. Neither path invents a remaining-places count; care supplies the capacity decision.

Full logs/checkpoints stay under `outputs/site-announcement-20261012` and `ask-private/site-announcement-control`. Fixtures intercept external analytics and intake; they create no production enquiries, calls or purchases. Local Windows Chromium and Linux CI Firefox/WebKit coverage are recorded separately from TestingBot, physical devices and real outcomes.
