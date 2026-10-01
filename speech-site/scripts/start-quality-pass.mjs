import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const source='reviews/PAGE-WORK-ORDER-AUDIT-20261001/scores.json';
const audit=JSON.parse(await fs.readFile(source,'utf8'));
const folder='reviews/QUALITY-PASS-20261001';
await fs.mkdir(folder,{recursive:true});
assert.equal(await fs.access(folder+'/queue.json').then(()=>true).catch(()=>false),false,'Do not reset an existing pass ledger');
const blocked=new Set(audit.rows.slice(0,12).map(row=>row.id));
const rows=audit.rows.map(row=>({order:row.row,id:row.id,group:row.group,label:row.label,url:row.url,baselineScore:row.total,
 state:blocked.has(row.id)?'source-decision':row.id==='delhi'?'in-progress':'review-pending',
 baselineGap:row.gap,task:row.bestFix,sourceCondition:row.sourceGap||null,
 currentScore:null,pageOwnedDisposition:null,release:null,reviewedOn:null}));
assert.equal(rows.length,133);
for(let i=1;i<rows.length;i++)assert(rows[i-1].baselineScore<=rows[i].baselineScore);
const data={startedOn:new Date().toISOString(),governingWorkOrder:'PINNACLE-PAGE-CREATION-WORK-ORDER.md',baseline:source,
 scope:audit.scope,current:'delhi',scoreMeaning:audit.method,
 ordering:'Ascending baseline score; source decisions retained while the next executable page proceeds',rows};
await fs.writeFile(folder+'/queue.json',JSON.stringify(data,null,2)+'\n');
await fs.writeFile(folder+'/queue.md',[
 '# Produced-page quality pass — ascending baseline score','',
 '133 pages. Baselines are the existing full work-order audit, not new scores. A pending row is a review task, not an assertion that every old finding still requires a code change.',
 '','| Order | Page | Baseline /100 | Pass state |','|---:|---|---:|---|',
 ...rows.map(row=>`| ${row.order} | [${row.label.replaceAll('|','/')}](${row.url}) | ${row.baselineScore} | ${row.state} |`),
 '','Per-page finite task, baseline gap, source condition and release disposition are in queue.json. The original audit remains intact.',''
 ].join('\n'));
console.log(JSON.stringify({pages:rows.length,current:'delhi',sourceDecisions:blocked.size}));
