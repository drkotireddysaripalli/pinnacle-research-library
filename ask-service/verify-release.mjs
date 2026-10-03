import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const out=path.resolve(process.argv[2]);
const urls=[
 'https://pinnacleblooms.org/ask/search?q=speech+delay',
 'https://www.pinnacleblooms.org/ask/search?q=speech+delay',
 'https://pinnacleblooms.org/ask/search?q=zzxqnotatopiczz',
 'https://pinnacleblooms.org/ask/search',
 'https://pinnacleblooms.org/ask/what-happens-during-occupational-therapy-sessions',
 'https://pinnacleblooms.org/ask/structured-naming-and-description',
 'https://pinnacleblooms.org/ask/sitemap.xml',
 'https://ask-mcp.pinnacleblooms.org/',
 'https://ask-mcp.pinnacleblooms.org/.well-known/mcp.json',
 'https://www.pinnacleblooms.org/verify/',
 'https://www.pinnacleblooms.org/pinnacleai',
 'https://www.pinnacleblooms.org/enroll-autism-speech-aba-therapies-india'
];
const report={at:new Date().toISOString(),pages:[]};
for(const url of urls){const start=Date.now();const r=await fetch(url,{signal:AbortSignal.timeout(30000)});const body=await r.text();
 const result={url,final:r.url,status:r.status,ms:Date.now()-start,bytes:Buffer.byteLength(body),canonical:body.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1],robots:r.headers.get('x-robots-tag'),cache:r.headers.get('cache-control')};
 if(url.includes('search?q=speech')){assert.equal(r.status,200);assert.match(body,/10 relevant answers/);assert.match(body,/Read the answer/);assert.doesNotMatch(body,/googletagmanager|AW-10810823199/);assert.match(result.cache,/no-store/);assert.equal(result.robots,'noindex, follow');}
 else if(url.includes('zzxq'))assert.match(body,/No published answers matched/);
 else if(url.includes('structured-naming')){assert.equal(r.status,404);assert.match(body,/Search the published answers/);}
 else assert.equal(r.status,200,url);
 report.pages.push(result);
}
const rpc=async(method,params)=>{const r=await fetch('https://ask-mcp.pinnacleblooms.org/mcp',{method:'POST',headers:{'content-type':'application/json',accept:'application/json, text/event-stream','MCP-Protocol-Version':'2025-11-25'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params})});assert.equal(r.status,200);return r.json();};
const home=await rpc('tools/call',{name:'home',arguments:{}});
assert(!home.error && !home.result.isError);
const parsed=home.result.structuredContent || JSON.parse(home.result.content[0].text);
const data=parsed.data||parsed;
assert.match(data.presentation.regulatory,/000248/);assert.doesNotMatch(data.presentation.regulatory,/000150/);assert.match(data.citation_request,/https:\/\/pinnacleblooms.org\/ask\//);assert(data.presentation.strip.some(x=>x.includes('16 patent applications')));assert.equal(data.presentation.published_article_inventory.total,41165);
report.mcpHome={status:'PASS',regulatory:data.presentation.regulatory,citation:data.citation_request,inventory:data.presentation.published_article_inventory,releaseScope:data.presentation.release_scope};
await fs.writeFile(path.join(out,'production-verification.json'),JSON.stringify(report,null,2));
await fs.writeFile(path.join(out,'home-after.json'),JSON.stringify(home,null,2));
console.log(JSON.stringify(report));
