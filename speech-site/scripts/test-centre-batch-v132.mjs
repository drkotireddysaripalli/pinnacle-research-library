import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {centreDetails} from '../src/data/centre-detail-content.ts';
import {serveSpeech,CENTRE_DETAIL_ROUTES} from '../deployment/speech-handler.mjs';
const origin='https://www.pinnacleblooms.org';
for(const p of centreDetails){
 const html=fs.readFileSync('dist'+p.path+'.html','utf8');
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1])['@graph'];
 test(p.id+': accurate canonical/entity and no inferred rating, hours, availability or credential',()=>{
  assert.equal((html.match(/<h1\b/g)||[]).length,1);assert(html.includes('rel="canonical" href="'+origin+p.path+'"'));assert(html.includes('index, follow, max-image-preview:large'));
  const local=graph.find(x=>x['@type']==='LocalBusiness');assert.equal(local.address.postalCode,p.postcode);assert.equal(local.address.streetAddress,p.street);assert.equal(local.telephone,'+919100181181');assert.equal(local.hasMap,p.branch.mapsUrl);assert.equal(local.parentOrganization['@id'],origin+'/verify/#organization');
  for(const key of ['aggregateRating','review','sameAs','openingHours','openingHoursSpecification','hasCredential','availableService'])assert(!(key in local));assert(!graph.some(x=>x['@type']==='Offer'));
 });
 test(p.id+': visible/schema/source FAQs and dated facility status agree',()=>{
  const faq=graph.find(x=>x['@type']==='FAQPage');assert.deepEqual(faq.mainEntity.map(x=>({question:x.name,answer:x.acceptedAnswer.text})),p.faqs);assert.equal(faq.mainEntity.length,8);
  const record=JSON.parse(fs.readFileSync('public/pinnacle-pages-data/'+p.id+'-evidence.json','utf8'));assert.deepEqual(record.questions,p.faqs);assert.equal(record.stages.length,7);assert.equal(record.facilityRecord.identifier,p.hfr);assert.equal(record.facilityRecord.recordedPortalStatus,'Approved');assert.equal(record.facilityRecord.currentServiceAvailabilityVerified,false);assert(html.includes(p.hfr));assert(html.includes('19 September 2026'));assert(html.includes('id="everyday-example"'));for(const s of p.sources)assert(html.includes(s.url.replaceAll('&','&amp;')));
 });
 test(p.id+': selected enquiry, reviewed photos and fresh1200x630share package',()=>{
  const enquiry=new URL(p.enquiry);assert.equal(enquiry.searchParams.get('centre'),p.id);assert.equal(enquiry.searchParams.get('service'),'help');assert(html.includes(p.enquiry.replaceAll('&','&amp;')));
  const image=new URL(html.match(/property="og:image" content="([^"]+)"/)[1]);assert(image.searchParams.get('v').includes('v132-'+p.id));assert(fs.readFileSync('dist'+image.pathname).length>10000);assert(html.includes('property="og:image:width" content="1200"'));assert(html.includes('property="og:image:height" content="630"'));
  for(const photo of p.photos)assert(!['ananthapuram-interior-47-2.jpg','dilsukhnagar-interior-42-0.jpg','gurunanak-interior-1-0.jpg'].includes(photo.file));assert.equal(CENTRE_DETAIL_ROUTES[p.path],p.id);
  const xml=fs.readFileSync('public/pinnacle-pages-data/centres-sitemap.xml','utf8'),loc='<loc>'+origin+p.path+'</loc>';assert.equal(xml.split(loc).length-1,1);assert(xml.includes(loc+'<lastmod>2026-10-01</lastmod>'));assert.equal((xml.match(/<loc>/g)||[]).length,61);
 });
 test(p.id+': exact HTML/Markdown/HEAD/alias and public analytics cookies',async()=>{
  const inv={['/pinnacle-pages-html/'+p.id+'.html']:'fixture',['/pinnacle-pages-data/'+p.id+'-machine.md']:'reading'},env={ASSETS:{fetch:async req=>new Response(req.url.endsWith('.md')?'# branch':'branch')}};
  for(const [method,headers,expected]of [['GET',{},'branch'],['GET',{accept:'text/markdown'},'# branch'],['HEAD',{},''],['GET',{cookie:'ps_ga=public; ps_ga_ABC=public; __cf_bm=challenge'},'branch']]){const r=await serveSpeech(new Request(origin+p.path,{method,headers}),env,inv);assert.equal(r.status,200);assert.equal(await r.text(),expected);assert.equal(r.headers.get('vary'),'Accept');}
  const alias=await serveSpeech(new Request(origin+p.path+'/?campaign=one'),env,inv);assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),origin+p.path+'?campaign=one');
  for(const suffix of ['/private','-other'])assert.equal(await serveSpeech(new Request(origin+p.path+suffix),env,inv),null);
  for(const headers of [{authorization:'fixture'},{cookie:'session=fixture'},{cookie:'unknown=fixture'},{cookie:'CF_Authorization=fixture'},{range:'bytes=0-1'},{accept:'text/markdown',range:'bytes=0-1'},{'cache-control':'no-transform'}])assert.equal(await serveSpeech(new Request(origin+p.path,{headers}),env,inv),null);
  assert.equal(await serveSpeech(new Request(origin+p.path,{method:'POST'}),env,inv),null);
 });
}
test('Suchitra reload with the actual owned ps_ga cookie stays managed',async()=>{const route=Object.keys(CENTRE_DETAIL_ROUTES).find(p=>CENTRE_DETAIL_ROUTES[p]==='suchitra');const r=await serveSpeech(new Request(origin+route,{headers:{cookie:'ps_ga=value; ps_ga_ABC=value'}}),{ASSETS:{fetch:async()=>new Response('same public page')}},{'/pinnacle-pages-html/suchitra.html':'fixture'});assert.equal(r.status,200);assert.equal(await r.text(),'same public page');});
