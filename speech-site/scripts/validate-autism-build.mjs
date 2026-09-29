import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const canonical='https://www.pinnacleblooms.org/autism-therapy';
const html=await fs.readFile('dist/autism-therapy.html','utf8');
const sourceMap=JSON.parse(await fs.readFile('public/pinnacle-pages-data/autism-therapy-evidence.json','utf8'));
const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'{}')['@graph'];
const types=new Set(graph.map(item=>item['@type']));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
const h1=(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();

assert(html.includes('<title>Autism Therapy &amp; Developmental Support for Children | Pinnacle Blooms</title>'));
assert(html.includes(`<link rel="canonical" href="${canonical}">`));
assert(html.includes('index, follow, max-image-preview:large'));
assert(html.includes('og:image:width" content="1200"')&&html.includes('og:image:height" content="630"'));
assert(html.includes('autism-therapy-evidence.json')&&html.includes('autism-therapy-evidence.txt'));
assert(html.includes('9100 181 181')&&html.includes('tel:+919100181181'));
assert(html.includes('service=autism'));
assert(html.includes('Autism therapy is not one fixed programme'));
assert(html.includes('Every autistic child does not need every therapy'));
assert(html.includes('Pinnacle approach, products and evidence'));
assert(html.includes('https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders'));
assert(html.includes('https://www.nice.org.uk/guidance/cg170/chapter/Recommendations'));
assert.deepEqual([...types].sort(),['Brand','BreadcrumbList','FAQPage','ImageObject','Organization','Service','WebPage','WebSite'].sort());
assert.equal(graph.find(item=>item['@type']==='FAQPage').mainEntity.length,15);
assert.equal(graph.find(item=>item['@type']==='WebPage').url,canonical);
assert.equal(graph.find(item=>item['@type']==='Service').serviceType,'Child-specific coordinated developmental support');
assert.equal(ids.length,new Set(ids).size,'HTML IDs must be unique');
assert.match(h1,/Autism Therapy for children See your whole child/);
for(const forbidden of ['world’s first','world\'s first','world’s only','world\'s only','world’s #1','world\'s #1','patented in 160','complete transformation','temporary cure','poor eye contact','suffering from autism','guaranteed independence'])assert(!html.toLowerCase().includes(forbidden.toLowerCase()),`Forbidden legacy claim/copy remains: ${forbidden}`);
assert.equal(sourceMap.page,canonical);
assert(sourceMap.claims.length>=9&&sourceMap.claims.every(item=>item.source&&item.boundary));

const report={checkedAt:new Date().toISOString(),canonical,h1,structuredData:[...types],faqCount:15,sourceClaims:sourceMap.claims.length,uniqueIds:ids.length,pass:true};
await fs.writeFile('deployment/autism-therapy-build-20260929.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
