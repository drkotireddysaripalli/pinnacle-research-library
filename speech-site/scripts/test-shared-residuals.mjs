import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {publicRouteAlias} from '../deployment/public-route-aliases.mjs';
import {repairLegacyGraph} from '../deployment/legacy-social-metadata/schema.mjs';
import {faqPaths} from '../deployment/root-sitemap/faq-paths.mjs';
import {currentStaffPaths} from '../deployment/legacy-social-metadata/staff-records.mjs';
test('capitalized Ask entry redirects once, preserves query, bypasses unrelated and private paths',()=>{
 for(const host of ['www.pinnacleblooms.org','pinnacleblooms.org'])for(const p of ['/Ask','/Ask/'])for(const method of ['GET','HEAD']){const r=publicRouteAlias(new Request('https://'+host+p+'?utm_source=link&q=a%20b',{method}));assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://pinnacleblooms.org/ask?utm_source=link&q=a%20b');}
 for(const p of ['/ask','/Ask/auth/callback','/Ask/a-case-sensitive-slug','/Asking','/Assets/X.jpg'])assert.equal(publicRouteAlias(new Request('https://www.pinnacleblooms.org'+p)),null);
 for(const options of [{method:'POST'},{headers:{authorization:'private'}},{headers:{range:'bytes=0-2'}}])assert.equal(publicRouteAlias(new Request('https://www.pinnacleblooms.org/Ask',options)),null);
});
test('seven sitemap lists match all published FAQ canonicals, no old aliases',async()=>{
 const rows=JSON.parse(await fs.readFile('ask-public/knowledge-data/faq-index.json'));
 assert.equal(Object.values(faqPaths).flat().length,4564);
 assert.deepEqual([...new Set(Object.values(faqPaths).flat())].sort(),[...new Set(rows.map(r=>r.url))].sort());
});
test('fingerprinted invalid graphs disappear; changed source cannot opt in',async()=>{
 for(const name of ['legacy-expired-announcement.txt','legacy-dance-collection-invalid.txt']){const raw=await fs.readFile('tests/fixtures/'+name,'utf8');assert.equal(await repairLegacyGraph(raw),null);assert.equal(await repairLegacyGraph(raw+'changed'),raw+'changed');}
});
test('streaming schema repair preserves surrounding page and unknown scripts',async()=>{
 const invalid=await fs.readFile('tests/fixtures/legacy-expired-announcement.txt','utf8');
 const valid='{"@context":"https://schema.org","@type":"Webpage","name":"Keep it"}';
 const large='{"unknown":"'+'x'.repeat(270000)+'"}';
 const markup='<html><head></head><body><h1>Keep the page</h1><script type="application/ld+json">'+invalid+'</script><script type="application/ld+json" id="kept">'+valid+'</script><script type="application/ld+json">'+large+'</script><script>keepThis()</script><footer>Keep footer</footer></body></html>';
 const out=await build({stdin:{contents:`import {repairKnownLegacySchema} from './deployment/legacy-social-metadata/schema.mjs';export default {fetch(){return repairKnownLegacySchema(new Response(${JSON.stringify(markup)},{headers:{'content-type':'text/html'}}))}}`,resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:out.outputFiles[0].text,compatibilityDate:'2026-10-04'}));
 try{const s=await(await mf.dispatchFetch('https://example.test')).text();assert(!s.includes('SpecialAnnouncement'));assert(s.includes('id="kept"'));assert(s.includes('"@type":"WebPage"'));assert(s.includes(large));assert(s.includes('<script>keepThis()</script>'));assert(s.endsWith('<footer>Keep footer</footer></body></html>'));assert.equal([...s.matchAll(/<script\b/g)].length,3);}finally{await mf.dispose();}
});
test('both sitemap sources remove retired staff, canonicalize active records and preserve nonstaff',async()=>{
 const id=Object.keys(currentStaffPaths)[0],canonical=currentStaffPaths[id];
 const fixture='<?xml version="1.0"?><urlset><url><loc>https://www.pinnacleblooms.org/staff/Retired/72107</loc><image:loc>https://img.example/keep.jpg</image:loc></url><url><loc>https://www.pinnacleblooms.org/staff/Old/'+id+'</loc></url><url><loc>https://www.pinnacleblooms.org/centers</loc><image:loc>https://img.example/keep.jpg</image:loc></url></urlset>';
 const out=await build({entryPoints:['deployment/root-sitemap/index.mjs'],bundle:true,write:false,format:'esm'});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:out.outputFiles[0].text,compatibilityDate:'2026-10-04',outboundService:()=>new Response(fixture)}));
 try{for(const path of ['/sitemaps/bots.xml','/sitemaps/staff.xml']){const r=await mf.dispatchFetch('https://www.pinnacleblooms.org'+path),s=await r.text();assert.equal(r.status,200);assert(!s.includes('/72107'));assert(s.includes(canonical));assert(s.includes('/centers'));assert.equal([...s.matchAll(/<url>/g)].length,2);assert.equal([...s.matchAll(/<image:loc>/g)].length,1);}for(const code of Object.keys(faqPaths)){const r=await mf.dispatchFetch('https://www.pinnacleblooms.org/sitemaps/faq-'+code+'.xml');assert.equal([...((await r.text()).matchAll(/<url>/g))].length,652);}}finally{await mf.dispose();}
});
