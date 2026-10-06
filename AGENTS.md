# Public portal source and release ownership

These instructions concern the website directories in this repository; existing research records retain their own source and publication requirements.

- Read `PORTAL-OWNERSHIP.md` before work on Ask, Sunshine, FAQ, Verify, Shop or Books. It identifies maintained source, external dependencies and the single website implementation/release owner assigned by Dr. Koti on 6 October 2026.
- Reconcile all corporate-site code into this repository. The Mac commerce task supplies catalogue/publishing evidence and any source handoff; it does not independently deploy a second corporate-site checkout. A later direct owner instruction may change that assignment.
- The separately hosted Shopify theme source is the pinned private `commerce-shopify/` component. Preserve its licence and privacy; do not vendor the derived theme into this public repository. Obtain fresh hosted-theme source before changing it; the transferred snapshot is historical. The corporate Shop frontend remains in `speech-site/`.
- `speech-site/ACTIVE-PAGE-WORK-ORDER.md` identifies the current task and latest accepted release. Historical READMEs, old Worker snapshots and dated release scripts are not current deployment instructions.
- Follow `speech-site/AGENTS.md` and its referenced page work order for managed pages. Keep the accepted common header/footer and native Anek contract in shared files; do not fork them per page or area.
- Preserve the complete current Cloudflare route/binding/asset union, Ask authentication and imported legacy fallbacks, Verify evidence, Shopify purchase flows and protected services. Use current live version checks and a declared rollback for a real deployment. Do not deploy with a narrowed route argument.
- Keep credentials, customer information, private paid books and download entitlements out of this public repository. A public catalogue record or code handoff does not authorise changing commercial records or inventing availability.
- Reuse existing checks and receipts. Ownership/documentation changes do not require a runtime redeploy, search resubmission, browser/device rerun or new agent swarm. Preserve explicit schedule holds.
