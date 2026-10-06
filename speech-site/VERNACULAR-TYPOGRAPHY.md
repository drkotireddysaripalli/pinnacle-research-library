# Shared Anek typography

Owner instruction: 6 October 2026. Telugu, Hindi and other native Indian-script text must use Anek with confident, readable weight.

## Single contract

`deployment/vernacular-typography.mjs` supplies the shared CSS and public HTML transform. `VernacularTypography.astro` applies the same CSS to new Astro builds. Portal and Ask Workers apply it to existing public documents, including Verify, FAQ, Sunshine and native books. Auth callbacks, APIs and non-HTML exports are excluded. Existing private cache policies remain intact.

- Native headings: **800 / ExtraBold**, line height 1.45.
- Native body copy: **600 / SemiBold**.
- Native controls and language buttons: **700 / Bold**.
- Native emphasis: **800**.
- No negative letter spacing; no synthesized font weight.
- The existing Latin/English font definitions and approved common navigation content are retained.

The nine licensed Anek script assets already served by `/verify/fonts/` are reused: Devanagari (including Hindi and Marathi), Telugu, Tamil, Kannada, Malayalam, Bangla, Gujarati, Gurmukhi and Odia. Unicode ranges load only scripts present in the document; English pages with native language labels receive the correct font for those labels. Language tags identify native content and drive its weights. Anek does not cover every world script; unsupported scripts continue using an appropriate device fallback rather than being mislabelled as Anek.

## Verification

`scripts/test-vernacular-typography.mjs` checks the shared transform, idempotency, native content preservation and private/auth boundaries. `scripts/check-vernacular-browser.mjs` checks real public-page HTML with candidate CSS at 390/768/1440px and WebKit 390px, plus all nine script fonts. The isolated presentation fixture disables scripts/dialogs; it does not establish a successful sign-in or purchase. Production physical-device results are recorded separately in the release receipt.

Keep future native page content correctly marked with `lang`. Do not add page-specific Noto/device-font substitutions or separate native heading conventions. The visible content, URLs, licences, images and offers are outside this typography change.

Font source and script support: https://github.com/EkType/Anek. Existing SIL Open Font License files are preserved with the served assets.
