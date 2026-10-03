import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {parse} from 'parse5';
const base=process.argv[2]||'http://127.0.0.1:4330',out=process.argv[3]||'deployment/ask-answer-local-v14.json';
const slugs=['what-happens-during-occupational-therapy-sessions','what-is-the-abilityscore-and-how-is-it-calculated','are-there-successful-adults-who-grew-up-with-cerebral-palsy-te','what-is-pinnacle-blooms-network'];
const nodes=(n,a=[])=>{if(n.tagName)a.push(n);for(const c of n.childNodes||[])nodes(c,a);return a};const attr=(n,k)=>n?.attrs?.find(a=>a.name===k)?.value;
const results=[];const newLinks=new Set();const taxonomyLinks=new Set();
for(const slug of slugs){
 const path='/ask/'+slug;const r=await fetch(base+path);assert.equal(r.status,200,path);
 const html=await r.text(),dom=nodes(parse(html));const title=dom.find(n=>n.tagName==='h1');assert(title);
 assert.equal(dom.filter(n=>n.tagName==='h1').length,1);
 for(const id of ['explanation','sources','ask-answer-share','pinnacle-next-step'])assert(dom.some(n=>attr(n,'id')===id),id);
 const ids=dom.map(n=>attr(n,'id')).filter(Boolean);assert.equal(new Set(ids).size,ids.length,'unique IDs');
 const card=dom.find(n=>n.tagName==='img'&&attr(n,'alt')?.includes('Pinnacle Ask answer card'));
 const og=dom.find(n=>n.tagName==='meta'&&attr(n,'property')==='og:image');
 assert.equal(attr(card,'src'),attr(og,'content'),'on-page card is the actual OG asset');
 assert.equal(attr(card,'width'),'1200');assert.equal(attr(card,'height'),'630');
 assert.equal(attr(card,'fetchpriority'),'high');assert(html.indexOf('ask-answer-hero')<html.indexOf('<h1>'));
 const links=dom.filter(n=>n.tagName==='a').map(n=>attr(n,'href')).filter(Boolean);
 for(const href of links.filter(h=>h.startsWith('#answer-section-')))assert(ids.includes(href.slice(1)));
 for(const href of links.filter(h=>h.startsWith('https://www.pinnacleblooms.org/')&&(/\/(abilityscore|seven-readiness-indexes|everyday-therapy|fusion-module|reassess-review-repeat|self-sufficient|mainstream|pinnacleai|verify\/evidence\/records\/md5.html)$/.test(h)||h.includes('?service='))))newLinks.add(href);
 const data=await (await fetch(base+path+'.json')).json();assert(html.includes(data.title.replaceAll('&','&amp;'))||html.includes(data.title));
 const md=await (await fetch(base+path+'.md')).text();assert(md.includes(data.answer_md),'complete original explanation remains in text export');
 const explanation=dom.find(n=>attr(n,'id')==='explanation');const plain=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(plain).join('');
 const bodyText=plain(explanation).replace(/\s+/g,' ').trim();assert(bodyText.length>40,'readable HTML explanation');
 const answerLinks=links.filter(h=>h.startsWith('https://pinnacleblooms.org/ask')&&h.includes('/lens/'));
 for(const link of answerLinks)taxonomyLinks.add(link);
 if(data.lenses?.length){assert(md.includes('## Connected topics and perspectives'));assert(answerLinks.length>=data.lenses.length,'public relationship links rendered');}
 const paths=Array.isArray(data.reading_paths)?data.reading_paths:[];const followups=paths.flatMap(g=>g.items);
 assert.equal(new Set(followups.map(x=>x.slug)).size,followups.length,'no duplicated question across reading paths');
 for(const x of followups){assert.notEqual(x.slug,slug);assert.equal(x.lang,data.lang);assert(links.includes('https://pinnacleblooms.org/ask/'+x.slug),'related question is a visible HTML link');assert(md.includes(x.slug),'same related question in Markdown');}
 const graph=dom.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').flatMap(n=>JSON.parse(n.childNodes.map(c=>c.value||'').join(''))['@graph']||[]);
 assert.equal(graph.filter(x=>x['@type']==='ItemList').length,paths.length,'visible reading paths match structured lists');
 if(slug.includes('occupational')){assert(paths.some(g=>g.key==='home'));assert(paths.some(g=>g.key==='progress'));assert(paths.some(g=>g.key==='care'));}
 const faq=dom.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').flatMap(n=>JSON.parse(n.childNodes.map(c=>c.value||'').join(''))['@graph']||[]).find(g=>g['@type']==='FAQPage');
 assert.equal(faq?.mainEntity.length||0,data.faq?.length||0);
 if(slug.includes('occupational'))assert(links.includes('https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india?service=occupational'));
 results.push({path,status:r.status,outlineLinks:links.filter(x=>x.startsWith('#answer-section-')).length,faqs:data.faq?.length||0,ogPreserved:attr(card,'src'),uniqueIds:true,taxonomyLinks:answerLinks.length,completeTextExport:true,htmlExplanationCharacters:bodyText.length,readingPaths:paths.length,relatedQuestions:followups.length});
}
const destinations=[];
for(const url of newLinks){const r=await fetch(url,{signal:AbortSignal.timeout(20000)});assert.equal(r.status,200,url);destinations.push({url,status:r.status,finalURL:r.url});}
for(const url of taxonomyLinks){const local=base+new URL(url).pathname;const r=await fetch(local,{signal:AbortSignal.timeout(20000)});assert.equal(r.status,200,url);destinations.push({url,status:r.status,kind:'public-taxonomy'});}
const missing=await fetch(base+'/ask/nonexistent-answer-release-check-v14',{signal:AbortSignal.timeout(20000)});assert.equal(missing.status,404);
await fs.writeFile(out,JSON.stringify({at:new Date().toISOString(),base,results,destinations},null,2));console.log(JSON.stringify({answers:results.length,destinations:destinations.length,passed:true,out}));
