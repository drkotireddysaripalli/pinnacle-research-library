import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
const paths=['/pinnacleai','/enroll-autism-speech-aba-therapies-india','/top-speech-therapy-center-india-proven-improvement-rate','/verify/','/faq/english/aba-therapy/abatherapysocialskills','/faq/hindi/speech-therapy/voice-tone-volume-issues-autism-speech-therapy-pinnacle-blooms'];
const walk=n=>[n,...(n.childNodes||[]).flatMap(walk)],attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const records=[];
for(const p of paths){
 const r=await fetch('https://www.pinnacleblooms.org'+p,{signal:AbortSignal.timeout(30000)}),html=await r.text();assert.equal(r.status,200,p);
 const nodes=walk(parse(html)),scripts=nodes.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json');let invalid=0;const types=[];
 for(const s of scripts){try{const j=JSON.parse(s.childNodes.map(n=>n.value||'').join(''));types.push(j['@type']||'graph');}catch{invalid++;}}
 const askLinks=nodes.filter(n=>n.tagName==='a'&&/^https:\/\/pinnacleblooms.org\/ask\/?$/.test(attr(n,'href')||'')).map(n=>attr(n,'href'));
 const canonical=nodes.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),og=nodes.find(n=>n.tagName==='meta'&&attr(n,'property')==='og:url');
 if(p.startsWith('/faq/')){assert.equal(invalid,0,p+' JSON-LD');assert(html.includes('Bharath Healthcare Laboratories Private Limited'));assert.equal(attr(og,'content'),attr(canonical,'href'));}
 else{assert(!askLinks.some(x=>x.endsWith('/ask/')),p+' shared Ask alias');}
 records.push({url:r.url,status:r.status,bytes:Buffer.byteLength(html),invalidJsonLd:invalid,types,canonical:attr(canonical,'href'),og:attr(og,'content'),askLinks,navigationRepair:r.headers.get('x-pinnacle-navigation')});
}
for(const p of ['/ask/dayc-2','/ask/lens/ability/child-characteristics']){const r=await fetch('https://pinnacleblooms.org'+p,{signal:AbortSignal.timeout(30000)}),html=await r.text(),nodes=walk(parse(html));assert.equal(r.status,200);const robots=nodes.filter(n=>n.tagName==='meta'&&attr(n,'name')==='robots').map(n=>attr(n,'content'));assert(robots.every(x=>!x.includes('noindex')));records.push({url:r.url,status:r.status,robots});}
await fs.writeFile(process.argv[2]||'deployment/search-template-live-20261005.json',JSON.stringify({at:new Date().toISOString(),passed:true,records},null,2)+'\n');console.log(JSON.stringify({passed:true,records}));
