# Portal header and footer restoration — 27 September 2026

## Released

The speech page and its dated service-information page now use one shared portal header/footer, matching the live Pinnacle homepage's visual language and full navigation. Source: https://www.pinnacleblooms.org/ inspected 27 September 2026.

- Original large Pinnacle logo, Sintony type, purple utility icons, main navigation and six therapy categories.
- All six therapy submenus restored. A complete Menu directory remains available on desktop and mobile, including research, resources, portals, therapies, TV, franchises and quick actions.
- Original purple footer gradient and first-party decorative artwork, four desktop columns, locations, contact details, social channels, policies, research and portals.
- Full seven-item action strip restored. Certified Course and Franchise use their existing destinations.
- Shared source: SiteHeader.astro, SiteFooter.astro, PortalFooterGroup.astro, portal-navigation.json and portal-shell.css. Future pages use these components instead of separate page menus.

## Intentional corrections

Eight old speech anchors still used elsewhere on the existing website remain supported. The Fee / Cost anchor opens the fee disclosure. Adult Services routes to Contact for enquiry; this child-focused page does not assert adult-service availability. Empty Innovations and homepage-placeholder language/interpreter links were omitted. Duplicate ABA links were consolidated. Existing original footer superlatives were not copied as facts. The existing evidence-led purpose and legal operator identification remain.

## Review and verification

Three independent AI read-only reviews covered navigation continuity, parent/mobile usability, and evidence/claims. Root implemented all changes. Findings resolved: restored legacy anchors, mobile accessible names for Login/Donate, original channel heading and quick actions, enlarged mobile dropdown tap areas.

Desktop, 768px tablet, 390px and 320px mobile layouts were inspected. Complete Menu, therapy disclosure, keyboard Enter/Escape and legacy fee navigation were exercised. Native details remain usable without JavaScript. No patient form submission or live call was made.

Nine portal checks confirm 168 documented link entries, six therapy menus, eight legacy anchors, current section targets and portal destinations. Nineteen measurement/routing tests passed. Fifteen production checks passed; all31 speech resources return200 and match staged bytes. All636 files in the copied Verify build were byte-identical, of which634 are public upload assets (two Markdown files are excluded by the existing uploader). Homepage, Verify, FSC, story and helpline returned their prior content hashes. Existing enrolment form and payment returned200; their dynamic responses are not claimed byte-identical.

## Deployment and source

Current Worker version80: cfbb08ed-27f3-4bce-a5dc-c1326a1982cd.
Deployment: 2bba0a4e-cb11-4b6b-8f1f-b7a11ca3e865, 100 percent.
665 public assets:634 Verify +31 speech. Existing two modules, all three bindings, Worker-first assets, routes and edge rules retained.
Rollback for this work: v77 9a0a1281-152b-439f-9bf4-ad1d708b6279. No route removal required.

This release establishes visible navigation, accessibility and technical checks; it does not establish new ranking, AI citation, referral or conversion results. Existing same-day IndexNow submission is retained without repetition.

## Final mobile lab result

Lighthouse13.5.0:99 performance,100 accessibility,100 best practices,100 SEO. LCP2.19 seconds,CLS0,TBT0. See PORTAL-PERFORMANCE-20260927.json. A valid report was written before a Windows temporary-directory cleanup error. Preview restored to noindex after publishing.
