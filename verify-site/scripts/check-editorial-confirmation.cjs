'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),j=p=>JSON.parse(read(p));
const editorial=j('content/editorial-policy.json');assert.equal(editorial.clinicalReview.status,'confirmed');assert.equal(editorial.clinicalReview.sourceCommit,'fd3a8c1c3b01ef1fb3201579a70e8ebcdbdedb65');
const htmlFiles=['index.html',...j('dist/evidence/parent-guides.json').pages.map(p=>p.route.slice(1))];
for(const file of htmlFiles){const html=read('dist/'+file);assert(!/No clinical review is claimed|completed review of the exact wording has not yet been confirmed/.test(html),file);const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];const page=graph.find(r=>['WebPage','CollectionPage'].includes(r['@type']));assert(page.reviewedBy?.['@id'].endsWith('/#clinical-committee'),file);assert(graph.some(r=>r['@id']===page.reviewedBy['@id']&&r.name==='Pinnacle Clinical Committee'));}
assert.equal(htmlFiles.length,10);
const recordFiles=['md5','bis','sae3000','srs4400','external-validation'];for(const file of recordFiles){const html=read('dist/evidence/records/'+file+'.html');assert(!html.includes('"reviewedBy"'),'Committee review should not be applied indiscriminately to source documents');}
const records=j('dist/evidence/evidence.json').records;assert(records.find(r=>r.id==='external-validation').limits.includes('protocol')||records.find(r=>r.id==='external-validation').subtitle.includes('protocol'));
const receipts=j('dist/evidence/issuer-checks.json').records;assert.equal(receipts.length,2);for(const r of receipts){assert.equal(r.status,'Active');assert(r.receipt.url.includes('icai-udin-verifications-2026-09-19.pdf'));}
for(const p of ['llms.txt','llms-full.txt']){const s=read('dist/'+p);assert(s.includes('Clinical review completed by the Pinnacle Clinical Committee'));assert(s.includes('complete as confirmed by Pinnacle'));}
console.log(JSON.stringify({pass:true,reviewedPages:10,reviewBasis:'Owner confirmation of published edition',independentReportsAndClinicalStudyStagesPreserved:true}));
