import base from './entry-base.mjs';
import {urlHealthAlias,repairUrlHealth} from './url-health-repair.mjs';
import {repairLegacyExclusions as repairLegacyMeasurement} from './legacy-measurement.runtime.mjs';
import {createSelectedLegacyWrapper} from './selected-reference-legacy.mjs';
// Paired release: GTM version 7 published/read back on 18 October 2026;
// tags 3/6/7/9 exclude both exact legacy paths and canonical-owned pages.
// Preserve the existing GTM-W9ZHX459 loader and iframe.
export default createSelectedLegacyWrapper({async fetch(request,env,ctx){const alias=urlHealthAlias(request);if(alias)return alias;return repairLegacyMeasurement(request,repairUrlHealth(request,await base.fetch(request,env,ctx)),{reviewedPublicTemplates:true});}});
