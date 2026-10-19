import test from 'node:test';
import assert from 'node:assert/strict';
import {LEGACY_TAGS,LEGACY_NOSCRIPT_TAGS,LEGACY_TAG_REPLACEMENTS} from '../deployment/legacy-measurement-fingerprints.mjs';
import {legacyMeasurementScope,migrateLegacyPrefix,projectManagedPreferenceHtml,repairLegacyMeasurement,repairLegacyExclusions,serveLegacyMeasurementCall,stripLegacyNoscript} from '../deployment/legacy-measurement.mjs';
const request=path=>new Request('https://www.pinnacleblooms.org'+path);
const fixture=path=>'<html><head><link rel="canonical" href="https://www.pinnacleblooms.org'+path+'">'+LEGACY_TAGS.join('')+'<script src="/functional.js"></script></head><body><h1>Parent guidance</h1></body></html>';
test('the activated split removes only exact public noscript without changing ordinary measurement or contact',async()=>{
 const path='/t/bead-stringing-therapy',old=fixture(path).replace('</body>',LEGACY_NOSCRIPT_TAGS[0]+'<a href="tel:+919100181181">Call</a></body>');
 const response=await repairLegacyExclusions(request(path),new Response(old,{headers:{'content-type':'text/html','link':'</hero.jpg>; rel=preload; as=image'}}));
 assert.equal(await response.text(),old.replace(LEGACY_NOSCRIPT_TAGS[0],''));assert.equal(response.headers.get('link'),'</hero.jpg>; rel=preload; as=image');assert.equal(response.headers.get('x-pinnacle-legacy-exclusion'),'exact-noscript-only');
});
test('fingerprinted public families replace only verified analytics with the existing collector and call module',()=>{
 for(const path of ['/ma/ringtoss-therapy','/t/bead-stringing-therapy','/b/understanding-managing-spitting-saliva-tantrums','/c/hand-flapping-therapy','/contact-national-autism-helpline-24-7']){
  const result=migrateLegacyPrefix(fixture(path),request(path));assert(result);assert.equal(result.removed,LEGACY_TAGS.length);
  assert(result.html.includes('data-page-variant="legacy_knowledge"'));assert(result.html.includes('/functional.js'));assert(result.controls.includes('data-speech-measurement'));assert(result.controls.includes('data-ad-call-preferences'));
  assert(result.controls.includes('Privacy and optional measurement'));assert.equal((result.controls.match(/measurement-preference-centre/g)||[]).length,1);assert(!result.controls.includes('<aside'));
  assert(!result.html.includes('GTM-W9ZHX459'));assert(result.html.includes('data-pinnacle-legacy-collector="early-v3"'));assert(result.html.includes('<script defer src="/pinnacle-pages-scripts/speech-measurement.js'));assert.equal(migrateLegacyPrefix(result.html,request(path)),null);
 }
});
test('exact noscript suppression survives every byte split without deleting unrelated fallbacks',async()=>{
 const token=LEGACY_NOSCRIPT_TAGS[0],before='<h1>తెలుగు</h1>',after='<noscript>Keep native contact</noscript>';const bytes=new TextEncoder().encode(before+token+after);
 for(let split=1;split<bytes.length;split++){const body=new ReadableStream({start(c){c.enqueue(bytes.slice(0,split));c.enqueue(bytes.slice(split));c.close();}});assert.equal(await new Response(stripLegacyNoscript(body)).text(),before+after);}
});
test('unknown mixed tag owners and different canonical identities cannot silently migrate',()=>{
 const path='/t/bead-stringing-therapy';assert.equal(migrateLegacyPrefix(fixture(path).replace('</head>',"<script>gtag('event', 'other_owner'); // G-2BYLRLFRDJ</script></head>"),request(path)),null);
 assert.equal(migrateLegacyPrefix(fixture('/t/different'),request(path)),null);
});
test('two reviewed templates need explicit ownership activation and keep the ClickGUARD GTM container',()=>{
 for(const path of ['/assessments/stuttering-assessment','/certified-courses']){
  const original=fixture(path).replace('</body>',LEGACY_NOSCRIPT_TAGS[0]+'</body>');
  assert.equal(legacyMeasurementScope(request(path)),'reviewed-public-template');
  assert.equal(migrateLegacyPrefix(original,request(path)),null);
  const result=migrateLegacyPrefix(original,request(path),{preserveGtm:true});assert(result);
  assert.equal(result.preserveGtm,true);assert.equal(result.removed,LEGACY_TAGS.length-1);
  assert(result.html.includes(LEGACY_TAGS[0]));assert(result.html.includes(LEGACY_NOSCRIPT_TAGS[0]));
  assert(!result.html.includes("gtag('config', 'G-2BYLRLFRDJ')"));assert(!result.html.includes("gtag('config', 'AW-10810823199')"));
  assert.equal(result.html.match(/defer src="\/pinnacle-pages-scripts\/speech-measurement\.js/g)?.length,1);
  assert(result.html.includes('data-page-variant="legacy_public_template"'));
  assert(result.controls.includes('data-speech-measurement'));assert(!result.html.includes('early-v3'));
  assert.equal(migrateLegacyPrefix(original.replace('</head>',"<script>gtag('event','unknown');</script></head>"),request(path),{preserveGtm:true})?.removed,LEGACY_TAGS.length-1,'Unrelated script stays untouched');
  assert.equal(migrateLegacyPrefix(original.replace('</head>',"<script>gtag('config','G-UNKNOWN'); // G-2BYLRLFRDJ</script></head>"),request(path),{preserveGtm:true}),null);
 }
 for(const path of ['/assessments/other','/certified-courses/private'])assert.equal(legacyMeasurementScope(request(path)),null);
 const privateResult=migrateLegacyPrefix(fixture('/patients/private'),request('/patients/private'),{preserveGtm:true});assert(!privateResult.html.includes('GTM-W9ZHX459'));
});
test('the exact courses slash alias retains either existing courses canonical and fingerprint gates',()=>{
 const path='/certified-courses/',canonical='/certified-courses',url=request(path+'?utm_source=google&utm_id=24332444156');
 const original=fixture(canonical).replace('</body>',LEGACY_NOSCRIPT_TAGS[0]+'<a href="tel:+919100181181">Call</a></body>');
 assert.equal(legacyMeasurementScope(url),'reviewed-public-template');
 const result=migrateLegacyPrefix(original,url,{preserveGtm:true});assert(result);assert.equal(result.removed,LEGACY_TAGS.length-1);
 assert(result.html.includes('href="https://www.pinnacleblooms.org/certified-courses"'));assert(result.html.includes('href="tel:+919100181181"'));assert(result.html.includes(LEGACY_TAGS[0]));assert(result.html.includes(LEGACY_NOSCRIPT_TAGS[0]));assert.equal(url.url,'https://www.pinnacleblooms.org'+path+'?utm_source=google&utm_id=24332444156');
 const selfCanonical=migrateLegacyPrefix(fixture(path),url,{preserveGtm:true});assert(selfCanonical);assert(selfCanonical.html.includes('href="https://www.pinnacleblooms.org/certified-courses/"'),'Existing slash canonical is preserved, not rewritten');
 assert.equal(migrateLegacyPrefix(fixture('/other'),url,{preserveGtm:true}),null);
 assert.equal(migrateLegacyPrefix(original.replace('</head>',"<script>gtag('config','G-UNKNOWN'); // G-2BYLRLFRDJ</script></head>"),url,{preserveGtm:true}),null);
 for(const outside of ['/certified-courses//','/certified-courses/private','/assessments/stuttering-assessment/'])assert.equal(legacyMeasurementScope(request(outside)),null);
});

test('reviewed template activation leaves private response, no-transform and CSP guards intact',async()=>{
 for(const path of ['/assessments/stuttering-assessment','/certified-courses/']){
 const original=new Response(fixture(path),{headers:{'content-type':'text/html'}});
 assert.equal(await repairLegacyExclusions(request(path),original,{reviewedPublicTemplates:false}),original,'Explicit rollback option preserves the original response');
 for(const [req,headers]of [[request(path),{'content-security-policy':"default-src 'self'"}],[request(path),{'cache-control':'no-transform'}],[request(path),{'set-cookie':'fixture=1'}],[new Request('https://www.pinnacleblooms.org'+path,{headers:{authorization:'offline-fixture'}}),{}]]){
  const r=new Response(fixture(path),{headers:{'content-type':'text/html',...headers}});
  assert.equal(await repairLegacyExclusions(req,r,{reviewedPublicTemplates:true}),r);
 }
 }
});
test('reviewed mixed snippets preserve their icon and review-widget functionality',()=>{
 const path='/t/bead-stringing-therapy',result=migrateLegacyPrefix(fixture(path).replace('</head>',LEGACY_TAG_REPLACEMENTS[0][0]+'</head>'),request(path));
 assert(result);assert(result.html.includes(LEGACY_TAG_REPLACEMENTS[0][1]));assert(result.html.includes('fontawesome'));assert(result.html.includes('trustpilot'));assert(!result.html.includes('gtagScript.src'));
});
test('private routes remove exact old producers without adding new optional measurement',()=>{
 for(const path of ['/account','/auth/session','/documents/private-record','/payroll/report','/customer/record','/internal/report']){const result=migrateLegacyPrefix(fixture(path),request(path));assert.equal(result.scope,'private');assert(!result.html.includes('googletagmanager'));assert(!result.html.includes('speech-measurement.js'));assert(!result.controls);assert(result.html.includes('/functional.js'));}
});
test('public policy/evidence/commerce/auth API and unknown hosts are outside migration',()=>{
 for(const path of ['/verify/evidence/records/study-portfolio.html','/shop','/api/enrolment','/national-autism-helpline','/faq/example'])assert.equal(legacyMeasurementScope(request(path)),null);
 assert.equal(legacyMeasurementScope(new Request('https://alpha.pinnacleblooms.org/t/bead-stringing-therapy')),null);
});
test('the new hashed helper retains native call action and withdrawal restoration',async()=>{
 const result=migrateLegacyPrefix(fixture('/t/bead-stringing-therapy'),request('/t/bead-stringing-therapy'));const src=/type="module" src="([^"]+)"/.exec(result.html)[1];const response=serveLegacyMeasurementCall(request(src));assert.equal(response.status,200);const source=await response.text();assert(source.includes('VNUcCMSy3YobEJ-kgKMo'));assert(source.includes('pinnacle-ad-call-consent-v1'));assert(source.includes('globalPrivacyControl'));assert(source.includes('originals'));assert(source.includes("originalDisplay"));
});
test('bounded prefix streaming preserves a multibyte split and the unread body',async()=>{
 const old=globalThis.HTMLRewriter;globalThis.HTMLRewriter=class{on(){return this;}transform(r){return r;}};
 try{const path='/t/bead-stringing-therapy',html=fixture(path).replace('Parent guidance','తెలుగు guidance'),bytes=new TextEncoder().encode(html),cut=bytes.indexOf(0xe0)+2;let i=0;const body=new ReadableStream({pull(c){if(i===0)c.enqueue(bytes.slice(0,cut));else if(i===1)c.enqueue(bytes.slice(cut));else c.close();i++;}}),result=await repairLegacyMeasurement(request(path),new Response(body,{headers:{'content-type':'text/html'}}));const text=await result.text();assert(text.includes('తెలుగు guidance'));assert(!text.includes('�'));assert.equal(result.headers.get('x-pinnacle-legacy-measurement'),'knowledge');}finally{globalThis.HTMLRewriter=old;}
});

test('reviewed tagged origin canonicals match the exact request without exposing query identity',()=>{
 const query='?utm_source=google&utm_medium=cpc&utm_campaign=qa_alias_regression';
 for(const path of ['/certified-courses/','/certified-courses','/assessments/stuttering-assessment']){
  const req=request(path+query),raw='https://www.pinnacleblooms.org'+path+query,escaped=raw.replaceAll('&','&amp;');
  const input=fixture(path).replace('href="https://www.pinnacleblooms.org'+path+'"','href="'+escaped+'"');
  const result=migrateLegacyPrefix(input,req,{preserveGtm:true});assert(result);assert.equal(result.removed,LEGACY_TAGS.length-1);assert(result.html.includes('href="'+escaped+'"'));assert(result.html.includes('legacy_public_template'));assert(result.html.includes(LEGACY_TAGS[0]));
  assert.equal(migrateLegacyPrefix(input.replace(escaped,escaped+'x'),req,{preserveGtm:true}),null,'Different query identity fails closed');
  assert.equal(migrateLegacyPrefix(input.replace('https://www.pinnacleblooms.org'+path,'https://elsewhere.invalid'+path),req,{preserveGtm:true}),null);
 }
 const outside='/t/bead-stringing-therapy',input=fixture(outside).replace('href="https://www.pinnacleblooms.org'+outside+'"','href="https://www.pinnacleblooms.org'+outside+query.replaceAll('&','&amp;')+'"');assert.equal(migrateLegacyPrefix(input,request(outside+query)),null,'Other families are not expanded');
});
test('known managed footers project one compact fail-closed preference centre',()=>{
 const analytics='<details class="measurement-settings" data-speech-measurement hidden><summary>Analytics</summary><p data-measurement-status>Off</p></details>';
 const adCall='<details class="measurement-settings" data-ad-call-preferences hidden><summary>Calls</summary><p data-ad-call-status>Off</p></details>';
 const html=path=>'<!doctype html><html><head><link rel="canonical" href="https://www.pinnacleblooms.org'+path+'"></head><body><main><p id="outside">Keep every outside byte.</p></main><footer class="portal-site-footer"><div class="portal-container">'+analytics+adCall+'</div></footer></body></html>';
 for(const path of ['/top-speech-therapy-center-india-proven-improvement-rate','/best-occupational-therapy-center-india-proven-improvement-rate','/best-aba-therapy-center-india-proven-improvement-rate','/centers','/centers/best-autism-speech-aba-occupational-therapy-center-suchitra-hyderabad-telangana-india','/centers/best-autism-speech-aba-occupational-therapy-center-nizamabad-telangana-india']){
  const before=html(path),after=projectManagedPreferenceHtml(before,request(path));assert(after);for(const marker of ['id="website-preferences"','data-pinnacle-managed-preferences','data-speech-measurement','data-cheq-preferences','data-ad-call-preferences'])assert.equal((after.match(new RegExp(marker,'g'))||[]).length,1,marker);assert(!after.includes('data-pinnacle-cheq-module'));assert(after.includes('<p id="outside">Keep every outside byte.</p>'));assert.equal(projectManagedPreferenceHtml(after,request(path)),null);
 }
 const path='/top-speech-therapy-center-india-proven-improvement-rate',before=html(path);
 assert.equal(projectManagedPreferenceHtml(before.replace(adCall,''),request(path)),null);
 assert.equal(projectManagedPreferenceHtml(before.replace(analytics+adCall,analytics+'<i>not-adjacent</i>'+adCall),request(path)),null);
 assert.equal(projectManagedPreferenceHtml(before.replace(analytics+adCall,'<div>'+analytics+'</div><div>'+adCall+'</div>'),request(path)),null);
 assert.equal(projectManagedPreferenceHtml(before.replace('<footer class="portal-site-footer">','<footer>'),request(path)),null);
 assert.equal(projectManagedPreferenceHtml(before.replace(analytics,'<details><summary>Nested</summary>'+analytics+'</details>'),request(path)),null);
 assert.equal(projectManagedPreferenceHtml(before.replace(path,'/different-canonical'),request(path)),null);
 assert.equal(projectManagedPreferenceHtml(before,new Request('https://www.pinnacleblooms.org'+path,{headers:{authorization:'private'}})),null);
 assert.equal(projectManagedPreferenceHtml(before,request('/enroll-autism-speech-aba-therapies-india')),null);
 assert.equal(projectManagedPreferenceHtml(before,request('/unknown')),null);
});
