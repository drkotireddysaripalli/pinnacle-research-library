import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {BOOK_ROUTES,serveSpeech} from '../deployment/speech-handler.mjs';

const source=fs.readFileSync(new URL('../deployment/pinnacle-route-v12.mjs',import.meta.url),'utf8');
const inventory=JSON.parse(source.match(/const SPEECH_INVENTORY\s*=\s*(\{.*?\});/s)[1]);
const origin='https://www.pinnacleblooms.org';

test('every published book route is backed by an asset in the production inventory',async()=>{
 for(const [route,slug] of Object.entries(BOOK_ROUTES)){
  const key='/pinnacle-pages-html/'+slug+'.html';
  assert.match(inventory[key]||'',/^[a-f0-9]{16}$/,route+' has no deployed asset');
  let requested;
  const response=await serveSpeech(new Request(origin+route),{ASSETS:{fetch:async request=>{
   requested=new URL(request.url).pathname;
   return new Response('<html><head></head><body><h1>Fixture</h1></body></html>',{headers:{'content-type':'text/html'}});
  }}},inventory);
  assert.equal(response?.status,200,route);
  assert.equal(requested,key,route+' must resolve its own file');
 }
});

test('Hindi and Telugu sample images survive the deployment inventory',()=>{
 for(const locale of ['hi','te'])for(const subject of ['speech','ot','aba','special-education'])for(const sample of [1,2]){
  const key=`/pinnacle-pages-assets/book-gallery-20261003/${locale}/${subject}-sample-${sample}.png`;
  assert.match(inventory[key]||'',/^[a-f0-9]{16}$/,key);
 }
});

test('release union preserves all mapped bytes and every native book dependency',{skip:!process.env.PINNACLE_ASSET_UNION},()=>{
 const union=path.resolve(process.env.PINNACLE_ASSET_UNION);
 const verify=JSON.parse(source.match(/const STATIC_FILES\s*=\s*(\{.*?\});/s)[1]);
 for(const [key,hash] of Object.entries({...verify,...inventory})){
  const bytes=fs.readFileSync(path.join(union,key));
  assert(createHash('sha256').update(bytes).digest('hex').startsWith(hash),key);
 }
 for(const [route,slug] of Object.entries(BOOK_ROUTES))if(/^\/books\/(hi|te|editions)\//.test(route)||['/books/hi','/books/te'].includes(route)){
  const html=fs.readFileSync(path.join(union,'pinnacle-pages-html',slug+'.html'),'utf8');
  for(const match of html.matchAll(/(?:src|href)="(\/pinnacle-pages-(?:assets|scripts)\/[^"?#]+)/g)){
   assert(inventory[match[1]],route+' dependency not mapped: '+match[1]);
   assert(fs.existsSync(path.join(union,match[1])),match[1]);
  }
 }
});
