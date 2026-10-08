// Bounded public read-back. No sign-in, enquiries or analytics requests.
import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {parse} from 'parse5';
const catalogue=JSON.parse(await fs.readFile('deployment/mirracles-library-20261008/data/catalogue.json'));
const recovered=JSON.parse(await fs.readFile('src/data/sunshine-recovered.json'));
const paths=['/ask','/ask/what-is-an-iep-individualised-education-plan','/ask/pincer-grasp','/faq','/faq/hindi/occupational-therapy','/faq/english/speech-therapy/autism-speech-therapy','/sunshine','/sunshine/techniques',recovered.find(r=>r.id===3394).url,'/allmirracles','/allmirracles/category/'+encodeURIComponent(catalogue.categories[0].key),catalogue.records.find(r=>r.id===catalogue.order[0]).path];
const urls=paths.map(p=>(p.startsWith('/ask')?'https://pinnacleblooms.org':'https://www.pinnacleblooms.org')+p);
if(process.argv.includes('--list')){await fs.writeFile('deployment/knowledge-journey-urls-20261008.txt',urls.join('\n')+'\n');console.log(JSON.stringify({listed:urls.length}));process.exit(0);}
const nodes=n=>[n,...(n.childNodes||[]).flatMap(nodes)],attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const rows=await Promise.all(urls.map(async url=>{
 const response=await fetch(url,{signal:AbortSignal.timeout(45000)});assert.equal(response.status,200,url);const text=await response.text(),all=nodes(parse(text));
 const gates=all.filter(n=>attr(n,'id')==='ask-reader-gate'),journeys=all.filter(n=>attr(n,'data-knowledge-journey')!==undefined),h1=all.filter(n=>n.tagName==='h1');
 assert.equal(gates.length,1,url+' Google overlay');if(new URL(url).pathname!=='/ask')assert(journeys.length>0,url+' enquiry journey');else assert(all.some(n=>attr(n,'id')==='ask-next-step'),url+' existing home contact block');assert.equal(h1.length,1,url+' one main heading');
 assert(all.some(n=>n.tagName==='a'&&attr(n,'href')==='tel:+919100181181'),url+' central number');
 const measurement=all.filter(n=>n.tagName==='script'&&(/speech-measurement/.test(attr(n,'src')||'')||((n.childNodes||[]).some(v=>/speech-measurement/.test(v.value||'')&&/import\(measurement(?:Url)?\)/.test(v.value||'')))));assert.equal(measurement.length,1,url+' one measurement pipeline');
 const assets=[...new Set([...all.filter(n=>['script','link'].includes(n.tagName)).map(n=>attr(n,n.tagName==='script'?'src':'href')).filter(v=>v?.startsWith('/ask/_assets/')),...text.matchAll(/\/ask\/_assets\/[A-Za-z0-9_.-]+\.m?js/g)].map(v=>typeof v==='string'?v:v[0]))];
 const assetRows=await Promise.all(assets.map(async p=>{const r=await fetch(new URL(p,url),{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200,p);return {path:p,status:r.status};}));
 return {url,finalURL:response.url,status:response.status,googleGate:gates.length,journeys:journeys.length,h1:h1.length,measurement:attr(measurement[0],'src')||'single inline import of the shared fingerprinted measurement asset',assets:assetRows,referrerPolicy:response.headers.get('referrer-policy'),robots:response.headers.get('x-robots-tag'),canonical:attr(all.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href')};
}));
const ask=JSON.parse(await fs.readFile('deployment/knowledge-journey-ask-20261008.json')),portal=JSON.parse(await fs.readFile('deployment/knowledge-journey-portal-20261008.json'));
const result={at:new Date().toISOString(),source:portal.commit,askVersion:ask.candidate,portalVersion:portal.candidate,cases:rows.length,passed:rows.length,realRegistrations:0,realEnquiries:0,scope:'Public HTTP/HTML/assets; not completed Google authorisation, physical devices or field performance',rows};
await fs.writeFile('deployment/knowledge-journey-live-20261008.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({cases:rows.length,passed:rows.length,askVersion:ask.candidate,portalVersion:portal.candidate}));
