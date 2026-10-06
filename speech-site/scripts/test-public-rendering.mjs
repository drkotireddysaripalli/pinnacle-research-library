import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {publicLinkTarget} from '../deployment/public-link-target.mjs';
import {currentStaffPaths} from '../deployment/legacy-social-metadata/staff-records.mjs';

test('known public aliases skip a redirect and preserve query/fragment intent',()=>{
 assert.equal(publicLinkTarget('http://www.pinnacleblooms.org/centers?q=x#map'),'https://www.pinnacleblooms.org/centers?q=x#map');
 assert.equal(publicLinkTarget('/Ask/?utm_source=guide#read'),'https://pinnacleblooms.org/ask?utm_source=guide#read');
 assert.equal(publicLinkTarget('/physio-therapy?utm_source=guide'),'/physiotherapy?utm_source=guide');
 const [id,target]=Object.entries(currentStaffPaths)[0];
 assert.equal(publicLinkTarget('/staff/Old/'+id+'?ref=guide#profile'),target+'?ref=guide#profile');
 for(const href of ['/staff/Retired/72107','https://example.org/Ask','http://www.pinnacleblooms.org/Images/X.jpg','http://www.pinnacleblooms.org/api/status','/ask/auth/callback?code=x','/ask/account','/Case-Sensitive-Page','tel:+919100181181','mailto:care@pinnacleblooms.org','//external.example/a','https://www.pinnacleblooms.org.evil.test/Ask'])assert.equal(publicLinkTarget(href),href);
});

test('existing footer keeps content, uses native lazy artwork and remains idempotent',async()=>{
 const html=`<html><head><title>Keep</title></head><body><main>Family guidance</main><footer><div class="portal-footer" style="--portal-footer-art:url('/pinnacle-pages-assets/portal-footer-shapes.BezEM5wy_1Gfamd.webp');color:white"><div class="portal-footer-art"><div class="portal-container"><a href="http://www.pinnacleblooms.org/centers">Centres</a><button>Privacy</button></div></div></div></footer></body></html>`;
 const out=await build({stdin:{contents:`import {repairSharedNavigation} from './deployment/shared-navigation.mjs';export default{fetch(r){const response=new Response(${JSON.stringify(html)},{headers:{'content-type':'text/html','cache-control':new URL(r.url).pathname==='/private'?'private, no-store':'public,max-age=300'}});return repairSharedNavigation(r,repairSharedNavigation(r,response));}}`,resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:out.outputFiles[0].text,compatibilityDate:'2026-10-04'}));
 try{
  const result=await(await mf.dispatchFetch('https://www.pinnacleblooms.org/')).text();
  assert.equal((result.match(/<img /g)||[]).length,1);assert.equal((result.match(/<style data-pinnacle-footer-art/g)||[]).length,1);
  assert(result.includes('loading="lazy"'));assert(result.includes('aria-hidden="true"'));assert(result.includes('style="color:white"'));assert(result.includes('<button>Privacy</button>'));assert(result.includes('<main>Family guidance</main>'));assert(!result.includes('--portal-footer-art:'));assert(result.includes('href="https://www.pinnacleblooms.org/centers"'));
  assert.equal(await(await mf.dispatchFetch('https://www.pinnacleblooms.org/private')).text(),html);
  assert.equal(await(await mf.dispatchFetch('https://www.pinnacleblooms.org/',{headers:{authorization:'private'}})).text(),html);
 }finally{await mf.dispose();}
});
