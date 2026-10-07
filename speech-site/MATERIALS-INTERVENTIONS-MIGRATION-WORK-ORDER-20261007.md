# Materials and Interventions — portal integration work order

7 October 2026 · Website implementation and release owner: the current Windows website task.

## Decision and intended result

Integrate both existing static HTML libraries into the current Astro/Cloudflare portal at `/materials` and `/interventions`. Retain the useful article content, artwork and local category menus. Reuse the approved common header, footer, typography, consent and measurement components. Import the collection through one reusable build process rather than manually rebuilding every article.

The result is a connected parent, teacher and practitioner resource journey: understand a need, find a relevant intervention, understand the material and its use, continue to related answers or Pinnacle care, and reach **9100 181 181** or the existing assessment enquiry. Useful scholarly citations and machine-readable identities must support that same content.

The requested “1% effort / 99% value” is a prioritisation principle, not a measured effort or benefit promise. The primary saving is fixing shared causes once across the source collection.

## Current evidence and exact delivery state

Inspected the live roots, Materials sensory-regulation category, Interventions sensory-processing domain, both robots and sitemap endpoints, and the current Cloudflare HTML-variant worker. Saved source HTML and source hashes locally under `../../materials-interventions-intake-20261007/`. Raw exports and authenticated Worker intake are outside the public source commit.

| Observation on 7 October | Implication |
| --- | --- |
| Both public subdomain roots respond 200. Materials root HTML is 1,579,211 bytes; Interventions root is 860,402 bytes. | Reuse substantial existing content. These are HTML transfer sizes, not measured LCP or total media download sizes. |
| Materials has nested document/head/body markup and two titles; its outer title describes a weighted blanket. | Extract the content and generate one correct document and metadata set. |
| Inspected library roots/category sources have no detected canonical. | Generate exact self-canonicals and social identities from the route manifest. |
| Materials sensory category is 927,068 bytes; Interventions sensory-processing is 1,295,905 bytes. | Remove duplicated chrome and export scaffolding, then measure representative heavy pages. |
| Both `/robots.txt` and `/sitemap.xml` endpoints return HTML fallback content, not the requested text/XML. | HTTP 200 alone cannot establish useful content or discovery coverage. Build proper discovery endpoints and route identity checks. |
| Materials root contains a call-labelled link to Gamma and many item links to existing main-domain articles. | Correct call actions centrally and preserve existing useful article canonicals instead of duplicating them. |
| The existing library Worker selects `.desktop.html` or `.mobile.html` source files by user agent. | No new database is required. Inventory both variants and retain their content/interactions in a responsive portal presentation. |
| The two requested main-domain roots each return HTTP 404 in direct probes. | They are not delivered yet. Create and verify them before moving traffic. |

Materials advertises 129 resources across 20 categories; Interventions describes 12 domains. These are publisher descriptions, not verified complete source-file counts. Link extraction includes shared navigation, fragments, aliases and existing main-domain articles; its counts must not be represented as collection size.

**Completed:** architecture/source inspection and this implementation contract. **Pending:** complete original export/file listing, import implementation, responsive acceptance, production release, redirects and discovery submissions. No migration, new tool score, indexing or lead improvement is claimed by this document.

## 1. Source intake and manifest — account for every file once

Obtain the original export repository, local folder or storage listing with HTML, CSS, JavaScript, images, fonts and any existing build script. The source-location question has already been sent to the owner; do not repeat it while unchanged. Public pages can support a representative candidate, but broken sitemap responses cannot prove the entire collection has been recovered.

Produce one manifest from the file list. Each record carries:

- Library, stable source ID, page kind (library/category/domain/subdomain/detail), exact source paths and desktop/mobile variants.
- Title, description, proposed canonical, original aliases, parent category and related records.
- Actual supported skill/concern, age or setting attributes where supplied; no invented clinical categorisation.
- Images and required interactions, source citations and genuine update dates.
- Relevant therapy/Ask/FAQ/Sunshine/PinnacleAI/centre/evidence/book destinations where matched to the subject.
- State: imported, retained existing canonical, merged equivalent alias, excluded non-content file, or unresolved with a precise reason.

Every original content file needs a disposition. Existing main-domain articles are retained and integrated into library menus/related content unless a separately justified canonical move is required. Do not count the desktop and mobile variants as separate articles.

## 2. URL contract

| Current confirmed route | Portal destination |
| --- | --- |
| `https://materials.pinnacleblooms.org/` | `https://www.pinnacleblooms.org/materials` |
| `https://materials.pinnacleblooms.org/sensory-regulation-tools` | `https://www.pinnacleblooms.org/materials/sensory-regulation-tools` |
| Confirmed Materials leaf `/noise-reducing-headphones-ear-defenders` | `/materials/noise-reducing-headphones-ear-defenders` after source/body identity verification |
| `https://interventions.pinnacleblooms.org/` | `https://www.pinnacleblooms.org/interventions` |
| `https://interventions.pinnacleblooms.org/sensory-processing` | `https://www.pinnacleblooms.org/interventions/sensory-processing` |
| Confirmed Interventions leaf/subdomain | `/interventions/<existing-valid-slug>` |
| Already useful main-domain article | Retain its canonical; connect it from the new collection |

Preserve valid slugs to minimise changes. Resolve existing typos/duplicate aliases from actual source and body identity. Shared policy/service/navigation paths are mapped to the current portal rather than blindly prefixed. Preserve useful section anchors and campaign parameters on legitimate redirects; canonicals omit tracking queries.

After new-page acceptance, apply one-hop permanent redirects from each known old content URL to its equivalent canonical. Do not redirect every old article or unknown path to the library home. Unknown pages return a genuine 404. Keep old asset paths working until their replacement assets are verified; content redirects must not capture image, CSS, font or Cloudflare internal requests.

Google's [site-move guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) is the migration reference: explicit equivalent URL mapping, updated internal links/canonicals, permanent redirects, new sitemap and monitoring. A move alone does not promise ranking gains.

## 3. One importer and one portal library layout

Use the already installed HTML parser/sanitiser. Extract the actual library content, remove nested document chrome, old shared header/footer and duplicated tracking/widgets, and generate the document through common Astro components.

- Retain rich HTML, existing illustrations, useful tables, explanations and source links. Migration does not authorise flattening the library into thin summaries.
- Preserve each library's useful domain/category menu as local navigation beneath the common portal header. Replace placeholder links with actual manifest routes or remove unsupported actions.
- Scope imported export CSS to the library container and reuse current typography where compatible. Review `html`, `body`, universal selectors, fixed positioning, fonts and media-query rules for cross-page effects.
- Compare desktop/mobile variants for content parity. Prefer one responsive content tree; retain real variant differences deliberately. Do not publish two duplicated answer bodies solely to preserve an export format.
- Resolve relative assets against the actual source page. Reuse dependable existing image URLs or copy assets under a namespaced portal path, with a deterministic mapping.
- Keep only required interactions, reviewed once; remove obsolete script/beacon duplication. No iframe of the entire old website.
- Produce exactly one title, canonical, page H1 and main landmark. Use semantic headings and table/list markup around meaningful content.
- Reuse the common Anek contract for native Indian-script text. Keep current approved common-shell wording, colours and nine authority tiles.

Build-time generation serves complete content as ordinary HTML and avoids a new database/query dependency for static libraries. Library pages do not need Ask's Supabase data model. A new reader sign-in gate is not part of this migration request.

## 4. Connected narrative and enquiry journey

Use contextual relationships instead of a repeated directory of unrelated buttons:

**Need or skill → relevant intervention → material and use → everyday home/school application → related answers and care → clear next action.**

Every detail page should provide its parent/category breadcrumb, a small relevant set of sibling/next-step links, references, and a visible call/enquiry path. A sensory-regulation material can link to its actual sensory intervention, an appropriate occupational-therapy explanation and relevant Ask answers. An intervention can link back to materials and preparation for the professional plan. Populate relationships from existing attributes/content and review ambiguous matches.

Bring the relevant PinnacleAI, Verify evidence, therapies, centres, Sunshine/FAQ/Ask and books into these journeys where useful. Link shop purchase actions only to actual offers/SKUs; a material guide is not automatically a stocked product. Keep national **9100 181 181** primary and preserve the established assessment handler. Measure navigation/contact intent separately from accepted enquiries and actual qualified calls/enrolments.

Clinical safety/use explanations and citations are preserved. Reconcile stale shared proof panels through the current approved source/claim contract once. Do not copy unqualified historical counts, guarantees, licences for unrelated scope, invented prices or unsupported exclusivity into new metadata.

## 5. Discovery and machine-readable content — generated once

- Exact canonical and Open Graph URL/image/title; descriptions drawn from the actual article, not a generic material template.
- Stable Pinnacle/BHCL publisher identities from common portal data, with real author/reviewer attribution only when supported.
- `CollectionPage`/`ItemList` for libraries/categories, `Article` for applicable guides, `BreadcrumbList`, and visible question/answer markup where appropriate. Mark up what the reader can actually see. Product/Offer/rating data requires a real matching source and qualifying page.
- Clear semantic answers, references, related entities and ordinary crawlable links; no speculative “AI submission” claims.
- Two child sitemaps containing eligible canonical 200 pages only, included in the existing root sitemap. Proper robots/crawler directives, with preview environments noindex.
- Update applicable existing discovery/catalogue exports for new published content. Keep auth/private/API pages excluded.

Use Google's [Article guidance](https://developers.google.com/search/docs/appearance/structured-data/article) and [structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies). Valid markup or crawler access does not prove a rich result or an AI citation.

## 6. Performance and meaningful acceptance

Keep the first useful image responsive, explicitly sized and appropriately prioritised; lazy-load lower-page imagery and opt-in video. Remove duplicate export scaffolding and shared script/style copies before redesigning good content. Use useful concise category previews instead of loading every complete answer into an index.

First accept the distinct library, category/domain and detail templates, including the heaviest export and any real interaction variant. Inspect rendered opening content and the following block at phone, tablet and desktop sizes. Verify category menus, anchors, image loading, typography, call/enquiry destinations, keyboard access and common-shell isolation.

Then apply deterministic checks to every manifest record: source disposition, correct body/title identity, asset/link resolution, unique canonical, appropriate metadata/schema, valid parent relationships and absence of the weighted-blanket fallback. HTTP status alone is insufficient.

## 7. Existing tools — bounded roles and evidence

| Tool | Exact work at the release boundary |
| --- | --- |
| Screaming Frog | One saved crawl/profile over the new prefixes and old-to-new URL map; export broken destinations, redirect chains, canonical/indexability/metadata/schema findings. Repair shared causes before page-specific exceptions. |
| GSC / GSC Wizard | Use existing domain property; submit the two actual child sitemaps through the existing integration, inspect representative new templates and track migration coverage/settled performance. Record acceptance separately from indexing. |
| Bing / IndexNow | Batch materially new/changed eligible canonical URLs once; record actual response and any failures. Keep key endpoint and discovery accessible. |
| Ahrefs | Reuse completed current findings and existing project; validate the migrated collection on the next meaningful audit boundary. Do not spend API units or start repeated whole-site crawls to duplicate the local contract/Screaming Frog checks. |
| TestingBot | Representative physical iOS/Safari and Android/Chrome plus distinct supported desktop engine/layout checks; record exact OS/browser/device/resolution, run and skipped coverage. No all-device claim. |
| Lighthouse | Representative distinct templates and heaviest page; record lab LCP/CLS/TBT and comparison to the candidate. Distinguish lab evidence from field Core Web Vitals. |
| GA4 / existing outcome sources | Reuse common consent/events once. Report page/contact intent separately from acknowledged enquiries, qualified calls, walk-ins and enrolments. |
| Pitchbox | Use relevant published useful resources in qualified existing outreach; track replies and verified placements. A migration does not justify a bulk campaign. |

No new platform purchase, standing reviewer swarm, scheduler or API-key model gateway is needed for this work.

## 8. Release order and completion evidence

1. Intake complete source list and both variants; generate manifest and exact source/target dispositions.
2. Build the importer/common library layout and accept the representative page types before collection-wide application.
3. Generate all eligible pages, taxonomy relationships, correct assets and discovery maps; fix shared contract findings in one consolidated pass.
4. Run the necessary visual/device/performance and all-record checks. One read-only consolidated reviewer may improve acceptance; website owner retains edits/release.
5. Commit implementation, complete exact-source CI, prepare the current full Cloudflare asset/module/route/binding union and rollback record. Preserve Ask, Verify, Shop, auth, helpline and other protected services; do not deploy a narrowed `--route` bundle.
6. Publish main-domain pages and read back public body identity, assets, internal journeys and protected routes. Activate source-host permanent redirects only against those validated equivalents.
7. Complete one bounded Screaming Frog validation, actual sitemap/IndexNow submissions and Ahrefs audit comparison. Resolve substantive failures, recording tool/evidence dates and scope.
8. Publish a receipt listing exact delivered URLs, unique page counts, retained existing canonicals, aliases/redirects, unresolved exclusions, commit/CI, deployment/rollback, test scope and submission results.

**Completion condition:** every original content file has a verified disposition; every published canonical and mapped old route works with the shared shell and useful reader journey; discovery/measurement contracts and protected services are preserved; deployment and live public proof are recorded. Indexing, rankings, earned citations and qualified enquiries remain separately measured outcomes.

**Concrete next action:** intake the original export location/listing already requested, then build the reusable importer and a representative candidate. Keep subdomain traffic working until the portal replacement is accepted. Source completeness is the dependency; another inventory, new tool or whole-site rebuild is not.
