# Centre directory, readability and shared Verify library

Published 28 September 2026 on the existing speech therapy URL and three supporting guide pages. The header, footer and evidence library remain shared components for future therapy pages.

## What changed

- Readable Sintony type hierarchy: 18px desktop body, 16px mobile body and primary links/actions, stronger contrast, underlined text links, larger tap targets and wrapping tablet navigation. Existing real 400/700 font files retained.
- All 62 locations from the dated public contact page are server rendered. Search by centre/city/postcode, filter by region, show more or show all. Without JavaScript, all listings remain visible.
- 60 verified canonical centre profiles; contact-page fallbacks for Jubilee Hills and USA. The USA source is Greenville; an unrelated California profile is not substituted.
- 57 actual emblems and 138 reviewed photographs across 52 locations, with responsive WebP derivatives, lazy loading, gallery captions and explicit dimensions. Ten locations have no approved photo rather than an invented or mismatched image. Street View capture, ambiguous location matches and images containing patients or personal information were excluded.
- Every card displays the Pinnacle national number 9100 181 181. No distinct branch phone was verified, so no internal facility code is represented as a telephone number.
- 59 locations select their exact existing enrolment-form facility. Gajuwaka, Jagadamba and USA use the national contact route because no matching enquiry choice was established. All 59 selections passed Cloudflare HTMLRewriter testing; Anna Nagar was also checked on the live form without submitting a lead.
- Corrected Madhurawada's copied Tirupati directions link using the centre's own Google place reference. Habsiguda/Uppal and Suchitra/Suchitra II stay separate.
- Per-centre stable anchors, WhatsApp sharing, native share with copy fallback, copyable citations, 62 vCard downloads and a dated JSON directory. Sharing uses the speech page's existing OG image; centre-specific social previews are not claimed.
- Shared Verify library: eight featured cards and 28 expandable cards, covering all 36 live records. Each uses its own source link and status; licences, scope-limited certificates, protocols, preprints and historical records remain distinct.

## Verification

Four public HTML pages: W3C Nu zero errors and zero messages. Centre validation: 62 unique listings, 59 correct enrolment links, 36 unique evidence cards, 62 correctly folded vCards and 291 linked asset references. All 582 public release files were fetched after deployment and matched staged bytes.

Responsive checks covered 320, 360, 390, 768, 1024 and 1440px. The 1024px action-strip overflow was corrected. Search, region filtering, gallery expansion, citation feedback and centre selection were exercised. No physical iPhone/iPad or Safari test is claimed. Local mobile Lighthouse scores are recorded in `reviews/LIGHTHOUSE-DIRECTORY-SUMMARY-20260928.json`; this is a lab result, not real-user performance.

HTML and Markdown delivery preserve canonical identity, telephone and structured data. Sitemap and reading-guide routes remain available; the reading guide now links the directory and evidence library. No additional URL submission was made during this pass. Submission, indexing, ranking, AI citation, calls and accepted leads remain separate outcomes.

## Hosting and rollback

Release version 85: `9f2574dd-bd9d-41c8-ab1c-57136d80612a`. Deployment: `6a68fc18-5d14-4edc-831a-ff7d5abad3ba`. Previous version 84 for rollback: `f020dcea-0382-4cd0-b060-e90bfe4a828f`.

Deploy all four modules listed in `deployment/release-directory-20260928.json`, including the new `centre-facilities.mjs`. Keep the full union of 634 Verify assets and 582 speech assets. Preserve the ASSETS, PINNACLE_ASK and SITES_BYPASS_TOKEN bindings and existing route/config rules. Never deploy the speech build as the whole portal or redeploy an older shared Worker with a partial asset set.

The previous shared Worker logic and all 634 Verify assets matched exactly. Production Verify, evidence register, FSC PDF, PinnacleAI story, helpline and ordinary enrolment hashes matched the baseline. The dynamic payment page remained reachable. The new prefooter applies to pages using this master template; it does not replace every legacy site's footer.

## Maintenance

The checked-in `src/data/centre-directory.json` and approved image files are sufficient for a normal build. Refresh locations only from verified contact/profile and enrolment sources; keep facility routing identifiers separate from phones. Photo provenance hashes are in `reviews/CENTRE-MEDIA-RELEASE-20260928.json`; raw Drive exports and signed URLs are excluded from the repository. The evidence register snapshot and curated cards must remain a one-to-one set of 36 until a reviewed register change occurs.

Remaining data gaps: verified branch-specific phone numbers, approved imagery for ten locations, matching enquiry choices for three locations, and confirmed profiles for the two fallbacks. These gaps do not prevent use of the national contact route. Code, build and deployment remain owned in this task; reviewers performed read-only checks.
