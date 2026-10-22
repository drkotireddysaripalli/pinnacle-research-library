import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {normaliseReferrerOrigin} from '../public/pinnacle-pages-scripts/enquiry-referrer.mjs';
export {sha,patchAsset,addAsset} from './qa-provenance-patch.mjs';
const normalizer=normaliseReferrerOrigin.toString()+'\n';
const sha=b=>createHash('sha256').update(b).digest('hex');
function once(text,before,after){assert.equal(text.split(before).length-1,1,'One exact origin patch seam: '+before.slice(0,100));return text.replace(before,()=>after);}
export function patchAcquisition(before,variable='value',{helpline=false}={}){
 assert(!before.includes('function normaliseReferrerOrigin('));let text=before;
 text=once(text,'["schemaVersion", "consent", "capturedAt", "landingPath", "fields"]','["schemaVersion", "consent", "capturedAt", "landingPath", "fields", "referrerOrigin"]');
 text=once(text,'if (!entries.length || entries.length > ACQUISITION_KEYS.length) return null;','if (entries.length > ACQUISITION_KEYS.length) return null;');
 if(helpline){
  text=once(text,'  if (value.landingPath === HELPLINE_PATH && !validHelplineCampaign(value.fields)) return null;\n','');
  text=once(text,'  const entries = Object.entries(value.fields);','  const entries = Object.entries(value.fields);\n  if (value.landingPath === HELPLINE_PATH && entries.length && !validHelplineCampaign(value.fields)) return null;');
 }
 const result=`return { schemaVersion: 1, consent: "analytics_accepted", capturedAt: ${variable}.capturedAt, landingPath: ${variable}.landingPath, fields };`;
 text=once(text,result,`const referrerOrigin = normaliseReferrerOrigin(${variable}.referrerOrigin);\n  if (!entries.length && (!referrerOrigin || referrerOrigin !== ${variable}.referrerOrigin)) return null;\n  return { schemaVersion: 1, consent: "analytics_accepted", capturedAt: ${variable}.capturedAt, landingPath: ${variable}.landingPath, fields, ...!entries.length ? { referrerOrigin } : {} };`);
 return normalizer+text;
}
export function patchAnalytics(before){
 let text=patchAcquisition(before,'value2');
 text=once(text,'sourceStatus: acquisition ? "permitted_campaign" : "unknown",','sourceStatus: acquisition ? (Object.keys(acquisition.fields).length ? "permitted_campaign" : "observed_referrer") : "unknown",\n      referrerOrigin: acquisition?.referrerOrigin || null,');
 text=once(text,'acceptedWithPermittedCampaign: rows.filter((r) => r.event === "enquiry_accepted" && r.acquisition).length','acceptedWithPermittedCampaign: rows.filter((r) => r.event === "enquiry_accepted" && r.sourceStatus === "permitted_campaign").length,\n      acceptedWithObservedReferrer: rows.filter((r) => r.event === "enquiry_accepted" && r.sourceStatus === "observed_referrer").length');
 return text;
}
export function patchShared(before){
 assert(!before.includes('function normaliseReferrerOrigin('));let text=before;
 text=once(text,'["schemaVersion","consent","capturedAt","landingPath","fields"]','["schemaVersion","consent","capturedAt","landingPath","fields","referrerOrigin"]');
 text=once(text,'if(!t.length||t.length>Ee.length)return null;','if(t.length>Ee.length)return null;');
 text=once(text,'return{schemaVersion:1,consent:"analytics_accepted",capturedAt:e.capturedAt,landingPath:e.landingPath,fields:n}','let ro=normaliseReferrerOrigin(e.referrerOrigin);if(!t.length&&(!ro||ro!==e.referrerOrigin))return null;return{schemaVersion:1,consent:"analytics_accepted",capturedAt:e.capturedAt,landingPath:e.landingPath,fields:n,...!t.length?{referrerOrigin:ro}:{}}');
 return normalizer+text;
}
export function patchAttribution(before,old,after){
 const pattern=/export const attributionScripts=(\{[^\n]+\});/;const m=before.match(pattern);assert(m);const records=JSON.parse(m[1]);
 for(const k of ['/pinnacle-pages-scripts/speech-measurement.js','/books/resources/measurement-v1.js']){
  assert.equal(records[k].text,old);assert.equal(records[k].sha256,sha(old));records[k]={...records[k],text:after,sha256:sha(after)};
 }
 return before.replace(pattern,()=> 'export const attributionScripts='+JSON.stringify(records)+';');
}
export function patchHelpline(before,old,source){
 const get=name=>{const m=before.match(new RegExp('export const '+name+' = ([^\\n]+);'));assert(m);return JSON.parse(m[1]);};
 const html=get('HELPLINE_HTML');assert.equal(createHash('sha256').update(old).digest('base64'),get('ANALYTICS_CSP_HASH'));
 const next=once(html,old,source);let text=before;
 for(const [name,value]of [['HELPLINE_HTML',next],['HELPLINE_ETAG','"'+sha(next).slice(0,24)+'"'],['ANALYTICS_CSP_HASH',createHash('sha256').update(source).digest('base64')]]){
  const re=new RegExp('export const '+name+' = [^\\n]+;');assert.equal((text.match(new RegExp(re.source,'g'))||[]).length,1);text=text.replace(re,()=> 'export const '+name+' = '+JSON.stringify(value)+';');
 }
 return text;
}
