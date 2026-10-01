import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const stage='release-public-cookie-v136b-20261001',origin='https://www.pinnacleblooms.org';
const sha=t=>crypto.createHash('sha256').update(t).digest('hex');
const owned=t=>t.replace('<script async src="https://www.googletagmanager.com/gtag/js?id=AW-10810823199"></script>','').replace('<script src="https://www.pinnacleblooms.org/pinnacle-pages-scripts/google-ads-call.js"></script>','');
const cookie='_gcl_au=fixture; __Host-appgarden-visitor=fixture; _ga=fixture; cf_clearance=fixture; _ga_2BYLRLFRDJ=fixture';
async function get(url,options={}){const r=await fetch(url.startsWith('https:')?url:origin+url,{redirect:'manual',signal:AbortSignal.timeout(20000),...options});const bytes=Buffer.from(await r.arrayBuffer());return{r,bytes,text:bytes.toString('utf8')};}
async function limited(list,fn){let i=0;const rows=[];await Promise.all(Array.from({length:4},async()=>{while(i<list.length){const k=i++;rows[k]=await fn(list[k]);}}));return rows;}
const files=(await fs.readdir(stage+'/pinnacle-pages-html')).filter(f=>f.endsWith('.html')&&!f.includes('preview'));
assert.equal(files.length,48);
const pages=await limited(files,async file=>{
 const expected=await fs.readFile(stage+'/pinnacle-pages-html/'+file,'utf8'),canonical=expected.match(/rel="canonical" href="([^"]+)"/)[1];
 const o=await get(canonical,{headers:{cookie,'cache-control':'no-cache'}});
 assert.equal(o.r.status,200,canonical);assert.equal(sha(owned(o.text)),sha(expected),canonical+' returning visitor HTML');
 assert(o.text.includes('class="portal-header"')&&o.text.includes('class="verify-footer"'),canonical+' shared shell');
 const managedDocument=['self-sufficient','mainstream','about','leadership','framework'].includes(file.replace('.html',''))||Object.hasOwn((await import('../deployment/speech-handler.mjs')).PUBLIC_DOCUMENT_ROUTES,new URL(canonical).pathname)||new URL(canonical).pathname.startsWith('/centers/');
 if(managedDocument)assert.equal(o.r.headers.get('cache-control'),'private, no-store',canonical+' visitor cache');
 return{path:new URL(canonical).pathname,status:200,ownedHtmlMatched:true,commonHeader:true,verifyInCommonFooter:true,cacheControl:o.r.headers.get('cache-control')};
});
const cases=await limited(['/self-sufficient','/leadership','/about-pinnacle-proven-improvement-rate','/mainstream','/pinnacle-global-autism-framework'],async path=>{
 const alias=await get(path+'/?source=link-review',{headers:{cookie}});assert.equal(alias.r.status,301);assert.equal(alias.r.headers.get('location'),origin+path+'?source=link-review');
 const md=await get(path,{headers:{cookie,accept:'text/markdown'}});assert.equal(md.r.status,200);assert(md.r.headers.get('content-type').startsWith('text/markdown'));assert.equal(md.r.headers.get('cache-control'),'private, no-store');
 const head=await get(path,{method:'HEAD',headers:{cookie}});assert.equal(head.r.status,200);assert.equal(head.bytes.length,0);
 return{path,aliasQueryPreserved:true,markdown:true,head:true};
});
const previous=JSON.parse(await fs.readFile('deployment/institutional-public-v136-20261001.json','utf8'));
const protectedRows=await limited(previous.protectedRows,async row=>{
 const o=await get(row.path,{headers:{'cache-control':'no-cache'}});assert.equal(o.r.status,row.status,row.path);assert.equal(o.r.headers.get('location'),row.location,row.path);
 if(row.path==='/epass'){const normalise=t=>t.replace(/<meta http-equiv="last-modified" content="[^"]+"\s*\/>/,'');assert.equal(sha(normalise(o.text)),row.normalisedSha256,row.path+' origin timestamp normalised');}
 else assert.equal(sha(o.bytes),row.sha256,row.path+' protected bytes');
 return{path:row.path,status:o.r.status,unchanged:true};
});
const output='deployment/public-cookie-live-v136b-20261001.json';
await fs.writeFile(output,JSON.stringify({at:new Date().toISOString(),stage,pages,cases,protectedRows},null,2)+'\n');
console.log(JSON.stringify({output,returningVisitorPages:pages.length,documentCases:cases.length,protectedUnchanged:protectedRows.length}));
