# Pinnacle engineering transition — 9 October 2026

## Result and ownership

Work toward one outcome: a parent finds useful, credible Pinnacle information, finds the appropriate service/centre, contacts **9100 181 181** or submits an enquiry, and the receiving systems can follow that genuine enquiry through to a visit and admission. Search visibility, signup, a phone tap, an accepted enquiry and admission are different measurements.

The owner explicitly requested Mac engineering teams, continuity of existing work and a practical knowledge transition. This package implements that instruction. It does not restart completed work or transfer production release authority implicitly.

| Role | Accountable chat / placement | First responsibility |
|---|---|---|
| Product, narrative, integration and production release | Existing website chat `01a0ef6b-507a-7630-828f-7ac81852a39c` | Work with the founder on the homepage/PinnacleAI; integrate reviewed patches and own deployed verification. |
| Mac build coordinator | Existing Mac chat `01a11e24-3e7f-7802-8384-a6bd83d7a7a9` | Maintain the shared local build environment, coordinate bounded tests and deliver integration-ready work. |
| Pinnacle Search Engineering | Active Mac chat `01a11e66-9290-7160-a803-db161727035f` | Complete shared technical repairs using the existing Ahrefs/GSC/Frog evidence, beginning with actual broken useful destinations. |
| Pinnacle Page Engineering | Active Mac chat `01a11e66-969e-72c3-a0d6-fdbe180c4c5a` | Build the native homepage; then continue the approved PinnacleAI design/source. |
| Commerce operations | Existing chat `01a0f6ef-1af3-7bf0-98aa-9db53523e555` | Existing Shopify/Merchant/publishing work and precise website dependencies. No duplicate commerce team. |

At most two implementation streams run in parallel. QA belongs to the coordinator and existing test system, not a new standing team. Tools such as Ahrefs, GSC, Screaming Frog, TestingBot and Pitchbox are capabilities used by accountable owners; each does not need its own chat.

### Actual dispatch state

The Mac coordinator has confirmed both chats were created locally on the Mac, with separate clean checkouts at `4e0b811a2179099947a0d1a6cc6c3ae5bca446f6`: Search uses `codex/mac-search-engineering-20261009` / port 4343; Page uses `codex/mac-page-engineering-20261009` / port 4344. The coordinator retains port 4340 and test/tooling work. Search has independently sent its first scoped investigation receipt. The Mac also confirmed the private evidence import and all 177 export hashes. Windows-to-Mac direct app dispatch remains unavailable; shared GitHub handoffs and inbound Mac messages are working. These creation/import states are confirmed by the Mac coordinator's receipt, not by a successful Windows app read-back.

## Read only what the assignment needs

1. This file: purpose, source and owners.
2. [Delivered and open](DELIVERED-AND-OPEN.md): dated evidence, remaining priorities and legacy dependencies.
3. [Team contracts](TEAM-CONTRACTS.md): the first two executable jobs, boundaries and completion requirements.
4. [Access and runbook](ACCESS-AND-RUNBOOK.md): tools, secure access, build/test and resource rules.

Follow-up delivery: [actual private evidence handover, test failures and Mac work reservation](EVIDENCE-HANDOVER.md). The Mac confirmed it received the KT and successfully ran the private evidence import. Both new chat IDs are recorded above.

For a page change also read the existing [page standard](../PINNACLE-PAGE-CREATION-WORK-ORDER.md), [common shell](../COMMON-SHELL-BASELINE.md), [vernacular contract](../VERNACULAR-TYPOGRAPHY.md) and only the relevant source receipts. Do not load the whole historical conversation or run a fresh full audit to begin.

## One repository, one integration branch, separate working copies

Canonical repository: [pinnacle-research-library](https://github.com/drkotireddysaripalli/pinnacle-research-library), integration branch `main`.

Both teams start from the latest accepted `origin/main` in separate Mac working copies/worktrees and short-lived branches. Both ultimately deliver to the same `main`. They do not concurrently edit one directory or directly race pushes to `main`. One owner integrates in order and releases the combined current source. This is an operating agreement; it does not claim GitHub branch protection was changed.

The root [build-window](../../build-window/README.md) setup is the Mac coordinator's PR [#9](https://github.com/drkotireddysaripalli/pinnacle-research-library/pull/9). Use its local preparation and candidate guards. It contains no production deployment command. The Windows working tree has unrelated unpublished files; do not copy it wholesale, reset it or stage all of it.

The final Mac setup head `b4ae6d87585d2f9fc39736cf96fe8f94dc5a27fb` was reviewed and fast-forward integrated locally. Windows independently passed both launcher/module syntax checks and all **five candidate guard tests**; the fixture cleanup now verifies its resolved temporary directory before recursive removal. The prior Mac build/unit/browser results are reused as dated evidence, not claimed as rerun on Windows. All 28 local links in this four-document package resolved to existing or newly included Git files. Publication status is established by the integration commit and repository read-back, not by this paragraph alone.

## Baseline and precedence

Latest recorded production release: **9 October, 05:54 IST**; source `c820c8a4e8c107a4ed319cab72b42222a9890e31`; Portal version `3106a925-5e4b-4cdd-b211-d026ff52af48`; deployment `df99e622-e66f-48db-b596-00351ef51d8d`; **307 routes and 3,706 assets**. The repository subsequently recorded these receipts at `10425a0b86aafb5e1d7ada114cc2325e943abc5b`. The tooling/KT integration is not another website deployment.

Authority order: latest explicit human decision; current live provider read-back at the next release boundary; newest applicable release receipt; maintained source; older work orders and saved audit findings. A historical heading saying “current” is not current evidence. In particular, the 8 October automatic-enquiry/source receipts and 9 October API/GBP receipts supersede older outstanding lists in the active work order and evidence profile.

No fresh production, Ahrefs account or complete traffic re-audit was performed to write this package. Its operational facts are explicitly dated and linked. At the next release, refresh only the affected live baseline and protected dependencies once.

## Completion report from each team

Return: **problem → changed files/URLs → exact base/head commit → checks actually run → skipped coverage → remaining dependency/owner → next action**. A production completion additionally needs deployment ID and live public proof. Report failures directly. No new hourly scheduler, duplicate campaign, inflated “health” score or synthetic lead counts.
