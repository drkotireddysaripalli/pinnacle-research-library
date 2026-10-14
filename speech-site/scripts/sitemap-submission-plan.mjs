import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
export const managedHosts=new Set(['www.pinnacleblooms.org','pinnacleblooms.org','materials.pinnacleblooms.org','interventions.pinnacleblooms.org','pediatricians.pinnacleblooms.org']);
const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
export function publicCanonical(value){try{const u=new URL(value);if(u.protocol!=='https:'||!managedHosts.has(u.hostname)||u.port||u.username||u.password||u.search||u.hash||/\/(?:api|auth|account|checkout|cart|payonline|reports?|assets|pinnacle-pages-assets|pinnacle-pages-fonts)(?:\/|$)/i.test(u.pathname)||/\.(?:jpg|jpeg|png|webp|gif|mp4|pdf|zip)$/i.test(u.pathname))return null;return u.href;}catch{return null;}}
export function graphFingerprint(root,files){
 assert(publicCanonical(root)&&root.endsWith('.xml'));const rows=files.map(f=>{assert(f.url.endsWith('.xml')&&publicCanonical(f.url)&&/^[a-f0-9]{64}$/.test(f.sha256));return[f.url,f.sha256]}).sort((a,b)=>a[0].localeCompare(b[0]));assert(rows.some(r=>r[0]===root));assert.equal(new Set(rows.map(r=>r[0])).size,rows.length);return digest(rows);
}
export function submissionPlan({changes=[],priorVerified=[],graphs=[],previousGraphs={},contentVersion=''}={}){
 const prior=new Set(priorVerified.map(publicCanonical).filter(Boolean)),urls=new Set(),held=[];
 for(const c of changes){const url=publicCanonical(c.url);if(!url){held.push({url:c.url,reason:'unapproved-public-canonical'});continue;}
  const update=c.status===200&&c.indexable===true&&c.canonical===url&&c.eligible===true&&c.changed===true;
  const removal=[404,410].includes(c.status)&&prior.has(url)&&c.retirementVerified===true;
  if(update||removal)urls.add(url);else held.push({url,reason:'no-current-eligible-change-or-verified-retirement'});
 }
 const indexnow=[];for(const host of [...managedHosts]){const list=[...urls].filter(x=>new URL(x).hostname===host).sort();for(let i=0;i<list.length;i+=10000){const batch=list.slice(i,i+10000);indexnow.push({id:digest(['indexnow',host,batch,contentVersion]),host,urls:batch,status:'pending-key-verification',attempts:0});}}
 const sitemaps=graphs.map(g=>({...g,fingerprint:graphFingerprint(g.root,g.files)})).filter(g=>g.fingerprint!==previousGraphs[g.root]).map(g=>({id:digest(['sitemap',g.root,g.fingerprint]),root:g.root,fingerprint:g.fingerprint,status:'pending-durable-auth',attempts:0}));
 return{indexnow,sitemaps,held,unchangedRoots:graphs.length-sitemaps.length,publicationIsNotIndexing:true};
}
