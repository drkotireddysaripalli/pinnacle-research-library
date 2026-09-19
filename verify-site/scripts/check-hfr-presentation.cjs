'use strict';
// Approval marks must never imply that matching an identifier confirms approval.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=JSON.parse(read('content/hfr-register.json'));
const observations=JSON.parse(read('content/hfr-dashboard-checks.json'));
const page=read('dist/evidence/hfr-register.html'),home=read('dist/index.html');
const rows=[...page.matchAll(/<tr id="hfr-([^"]+)"[\s\S]*?<\/tr>/g)];
const cards=[...home.matchAll(/<article class="centre-card"[^>]*data-kind="hfr"[\s\S]*?<\/article>/g)].map(m=>m[0]);
assert.equal(rows.length,56);assert.equal(cards.length,56);
assert.equal(data.rows.filter(r=>r.workbookRow).length,52);
assert.equal(data.rows.filter(r=>r.certificate).length,28);
const counts={};
for(const r of data.rows){
 const observed=observations.records.find(x=>x.id===r.id);
 assert.equal(r.liveLookup.status,observed.status);
 counts[observed.status]=(counts[observed.status]||0)+1;
 const row=rows.find(m=>m[1]===r.id)?.[0],card=cards.find(c=>c.includes(r.id));
 assert(row&&card,r.id+' missing');
 for(const html of [row,card]){
  assert.equal(html.includes('class="badge matched hfr-approval"'),observed.status==='Approved',r.id+' approval mark');
  assert.equal(html.includes('class="hfr-recorded"'),observed.status!=='Approved',r.id+' neutral label');
  assert(html.includes('class="hfr-source-details"'));
  const details=html.match(/<details class="hfr-source-details"[\s\S]*?<\/details>/)[0];
  assert(details.includes(observed.status),r.id+' exact status omitted');
  assert.equal((html.match(/class="fact-share"/g)||[]).length,1,r.id+' duplicate sharing controls');
 }
 assert(row.includes('data-hfr-evidence="'+(observed.status==='Approved'?'approved':'recorded')+'"'));
}
assert.deepEqual(counts,{'Approved':33,'Rejected':4,'Submitted':4,'Query Raised':14,'Query Resolved':1});
assert.deepEqual(JSON.parse(read('dist/evidence/hfr-register.json')),data);
assert.equal(read('dist/evidence/hfr-register.csv').trim().split('\n').length,57);
assert(page.includes('IN361*****55'));assert(page.includes('33 Approved'));
assert(page.includes('this review covers one account'));
assert(read('dist/llms-full.txt').includes('Other Pinnacle accounts have not been reconciled'));
const record=JSON.parse(read('dist/evidence/evidence.json')).records.find(r=>r.id==='hfr');
assert.equal(record.reviewLabel,'HFR account records reviewed');
console.log(JSON.stringify({pass:true,ids:56,approvalMarksPerView:33,neutralLabelsPerView:23,exactWorkflowCounts:counts,sourceDisclosures:true,oneShareBarPerRecord:true}));
