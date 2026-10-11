import test from 'node:test';
import assert from 'node:assert/strict';
import {LEGACY_TAGS,LEGACY_NOSCRIPT_TAGS,LEGACY_TAG_REPLACEMENTS} from '../deployment/legacy-measurement-fingerprints.mjs';
import {legacyMeasurementScope,migrateLegacyPrefix,repairLegacyMeasurement,repairLegacyExclusions,serveLegacyMeasurementCall,stripLegacyNoscript} from '../deployment/legacy-measurement.mjs';
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
