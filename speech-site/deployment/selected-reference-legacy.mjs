import {legacyMeasurementScope,repairLegacyMeasurement} from './legacy-measurement.mjs';
import {repairSelectedReferences} from './selected-reference-gallery.mjs';
export function createSelectedLegacyWrapper(original){return {...original,async fetch(request,env,ctx){
 let response=await original.fetch(request,env,ctx);
 if(legacyMeasurementScope(request)==='knowledge')response=await repairLegacyMeasurement(request,response);
 return repairSelectedReferences(request,response);
}};}
