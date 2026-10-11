import base from './entry-base.mjs';
import {urlHealthAlias,repairUrlHealth} from './url-health-repair.mjs';
import {repairLegacyMeasurement} from './legacy-measurement.mjs';
export default {async fetch(request,env,ctx){const alias=urlHealthAlias(request);if(alias)return alias;return repairLegacyMeasurement(request,repairUrlHealth(request,await base.fetch(request,env,ctx)));}};
