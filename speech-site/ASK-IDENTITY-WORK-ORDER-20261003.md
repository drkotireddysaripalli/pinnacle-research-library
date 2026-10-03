# Ask identity and acquisition integration

3 October 2026. Owner: this task. Current state is recorded immediately below; the subsequent preparation notes are historical.

## Current state: Google and WhatsApp verified; X enabled and live; Apple key pending

- Current Ask release: `ec0c862f-6232-481a-8573-96dba6a5d5f6`, source `ebd51050086d0fb51064bd06559203dabbf2d802`. CI run `37113904253` passed both checks and ask-build. The explicit provider allowlist is `google,x`; Apple and Microsoft are not advertised. The candidate binding value was checked before promotion. Public checks confirmed exactly Google/X controls, private no-store/noindex headers, native-form CSRF/PKCE redirects to the correct providers, exact Supabase callback, and the public Ask Account link. Receipt: `deployment/ask-x-public-check-20261003.json`. No X identity exchange or WhatsApp resend was performed. All 185 routes and the main/MCP versions were preserved. The first immediate read saw the prior version during propagation; the subsequent read at 09:45:33 UTC confirmed the new controls without another deployment.

- Previous account-entry release: `f70df7b3-a6a1-437b-83bf-47d209cb6f13`, source `a1b413aea8d1ee6941dd9741332d08b6d9ce228e`, CI `37113005303` succeeded. The shared Ask navigation exposes Account across home, topics and answers. The v6 page-cache namespace prevents older cached HTML from hiding it. Seven production checks passed; actual owner session still showed Account connected and WhatsApp number verified after release. Receipt: `deployment/ask-account-entry-v6-20261003.json`.

- Final runtime repair is live as `7a7301ef-186d-4dd7-b055-bf65c3bfc4f1`; CI run `37111659722` succeeded. The owner received the real WhatsApp code, entered it, and confirmed completion. Ask displayed “You’re connected” and “WhatsApp number verified.” A focused server query confirmed all six conditions: confirmed email, confirmed phone, Google identity on the same user, WATI receipt, receipt matching the current phone, and receipt matching its confirmation timestamp. No phone, email or user identifier is included in the public receipt. `deployment/ask-identity-production-checks-20261003.json` records that completed flow.
- Supabase Google and Phone are enabled. The signed Send SMS hook is enabled at the exact Ask endpoint. Six-digit codes expire after 360 seconds; phone confirmation is enabled and fixed test codes remain empty. The exact Ask callback is saved; IRWFA Site URL and existing returns are preserved.
- Common menu spacing is deployed to both main and Ask. Main version `c12d101b-99e5-4caa-9c60-cce30a56c8f3`; MCP version `5fc3a111-be9d-401e-9856-674534594d5e`. All 185 zone routes are preserved.
- Actual Chrome Google callback completed. The native POST failure was caused by `no-referrer`; `strict-origin` fixes it while retaining origin and CSRF checks. Hosted Chrome also reached Google through the native form. Commit `0608d1d`.
- The real phone request reached the signed hook, but Cloudflare rejected the request option `redirect: error` before WATI could be called. Local workerd reproduced the same error. Changed to `manual`, with non-2xx responses rejected and no credential forwarding. A new test runs the actual signed hook in Cloudflare's runtime using synthetic data and no external messages.
- Runtime repair and provider support are committed as `03d1577`. Sixteen auth/runtime tests and the Ask build pass; type check reports zero errors. Auth/runtime tests now run in Ask CI. See `deployment/ask-identity-providers-runtime-20261003.json` for promotion state. The real owner flow is now verified separately from those automated checks.
- The Account link is live in the shared Ask navigation following actual verification. Inspected at 320, 768 and 1440px with no overflow and a 44px target; desktop keyboard Tab reaches it. This is an Ask navigation change, not a redesign of SiteHeader or SiteFooter. Public answers, sitemaps, citations and machine exports remain accessible. Account pages remain private/no-store/noindex with no analytics or JSON-LD. Publication is recorded in the account-entry release receipt.

### Apple, Microsoft and X: current provider setup

The account code supports Google, Apple, Microsoft (`azure`) and X OAuth 2.0 (`x`), behind an explicit provider allowlist. Only enabled providers receive buttons or start OAuth; default remains Google. Confirmed email, trusted identity, PKCE and the same-user signed WhatsApp receipt remain required. Apple private relay email is accepted. Microsoft requests the email scope; X uses Supabase's own scopes.

All provider applications use `https://lyjwsaiqvgwyautowhlx.supabase.co/auth/v1/callback`.

| Provider | Inspected state | Next condition |
| --- | --- | --- |
| Apple | Separate primary App ID `org.pinnacleblooms.ask` and Services ID `org.pinnacleblooms.ask.web` registered; exact Supabase domain/callback saved; Supabase remains disabled | Dedicated key `Pinnacle Ask Sign In` is configured only for the new Ask primary App ID and prepared at final Register. Owner must Register, Download and provide the local .p8 path under the browser credential-creation rule. Then derive and securely install the Apple client secret, test the callback, enable the provider, and record its six-month renewal date. Existing BHCL apps and APNs keys are untouched. |
| Microsoft | MFA completed; Supabase disabled/empty; care account lists only Sri Venkateswara University directory | Owner identifies the Pinnacle/BHCL account or directory. Do not create a Pinnacle app under the unrelated university directory. Then inspect Entra app, audience, callback, email and xms_edov claims, and secret value. |
| X | Existing Pinnacle Blooms app 28323414 has saved exact callback, email request, BHCL organisation and policy links; owner-supplied secret saved; Supabase provider enabled with email required; live Ask button enabled | Production CSRF/PKCE start redirects correctly to X with users.email, tweet.read, users.read and offline.access. A completed actual X sign-in remains unverified. Existing homepage callback, OAuth 1 posting/DM permissions and confidential-client type preserved. No secret regenerated. |

Google consent branding currently names the shared IRWFA application; resolve this deliberately without interrupting IRWFA. Preserve existing X posting/DM integrations. No provider credential is fabricated, regenerated or published. Email one-time-code sign-in is the recommended later fallback after sender delivery is configured. Additional social providers do not themselves produce SEO rankings or AI citations.

Provider references: [Apple](https://supabase.com/docs/guides/auth/social-login/auth-apple), [Microsoft](https://supabase.com/docs/guides/auth/social-login/auth-azure), [X](https://supabase.com/docs/guides/auth/social-login/auth-twitter).

## Historical preparation record

## Outcome
Useful, source-linked answers build Pinnacle recognition and lead families to 9100 181 181, centres and enrolment. Preserve public crawlable answers, citations, machine exports and the common header/footer. Add a deliberate account journey with Google sign-in and WhatsApp verification on the same identity. Registration must never imply a clinical assessment, enrolment, marketing consent or guaranteed outcome.

## Finite work
1. Inspect existing accounts and reuse supported Supabase Auth; do not create a parallel OTP/password system.
2. Build a branded account page, Google PKCE callback, phone-change request/verification, sign-out and private session handling. Keep account endpoints out of sitemaps and public caches. Use the existing official Pinnacle assets; owner source folder: C:/Users/Siri Palace/OneDrive/Documents/Win/Logos.
3. Implement a signed Supabase Send SMS hook for WATI. Require a confirmed Authentication template, sender, token, rate limits and bounded timeout. Supabase verifies the code; a WATI acceptance response is not phone verification. No OTP, phone, email or child concern in general analytics/logs.
4. Preserve IRWFA provider settings, users, hooks and callbacks. Add only the exact Ask return URL after the flow is ready. Do not change the default IRWFA site URL.
5. Keep the public answer/summary/source/call journey accessible. Requiring sign-in for all human reading while allowing crawlers would be a separate, disclosed registration-wall decision with search implications; it is not hidden bot-specific output.
6. Release only after the actual configured Google/WATI flow passes same-user-ID verification. Test rejection, expiry, resend, cache isolation, redirects and phone/desktop rendering. Keep unfinished account entry points unadvertised.

## Current inspected state
- Ask content and its search/taxonomy are already in Supabase IRWFA (lyjwsaiqvgwyautowhlx), healthy. Cloudflare serves/caches it. No PlanetScale connection in the Ask Worker or current Ask repository layer.
- Google enabled; phone disabled. Site URL and only two allowed returns belong to members.irwfa.org. A separate speech staging project is not Ask production.
- WATI owner sign-in completed. Tenant 531 uses https://live-mt-server.wati.io/531 and connected sender +91 9100 181 181. Existing API credential successfully listed templates; no new WATI credential was created. Approved English Authentication template code_template_pbn_v3 has parameter 1, a Copy code button and six-minute expiry. Sender-specific template lookup also confirmed approval.
- Supabase has six existing Google accounts, no stored/confirmed/pending phones and no MFA factors. No existing Auth hook. Phone provider remains disabled and actual OTP expiry remains 60 seconds until coordinated activation sets 360 seconds. Existing site URL and returns belong to members.irwfa.org.
- Existing authenticated policies were reviewed without reading private member/messages content. Migration 20261003074425 now scopes notifications to existing IRWFA accounts or admins. All six accounts retain their entitlement; a synthetic new authenticated identity cannot read notifications or the private entitlement table. Unrelated policies were preserved. See supabase/ASK-IDENTITY-ACCESS-NOTES.md.

## Architecture decision
Use Supabase as Ask's single data/identity store and Cloudflare as the delivery/security layer. They perform different jobs, so removing either is not database deduplication. PlanetScale retirement requires a separate actual dependency/data inventory; Ask has no demonstrated PlanetScale dependency. No database is deleted, copied or shut down in this package.

## Sources
- https://supabase.com/docs/guides/auth/server-side/advanced-guide
- https://supabase.com/docs/guides/auth/phone-login#updating-a-phone-number
- https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook
- https://docs.wati.io/reference/sendtemplatemessage
- https://developers.google.com/search/docs/appearance/structured-data/paywalled-content

## Acceptance distinction
Code/build/mocked checks, provider configuration, actual OTP delivery, verified identity, live page release, indexing, AI citation, connected calls and admissions are separate states. No fabricated leads or third-party messages during testing.

## Prepared implementation and verification
- Request-scoped Supabase SSR sessions; Google PKCE callback; same-origin form/CSRF checks; phone-change verification on the same user ID; local sign-out.
- Verified WhatsApp completion requires a server-owned receipt matching the current phone and its confirmation timestamp. Existing SMS verification and client-editable metadata cannot assert WhatsApp completion.
- Signed, timestamp-checked WATI hook, explicit approved-template parameter mapping, user/phone rate limits, bounded provider timeout and generic errors. No OTP or contact data in application logs.
- Account and callback routes bypass every public cache and carry private/no-store, noindex/nofollow and no-referrer headers. Public answers remain available. Account routes are not linked or added to the sitemap while disabled.
- Pinned @supabase/ssr 0.12.7, @supabase/supabase-js 2.117.2 and standardwebhooks 1.1.1. Ask build and the main 86-page build passed. Eleven focused unit tests and five rendered HTTP/privacy checks passed. Rendered disabled-state/private-header checks are recorded in reviews/ask-account-local-20261003.json. Unchanged main-page generated reading exports were restored after the build; this package does not revise their content or dates.
- Desktop 1440px, phone 390px and tablet 768px inspected. Screenshots use synthetic, signed-out, disabled account state. They do not prove a real Google or WhatsApp flow.
- Read-only source review accepted the two verification-state corrections. No extra agents or account operations were required.

## Common-shell finding
The 768px visual inspection found therapy labels touching even though the document did not overflow. The common source src/styles/shared-shell.css now provides 12px inline padding for therapy titles at 601–900px. Confirmed visually at 768px. This is a prepared shared fix, not an Ask-specific copy. Release it coherently to the main portal and Ask; do not call it live until both targets are verified. Existing desktop and phone styles, text, authority tiles and full footer are retained.

## Activation configuration (no secret values in this file)
| Setting | Purpose |
| --- | --- |
| ASK_AUTH_ENABLED | Keep absent/false until the full flow is verified |
| SUPABASE_URL | Existing Ask production project |
| ASK_AUTH_PUBLISHABLE_KEY | Public/publishable client key, separate from the content-service binding |
| ASK_AUTH_SECRET_KEY | Server-only credential for the verified receipt; never sent to browser |
| ASK_AUTH_RATE_LIMIT | Cloudflare rate-limiter binding; required for requests and delivery |
| ASK_WHATSAPP_ENABLED | Keep absent/false before WATI verification |
| WATI_TENANT_ID | Observed tenant 531; verify account API endpoint before enabling |
| WATI_API_TOKEN | Existing authorized server-side API token |
| WATI_CHANNEL_NUMBER | Actual approved sender |
| WATI_TEMPLATE_NAME | Actual approved Authentication template |
| WATI_OTP_PARAMETER_NAMES | Exact JSON array of that template's OTP parameter names |
| SUPABASE_SMS_HOOK_SECRET | Server-side signature verification secret for this hook |

## Exact remaining work
1. Owner credential handoff: the Supabase Add Send SMS hook panel has HTTPS URL https://pinnacleblooms.org/ask/auth/whatsapp-hook and Enable OFF. Owner must Generate secret and Create hook, leaving it OFF. Do not paste the secret into chat. Browser credential-creation rule requires this owner action; existing WATI/Supabase credentials are already available privately.
2. Preserve IRWFA Site URL and existing returns. Add only https://pinnacleblooms.org/ask/auth/callback. Configure OTP expiry to 360 seconds with six digits and the signed HTTPS delivery hook; coordinate phone-provider enablement after the endpoint/secrets are staged. No existing phone/MFA delivery path was found.
3. Keep the account entry point unadvertised while testing. The test WhatsApp destination must be an owner-controlled number different from +91 9100 181 181; requested once and awaiting reply.
4. Set server-side secrets and rate-limit binding through the established deployment route. Confirm the real signed Supabase payload supplies sms.phone and the WATI response contract agrees with the implementation.
5. Exercise Google callback and one owner-authorized WhatsApp destination: delivery, same-user-ID completion, expired/invalid code, resend limits and logout. No real user list or third-party test messages.
6. Commit configuration references, release both shared-style targets with rollback and all routes/bindings preserved, verify actual account and public pages, then expose the account entry point. Do not submit private account routes for indexing.

## Dependency note
The audit reports an existing http-cache-semantics advisory through the current Astro/Cloudflare toolchain. The suggested automated major downgrade is not applied. Account routes explicitly bypass caches. Review the vendor patch separately; a passing account check does not resolve the upstream advisory.

## State
Prepared in source and locally checked. WATI settings and existing keys are confirmed; the narrow notification-access migration is live and verified. Authentication is not activated, advertised or deployed. No WATI message, user signup, provider-setting save, database retirement or route mutation was performed. The already-delivered public Ask release remains active.

## 3 October WATI follow-through
- Code now uses the approved template, sender and explicit parameter mapping; pending-code cookie expires after 360 seconds. Both feature flags remain false in the checked-in configuration.
- Cloudflare rate limiter is configured for eight requests per key per 60 seconds, with distinct operation/user/phone keys. This is a per-location limit, not a global send cap. Keep Supabase's central OTP/rate controls; inspect their current values at activation.
- Candidate rebuilt after these changes: 11 focused unit tests and five rendered disabled-state/privacy checks passed. Actual delivery, Google callback and same-user verification remain untested.
- Release runner now requires a unique release ID: node scripts/release-ask.mjs prepare ask-identity-release-20261003, then upload/promote with that same ID. Separate receipts and private snapshots preserve earlier rollback evidence. Never run prepare again with an already-used ID.
- The new private entitlement table intentionally has no client RLS policies or table privileges. Supabase advisor reports only an informational no-policy notice for this new object; its purpose is default denial. This is not a whole-project security clearance.

## Owner-approved activation candidate · 3 October 2026
- Owner created the disabled signed hook, supplied their own test destination and explicitly approved activation plus a verification test. The exact Ask callback is now saved; IRWFA Site URL and its two return URLs are preserved.
- The two runtime flags are enabled only for the unadvertised account verification release. Public account promotion still waits for actual Google and WhatsApp completion.
- Four existing credentials are staged as Cloudflare secrets on an unpromoted version. The staging script verifies unchanged code, assets and pre-existing bindings before recording the new candidate ID.
- The legacy portal validator now reads the independent owner-approved header fixture; it no longer contradicts the restored header. All 29 portal checks pass.
- Main and Ask builds are prepared from the shared tablet-spacing fix. No header wording, footer content or existing route is redesigned.
- Remaining: commit and CI, guarded Ask/main promotion, enable the prepared hook and six-minute phone provider, perform the one real verification flow, then record production evidence and actual state. Do not label OTP delivery as phone verification.
