import assert from 'node:assert/strict';
import vm from 'node:vm';
import {sha,patchAsset} from './qa-provenance-patch.mjs';
import {patchHelpline} from './referrer-origin-patch.mjs';
import {replaceBundledCall} from './asset-regression-patch.mjs';
export {sha};
export const changedModules={
 'pbn-planetscale':[],
 'pinnacle-verify-route':['book-attribution-assets.mjs','legacy-measurement.runtime.mjs','public-ad-call.mjs','shared-clearance-runtime.mjs'],
 'pinnacle-legacy-social-metadata':['legacy-measurement.runtime.mjs','selected-reference-legacy-runtime.mjs'],
 'pinnacle-helpline':['worker.mjs'],
 'pinnacle-google-ads-call-measurement':['index.mjs']
};
export function assetBody(text,key){
 const marker=JSON.stringify(key)+':{body:';
 assert.equal(text.split(marker).length,2,'Exactly one compiled asset: '+key);
 const tail=text.slice(text.indexOf(marker)+marker.length);
 const m=tail.match(/^(`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\])*")(,sha256:")([a-f0-9]{64})("\})/);
 assert(m);const body=vm.runInNewContext(m[1]);assert.equal(sha(body),m[3]);return body;
}
export function exportedLiteral(text,name){
 const m=text.match(new RegExp('export const '+name+' = ([^\\n]+);'));assert(m);return JSON.parse(m[1]);
}
export function patchBootstrap(text,before,after){
 const re=/^var BOOTSTRAP = (`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\])*");$/m,m=text.match(re);assert(m,'Existing call bootstrap literal');
 const body=vm.runInNewContext(m[1]),oldGate=qaGate(body);
 if(before!==null)assert.equal(oldGate,qaGate(before),'Known previous QA gate');
 const updated=body.replace(oldGate,qaGate(after));
 return text.replace(re,()=> 'var BOOTSTRAP = '+JSON.stringify(updated)+';');
}
export function qaGate(body){const a=body.indexOf('  let qa='),b=body.indexOf('  if(!window.__pinnacleProtectionContainer)',a);assert(a>=0&&b>a);return body.slice(a,b);}
export function patchModules(modules,{oldSource,newSource,oldCallModule,newCallModule,newLegacy}){
 const result=Object.fromEntries(Object.entries(modules).map(([w,ms])=>[w,{...ms}]));
 const update=(w,n,fn)=>result[w][n]=Buffer.from(fn(result[w][n].toString()));
 const portal='pinnacle-verify-route',legacy='pinnacle-legacy-social-metadata';
 for(const n of ['speech-measurement.js','protection-consumer.mjs']){
  update(portal,'shared-clearance-runtime.mjs',s=>patchAsset(s,'/pinnacle-pages-scripts/'+n,oldSource[n],newSource[n]));
 }
 update(portal,'book-attribution-assets.mjs',s=>{
  const pattern=/export const attributionScripts=(\{[^\n]+\});/;const m=s.match(pattern);assert(m);const records=JSON.parse(m[1]);
  for(const [key,name] of [['/pinnacle-pages-scripts/speech-measurement.js','speech-measurement.js'],['/books/resources/measurement-v1.js','speech-measurement.js'],['/pinnacle-pages-scripts/protection-consumer.mjs','protection-consumer.mjs']]){
   assert.equal(records[key].text,oldSource[name]);assert.equal(records[key].sha256,sha(oldSource[name]));
   records[key]={...records[key],text:newSource[name],sha256:sha(newSource[name])};
  }
  return s.replace(pattern,()=> 'export const attributionScripts='+JSON.stringify(records)+';');
 });
 assert.equal(result[portal]['public-ad-call.mjs'].toString(),oldCallModule);
 result[portal]['public-ad-call.mjs']=Buffer.from(newCallModule);
 for(const w of [portal,legacy])update(w,'legacy-measurement.runtime.mjs',s=>replaceBundledCall(s,newLegacy));
 const oldPath='/pinnacle-pages-scripts/portal-ad-call-'+sha(oldSource['google-ads-call-consent.mjs']).slice(0,16)+'.mjs';
 const newPath='/pinnacle-pages-scripts/portal-ad-call-'+sha(newSource['google-ads-call-consent.mjs']).slice(0,16)+'.mjs';
 update(legacy,'selected-reference-legacy-runtime.mjs',s=>{assert.equal(s.split(oldPath).length,2);return s.replace(oldPath,newPath);});
 update('pinnacle-helpline','worker.mjs',s=>patchHelpline(s,oldSource['phone-analytics.js'],newSource['phone-analytics.js']));
 update('pinnacle-google-ads-call-measurement','index.mjs',s=>patchBootstrap(s,oldSource['google-ads-call-consent.mjs'],newSource['google-ads-call-consent.mjs']));
 return result;
}
