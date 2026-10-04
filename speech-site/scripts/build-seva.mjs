// A small additive bundle preserves the exact current Cloudflare assets during release.
// Regenerated from the Astro source on every build; never a separate page implementation.
import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const root=process.cwd(),dist=path.join(root,'dist'),page='/seva',prefix='/seva/_assets/';
const assets={};const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const type=p=>({'.html':'text/html; charset=utf-8','.md':'text/markdown; charset=utf-8','.xml':'application/xml; charset=utf-8','.pdf':'application/pdf','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.woff2':'font/woff2'}[path.extname(p)]||'application/octet-stream');
const add=(url,bytes,mime=type(url))=>{const b=Buffer.from(bytes);assets[url]={type:mime,body:b.toString('base64'),sha256:sha(b)};};
let html=await fs.readFile(path.join(dist,page+'.html'),'utf8');
assert(html.includes('Social Equity in Valuable Access'));
assert(!html.includes('noindex'),'Build SEVA with PINNACLE_RELEASE=production');
const refs=[...new Set([...html.matchAll(/\/pinnacle-pages-assets\/[\w.-]+/g)].map(m=>m[0]))];
for(const ref of refs){
 const bytes=await fs.readFile(path.join(dist,ref));
 const url=prefix+path.basename(ref);add(url,bytes);html=html.replaceAll(ref,url);
}
add(page,html,'text/html; charset=utf-8');
add(page+'.md',await fs.readFile(path.join(root,'public/seva.md')));
add('/seva/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.pinnacleblooms.org/seva</loc><lastmod>2026-10-04</lastmod></url></urlset>');
await fs.writeFile(path.join(root,'deployment/seva-assets.mjs'),'// Generated from the common-shell Astro page by scripts/build-seva.mjs.\nexport const sevaAssets='+JSON.stringify(assets)+';\n');
console.log(JSON.stringify({resource:'seva_v1',assets:Object.keys(assets).length,bytes:Object.values(assets).reduce((sum,a)=>sum+Buffer.from(a.body,'base64').length,0)}));
