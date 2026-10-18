# Held-centre enquiry links — 18 October 2026

## Problem and change

TestingBot's stronger held-centre contract found eleven Vanasthalipuram enquiry links retaining its closed branch. HTML-escaped `&amp;centre=` bypassed the Worker query check, and the announcement could reconstruct the held branch from page/query metadata.

Decode actual HTML ampersand forms before parsing existing intake links; reject any held slug/facility value across repeated centre parameters. Announcement markup and its existing script permit only active known centre IDs, fail closed for missing/unknown/duplicate choices, and preserve valid active choices, service, offer and campaign parameters. Preserve all four holds, central telephone, disabled branch options and the existing private receiver rejection.

## Verification and release boundary

- 52 relevant selector/hold/announcement contracts passed locally.
-20 isolated Chromium scenarios passed at390/1440. Trusted CI runs these same ten scenarios at both widths across Chromium, Firefox and WebKit (60 cases). No fake lead, phone call or vendor event.
- Actual captured-serving-module regression and public checks are recorded under `ask-private/held-centre-links-20261018/`; deployment receipt is authoritative for release status.
- Only `shared-clearance-runtime.mjs` (two exact handler substitutions retaining all unrelated live bytes) and the preimage-matched `site-announcement.mjs` change. Preserve65other root modules,3972assets,403routes, all protected Worker settings/bindings and the private receiver.
- Generated enrolment, routing and CSS payloads are unchanged. GA4 collector and accepted-enquiry rules remain unchanged.
- Current root rollback before this release:2e5bd347-2fa9-4a5b-a023-c1e6ddd9ebb3. Advance the accepted publishing checkpoint after public/module verification so upkeep retains this repair.

This is a branch-assignment safety repair. It does not prove receipt of a genuine enquiry in GA4 or receiving-team acknowledgement.

## Live delivery receipt

PR119 merged at810d1f6a88abc880f7d33762a318d3ea6ca09dcd, sourcec502ea3f1653cb86ae50feb4d30d69958ecb1206. Trusted CI39122109509 verifies53 contracts and60 isolated cases across Chromium, Firefox and WebKit. Root version24888e79-b583-470a-ad85-d48e8f978fbc/deploymentb5b973f3-b18c-44c8-8f23-535496b93a01. Public readback passed all four held branches and open Suchitra, plus four exact assets. Common collector SHA remains9fe8541a61be52fc46d4f607475b44fea1def6a4afab9e755ea3b626b785384b. All five affected TestingBot cases subsequently passed; provider53923005 closed.

The R2 accepted runtime checkpoint is updated/readback-verified, preserving the existing operational job/outbox. All original failed attempts and the corrected private readback's mistaken universal-noindex assertion are retained on disk. The production repair changes no indexation rules.
