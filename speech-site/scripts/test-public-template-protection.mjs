import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {build} from 'esbuild';
import {Miniflare, convertV4MiniflareOptions} from 'miniflare';
import {legacyMeasurementScope} from '../deployment/legacy-measurement.mjs';
import {withPublicTemplateProtection} from '../deployment/public-template-protection.mjs';

const origin='https://www.pinnacleblooms.org';
const script='<script>window.dataLayer=window.dataLayer||[];/* GTM-W9ZHX459 */ gtag("config","G-2BYLRLFRDJ");</script>';
const content='<h1>తెలుగు parent guidance</h1><a href="tel:+919100181181">Call 9100 181 181</a>';
const html=(extra='')=>'<!doctype html><html><head>'+script+extra+'</head><body>'+content+'</body></html>';
const source=`import {repairLegacyExclusions} from './deployment/legacy-measurement.mjs';export default {async fetch(request,env){let response=await env.ORIGIN.fetch(request);response=await repairLegacyExclusions(request,response);return request.headers.has('x-double')?repairLegacyExclusions(request,response):response;}};`;
const compiled=await build({stdin:{contents:source,resolveDir:process.cwd()},bundle:true,format:'esm',platform:'browser',write:false,logLevel:'silent'});
const runtime=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-03',script:compiled.outputFiles[0].text,serviceBindings:{ORIGIN:request=>{
 const headers={'content-type':request.headers.get('x-content-type')||'text/html; charset=utf-8','cache-control':request.headers.get('x-cache')||'no-store','etag':'original','content-digest':'original'};
 if(request.headers.has('x-cookie'))headers['set-cookie']='private=1';
 if(request.headers.has('x-csp'))headers['content-security-policy']=request.headers.get('x-csp');
 return new Response(html(request.headers.get('x-head')||''),{status:Number(request.headers.get('x-status')||200),headers});
}}}));
test.after(async()=>runtime.dispose());
const fetch=(path,headers={})=>runtime.dispatchFetch(origin+path,{headers});

test('both public families add only the existing consumer and preserve analytics, content and call links',async()=>{
 for(const path of ['/m/fine-motor-developmental-delay-in-6-9-months','/skills/emotional-expression','/skills/static-balance/']){
  assert.equal(legacyMeasurementScope(new Request(origin+path)),null);
  const response=await fetch(path),body=await response.text();
  assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');
  assert.equal(response.headers.get('x-pinnacle-public-protection'),'existing-consumer-v1');
  assert.equal((body.match(/protection-consumer\.mjs/g)||[]).length,1);
  assert(body.includes(script));assert(body.includes(content));assert(!body.includes('speech-measurement.js'));
  assert(!body.includes('pinnacle_canonical_measurement'));assert(!body.includes("gtag('consent'"));
  assert.equal(response.headers.get('etag'),null);assert.equal(response.headers.get('content-digest'),null);
  assert.equal(response.headers.get('content-security-policy'),null);
 }
});
test('repeated composition and an existing head consumer cannot add another bootstrap',async()=>{
 for(const headers of [{'x-double':'1'},{'x-head':'<script type="module" id="pinnacle-protection-container" src="/pinnacle-pages-scripts/protection-consumer.mjs?v=existing"></script>'}]){
  const response=await fetch('/skills/emotional-expression',headers),body=await response.text();
  assert.equal((body.match(/protection-consumer\.mjs/g)||[]).length,1);
 }
});
test('public template CSP uses only the established protect origin and preserves the existing nonce',async()=>{
 const policy="default-src 'self'; script-src 'self' 'nonce-fixture'; script-src-elem 'nonce-fixture'; connect-src 'self'; img-src 'self' data:";
 const response=await fetch('/m/gross-motor-milestones-2-3-years',{'x-csp':policy,'x-head':'<script nonce="fixture">void 0</script>'}),body=await response.text();
 const csp=response.headers.get('content-security-policy');assert(csp.includes("script-src-elem 'nonce-fixture' https://protect.pinnacleblooms.org"));
 assert(csp.includes("img-src 'self' data:"));assert(!csp.includes('*'));assert(body.includes('nonce="fixture" src="/pinnacle-pages-scripts/protection-consumer.mjs'));
 const none=await fetch('/skills/static-balance',{'x-csp':"script-src 'none'; connect-src 'none'"});assert.equal(none.headers.get('content-security-policy'),"script-src 'none'; connect-src 'none'");
});
test('private, QA, nested, non-HTML and non-public responses retain their original bytes and policy',async()=>{
 const policy="script-src 'self'; connect-src 'self'";
 for(const [path,headers]of[
  ['/account',{}],['/api/enrolment',{}],['/m/example/private',{}],['/skills',{}],['/skills/example.json',{}],['/t/bead-stringing-therapy',{}],
  ['/m/example?validation_test=1',{}],['/skills/example',{authorization:'fixture'}],['/skills/example',{range:'bytes=0-3'}],
  ['/skills/example',{'x-cookie':'1'}],['/skills/example',{'x-cache':'private, no-store'}],['/skills/example',{'x-cache':'no-transform'}],
  ['/skills/example',{'x-content-type':'application/json'}],['/skills/example',{'x-status':'404'}]
 ]){
  const response=await fetch(path,{...headers,'x-csp':policy});assert.equal(await response.text(),html());assert.equal(response.headers.get('x-pinnacle-public-protection'),null);assert.equal(response.headers.get('content-security-policy'),policy);
 }
 const other=await runtime.dispatchFetch('https://example.invalid/skills/example');assert.equal(await other.text(),html());
 const head=await runtime.dispatchFetch(origin+'/skills/example',{method:'HEAD'});assert.equal(head.headers.get('x-pinnacle-public-protection'),null);
});
test('checked-in legacy runtime is generated from the maintained source',async()=>{
 const output=await build({entryPoints:['deployment/legacy-measurement.mjs'],bundle:true,format:'esm',write:false,logLevel:'silent'});
 assert.equal(await fs.readFile('deployment/legacy-measurement.runtime.mjs','utf8'),output.outputFiles[0].text);
});
test('additive wrapper retains every existing export and untouched private response',async()=>{
 const response=new Response('private original'),Original=class{},original={Original,fetch:async()=>response};
 const wrapped=withPublicTemplateProtection(original);assert.equal(wrapped.Original,Original);
 assert.equal(await wrapped.fetch(new Request(origin+'/account'),{},{}),response);
 const output=await build({entryPoints:['deployment/public-template-protection.mjs'],bundle:true,format:'esm',write:false,logLevel:'silent'});
 assert.equal(await fs.readFile('deployment/public-template-protection.runtime.mjs','utf8'),output.outputFiles[0].text);
});
