# Shared reader registration source repair

## Purpose and source contract

Materials and Interventions were public libraries without the shared Google sign-up entry. Their main-site aliases still redirect to the existing subdomains. This repair adds a visible account action on both libraries, reuses `/ask/account` and the existing Google authentication, and returns the reader to the original library page. It does not migrate, gate or rewrite the library content.

New reader registrations always receive `ask_reader.first_library`: `ask`, `faq`, `sunshine`, `mirracles`, `materials`, `interventions`, or explicit `unknown` when no valid source exists. `source_version` is `20261025`. The first completed registration remains immutable on later session checks. Historical absent sources are not backfilled from subsequent browsing.

For the two external library entries, the public return context stays in the sign-in URL through reload and retry. Destinations are confined to the two existing library hosts. Navigation fallback and observed source remain separate, so an invalid return cannot fabricate Ask attribution. No query values or reading history are stored in the registration marker.

Existing Google profile, WhatsApp verification, account storage, forms, phone actions and analytics contracts remain. No phone/location fields, marketing subscription, new auth store, binding or credential are introduced.

## Scope

- Shared source helper: `src/lib/reader-source.mjs`.
- Existing auth endpoints and client: `src/lib/ask/auth.mjs`, `src/scripts/ask-reader.ts`, `ask-runtime/pages/ask/account.astro`.
- Both existing library response paths: `deployment/library-registration.mjs`, `deployment/materials-worker.mjs`, `deployment/interventions-index-root.mjs`.
- Reusable tests: `scripts/test-reader-source.mjs`, `scripts/check-reader-source-browser.mjs`; source checks join the existing `test:ask-auth` command.

## Verification and publication

Local isolated results: 62 source/auth tests passed; 26 Chromium cases passed at 390px and 1440px. They cover six sections, both Google credential and OAuth callback handlers, durable-marker request payloads, existing-reader returns, reloading the external-library entry, unknown inputs, existing historical markers, signup markup idempotency and unchanged library content. Provider calls and real registrations were not generated. The browser command accepts saved public Ask HTML plus an output directory and intercepts all external requests.

Mac Web Build remains the sole production publisher. Refresh current main and live Worker/module/route/asset/configuration preimages, run affected build/CI, then compose only the Ask/auth assets and the two library wrappers into their existing deployments. Retain old shared reader assets still referenced by Mirracles. The two library hosts require the helper to be included in their actual wrapper import graph; source presence alone is not deployment.

Live acceptance: both library roots and representative details expose exactly one signup entry; its existing account route reaches Google sign-in with the correct retained section and original return; anonymous session initialisation is available; no duplicate reader or fake production account is created. Check a subsequent genuine registration for `source_version=20261025` when one arrives. Keep native successful Google authorisation and genuine registration separate from isolated handler proof.

State at preparation: source ready, not yet a production release. The publisher records current source, CI, deployment/rollback IDs, live checks and remaining genuine-activity evidence in the existing delivery record.
