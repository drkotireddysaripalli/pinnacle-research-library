import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {build} from 'esbuild';import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {publicLinkTarget} from '../deployment/public-link-target.mjs';
import {repairSchemaText} from '../deployment/legacy-social-metadata/schema.mjs';
import {topicPaths} from '../deployment/root-sitemap/topic-paths.mjs';
import {createMirraclesLibrary} from '../deployment/mirracles-library-20261008/library.mjs';
test('common menu aliases preserve source and section while skipping observed redirect',()=>{
 for(const [from,to] of [['/contact','/contact-national-autism-helpline-24-7'],['/services','/top-autism-therapy-services-india-proven-improvement-rate'],['/news','/autism-speech-aba-news'],['/aba-therapy','/best-aba-therapy-center-india-proven-improvement-rate'],['/occupational-therapy','/best-occupational-therapy-center-india-proven-improvement-rate'],['/special-education','/best-special-education-center-call-9100181181']])assert.equal(publicLinkTarget(from+'?utm_source=guide#Cost-section'),to+'?utm_source=guide#Cost-section');
 assert.equal(publicLinkTarget('/donate'),'/donate');
});
test('known empty schema defaults and publisher typo repair without numerical loss',()=>{
 const raw='{"@context":"https://schema.org","@type":"WebPage","thumbnailUrl":"","dateCreated":"","identifier":12345678901234567890,"publisher":{"@type":"Organization","name":"Pinnace Blooms Network"}}';
 const repaired=repairSchemaText(raw),parsed=JSON.parse(repaired);assert(!('dateCreated'in parsed));assert(!('thumbnailUrl'in parsed));assert(repaired.includes('12345678901234567890'));assert.equal(parsed.publisher.name,'Pinnacle Blooms Network');
});
test('all approved video records have contextual incoming neighbours; archive holds stay intact',async()=>{
 const c=JSON.parse(await fs.readFile('deployment/mirracles-library-20261008/data/catalogue.json'));
 const groups=new Map();for(const id of c.order){const r=c.records.find(r=>r.id===id);if(!groups.has(r.category||''))groups.set(r.category||'',[]);groups.get(r.category||'').push(r);}
 const handler=createMirraclesLibrary({loadJson:async name=>JSON.parse(await fs.readFile('deployment/mirracles-library-20261008/data/'+name+'.json'))});
 for(const group of groups.values())if(group.length>1){const prev=group[group.length-1],next=group[0],html=await(await handler(new Request('https://www.pinnacleblooms.org'+prev.path))).text();assert(html.includes('href="'+next.path+'"'));}
 assert.equal([...groups.values()].reduce((n,g)=>n+g.length,0),19292);
});
test('streaming shared transform deduplicates font requests and styles, keeps body, calls and private exclusions',async()=>{
 const font="@font-face {font-family:'Fixture';src:url(f.woff2);}";
 const markup='<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=A"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=A"><style>'+font+'</style><style>'+font+'</style></head><body><main>Keep article</main><a href="/contact">Contact</a><a href="tel:+919100181181">Call</a></body></html>';
 const b=await build({stdin:{contents:`import {repairUrlHealth} from './deployment/url-health-repair.mjs';export default{fetch(r){return repairUrlHealth(r,new Response(${JSON.stringify(markup)},{headers:{'content-type':'text/html'}}));}}`,resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:b.outputFiles[0].text,compatibilityDate:'2026-10-04'}));
 try{const html=await(await mf.dispatchFetch('https://www.pinnacleblooms.org/t/example')).text();assert.equal(html.split(font).length-1,1);assert.equal(html.split('fonts.googleapis.com').length-1,1);assert(html.includes('Keep article'));assert(html.includes('tel:+919100181181'));assert(html.includes('/contact-national-autism-helpline-24-7'));assert.equal(await(await mf.dispatchFetch('https://www.pinnacleblooms.org/api/test')).text(),markup);}finally{await mf.dispose();}
});
test('core sitemap includes authoritative original topics, excludes aliases, has no duplicate locs',async()=>{
 assert.equal(topicPaths.length,1798);assert.equal(new Set(topicPaths).size,1798);
 const b=await build({entryPoints:['deployment/root-sitemap/index.mjs'],bundle:true,write:false,format:'esm'});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:b.outputFiles[0].text,compatibilityDate:'2026-10-04'}));
 try{const r=await mf.dispatchFetch('https://www.pinnacleblooms.org/sitemaps/core.xml'),s=await r.text(),locs=[...s.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert.equal(r.status,200);assert.equal(locs.length,new Set(locs).size);assert(locs.includes('https://www.pinnacleblooms.org/t/interactive-song-therapy'));assert(!locs.includes('https://www.pinnacleblooms.org/shop'));const index=await(await mf.dispatchFetch('https://www.pinnacleblooms.org/sitemap.xml')).text();assert(!index.includes('/allmirracles-sitemap.xml'));}finally{await mf.dispose();}
});
