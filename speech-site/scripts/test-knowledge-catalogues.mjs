import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {faqRoute,faqRedirectURL,paged,requestedPage,pageURL,cleanPath,languages,themes,sunshineTypes} from '../src/lib/knowledge/catalogues.ts';
import {safeReturn} from '../src/lib/ask/auth.mjs';
const read=async n=>JSON.parse(await fs.readFile(new URL('../ask-public/knowledge-data/'+n+'.json',import.meta.url),'utf8'));
const index=await read('faq-index'),manifest=await read('manifest');
test('Every one of the 4564 public FAQs has a focused answer and a linked collection',async()=>{
 assert.equal(index.length,4564);assert.equal(new Set(index.map(x=>x.url)).size,index.length);
 for(const x of index){assert(Object.hasOwn(languages,x.language));assert(themes.some(t=>t.slug===x.category));const route=faqRoute(index,x.url.slice(5));assert.equal(route.item.id,x.id);assert.equal(route.redirect,null);const answer=await read('faq-'+x.language+'-'+x.id);assert(answer.html&&answer.text);assert(Buffer.byteLength(answer.html)<20000);assert(!/<(?:script|iframe|object|img)\b/i.test(answer.html));}
});
test('Pagination preserves all records and does not turn missing pages into soft 404s',()=>{
 const seen=[];for(let p=1;p<=Math.ceil(index.length/24);p++)seen.push(...paged(index,p).items);assert.deepEqual(seen,index);
 assert.equal(paged(index,0).valid,false);assert.equal(paged(index,9999).valid,false);for(const bad of ['0','-1','1.1','x','01'])assert.equal(requestedPage(bad),0);
 assert.equal(pageURL('/faq',2),' /faq?page=2'.trim());assert.equal(faqRoute(index,'english/no-such-answer'),null);assert.equal(cleanPath('english/%2e%2e/no'),null);
});
test('Language alternatives resolve and are reciprocal; existing short slugs resolve to one canonical',()=>{
 for(const x of index)for(const a of x.alternates){const target=index.find(t=>t.url===a.url);assert(target);assert(target.alternates.some(t=>t.url===x.url));}
 const x=index.find(x=>x.slug==='autism-speech-therapy'&&x.language==='english');assert.equal(faqRoute(index,'english/autism-speech-therapy').redirect,x.url);
});
test('Imported contact links remain usable and metadata decodes HTML entities once',async()=>{
 const item=index.find(x=>x.slug==='autism-speech-therapy'&&x.language==='english');const answer=await read('faq-'+item.language+'-'+item.id);
 assert.match(answer.html,/href="tel:\+919100181181"/);assert.match(answer.html,/href="mailto:care@pinnacleblooms.org"/);assert(!answer.html.includes('href="#"'));
 for(const x of index)for(const field of ['title','metaTitle','description'])assert(!/&(?:amp|quot|lt|gt);/.test(x[field]),x.url+' '+field);
});
test('ISO language aliases resolve every existing FAQ and keep ambiguous slugs missing',()=>{
 for(const x of index){const code=languages[x.language].code;const alias=x.url.replace('/faq/'+x.language+'/','/faq/'+code+'/');const route=faqRoute(index,alias.slice(5));assert.equal(route.item.id,x.id,alias);assert.equal(route.redirect,x.url);}
 for(const [name,{code}] of Object.entries(languages)){assert.equal(faqRoute(index,code).redirect,'/faq/'+name);assert.equal(faqRoute(index,code+'/speech-therapy').redirect,'/faq/'+name+'/speech-therapy');}
 for(const slug of ['find-a-center','autism-speech-therapy'])assert.equal(faqRoute(index,'hi/'+slug).redirect,'/faq/hindi/speech-therapy/'+slug);
 const ambiguous=[{language:'hindi',category:'speech-therapy',slug:'same',url:'/faq/hindi/speech-therapy/same'},{language:'hindi',category:'aba-therapy',slug:'same',url:'/faq/hindi/aba-therapy/same'}];assert.equal(faqRoute(ambiguous,'hi/same'),null);
 assert.equal(faqRoute(index,'zz/find-a-center'),null);assert.equal(faqRoute(index,'hi/no-such-answer'),null);
});
test('FAQ canonical redirects preserve campaign and service context while cleaning answer controls',()=>{
 const url=new URL('https://pinnacleblooms.org/faq/hi/find-a-center?utm_source=google&gclid=opaque&centre=123&service=speech&page=2&q=help');
 const result=new URL(faqRedirectURL(url,faqRoute(index,'hi/find-a-center')));assert.equal(result.origin,'https://www.pinnacleblooms.org');assert.equal(result.pathname,'/faq/hindi/speech-therapy/find-a-center');
 for(const key of ['utm_source','gclid','centre','service'])assert.equal(result.searchParams.get(key),url.searchParams.get(key));assert(!result.searchParams.has('q'));assert(!result.searchParams.has('page'));
 const listing=new URL('https://www.pinnacleblooms.org/faq/te?page=2&q=speech');assert.equal(faqRedirectURL(listing,faqRoute(index,'te')),'https://www.pinnacleblooms.org/faq/telugu?page=2&q=speech');
 assert.equal(faqRedirectURL(new URL('https://www.pinnacleblooms.org/faq/hindi/speech-therapy/find-a-center'),faqRoute(index,'hindi/speech-therapy/find-a-center')),null);
});
test('Google return paths extend only to the authorised knowledge families',()=>{
 for(const p of ['/faq','/faq/english/speech-therapy/autism-speech-therapy','/faq/telugu?q=speech&page=2','/sunshine','/sunshine/skills?page=3'])assert.equal(safeReturn(p),p);
 for(const p of ['//evil.invalid','/faq/../../admin','/faq/%2f%2fevil.invalid','/faq?redirect=https://evil.invalid','/sunshineevil','/sunshine/auth?token=secret','/ask/auth/google'])assert.equal(safeReturn(p),'/ask');
});
test('Sunshine promotes matched public knowledge paths, not generated cases or database-only rows',async()=>{
 const rows=await read('sunshine-index');assert.equal(rows.length,manifest.sunshineCount);assert.equal(new Set(rows.map(x=>x.url)).size,rows.length);
 for(const x of rows){assert(sunshineTypes.some(t=>t.key===x.type));assert(/^\/(?:c|b|m|t|ma|a|abs|abilities|skills)\//.test(x.url));assert.deepEqual(Object.keys(x).sort(),['description','id','image','title','type','url']);}
});
test('Mirracles directory retains unique numeric story destinations without UPLOADED placeholders',async()=>{
 let rows=[];for(let c=0;c<Math.ceil(manifest.mirraclesCount/1000);c++)rows.push(...await read('mirracles-'+c));assert.equal(rows.length,manifest.mirraclesCount);assert.equal(new Set(rows.map(x=>x.url)).size,rows.length);for(const x of rows){assert(/^\/mirracles\/\d+\//.test(x.url));assert(x.title);}
});
