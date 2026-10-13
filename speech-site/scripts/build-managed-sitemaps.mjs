import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {parse,serialize} from 'parse5';
import {applyGitPublisher,managedNavigationCSS} from './git-publisher-records.mjs';
const root='release-managed-sitemaps-20261013';
const selection=process.env.PINNACLE_SITEMAP_SELECTION||'../tooling/sitemap-manager/publication-selection.json';
const python=process.env.PYTHON_EXECUTABLE||(process.platform==='win32'?'C:/Python314/python.exe':'python3');
const stage=await fs.mkdtemp(path.resolve('.managed-sitemap-selected-'));
await fs.rmdir(stage);
const sourceReceipt=JSON.parse(execFileSync(python,['../tooling/sitemap-manager/publication_selection.py','--selection',selection,'--output',stage],{windowsHide:true,encoding:'utf8'}));
const manifest=JSON.parse(await fs.readFile(stage+'/manifest.json','utf8'));
const originalId=manifest.release_id;
const base=await fs.readFile('dist/policies.html','utf8');
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=(node,fn)=>{fn(node);for(const c of node.childNodes||[])walk(c,fn);};
const nodes=(doc,tag)=>{const out=[];walk(doc,n=>{if(n.tagName===tag)out.push(n);});return out;};
const attr=(n,name)=>n.attrs?.find(a=>a.name===name)?.value;
const set=(n,name,value)=>{n.attrs??=[];const a=n.attrs.find(a=>a.name===name);if(a)a.value=value;else n.attrs.push({name,value});};
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(text).join('');
const report={originalRelease:originalId,html:[],unchanged:[]};
for(const entry of manifest.files){
 const file=path.join(stage,entry.path),original=await fs.readFile(file);
 assert.equal(hash(original),entry.sha256,entry.path);
 if(entry.kind!=='html'){report.unchanged.push({path:entry.path,sha256:entry.sha256});continue;}
 const from=parse(original.toString()),doc=parse(base),main=nodes(from,'main')[0],target=nodes(doc,'main')[0];
 assert(main&&target);assert.equal(nodes(from,'h1').length,1);
 const title=text(nodes(from,'title')[0]),heading=text(nodes(from,'h1')[0]);
 target.childNodes=main.childNodes;for(const c of target.childNodes)c.parentNode=target;
 set(target,'class','managed-sitemap');set(target,'id','main');
 nodes(doc,'title')[0].childNodes=[{nodeName:'#text',value:title,parentNode:nodes(doc,'title')[0]}];
 const description='Browse '+heading+' and follow the original Pinnacle pages. Call 9100 181 181 for help finding the right service.';
 for(const meta of nodes(doc,'meta')){
  const key=attr(meta,'name')||attr(meta,'property');
  if(key==='robots')set(meta,'content','noindex, follow');
  if(['description','og:description','twitter:description'].includes(key))set(meta,'content',description);
  if(['og:title','twitter:title'].includes(key))set(meta,'content',title);
  if(['og:url','twitter:url'].includes(key))set(meta,'content',entry.public_url);
 }
 for(const link of nodes(doc,'link'))if(attr(link,'rel')==='canonical')set(link,'href',entry.public_url);
 for(const script of nodes(doc,'script'))if(attr(script,'type')==='application/ld+json'){
  const graph={'@context':'https://schema.org','@type':'CollectionPage',name:title,url:entry.public_url,description,isPartOf:{'@id':'https://www.pinnacleblooms.org/#website'},publisher:{'@id':'https://www.pinnacleblooms.org/verify/#organization'}};
  script.childNodes=[{nodeName:'#text',value:JSON.stringify(graph).replaceAll('<','\\u003c'),parentNode:script}];
 }
 walk(doc,n=>{for(const a of n.attrs||[]){
  if(['href','src','action','poster'].includes(a.name)&&a.value.startsWith('/')&&!a.value.startsWith('//')&&!a.value.startsWith('/site-map/'))a.value='https://www.pinnacleblooms.org'+a.value;
 }});
 const head=nodes(doc,'head')[0],style={nodeName:'style',tagName:'style',namespaceURI:'http://www.w3.org/1999/xhtml',attrs:[],parentNode:head,childNodes:[]};
 style.childNodes=[{nodeName:'#text',parentNode:style,value:managedNavigationCSS}];head.childNodes.push(style);
 const html=serialize(doc);assert.equal(nodes(parse(html),'h1').length,1);assert(html.includes('portal-header')&&html.includes('portal-footer'));assert(html.includes('tel:+919100181181'));
 await fs.writeFile(file,html);entry.bytes=Buffer.byteLength(html);entry.sha256=hash(html);
 report.html.push({path:entry.path,url:entry.public_url,sha256:entry.sha256,bytes:entry.bytes});
}
const publisherEntries=await applyGitPublisher({root:stage,manifest,base});
for(const f of report.html){const current=manifest.files.find(x=>x.path===f.path);Object.assign(f,{sha256:current.sha256,bytes:current.bytes});}
report.html.push(...publisherEntries.map(f=>({path:f.path,url:f.public_url,sha256:f.sha256,bytes:f.bytes})));
report.publisherRecords=manifest.git_publisher_records;
assert.equal(report.html.length,manifest.files.filter(f=>f.kind==='html').length);
manifest.release_id=hash(JSON.stringify(manifest.files.toSorted((a,b)=>a.path<b.path?-1:a.path>b.path?1:0).map(f=>[f.path,f.sha256])));
const fragments=manifest.files.filter(f=>['robots_addition','llms_addition'].includes(f.kind)).length;
manifest.website_composition={source_release:originalId,selection_sha256:sourceReceipt.selection_sha256,archive_sha256:sourceReceipt.archive_sha256,reviewed_source:sourceReceipt.reviewed_source,template:'dist/policies.html',shared_header_footer:true,native_typography:'shared Anek contract',public_files:manifest.files.length-fragments,discovery_fragments:fragments};
await fs.writeFile(stage+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');
const target=path.resolve(root),cwd=path.resolve('.');assert.equal(path.dirname(target),cwd);assert.equal(path.basename(target),'release-managed-sitemaps-20261013');assert.equal(path.dirname(stage),cwd);assert(path.basename(stage).startsWith('.managed-sitemap-selected-'));
const previous=target+'.previous';assert.equal(path.dirname(previous),cwd);
if(await fs.stat(previous).catch(()=>null))await fs.rm(previous,{recursive:true});
if(await fs.stat(target).catch(()=>null))await fs.rename(target,previous);
try{await fs.rename(stage,target);}catch(error){if(await fs.stat(previous).catch(()=>null))await fs.rename(previous,target);throw error;}
if(await fs.stat(previous).catch(()=>null))await fs.rm(previous,{recursive:true});
await fs.mkdir('outputs/managed-sitemaps-20261013',{recursive:true});
await fs.writeFile('outputs/managed-sitemaps-20261013/composition.json',JSON.stringify({...report,sourceReceipt,release_id:manifest.release_id},null,2)+'\n');
console.log(JSON.stringify({release:manifest.release_id,html:report.html.length,unchanged:report.unchanged.length,files:manifest.files.length}));
