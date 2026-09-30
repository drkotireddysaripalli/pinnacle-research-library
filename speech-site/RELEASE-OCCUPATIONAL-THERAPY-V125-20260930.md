# Occupational Therapy corrective release v125 — 30 September 2026

## Public result

- [Occupational Therapy for children](https://www.pinnacleblooms.org/best-occupational-therapy-center-india-proven-improvement-rate) is live with a clearer first-screen family benefit and call to `9100 181 181`.
- The child’s everyday activity leads to professional assessment, a suitable goal, family-guided practice and review. Seven visible, connected stages and a new branded review illustration show how an observation at home informs the next professional conversation.
- The shared header now shows Verify, Citations and a complete More menu on phones with less vertical space. The same common header and Verify-containing footer were confirmed on all ten managed HTML pages.
- OT call, centre-jump, WhatsApp-share and enrolment link clicks now use fixed, consent-controlled analytics vocabulary. These are clicks, not answered calls or visits.
- The previously reviewed 1200 × 630 OG poster, exact evidence links, Markdown/text/JSON source outputs and the two canonical aliases remain in place.

## Source and deployment

- Code was committed and pushed to the existing GitHub `main` branch **before** Cloudflare deployment: `15bf3ed` (`Improve occupational therapy journey and shared navigation`).
- The complete Verify + managed-page union preserved Verify's index and matched **634 Verify assets** and **829 managed assets** to the generated Worker inventory. Dry run and deploy each retained five supporting modules, the `ASSETS`, `PINNACLE_LEGACY` and `PINNACLE_ASK` bindings, and `run_worker_first: true`. No `--route` option was used.
- Worker `pinnacle-verify-route` version `46a23d19-cd92-436c-9201-029e7b7e7815` is at **100% traffic** in deployment `a7737241-35b9-4204-a38d-7df05237fd63`. The immediate rollback version is v124 `83328294-bd66-44a4-ae6e-64acced0b29e`.

## Verification

- Production build: 12 pages. Focused route, discovery and measurement tests: 37/37; enrolment contract tests: 18/18; portal checks: 29/29. The real rendered OT call/enrol/share placements pass consent-on, consent-off and Global Privacy Control tests without exporting child, query or centre values.
- Chrome and Edge local checks passed at 320, 390, 768, 1024 and 1440 px. Live Chrome checked the same widths: no overflow or page errors, usable compact menu, required images and anchors present, eight visible/schema FAQs, 62 general centre listings and keyboard-operable stage disclosure. The shared phone header at 390 px measured 226 px rather than the previous 296 px.
- Public OT canonical returned 200; `/occupational-therapy` and `/t/occupational-therapy` returned direct 301 to it. Verify, FSC, PinnacleAI regulatory journey, National Autism Helpline, root/child sitemaps, `llms.txt`, Markdown and evidence exports returned the expected states.
- Ten managed pages showed identical header and footer markup. After normalising Cloudflare's analytics beacon and the **exact existing Google Ads script insertion observed only on Speech and its service-information page**, all 10 public HTML responses matched the staged source inventory. The OT page itself needed only beacon normalisation.
- W3C Nu reported **zero errors and zero warnings** for the published OT HTML. The approved OG JPEG returned 200 and SHA-256 `d6fce9fb1970e6f3d5628d980672c2ce20e813f5cbd7eaf899a83792eb439399`.
- One IndexNow notice for the materially updated OT canonical returned HTTP 200 on 30 September 2026. This confirms submission only.

## Remaining measured gates

The 100-point guide is a complete acceptance standard; this release is **not** a claimed 100/100 outcome. Current centre-specific OT professional, appointment and fee facts, call-team read-back, real family comprehension, iPhone/Safari and assistive-technology checks, field speed, indexing of this revision, ranking, AI citation, answered calls, visits and enrolments require observed data. The page does not turn the 62 general centre listings into an OT staffing roster. The 31,052,382 defined-service count remains network service volume; MD-5/BIS remain scoped to non-diagnostic software. No child outcome, cure or guaranteed mainstream placement is claimed.

## Saved receipts

- `deployment/release-occupational-v125-20260930.json`
- `deployment/occupational-live-v125-20260930.json`
- `deployment/occupational-responsive-live-v125-20260930.json`
- `deployment/shared-shell-live-v125-20260930.json`
- `deployment/machine-live-v125-20260930.json`
- `deployment/occupational-w3c-v125-20260930.json`
- `deployment/indexnow-occupational-v125-20260930.json`
