import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const folder='reviews/QUALITY-PASS-20261001';
const pass=JSON.parse(await fs.readFile(folder+'/queue.json','utf8'));
assert.equal(pass.rows.length,pass.scope.pages);
for(let i=1;i<pass.rows.length;i++)assert(pass.rows[i-1].baselineScore<=pass.rows[i].baselineScore,'Retain ascending baseline order');
await fs.writeFile(folder+'/queue.md',[
 '# Produced-page quality pass — ascending baseline score','',
 `${pass.scope.pages} pages. Current page: ${pass.current}. Baselines remain the original full work-order audit. Revised scores are editorial assessments; submissions and lab checks do not establish business or search outcomes.`,
 '','| Order | Page | Baseline /100 | Reviewed /100 | Pass state |','|---:|---|---:|---:|---|',
 ...pass.rows.map(row=>`| ${row.order} | [${row.label.replaceAll('|','/')}](${row.url}) | ${row.baselineScore} | ${row.currentScore??'—'} | ${row.state} |`),
 '','Exact finite tasks, source conditions and release dispositions are in queue.json. The original audit remains intact.',''
].join('\n'));
console.log(JSON.stringify({current:pass.current,counts:pass.rows.reduce((out,row)=>(out[row.state]=(out[row.state]||0)+1,out),{})}));
