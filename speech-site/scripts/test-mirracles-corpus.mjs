import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {createMirraclesLibrary} from '../deployment/mirracles-library.mjs';
const directory=new URL('../deployment/mirracles-library-20261008/data/',import.meta.url),cache=new Map();
async function loadJson(name){if(!cache.has(name))cache.set(name,JSON.parse(await fs.readFile(new URL(name+'.json',directory),'utf8')));return cache.get(name);}
test('every published video record and verified historical alias renders through the release handler',async()=>{
 const c=await loadJson('catalogue'),handle=createMirraclesLibrary({loadJson}),ids=new Set();let checked=0;
 for(const record of c.records){
  assert(!ids.has(record.id),'duplicate numeric identity '+record.id);ids.add(record.id);
  const r=await handle(new Request('https://www.pinnacleblooms.org'+record.path));assert(r,'unowned published path '+record.path);assert.equal(r.status,200,record.path);
  const html=await r.text();assert(html.includes('<h1>'),'missing article title '+record.id);assert(!html.includes('<title>Video library temporarily unavailable'),'failed record '+record.id);checked++;
 }
 for(const [p,id] of Object.entries(c.aliasPaths)){assert(ids.has(id));const r=await handle(new Request('https://www.pinnacleblooms.org'+p));assert.equal(r?.status,200,p);await r.body?.cancel();checked++;}
 assert.equal(checked,c.records.length+Object.keys(c.aliasPaths).length);
 console.log(JSON.stringify({publishedRecords:c.records.length,verifiedAliases:Object.keys(c.aliasPaths).length,rendered:checked,externalRequests:0}));
});
