import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {ANEK_SCRIPTS,VERNACULAR_CSS} from '../deployment/vernacular-typography.mjs';

test('all nine Indian scripts use self-hosted Anek with real ExtraBold and no Latin replacement',()=>{
 assert.equal(ANEK_SCRIPTS.length,9);
 assert(!VERNACULAR_CSS.includes('U+0000'));
 assert(VERNACULAR_CSS.includes('font-weight:800!important'));
 assert(VERNACULAR_CSS.includes('font-weight:600!important'));
 for(const [s] of ANEK_SCRIPTS)assert(VERNACULAR_CSS.includes('/verify/fonts/anek-'+s+'.woff2'));
});

test('streaming typography is idempotent, preserves native content and private cache policy, excludes auth and non-HTML',async()=>{
 const html='<html lang="te"><head><title>తెలుగు</title></head><body><h1>మీ బిడ్డ</h1><p>పూర్తి నమ్మకంతో</p><a href="tel:+919100181181">Call</a><nav class="mobile-cta"><a href="tel:+919100181181">కాల్ చేయండి 9100 181 181</a></nav></body></html>';
 const out=await build({stdin:{contents:`import {applyVernacularTypography as apply} from './deployment/vernacular-typography.mjs';export default {fetch(r){const json=new URL(r.url).pathname==='/data';const original=new Response(json?'{}':${JSON.stringify(html)},{headers:{'content-type':json?'application/json':'text/html','cache-control':'private, no-store'}});return apply(r,apply(r,original));}}`,resolveDir:process.cwd()},bundle:true,write:false,format:'esm'});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:out.outputFiles[0].text,compatibilityDate:'2026-09-18'}));
 try{
  const r=await mf.dispatchFetch('https://www.pinnacleblooms.org/books/te',{headers:{cookie:'consent=accepted'}});const body=await r.text();
  assert.equal((body.match(/data-pinnacle-vernacular=/g)||[]).length,1);
  assert.equal(body.replace(/<style data-pinnacle-vernacular="[^"]+">[\s\S]*?<\/style>/,'').replaceAll('\u00a0',' '),html);
  assert(body.includes('9100\u00a0181\u00a0181'));
  assert.equal(r.headers.get('cache-control'),'private, no-store');
  for(const path of ['/ask/auth/callback','/ask/account'])assert.equal(await (await mf.dispatchFetch('https://pinnacleblooms.org'+path)).text(),html);
  assert.equal(await (await mf.dispatchFetch('https://www.pinnacleblooms.org/data')).text(),'{}');
 }finally{await mf.dispose();}
});
