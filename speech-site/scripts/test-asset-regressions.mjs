import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {PUBLIC_AD_CALL_PATH,servePublicAdCall} from '../deployment/public-ad-call.mjs';
import {removeInvalidIndexPreview,repairInterventionsIndexHTML,repairInterventionsIndex} from '../deployment/interventions-index-root.mjs';
import {replaceBundledCall,replaceSelectedReference} from './asset-regression-patch.mjs';
const source=(await fs.readFile(new URL('../src/lib/google-ads-call-consent.mjs',import.meta.url),'utf8')).replace(/\r\n/g,'\n');
const aliases=JSON.parse(await fs.readFile(new URL('../src/lib/public-ad-call-aliases.json',import.meta.url),'utf8'));
const base='https://www.pinnacleblooms.org';
const desktop='<html><head><title>Interventions</title></head><body><main><h1>Pinnacle Blooms Interventions Library</h1><section data-pinnacle-interventions-index="true"><a href="/sensory-processing">Existing domain</a><a href="tel:+919100181181">9100 181 181</a></section></main></body></html>';
const gallery='<div class="pdf-viewer">'+Array.from({length:20},(_,i)=>'<div class="page"><img src="https://images.pinnacleblooms.org/Assets/InterventionTechniquePdf/index/index-pinnacle-blooms-network-call-9100181181-'+String(i+1).padStart(3,'0')+'.jpg" loading="lazy" alt="Page '+(i+1)+'"></div>').join('')+'</div>';
const mobile=desktop.replace('</main>',gallery+'</main>');
const imagePrefix='https://images.pinnacleblooms.org/Assets/InterventionTechniquePdf/index/index-pinnacle-blooms-network-call-9100181181-';
test('current call asset is real executable source with matching content hash and retired overrides absent',async()=>{
 assert(PUBLIC_AD_CALL_PATH.includes(createHash('sha256').update(source).digest('hex').slice(0,16)));
 const r=servePublicAdCall(new Request(base+PUBLIC_AD_CALL_PATH));
 assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/javascript/);assert.equal(await r.text(),source);
 assert.match(source,/phone_conversion_callback: callback/);assert.match(source,/window\.__pinnacleAdCallMeasurement/);
 for(const key of ['ad_personalization:','allow_google_signals:','allow_ad_personalization_signals:'])assert(!source.includes(key));
 assert.match(source,/preferencesMarkup = ''/);
});
test('only the three reviewed historical call URLs resolve in one hop to the current working asset',async()=>{
 assert.equal(aliases.length,3);
 for(const path of aliases){
  const r=servePublicAdCall(new Request(base+path+'?v=old'));
  assert.equal(r.status,308);assert.equal(r.headers.get('access-control-allow-origin'),'*');assert.equal(r.headers.get('location'),PUBLIC_AD_CALL_PATH+'?v=old');
  assert.equal(servePublicAdCall(new Request(new URL(r.headers.get('location'),base))).status,200);
  const head=servePublicAdCall(new Request(base+path,{method:'HEAD'}));assert.equal(head.status,308);assert.equal(await head.text(),'');
 }
});
test('unknown hashes, other hosts and unsupported methods retain existing boundaries',()=>{
 assert.equal(servePublicAdCall(new Request(base+'/pinnacle-pages-scripts/portal-ad-call-deadbeefdeadbeef.mjs')),null);
 assert.equal(servePublicAdCall(new Request('https://other.example'+PUBLIC_AD_CALL_PATH)),null);
 for(const path of [...aliases,PUBLIC_AD_CALL_PATH])assert.equal(servePublicAdCall(new Request(base+path,{method:'POST'})).status,405);
});
test('Android root removes exactly the complete ordered invalid preview and preserves every other byte',()=>{
 const block=mobile.match(/<div class="pdf-viewer">(?:<div class="page"><img\b[^>]*><\/div>){20}<\/div>/)?.[0];assert(block);
 const result=repairInterventionsIndexHTML(mobile);assert.equal(result,mobile.replace(block,''));
 assert.equal(result.includes(imagePrefix),false);
 assert.match(result,/data-pinnacle-interventions-index/);assert.match(result,/tel:\+919100181181/);
 assert.equal(removeInvalidIndexPreview(result),result);assert.equal(repairInterventionsIndexHTML(result),null);
});
test('working desktop root and an unrecognized or genuine preview remain unchanged',()=>{
 assert.equal(repairInterventionsIndexHTML(desktop),null);
 const different=mobile.replace(imagePrefix+'001.jpg','https://images.pinnacleblooms.org/real-resource.jpg');
 assert.equal(removeInvalidIndexPreview(different),different);assert.equal(repairInterventionsIndexHTML(different),null);
 const incomplete=mobile.replace(/<div class="page"><img[^>]*-020\.jpg"[^>]*><\/div>/,'');
 assert.equal(removeInvalidIndexPreview(incomplete),incomplete);
});
test('root response retains headers, contact and content while removing invalidated cache validators',async()=>{
 const response=new Response(mobile,{headers:{'content-type':'text/html','cache-control':'public,max-age=600','etag':'old','last-modified':'Thu, 22 Oct 2026 06:00:00 GMT','x-existing':'kept'}});
 const r=await repairInterventionsIndex(new Request('https://interventions.pinnacleblooms.org/'),response);
 assert.equal(r.status,200);assert.equal(r.headers.get('x-existing'),'kept');assert.equal(r.headers.get('cache-control'),'public,max-age=600');
 assert.equal(r.headers.get('etag'),null);assert.equal(r.headers.get('last-modified'),null);assert.equal((await r.text()).includes(imagePrefix),false);
});
test('individual resources, unrelated hosts, authentication and non-HTML responses are never changed',async()=>{
 for(const request of [new Request('https://interventions.pinnacleblooms.org/sensory-processing'),new Request('https://materials.pinnacleblooms.org/'),new Request('https://interventions.pinnacleblooms.org/',{method:'POST'}),new Request('https://interventions.pinnacleblooms.org/',{headers:{authorization:'test-only'}})]){
  const response=new Response(mobile,{headers:{'content-type':'text/html'}});assert.equal(await repairInterventionsIndex(request,response),response);
 }
 const response=new Response('{}',{headers:{'content-type':'application/json'}});assert.equal(await repairInterventionsIndex(new Request('https://interventions.pinnacleblooms.org/'),response),response);
});
test('legacy generated module shares the same call asset and permits historical cached references',async()=>{
 const {serveLegacyMeasurementCall}=await import('../deployment/legacy-measurement.runtime.mjs');
 assert.equal(await serveLegacyMeasurementCall(new Request(base+PUBLIC_AD_CALL_PATH)).text(),source);
 for(const path of aliases)assert.equal(serveLegacyMeasurementCall(new Request(base+path)).status,308);
});
test('compiled legacy patch keeps every byte outside the reviewed call block',()=>{
 const old='before\n// deployment/public-ad-call.mjs\nold helper\n// deployment/legacy-measurement.mjs\nafter';
 const next='unused\n// speech-site/deployment/public-ad-call.mjs\nnew helper\n// speech-site/deployment/legacy-measurement.mjs\nunused';
 assert.equal(replaceBundledCall(old,next),'before\n// speech-site/deployment/public-ad-call.mjs\nnew helper\nvar publicAdCallMarkup = "";\n// deployment/legacy-measurement.mjs\nafter');
 assert.throws(()=>replaceBundledCall('unknown',next));
});
test('embedded reference patch removes only the reviewed obsolete choices and path',()=>{
 const old='prefix var v="/pinnacle-pages-scripts/portal-ad-call-1b357bec67c18321.mjs",R=\'<details class="measurement-settings portal-measurement" data-ad-call-preferences hidden>old choices</details>\';suffix';
 assert.equal(replaceSelectedReference(old,PUBLIC_AD_CALL_PATH),'prefix var v="'+PUBLIC_AD_CALL_PATH+'",R=\'\';suffix');
 assert.throws(()=>replaceSelectedReference(old.replace('data-ad-call-preferences','unrecognized'),PUBLIC_AD_CALL_PATH));
});
