import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {suchitraContent as page,suchitraPath,suchitraEnquiry} from '../src/data/suchitra-content.ts';
import {serveSpeech} from '../deployment/speech-handler.mjs';
const origin='https://www.pinnacleblooms.org',html=fs.readFileSync('dist'+suchitraPath+'.html','utf8');
const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1])['@graph'];
test('retained canonical and source-based LocalBusiness have no invented rating, hours, credential or offer',()=>{
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert(html.includes('rel="canonical" href="'+origin+suchitraPath+'"'));
 assert(html.includes('index, follow, max-image-preview:large'));
 const local=graph.find(x=>x['@type']==='LocalBusiness');
 assert(local);assert.equal(local.telephone,'+919100181181');assert.equal(local.address.postalCode,'500067');
 for(const key of ['aggregateRating','review','openingHours','openingHoursSpecification','hasCredential'])assert(!(key in local));
 assert(!graph.some(x=>x['@type']==='Offer'));assert.equal(local.parentOrganization['@id'],origin+'/verify/#organization');
});
test('eight source-identical FAQ answers, seven stages and precise facility workflow status',()=>{
 const faq=graph.find(x=>x['@type']==='FAQPage');assert.deepEqual(faq.mainEntity.map(x=>({question:x.name,answer:x.acceptedAnswer.text})),page.faqs);
 assert.equal(faq.mainEntity.length,8);assert(html.includes('Query Raised'));assert(html.includes('hfr-IN3610023010'));
 const record=JSON.parse(fs.readFileSync('public/pinnacle-pages-data/suchitra-evidence.json','utf8'));assert.equal(record.stages.length,7);assert.equal(record.facilityRecord.isAcceptedCredential,false);assert.equal(record.facilityRecord.portalStatus,'Query Raised');
 for(const source of page.sources)assert(html.includes(source.url));
});
test('enquiry retains Suchitra preference and a real existing service choice',()=>{
 const u=new URL(suchitraEnquiry);assert.equal(u.searchParams.get('centre'),'suchitra');assert.equal(u.searchParams.get('service'),'help');assert(html.includes(suchitraEnquiry.replaceAll('&','&amp;')));
});
test('centre canonical serves HTML, Markdown and bodyless HEAD; Vary preserves Accept',async()=>{
 const inv={'/pinnacle-pages-html/suchitra.html':'fixture','/pinnacle-pages-data/suchitra-machine.md':'machine'};
 const env={ASSETS:{fetch:async req=>new Response(req.url.endsWith('.md')?'# centre':'centre',{headers:{'content-type':'text/plain'}})}};
 for(const [method,headers,expected]of [['GET',{},'centre'],['GET',{accept:'text/markdown'},'# centre'],['HEAD',{},'']]){
  const r=await serveSpeech(new Request(origin+suchitraPath+'?campaign=public',{method,headers}),env,inv);assert.equal(r.status,200);assert.equal(await r.text(),expected);assert.equal(r.headers.get('vary'),'Accept');
 }
});
test('trailing alias preserves query while adjacent, SuchitraII and private requests pass through',async()=>{
 const inv={'/pinnacle-pages-html/suchitra.html':'fixture'},env={ASSETS:{fetch:async()=>new Response('centre')}};
 const r=await serveSpeech(new Request(origin+suchitraPath+'/?campaign=one'),env,inv);assert.equal(r.status,301);assert.equal(r.headers.get('location'),origin+suchitraPath+'?campaign=one');
 for(const suffix of ['/private','-other'])assert.equal(await serveSpeech(new Request(origin+suchitraPath+suffix),env,inv),null);
 for(const headers of [{authorization:'fixture'},{cookie:'session=fixture'},{cookie:'CF_Authorization=fixture'},{range:'bytes=0-1'},{'cache-control':'no-transform'}])assert.equal(await serveSpeech(new Request(origin+suchitraPath,{headers}),env,inv),null);
 assert.equal((await serveSpeech(new Request(origin+suchitraPath,{headers:{cookie:'_ga=public; __cf_bm=challenge'}}),env,inv)).status,200);
 assert.equal(await serveSpeech(new Request(origin+suchitraPath.replace('suchitra-','suchitra2-')),env,inv),null);
});
test('social metadata points to a produced JPEG with exact1200x630meta and query cache version',()=>{
 const url=new URL(html.match(/property="og:image" content="([^"]+)"/)[1]);
 assert(url.searchParams.get('v').startsWith('suchitra-v131'));assert(html.includes('property="og:image:width" content="1200"'));assert(html.includes('property="og:image:height" content="630"'));assert(fs.readFileSync('dist'+url.pathname).length>10000);
});
test('centre sitemap retains the existing Suchitra canonical exactly once with real change date',()=>{
 const xml=fs.readFileSync('public/pinnacle-pages-data/centres-sitemap.xml','utf8');const loc='<loc>'+origin+suchitraPath+'</loc>';assert.equal(xml.split(loc).length-1,1);assert(xml.includes(loc+'<lastmod>2026-09-30</lastmod>'));assert.equal((xml.match(/<loc>/g)||[]).length,61);
});
