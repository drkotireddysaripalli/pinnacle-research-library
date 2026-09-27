# Prototype asset sources

## Sales rebuild — 27 September 2026

- `src/assets/speech-life-campaign.png` is new AI-generated, fictional campaign artwork: an Indian mother and child communicating during play, with an aspirational school-participation vignette. Created with the built-in image-generation tool on 27 September 2026. It is not a patient photograph, testimonial or treatment result. The page includes a visible caption and descriptive alt text.
- Creative brief: luminous white Indian family campaign; mother listening at eye level; child pointing during play; restrained vivid pink/purple/yellow/green pathway; no text, logos, certificates or claims embedded in the artwork.
- Astro creates responsive WebP variants and a 1200 × 630 social-share derivative. Those published asset URLs are prepared in metadata; the assets are currently available only in the local build.
- Home/journey diagrams and interface icons are original SVG code. All narrative and nine-step labels remain real HTML, not image text.
- Live homepage colours inspected on 27 September: action-strip pink `#E4115E`; purple text `#8F2879`; Sintony typography. White contrast ratios in the local audit: 4.62:1 and 7.64:1 respectively.
- Detailed software-name explanations follow the existing `work/pinnacle-verify-fsc/content/how-pinnacleai-works.json`. The nine cards are an editorial walkthrough, not a new nine-stage clinical protocol. Free 24/7 guidance follows the owner-confirmed facts in `work/helpline-entity-20260924/service-facts.json`; it is distinct from assessment and therapy fees.

## Existing homepage assets (source history)

Retrieved 26 September 2026 from the current public Pinnacle homepage. Used to keep its familiar appearance in a local prototype. No photo is represented as a particular patient's treatment outcome or as a verified Pinnacle staff member.

- `src/assets/pinnacle-logo.jpg`: https://www.pinnacleblooms.org//Images/pinnacle-logo9.jpg
- `src/assets/hero-family.jpg`: https://www.pinnacleblooms.org/Images/Slider-images/pinnacle-blooms-empowering-80-crores-kids-people-with-neurological-conditions-across-the-230-plus-countries.jpg
- `src/assets/hero-practice.jpg`: https://www.pinnacleblooms.org/Images/Slider-images/sliders7.jpg
- `public/pinnacle-pages-fonts/sintony-latin.woff2`: https://www.pinnacleblooms.org/fonts/sintony/XoHm2YDqR7-98cVUETMtug.woff2

Astro generates size-specific WebP variants from the existing JPG files. Images have descriptive alt text and reserved dimensions. The slider advances only when the visitor chooses a control.

Final publication: retain/verify the organisation's reuse rights for these existing images and the font licence. The source filename's marketing claims are not repeated as page copy.

Narrative sources: the user's approved seven-stage pathway; https://www.pinnacleblooms.org/verify/evidence/pinnacleai-regulatory-journey.html; https://www.asha.org/public/early-identification-of-speech-language-and-hearing-disorders/.

## Current review implementation

Only the Pinnacle logo, Sintony font and labelled generated campaign artwork are used in the current page. The two earlier homepage photos are unused historical local assets and excluded from the saved public source package. No supplied Drive centre photo was selected or published.
