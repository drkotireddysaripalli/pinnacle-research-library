import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createGuruRecovery,GURU_RECOVERY_RELEASE} from './handler.mjs';
const data=JSON.parse(await fs.readFile(new URL('./data/articles.json',import.meta.url),'utf8'));
const shell={head:'<meta name="existing-common-shell" content="fixture">',header:'<header>EXISTING_HEADER</header>',footer:'<footer>EXISTING_FOOTER</footer>'};
const handler=createGuruRecovery({loadJson:async()=>data,shell});
const origin='https://www.pinnacleblooms.org';
const get=(path,options)=>handler(new Request(origin+path,options));

test('all491 original article identities, full passive body and source media survive',async()=>{
 assert.equal(Object.keys(data.records).length,491);assert.deepEqual(data.holds,[]);
 let images=0;
 for(const record of Object.values(data.records)){
  const response=await get(record.paths[0]);assert.equal(response.status,200,record.id);
  const html=await response.text();assert.equal(response.headers.get('x-pinnacle-guru-recovery'),GURU_RECOVERY_RELEASE);
  assert(html.includes(record.body),record.id+' full body');
  assert(html.includes('EXISTING_HEADER'));assert(html.includes('EXISTING_FOOTER'));
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);
  const canonical=origin+record.canonicalPath;
  assert(html.includes('<link rel="canonical" href="'+canonical+'">'));
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.equal(graph.find(x=>x['@type']==='Article').url,canonical);
  assert.equal(graph.find(x=>x['@type']==='Article').headline,record.title);
  assert.equal(graph.find(x=>x['@type']==='Article').publisher['@id'],origin+'/verify/#organization');
  assert(!/<(?:script|iframe|form|input|object|embed|style|svg)\b|\son[a-z]+\s*=/i.test(record.body),record.id+' safe passive body');
  assert(html.includes('href="tel:+919100181181"'));
  for(const image of record.images){assert(html.includes(image.src.replaceAll('&','&amp;')));images++;}
  for(const key of ['CenterId','CBPI','UBPI','F25','LanguageId'])assert(!Object.hasOwn(record,key));
 }
 assert(images>=149);
});
test('bare/changed slugs redirect without dropping attribution and unknown identities pass through',async()=>{
 const query='?utm_source=google&q=one%20two&q=one+two&x=%2F%26&empty=';
 for(const record of Object.values(data.records)){
  for(const p of ['/guru/'+record.id,'/guru/'+record.id+'/INVENTED']){
   const r=await get(p+query);assert.equal(r.status,308);assert.equal(r.headers.get('location'),origin+record.canonicalPath+query);
  }
 }
 assert.equal(await get('/guru/999999999999/unknown'),null);
});
test('private and malformed requests never enter published data or shell handling',async()=>{
 let reads=0;const isolated=createGuruRecovery({loadJson:async()=>{reads++;return data},shell});
 const record=Object.values(data.records)[0];
 for(const request of [new Request(origin+record.paths[0],{method:'POST',body:'INVENTED'}),new Request(origin+record.paths[0],{headers:{authorization:'INVENTED'}}),new Request(origin+record.paths[0],{headers:{range:'bytes=0-1'}}),new Request('https://mirracle.pinnacleblooms.org'+record.paths[0]),new Request(origin+'/guru/123/%2Fprivate'),new Request(origin+'/guru/123/%ZZ'),new Request(origin+'/api/enrolment'),new Request(origin+'/guru/account')])assert.equal(await isolated(request),null);
 assert.equal(reads,0);
});
test('HEAD is empty; cookie and query documents cannot be publicly cached',async()=>{
 const path=Object.values(data.records)[0].paths[0];
 const head=await get(path,{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
 assert.equal((await get(path,{headers:{cookie:'INVENTED'}})).headers.get('cache-control'),'private, no-store');
 assert.equal((await get(path+'?gclid=INVENTED')).headers.get('cache-control'),'private, no-store');
 assert.equal((await get(path)).headers.get('cache-control'),'public, max-age=0, s-maxage=300');
});
test('failed source is honest503 without leaking private error and next load recovers',async()=>{
 let reads=0;const recovering=createGuruRecovery({loadJson:async()=>{if(++reads===1)throw Error('INVENTED_PRIVATE_DETAIL');return data},shell});
 const req=new Request(origin+Object.values(data.records)[0].paths[0]);
 const first=await recovering(req);assert.equal(first.status,503);assert(!(await first.text()).includes('INVENTED_PRIVATE_DETAIL'));assert.match(first.headers.get('x-robots-tag'),/noindex/);
 assert.equal((await recovering(req)).status,200);
 const noShell=createGuruRecovery({loadJson:async()=>data,shell:async()=>({})});assert.equal((await noShell(req)).status,503);
});

 test('existing common shell supplies Anek for all nine scripts and source language remains explicit',async()=>{
 const realShell=JSON.parse(await fs.readFile(new URL('../mirracles-library-20261008/data/shell.json',import.meta.url),'utf8'));
 assert(realShell.head.includes('data-pinnacle-vernacular="anek-20261006"'));
 for(const script of ['devanagari','bangla','gurmukhi','gujarati','odia','tamil','telugu','kannada','malayalam'])assert(realShell.head.includes('anek-'+script+'.woff2'));
 assert(realShell.head.includes('font-weight:800!important'));
 const actual=createGuruRecovery({loadJson:async()=>data,shell:realShell});
 for(const lang of new Set(Object.values(data.records).map(x=>x.language))){
  const record=Object.values(data.records).find(x=>x.language===lang);
  const html=await (await actual(new Request(origin+record.paths[0]))).text();
  assert(html.includes('<article class="guru-article" lang="'+lang+'"'));
  assert(html.includes(realShell.head));
  if(lang==='und-Deva')assert(html.includes('[lang="und-Deva"],.guru-recovery [lang="und-Deva"]'));
 }
 });
