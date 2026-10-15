# Centre directory release review — 15 October 2026

Scope: /centers narrative, conceptual illustration, metadata and source exports. Existing live branch enquiry pages, callback integration, directory choices, approved shared shell and all other routes stay outside this change.

## Review and disposition

One independent read-only reviewer inspected the source, validation receipt and phone/desktop hero and story captures. No release blocker. Two findings were addressed: the Jaya Nagar caption now sits at the photo top, clear of the count badge; Search/Call actions now follow the short lead, before the longer explanation. The owner inspected the affected captures after these fixes.

## Acceptance evidence

- Production page build; shared current Astro components reused.
- Chrome rendering at 320, 768 and 1440 pixels: no horizontal overflow, 62 listing cards, unique IDs, functional search, header/footer/Verify and callback present.
- Title, canonical, indexability, 12 FAQ entries, 62 ItemList entries and dated CollectionPage match the visible content.
- Conceptual family image generated/edited through the conversation built-in tool, full 2:1 image preserved, responsive WebP, lazy loading and descriptive alt text. Real location photographs and the existing reviewed 1200×630 social image retained.
- Evidence JSON/text/Markdown refreshed. Original directory reconciliation date retained; current source media/profile coverage reviewed 15 October.
- All image/style/script paths referenced in the page resolve in the scoped production build.

These checks establish implementation and browser behavior. They do not establish a real enquiry, ranking, indexing, AI citation, physical iOS/Safari acceptance or clinical outcome. Existing successful shared-system checks were not repeated.

## Reproduce

Run `node scripts/build-centres-page.mjs`, then `node scripts/validate-centres-page.mjs` from speech-site. Build compiles only this page; the validation captures the changed sections. The release script preserves the current captured Worker and full asset union, with live version guards before upload and deployment. Private checkpoint logs stay under ask-private/centre-directory-20261015.
