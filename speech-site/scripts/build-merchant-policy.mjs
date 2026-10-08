import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
const site=path.resolve(import.meta.dirname,'..');
const policyPath='/books/refund-and-delivery-policy';
const html=await fs.readFile(path.join(site,'dist',policyPath+'.html'),'utf8');
assert(html.includes('index, follow, max-image-preview:large'));
const manifest=JSON.parse(await fs.readFile(path.join(site,'ask-private/paid-journey-20261008/manifest.json'),'utf8'));
const assets={},queue=[];
const put=(key,bytes,type)=>assets[key]={body:bytes.toString('base64'),type,sha256:createHash('sha256').update(bytes).digest('hex')};
put(policyPath,Buffer.from(html),'text/html; charset=utf-8');
function visit(node){for(const a of node.attrs||[])if(['src','href'].includes(a.name)){
  const u=new URL(a.value,'https://www.pinnacleblooms.org');
  if(u.hostname==='www.pinnacleblooms.org'&&/\.(css|js|mjs|png|jpg|webp|svg|woff2)$/.test(u.pathname))queue.push(u.pathname);
}for(const c of node.childNodes||[])visit(c);}
visit(parse(html));
const seen=new Set();
while(queue.length){const key=queue.shift();if(seen.has(key)||manifest[key]||key==='/verify/favicon.png')continue;seen.add(key);
  const file=path.join(site,'dist',key);let bytes;try{bytes=await fs.readFile(file);}catch{throw Error('Missing policy dependency '+key);}
  const ext=path.extname(key),type={'.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'}[ext];
  assert(type);put(key,bytes,type);
  if(ext==='.css')for(const m of bytes.toString().matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)){if(m[1].startsWith('data:'))continue;const u=new URL(m[1],'https://www.pinnacleblooms.org'+key);if(u.hostname==='www.pinnacleblooms.org')queue.push(u.pathname);}
}
await fs.writeFile(path.join(site,'deployment/merchant-policy-content.mjs'),'// Generated policy and new immutable dependencies; existing full asset union is retained.\nexport const bookPolicyAssets='+JSON.stringify(assets)+';\n');
console.log(JSON.stringify({policyPath,embeddedPaths:Object.keys(assets),bytes:Object.values(assets).reduce((n,v)=>n+Buffer.from(v.body,'base64').length,0)}));
