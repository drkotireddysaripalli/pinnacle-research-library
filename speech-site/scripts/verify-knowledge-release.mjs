// Focused HTTP acceptance for the imported catalogues, suitable for preview and live.
import fs from 'node:fs/promises';import assert from 'node:assert/strict';
import {parse} from 'parse5';
import {languages,improvementQualifier,improvementLimitation} from '../src/lib/knowledge/catalogues.ts';
const origin=process.env.KNOWLEDGE_BASE||'http://127.0.0.1:4330',live=origin.startsWith('https://www.pinnacleblooms.org');
const index=JSON.parse(await fs.readFile('ask-public/knowledge-data/faq-index.json','utf8'));
const manifest=JSON.parse(await fs.readFile('ask-public/knowledge-data/manifest.json','utf8'));
const results=[];
function nodes(html){const out=[];const visit=n=>{if(n.tagName)out.push({tag:n.tagName,a:Object.fromEntries(n.attrs.map(a=>[a.name,a.value])),text:n.childNodes?.filter(x=>x.nodeName==='#text').map(x=>x.value).join('')});n.childNodes?.forEach(visit);};visit(parse(html));return out;}
async function get(path,status=200){const r=await fetch(origin+path,{redirect:'manual',signal:AbortSignal.timeout(30000)}),html=await r.text();assert.equal(r.status,status,path);if(live&&status===200&&r.headers.get('content-type')?.includes('text/html'))assert.equal(r.headers.get('x-pinnacle-knowledge-release'),'20261005-v1');results.push({path,status:r.status,bytes:Buffer.byteLength(html),location:r.headers.get('location'),release:r.headers.get('x-pinnacle-knowledge-release')});return {r,html,n:nodes(html)};}
for(const language of Object.keys(languages)){
 const item=index.find(x=>x.language===language&&x.slug==='autism-speech-therapy');assert(item);
 const {html,n}=await get(item.url);assert(html.endsWith('</html>'));assert.equal(n.filter(x=>x.tag==='h1').length,1);
 assert.equal(n.find(x=>x.tag==='link'&&x.a.rel==='canonical').a.href,'https://www.pinnacleblooms.org'+item.url);
 assert.equal(n.find(x=>x.tag==='html').a.lang,languages[language].code);
 const graph=n.filter(x=>x.tag==='script'&&x.a.type==='application/ld+json').flatMap(x=>JSON.parse(x.text)['@graph']||[]),faq=graph.find(x=>x['@type']==='FAQPage');
 assert(faq.mainEntity[0].acceptedAnswer.text.length>100);assert(n.some(x=>x.tag==='meta'&&x.a.property==='og:image'&&x.a.content));
 if(item.hasImprovementClaim){assert(faq.mainEntity[0].acceptedAnswer.text.includes(improvementQualifier));assert(faq.mainEntity[0].acceptedAnswer.text.includes(improvementLimitation));assert(html.includes(improvementQualifier));}
 if(language==='english'){assert(html.includes('href="tel:+919100181181"'));assert(html.includes('href="mailto:care@pinnacleblooms.org"'));}
}
const answer=index.find(x=>x.language==='english'&&x.slug==='autism-speech-therapy');
for(const query of ['?page=9999','?page=0','?q=speech'])assert.equal((await get(answer.url+query,301)).r.headers.get('location'),'https://www.pinnacleblooms.org'+answer.url);
for(const path of ['/faq','/faq?page=2','/faq/english','/sunshine','/sunshine/techniques','/sunshine?page=2','/allmirracles','/allmirracles?page='+Math.ceil(manifest.mirraclesCount/60)]){const {html,n}=await get(path);assert(html.includes('</html>'));assert(n.some(x=>x.tag==='meta'&&x.a.property==='og:image'&&x.a.content));assert(html.includes('href="/faq"'));assert(html.includes('href="/sunshine"'));}
for(const path of ['/faq/english/no-such-answer','/faq?page=9999','/sunshine/no-such-topic','/allmirracles?page=9999'])assert.match((await get(path,404)).r.headers.get('x-robots-tag'),/noindex/);
for(const path of ['/faq?q=speech','/sunshine?q=communication']){const {r}=await get(path);assert.match(r.headers.get('x-robots-tag'),/noindex/);assert.match(r.headers.get('cache-control'),/no-store/);}
for(const path of ['/faq/sitemap.xml','/sunshine/sitemap.xml','/allmirracles-sitemap.xml']){const {html,r}=await get(path);assert.match(r.headers.get('content-type'),/xml/);assert(html.includes('<urlset'));assert(!html.includes('UPLOADED'));const count=(html.match(/<loc>/g)||[]).length;results.at(-1).urls=count;if(path==='/faq/sitemap.xml')assert(count>=4564);}
const auth=await fetch(origin+'/ask/auth/session',{signal:AbortSignal.timeout(30000)});assert.match(auth.headers.get('cache-control'),/no-store/);if(live){assert.equal(auth.status,200);assert.equal((await auth.json()).profile,null);}else assert([200,503].includes(auth.status));
const authentication={status:auth.status,noStore:true,verified:live,limitation:live?null:'Local preview has no production identity secrets; Google overlay tested with a synthetic browser response.'};
await fs.writeFile('deployment/knowledge-'+(live?'public':'http-local')+'-20261005.json',JSON.stringify({at:new Date().toISOString(),origin,results,authentication},null,2));console.log(JSON.stringify({origin,checks:results.length,answers:7,authentication,bytes:results.filter(x=>['/faq','/sunshine','/allmirracles'].includes(x.path))}));
