import base from './entry-base.mjs';
import {urlHealthAlias,repairUrlHealth} from './url-health-repair.mjs';
import {repairLegacyExclusions as repairLegacyMeasurement} from './legacy-measurement.runtime.mjs';
import {createSelectedLegacyWrapper} from './selected-reference-legacy.mjs';
export default createSelectedLegacyWrapper({async fetch(request,env,ctx){const alias=urlHealthAlias(request);if(alias)return alias;return repairLegacyMeasurement(request,repairUrlHealth(request,await base.fetch(request,env,ctx)));}});
