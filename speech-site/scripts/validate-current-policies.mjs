import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import policies from '../src/data/policy-presentation.ts';
import old from '../src/data/policy-content.json' with {type:'json'};
assert.equal(policies.length,15);
assert.equal(new Set(policies.map(page=>page.path)).size,15);
const rows=[];
for(const page of policies){
 const html=await fs.readFile('dist'+page.path+'.html','utf8');
 const record=JSON.parse(await fs.readFile('dist/pinnacle-pages-data/'+page.slug+'-policy-source.json'));
 const reading=await fs.readFile('dist/pinnacle-pages-data/'+page.slug+'-policy.md','utf8');
 assert(html.includes('rel="canonical" href="https://www.pinnacleblooms.org'+page.path+'"'));
 assert(html.includes('index, follow, max-image-preview:large'));
 assert.equal(record.text,page.text);assert.equal(record.version,'2026-10-01.1');
 assert.equal(record.privacyGrievanceOfficer,'Mr. Gokul Krishna Rao');
 assert(reading.includes(page.markdown));assert(reading.includes('Effective: 1 October 2026'));
 const original=old.find(p=>p.slug===page.slug);if(original){assert.equal(record.historicalSource.text,original.text);assert.equal(record.historicalSource.textSha256,original.policyTextSha256);assert.equal(record.historicalSource.status,'Historical prior public wording; not the current edition');}
 assert(!/Muscle-UP|pinnaclblooms\.org|care@pinnacleclinics|\[18\]|world.?s (?:first|most|only)/i.test(page.html));
 for(const heading of page.toc)assert(html.includes('id="'+heading.id+'"'));
 const json=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
 const graph=json.flatMap(value=>value['@graph']||[value]);assert(!graph.some(value=>['Service','Offer','AggregateRating'].includes(value['@type'])));
 rows.push({id:page.slug,sections:page.toc.length,version:record.version,historicalSourceRetained:!!original,currentSha256:crypto.createHash('sha256').update(page.text).digest('hex')});
}
const privacy=policies.find(page=>page.slug==='privacy-policy');assert(privacy.text.includes('May 2027'));assert(privacy.text.includes('within one month'));assert(privacy.text.includes('Mr. Gokul Krishna Rao'));
const hub=await fs.readFile('dist/policies.html','utf8');for(const page of policies)assert(hub.includes('href="'+page.path+'"'));
const sitemap=await fs.readFile('dist/pinnacle-pages-data/public-documents-sitemap.xml','utf8');assert(sitemap.includes('<loc>https://www.pinnacleblooms.org/policies</loc>'));assert(sitemap.includes('<loc>https://www.pinnacleblooms.org/payment-and-billing</loc>'));
await fs.writeFile('deployment/policy-contract-v153-20261001.json',JSON.stringify({at:new Date().toISOString(),policies:rows,hub:true,priorWordingsHistorical:true,passed:true},null,2)+'\n');console.log(JSON.stringify({policies:rows.length,hub:true,passed:true}));
