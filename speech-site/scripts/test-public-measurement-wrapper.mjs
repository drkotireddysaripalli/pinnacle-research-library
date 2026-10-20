import test from 'node:test';import assert from 'node:assert/strict';import{build}from'esbuild';import{Miniflare,convertV4MiniflareOptions}from'miniflare';
test('public knowledge HTML uses shared default scripts while private/auth/API response stays exact',async()=>{
 const html='<html><head></head><body><main>Preserve public content and reader gate</main><details id="website-preferences" data-speech-measurement>Old choice</details><script>const measurement="/ask/_assets/speech-measurement.zFQspfZI.js";import(measurement);const call="/ask/_assets/google-ads-call-consent.FqeWzaS9.mjs";import(call);</script></body></html>';
 const built=await build({stdin:{contents:`import{createPublicMeasurementWrapper}from'./deployment/public-measurement-wrapper.mjs';export default createPublicMeasurementWrapper({fetch(){return new Response(${JSON.stringify(html)},{headers:{'content-type':'text/html','content-security-policy':"default-src 'self'; script-src 'self'; object-src 'none'"}})}});`,resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:built.outputFiles[0].text,compatibilityDate:'2026-10-03'}));
 try{
  for(const host of ['pinnacleblooms.org','www.pinnacleblooms.org'])for(const path of ['/ask','/faq','/sunshine','/allmirracles','/materials','/interventions','/shop']){
   const r=await mf.dispatchFetch('https://'+host+path+'?ordinary=1&ordinary=2#section'),s=await r.text();assert(!s.includes('website-preferences'));assert(!s.includes('/ask/_assets/speech-measurement.'));assert(s.includes('speech-measurement.js?v=measurement-completion-20261020'));assert(s.includes('Preserve public content and reader gate'));assert(r.headers.get('content-security-policy').includes('https://www.pinnacleblooms.org'));
  }
  for(const path of ['/ask/account','/ask/auth/callback','/ask/te/search','/ask/api/item','/patients/record','/shop/checkout','/shop/cart','/books/download'])assert.equal(await(await mf.dispatchFetch('https://pinnacleblooms.org'+path)).text(),html);
 }finally{await mf.dispose();}
});
