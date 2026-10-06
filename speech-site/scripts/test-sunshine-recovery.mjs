import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {recovered,sunshineRecords,sunshineTopic} from '../src/lib/knowledge/recovery.mjs';
import {recoveryRoutes,recoveryPath,sunshineRedirect,invalidSunshineLinks} from '../deployment/sunshine-recovery-routes.mjs';
import {publicLinkTarget} from '../deployment/public-link-target.mjs';
const records=JSON.parse(await fs.readFile(new URL('../ask-public/knowledge-data/sunshine-index.json',import.meta.url),'utf8'));
test('All 39 evidenced broken records resolve to one distinct useful topic and direct links',()=>{
 assert.equal(recovered.length,39);assert.equal(new Set(recovered.map(x=>x.url)).size,39);
 for(const r of recovered){
  assert.equal(recoveryRoutes[r.legacyPath],r.url);assert.equal(sunshineTopic(r.url.slice(10)).id,r.id);
  assert(r.description.length>80&&r.example.length>80&&r.question.endsWith('?'));
  for(const p of [r.legacyPath,encodeURI(r.legacyPath),r.legacyPath+'/']){
   const response=sunshineRedirect(new Request('https://www.pinnacleblooms.org'+p+'?ref=library'));
   assert.equal(response.status,301);assert.equal(response.headers.get('location'),'https://www.pinnacleblooms.org'+r.url+'?ref=library');
   assert.equal(publicLinkTarget('https://www.pinnacleblooms.org'+p+'#details'),'https://www.pinnacleblooms.org'+r.url+'#details');
  }
 }
});
test('Restored records are discoverable without duplicating existing identities or losing the catalogue',()=>{
 const all=sunshineRecords(records);assert.equal(new Set(all.map(x=>x.id)).size,all.length);
 for(const r of records)assert(all.some(x=>x.id===r.id));for(const r of recovered)assert(all.some(x=>x.id===r.id&&x.url===r.url));
 assert.equal(sunshineTopic('topic/unknown'),null);assert.equal(recoveryPath('/ma/wil'),'/ma/wilbarger-brush-therapy-tool');
});
test('Broken placeholders are removed, with unrelated, sensitive and external links preserved',()=>{
 assert.equal(invalidSunshineLinks.size,2);for(const p of invalidSunshineLinks)assert.equal(publicLinkTarget(p),null);
 for(const href of ['https://example.com/ma/therapy-materials/cotton-buds','/api/ma/therapy-materials/cotton-buds','/verify/documents/Example.pdf','/ma/unknown'])assert.equal(publicLinkTarget(href),href);
 const url='https://www.pinnacleblooms.org'+recovered[0].legacyPath;
 assert.equal(sunshineRedirect(new Request(url,{method:'POST'})),null);
 assert.equal(sunshineRedirect(new Request(url,{headers:{authorization:'Bearer test'}})),null);
 assert.equal(sunshineRedirect(new Request(url.replace('www.pinnacleblooms.org','example.com'))),null);
});
