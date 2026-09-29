import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const canonical='https://www.pinnacleblooms.org/centers';
const html=await fs.readFile('dist/centers.html','utf8');
const directory=JSON.parse(await fs.readFile('src/data/centre-directory.json','utf8'));
const publicDirectory=JSON.parse(await fs.readFile('dist/pinnacle-pages-data/centre-directory.json','utf8'));
const evidence=JSON.parse(await fs.readFile('dist/pinnacle-pages-data/centers-evidence.json','utf8'));
const markdown=await fs.readFile('dist/pinnacle-pages-data/centers-machine.md','utf8');
const sitemap=await fs.readFile('dist/pinnacle-pages-data/centres-sitemap.xml','utf8');
const jsonLd=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
const graph=jsonLd.find(item=>item['@graph'])?.['@graph']||[];
const itemList=jsonLd.find(item=>item['@type']==='ItemList');
const types=new Set(graph.map(item=>item['@type']));
const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
const cards=(html.match(/data-centre-name=/g)||[]).length;
const h1=(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();

assert(html.includes('<title>Find a Pinnacle Blooms Centre | Locations, Maps &amp; Contact</title>'));
assert(html.includes(`<link rel="canonical" href="${canonical}">`));
assert(html.includes('index, follow, max-image-preview:large'));
assert(html.includes('og:image:width" content="1200"')&&html.includes('og:image:height" content="630"'));
assert(html.includes('centers-evidence.json')&&html.includes('centers-evidence.txt'));
assert(html.includes('9100 181 181')&&html.includes('tel:+919100181181'));
assert.match(h1,/Find a Pinnacle centre near you.*Begin closer to home/);
assert.deepEqual([...types].sort(),['Brand','BreadcrumbList','CollectionPage','FAQPage','ImageObject','Organization','WebSite'].sort());
for(const forbiddenType of ['Service','LocalBusiness','MedicalBusiness','MedicalClinic','AggregateRating'])assert(!types.has(forbiddenType),`Directory must not claim ${forbiddenType}`);
assert.equal(graph.find(item=>item['@type']==='FAQPage').mainEntity.length,12);
assert.equal(graph.find(item=>item['@type']==='CollectionPage').url,canonical);
assert.equal(itemList.numberOfItems,62);
assert.equal(itemList.itemListElement.length,62);
assert.equal(cards,62);
assert.equal(ids.length,new Set(ids).size,'HTML IDs must be unique');
assert.equal(directory.length,62);
assert.equal(publicDirectory.centres.length,62);
assert(!JSON.stringify(publicDirectory).includes('facilityId'));
for(const facilityId of directory.map(item=>item.facilityId).filter(Boolean)){
  assert(!html.includes(facilityId),`Private facility ID leaked into HTML: ${facilityId}`);
  assert(!markdown.includes(facilityId),`Private facility ID leaked into Markdown: ${facilityId}`);
}
assert.equal(evidence.statistics.locations,62);
assert.equal(evidence.statistics.mapLinks,62);
assert.equal(evidence.statistics.profilePages,60);
assert.equal(evidence.statistics.photoBackedListings,52);
assert(html.includes('Details checked 28 September 2026'));
assert(html.includes('Selecting a centre records your preference; it does not confirm an appointment.'));
assert.equal((sitemap.match(/<loc>https:\/\/www\.pinnacleblooms\.org\/centers<\/loc>/g)||[]).length,1);
assert(!sitemap.includes('/centres')&&!sitemap.includes('/locations')&&!sitemap.includes('/Centers')&&!sitemap.includes('/Karimnagar'));
for(const forbidden of ['world’s first','world\'s first','world’s only','world\'s only','world’s #1','world\'s #1','100+ centres','patented','guaranteed independence'])assert(!html.toLowerCase().includes(forbidden.toLowerCase()),`Forbidden legacy claim remains: ${forbidden}`);

const report={checkedAt:new Date().toISOString(),canonical,h1,structuredData:[...types],faqCount:12,itemListCount:itemList.numberOfItems,cards,publicDirectoryItems:publicDirectory.centres.length,uniqueIds:ids.length,pass:true};
await fs.writeFile('deployment/centers-build-20260929.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
