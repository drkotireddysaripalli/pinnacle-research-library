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
test('shared measurement is served from the exact guarded overlay',async()=>{
 const path='/pinnacle-pages-scripts/speech-measurement.js',request=new Request(origin+path);
 const current=await fs.readFile('public'+path,'utf8');
 const response=serveBookAttribution(request);
 assert.equal(await response.text(),current);
});
test('privacy, cookie and policy-directory outputs use exact content negotiation without replacing other pages',async()=>{
 for(const [route,id] of [['/privacy-policy','privacy-policy'],['/cookie-policy','cookie-policy'],['/policies','policies']]){
  const html=serveBookAttribution(new Request(origin+route));assert.equal(html.status,200);assert.equal(html.headers.get('x-pinnacle-policy-overlay'),'automatic-before-choice-20261019');assert.equal(html.headers.get('link'),'<'+origin+route+'>; rel="canonical"');assert.match(html.headers.get('content-type'),/^text\/html/);assert.equal(await html.text(),await fs.readFile('dist/'+id+'.html','utf8'));
  const markdown=serveBookAttribution(new Request(origin+route,{headers:{accept:'text/markdown'}}));assert.match(markdown.headers.get('content-type'),/^text\/markdown/);assert.equal(await markdown.text(),await fs.readFile('dist/pinnacle-pages-data/'+id+'-policy.md','utf8'));
  const jsonPath='/pinnacle-pages-data/'+id+'-policy-source.json',json=serveBookAttribution(new Request(origin+jsonPath));assert.match(json.headers.get('content-type'),/^application\/json/);assert.equal(await json.text(),await fs.readFile('dist'+jsonPath,'utf8'));
  assert.equal(serveBookAttribution(new Request(origin+route+'/',{headers:{accept:'text/markdown'}})),null);
 }
 const privateResult=serveBookAttribution(new Request(origin+'/privacy-policy',{headers:{cookie:'fixture=1'}}));assert.equal(privateResult.headers.get('cache-control'),'private, no-store');
 const head=serveBookAttribution(new Request(origin+'/cookie-policy',{method:'HEAD'}));assert.equal(await head.text(),'');
 assert.equal(serveBookAttribution(new Request(origin+'/privacy-policy',{method:'POST'})).status,405);
});
test('attribution overlay leaves every other route and host to existing handlers',()=>{
 for(const url of [origin+'/ask',origin+'/verify/',origin+'/shop',origin+'/books',origin+'/pinnacle-pages-scripts/not-managed.js','https://pinnacleblooms.org/pinnacle-pages-scripts/book-commerce.js','https://other.example/pinnacle-pages-scripts/book-commerce.js'])assert.equal(serveBookAttribution(new Request(url)),null);
});
