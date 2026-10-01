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

## PinnacleAI product wave — 30 September 2026

The ten PNGs below were created in this Codex conversation with the built-in ChatGPT image-generation tool, without a local API key. The nine social creatives were generated as complete Pinnacle-branded compositions with their module-specific message and `9100 181 181` inside the creative; the site makes individual 1200 × 630 social JPEGs and responsive WebP hero variants from them. `pinnacleai-life-path` is the text-free illustrative story scene. The child, family and professional scenes are fictional illustrations of possible everyday participation, not photographs or outcome evidence. The professional white coat is a brand cue, not a claim of physician credentials. The approved first-party Pinnacle lockup guided the prompts; the exact site logo remains an independent first-party asset in the shared shell. Regulatory claims, scope and limitations are carried by visible HTML and source links rather than by badges inside these images.

| Checked-in PNG in `src/assets` | Purpose | SHA-256 |
|---|---|---|
| `pinnacleai-ecosystem-social-20260930.png` | Nine-module life-first ecosystem overview | `55df6df77301cd2b2895ab5f2bd0aefef2edb02483f274a8d45c8e32ba392822` |
| `pinnacleai-abilityscore-social-20260930.png` | AbilityScore measurement and the child's lived goals | `acc419d9d310b9d636ae2661a02cd35237ea397b49a96f72a17e27db4adc943c` |
| `pinnacleai-readiness-social-20260930.png` | Seven readiness lenses and participation | `7b4b4721a91e912cb4fa0f17aab2630ca9bf16f4ed8c888e10f54f13add23543` |
| `pinnacleai-pdk-social-20260930.png` | Child-specific development plan | `7a94a9a2f49bbafb395475961770c0b835a9cd50b95e54df65588eb02d5f729b` |
| `pinnacleai-prognose-social-20260930.png` | Forecasting as a planning aid | `89fc9275aac9251e67417a4d9b0eaa37624f0ac549de81124c88a1ae192c58c1` |
| `pinnacleai-therapeuticai-social-20260930.png` | Integrated support selected for a child's goal | `76f7191f307308b2e26d1d8c0a8d70a78d76d643233fe20849b9724601a8318f` |
| `pinnacleai-everyday-social-20260930.png` | Family-guided home practice | `a4ae3fd523f77f488f39d2da0360c9ff72dc53e14c315d23f186848a3b05f875` |
| `pinnacleai-fusion-social-20260930.png` | Observations joined to professional review | `138343e3d84e21eeeab41c31984313e2b1d082c6a03391b8b12711ac7341b941` |
| `pinnacleai-reassess-social-20260930.png` | Review, revise and repeat | `a7a1b497003fb3f8f4bb39088a8f97350ba4e9da5fb5b8170845e55a21ad35a6` |
| `pinnacleai-life-path-20260930.png` | Illustrative everyday-life scene shared by worked examples | `66c69e90c53623499037fc44422d08b4a93e3cc880bbd84c410d26615f605875` |

### Editorial correction · one in-page scene per product page

These nine complete, distinct scenes were generated in the current Codex conversation with the built-in ChatGPT image tool using the first-party Pinnacle lockup as reference. Originals remain in `C:/Users/Siri Palace/.codex/generated_images/01a0ef6b-507a-7630-828f-7ac81852a39c/`; the checked-in copies below are the source for responsive WebP delivery. They depict **illustrative**, not actual, child stories or measured results. The social posters above remain the OG/share assets; the scenes below carry the on-page narrative without duplicating a baked-in headline or telephone number.

| Checked-in scene | Narrative moment | Original generated file | SHA-256 |
|---|---|---|---|
| `pinnacleai-editorial-20260930.png` | Child/family life pathway and professional guidance | `exec-f555b687-a298-4d41-9ea4-c9c264edd815.png` | `c1d4cf62def3defe8b080abc91e9abf8711678a43455ea51551891496303550a` |
| `abilityscore-editorial-20260930.png` | Toy choice, observed ability and next goal | `exec-f5babad0-1ab6-4844-9a04-fadf4d459b1a.png` | `14ba0d9297b3f59400f6698f2ec26c755f0916ed19dd92bcef17fdafa6707de4` |
| `readiness-editorial-20260930.png` | Peer invitation through seven visual lenses | `exec-73044a56-a8c6-4d2e-ae06-cac84789e53c.png` | `ab23abd7ea74150a49943fcb5c99eb5087696e8cb6fb23e392ec88f2c18a8603` |
| `pdk-editorial-20260930.png` | Shoes at home and school, then human review | `exec-ccc62d11-bf9b-4b0f-a6e2-86d93b3803e0.png` | `44374330c037b1eb9c64cfc1c640a81d13f00bebba7a45b291ad45639a1faf51` |
| `prognose-editorial-20260930.png` | Playground invitation and revisable next step | `exec-7f25fa2c-35f9-4409-a8d2-c6241fdb824a.png` | `94887170a3b6643fde64416daad529c39b90c2c07f3df35757f20de8492607e7` |
| `therapeuticai-editorial-20260930.png` | Play-box goal, professional choice and peer use | `exec-0104dc37-a430-4653-856c-3fad6411a33b.png` | `97f53dec1517c9ea377d5beba9f68535781c1c4e9bfa6e3c715c1dfdfb333dc0` |
| `everyday-editorial-20260930.png` | Family-guided mealtime participation | `exec-f1a141a9-de1b-4207-92b8-fa8bffa19b8e.png` | `17fb8783e8c3f8a3f7e605cfac575da159874561aadb877c74b4ab1589dd2a73` |
| `fusion-editorial-20260930.png` | Therapy, home and consented-school observations | `exec-783cccc7-1335-4911-aae6-b312398981f0.png` | `54ca69d5b21e4a8f8b25008babeb7d4a2631846b1d6cbdcb06b7acbffdb60164` |
| `reassess-editorial-20260930.png` | Home/school bag-packing comparison and review | `exec-ab290792-1077-4e75-8e0e-d8853b01777d.png` | `13122cf841fe03c093cc50cb2c9b095240f4e09aa3be0213d5bdd0042b149087` |

## Assessment page originals — 30 September 2026

Two original fictional campaign scenes generated through the direct built-in ChatGPT image tool, using the official Pinnacle Blooms lockup and accepted speech social poster as reference. No API-key route was used. The full-sleeve professional coat has the brand emblem; it does not establish medical qualification. No patient outcome is depicted as observed evidence.

- src/assets/assessment-social-20260930.png — complete generated poster; original exec-149c987d-e5b4-410d-ad49-3c699046223e.png. SHA-256 70ddd9998772539c54bca0060f48f8401db1954d8fab8565667f35d390c584f8. Astro produces its 1200×630 JPEG; typography is part of the original creative.
- src/assets/assessment-hero-20260930.png — original exec-d861780c-7182-408b-947a-2dc43653c9b2.png. SHA-256 9848e99dedc3ec07607e906be1323bcc6936b07d9552a5673213d8fa5e35a5f9. Responsive Astro WebP variants; essential headline and explanation remain HTML.

## Suchitra centre creative · 30 September 2026

- src/assets/suchitra-social-20260930.png: complete branded poster generated with the built-in ChatGPT image tool using official lockup and approved Speech poster references. Original generated file exec-583f4d7b-aeb2-4dc7-8ba6-571978e0cb54.png in the calling task's generated_images directory. No API-key route used. Fictional family/professional; no real beneficiary or Suchitra room/result implied. Prompt retained in reviews/SUCHITRA-CREATIVE-PROMPT-20260930.md. Astro produces the1200×630share JPEG and responsive WebP.
- Existing Suchitra exterior-0/interior-5-1/interior-5-2 and profile-9: reused authorised, source-matched premises photos/emblem from CENTRE-MEDIA-RELEASE-20260928.json. Three distinct photographs; interior-3 is a duplicate and was not counted. No new capture date or unchanged-equipment claim.
# Four-centre campaign creatives · 1 October 2026

Four complete posters generated through the direct built-in ChatGPT image tool with official Pinnacle lockup and approved Speech creative references. Distinct fictional Indian families, full-sleeve branded professional coats, life-first message and readable9100181181; not actual branch rooms, named practitioners or patient outcome stories. Originals retained; prompt/output-to-source manifest: `reviews/CENTRE-BATCH-CREATIVE-PROMPTS-20261001.json`. Workspace assets: `src/assets/{dilsukhnagar,gurunanak,delhi,ananthapuram}-social-20261001.png`. Astro produces responsive in-page WebPs and1200×630social JPEGs. No API-key generation or pasted-text composite.

Branch media reused from the released centre-directory provenance. This batch omits Dilsukhnagar42-0, Gurunanak1-0, Ananthapuram47-0 low-value views and excludes Ananthapuram47-2's CCTV-monitor view despite earlier set approval. See read-only source-review dispositions in the v132 work order; old source assets are retained, not silently deleted.

## Four-centre v134 · 1 October 2026

Nandyala, Ongole, Tirupati and Srikakulam social/campaign posters are original complete creatives generated through the built-in ChatGPT image tool. Official lockup and approved Speech creative were references; no API-key fallback or text-pasted composite. Exact prompts/original paths are in `reviews/CENTRE-BATCH-V134-CREATIVE-PROMPTS-20261001.json`. All are fictional illustrative family/professional scenes, with branded full-sleeve white coats and quiet named-software scope panels. Original files remain in the tool output directory. Astro provides responsive WebP and 1200×630 social JPEG variants.

Real premises media are pre-matched directory files in `reviews/NEXT-CENTRE-BATCH-SOURCES-20261001.md`. Ongole loose-paper office corner, Tirupati watermarked exterior/historical-claim interior and Srikakulam clinical real-child photo are excluded. No current room/equipment, staff credential or patient outcome is inferred.

## Life outcome creatives · 1 October 2026

Self-Sufficient and Mainstream each use a complete original poster generated through the direct built-in ChatGPT image tool with the official lockup and accepted Speech poster references. No API-key route or pasted text composite. Exact prompts/original names and review disposition: reviews/LIFE-OUTCOMES-CREATIVE-PROMPTS-20261001.json. Source assets: src/assets/self-sufficient-social-20261001.png and src/assets/mainstream-social-20261001.png. Fictional Indian families/professional, full-sleeve branded coat, readable national phone and quiet named-software scope. No observed beneficiary outcome or real staff qualification claimed. Astro provides responsive WebP and1200×630JPEG sharing variants.


## Institutional creatives and leadership portraits · v136 · 1 October2026

About, Leadership and Global Framework each use a complete original branded English poster generated through the built-in ChatGPT image tool with the official lockup and approved Speech creative references. No API-key route or pasted-text substitute. The family/professional scenes are fictional; actual adult leadership portraits appear separately. Prompts: reviews/INSTITUTIONAL-CREATIVE-PROMPTS-V136-20261001.json. Astro creates responsive WebP and1200×630social JPEG variants. Exact five first-party portrait URLs, file hashes, dimensions and owner-authorised existing-website reuse are in reviews/LEADERSHIP-PORTRAIT-SOURCES-V136-20261001.json. All five portrait pixels were inspected; they are retained without synthetic identity changes. No credentials or actual beneficiary outcomes inferred.

## Framework worked-example creative · v138 · 1October2026

`src/assets/framework-help-journey-20261001.png` is a complete original1536×1024creative generated through the built-in ChatGPT image tool. Exact prompt: sibling `.prompt.txt`. References: approved Pinnacle wordmark and Framework social poster. Original: `C:/Users/Siri Palace/.codex/generated_images/01a0ef6b-507a-7630-828f-7ac81852a39c/exec-fbb3df66-2470-4efa-ad92-ecb3cb9cdab6.png`. The typography, scenes, pathway, accurate phone and quiet scope panels were generated together and inspected. No API-key route or pasted-caption substitute. Fictional family/professional planning scenes; the full example is marked illustrative and also available in HTML/reading exports. Original social hero is retained. Astro generates responsive WebP derivatives.

V137 removed the three retired non-founder portrait source files from current builds; the above V136 five-portrait statement is a dated provenance receipt, not the current two-person leadership roster.

## Delhi status and guidance creative · v152 · 1 October 2026

`src/assets/delhi-status-social-20261001.png` is a complete branded edit generated through the built-in ChatGPT image tool, using the accepted `delhi-social-20261001.png` as its reference. Original output: `C:/Users/Siri Palace/.codex/generated_images/01a0ef6b-507a-7630-828f-7ac81852a39c/exec-4ccd0a12-fb1e-496a-a6d0-e2ae20736354.png`. The final headline is “Looking for Pinnacle in Delhi? Call before you travel.” with “SOUTH EXTENSION · STATUS & GUIDANCE”, the accurate 9100 181 181 phone, official identity, full-sleeve branded professional and quiet MD-5/BIS software-scope panel. It was generated as one creative and visually inspected. The illustrative family scene does not establish an available Delhi appointment. The original creative remains retained; Astro produces responsive derivatives and the 1200×630 sharing image. No API-key route was used.

## About family-continuity creative · v140 · 1October2026

`src/assets/about-family-continuity-20261001.png` is a complete original1536×1024English creative made through the built-in ChatGPT image tool. Exact prompt: sibling `.prompt.txt`. Approved wordmark and Framework social poster were visual references. Original: `C:/Users/Siri Palace/.codex/generated_images/01a0ef6b-507a-7630-828f-7ac81852a39c/exec-f8f50201-a611-4557-a4af-e42260a0e769.png`. Family conversation, child play, supported home routine and review were generated with the design/typography/branding together. Fictional campaign scenes, no real outcome claim or synthetic founder identity. Full-sleeve branded professional coats, correct national phone and quiet named-software scope panels inspected. Responsive WebP derivatives supplement the unchanged About hero/social image. Complete family journey is also HTML and reading data; no API-key route or pasted-text substitute.

## Speech narrative creatives · v160 · 1 October 2026

Final first-visit asset is the built-in edit output `exec-7bb4e501-b862-4e13-8220-b45b51d8b6a3.png` in the same generated-images directory. It corrects only the background BIS wording to “BIS • IS 23485:2019”; the original composition remains. Original and corrected generated outputs are retained.

Both original English creatives were generated as complete branded compositions using the built-in ChatGPT image-generation tool in this session. No external API-key route, separately composited text, invented certificates or documented patient outcome is involved. Exact generator model/version and billing were not exposed by the tool.

- `src/assets/speech-first-visit-branded-20261001.png`: landscape 1536 × 1024; mother, father, active preschool child and full-sleeve branded professional; first-visit confidence, FREE assessment and 9100 181 181. Original output: `C:/Users/Siri Palace/.codex/generated_images/01a0ef6b-507a-7630-828f-7ac81852a39c/exec-d90b5625-4b25-4ed8-aabb-dc73c41cb162.png`.
- `src/assets/speech-everyday-review-branded-20261001.png`: portrait 1122 × 1402; one asking-for-help example across family practice and review; a phone-oriented composition. Original output: `C:/Users/Siri Palace/.codex/generated_images/01a0ef6b-507a-7630-828f-7ac81852a39c/exec-dee5f8b2-9934-4e0e-889d-c5232aa40096.png`.

References: the official `pinnacle-blooms-network-lockup.png` and accepted `speech-share-20260928.png`; both inspected before generation. Prompts are saved under `reviews/QUALITY-PASS-20261001/` with matching creative names. Outputs visually inspected; illustrative scenes, accurate phone and quiet named-software scope panels. Original generated files retained. Astro supplies responsive WebP derivatives with dimensions; all essential meaning remains in HTML. Existing Speech hero and approved OG poster remain unchanged.
