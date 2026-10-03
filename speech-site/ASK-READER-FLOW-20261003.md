# Ask reader flow — 3 October 2026

## Current owner instruction
One Google sign-in overlay on Ask pages. Sign in, continue on the same answer or topic, show the Google profile in Ask navigation, and allow logout. No separate account journey, WhatsApp step or provider chooser. Shared SiteHeader and SiteFooter remain unchanged. The earlier identity work order is historical except for its account-security and provider-maintenance notes.

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
Pending the single current build/release and public/browser read-back.
