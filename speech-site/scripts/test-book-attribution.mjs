import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {serveBookAttribution} from '../deployment/book-attribution-handler.mjs';
import {serveSpeech} from '../deployment/speech-handler.mjs';
const origin='https://www.pinnacleblooms.org';
test('the released commerce script matches its source bytes, validators and methods',async()=>{
 for(const name of ['book-commerce.js']){
  const url=origin+'/pinnacle-pages-scripts/'+name,response=serveBookAttribution(new Request(url));
  assert.equal(await response.text(),await fs.readFile('public/pinnacle-pages-scripts/'+name,'utf8'));
  assert.equal(response.headers.get('cache-control'),'public, max-age=60, must-revalidate');
  const etag=response.headers.get('etag');
  assert.equal(serveBookAttribution(new Request(url,{headers:{'if-none-match':etag}})).status,304);
  const privateResult=serveBookAttribution(new Request(url,{headers:{cookie:'private=fixture','if-none-match':etag}}));
  assert.equal(privateResult.status,200);assert.equal(privateResult.headers.get('cache-control'),'private, no-store');
  assert.equal(await serveBookAttribution(new Request(url,{method:'HEAD'})).text(),'');
  assert.equal(serveBookAttribution(new Request(url,{method:'POST'})).status,405);
 }
});
test('shared measurement uses the current asset union instead of the historical commerce bundle',async()=>{
 const path='/pinnacle-pages-scripts/speech-measurement.js',request=new Request(origin+path);
 assert.equal(serveBookAttribution(request),null);
 const current=await fs.readFile('public'+path,'utf8');
 const response=await serveSpeech(request,{ASSETS:{fetch:async()=>new Response(current)}},{[path]:'current-shared-script'});
 assert.equal(await response.text(),current);
});
test('attribution overlay leaves every other route and host to existing handlers',()=>{
 for(const url of [origin+'/ask',origin+'/verify/',origin+'/shop',origin+'/books',origin+'/pinnacle-pages-scripts/not-managed.js','https://pinnacleblooms.org/pinnacle-pages-scripts/book-commerce.js','https://other.example/pinnacle-pages-scripts/book-commerce.js'])assert.equal(serveBookAttribution(new Request(url)),null);
});
