# Prototype asset sources

## Sales rebuild — 27 September 2026

- `src/assets/speech-life-campaign.png` is new AI-generated, fictional campaign artwork: an Indian mother and child communicating during play, with an aspirational school-participation vignette. Created with the built-in image-generation tool on 27 September 2026. It is not a patient photograph, testimonial or treatment result. The page retains descriptive alt text. Repeated visible AI-image captions were removed at the owner’s explicit request on 27 September 2026.
- Original generated file retained at `C:/Users/Siri Palace/.codex/generated_images/01a0cbfd-d6a8-7662-8cf4-95c3a0f1361f/exec-ce453794-6fa2-4514-9179-83b3b06480da.png`.
- Creative brief: luminous white Indian family campaign; mother listening at eye level; child pointing during play; restrained vivid pink/purple/yellow/green pathway; no text, logos, certificates or claims embedded in the artwork.
- Astro creates responsive WebP variants and a 1200 × 630 social-share derivative. Those published asset URLs are prepared in metadata; the assets are published under the speech asset namespace.
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

The Pinnacle logo, Sintony fonts and three generated illustrative campaign artworks are used in the current page. The two earlier homepage photos are unused historical local assets and excluded from the saved public source package. No supplied Drive centre photo was selected or published.

## Visual-story expansion — 27 September 2026

- `src/assets/speech-first-visit.png`: fictional mother, child choosing a picture card and therapist at a table. Generated with the built-in image-generation tool. Original source: `C:/Users/Siri Palace/.codex/generated_images/01a0cbfd-d6a8-7662-8cf4-95c3a0f1361f/exec-2c7a3c9a-bc5f-4ae4-a5ac-9366082eef1a.png`.
- `src/assets/speech-everyday-story.png`: fictional breakfast choice, sibling play and classroom participation connected by a colourful pathway. Original source: `C:/Users/Siri Palace/.codex/generated_images/01a0cbfd-d6a8-7662-8cf4-95c3a0f1361f/exec-07669b32-8aa2-4fe7-aca7-65a916fe559a.png`.
- Complete prompts, purpose and delivery settings: `IMAGE-PROMPTS-20260927.md`.
- These illustrations use responsive lazy-loaded WebP assets. Largest variants are approximately 65 KB and 91 KB respectively; smaller variants are selected by viewport. All copy and stage labels remain HTML.
- `public/pinnacle-pages-fonts/sintony-latin-bold.woff2`: actual Sintony 700 Latin from https://fonts.gstatic.com/s/sintony/v17/XoHj2YDqR7-98cVUGYgIr9AJkw.woff2. Self-hosted to match the original site typography without synthetic bold.
- Sintony OFL licence saved as `public/pinnacle-pages-fonts/OFL-Sintony.txt`, obtained from https://raw.githubusercontent.com/google/fonts/main/ofl/sintony/OFL.txt. It covers the font family used here.
- The two home/car analogy scenes are original inline SVG in `AnalogyStories.astro`. They explain skills, methods and direction; they do not depict an actual child or compare the child to a machine.

## Official logo archive — 27 September2026

User-supplied archive: `Koti Group - Bharath Healthcare - Pinnacle Amblems and Logos.zip`. Original selected PNGs are preserved byte-for-byte: image7 → `pinnacle-emblem-official.png`, image6 → `bhcl-emblem-official.png`, image5 → `pinnacle-wordmark-official.png`. Astro makes WebP delivery derivatives. The original homepage logo remains in the header. No regulator seals or logos are fabricated.

Current FREE speech-assessment offer is owner-confirmed on27September2026; earlier price-confirmation wording is superseded for this campaign.
