import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {PUBLIC_AD_CALL_PATH,publicAdCallPage,servePublicAdCall} from '../deployment/public-ad-call.mjs';
import {augmentCsp} from '../src/lib/ad-call-csp.mjs';

test('existing consent-gated call policy extends the necessary directives and retains unrelated restrictions',()=>{
 const headers=new Headers({'content-security-policy':"default-src 'self'; script-src 'self' https://www.googletagmanager.com; script-src-elem 'self'; connect-src 'self'; frame-src https://www.youtube-nocookie.com; object-src 'none'"});
 augmentCsp(headers);const csp=headers.get('content-security-policy');
 for(const directive of ['script-src','script-src-elem','connect-src'])assert(csp.split(';').find(x=>x.trim().startsWith(directive+' ')).includes('https://www.googleadservices.com'));
 assert(csp.includes("object-src 'none'"));assert(csp.includes('https://www.youtube-nocookie.com'));assert(!csp.includes("default-src *"));assert(!csp.includes('unsafe-eval'));
 const before=csp;augmentCsp(headers);assert.equal(headers.get('content-security-policy'),before);
});

test('current public centre register and paid templates share one current module; private endpoints stay excluded',async()=>{
 const centres=JSON.parse(await fs.readFile('src/data/centre-register.json','utf8')).centres;
 for(const centre of centres)assert(publicAdCallPage(new URL(centre.profileUrl).pathname));
 for(const path of ['/centers','/speech-aba-autism-assessments','/enroll-autism-speech-aba-therapies-india','/best-aba-therapy-center-india-proven-improvement-rate'])assert(publicAdCallPage(path));
 for(const path of ['/api/enrolment','/shop/cart','/ask/account','/centers/unknown','/enrolment-preview'])assert.equal(publicAdCallPage(path),false);
 const url='https://www.pinnacleblooms.org'+PUBLIC_AD_CALL_PATH;
 assert.equal(await servePublicAdCall(new Request(url)).text(),await fs.readFile('src/lib/google-ads-call-consent.mjs','utf8'));
 assert.equal(await servePublicAdCall(new Request(url,{method:'HEAD'})).text(),'');
 assert.equal(servePublicAdCall(new Request(url,{method:'POST'})).status,405);
 assert.equal(servePublicAdCall(new Request('https://other.example'+PUBLIC_AD_CALL_PATH)),null);
});

test('deployed HTML transform replaces stale module once, adds missing legacy controls and preserves private/non-HTML responses',async()=>{
 const html='<html><head><title>Keep</title><script type="module" src="/pinnacle-pages-assets/google-ads-call-consent.CycsBYjf.mjs"></script></head><body><main>Keep family story <a href="tel:+919100181181">9100 181 181</a></main><footer>Keep footer</footer></body></html>';
 const output=await build({stdin:{contents:`import {repairSharedNavigation} from './deployment/shared-navigation.mjs';export default{fetch(r){const u=new URL(r.url),html=${JSON.stringify(html)}.replace(u.searchParams.has('legacy')?' type="module" src="/pinnacle-pages-assets/google-ads-call-consent.CycsBYjf.mjs"':'REMOVE-NOTHING','');const response=new Response(html,{headers:{'content-type':u.searchParams.has('json')?'application/json':'text/html','cache-control':u.searchParams.has('private')?'private, no-store':'public,max-age=300'}});return repairSharedNavigation(r,repairSharedNavigation(r,response));}}`,resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:output.outputFiles[0].text,compatibilityDate:'2026-10-04'}));
 try{
  for(const query of ['','?legacy','?private']){const response=await mf.dispatchFetch('https://www.pinnacleblooms.org/centers'+query),result=await response.text();assert.equal((result.match(new RegExp(PUBLIC_AD_CALL_PATH,'g'))||[]).length,1);assert.equal((result.match(/data-ad-call-preferences/g)||[]).length,1);assert(result.includes('<main>Keep family story <a href="tel:+919100181181">9100 181 181</a></main><footer>Keep footer</footer>'));if(query==='?private')assert.equal(response.headers.get('cache-control'),'private, no-store');}
  const json=await(await mf.dispatchFetch('https://www.pinnacleblooms.org/centers?json')).text();assert.equal(json,html);
  const unrelated=await(await mf.dispatchFetch('https://www.pinnacleblooms.org/ask/account')).text();assert(unrelated.includes('google-ads-call-consent.CycsBYjf.mjs'));assert(!unrelated.includes(PUBLIC_AD_CALL_PATH));assert(!unrelated.includes('data-ad-call-preferences'));
 }finally{await mf.dispose();}
});
