import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
import {centreDetails} from '../src/data/centre-detail-content.ts';
const stage='release-centre-voice-v149-20261001',prior='release-policy-v148b-20261001';
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes||[]).map(text).join('');
const walk=node=>[node,...(node.childNodes||[]).flatMap(walk)];
const attr=(node,name)=>node.attrs?.find(a=>a.name===name)?.value;
const normal=t=>t.replace(/\s+/g,' ').trim(),rows=[];
for(const page of centreDetails){
 const record=JSON.parse(fs.readFileSync(`${stage}/pinnacle-pages-data/${page.id}-evidence.json`));
 const original=JSON.parse(fs.readFileSync(`${prior}/pinnacle-pages-data/${page.id}-evidence.json`));
 const preserved=structuredClone(record);preserved.directAnswer=original.directAnswer;
 for(let i=0;i<4;i++)preserved.questions[i].answer=original.questions[i].answer;
 preserved.sources.find(s=>s.id==='maps').scope=original.sources.find(s=>s.id==='maps').scope;
 assert.deepEqual(preserved,original,page.id+' only approved voice fields changed');
 const html=fs.readFileSync(`${stage}/pinnacle-pages-html/${page.id}.html`,'utf8'),nodes=walk(parse(html));
 const faq=nodes.find(n=>attr(n,'id')==='questions');assert(faq);
 const visible=walk(faq).filter(n=>n.nodeName==='details').map(n=>({question:normal(text(walk(n).find(x=>x.nodeName==='summary'))).replace(/\s*\+$/,''),answer:normal(text(walk(n).find(x=>x.nodeName==='p')))}));
 const graph=nodes.filter(n=>n.nodeName==='script'&&attr(n,'type')==='application/ld+json').flatMap(n=>{const data=JSON.parse(text(n));return data['@graph']||[data];});
 const schema=graph.find(n=>n['@type']==='FAQPage').mainEntity.map(n=>({question:normal(n.name),answer:normal(n.acceptedAnswer.text)}));
 assert.deepEqual(visible,schema);assert.deepEqual(visible,record.questions.map(f=>({question:normal(f.question),answer:normal(f.answer)})));
 assert(normal(text(nodes.find(n=>n.nodeName==='main'))).includes(normal(page.direct)));
 for(const suffix of ['evidence.txt','machine.md']){const reading=fs.readFileSync(`${stage}/pinnacle-pages-data/${page.id}-${suffix}`,'utf8');assert(reading.includes(page.direct));assert(reading.includes(page.arrival));for(const q of page.faqs)assert(reading.includes(q.answer));}
 assert(!record.directAnswer.includes('is published at'));
 if(page.id==='delhi'){assert.equal(record.facilityRecord.sourceWorkbookFlag,'INACTIVE');assert.equal(record.facilityRecord.currentOperationVerified,false);assert(record.directAnswer.includes('Confirm current operation'));assert(record.questions[3].answer.includes('confirm current operation'));}
 rows.push({id:page.id,canonical:record.canonical,faqCount:visible.length,sourceFieldsPreserved:true,matchingReading:true,guardedInactive:page.id==='delhi'});
}
const output='deployment/centre-voice-v149-contract-20261001.json';fs.writeFileSync(output,JSON.stringify({at:new Date().toISOString(),stage,prior,rows,passed:true},null,2)+'\n');console.log(JSON.stringify({output,pages:rows.length,passed:true}));
