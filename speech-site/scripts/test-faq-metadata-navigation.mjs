import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
import {build} from 'esbuild';import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {parse} from 'parse5';
import {faqMetadataMap,faqMetadata} from '../src/lib/knowledge/metadata.mjs';
import {canonicalNavigationTarget} from '../deployment/canonical-navigation-aliases.mjs';
const file='ask-public/knowledge-data/faq-index.json',bytes=await fs.readFile(file),index=JSON.parse(bytes),sha=b=>createHash('sha256').update(b).digest('hex');
test('all FAQ metadata is source-based, bounded and distinct without changing records',async()=>{
 const map=faqMetadataMap(index),seen=new Set(),descriptions=new Set(),samples=[];
 for(const x of index){const m=map.get(x.url);assert(m.title.length<=70,x.url);assert(m.description.length<=160,x.url);assert(m.title.endsWith(' | Pinnacle Blooms'));assert(m.description.endsWith('9100 181 181'));assert(!seen.has(m.title),x.url);seen.add(m.title);assert(!/\ufffd/.test(m.title+m.description));if(samples.length<7&&!samples.some(s=>s.lang===x.lang))samples.push({url:'https://www.pinnacleblooms.org'+x.url,lang:x.lang,...m});}
 assert.equal(map.size,4564);assert.equal(sha(await fs.readFile(file)),sha(bytes));assert.equal(faqMetadataMap(index),map);
 for(const x of map.values()){assert(!descriptions.has(x.description));descriptions.add(x.description);}
 const proof={records:index.length,beforeTitleOver70:index.filter(x=>x.metaTitle.length>70).length,beforeDescriptionOver160:index.filter(x=>x.description.length>160).length,afterTitleOver70:0,afterDescriptionOver160:0,afterDuplicateTitles:0,afterDuplicateDescriptions:0,sourceCatalogueSha256:sha(bytes),sourceRecordsUnchanged:true,samples,note:'Editorial length targets, not Google hard limits or crawler clearance.'};
 await fs.mkdir('outputs/faq-metadata-navigation-20261012',{recursive:true});await fs.writeFile('outputs/faq-metadata-navigation-20261012/corpus-proof.json',JSON.stringify(proof,null,2));
});
test('metadata keeps native graphemes, distinguishing topics and missing-source fallback',()=>{
 const a=index.find(x=>x.language==='english'&&x.slug==='speech-therapy-idioms-figurative-language-pinnacle-blooms');assert(faqMetadata(a).title.includes('Idioms & Figurative Language'));
 const map=faqMetadataMap(index);assert.notEqual(map.get('/faq/hindi/speech-therapy/online-speech-therapy-work').title,map.get('/faq/hindi/speech-therapy/effective-speech-therapy').title);
 const t=faqMetadata({title:'నా బిడ్డతో ఇంట్లో రోజువారీ ప్రాక్టీస్ ఎలా చేయాలి?',language:'telugu',description:'నా బిడ్డతో ఇంట్లో రోజువారీ ప్రాక్టీస్ గురించి చదవండి.'});assert(t.title.includes('నా బిడ్డతో'));assert(t.description.includes('చదవండి'));
 const blank=faqMetadata({title:'Can therapy support everyday play?'});assert(blank.title.includes('everyday play'));assert(blank.description.includes('everyday play'));
});
test('exact navigation aliases preserve campaign tuples, fragments and meaningful label destinations',()=>{
 for(const [from,to] of [['/about','/about-pinnacle-proven-improvement-rate'],['/all-resources','/autism-speech-aba-parent-family-resources'],['/assesments','/speech-aba-autism-assessments']]){
  const q='?utm_source=google&utm_medium=cpc&gclid=opaque&centre=12#next';assert.equal(canonicalNavigationTarget(from+q),to+q);
  assert.equal(canonicalNavigationTarget('http://pinnacleblooms.org'+from+'/'), 'https://www.pinnacleblooms.org'+to);
 }
 for(const x of ['tel:+919100181181','https://wa.me/919100181181','/api/enrolment','/ask/auth/google','/payonline','/donate','/about/team','https://elsewhere.example/about','//elsewhere.example/about','https://www.pinnacleblooms.org:4433/about'])assert.equal(canonicalNavigationTarget(x),x);
});
test('real Worker transform changes only aliases and preserves private/error/form/contact responses',async()=>{
 let status=200,cache='public,max-age=300',cookie=false;
 const html='<header><a href="/about?utm_source=google&amp;gclid=opaque#next">About Pinnacle</a></header><main><form action="/api/enrolment"><input name="centre" value="12"></form><a href="tel:+919100181181">Call</a><a href="https://wa.me/919100181181">WhatsApp</a><a href="/donate">Donate</a><p>తెలుగు FAQ answer</p></main>';
 const compiled=await build({stdin:{contents:"import {repairCanonicalNavigation} from './deployment/canonical-navigation-aliases.mjs';export default {async fetch(r,e){return repairCanonicalNavigation(r,await e.ORIGIN.fetch(r))}}",resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,compatibilityDate:'2026-10-03',script:compiled.outputFiles[0].text,serviceBindings:{ORIGIN:()=>new Response(html,{status,headers:{'content-type':'text/html','cache-control':cache,...(cookie?{'set-cookie':'fixture=1'}:{})}})}}));
 try{
  const r=await mf.dispatchFetch('https://www.pinnacleblooms.org/t/example'),s=await r.text(),hrefs=[];
  const visit=n=>{if(n.tagName==='a')hrefs.push(n.attrs.find(a=>a.name==='href')?.value);n.childNodes?.forEach(visit);};visit(parse(s));
  assert(hrefs.includes('/about-pinnacle-proven-improvement-rate?utm_source=google&gclid=opaque#next'),JSON.stringify(hrefs));assert(s.includes('<form action="/api/enrolment">'));assert(s.includes('tel:+919100181181'));assert(s.includes('https://wa.me/919100181181'));assert(s.includes('href="/donate"'));assert(s.includes('తెలుగు FAQ answer'));
  cache='private,no-store';assert.equal(await(await mf.dispatchFetch('https://www.pinnacleblooms.org/t/example')).text(),html);cache='public,max-age=300';cookie=true;assert.equal(await(await mf.dispatchFetch('https://www.pinnacleblooms.org/t/example')).text(),html);cookie=false;status=500;assert.equal(await(await mf.dispatchFetch('https://www.pinnacleblooms.org/t/example')).text(),html);
 }finally{await mf.dispose();}
});

