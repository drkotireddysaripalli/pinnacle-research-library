import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {legacyTemplateEligible,LEGACY_TEMPLATE_PATHS,LEGACY_TITLE_REPAIRS,residualCentreAlias,residualTemplateRequest} from '../deployment/legacy-template-coverage.mjs';
import {CENTRE_CANONICAL_PATHS} from '../deployment/centre-canonical-paths.mjs';
import {PUBLIC_PAGE_ALIASES,publicLinkTarget} from '../deployment/public-link-target.mjs';
import {repairObservedCollection} from '../deployment/legacy-social-metadata/schema.mjs';
const origin='https://www.pinnacleblooms.org';
test('all and only registered centre case variants use current pages with attribution intact',async()=>{
 const register=JSON.parse(await fs.readFile('src/data/centre-register.json','utf8')).centres;
 assert.deepEqual([...CENTRE_CANONICAL_PATHS].sort(),register.map(c=>new URL(c.profileUrl).pathname).sort());
 for(const path of CENTRE_CANONICAL_PATHS){const source=path.replace('/centers/','/Centers/');const r=residualCentreAlias(new Request(origin+source+'?gclid=opaque&utm_source=fixture'));assert.equal(r.status,301);assert.equal(r.headers.get('location'),origin+path+'?gclid=opaque&utm_source=fixture');assert.equal(publicLinkTarget(source+'#contact'),path+'#contact');assert.equal(residualCentreAlias(new Request(origin+path)),null);}
 for(const path of ['/Centers/unknown-centre','/api/Centers/known','/staff/Sensitive/123'])assert.equal(residualCentreAlias(new Request(origin+path)),null);
 for(const opts of [{method:'POST'},{headers:{authorization:'fixture'}},{headers:{range:'bytes=0-2'}}])assert.equal(residualCentreAlias(new Request(origin+[...CENTRE_CANONICAL_PATHS][0].toUpperCase(),opts)),null);
});
test('old validators cannot restore stale repaired heads; credentials and source parameters survive',()=>{
 const request=new Request(origin+'/music-therapy?gclid=opaque',{headers:{'if-none-match':'old','if-modified-since':'old',cookie:'choice=1'}}),forwarded=residualTemplateRequest(request);
 assert.equal(forwarded.url,request.url);assert.equal(forwarded.headers.get('cookie'),'choice=1');assert(!forwarded.headers.has('if-none-match'));assert(!forwarded.headers.has('if-modified-since'));
 const privateRequest=new Request(origin+'/ask/auth/callback',{headers:{'if-none-match':'old'}});assert.equal(residualTemplateRequest(privateRequest),privateRequest);
});
test('known compatibility links go directly to their final pages and retain attribution',()=>{
 for(const [source,target] of Object.entries(PUBLIC_PAGE_ALIASES))for(const prefix of ['',origin,'http://www.pinnacleblooms.org','https://pinnacleblooms.org'])for(const suffix of ['','/'])assert.equal(publicLinkTarget(prefix+source+suffix+'?utm_source=fixture&gclid=opaque#visit'),(prefix?origin:'')+target+'?utm_source=fixture&gclid=opaque#visit');
 for(const s of ['/ask/auth/callback?code=secret','/Images/Example.JPG','/centres/not-a-known-alias','https://external.test/enroll','/enroll-more'])assert.equal(publicLinkTarget(s),s);
});
test('residual coverage is restricted to named public paths and excludes functional/private requests',()=>{
 assert.equal(LEGACY_TEMPLATE_PATHS.size,33);
 for(const p of [...LEGACY_TEMPLATE_PATHS,'/assessments/speech-and-language-evaluation-assessment'])assert(legacyTemplateEligible(new Request(origin+p)));
 for(const p of ['/pinnacleai','/ask/example','/verify/','/api/intake','/music-therapy/unknown','/assessments','/assessments/x/answer','/assessments/SensitiveCase'])assert(!legacyTemplateEligible(new Request(origin+p)));
 for(const options of [{method:'POST'},{method:'HEAD'},{headers:{authorization:'fixture'}},{headers:{range:'bytes=0-100'}}])assert(!legacyTemplateEligible(new Request(origin+'/music-therapy',options)));
 assert(!legacyTemplateEligible(new Request(origin+'/music-therapy?page=2')));
});
const collection='{"@context":"http://schema.org","@type":"CollectionPage","id":"http://www.pinnacleblooms.org/music-therapy","url":"http://www.pinnacleblooms.org/music-therapy","description":"Keep every claim and number 9007199254740993123","mainEntityOfPage":{"@type":"ImageGallery","image":[ //begin bracket for multiple entries under image\n{"@type":"ImageObject","url":"https://www.pinnacleblooms.org/images/seo/1.jpeg"}] //end bracket for ImageGallery > image(s)\n} //end bracket for mainEntityOfPage\n}';
test('observed collection syntax is repaired without changing images, copy or unknown graphs',()=>{
 const repaired=repairObservedCollection(collection,origin+'/music-therapy'),j=JSON.parse(repaired);
 assert.equal(j['@id'],origin+'/music-therapy');assert.equal(j.url,j['@id']);assert.equal(j.description,'Keep every claim and number 9007199254740993123');assert.equal(j.mainEntityOfPage.image[0].url,origin+'/images/seo/1.jpeg');assert(!('id' in j));
 for(const [raw,url] of [[collection,origin+'/different'],[collection.replace('ImageGallery','UnknownGallery'),origin+'/music-therapy'],[collection.replace('description','newProperty'),origin+'/music-therapy'],[collection,origin+'/music-therapy?private=1']])assert.equal(repairObservedCollection(raw,url),raw);
});
test('captured campaign collection decodes its URL entity without accepting a functional query',()=>{
 const url=origin+'/music-therapy?utm_source=release-fixture&gclid=opaque';
 const raw=collection.replaceAll('http://www.pinnacleblooms.org/music-therapy','http://www.pinnacleblooms.org/music-therapy?utm_source=release-fixture&amp;gclid=opaque');
 const j=JSON.parse(repairObservedCollection(raw,url));
 assert.equal(j['@id'],origin+'/music-therapy');assert.equal(j.url,j['@id']);assert.equal(j.description,'Keep every claim and number 9007199254740993123');
 const functional=raw.replaceAll('utm_source=release-fixture','search=private');
 assert.equal(repairObservedCollection(functional,url.replace('utm_source=release-fixture','search=private')),functional);
 assert.equal(repairObservedCollection(raw,url.replace('gclid=opaque','gclid=different')),raw);
});
test('actual Worker parser preserves public document, privacy semantics and bounded stream guards',async t=>{
 const expired=await fs.readFile('tests/fixtures/legacy-expired-announcement.txt','utf8');
 const markup=path=>`<!doctype html><html><head><link rel="canonical" href="${origin+path}"><meta property="og:url" content="${(origin+path).replace('https:','http:')}"></head><body><header>Approved header</header><main>Family 🌸 తెలుగు <a href="/t/aba-therapy?utm_source=fixture#contact">ABA support</a></main><script type="application/ld+json">${expired}</script><script type="application/ld+json">${collection}</script><footer>Approved footer</footer></body></html>`;
 let current={html:markup('/music-therapy'),headers:{}};
 const b=await build({stdin:{contents:`import {repairResidualLegacyTemplates} from './deployment/legacy-template-coverage.mjs';export default {async fetch(r,env){return repairResidualLegacyTemplates(r,await env.ORIGIN.fetch(r))}}`,resolveDir:process.cwd()},bundle:true,write:false,format:'esm'});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:b.outputFiles[0].text,compatibilityDate:'2026-10-07',serviceBindings:{ORIGIN:()=>{const bytes=new TextEncoder().encode(current.html);let pos=0;return new Response(new ReadableStream({pull(c){if(pos===bytes.length){c.close();return;}c.enqueue(bytes.slice(pos,pos+17));pos=Math.min(pos+17,bytes.length);}}),{status:current.status||200,headers:{'content-type':'text/html; charset=utf-8','cache-control':'private,max-age=60',etag:'"old"',...current.headers}});}}}));
 async function run(options={},path='/music-therapy'){current={html:markup('/music-therapy'),headers:{},...options};const r=await mf.dispatchFetch(origin+path);return {r,text:Buffer.from(await r.arrayBuffer()).toString('utf8')};}
 try{
  await t.test('schema, social URL and navigation repair retains approved body and Unicode',async()=>{const {r,text}=await run();assert(text.includes('<meta property="og:url" content="'+origin+'/music-therapy">'));assert(!text.includes('SpecialAnnouncement'));assert(text.includes('"@id":"'+origin+'/music-therapy"'));assert(text.includes('Family 🌸 తెలుగు'));assert(text.includes('/best-aba-therapy-center-india-proven-improvement-rate?utm_source=fixture#contact'));assert(text.includes('<header>Approved header</header>'));assert(text.endsWith('<footer>Approved footer</footer></body></html>'));assert.equal(r.headers.get('cache-control'),'private,max-age=60');assert.equal(r.headers.get('etag'),null);});
  await t.test('six exact title repairs preserve revised source titles and visible copy',async()=>{
   for(const [path,title] of Object.entries(LEGACY_TITLE_REPAIRS)){
    const source=markup(path).replace('<head>','<head><title>'+title.before.replaceAll('&','&amp;')+'</title>');
    const {text}=await run({html:source},path);assert(text.includes('<title>'+title.after.replaceAll('&','&amp;')+'</title>'));assert(text.includes('<main>Family 🌸 తెలుగు'));
    const updated=source.replace(title.before.replaceAll('&','&amp;'),'Updated source title');assert((await run({html:updated},path)).text.includes('<title>Updated source title</title>'));
   }
  });
  for(const [name,options] of [
   ['duplicate canonical',{html:markup('/music-therapy').replace('</head>','<link rel="canonical" href="'+origin+'/music-therapy"></head>')}],
   ['external canonical',{html:markup('/music-therapy').replace('href="'+origin+'/music-therapy"','href="https://external.test/music-therapy"')}],
   ['noindex meta',{html:markup('/music-therapy').replace('</head>','<meta name="robots" content="noindex"></head>')}],
   ['set-cookie',{headers:{'set-cookie':'private=1; Secure'}}],['no-store',{headers:{'cache-control':'no-store'}}],['no-transform',{headers:{'cache-control':'no-transform'}}],['header noindex',{headers:{'x-robots-tag':'noindex'}}],['JSON',{headers:{'content-type':'application/json'}}],['500',{status:500}],
   ['BOM',{html:'\ufeff'+markup('/music-therapy')}],['head over bound',{html:markup('/music-therapy').replace('<head>','<head><!--'+'x'.repeat(66000)+'-->')}]
  ])await t.test('preserve '+name,async()=>{const {r,text}=await run(options);assert.equal(text,options.html||markup('/music-therapy'));assert(!r.headers.has('x-pinnacle-template-coverage'));});
  await t.test('unknown and functional routes are byte-preserved',async()=>{for(const path of ['/music-therapy?search=private','/music-therapy-not-known'])assert.equal((await run({},path)).text,markup('/music-therapy'));});
 }finally{await mf.dispose();}
});
