// One bounded, read-only public check after this specific family release.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const [source,output]=process.argv.slice(2);
if(!source||!output)throw Error('Saved Ahrefs cohort and receipt path required');
const cohort=JSON.parse(await fs.readFile(source,'utf8'));
if(cohort.length!==501)throw Error('Reconcile changed saved error cohort');
const catalogue=JSON.parse(await fs.readFile(new URL('../deployment/mirracles-library-20261008/data/catalogue.json',import.meta.url),'utf8'));
const ids=Object.keys(catalogue.legacyIds||{}).sort((a,b)=>Number(a)-Number(b));
const selected=new Set(['1','1000','10000','10001','2652','15843','20980','20067','18253',...Array.from({length:11},(_,i)=>ids[Math.floor((ids.length-1)*i/10)])]);
const desktop='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36';
const mobile='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/140.0.0.0 Mobile Safari/537.36';
const jobs=[...cohort.map(r=>({url:r.url,family:r.url.includes('/guru/')?'guru':'other',ua:desktop})),
 ...cohort.filter(r=>!r.url.includes('/guru/')).map(r=>({url:r.url,family:'other-mobile',ua:mobile})),
 ...[...selected].filter(id=>catalogue.legacyIds[id]).flatMap(id=>[desktop,mobile].map(ua=>({url:'https://www.pinnacleblooms.org/mirracles/'+id+'?utm_source=validation_test&utm_medium=release',family:'mirracles',ua,expectedId:catalogue.legacyIds[id]}))),
 ...['/ask','/faq','/sunshine','/verify/','/centers','/enroll-autism-speech-aba-therapies-india','/books','/allmirracles'].map(p=>({url:'https://www.pinnacleblooms.org'+p,family:'protected-public',ua:desktop}))];
const byId=new Map(catalogue.records.map(r=>[r.id,r]));
const rows=[];let next=0;
async function check(job){
 const started=Date.now(),row={url:job.url,family:job.family,device:job.ua===mobile?'Android user agent':'desktop user agent',at:new Date().toISOString()};
 try{
  let r=await fetch(job.url,{headers:{'user-agent':job.ua},redirect:'manual',signal:AbortSignal.timeout(30000)});
  row.firstStatus=r.status;row.location=r.headers.get('location');
  if(row.location){await r.body?.cancel();r=await fetch(new URL(row.location,job.url),{headers:{'user-agent':job.ua},signal:AbortSignal.timeout(30000)});}
  row.status=r.status;row.finalUrl=r.url;row.ray=r.headers.get('cf-ray');
  row.marker=r.headers.get(job.family==='guru'?'x-pinnacle-guru-recovery':'x-pinnacle-mirracles-library');
  row.recovery=r.headers.get('x-pinnacle-public-render-recovery');
  const html=await r.text();row.bytes=Buffer.byteLength(html);row.sha256=createHash('sha256').update(html).digest('hex');
  row.canonical=html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1]||null;
  row.hasH1=/<h1(?:\s|>)/i.test(html);row.errorPage=/<title>\s*(?:Error|Server Error|[^<]*temporarily unavailable)/i.test(html);
  row.pass=row.status===200&&row.hasH1&&!row.errorPage;
  if(job.family==='guru')row.pass&&=row.marker==='guru-public-recovery-20261009';
  if(job.family==='mirracles'){
   const expected='https://www.pinnacleblooms.org'+byId.get(job.expectedId).path;
   row.expectedCanonical=expected;row.pass&&=row.firstStatus===308&&row.canonical===expected&&row.marker==='public-reader-20261008'&&new URL(row.finalUrl).search===new URL(job.url).search;
  }
 }catch(e){row.pass=false;row.error=e.message;}
 row.ms=Date.now()-started;rows.push(row);
 if(rows.length%100===0)console.log(JSON.stringify({completed:rows.length,total:jobs.length,failures:rows.filter(r=>!r.pass).length}));
}
await Promise.all(Array.from({length:6},async()=>{while(next<jobs.length)await check(jobs[next++]);}));
const receipt={at:new Date().toISOString(),method:'GET; concurrency6; no browser scripts, customer actions or analytics events',coverage:'All501 saved non-Mirracles errors;10 mobile variants;source-key Mirracles strata and protected public hubs. User-agent requests are not physical-device tests.',total:rows.length,passed:rows.filter(r=>r.pass).length,failed:rows.filter(r=>!r.pass).length,rows};
await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({total:receipt.total,passed:receipt.passed,failed:receipt.failed,failures:rows.filter(r=>!r.pass)}));
if(receipt.failed)process.exitCode=1;
