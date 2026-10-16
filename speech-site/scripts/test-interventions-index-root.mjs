import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {repairInterventionsIndexHTML,repairInterventionsIndex,createInterventionsIndexWrapper} from '../deployment/interventions-index-root.mjs';
const html=gunzipSync(fs.readFileSync(new URL('../tests/fixtures/interventions/root-current.html.gz',import.meta.url))).toString();
const pdf='https://images.pinnacleblooms.org/Assets/InterventionTechniquePdf/pdf/index.pdf';
test('saved actual root keeps its full existing library and removes only the exact item-preview nodes',()=>{
 const fixed=repairInterventionsIndexHTML(html);assert(fixed);assert(!fixed.includes('Preview of index Therapy Material'));assert(!fixed.includes('Below is a visual preview of index therapy material.'));assert(!fixed.includes(pdf));
 assert.equal((fixed.match(/<h1(?:\s|>)/gi)||[]).length,1);assert.equal((fixed.match(/<link rel="canonical" href="https:\/\/interventions.pinnacleblooms.org\/">/g)||[]).length,1);
 const intro=fixed.match(/<section data-pinnacle-interventions-index="true">[\s\S]*?<\/section>/)[0];assert.equal((intro.match(/<li>/g)||[]).length,12);
 for(const [,href] of intro.matchAll(/href="([^"]+)"/g))assert(html.includes('href="'+href+'"'),'Every added navigation target exists in the original source');
 assert(fixed.includes('tel:+919100181181'));assert(fixed.includes('<title>Pinnacle Blooms® Interventions Library</title>'));
 // Strip only the declared insertions/removals and require every remaining source byte to match.
 const expected=html.replace(/<h2\b[^>]*>\s*Preview of index Therapy Material\s*<\/h2>\s*<p\b[^>]*>\s*Below is a visual preview of index therapy material\.[^<]*<\/p>/i,'').replace(/<button\b(?:[^"'<>]|"[^"]*"|'[^']*')*>[\s\S]*?<\/button\s*>/gi,button=>button.includes(pdf)?'':button);
 assert.equal(fixed.replace(intro,'').replace('<link rel="canonical" href="https://interventions.pinnacleblooms.org/">',''),expected);
 assert.equal(repairInterventionsIndexHTML(fixed),null,'Already repaired source must not accumulate duplicate insertions');
});
test('existing h1 and canonical stay single; ambiguous template evidence is left intact',()=>{
 const existing=html.replace('</head>','<link rel="canonical" href="https://interventions.pinnacleblooms.org/"></head>').replace('<main id="main-content">','<main id="main-content"><h1>Existing library heading</h1>');
 const fixed=repairInterventionsIndexHTML(existing);assert.equal((fixed.match(/<h1(?:\s|>)/gi)||[]).length,1);assert(fixed.includes('<h1>Existing library heading</h1>'));assert.equal((fixed.match(/rel="canonical"/g)||[]).length,1);
 assert.equal(repairInterventionsIndexHTML(html.replace('Preview of index Therapy Material','Preview of a real resource')),null);
 assert.equal(repairInterventionsIndexHTML(html.replaceAll('href="https://interventions.pinnacleblooms.org/communication"','href="https://outside.example/communication"')),null);
});
test('wrapper preserves original Worker interface and affects only eligible anonymous HTML root responses',async()=>{
 const environment={},context={};let called=0;const original={scheduled(){return 'retained';},async fetch(request,env,ctx){called++;assert.equal(env,environment);assert.equal(ctx,context);return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','etag':'old','content-length':String(Buffer.byteLength(html))}});}};
 const wrapped=createInterventionsIndexWrapper(original);assert.equal(wrapped.scheduled,original.scheduled);const r=await wrapped.fetch(new Request('https://interventions.pinnacleblooms.org/'),environment,context);assert.equal(called,1);assert.equal(r.status,200);assert.equal(r.headers.get('etag'),null);assert.equal(r.headers.get('content-length'),null);assert.equal(r.headers.get('x-pinnacle-interventions-index'),'20261016');assert(!(await r.text()).includes(pdf));
 for(const [address,options,headers,status] of [['https://interventions.pinnacleblooms.org/sensory-processing',{}, {},200],['https://materials.pinnacleblooms.org/',{}, {},200],['https://interventions.pinnacleblooms.org/',{headers:{authorization:'Bearer fixture'}},{},200],['https://interventions.pinnacleblooms.org/',{method:'HEAD'},{},200],['https://interventions.pinnacleblooms.org/',{}, {'cache-control':'no-transform'},200],['https://interventions.pinnacleblooms.org/',{}, {},404]]){
  const originalResponse=new Response(html,{status,headers:{'content-type':'text/html',...headers}});assert.equal(await repairInterventionsIndex(new Request(address,options),originalResponse),originalResponse);
 }
});
