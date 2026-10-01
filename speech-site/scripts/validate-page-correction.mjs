import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const [stage,prior,tag,changedCsv,mode='staged']=process.argv.slice(2);
assert(stage&&prior&&tag&&changedCsv,'stage, prior, tag and changed comma-separated slugs required');
const changed=changedCsv.split(','),origin='https://www.pinnacleblooms.org';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const owned=t=>t.replace('<script async src="https://www.googletagmanager.com/gtag/js?id=AW-10810823199"></script>','').replace('<script src="https://www.pinnacleblooms.org/pinnacle-pages-scripts/google-ads-call.js"></script>','');
const main=t=>t.match(/<main\b[\s\S]*?<\/main>/)[0];
const header=t=>t.match(/<header\b[\s\S]*?<\/header>/)[0].replaceAll(' aria-current="page"','').replaceAll(' is-current','');
const footer=t=>t.match(/<footer\b[\s\S]*?<\/footer>/)[0];
const files=(await fs.readdir(stage+'/pinnacle-pages-html')).filter(f=>f.endsWith('.html')&&!f.includes('preview'));
const priorFiles=(await fs.readdir(prior+'/pinnacle-pages-html')).filter(f=>f.endsWith('.html')&&!f.includes('preview'));
assert.deepEqual(files,priorFiles);
const pages=await Promise.all(files.map(async file=>{const html=await fs.readFile(stage+'/pinnacle-pages-html/'+file,'utf8'),previous=await fs.readFile(prior+'/pinnacle-pages-html/'+file,'utf8'),id=file.replace('.html','');assert.equal(header(html),header(previous),id+' shared header');assert.equal(footer(html),footer(previous),id+' shared footer');if(!changed.includes(id))assert.equal(main(html),main(previous),id+' accepted body');return{id,file,html,path:new URL(html.match(/rel="canonical" href="([^"]+)"/)[1]).pathname};}));
for(const id of changed)assert(pages.some(p=>p.id===id),'Unknown changed slug '+id);
assert.equal(sha(await fs.readFile(stage+'/index.html')),sha(await fs.readFile(prior+'/index.html')),'Verify index');
assert.equal(sha(await fs.readFile('.worker-upload-'+stage.replace(/^release-/, '')+'/speech-handler.mjs')),sha(await fs.readFile('.worker-upload-'+prior.replace(/^release-/, '')+'/speech-handler.mjs')),'Runtime boundary unchanged');
const receipt={at:new Date().toISOString(),stage,prior,changed,total:pages.length,unchangedBodies:pages.length-changed.length,commonShellsPreserved:true,verifyIndexPreserved:true,runtimePreserved:true};
async function limited(list,fn){let i=0;const out=[];await Promise.all(Array.from({length:4},async()=>{while(i<list.length){const j=i++;out[j]=await fn(list[j]);}}));return out;}
async function get(path,options={}){const r=await fetch(new URL(path,origin),{redirect:'manual',...options}),bytes=Buffer.from(await r.arrayBuffer());return{r,bytes,text:bytes.toString('utf8')};}
if(mode==='live'){
 receipt.pages=await limited(pages,async p=>{const o=await get(p.path);assert.equal(o.r.status,200,p.path);assert.equal(sha(owned(o.text)),sha(p.html),p.path+' published bytes');return{path:p.path,matched:true};});
 const cookie='unknown=fixture; _gcl_au=fixture; __Host-appgarden-visitor=fixture';
 receipt.changedDelivery=await limited(pages.filter(p=>changed.includes(p.id)),async p=>{for(const headers of [{cookie},{cookie,authorization:'Bearer fixture',range:'bytes=0-1','cache-control':'no-transform'}]){const o=await get(p.path,{headers});assert.equal(o.r.status,200);assert.equal(sha(owned(o.text)),sha(p.html));assert(o.r.headers.get('cache-control').includes('private, no-store'));}
 const md=await get(p.path,{headers:{cookie,accept:'text/markdown'}});assert.equal(md.r.status,200);const exportNames=(await fs.readdir(stage+'/pinnacle-pages-data')).filter(f=>f.startsWith(p.id+'-')&&/(?:evidence\.(json|txt)|machine\.md|sources\.(json|txt)|reading\.md|policy-source\.json|policy\.md)$/.test(f));const machinePath='/pinnacle-pages-data/'+exportNames.find(f=>f.endsWith('.md'));assert(exportNames.length>=2,'Matching document exports required');assert.equal(sha(md.bytes),sha(await fs.readFile(stage+machinePath)));
 const head=await get(p.path,{method:'HEAD',headers:{cookie}});assert.equal(head.r.status,200);assert.equal(head.bytes.length,0);
 const paths=new Set([...p.html.matchAll(/(?:src|href|content)="(\/pinnacle-pages-(?:assets|fonts|scripts|data)\/[^"?]+|https:\/\/www.pinnacleblooms.org\/pinnacle-pages-assets\/[^"?]+)(?:\?[^"]*)?"/g)].map(m=>new URL(m[1],origin).pathname));
 for(const name of exportNames)paths.add('/pinnacle-pages-data/'+name);
 const assets=await limited([...paths],async path=>{const a=await get(path);assert.equal(a.r.status,200,path);assert.equal(sha(a.bytes),sha(await fs.readFile(stage+path)),path);return{path,bytes:a.bytes.length,sha256:sha(a.bytes)};});
 return{path:p.path,cookie:true,credentialRangeNoTransform:true,markdown:true,head:true,assets};});
 const before=JSON.parse(await fs.readFile('deployment/voice-delivery-protected-before-v137-20261001.json','utf8'));
 const booksSource=JSON.parse(await fs.readFile('deployment/books-protected-source-comparison-v148-20261001.json','utf8'));
 const normaliseBooks=t=>t.replace(/<meta http-equiv="last-modified" content="[^"]+"\s*\/>/,'').replace(/<script type="module" src="https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js\/[^\"]+"[^>]*><\/script>\n?/,'');
 receipt.protected=await limited(before.rows,async row=>{const o=await get(row.path);assert.equal(o.r.status,row.status,row.path);assert.equal(o.r.headers.get('location'),row.location,row.path);if(row.path===booksSource.url){assert.equal(sha(normaliseBooks(o.text)),booksSource.normalisedSha256,row.path+' historical policy source');return{path:row.path,sourceContentUnchanged:true,normalisedSha256:booksSource.normalisedSha256,normalisations:booksSource.normalisations};}assert.equal(row.path==='/epass'?sha(o.text.replace(/<meta http-equiv="last-modified" content="[^"]+"\s*\/>/,'')):sha(o.bytes),row.path==='/epass'?row.normalisedSha256:row.sha256,row.path+' protected');return{path:row.path,unchanged:true};});
 for(const path of ['/Leadership/Maheshwari','/leadership/Prudhvi%2dMatsa','/Images/LeadershipImages/shoban_big_image.png'])assert.equal((await get(path)).r.status,410,'Retirement retained');
 const sitemap=await get('/pinnacle-pages-data/public-documents-sitemap.xml');assert.equal(sha(sitemap.bytes),sha(await fs.readFile(stage+'/pinnacle-pages-data/public-documents-sitemap.xml')));
}
else assert.equal(mode,'staged');
const output='deployment/page-correction-'+tag+'-'+mode+'-20261001.json';await fs.writeFile(output,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({output,pages:pages.length,changed,unchangedBodies:receipt.unchangedBodies,phase:mode,passed:true}));
