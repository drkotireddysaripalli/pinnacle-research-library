// Release exactly these shared-script and consent-policy bytes without replacing
// the active asset bundle. The policy records are intentionally narrow: three
// public HTML documents, their maintained reading/source copies, and only a
// referenced hashed asset that is absent from the current Worker inventory.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const scripts={};
for(const name of ['speech-measurement.js','book-commerce.js']){
 const text=await fs.readFile('public/pinnacle-pages-scripts/'+name,'utf8');
 scripts['/pinnacle-pages-scripts/'+name]={text,sha256:crypto.createHash('sha256').update(text).digest('hex')};
 if(name==='speech-measurement.js')scripts['/books/resources/measurement-v1.js']=scripts['/pinnacle-pages-scripts/'+name];
}
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const mime=file=>({'.html':'text/html; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/markdown; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff2':'font/woff2'}[path.extname(file)]||'application/octet-stream');
const policyAssets={};
const policyRuntimeAssets={};
const add=async(target,key,file,{kind='data',canonical=null}={})=>{const bytes=await fs.readFile(file);target[key]={body:bytes.toString('base64'),sha256:sha(bytes),contentType:mime(file),kind,...(canonical?{canonical}:{})};};
const pages=[
 {path:'/privacy-policy',id:'privacy-policy'},
 {path:'/cookie-policy',id:'cookie-policy'},
 {path:'/policies',id:'policies'}
];
for(const page of pages){
 await add(policyAssets,'/pinnacle-pages-html/'+page.id+'.html','dist/'+page.id+'.html',{kind:'html',canonical:page.path});
 await add(policyAssets,'/pinnacle-pages-data/'+page.id+'-policy.md','dist/pinnacle-pages-data/'+page.id+'-policy.md',{kind:'markdown',canonical:page.path});
 await add(policyAssets,'/pinnacle-pages-data/'+page.id+'-policy-source.json','dist/pinnacle-pages-data/'+page.id+'-policy-source.json');
}
const main=await fs.readFile('deployment/pinnacle-route-v12.mjs','utf8');
const inventory=JSON.parse(main.match(/const SPEECH_INVENTORY=(\{[^\n]+\});/)?.[1]||'{}');
const html=(await Promise.all(pages.map(page=>fs.readFile('dist/'+page.id+'.html','utf8')))).join('\n');
let reusedAssets=0;
for(const match of html.matchAll(/\/pinnacle-pages-(?:assets|fonts|scripts)\/[A-Za-z0-9_./-]+/g)){
 const key=match[0];if(policyAssets[key]||scripts[key])continue;
 const file='dist'+key,bytes=await fs.readFile(file),short=sha(bytes).slice(0,16);
 if(inventory[key]===short){reusedAssets++;continue;}
 await add(policyRuntimeAssets,key,file,{kind:'immutable'});
}
const policyRoutes=Object.fromEntries(pages.map(page=>[page.path,{html:'/pinnacle-pages-html/'+page.id+'.html',markdown:'/pinnacle-pages-data/'+page.id+'-policy.md'}]));
const attributionCode='// Generated from public/pinnacle-pages-scripts by scripts/build-book-attribution.mjs.\nexport const attributionScripts='+JSON.stringify(scripts)+';\n';
const policyCode='// Generated from exact production policy output by scripts/build-book-attribution.mjs.\nexport const publicPolicyAssets='+JSON.stringify(policyAssets)+';\nexport const publicPolicyRoutes='+JSON.stringify(policyRoutes)+';\n';
const runtimeCode='// Generated from policy runtime dependencies absent from the retained live asset union.\nexport const publicPolicyRuntimeAssets='+JSON.stringify(policyRuntimeAssets)+';\n';
await Promise.all([fs.writeFile('deployment/book-attribution-assets.mjs',attributionCode),fs.writeFile('deployment/public-policy-assets.mjs',policyCode),fs.writeFile('deployment/public-policy-runtime-assets.mjs',runtimeCode)]);
console.log(JSON.stringify({generated:['book-attribution-assets.mjs','public-policy-assets.mjs','public-policy-runtime-assets.mjs'],scripts:Object.keys(scripts).length,policyAssets:Object.keys(policyAssets).length,policyRuntimeAssets:Object.keys(policyRuntimeAssets).length,policyRoutes:Object.keys(policyRoutes).length,reusedAssets,moduleBytes:{attribution:Buffer.byteLength(attributionCode),policy:Buffer.byteLength(policyCode),runtime:Buffer.byteLength(runtimeCode)}}));
