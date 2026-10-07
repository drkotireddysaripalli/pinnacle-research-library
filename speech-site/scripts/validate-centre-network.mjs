import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {parse} from 'parse5';
import {centreRegister} from '../src/data/centre-network-content.ts';
import {CENTRE_DETAIL_ROUTES,serveSpeech} from '../deployment/speech-handler.mjs';
const root=path.resolve(import.meta.dirname,'..'),rows=[];
function walk(n,fn){fn(n);for(const c of n.childNodes||[])walk(c,fn);}
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
for(const c of centreRegister){
 const pathname=new URL(c.profileUrl).pathname,html=await fs.readFile(path.join(root,'dist',pathname+'.html'),'utf8'),dom=parse(html),nodes=[];walk(dom,n=>nodes.push(n));
 assert.equal(nodes.filter(n=>n.tagName==='h1').length,1,c.id+' one primary heading');
 assert.equal(nodes.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical')?.attrs.find(a=>a.name==='href')?.value,c.profileUrl,c.id+' canonical');
 assert(nodes.some(n=>n.tagName==='meta'&&attr(n,'name')==='robots'&&attr(n,'content').startsWith('index, follow')),c.id+' production indexing');
 const ids=nodes.map(n=>attr(n,'id')).filter(Boolean);assert.equal(new Set(ids).size,ids.length,c.id+' unique IDs');
 const anchors=nodes.filter(n=>n.tagName==='a'&&attr(n,'href')?.startsWith('#')).map(n=>attr(n,'href').slice(1));assert(anchors.every(id=>!id||ids.includes(id)),c.id+' all local anchors exist: '+anchors.filter(id=>!ids.includes(id)));
 const schema=JSON.parse(nodes.find(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').childNodes[0].value),graph=schema['@graph'];
 assert(!graph.some(e=>e.aggregateRating||e.review),c.id+' no self-serving review-star schema');
 if(c.pageStatus==='centre-enquiry'){
  assert(nodes.some(n=>n.tagName==='a'&&attr(n,'data-cta')==='hero-assessment'&&new URL(attr(n,'href')).searchParams.get('centre')===c.id),c.id+' selected-centre enquiry');
  const business=graph.find(e=>e['@type']==='LocalBusiness');assert(business,c.id+' local business');assert.equal(business.telephone,'+919100181181');
  assert(html.includes('id="google-reviews"')&&html.includes('id="nearby-centres"')&&html.includes('id="centre-books"'),c.id+' complete network journey');
  for(const block of ['centre-pinnacleai','centre-abilityscore','centre-readiness','centre-paradigm','centre-self-sufficient','centre-mainstream','centre-verify','centre-research','centre-citations'])assert(ids.includes(block),c.id+' visible ecosystem '+block);
  assert.equal(nodes.filter(n=>n.tagName==='button'&&attr(n,'data-trust-video')).length,4,c.id+' four public staff/family video previews');
  assert.equal(nodes.filter(n=>n.tagName==='figure'&&attr(n,'class')==='trust-art').length,4,c.id+' four coordinated trust illustrations');
  if(c.directTelephone)assert(html.includes('tel:'+c.directTelephone),c.id+' local phone alternative');
  for(const section of ['find-us','life-first','support','first-visit','connected-pathway','family-resources','local-evidence','questions'])assert(ids.includes(section),c.id+' '+section);
  for(const chapter of ['understand','everyday','review','life'])assert(ids.includes('centre-chapter-'+chapter),c.id+' complete PinnacleAI chapter '+chapter);
  const stageLists=nodes.filter(n=>n.tagName==='ol'&&attr(n,'class')?.includes('ecosystem-stage-pair'));
  assert.equal(stageLists.length,4,c.id+' stages grouped into four chapters');
  assert.deepEqual(stageLists.map(n=>Number(attr(n,'start'))),[1,3,5,7],c.id+' seven-stage order');
  assert.equal(stageLists.reduce((count,n)=>count+n.childNodes.filter(x=>x.tagName==='li').length,0),7,c.id+' seven stages once');
  assert(html.indexOf('id="everyday-example"')<html.indexOf('id="pinnacle-ecosystem"'),c.id+' local example before mechanism');
  const visit=nodes.find(n=>attr(n,'id')==='first-visit');let preparationLink=false;walk(visit,n=>{if(n.tagName==='a'&&attr(n,'href')?.endsWith('/books/resources/first-conversation'))preparationLink=true;});
  assert(preparationLink,c.id+' preparation belongs beside first visit');
  assert(recordPlaceholderGuard(html),c.id+' local name in the journey');
 }
 if(c.id==='usa')assert(!graph.some(e=>e['@type']==='LocalBusiness'));
 const assets=new Set(html.match(/\/pinnacle-pages-assets\/[\w.-]+/g)||[]);for(const f of assets)assert((await fs.stat(path.join(root,'dist',f))).isFile(),c.id+' asset '+f);
 const key='/pinnacle-pages-html/'+c.id+'.html',env={ASSETS:{fetch:async()=>new Response(html,{headers:{'content-type':'text/html'}})}};
 const r=await serveSpeech(new Request(c.profileUrl),env,{[key]:'fixture'});assert.equal(r.status,200,c.id+' exact worker route');
 assert(Object.hasOwn(CENTRE_DETAIL_ROUTES,pathname));
 const record=JSON.parse(await fs.readFile(path.join(root,'dist/pinnacle-pages-data',c.id+'-evidence.json'),'utf8'));assert.equal(record.canonical,c.profileUrl,c.id+' machine identity');
 rows.push({id:c.id,url:c.profileUrl,assets:assets.size,localPhone:!!c.directTelephone,photos:c.images.length,status:c.pageStatus});
}
function recordPlaceholderGuard(html){return !html.includes('Pinnacle undefined')&&!html.includes('Pinnacle null');}
assert.equal(rows.length,62);const sitemap=await fs.readFile(path.join(root,'dist/pinnacle-pages-data/speech-sitemap.xml'),'utf8');for(const c of centreRegister)assert.equal(sitemap.split('<loc>'+c.profileUrl+'</loc>').length-1,1,c.id+' one sitemap entry');
await fs.mkdir(path.join(root,'deployment'),{recursive:true});await fs.writeFile(path.join(root,'deployment/centre-network-contract-20261007.json'),JSON.stringify({at:new Date().toISOString(),passed:rows.length,rows},null,2)+'\n');console.log(JSON.stringify({passed:rows.length,localPhoneAlternatives:rows.filter(r=>r.localPhone).length,canonicalRouteAssetSchemaAndAnchorChecks:true}));
