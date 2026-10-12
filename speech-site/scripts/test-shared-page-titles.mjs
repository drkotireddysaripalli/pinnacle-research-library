import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {askAnswerTitle,brandedTitle} from '../src/lib/shared-page-titles.mjs';
import {detailSeoTitle,videoSubject,createMirraclesLibrary} from '../deployment/mirracles-library.mjs';
test('Ask uses the actual question and preserves reviewed titles and Telugu graphemes',()=>{
 const a={meta_title:'Supporting a Child with Dyscalculia',h1:'Supporting Cognitive Development in a Child with Dyscalculia'};
 const b={...a,h1:'Supporting Communication in a Child with Dyscalculia'};
 assert.notEqual(askAnswerTitle(a),askAnswerTitle(b));assert(askAnswerTitle(a).includes('Cognitive Development'));
 assert.equal(askAnswerTitle({meta_title:'IEP in India: Goals, School Support & Review | Ask Pinnacle'}),'IEP in India: Goals, School Support & Review | Ask Pinnacle');
 const native=askAnswerTitle({h1:'నా బిడ్డతో ఇంట్లో రోజువారీ ప్రాక్టీస్ ఎలా చేయాలి?'});assert(native.endsWith(' | Ask Pinnacle'));assert(!native.includes('\ufffd'));assert(native.length<=70);
});
test('the complete Mirracles catalogue has bounded titles and distinct record identities',async()=>{
 const c=JSON.parse(await fs.readFile('deployment/mirracles-library-20261008/data/catalogue.json','utf8'));
 const brand='Pinnacle Blooms Network®',counts=new Map();for(const r of c.records){const k=detailSeoTitle(r);counts.set(k,(counts.get(k)||0)+1);}
 const seen=new Map(),changed=[];let oldLong=0,newLong=0,duplicates=0;
 for(const r of c.records){const duplicate=counts.get(detailSeoTitle(r))>1,t=detailSeoTitle(r,duplicate)+' | '+brand;
  assert(t.length<=70,r.path);assert(t.endsWith(brand));if(duplicate)assert(t.includes(r.id));
  if(seen.has(t))duplicates++;seen.set(t,r.id);newLong+=Number(t.length>70);
  const subject=videoSubject(r);oldLong+=Number(Math.min(subject.length,66)+3+brand.length>70);if(changed.length<8)changed.push({url:r.path,title:t});
 }
 assert.equal(duplicates,0);
 const cache=new Map();async function loadJson(name){if(!cache.has(name))cache.set(name,JSON.parse(await fs.readFile('deployment/mirracles-library-20261008/data/'+name+'.json','utf8')));return cache.get(name);}
 const handler=createMirraclesLibrary({loadJson});const rendered=[];
 for(const r of c.records.slice(0,6)){const res=await handler(new Request('https://www.pinnacleblooms.org'+r.path)),html=await res.text();assert.equal(res.status,200);const title=html.match(/<title>(.*?)<\/title>/s)[1];assert(title.length<=75);assert(html.includes('tel:+919100181181'));rendered.push({url:r.path,status:res.status,title});}
 const proof={records:c.records.length,afterLongTitles:newLong,afterDuplicateTitles:duplicates,beforeLongTitlesApproximation:oldLong,method:'All canonical index records; rendered six full detail records. Fresh audit clearance remains separate.',samples:changed,rendered};
 await fs.mkdir('outputs/shared-titles-20261012',{recursive:true});await fs.writeFile('outputs/shared-titles-20261012/corpus-title-proof.json',JSON.stringify(proof,null,2));console.log(JSON.stringify({records:c.records.length,afterLongTitles:newLong,afterDuplicateTitles:duplicates,rendered:rendered.length}));
});
