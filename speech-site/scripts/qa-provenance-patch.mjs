import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {normaliseValidationHints} from '../public/pinnacle-pages-scripts/enquiry-validation.mjs';
export const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const normalizer=normaliseValidationHints.toString()+'\n';
function once(text,before,after){assert.equal(text.split(before).length-1,1,'One exact QA patch seam: '+before.slice(0,100));return text.replace(before,()=>after);}
export function observeBlock(source){const found=source.match(/\/\* PINNACLE_QA_PROVENANCE_START \*\/[\s\S]*?\/\* PINNACLE_QA_PROVENANCE_END \*\//g)||[];assert.equal(found.length,1);return found[0];}
export function addObservation(before,source){assert(!before.includes('PINNACLE_QA_PROVENANCE_START'));return once(before,'  let validationTraffic =',observeBlock(source)+'\n  let validationTraffic =');}
export function patchReceipt(before){
 let text=before;assert(!text.includes('function normaliseValidationHints('));
 text=once(text,'["page", "contract", "topic", "acquisition"]','["page", "contract", "topic", "acquisition", "validation"]');
 text=once(text,'const acquisition = normaliseAcquisition2(source.acquisition);','const acquisition = normaliseAcquisition2(source.acquisition), validation = normaliseValidationHints(source.validation);');
 text=once(text,'topic: lead.Subject, ...acquisition ? { acquisition } : {}','topic: lead.Subject, ...acquisition ? { acquisition } : {}, ...validation ? { validation } : {}');
 text=once(text,'const acquisition = normaliseAcquisition(source?.acquisition);','const acquisition = normaliseAcquisition(source?.acquisition), validation = normaliseValidationHints(source?.validation);');
 text=once(text,'contract: "website_enrolment_v1", ...acquisition ? { acquisition } : {}','contract: "website_enrolment_v1", ...acquisition ? { acquisition } : {}, ...validation ? { validation } : {}');
 text=once(text,'["page", "contract", "acquisition"]','["page", "contract", "acquisition", "validation"]');
 return normalizer+text;
}
export function patchAnalytics(before){
 assert(!before.includes('function normaliseValidationHints('));
 let text=once(before,'const acquisition = normaliseAcquisition(source?.acquisition, Number(r.createdAtMs));','const acquisition = normaliseAcquisition(source?.acquisition, Number(r.createdAtMs));\n    const validation = normaliseValidationHints(source?.validation);');
 text=once(text,'sourceStatus: acquisition ? "permitted_campaign" : "unknown",','sourceStatus: acquisition ? "permitted_campaign" : "unknown",\n      validation, trafficClassification: validation ? "client_marked_qa" : "unknown",');return normalizer+text;
}
export function patchPublicHandler(before){
 assert(!before.includes('function normaliseValidationHints('));
 let text=once(before,'["page", "acquisition"]','["page", "acquisition", "validation"]');
 text=once(text,'const acquisition = normaliseAcquisition(source?.acquisition);','const acquisition = normaliseAcquisition(source?.acquisition), validation = normaliseValidationHints(source?.validation);');
 text=once(text,'contract: "website_enrolment_v1", ...acquisition ? { acquisition } : {}','contract: "website_enrolment_v1", ...acquisition ? { acquisition } : {}, ...validation ? { validation } : {}');return normalizer+text;
}
export function patchSharedHandler(before){
 let text=before;
 text=once(text,'Object.keys(e).every(a=>["page","acquisition"].includes(a))','Object.keys(e).every(a=>["page","acquisition","validation"].includes(a))');
 text=once(text,'!P(e.source,["page","acquisition"])','!P(e.source,["page","acquisition","validation"])');
 text=once(text,'function ya(e){let a=j(e?.acquisition);return{page:ba,contract:"website_enrolment_v1",...a?{acquisition:a}:{}}}','function ya(e){let a=j(e?.acquisition),qa=normaliseValidationHints(e?.validation);return{page:ba,contract:"website_enrolment_v1",...a?{acquisition:a}:{},...qa?{validation:qa}:{}}}');
 text=once(text,'function je(e,a,t){let n=j(t?.acquisition);return{...e,WebsiteReceipt:{schemaVersion:1,requestId:a,source:{page:v,contract:be,topic:e.Subject,...n?{acquisition:n}:{}}}}}','function je(e,a,t){let n=j(t?.acquisition),qa=normaliseValidationHints(t?.validation);return{...e,WebsiteReceipt:{schemaVersion:1,requestId:a,source:{page:v,contract:be,topic:e.Subject,...n?{acquisition:n}:{},...qa?{validation:qa}:{}}}}}');
 return normalizer+text;
}
export function patchAsset(text,key,before,after){
 const marker=JSON.stringify(key)+':{body:';let start=text.indexOf(marker);assert(start>=0);assert.equal(text.indexOf(marker,start+1),-1);start+=marker.length;
 const tail=text.slice(start),m=tail.match(/^(`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\])*")(,sha256:")([a-f0-9]{64})("\})/);assert(m,'Known compiled asset literal');
 assert.equal(vm.runInNewContext(m[1]),before);assert.equal(m[3],sha(before));
 return text.slice(0,start)+JSON.stringify(after)+m[2]+sha(after)+m[4]+tail.slice(m[0].length);
}
export function addAsset(text,key,body){
 assert(!text.includes(JSON.stringify(key)+':{body:'));
 const marker='"/pinnacle-pages-scripts/contact-receipt.js":{body:';
 return once(text,marker,JSON.stringify(key)+':{body:'+JSON.stringify(body)+',sha256:'+JSON.stringify(sha(body))+'},'+marker);
}
export function patchAttribution(before,after){
 const pattern=/export const attributionScripts=(\{[^\n]+\});/;const m=before.match(pattern);assert(m);const records=JSON.parse(m[1]);
 const key='/pinnacle-pages-scripts/speech-measurement.js',old=records[key].text;assert.equal(after,addObservation(old,after));
 for(const k of [key,'/books/resources/measurement-v1.js']){assert.equal(records[k].text,old);records[k]={...records[k],text:after,sha256:sha(after)};}
 return before.replace(pattern,()=> 'export const attributionScripts='+JSON.stringify(records)+';');
}
export function patchHelpline(before,source){
 const get=name=>{const re=new RegExp('export const '+name+' = ([^\\n]+);');const m=before.match(re);assert(m);return JSON.parse(m[1]);};
 const html=get('HELPLINE_HTML');const candidates=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].filter(m=>m[1].includes("const id = 'G-H9CLX1WJ7R'"));assert.equal(candidates.length,1);
 const old=candidates[0][1],next=addObservation(old,source);const currentHash=get('ANALYTICS_CSP_HASH');
 // Inline script HTML may include a leading/trailing newline outside its hashed source.
 const variants=[old,old.replace(/^\n/,'').replace(/\n$/,'')];const original=variants.find(v=>createHash('sha256').update(v).digest('base64')===currentHash);assert(original!==undefined,'Existing helpline CSP hash');
 const newSource=addObservation(original,source),newHtml=once(html,old,next);let result=before;
 for(const [name,value]of [['HELPLINE_HTML',newHtml],['HELPLINE_ETAG','"'+sha(newHtml).slice(0,24)+'"'],['ANALYTICS_CSP_HASH',createHash('sha256').update(newSource).digest('base64')]]){
  const re=new RegExp('export const '+name+' = [^\\n]+;');assert.equal((result.match(new RegExp(re.source,'g'))||[]).length,1);result=result.replace(re,()=> 'export const '+name+' = '+JSON.stringify(value)+';');
 }
 return result;
}
