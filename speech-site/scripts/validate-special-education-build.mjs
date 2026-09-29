import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const canonical='https://www.pinnacleblooms.org/best-special-education-center-call-9100181181';
const html=await fs.readFile('dist/best-special-education-center-call-9100181181.html','utf8');
const sourceMap=JSON.parse(await fs.readFile('public/pinnacle-pages-data/special-education-evidence.json','utf8'));
const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'{}')['@graph'];
const types=new Set(graph.map(item=>item['@type']));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
const h1=(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();

assert(html.includes('<title>Special Education Support for Children in India | Pinnacle Blooms</title>'));
assert(html.includes(`<link rel="canonical" href="${canonical}">`));
assert(html.includes('index, follow, max-image-preview:large'));
assert(html.includes('og:image:width" content="1200"')&&html.includes('og:image:height" content="630"'));
assert(html.includes('special-education-evidence.json')&&html.includes('special-education-evidence.txt'));
assert(html.includes('9100 181 181')&&html.includes('tel:+919100181181'));
assert(html.includes('service=education'));
assert(html.includes('Pinnacle approach, products and evidence'));
assert(html.includes('Your confidence.')&&html.includes('Evidence, citations &amp; recognition'));
assert(html.includes('https://www.unesco.org/en/inclusion-education'));
assert(html.includes('https://www.unicef.org/education/inclusive-education'));
assert(html.includes('https://rehabcouncil.nic.in/categories-u-s-19/'));
assert.deepEqual([...types].sort(),['Brand','BreadcrumbList','FAQPage','ImageObject','Organization','Service','WebPage','WebSite'].sort());
assert.equal(graph.find(item=>item['@type']==='FAQPage').mainEntity.length,12);
assert.equal(graph.find(item=>item['@type']==='WebPage').url,canonical);
assert.equal(graph.find(item=>item['@type']==='Service').serviceType,'Child-specific educational support');
assert.equal(ids.length,new Set(ids).size,'HTML IDs must be unique');
assert.match(h1,/Special Education for children Help your child access learning/);
for(const forbidden of ['world’s first','world\'s first','world’s only','world\'s only','patented in 160','complete transformation','temporary cure','₹5,999','449 reviews','diagnostic process','swallowing assessment'])assert(!html.toLowerCase().includes(forbidden.toLowerCase()),`Forbidden legacy claim/copy remains: ${forbidden}`);
assert.equal(sourceMap.page,canonical);
assert(sourceMap.claims.length>=8&&sourceMap.claims.every(item=>item.source&&item.boundary));

const report={checkedAt:new Date().toISOString(),canonical,h1,structuredData:[...types],faqCount:12,sourceClaims:sourceMap.claims.length,uniqueIds:ids.length,pass:true};
await fs.writeFile('deployment/special-education-build-20260929.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
