# Pinnacle Cloudflare origin-error diagnosis — 9 October 2026

## Result

**The reproduced failure is repaired in production. The portal rollout introduced a route-precedence regression.** New exact-host catch-all routes overrode existing wildcard-host API routes. Mirracle's staff/FAQ endpoints returned the React application HTML instead of JSON, and the www website-data endpoint reached an ASP.NET 404 instead of its API Worker. The legacy application attempted JSON deserialization and raised `Newtonsoft.Json.JsonReaderException: Unexpected character encountered while parsing value: <`.

All 23 original API route registrations were still present. Preserving their records did not preserve their effective routing. The new host-wide handlers used ordinary `fetch(request)` for unhandled requests; this reaches the DNS origin and does not dispatch to another same-zone routed Worker. This is an implementation error in the portal rollout, not evidence that PlanetScale itself failed.

The maintained original ASP.NET method implementations are still unavailable, so the exact internal outbound call was not captured. However, release-time response transitions, live incorrect API payloads, restored JSON after the route-only repair, and immediate recovery of all reproduced public failures establish the shared routing regression as the cause of this reproduced incident.

An additional confirmed migration gap exposed this legacy dependency: old short-ID Mirracles URLs are not resolved by the new library catalogue and fall through to the legacy origin. Duplicate FAQ pages also remain publicly served on d.pinnacleblooms.org and books.pinnacleblooms.org. Their tested pages now work again, but this does not finish migration or permit legacy-server shutdown.

Status: API ownership repaired and the six affected page/device requests verified on 9 October at approximately 04:46 IST. Configuration-only release: 42 explicit API/socket routes added, all 265 pre-existing routes unchanged, 307 routes after read-back. Source commit `29c13f9`. No Worker code, DNS, authentication rules, customer records, alert settings or crawl schedules changed. Other zone errors and complete migration remain separate work.

## Release correlation and repair proof

| Change | Actual recorded time (IST) | Observed API response transition |
|---|---|---|
| `mirracle.pinnacleblooms.org/*` assigned to privacy frontend | 7 Oct 23:29:35 | Staff/FAQ endpoints changed from data to HTML in the corresponding UTC hourly buckets |
| `www.pinnacleblooms.org/*` assigned to portal | 8 Oct 07:28:47 | Website-data endpoint changed from data to origin 404s in the corresponding UTC hourly buckets |
| Restore explicit registered API/socket owners on both hosts | 9 Oct 04:45–04:46 | Staff and FAQ endpoints again returned valid JSON; website-data endpoint returned a valid JSON array with the documented `type` parameter |

The repair restores only patterns already registered for those hosts, with the same original Worker and fail-open setting. It preserves the more-specific Mirracle WebSocket owner and leaves `/api/enrolment*` with the portal. The receipt records every original route, each added ID, final read-back and rollback IDs. Four focused planning tests passed; no frontend source build was needed for this configuration repair.

Authenticated read-only API validation retained only status, payload shape, byte count, hash and Ray ID. No returned staff records or credentials are retained in the verification receipt. Staff returned `People`/`Centers`; FAQ returned `Faq`/`All`. The website-data test used `type=centers&id=0`, returning `[]` and proving dispatch without exposing a centre record. An initial test omitted the required type and returned a non-JSON API response; the corrected contract check passed. No OTP, customer enquiry, call, payment or conversion was created.

### Public after-repair checks

| Previously failing page | Mobile after repair | Desktop after repair |
|---|---|---|
| www Mirracles old ID 2652 | 200, cache MISS, correct original page title, no exception fingerprint | 200, cache HIT |
| d FAQ: speech-therapy/parentworkshops | 200, cache MISS, correct original title, no exception fingerprint | 200, cache MISS |
| books FAQ: occupational-therapy/handling-non-verbal-children | 200, cache MISS, correct original title, no exception fingerprint | 200, cache MISS |

These are HTTP requests with phone/desktop user agents, not physical-device or TestingBot visual tests. All six are healthy in the targeted replay; five were failing before. This does not assert that every API operation or every site URL is tested, or that a settled post-release 24-hour error rate is already available.

Maintained receipt: [API route restoration](deployment/api-route-restoration-20261009.json). Full retirement checklist: [legacy migration inventory](LEGACY-RETIREMENT-INVENTORY-20261009.md).

## Alert email verification

Read the actual Cloudflare messages in the signed-in kotii@kgvpl.com Outlook mailbox, sender noreply@notify.cloudflare.com, subject `[Alert] HTTP origin errors detected for pinnacleblooms.org`.

| Received (IST, 9 October) | Cloudflare detection (UTC, 8 October) | Trigger |
|---|---|---|
| 02:03 | 20:29:28 | HTTP 500 |
| 03:40 | 22:06:28 | HTTP 500 |

The latest email links to the diagnostic interval 21:06–22:07 UTC (02:36–03:37 IST). In that interval the API reports 598 origin-500 request records: d host 347, www host 184, books host 67. This is the linked diagnostic hour, not a reconstruction of the proprietary alert threshold calculation.

Latest alert diagnostic view: https://dash.cloudflare.com/862998def1cd610fdb86b8e5c1d6ed4d/pinnacleblooms.org/analytics/traffic?date-from=2026.10.08-21:06&date-to=2026.10.08-22:07&origin-status-code~geq=500

## 24-hour measurement

Window: 7 October 22:47:38 UTC to 8 October 22:47:38 UTC; equivalently 8 October 04:17:38 IST to 9 October 04:17:38 IST. Counts are Cloudflare adaptive analytics estimates, not unique people or failed leads.

### Responses returned to external requests

Filter `requestSource: eyeball` excludes internal Worker fetch/cache records, but still includes crawlers and automated clients.

| Host | All external requests | HTTP 500 responses |
|---|---:|---:|
| www.pinnacleblooms.org | 354,222 | 21,500 |
| d.pinnacleblooms.org | 38,922 | 12,448 |
| books.pinnacleblooms.org | 30,390 | 1,478 |

Across the zone: 1,517,188 external requests and approximately 39,349 external 5xx responses (2.59%). Secondary failures include psapi (2,570 HTTP 503 and 282 HTTP 500), tvapi (611 HTTP 500), score (312 HTTP 522), and apex (40 HTTP 503). These have not been assigned the same root cause; they need separate targeted traces.

### Origin observations explaining the main failures

- www: 21,538 origin HTTP 500 records; 21,516 are Worker origin fetches and 22 are direct external origin records. They overlap the resulting external error responses and must not be added to them.
- `/mirracles/...`: 19,293 www origin HTTP 500 records, or 89.58% of www origin-500 observations.
- Requests whose user agent identifies as AhrefsSiteAudit mobile: 16,223 www origin errors, 75.32%. User-agent identity is not cryptographic bot verification. This establishes that mobile audit requests exposed many failures; it does not establish that Ahrefs created the defect or overloaded the server.
- d: 12,541 origin HTTP 500 records, including 93 Worker fetches; books: 1,478 origin HTTP 500 records.
- Internal `edgeWorkerCacheAPI` and `earlyHintsCache` 504 records are excluded from visitor-failure totals. No raw count across all request sources should be presented as visitor impact.

## Live reproduction, Hyderabad Cloudflare edge

Performed six read-only GETs around 9 October 04:21:42 IST. No customer form, login, call, payment or conversion was submitted.

| URL | Mobile user agent | Desktop user agent | Verified failure |
|---|---|---|---|
| https://www.pinnacleblooms.org/mirracles/2652/-eyecontact-hindi-369653-PBNDSX | 500, cache BYPASS | 200, cache HIT | `GetStaffandCentersData()` → `Views/Shared/_Layout-V9.cshtml:29` |
| https://d.pinnacleblooms.org/faq/english/speech-therapy/parentworkshops | 500 | 500 | `GetFaqs(lang, category)` → `faqpartialview.cshtml:7` → `FAQPage-V9.cshtml:785` |
| https://books.pinnacleblooms.org/faq/english/occupational-therapy/handling-non-verbal-children | 500 | 500 | Same `GetFaqs` exception |

The desktop video success was cached; it does not prove an uncached desktop origin render is healthy. Mobile failed freshly. All five failing responses exposed the ASP.NET exception and server template paths publicly.

Example failing Ray ID: `a478b631aef8b089-HYD` (www video, mobile). Full read-only reproduction headers and bodies are in the private evidence directory.

## Why existing repairs did not stop these alerts

1. The existing `public-mobile-recovery.mjs` calls the origin first, then retries as desktop only for a named list of public pages and matching error fingerprints. It can protect those responses but leaves the origin failure in the logs. It does not cover the Mirracles route family or d/books FAQ copies.
2. Live Cloudflare route read-back confirms `/mirracles/*` reaches `pinnacle-verify-route`. Its library handler returns null for an unknown numeric ID, handing that request to the legacy path.
3. The maintained 29,759-record catalogue lacks both old ID 2652 and its exact old URL. It contains similarly titled long-ID records, so equivalence must be established from source identity/video data before redirecting.
4. Of 33 Mirracles groups in the top-45 origin-error path result, 32 cannot be resolved by ID, canonical path or alias in that catalogue. This is a bounded sample of failing paths, not a count of every missing page.
5. d and books continue serving old FAQ copies. Main-host FAQ migration does not automatically replace those copies.

## Repair order and completion conditions

1. **Shared routing cause repaired.** Explicit API ownership is restored with verified JSON and recovery of the reproduced pages. The legacy parser's lack of graceful failure remains a resilience issue in unavailable ASP.NET source; migration should remove that dependency. Future host-wide route additions must preserve effective API ownership, not merely retain old route records.
2. **Finish legacy-ID coverage in one shared mapping.** Reconcile the old Mirracles identities with authoritative published video records; serve or redirect to verified equivalents with path/query preservation. Do not map by similar title alone or redirect everything to the library homepage. Completion requires the error-path inventory to resolve through the maintained handler, including the short IDs.
3. **Resolve duplicate-host public routes.** Establish which d/books public copies are still required, then route known equivalents to the maintained portal while preserving unrelated API, authentication, commerce and private routes. Completion requires old public URLs to have working intended destinations on both device classes.
4. **Close secondary API/timeout incidents separately.** Inspect psapi/tvapi/score paths and corresponding service errors; do not assume they share the ASP.NET fault.
5. **Verify once at the right boundary.** Replay the failing sample without creating business events, inspect the next comparable Cloudflare window, and use one bounded audit of affected families. Keep alerts enabled. Fewer alerts alone is not evidence of repair.

## Evidence and limits

Private evidence under `ask-private/origin-alert-20261009/`: `graphql-probe.json`, `graphql-details.json`, `graphql-correlate.json`, `config-readback.json`, `reproduction.json`, the six captured response bodies, `catalogue-coverage.json`, `api-timeline.json`, `api-response-type.json`, `api-restored-verification.json`, `restored-pages.json` and the before/after route receipt. Do not publish protected API source, credentials or returned operational records.

The Cloudflare read-back used the existing authorized deployment session. HTTP analytics and route reads succeeded. Alert-policy API read returned 403, so no exact policy sensitivity is claimed. The actual alert emails establish enabled detection and triggering status. No Windows/IIS application logs or outbound HTTP trace from the legacy origin were available in this pass.

Reference for origin traffic alerts: https://developers.cloudflare.com/notifications/reference/traffic-alerts/
Reference for Worker subrequest distinctions: https://developers.cloudflare.com/analytics/account-and-zone-analytics/analytics-with-workers/
Reference for route matching and same-zone fetch limitations: https://developers.cloudflare.com/workers/configuration/routing/routes/
