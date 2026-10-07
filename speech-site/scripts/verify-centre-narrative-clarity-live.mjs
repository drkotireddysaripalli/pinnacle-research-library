// Bounded publication proof for the shared centre narrative; no forms or contact actions.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {parse} from 'parse5';import {centreRegister} from '../src/data/centre-network-content.ts';
const root=path.resolve(import.meta.dirname,'..'),priv=path.join(root,'ask-private/centre-narrative-clarity-20261007'),origin='https://www.pinnacleblooms.org';
const digest=x=>createHash('sha256').update(x).digest('hex'),attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const flatten=n=>[n,...(n.childNodes||[]).flatMap(flatten)];
async function read(url){const r=await fetch(url,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200,url);return {body:await r.text(),headers:Object.fromEntries(r.headers),url:r.url};}
await fs.mkdir(priv,{recursive:true});
const held=centreRegister.filter(c=>c.pageStatus!=='centre-enquiry');
if(process.argv.includes('--baseline')){
 const rows=await Promise.all(held.map(async c=>({id:c.id,url:c.profileUrl,sha256:digest((await read(c.profileUrl)).body)})));
 await fs.writeFile(path.join(priv,'held-before.json'),JSON.stringify({at:new Date().toISOString(),rows},null,2));console.log(JSON.stringify({heldBaseline:rows.length}));
}else{
 const release=JSON.parse(await fs.readFile(path.join(root,'deployment/centre-narrative-clarity-20261007.json'),'utf8'));assert.equal(release.phase,'verified-configuration');
 const rows=[],pending=centreRegister.filter(c=>c.pageStatus==='centre-enquiry');
 await Promise.all(Array.from({length:6},async()=>{while(pending.length){const c=pending.shift(),r=await read(c.profileUrl),nodes=flatten(parse(r.body));
  assert(!/noindex/i.test(r.headers['x-robots-tag']||''),c.id+' public indexability');assert.equal(r.url,c.profileUrl,c.id+' final public URL');
  assert.equal(attr(nodes.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href'),c.profileUrl,c.id+' canonical');
  assert.equal(nodes.filter(n=>n.tagName==='h1').length,1,c.id+' one heading');
  for(const chapter of ['understand','everyday','review','life'])assert(nodes.some(n=>attr(n,'id')==='centre-chapter-'+chapter),c.id+' '+chapter);
  const lists=nodes.filter(n=>n.tagName==='ol'&&attr(n,'class')?.includes('ecosystem-stage-pair'));assert.deepEqual(lists.map(n=>Number(attr(n,'start'))),[1,3,5,7]);assert.equal(lists.flatMap(n=>n.childNodes.filter(n=>n.tagName==='li')).length,7);
  assert(nodes.some(n=>n.tagName==='a'&&attr(n,'href')==='tel:+919100181181'),c.id+' central call');
  assert(nodes.some(n=>n.tagName==='a'&&attr(n,'data-cta')==='hero-assessment'&&attr(n,'href')?.includes('centre='+c.id)),c.id+' local enquiry');
  const expected=await fs.readFile(path.join(root,'release-centre-narrative-clarity-20261007/pinnacle-pages-data',c.id+'-evidence.json'),'utf8');
  const evidence=await read(origin+'/pinnacle-pages-data/'+c.id+'-evidence.json');assert.equal(evidence.body.trim(),expected.trim(),c.id+' exact evidence export');assert.equal(JSON.parse(evidence.body).pinnacleJourney.chapters.length,4);
  rows.push({id:c.id,url:c.profileUrl,status:200,chapters:4,stages:7,evidenceSha256:digest(evidence.body),passed:true});
 }}));
 const heldBefore=JSON.parse(await fs.readFile(path.join(priv,'held-before.json'),'utf8'));for(const c of heldBefore.rows)assert.equal(digest((await read(c.url)).body),c.sha256,c.id+' location-status content unchanged');
 const protectedPaths=['/ask','/faq','/sunshine','/verify/','/pinnacleai','/speech-therapy','/books','/shop','/enroll-autism-speech-aba-therapies-india'];
 const protectedPublic=await Promise.all(protectedPaths.map(async p=>{const r=await read(origin+p);return {url:origin+p,status:200,finalUrl:r.url};}));
 const changed=JSON.parse(await fs.readFile(path.join(priv,'changed-assets.json'),'utf8')).filter(p=>/\.css$/.test(p));
 const css=await Promise.all(changed.map(async p=>{const r=await read(origin+p),expected=await fs.readFile(path.join(root,'release-centre-narrative-clarity-20261007',p),'utf8');assert.equal(r.body,expected,p+' released bytes');return {url:origin+p,sha256:digest(r.body)};}));
 const receipt={at:new Date().toISOString(),sourceCommit:release.commit,workerVersion:release.candidate,deployment:release.deployment,passed:rows.length,pages:rows.sort((a,b)=>a.id.localeCompare(b.id)),heldPagesPreserved:heldBefore.rows,protectedPublic,changedStylesheets:css,noSyntheticEnquiry:true};
 await fs.writeFile(path.join(root,'deployment/centre-narrative-public-20261007.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({centres:rows.length,heldPages:heldBefore.rows.length,protectedDestinations:protectedPublic.length,stylesheets:css.length,sourceCommit:release.commit}));
}
