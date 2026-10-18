import base from './entry-base.mjs';
import {urlHealthAlias,repairUrlHealth} from './url-health-repair.mjs';
import {repairLegacyExclusions as repairLegacyMeasurement} from './legacy-measurement.runtime.mjs';
import {createSelectedLegacyWrapper} from './selected-reference-legacy.mjs';
// Release gate: publish the two exact-path GTM GA4/WhatsApp exceptions before
// enabling reviewedPublicTemplates below. Keep false until the paired release
// is approved; retain the GTM-W9ZHX459 ClickGUARD loader and iframe.
export default createSelectedLegacyWrapper({async fetch(request,env,ctx){const alias=urlHealthAlias(request);if(alias)return alias;return repairLegacyMeasurement(request,repairUrlHealth(request,await base.fetch(request,env,ctx)),{reviewedPublicTemplates:false});}});
