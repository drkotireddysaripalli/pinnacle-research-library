# Pinnacle OG image release — 30 September 2026

Five complete branded social images replace the Occupational Therapy, ABA Therapy, Special Education, Autism Therapy and Find a Centre OG JPEGs. Speech Therapy remains the approved reference.

## Creative standard

- The child and family are the central story: daily independence, communication and choice, learning, participation and a clear first visit.
- Depicted Pinnacle professionals wear full-sleeve white coats with the approved emblem and name. Parents retain everyday clothing.
- Designed PinnacleAI frames identify life-first child development, MD-5/Class B SaMD and BIS licence MD/L-2026029599. They are informational designs, not certificate facsimiles or independent endorsements.
- Vivid Pinnacle colours, hopeful expressions, large headlines and **9100 181 181** remain readable in small previews.
- These are generated campaign illustrations, not documentary patient, staff or named-centre photographs. No testimonials, ratings, clinical guarantees or qualifications are asserted.

## Generation and source

The built-in image service rejected the initial calls because the local gateway did not support its image route. The owner explicitly approved the API fallback with the existing locally protected key.

The approved imagegen skill CLI generated the complete creatives with **gpt-image-2**, high quality, 1920 × 1008. Each received one targeted refinement for attire and background evidence frames. No logo/text collage was assembled afterward.

- `prompts.json`: original and refinement prompts.
- `revised-originals/`: final generated PNG source.
- `images/`: delivered 1200 × 630 JPEGs.
- `manifest.json`: exact target URLs, source paths, dimensions, sizes and SHA-256 hashes.
- `review.html`: local gallery.
- `production-verification.json`: production checks.

JPEG export only resized and encoded the generated pixels. Approved references were the released Speech Therapy OG, `src/assets/pinnacle-blooms-network-lockup.png`, and `src/assets/pinnacle-emblem-official.png`.

## Build preservation

Run the existing `npm ci` and `npm run build` workflow. The new `postbuild` step runs `scripts/apply-og-replacements.mjs`, placing the five reviewed JPEGs at their existing generated paths. It verifies hashes and fails if an upstream asset path changes.

This deliberately keeps the existing OG URLs and page HTML for an image-only release. It also leaves on-page WebP variants unchanged where the old source image is shared. Future intentional OG URL changes must update this manifest.

## Deployment scope

The final asset union contains 1,449 files. Exactly five JPEGs changed; 1,444 other files, including every page, were preserved byte-for-byte. The main Worker changed only five image digest values used for ETags. Its five handler modules and service/secret bindings were preserved. No route mutation was issued.

The final release is Worker version `a52bab91-9687-449f-a522-1eae02693dbd`, deployment `06126284-a4cf-4a72-8e6c-5ad552f83e62`, at 100%. Only the five image URLs were purged. The immediate prior image-only version is `a137c1ed-3d73-4549-ba65-f393844bc834`; the original pre-image release is `9494ca5e-9a2a-4dde-b07c-126dcf1e3911`.

External social platforms and previously cached browser responses may retain an older image until they fetch the URL again. No search ranking or AI citation change is inferred.
