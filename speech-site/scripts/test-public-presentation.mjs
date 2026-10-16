import test from 'node:test';import assert from 'node:assert/strict';
import {build} from 'esbuild';import{Miniflare,convertV4MiniflareOptions}from'miniflare';
import{presentationPath,presentationCSS,servePresentationRepair}from'../deployment/public-presentation-repair.mjs';
test('Public repair CSS serves exact bytes and HEAD without intercepting another host or method',async()=>{
 assert.equal(await servePresentationRepair(new Request('https://www.pinnacleblooms.org'+presentationPath)).text(),presentationCSS);
 assert.equal(await servePresentationRepair(new Request('https://www.pinnacleblooms.org'+presentationPath,{method:'HEAD'})).text(),'');
 assert.equal(servePresentationRepair(new Request('https://other.example'+presentationPath)),null);
});
test('Scoped presentation keeps document/contact/CSP unchanged and excludes API/auth/unknown pages',async()=>{
 const html='<html><head><title>Original</title></head><body><main><h1>Original family story</h1><a href="tel:+919100181181">9100 181 181</a></main></body></html>';
 const b=await build({stdin:{contents:`import{repairPublicPresentation as apply}from'./deployment/public-presentation-repair.mjs';export default{fetch(r){return apply(r,new Response(${JSON.stringify(html)},{headers:{'content-type':'text/html','content-security-policy':"style-src 'self'",'cache-control':'private,no-store'}}))}}`,resolveDir:process.cwd()},bundle:true,write:false,format:'esm'});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-03',script:b.outputFiles[0].text}));
 try{for(const path of ['/centers/suchitra','/books/slug/softcover','/pinnacle-global-autism-framework']){const r=await mf.dispatchFetch('https://www.pinnacleblooms.org'+path);const s=await r.text();assert(s.includes(presentationPath));assert(s.includes('Original family story'));assert(s.includes('tel:+919100181181'));assert.equal(r.headers.get('content-security-policy'),"style-src 'self'");}
 for(const path of ['/api/enrolment','/ask/auth/google','/unrelated'])assert.equal(await(await mf.dispatchFetch('https://www.pinnacleblooms.org'+path)).text(),html);
 assert.equal(await(await mf.dispatchFetch('https://www.pinnacleblooms.org/centers/suchitra',{headers:{authorization:'private'}})).text(),html);
 }finally{await mf.dispose();}
});
