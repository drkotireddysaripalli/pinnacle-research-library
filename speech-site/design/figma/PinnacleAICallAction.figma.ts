// url=https://www.figma.com/design/d8vh31TNzcynM5d2dKh7gV/Pinnacle-Blooms-Network-s-team-library?node-id=3313-12
// source=src/components/PinnacleOverviewBody.astro
// component=PinnacleOverviewBody call action
// Displayed as Markdown because the connector has no Astro label.
// This fixed reference maps the existing anchor, not a new CallButton component.
import figma from 'figma'

export default {
  example: figma.code`\`\`\`astro
---
import Icon from './Icon.astro';
import { phone } from '../data/site';
---

<a
  class="wave2-button wave2-primary"
  href={phone.href}
  data-cta="pinnacleai-call"
>
  <Icon name="phone" />
  Call {phone.display}
</a>
\`\`\``,
  id: 'pinnacleai-call-action',
  metadata: { nestable: false }
}
