# Ask answer experience · 3 October 2026

## Delivered presentation and data

The shared answer template now starts with each answer's original 1200 × 630 QR card at full width, without cropping. That exact URL remains its Open Graph image. The full explanation follows as readable HTML with stable headings, a short answer, dates, source references, matching FAQs and citation/share controls.

The answer reading area is black and white. Common Pinnacle header/footer, navigation, contact controls and original branded images retain their colours. No common-shell source was changed in this release.

Supabase supplies actual published, public, same-language relationships: primary facets, explicit lenses, directly related/also-asked questions and exact-entity question collections. The reading paths group these into the subject, support, everyday life, progress and care choices where records exist. Explicit relationships rank first; exact-entity candidates use existing audience/domain/age relevance. General questions rank ahead of condition-specific variants for a general source. Duplicate/current answers are excluded. Three questions show initially per path, with up to twelve available through a disclosure and the full topic collection linked.

The OT example has 33 connected questions in five paths and ten taxonomy links. Other answers adapt to their available relationships, rather than showing invented or empty groups. The same question paths appear in visible HTML, ItemList structured data, Markdown and JSON.

Contextual service, assessment, centre, PinnacleAI, Verify, call and service-prefilled enrolment links connect knowledge to a useful next step. Verification Cancel is now a text action beside Privacy. Google/profile/WhatsApp verification logic is preserved.

## Supabase implementation

- Applied public-navigation and reading-path migrations in this source tree.
- Preserved public/private/published/same-language gates; no private profile data exposed.
- No direct public execute grant on the nested helper.
- Used existing entity and answer indexes; removed an unnecessary references query for empty resources.
- Complete representative OT answer RPC measured 187.03 ms in PostgreSQL, which is not an end-to-end page-speed result.
- No embedding/API-model call, inferred medical profile or newly generated medical answer was added.

## Code and release

- Content source: `974a079ac5188cb2d0f36b6fab2d332a327a6a63`.
- Type correction: `5b85289`; 119 files checked, zero errors. Its rebuilt Worker and CSS hashes match the content release exactly.
- Cache correction source: `bea21a1efc712605c38eb45cd3d918e3784144a0`.
- Initial production Worker: `cc1b6130-88f6-473d-a73c-0ad1f348d8e2`.
- Cache-corrected production Worker: `c57ef23a-0baf-47f7-a61e-eb26b2376ef3`, activated 2026-10-03T14:43:50.640Z. Final guard/activation receipt: `ask-answer-cache-v15-final-20261003.json`.
- All 185 Cloudflare route mappings, 21 Ask bindings, main portal Worker and Ask MCP preserved.
- CSS: `/ask/_assets/_..BJmoCMHv.css`, 165100 bytes, SHA-256 `7f35659ae6a6210b7ccbd9c168109b3e12b27e95e7133947729d0ed7e2ccf166`.
- Existing complete v14/v15 receipts keep rollback IDs; no narrow route deployment.

## Verification

- Local and production: four representative answers, 31 destinations, unique IDs/anchors, hero/OG identity, complete text, visible/schema FAQ and ItemList parity, same-language deduplicated paths, service-prefilled enrolment, 404.
- Production anonymous/session/OAuth-start checks: private session no-store/noindex, identical public answer content with/without session cookies, CSRF rejection, Google-only entry, public JSON/Markdown and 478 topic-sitemap URLs.
- Responsive Chrome inspection: 320, 390, 768, 1024 and 1440 px across changed sections. Final monochrome view inspected at phone/tablet/desktop; live 1440/390 reading-path screenshots saved. No horizontal overflow observed. This is not a claim of physical-device or Safari validation.
- Share citation reported a successful copy with access date; browser clipboard readback was empty, so clipboard contents are not independently confirmed.
- Source CI run `37129432744`: Ask build/auth passed, but project type check found one unknown navigation-label type. Corrected in `5b85289`; do not cite that initial run as fully green. Final source CI run `37130446055` passed both Ask build/auth and the project checks. The latter includes the current shop browser/speed contract; it is not an Ask-specific Safari or physical-device result.
- Four materially changed representative URLs accepted by IndexNow; batch `1b1ed66b-1c78-4e21-823a-cdf76c91174a`, key validated. Acceptance is not indexing, ranking, AI citation or lead attribution.

## Browser cache defect and correction

The deployed page's first response used `public, max-age=0, s-maxage=300`, but a Cache API hit returned `public, max-age=43200`. The new regression failed against that production state. Reapply the browser policy after Cache API lookup, keeping the five-minute edge cache. The corrected candidate and production pass repeated miss/hit requests and retain private session no-store. No zone-wide setting, rule or account permission was changed; dashboard sign-in is no longer needed.

During final promotion the guard detected a separate main-portal update from `e0842bf2-eaad-4aee-83c4-0fcb92d5ec88` to `36eae7e5-fc7d-4ee7-be18-eb6d4a6212cc`. Promotion stopped before mutation. After recording the new baseline, the already-verified Ask candidate was promoted with all routes, that newer main portal and MCP preserved. The candidate was not rebuilt or reuploaded. Normal browser settings were restored, temporary Cloudflare tab closed, and the preview server stopped.

Already-stored browser copies cannot be remotely invalidated. An existing reader may need one hard refresh to discard the former twelve-hour copy. New responses require browser revalidation.

## Limits and remaining work

The three rejected campaign creatives were never added or published. Page-family creative work remains pending. Existing answer/QR wording is preserved; this presentation/data release is not a clinical audit of the entire corpus or independent validation of legacy exclusivity claims. Mapping quality depends on the actual catalogue's coverage. Measured reader comprehension, calls, visits, enrolments, search ranking and AI citations require subsequent evidence.

Latest account snapshot, 3 October 2026 at 13:58 UTC: nine Ask-registered accounts, nine Google identities, eight Gmail addresses; two known owner/staff accounts, seven other accounts. These are registrations, not seven proven customer leads.
