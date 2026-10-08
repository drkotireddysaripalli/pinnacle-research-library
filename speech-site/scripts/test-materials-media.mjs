import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {materialImageTarget} from '../deployment/materials-media-repair.mjs';
test('only same-network material image URLs get a final HTTPS target',()=>{
 assert.deepEqual(materialImageTarget('http://pinnacleblooms.org/Assets/Materials/2502.jpg'),{unavailable:false,url:'https://www.pinnacleblooms.org/Assets/Materials/2502.jpg'});
 for(const u of ['http://outside.example/Assets/Materials/2502.jpg','http://pinnacleblooms.org/private/2502.jpg','http://user:secret@pinnacleblooms.org/Assets/Materials/2502.jpg','http://pinnacleblooms.org/Assets/Materials/2502.jpg?private=1'])assert.equal(materialImageTarget(u),null);
 assert.equal(materialImageTarget('https://www.pinnacleblooms.org/Assets/Materials/309.jpg').unavailable,true);
});
test('streamed media repair preserves content and scope, fixes mixed content and identifies the missing image',async()=>{
 const html='<h1>Materials</h1><p>Original explanation retained.</p><a href="/item">Read material</a><img class="photo" src="http://pinnacleblooms.org/Assets/Materials/2502.jpg" alt="Original material"><img src="http://pinnacleblooms.org/Assets/Materials/309.jpg" srcset="missing.jpg 2x" alt="Original missing material"><img src="https://other.example/keep.jpg" alt="Keep"><source srcset="http://pinnacleblooms.org/Assets/Materials/29.jpg 2x">';
 const {outputFiles}=await build({stdin:{contents:`import {repairMaterialsMedia} from './deployment/materials-media-repair.mjs';export default{fetch(request){return repairMaterialsMedia(request,new Response(${JSON.stringify(html)},{headers:{'content-type':'text/html','etag':'old','cache-control':'public,max-age=600'}}));}}`,resolveDir:process.cwd()},bundle:true,format:'esm',platform:'browser',write:false});
 const runtime=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-04',script:outputFiles[0].text}));
 try{
  const r=await runtime.dispatchFetch('https://materials.pinnacleblooms.org/'),body=await r.text();
  assert(body.includes('<p>Original explanation retained.</p>'));assert(body.includes('<a href="/item">Read material</a>'));
  assert(body.includes('https://www.pinnacleblooms.org/Assets/Materials/2502.jpg'));assert(body.includes('https://www.pinnacleblooms.org/Assets/Materials/29.jpg 2x'));
  assert(body.includes('data:image/svg+xml,'));assert(body.includes('Original missing material — image unavailable'));assert(body.includes('data-pinnacle-media-state="unavailable"'));assert(!body.includes('missing.jpg 2x'));
  assert(body.includes('https://other.example/keep.jpg'));assert(!body.includes('http://pinnacleblooms.org/Assets/Materials/'));assert.equal(r.headers.get('etag'),null);
  const outside=await runtime.dispatchFetch('https://interventions.pinnacleblooms.org/');assert.equal(await outside.text(),html);assert.equal(outside.headers.get('etag'),'old');
  const privateRequest=await runtime.dispatchFetch('https://materials.pinnacleblooms.org/',{headers:{authorization:'Bearer fixture'}});assert.equal(await privateRequest.text(),html);
 }finally{await runtime.dispose();}
});
