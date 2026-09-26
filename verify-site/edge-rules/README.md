# Legacy research citation redirect

## Purpose

The published [Question Comprehension study PDF](https://www.pinnacleblooms.org/Assets/Article/pdf/Study_11_Question_Comprehension_Improvement_Study_Global_Research.pdf) cites www.pinnacleblooms.org/research on page 5. That exact route returned HTTP 404 on 26 September 2026.

The permanent redirect sends readers to the [current research library](https://www.pinnacleblooms.org/verify/evidence/research-library.html). This library links the study index, the Global Research Whitebook source record and canonical DOI publications, preserving the bibliographic purpose.

## Scope and installation

The accompanying JSON is a single rule for the existing Cloudflare zone ruleset in phase `http_request_dynamic_redirect`. It matches only GET and HEAD requests on the apex and www hosts for /research and /research/. It drops query parameters because this legacy printed citation has no defined query semantics. It does not change /research-studies, research subpaths, form submissions, Workers, asset bundles or origin templates.

Create once through the Rulesets API; inspect the existing ruleset for the same ref first. Position before the apex-to-www rule to avoid an extra redirect. Do not replace the entire ruleset.

## Durability and ownership

This is deployed Cloudflare edge configuration, independent of ordinary origin site deployments. Preserve the rule in any future Cloudflare configuration migration. The website team does not need to paste it into application templates. All implementation and deployment ownership stays in the Verify task.

## Rollback

Disable only the deployed rule by its ID through the rule-update endpoint. Retain unrelated redirect rules. See the deployment receipt for the returned ID and verified version.

## Verification

Check both hosts, trailing-slash variants and GET/HEAD, with query stripping and a final HTTP 200 research library. Confirm its self-canonical URL, study-index link and sitemap entry. Recheck the existing homepage, Verify, helpline, study PDF and /research-studies as controls. Configuration verification checks that the eight pre-existing rules remain unchanged.

A repaired citation route is a technical discovery improvement; it does not establish a new independent backlink, search ranking or AI citation.

[Cloudflare API documentation](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-api/)
