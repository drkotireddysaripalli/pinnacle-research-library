# Ask identity and acquisition integration

3 October 2026. Owner: this task. Current public Ask release remains 2dd39a2f-4f2b-43a9-80b5-a1ab7b3800f1.

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
- WATI tenant 531 at pinnacle.wati.io opens login. Google account popup cannot be completed through browser input; owner asked to finish sign-in. No WATI token/template/sender has been inspected or configured yet.
- Existing authenticated policies inspected without reading members or private messages. Broad notifications-read policy needs scope review before cross-application identity is expanded. Do not edit unrelated IRWFA policies opportunistically.

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
1. Complete WATI owner sign-in (requested once). Read the account's actual API endpoint, approved Authentication template, sender and parameter mapping. Do not guess or substitute a marketing template.
2. Resolve shared-project access scope before exposing new Ask signups: the existing authenticated notifications policy has a broad read expression. Preserve IRWFA's users and functions; do not widen access or silently modify its unrelated policies.
3. Confirm existing phone/MFA use before setting the project-wide Send SMS hook; the current Google-only hook must not interrupt another application's delivery path. Preserve the IRWFA Site URL and allowlisted callbacks, adding the exact Ask callback only.
4. Set server-side secrets and rate-limit binding through the established deployment route. Confirm the real signed Supabase payload supplies sms.phone and the WATI response contract agrees with the implementation.
5. Exercise Google callback and one owner-authorized WhatsApp destination: delivery, same-user-ID completion, expired/invalid code, resend limits and logout. No real user list or third-party test messages.
6. Commit configuration references, release both shared-style targets with rollback and all routes/bindings preserved, verify actual account and public pages, then expose the account entry point. Do not submit private account routes for indexing.

## Dependency note
The audit reports an existing http-cache-semantics advisory through the current Astro/Cloudflare toolchain. The suggested automated major downgrade is not applied. Account routes explicitly bypass caches. Review the vendor patch separately; a passing account check does not resolve the upstream advisory.

## State
Prepared in source and locally checked. Authentication is not configured, advertised or deployed. No WATI message, user signup, database migration, provider setting change, database retirement or route mutation was performed in this identity package. The already-delivered public Ask release remains active.
