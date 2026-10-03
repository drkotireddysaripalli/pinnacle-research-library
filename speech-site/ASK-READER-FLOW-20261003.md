# Ask reader flow — 3 October 2026

## Current owner instruction
One Google sign-in overlay on Ask pages. Sign in, continue on the same answer or topic, show the Google profile in Ask navigation, and allow logout. No separate account journey or provider chooser. The owner's later 3 October instruction adds optional WhatsApp verification inside a modal reached from the profile. It is not required for reading. Profile Call/WhatsApp actions require it; existing page contact CTAs remain direct. Shared SiteHeader and SiteFooter remain unchanged. The earlier identity work order is historical except for its account-security and provider-maintenance notes.

## Implementation
- All Ask HTML pages use the same AskGate and AskNavigation components.
- Full article text, citations and metadata are server-rendered for every user agent. No crawler detection or user-agent content switching. Google registration-wall markup identifies `.ask-registration-content`; free registration uses `isAccessibleForFree: false` under Google's documented convention. Public Markdown/JSON, MCP and sitemaps stay available.
- `/ask/auth/session` validates Supabase identity on the server and returns only name/avatar and CSRF. Private/no-store/noindex on every auth response. No email, profile, tokens or personalised cookies in shared HTML.
- Native Google forms use PKCE, exact same-origin validation and CSRF. Private cookies are secure, HttpOnly and restricted to `/ask`. Return validation supports answer, topic, Telugu, query and pagination paths but rejects external locations and authentication loops.
- `/ask/account` redirects back to the reader's page. Public provider allowlist is Google. Existing Apple, X, Microsoft preparation and WATI remain available for later deliberate use, outside this reading flow.
- The existing Supabase auth user record is the registry; `app_metadata.ask_reader.registered_at` is written server-side on first validated Google use. Existing email, Google identity/name/photo and account ID remain on that same record. There is no duplicated database, reading-history collection, new marketing consent or IRWFA entitlement.
- Admin-only registry query (Supabase SQL editor):

```sql
select id, email, raw_app_meta_data->'ask_reader' as ask_registration,
       created_at, last_sign_in_at
from auth.users
where raw_app_meta_data->'ask_reader'->>'registered_at' is not null
order by raw_app_meta_data->'ask_reader'->>'registered_at' desc;
```

## Bounded acceptance
1. Anonymous phone/desktop overlay: Google only, no horizontal overflow, modal focus, retry when auth unavailable.
2. Real existing Google session: profile shown, same-page navigation remains signed in. Logout locks reading again; a fresh Google start returns to the original answer/topic.
3. Public HTML and private session cache separation, correct registration schema, full answer and source/export access.
4. 19 focused auth/runtime tests, source type check, Ask build. Native browser check plus HTTP production receipt; do not label OAuth redirect alone as completed sign-in.
5. Commit source, upload then promote Ask only. Preserve exact 185 routes and current main portal/MCP deployments. Save rollback/candidate/public read-back.

## Limits
This is a registration gate for the reading interface over intentionally public content and exports, not access control for confidential material. Crawling, indexing, ranking and AI citation remain separate outcomes. Google OAuth currently uses the pre-existing shared IRWFA consent application; rebranding or separating that application is a separate deliberate change.

Source: https://developers.google.com/search/docs/appearance/structured-data/paywalled-content

## Release receipt
Live and verified: Ask Worker 136f6b1f-d8a3-450b-b616-60af225ad07f, source bb2861fa39cdbf9c25bcb36dce19bbfb8220768c. CI 37119531935 passed both jobs. All 185 exact routes and current main/MCP versions were preserved. Actual native Chrome Google sign-in, original-answer return, photo/name display, logout, browser-back and signed-in topic navigation passed. Phone 320px, tablet 768px and desktop views were inspected for this flow. Supabase records one Ask reader from the approved owner test, with its existing WATI receipt preserved. No physical-device or Safari testing is claimed for this bounded change. Public, browser and guarded release receipts are saved under deployment/ask-google-reader-*.json.

## 3 October follow-up: Pinnacle branding and discoverability
- Desktop sign-in is a white two-column panel: official Pinnacle Blooms Network emblem/wordmark and Ask purpose at left; Google sign-in and privacy at right. Mobile stacks the same content with compact spacing.
- Google button uses the official image from https://developers.google.com/static/identity/images/g-logo.png (retrieved 3 October 2026), not a redrawn Google mark.
- Failed/cancelled callbacks return to the same Ask reading gate; no session is created from an error. Back navigation revalidates before unlocking. Unit test added; 20 tests pass.
- Every answer now advertises its complete Markdown and JSON representations with rel=alternate, and its visible question, direct answer and supplied citations are mapped into the page graph. This is schema.org descriptive markup, not a promise of Google Q&A rich results.
- Registration-wall markup and public SSR content remain consistent for all user agents. Overlay/profile UI use data-nosnippet. Full text, sources, canonicals, language links, sitemaps and MCP remain available.
- Branded panel and answer metadata are live in Ask Worker `87217a36-ce64-4575-bff5-430c597db4f7`, source `94f39c2`. CI `37120701864` passed both jobs. Live HTTP checks passed; desktop and 390/320 px panels visually inspected. 320x640 uses a small internal vertical scroll; no horizontal overflow, sign-in action visible. All 185 routes and main/MCP versions preserved.

## Dedicated Google identity and profile follow-up (source complete; release receipt controls live status)
- Owner approved Google policy acceptance and then exact client activation/review. PinnacleAsk project `gen-lang-client-0074123614` now has the saved official emblem, name `Ask Pinnacle · Pinnacle Blooms Network`, Ask homepage, privacy and terms. Google web client `562897376075-uk7a8vqmudls29rl46l96r6e5n92kn3o.apps.googleusercontent.com` is created for apex/www origins; app publishing status is Production.
- Supabase Google client IDs now retain the IRWFA client first and append the Ask client. The existing OAuth secret was not edited; nonce checking remains enabled. GIS uses only the Ask public client ID, not its unused generated secret. No new scopes beyond name/email/photo.
- Ask's official Google-rendered button obtains an ID token, posts to the existing same-origin server, and exchanges through Supabase. A 10-minute secure/HttpOnly challenge is hashed for Google; Supabase validates the original nonce and signature. Preflight binds the exact Ask audience, issuer and expiry. Public HTML contains neither nonce nor user identity. Failed/cancelled flows retain the gate.
- Google automatic brand verification reported homepage ownership missing for `s.kotireddy@gmail.com` (delegated Search Console access). Owner identified `pinnacleblooms@gmail.com` as verified owner and authorized using it. Chrome disconnected during account switch. A Wrangler DNS read lacked permission; no DNS record was changed. Do not claim logo review accepted. Resume using the verified owner's browser session, not by changing IRWFA or repeatedly submitting unchanged verification.
- Profile panel: Google photo/name, grey unverified tick, magenta tick only from `registrationComplete(user)` (server WATI receipt), Get Verified, Call Pinnacle, WhatsApp Pinnacle, Log out of Pinnacle. Badge means WhatsApp number verified, not professional qualification or external endorsement.
- Verification stays on the current page: country-code phone input, clear WhatsApp-code consent, six-digit code with six-minute expiry, retry/change-number/cancel. Cancel closes without launching a contact action or granting a badge. No marketing subscription is inferred.
- Profile contact actions are validated server-side and return only the fixed Pinnacle tel/WhatsApp URL after verification. Page-wide public phone links remain directly available. Existing Apple/X/WATI setup is preserved.
- Checks: 28 auth/runtime/controller tests; source typecheck 0 errors (115 files); Ask build passes. Four deferred-response tests cover cancel during verification, session refresh, contact launch and cancel/reopen with a pending phone mutation. Pending phone mutations remain serialized after dismissal. New GIS login, new profile and optional verification modal must be checked in a connected browser before reporting end-to-end completion. Previously completed WATI owner verification remains valid evidence for the delivery backend, not for this new modal.
- Chrome reconnected. Search Console confirms pinnacleblooms@gmail.com is the verified domain owner; that account does not yet have access to the PinnacleAsk Cloud project. Editor grant is prepared for this project only and awaits the browser-required access confirmation. No IAM change has been submitted at this source revision.

Official implementation references: https://supabase.com/docs/guides/auth/social-login/auth-google and https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid .
