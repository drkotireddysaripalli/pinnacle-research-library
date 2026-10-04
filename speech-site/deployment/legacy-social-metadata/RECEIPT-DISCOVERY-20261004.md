# Services and physiotherapy discovery — verified release

4 October 2026. Action `4b873988-d047-41ed-baac-2101d37ef676`, item `WEB-LEGACY-INTERNAL-DISCOVERY`.

Source `84b7b18222c34eaa8a4195afa9b48fe370661d9f` was pushed to main before deployment. Worker `pinnacle-legacy-social-metadata` version `78567d26-c85c-44e9-ae42-35c0f0ed4b91`, deployment `5305e2d0-ac35-426d-95bf-def432e24629` at 100%. Rollback version `e4b76e81-3f83-4710-9699-74027cb335a5`; remove only the two newly recorded route IDs when rolling back routing.

## Public result

- [Existing Physio Therapy menu destination](https://www.pinnacleblooms.org/physio-therapy) now returns a 301 to [the canonical physiotherapy page](https://www.pinnacleblooms.org/physiotherapy). Previously it served duplicate content declaring the unrelated `d` subdomain as canonical. Query strings and normal browser section-anchor inheritance remain intact; the canonical page's HTML is unchanged.
- [The services hub](https://www.pinnacleblooms.org/top-autism-therapy-services-india-proven-improvement-rate) now declares its own www HTTPS canonical and social URL, replacing the observed books-host pair. Its existing Physio Therapy link points directly to `/physiotherapy` with the same visible wording and styling. `/services` retains its existing redirect to this hub.
- The approved managed common header/footer source and all page content are unchanged. Existing menu links are corrected by the shared alias route. Staff directory membership, profile pages and operation/availability claims are untouched.

## Verification

- 48 focused runtime tests passed: alias/query/HEAD behavior; sensitive methods/headers and path neighbours; services identity/link-only changes; prior FAQ debug filtering and protected response handling.
- Downloaded deployed module hashes match pushed source. All 191 pre-existing route records, five Workers' binding sets, and four other application versions are preserved. Two narrow new routes make 193 total; no broad catch-all, assets or authentication change.
- Public before/after comparison permits only the two services metadata fields and its one existing link target; nine other sampled responses are identical after normalising Cloudflare injection/font order. These include Ask, Verify, enrolment, books, PinnacleAI, staff, the sitemap, canonical physiotherapy and the prior FAQ repair.
- Chrome at 390px and 1440px: actual services link click reaches the right page, `#why-section` and query navigation survive the alias redirect, no horizontal page overflow, five existing national telephone links present. No calls or forms were submitted. Inspected screenshots confirm the preserved legacy presentation, not a whole-site design certification.
- Screaming Frog's three-URL list confirms 301 for the alias and 200/indexable/self-canonical for both destinations. A redirect should be non-indexable; it consolidates into its target.
- IndexNow accepted the two materially changed URLs with HTTP 200 and validated key. Batch `55c19fc8-fc4c-4613-b611-6df1ea8755c5`. This is submission acceptance, not indexing or ranking.
- GSC Wizard annotation `ff422f97-0870-4427-9596-8f10d14757d7` records the release. No new Ahrefs query, full crawl, campaign, external message or duplicate submission was made.
- Exact source CI: [Portal quality run 37209115890](https://github.com/drkotireddysaripalli/pinnacle-research-library/actions/runs/37209115890) completed successfully, including Ask build and portal checks. The specific public legacy-page behavior is verified separately above.

## Scope reconciliation

Ahrefs' 7,019 indexable orphan findings come from a capped main crawl that excluded Ask/Verify and did not render JavaScript. They are not all verified missing public links. The two sampled staff pages do not appear among the current directory's 241 links and carry dated employment-status notices; sitemap presence alone is insufficient to add current-staff discovery links. No such additions were made.

Legacy copy/design, HTTP structured-data self references and other template issues remain separately governed work. No rankings, AI citations, connected calls or qualified enquiries are claimed from this release.

Full main-workspace evidence: `work/pinnacle-growth-system/internal-discovery-20261004/`, including before/after HTML, exact changed/control URLs, deployment/route/module hashes, browser screenshots, Screaming Frog exports, submission receipts and completion JSON.
