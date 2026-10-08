import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {build} from 'esbuild';
async function load(file){const b=await build({entryPoints:[file],bundle:true,format:'esm',platform:'node',write:false});return import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));}
const {topicQuestionPaths,relatedPublishedTopics,completeTopicGroups,topicGroupId}=await load('src/lib/ask/topic-navigation.ts');
const {repairPublicScope}=await load('src/lib/ask/public-scope.ts');
test('real question groups reach later pages without inventing answers or losing Telugu routes',()=>{
 const g=completeTopicGroups('https://pinnacleblooms.org/ask/autism',143);assert.equal(g.length,5);assert.equal(g.find(x=>x.key==='signs').href,'https://pinnacleblooms.org/ask/autism?page=3#questions-signs');assert.equal(g.find(x=>x.key==='therapy').href,'https://pinnacleblooms.org/ask/autism?page=5#questions-therapy');assert.equal(completeTopicGroups('https://pinnacleblooms.org/ask/autism',143,5).find(x=>x.key==='therapy').href,'#questions-therapy');
 assert.deepEqual(completeTopicGroups('https://pinnacleblooms.org/ask/autism',144),[]);assert.deepEqual(completeTopicGroups('https://evil.example/ask/autism',143),[]);assert.deepEqual(completeTopicGroups('https://pinnacleblooms.org/ask/lens/condition/autism',143),[]);
 const paths=topicQuestionPaths([{slug:'real-question-te',title:'Real question',cluster_key:'home',cluster_label:'At home',cluster_sort:6},{slug:'real-question-te',title:'Duplicate'},{slug:'https://evil.example',title:'Unsafe'}],'te');assert.equal(paths.length,1);assert.equal(paths[0].items.length,1);assert.equal(paths[0].items[0].href,'https://pinnacleblooms.org/ask/real-question-te');assert.equal(topicGroupId('home'),'questions-home');
});
test('related topics come from the existing published topic index',()=>{
 const topics=relatedPublishedTopics('https://pinnacleblooms.org/ask/speech-delay');assert(topics.length);assert(topics.length<=6);assert(topics.every(t=>t.slug!=='speech-delay'&&t.url.startsWith('https://pinnacleblooms.org/ask/')));assert.deepEqual(relatedPublishedTopics('https://evil.example/ask/speech-delay'),[]);
});
test('the complete public register preserves all 5685 collection inputs and totals',async()=>{
 const d=JSON.parse(await fs.readFile('src/data/ask-topic-groups.json','utf8'));assert.equal(Object.keys(d).length,5685);for(const [key,[count,groups]] of Object.entries(d)){assert.equal(groups.reduce((n,g)=>n+g[2],0),count,key);assert(groups.every(g=>g[2]>0&&g[3]>=1));}assert.equal(d['en/pincer-grasp'][0],1);
});
test('scope correction is limited to the observed false boilerplate, preserving identity and links',()=>{
 const original={id:72,slug:'speech-delay',canonical:'https://pinnacleblooms.org/ask/speech-delay',meta_robots:'index, follow',items:[{summary:'A clinical AbilityScore® and any diagnosis are formed only at a Pinnacle centre under clinician care. Read more.',answer_md:'Other original guidance',authority_links:[{url:'https://example.org/source',title:'Source'}]}]};
 const repaired=repairPublicScope(original);assert.equal(repaired.id,72);assert.equal(repaired.canonical,original.canonical);assert.equal(repaired.meta_robots,original.meta_robots);assert(repaired.items[0].summary.includes('appropriately qualified healthcare professional. Read more.'));assert.equal(repaired.items[0].answer_md,original.items[0].answer_md);assert.deepEqual(repaired.items[0].authority_links,original.items[0].authority_links);assert(original.items[0].summary.includes('formed only'));assert.equal(repairPublicScope(null),null);
});
