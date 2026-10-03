import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {parse} from 'parse5';
const base=process.argv[2]||'http://127.0.0.1:4330';const tag=base.includes('127.0.0.1')?'local':'production';
const routes=['/ask','/ask/conditions','/ask/behaviours','/ask/skills','/ask/abilities','/ask/domains','/ask/ages','/ask/life-skills','/ask/assessments','/ask/readiness','/ask/therapies','/ask/techniques','/ask/people','/ask/standards-icf','/ask/standards-icd','/ask/lens','/ask/lens/condition','/ask/lens/condition/autism','/ask/autism','/ask/abilityscore','/ask/how-to','/ask/materials','/ask/myths','/ask/compare','/ask/parents/wellbeing','/ask/access/financial','/ask/access/legal','/ask/te','/ask/te/conditions','/ask/dataset','/ask/what-is-pinnacle-blooms-network','/ask/what-is-pinnacle-blooms-network-and-how-does-it-help-my-child','/ask/what-happens-during-occupational-therapy-sessions','/ask/search?q=occupational%20therapy','/ask/lens/condition/zz-no-such-value-93','/ask/zz-no-such-answer-93','/ask/what-happens-during-occupational-therapy-sessions.md','/ask/what-happens-during-occupational-therapy-sessions.json','/ask/llms.txt','/ask/llms-full.txt','/ask/robots.txt','/ask/sitemap.xml','/ask/sitemap-navigation.xml'];
function nodes(n,out=[]){if(n.tagName)out.push(n);for(const c of n.childNodes||[])nodes(c,out);return out}const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const results=[];const failures=[];
for(let i=0;i<routes.length;i+=4){await Promise.all(routes.slice(i,i+4).map(async route=>{let r;try{
 const start=Date.now();r=await fetch(base+route,{signal:AbortSignal.timeout(20000)});const body=await r.text();const result={route,status:r.status,ms:Date.now()-start,bytes:Buffer.byteLength(body),robots:r.headers.get('x-robots-tag'),canonical:null};
 assert.equal(r.status,route.includes('zz-no-such')?404:200,route+' status');if(r.headers.get('content-type')?.includes('text/html')){
 const dom=nodes(parse(body));result.canonical=attr(dom.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href');assert.equal(dom.filter(n=>n.tagName==='h1').length,1,route+' one h1');
 assert(body.includes('data-shared-shell="v159"'),route+' shared shell');assert(body.includes('portal-site-footer'),route+' full footer');assert(body.includes('tel:+919100181181'),route+' phone');
 for(const j of dom.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json'))JSON.parse(j.childNodes.map(c=>c.value||'').join(''));
 assert(result.canonical?.startsWith('https://pinnacleblooms.org/ask'),route+' canonical');if(route.includes('/search'))assert(r.headers.get('cache-control')?.includes('no-store'));
 }
 results.push(result);
 }catch(e){failures.push({route,message:e.message,status:r?.status});}}));}
await fs.mkdir('reviews',{recursive:true});await fs.writeFile('reviews/ask-'+tag+'-contracts-20261003.json',JSON.stringify({at:new Date().toISOString(),base,results,failures},null,2));
console.log(JSON.stringify({base,checked:routes.length,passed:results.length,failures},null,2));if(failures.length)process.exitCode=1;
