import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await fs.readFile('dist/index.html','utf8');
const map=JSON.parse(await fs.readFile('dist/pinnacle-pages-data/speech-evidence.json','utf8'));
const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
const citations=graph.find(e=>e['@type']==='WebPage').citation;
assert(!JSON.stringify(map).includes('saripalli.chatgpt.site'),'Production source map must not use legacy host');
const destinations=new Set();
for(const group of Object.values(map.groups)){
  assert(html.includes(`id="${group.section}"`),'Visible section exists: '+group.section);
  for(const link of group.links){
    assert(html.includes(`href="${link.url}"`),'Source is linked in visible page: '+link.url);
    assert(citations.includes(link.url),'Source is included in WebPage citations: '+link.url);
    destinations.add(link.url);
  }
}
const cache=new Map(),results=[];
for(const destination of destinations){
  const u=new URL(destination),hash=u.hash;u.hash='';
  if(!cache.has(u.href)){const response=await fetch(u);cache.set(u.href,{status:response.status,type:response.headers.get('content-type'),text:await response.text()});}
  const response=cache.get(u.href);
  const fragmentOk=!hash||hash.startsWith('#page=')||new RegExp(`\\bid=["']${hash.slice(1)}["']`).test(response.text);
  results.push({url:destination,status:response.status,fragmentOk});
  assert(response.status===200&&fragmentOk,'Source must resolve, including section: '+destination);
}
const report={checkedAt:new Date().toISOString(),groups:Object.keys(map.groups).length,sourceLinks:results.length,allVisibleAndCited:true,results};
await fs.writeFile('deployment/evidence-validation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
