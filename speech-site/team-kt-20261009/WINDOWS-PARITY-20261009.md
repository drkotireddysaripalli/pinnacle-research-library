# Windows parity response — 9 October, commerce release boundary

This is the verified Windows boundary, not an assertion that both hosts are identical. Direct delivery to coordinator thread01a11e24-3e7f-7802-8384-a6bd83d7a7a9 failed because the app reports its durable host unavailable; this canonical repository record provides the exact response without repeated retries.

| Area | Verified state / difference | Next action |
|---|---|---|
| Canonical source | PR14 merged as a66e39bc93e7aabb1f0a0f62c8d3834901e97426; release receipts at902dac3. No concurrent Mac deployment. | Rebase new source candidates onto current main. |
| Actual Windows runtime | Bundled Node**24.19.0**; existing npm CLI**11.13.0**, read back9October. Mac reports24.21.0 but was not independently inspected here. | Record this exact difference; do not claim Windows24.21.0 parity. A declared runtime baseline should be changed in the tooling candidate with purposeful checks, not by silently replacing the app-managed runtime. |
| Book source / CI |04db8279873357e4e996ccaf672c2127b5abaf20; Portal quality37913981740 passed including trusted TestingBot candidate BVT, Ask and local browser checks. | Reuse unchanged results. This does not establish physical-device or real customer outcomes. |
| Live portal |0eb2b445-f488-425a-a2e5-c506bb6ef463; deploymenta605572b-fdfc-47b9-b131-9b3d0ac4f1bb;64/64 changed public routes passed. | Use this current baseline, retain307routes/3706assets and all protected services. |
| Receipt backend |pbn-planetscale4933e7ee-184b-4528-b145-a977e8cf1435 remains unchanged in this release's API read-back. | One actual approved internal TEST remains separate from code/invalid-input probes; no contact or record was invented here. |
| Mac tooling candidate | Scope received: build-window runner/launcher/docs/guards and portal-quality workflow; it does not overlap this completed retailer source. | Continue the declared clean-worktree patch. No portal package/runtime/product edit is included in my current theme work. |
| Earlier navigation/metadata/directory/resources candidates |604b504,72a27a5,019ae7e,223af579+909cab35 were named by coordinator, but their dispositions were not re-audited in the bounded commerce release. | Keep each candidate pending its actual integration receipt; do not infer acceptance from this table. |
| Hosted Shopify theme | Private implementation724068117eb6aa19b617dea9fc25036a675bad1d; discovery receipt follows on the same private branch.102 Liquid and11 isolated browser checks passed. | Mac authenticated admin must compare current hosted files and apply exact patch, with33-product/variant read-back. Not a new source owner or second portal deployment. |

The nine-step proposed shared procedure is aligned with the current ownership and evidence model. Its unresolved gates remain real: private runtime inputs, actual receiver acceptance, approved internal test identity/Slack audience, current hosted theme comparison, and operational call/admission outcomes. Registered CI does not by itself prove these passed.

Broader growth schedules stay stopped. No new daily TestingBot run, crawler, campaign, customer record, purchase, refund, credential, product sync or provider security change was made in the commerce pass. Existing generated files in the source checkout were left untouched and unstaged.
