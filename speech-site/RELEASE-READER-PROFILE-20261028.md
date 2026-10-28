# Optional reader phone and location

The existing Google reader account gains an optional phone, city/town, PIN/postal-code and country step. Readers can save, retry or skip and keep their original library destination. Returning readers can edit details from the existing account menu. This does not create another identity store, enrolment or CRM lead.

Details are saved on the authenticated Supabase account under the server-owned `app_metadata.ask_profile` namespace. Each field records its source and update time. Google values confirmed by the reader and manual choices survive later imports. The existing `ask_reader.first_library` / `source_version` and WhatsApp verification receipt remain unchanged. An imported or manually saved number is not marked verified; verification reuses the existing WhatsApp path.

Google import uses a separate, explicitly initiated GIS token flow. The server checks token audience, the linked Google subject and expiry before reading only authorized phone/address fields from `people/me` with PROFILE source filtering. Tokens are not persisted or sent in URLs; contact lists, street address, precise location and child/clinical data are not requested or stored. Missing data, partial permission, denial and unavailable APIs leave manual completion and reading usable.

## Google configuration boundary

The existing PinnacleAsk project (`gen-lang-client-0074123614`) currently has People API disabled and no added phone/address scopes. `ASK_GOOGLE_PROFILE_IMPORT_ENABLED` must remain absent/false until the API, scopes and Google's applicable approval requirements are ready. Basic sign-in remains `openid email profile`. Manual completion works independently. The API Enable panel displays Google APIs Terms acceptance; the exact founder approval request is pending. Production import is not claimed from isolated tests.

## Acceptance and release

Focused local acceptance: 14 unit cases, 21 browser cases at 320/390/1440, and eight full composed-runtime cases with four isolated profile writes. The runtime cases include authenticated account binding, manual edits, imported provenance, retained source, no phone verification and both old/new immutable client assets. No production users, OTPs, leads or conversions were generated.

The publisher changes only three modules in the captured Ask Worker: the existing compiled auth chunk, two client references in its existing entrypoints chunk, and the existing reader-asset module extended to serve the new client while retaining the old client. All other workers/modules/routes/static asset bindings/settings remain captured and unchanged. Use `prepare-reader-profile.mjs`, then the established `release-asset-regressions.mjs` lifecycle with `--reader-profile`. Source, dependency/configuration and build-output hashes must match; publication requires merged exact CI source and a clean tracked tree. Record release/rollback IDs and public anonymous-session, gate/client and old-asset readbacks in the existing Mac artifact packet.
