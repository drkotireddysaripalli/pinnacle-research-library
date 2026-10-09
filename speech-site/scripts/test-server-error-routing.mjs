import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {serveSpeech} from '../deployment/speech-handler.mjs';

test('actual shared portal renders the original Guru article using only the two published assets',async()=>{
 const source=await fs.readFile(new URL('../deployment/guru-recovery-20261009/handler.mjs',import.meta.url),'utf8');
 const flat=await fs.readFile(new URL('../deployment/guru-recovery.mjs',import.meta.url),'utf8');
 assert.equal(flat.replaceAll('\r\n','\n'),source.replaceAll('\r\n','\n'));
 const data=JSON.parse(await fs.readFile(new URL('../deployment/guru-recovery-20261009/data/articles.json',import.meta.url),'utf8'));
 const requests=[];
 const env={ASSETS:{fetch:async request=>{
  const p=new URL(request.url).pathname;requests.push(p);
  const file=p==='/guru-recovery-data/articles.json'?'guru-recovery-20261009/data/articles.json':p==='/mirracles-library-data/shell.json'?'mirracles-library-20261008/data/shell.json':null;
  assert(file,'Unexpected asset '+p);
  return new Response(await fs.readFile(new URL('../deployment/'+file,import.meta.url)),{headers:{'content-type':'application/json'}});
 }}};
 // The reproduced exception occurred on this published identity.
 const articles=Array.isArray(data)?data:(data.articles||data.records);
 const record=Array.isArray(articles)?articles.find(r=>String(r.id)==='6379'):articles?.['6379'];
 assert(record,'Reproduced Guru identity retained');
 const response=await serveSpeech(new Request('https://www.pinnacleblooms.org'+record.canonicalPath),env,{});
 assert.equal(response.status,200);const html=await response.text();
 assert.match(html,/<h1(?:\s|>)/);assert(html.includes('tel:+919100181181'));
 assert(html.includes('https://www.pinnacleblooms.org'+record.canonicalPath));
 assert.deepEqual(requests.sort(),['/guru-recovery-data/articles.json','/mirracles-library-data/shell.json']);
});
