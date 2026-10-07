// Bounded public acceptance read-back. No lead submission, indexing or account mutation.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const out=path.resolve(import.meta.dirname,'../../../website-completion-20261007');
const origin='https://www.pinnacleblooms.org';
const guru='/guru/6385/Navaratri-Day-6-%E2%80%93-Sri-Lalita-Tripura-Sundari-Devi-Amma';
const mobile='Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36';
const cases=[['guru-desktop',origin+guru],['guru-mobile',origin+guru,mobile],['guru-canonical-mobile',origin+guru.toLowerCase(),mobile],['staff-desktop',origin+'/staff'],['staff-mobile',origin+'/staff',mobile],['materials-mobile',origin+'/ma/therapy-materials-medicine-ball',mobile]];
const results=await Promise.all(cases.map(async([id,url,ua])=>{
 const r=await fetch(url,{headers:{'User-Agent':ua||'PinnacleWebsiteQualityAudit/1.0'},signal:AbortSignal.timeout(45000)}),html=await r.text();
 const blocks=[...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)],invalid=[];
 for(const [i,b]of blocks.entries())try{JSON.parse(b[1]);}catch(e){invalid.push({block:i,error:e.message});}
 const row={id,url,finalUrl:r.url,status:r.status,bytes:Buffer.byteLength(html),sha256:createHash('sha256').update(html).digest('hex'),canonical:html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1],title:html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1],jsonLdBlocks:blocks.length,invalid,h1Count:[...html.matchAll(/<h1\b/gi)].length,readingPerformance:r.headers.get('x-pinnacle-reading-performance'),badMaterialImage:[...html.matchAll(/<img\b[^>]*>/gi)].some(m=>/\/Assets\/Materials\/318\.jpg/i.test(m[0])),hasMedicineBallContent:/medicine ball/i.test(html),expired2022Jobs:blocks.some(b=>/JobPosting/.test(b[1])&&/2022-12-31/.test(b[1]))};
 row.passed=r.status===200&&invalid.length===0&&(!id.startsWith('staff')||(row.title==='Pinnacle Blooms Network Team and Staff'&&row.h1Count===1))&&(!id.startsWith('materials')||(!row.badMaterialImage&&row.hasMedicineBallContent))&&(!id.startsWith('guru')||!row.expired2022Jobs);
 return row;
}));
const receipt={at:new Date().toISOString(),source:'911f5b53df98b955bb9c5acd38c83f4af2c3d959',legacyWorkerVersion:'06108763-eda8-4e2c-a44f-3b46956c3bc3',cases:results,passed:results.every(r=>r.passed)};
await fs.writeFile(path.join(out,'final-public-readback.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt));
const ci=await fetch('https://api.github.com/repos/drkotireddysaripalli/pinnacle-research-library/actions/runs?head_sha='+receipt.source,{headers:{'User-Agent':'PinnacleWebsiteQualityAudit/1.0'},signal:AbortSignal.timeout(30000)});
if(ci.ok){const data=await ci.json();const records={at:new Date().toISOString(),source:receipt.source,runs:data.workflow_runs.map(r=>({id:r.id,name:r.name,event:r.event,status:r.status,conclusion:r.conclusion,url:r.html_url}))};await fs.writeFile(path.join(out,'ci-final.json'),JSON.stringify(records,null,2));console.log(JSON.stringify({ci:records}));}else console.log(JSON.stringify({ciStatus:ci.status}));
if(!receipt.passed)process.exitCode=1;
