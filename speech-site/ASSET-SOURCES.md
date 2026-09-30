# Prototype asset sources

## Occupational Therapy life-first revision — 30 September 2026

- `src/assets/occupational-early-play-20260930.png` shows a young Indian child exploring stacking play with their father nearby. It was generated through Adobe Firefly from a brief for a luminous family scene with a subtle coloured developmental path and no embedded copy or marks. Source receipt: https://photoshop-api.adobe.io/v2/short-url/urn:aaid:ps:US:1facdc41-9c5c-4e32-acab-53da00757d7f. The child and parent are illustrative, not a patient testimonial or measured outcome. The exact Pinnacle emblem and page text remain HTML.
- `src/assets/occupational-mealtime-20260930.png` shows a child using a spoon at a family meal. It was generated through Adobe Firefly from a brief for a warm, ordinary participation moment with luminous white space and a restrained coloured path, without claims or embedded copy. Source receipt: https://photoshop-api.adobe.io/v2/short-url/urn:aaid:ps:US:c7616f75-0f25-4d6d-aad6-e96275c2062d. It illustrates a possible goal, not an actual care record or typical result.
- `src/assets/occupational-first-conversation-20260930.png` and `src/assets/occupational-life-in-view-20260930.png` are pre-existing campaign assets reused for the first professional conversation and the wider life path. The first is an illustrative professional scene, not a photograph of a named Pinnacle employee. The visual review retained its full-sleeve white professional coat and separate official emblem in the page; no credential or regulator mark is inferred from the illustration.
- The reviewed OT social image is the 1200 × 630 `og-release-20260930/images/occupational-chatgpt-20260930.jpg`, generated directly through ChatGPT's built-in image tool in this Codex task from the prior OT poster and approved Pinnacle lockup. The full generated source is `og-release-20260930/revised-originals/occupational-chatgpt-20260930.png`; the exact prompt is saved in `og-release-20260930/occupational-chatgpt-prompt-20260930.md`. The selected creative shows a child practising a familiar dressing task with family support, a professional in a full-sleeve branded white coat, a wider school-life vignette, the official lockup, the life-first message and readable `9100 181 181`. The small Class B SaMD line describes the licensed non-diagnostic software, not OT or child outcomes. `scripts/apply-og-replacements.mjs` verifies the JPEG hash in `og-release-20260930/manifest.json` and replaces the generated delivery asset after every build.

## Find a Pinnacle centre directory — 29 September 2026

- The `/centers` hero and directory use owner-supplied photographs and centre emblems recorded in `src/data/centre-directory.json` and `reviews/CENTRE-MEDIA-RELEASE-20260928.json`. No generated patient or clinical scene is used on the directory page.
- Hero photographs are sourced from the dated centre-media set: Jaya Nagar exterior (`jayanagar-exterior-41.jpg`), Gurunanak Road interior (`gurunanak-interior-1-2.jpg`), Jagadamba interior (`jagadamba-interior-34-1.jpg`) and Suchitra exterior (`suchitra-exterior-0.jpg`). Captions and alternative text identify only the photographed location and visible space.
- `src/assets/centres-share-20260929.jpg` is a 1200 × 630 social card composed by `scripts/build-centres-social-card.py` from three of those real centre photographs, the approved Pinnacle Blooms Network lockup and manually typeset directory copy. It does not state a rating, outcome or centre-specific registration status.
- The page states exact dated coverage: 62 published listings, 62 map links, 60 centre-specific profiles, 52 photo-backed listings and 57 emblem-backed listings, checked 28 September 2026. A map link is treated as directions, not as proof of a matched Google Business Profile.
- Ten listings have no released premises photograph; five have no released emblem. Cards use a restrained placeholder where needed. The duplicated Attapur/Himayatnagar source image remains a media-reconciliation flag and is not used as page-wide proof.

## Autism Therapy life-first integration hub — 29 September 2026

- `src/assets/autism-life-journey-20260929.png` is original, text-free campaign artwork generated with the built-in image-generation tool. It follows one Indian child and family through communication, a home routine, learning and inclusive participation on a luminous Pinnacle pathway. Original generated source: `C:/Users/Siri Palace/.codex/generated_images/01a0cbfd-d6a8-7662-8cf4-95c3a0f1361f/exec-f65bc94f-cbc9-4c32-b923-4af4dfc636ed.png`.
- `src/assets/autism-integrated-support-20260929.png` is original, text-free explanatory artwork generated with the built-in image-generation tool. It keeps the child and family central while showing speech, occupational therapy, behavioural support, special education and everyday settings as distinct contributions connected by one direction. Original generated source: `C:/Users/Siri Palace/.codex/generated_images/01a0cbfd-d6a8-7662-8cf4-95c3a0f1361f/exec-879efe56-8a0e-4edf-9afe-cde59ad1c5c9.png`.
- `src/assets/autism-school-morning-20260929.png` is original, text-free narrative artwork generated with the built-in image-generation tool. It shows a school-morning sequence: communicating a choice, preparing with family and participating with a teacher and peers. Original generated source: `C:/Users/Siri Palace/.codex/generated_images/01a0cbfd-d6a8-7662-8cf4-95c3a0f1361f/exec-e9b2846b-f527-41e5-85fa-c8108b59c256.png`.
- Creative direction for all three images: luminous white background; Indian child and family; soft-edged photographic vignettes; deep navy, teal, vivid red, purple, cyan, pink, yellow and green pathway accents; ages within the documented 0–12 SaMD scope; no generated words, logos, regulator marks, puzzle pieces, certificates, ratings or promised outcomes.
- `src/assets/autism-therapy-share-20260929.jpg` is the 1200 × 630 social derivative produced by `scripts/build-autism-therapy-social-card.py`. It combines the life-journey artwork with the approved Pinnacle Blooms Network lockup and manually typeset title, life-first promise, Verify reference and `9100 181 181`. All words are rendered typography rather than generated text.
- Astro supplies responsive WebP variants for the page illustrations. The story, source boundaries, service roles, FAQs and calls to action remain semantic HTML with descriptive alternative text.

## Special Education life-first release — 29 September 2026

- `src/assets/special-education-life-journey-20260929.png` is original, text-free campaign artwork generated with the built-in image-generation tool. It shows an Indian child moving through supported learning, family participation and school-life moments on a luminous white Pinnacle pathway. It is illustrative brand storytelling, not a patient photograph, testimonial or promised outcome. Original generated source: `C:/Users/Siri Palace/.codex/generated_images/01a0cbfd-d6a8-7662-8cf4-95c3a0f1361f/exec-4e5afe27-74cc-408f-9d01-65954b818888.png`.
- `src/assets/special-education-learning-cycle-20260929.png` is original, text-free explanatory artwork generated with the built-in image-generation tool. It connects a special educator, family, classroom participation, communication supports and everyday-life practice through the established vivid Pinnacle pathway. It does not depict a verified Pinnacle child, centre or professional. Original generated source: `C:/Users/Siri Palace/.codex/generated_images/01a0cbfd-d6a8-7662-8cf4-95c3a0f1361f/exec-a0799d6b-eda8-47b7-b163-be0ddfabd174.png`.
- Creative direction for both images: luminous white background; Indian child and family; soft photographic vignettes; deep navy, teal, vivid red, purple, cyan, pink, yellow and green accents; learning access and participation remain the visual purpose; no generated words, seals, certificates, regulator logos, claims or ratings.
- `src/assets/special-education-share-20260929.jpg` is the exact 1200 × 630 social-share derivative produced by `scripts/build-special-education-social-card.py`. The script composes the life-journey artwork with the approved first-party Pinnacle Blooms Network lockup and manually typeset page title, Verify scope summary and `9100 181 181`. The wording is real rendered typography, not image-generated text.
- Astro supplies responsive WebP variants of the two on-page illustrations. Page copy, citations, lifecycle labels and claim boundaries remain semantic HTML; the image alternative text describes the visual purpose without treating the artwork as clinical evidence.

## Updated Pinnacle Blooms Network lockup — 29 September 2026

- `src/assets/pinnacle-blooms-network-lockup.png` is the approved emblem-left, two-line `Pinnacle / Blooms Network®` lockup used in the shared header and footer.
- Source: `C:/Users/Siri Palace/Documents/Codex/2026-07-25/pinnacle-strip-2-frame-1-the/work/investor-update-deck/assets/pinnacle-blooms-network-lockup.png`.
- The 650 × 242 PNG is a pixel-identical crop of `C:/Users/Siri Palace/Documents/Codex/Pinnacle_Brand_System/pinnacle-official-header-source.jpg`, region x=0, y=0, width=650, height=242, as specified by `official-brand-assets.md`.
- SHA-256: `35EB365F1E23F188442182E7D3A4887DFBEF94C14A0B5ED0A833D89F4A42B4E2`. The source is preserved proportionally; Astro creates responsive delivery derivatives.

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

## Occupational review illustration — 30 September 2026

- `src/assets/occupational-observe-review-20260930.png`: created in this Codex thread with the built-in ChatGPT image-generation tool, then edited once with the official `pinnacle-blooms-network-lockup.png` reference for the therapist's full-sleeve white professional coat. Final source: `C:/Users/Siri Palace/.codex/generated_images/01a0ef6b-507a-7630-828f-7ac81852a39c/exec-933559df-53de-4663-9be7-6d68cab3d7ec.png`.
- Purpose: show a fictional Indian mother observing her child's everyday task at home and later discussing the observation with an OT while the child plays nearby. The image illustrates the family-to-professional review loop; it is not a documented patient or staff photograph. No medical credential, certificate or outcome appears inside the artwork. HTML carries the caption, full explanation and source links.

## ABA life-first release artwork — 30 September 2026

All four source PNGs below were created in this Codex task with the built-in ChatGPT image-generation tool, without a separately billed local API key. They show fictional people and an illustrative care pathway. The site builds responsive WebP derivatives; the separate social poster builds to a 1200 × 630 JPEG. The exact service answers, claims and limits are also visible in HTML. Genuine Pinnacle emblem/wordmark assets remain present in the shared site shell and page HTML; no regulator mark or endorsement is depicted.

| Source in `src/assets` | Narrative job | Original generated-file record | SHA-256 of checked-in PNG |
|---|---|---|---|
| `aba-hero-life-first-20260930.png` | Mother, child making a choice and white-coated professional introduce communication and participation. | `C:/Users/Siri Palace/.codex/generated_images/01a0ef6b-507a-7630-828f-7ac81852a39c/exec-1a5a0b38-932c-4610-a151-2f078566e5e9.png` | `8e98633dc541802344b6ff4fdcc60c52916dda08b61faeec7baa41733fed66ffb` |
| `aba-transition-choice-20260930.png` | A difficult transition becomes a break request and then peer play in the worked example. | `C:/Users/Siri Palace/.codex/generated_images/01a0ef6b-507a-7630-828f-7ac81852a39c/exec-e311f160-7dbd-4458-9f86-e696f4c3d21a.png` | `f2c7e2e8f91db2a11dcf5da7ec298161fa81ad3e8f877366b23f0b902e39a149` |
| `aba-family-review-20260930.png` | Family observation and a later professional review connect home experience to plan correction. | `C:/Users/Siri Palace/.codex/generated_images/01a0ef6b-507a-7630-828f-7ac81852a39c/exec-59ca48dc-4ac5-4c01-b3b8-343edeecbfe9.png` | `1915f526a00be2b835cd8acc5977264785fa7049fd5fcd307f3e29df19a93e3c` |
| `aba-social-life-first-20260930.png` | Distinct social sharing poster with ABA title, family benefit and `9100 181 181`. | `C:/Users/Siri Palace/.codex/generated_images/01a0ef6b-507a-7630-828f-7ac81852a39c/exec-489cec32-aa20-4c09-82f4-c4ecf52a8346.png` | `d0c622c77015290fe4fa2591127c88cabc38ad7b8f41622f4f599439a248f496` |

The creative instructions asked for luminous white, Pinnacle navy/magenta/cyan accents, a capable Indian child rather than a distress depiction, a full-sleeve white professional coat, family agency, a glowing pathway, and **communication → choice → participation**. The social-poster instruction additionally asked for the exact English ABA title, `9100 181 181`, Verify source address and sufficient safe space for a 1200 × 630 crop. The poster crop and its typography were inspected at final output size. The visual assets are illustrations of a method, not evidence of staff credentials or observed outcomes.

## Autism life-first refresh — 30 September 2026

These four source PNGs were generated in the Codex conversation with the built-in image tool, without the separately billed local API-key route. They depict fictional people and illustrative possible support, not real patients, staff identities, a verified centre or an individual outcome. The social image was generated as a **complete branded poster with its final text, number and visual composition together**, then Astro made the 1200 × 630 JPEG delivery derivative without a typography-overlay step. Its official-looking lockup was checked visually against the approved first-party lockup reference; the site itself also retains the exact approved image asset in its common header and footer.

| Checked-in source | Narrative job | Original generated file | SHA-256 of source PNG |
|---|---|---|---|
| `src/assets/autism-hero-life-first-20260930.png` | Child-led picture-card choice, mother and supportive full-sleeve white-coat professional, with home/class/peer participation as possible settings. | `C:/Users/Siri Palace/.codex/generated_images/01a0ef6b-507a-7630-828f-7ac81852a39c/exec-c059558c-dd38-4731-b853-345aae069787.png` | `029a2e49d8adfc4019d081f1ade26564ca38d9570fda6c939013d8dd2f1fe4a0` |
| `src/assets/autism-first-conversation-20260930.png` | Makes the first human conversation visible alongside the call and three-step handoff. | `C:/Users/Siri Palace/.codex/generated_images/01a0ef6b-507a-7630-828f-7ac81852a39c/exec-68b5b93b-5417-4e0f-9093-55f5afa3bb17.png` | `e293bb240297df285edbf5309daefbde1074e7bf0eed39ad78fb09eb923cc0a` |
| `src/assets/autism-selected-path-20260930.png` | One child/family goal with communication, home and peer-play possibilities along one path; relevant supports remain conditional in HTML. | `C:/Users/Siri Palace/.codex/generated_images/01a0ef6b-507a-7630-828f-7ac81852a39c/exec-8187c587-6533-45bc-b13c-6848235271f0.png` | `d75a4fe08106df9fe8caf40e6b05eedae5cc5823eb1f86910fd47838fc9901e5` |
| `src/assets/autism-social-integrated-20260930.png` | Complete share poster: one child, one life-first direction, selected support, official-brand reference, Verify address and `9100 181 181`. | `C:/Users/Siri Palace/.codex/generated_images/01a0ef6b-507a-7630-828f-7ac81852a39c/exec-98e6dd33-aea1-4cd4-a489-86c999b41e7a.png` | `f7931914f644d6f87a4230e02f63a7b71576a1a936f78e684f4ad06a70f53be3` |

The new hero, first-conversation and pathway scenes build responsive WebP variants; the retained 29 September school-morning artwork remains the specific worked-example image. The social JPEG is built directly from the checked-in new source rather than being silently substituted from a postbuild manifest. Exact claims and source limits stay in HTML and the linked evidence exports. The illustrated white coat does not represent a medical-doctor credential.

## Portal restoration — 27 September 2026

`src/assets/portal-footer-shapes.png` is the existing first-party footer artwork from https://www.pinnacleblooms.org/images/footer-shapes.png, retrieved for the authorised site restoration. Astro generates its WebP delivery derivative. Navigation is recorded in src/data/portal-navigation.json from the existing homepage, with intentional corrections documented in PORTAL-RESTORATION-20260927.md.
