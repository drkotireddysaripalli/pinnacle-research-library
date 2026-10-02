# Pinnacle Figma connection

Verified 2 October 2026 against the connected care@pinnacleblooms.org account: Pinnacle Blooms Network of Bharath Healthcare LTD, Organization plan, Full seat, admin role.

## Working access

- Official Figma connector reads the file, native layers, fonts, component metadata and renders.
- Native editing creates text, auto-layout components, instances, variables and shared styles.
- Chrome provides the existing authenticated Figma interface for actions such as publishing library changes.
- The initial reference is published privately to the existing Pinnacle team library, not the Community.

[Editable desktop and phone-width reference](https://www.figma.com/design/d8vh31TNzcynM5d2dKh7gV/Pinnacle-Blooms-Network-s-team-library?node-id=3313-16)

[Main component](https://www.figma.com/design/d8vh31TNzcynM5d2dKh7gV/Pinnacle-Blooms-Network-s-team-library?node-id=3313-12)

## Scope of this proof

One existing PinnacleAI phone anchor pattern, using the real source SVG, Sintony Bold, approved action colour, 9100 181 181 and tel:+919100181181. The desktop instance is 212 x 52 and the phone-width instance is 350 x 52. The reference frame is 820 x 520. The six variables, text style and shadow are editable and published.

This is a default-state design reference. It does not establish a complete production design system, full responsive page acceptance or accessibility acceptance. Production CSS requests weight 900 while the installed Sintony faces are 400 and 700; the design uses the available Bold face. Variable code syntax has exact-value CSS fallbacks; those custom variables are not defined in production.

## Code Connect finding

The existing source is an inline anchor in `src/components/PinnacleOverviewBody.astro`, not an exported CallButton component. `PinnacleAICallAction.figma.ts` records the actual Astro snippet, imports, source and Figma node.

The connector accepted a template argument but read-back reported `hasTemplate:false`. Its generated preview then imported the descriptive pattern name as a component. That incomplete mapping was removed and an empty mapping was verified. No generated code was copied into the website. Source documentation remains attached to the Figma component.

The executable template is prepared but **not published or execution-verified**. Before activating automatic component reuse, use supported Code Connect template publishing and verify that it returns the actual Astro anchor. The connector currently has no Astro label; the prepared template uses a Markdown code fence to keep its language explicit. Figma's CLI supports framework-agnostic templates: <https://developers.figma.com/docs/code-connect/template-files/>.

## Working method

1. The approved page work order and source evidence govern the narrative. For `/pinnacleai`, PinnacleAI is the subject; the child and family are its purpose. Paradigm Shift, therapies, home practice, Self-Sufficient, Mainstream and Verify explain its mechanism and proof.
2. Use Figma for the reader journey, visual composition, typography, responsive frames and reusable blocks. Preserve the settled common header and footer in their common source files.
3. Use the approved image-generation capability for complete branded creatives, then place assets in Figma and Astro. A Figma subscription does not establish which image model or billing route was used.
4. Implement through the existing Astro repository. Figma edits do not automatically modify source or deploy the site.
5. Inspect the rendered changed sections and use the existing browser/device suite. GSC/Bing and conversion measurement assess discovery and business results separately.

No additional purchase or pasted password/API secret is required for the verified editing workflow. Desktop Figma MCP and a dedicated REST/CLI credential are optional separate access paths, not prerequisites for native editing through the present connector. A GitHub app connection should be scoped to the existing repository if later enabled.

## Next useful design work

Use this connection to develop the PinnacleAI hero, readable lifecycle, evidence-to-benefit blocks and family example at desktop and phone sizes. Reuse approved assets and source components. Do not rebuild the complete portal or duplicate the shared shell merely to populate Figma.

No production page, shared component, route, deployment or account-authentication configuration was changed by this connection proof.
