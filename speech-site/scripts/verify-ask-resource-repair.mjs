import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
const base=process.argv[2]||'http://127.0.0.1:4330';
const output=process.argv[3]||'deployment/ask-resource-local-20261005.json';
const slugs=[
 'how-can-i-work-on-eye-contact-engagement-with-my-child-at-home',
 'how-can-i-work-on-expressive-and-receptive-language-with-my-child-at-home',
 'how-can-i-work-on-pretend-play-roleplaying-with-my-child-at-home',
 'what-aac-and-communication-tools-help-a-non-verbal-child',
 'what-are-the-best-fine-motor-toys-for-toddlers',
 'what-is-abilityscore-and-how-does-it-help-my-child'
];
const records=[];
function nodes(n,out=[]){if(n.tagName)out.push(n);for(const c of n.childNodes||[])nodes(c,out);return out;}
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
for(const slug of slugs){
 const url=base+'/ask/'+slug,r=await fetch(url,{signal:AbortSignal.timeout(25000)}),body=await r.text();
 assert.equal(r.status,200,slug);assert(body.includes('id="explanation"'),'Real answer body '+slug);assert(body.includes('id="ask-reader-gate"'),'Registration overlay '+slug);
 const doc=nodes(parse(body));const canonical=doc.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical');
 assert.equal(attr(canonical,'href'),'https://pinnacleblooms.org/ask/'+slug);
 const robots=doc.find(n=>n.tagName==='meta'&&attr(n,'name')==='robots');assert.match(attr(robots,'content'),/^index,/);
 const og=doc.find(n=>n.tagName==='meta'&&attr(n,'property')==='og:image');assert.equal(attr(og,'content'),'https://pinnacleblooms.org/ask/'+slug+'.png');
 for(const n of doc.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json'))JSON.parse(n.childNodes.map(x=>x.value||'').join(''));
 const json=await fetch(url+'.json');assert.equal(json.status,200);const a=await json.json();assert.equal(a.slug,slug);assert(a.answer_md.length>500);assert(Array.isArray(a.related_materials)&&Array.isArray(a.related_techniques));
 const md=await fetch(url+'.md');assert.equal(md.status,200);assert((await md.text()).includes(a.answer_md));
 records.push({url,status:r.status,canonical:attr(canonical,'href'),robots:attr(robots,'content'),answerCharacters:a.answer_md.length,structuredDataValid:true,overlay:true,publicExports:true});
}
for(const [p,status] of [['/ask/repair-check-nonexistent-20261005',404],['/ask',200],['/ask/lens',200],['/ask/te',200],['/ask/sitemap.xml',200],['/ask/search?q=speech',200]]){
 const r=await fetch(base+p,{signal:AbortSignal.timeout(25000)});assert.equal(r.status,status,p);await r.text();records.push({url:base+p,status:r.status});
}
const session=await fetch(base+'/ask/auth/session');await session.text();assert.match(session.headers.get('cache-control'),/no-store/);records.push({url:base+'/ask/auth/session',status:session.status,private:true});
await fs.writeFile(output,JSON.stringify({at:new Date().toISOString(),base,records},null,2)+'\n');
console.log(JSON.stringify({output,passed:records.length,answerPages:slugs.length}));
