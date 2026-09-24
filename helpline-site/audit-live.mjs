import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {HELPLINE_HTML,CANONICAL_URL} from './worker.mjs';
const directory=new URL('../helpline-retrieval-audit-20260924/',import.meta.url);
await fs.mkdir(directory,{recursive:true});
const hash=s=>createHash('sha256').update(s).digest('hex');
async function get(url,headers={}) {
 const start=Date.now();const r=await fetch(url,{headers,signal:AbortSignal.timeout(25000)});const text=await r.text();
 return {url,finalUrl:r.url,status:r.status,type:r.headers.get('content-type'),robots:r.headers.get('x-robots-tag'),cache:r.headers.get('cf-cache-status'),etag:r.headers.get('etag'),bytes:Buffer.byteLength(text),ms:Date.now()-start,hash:hash(text),text};
}
const live=await get(CANONICAL_URL);
const infrastructure=await Promise.all(['/robots.txt','/llms.txt','/sitemap.xml','/national-autism-helpline/sitemap.xml'].map(p=>get(new URL(p,CANONICAL_URL).href).catch(e=>({url:p,error:e.message}))));
const crawlers=[];
for(const ua of ['Googlebot','bingbot','OAI-SearchBot','ChatGPT-User']){
 const r=await get(CANONICAL_URL,{'User-Agent':ua});crawlers.push({userAgent:ua,status:r.status,equalsRelease:r.text===HELPLINE_HTML,bytes:r.bytes,robots:r.robots});
}
const hrefs=[...new Set([...live.text.matchAll(/href="([^"]+)"/g)].map(m=>m[1]).filter(h=>!h.startsWith('tel:')&&!h.startsWith('#')).map(h=>new URL(h,CANONICAL_URL).href).filter(h=>new URL(h).hostname==='www.pinnacleblooms.org'))];
const links=[];
for(let i=0;i<hrefs.length;i+=4){await Promise.all(hrefs.slice(i,i+4).map(async url=>{try{const r=await get(url);links.push({url,status:r.status,finalUrl:r.finalUrl,title:r.text.match(/<title[^>]*>(.*?)<\/title>/is)?.[1],ms:r.ms});}catch(e){links.push({url,error:e.message})}}));}
const home=await get('https://www.pinnacleblooms.org/');
const verify=await get('https://www.pinnacleblooms.org/verify/');
const report={date:new Date().toISOString(),live:{status:live.status,equalsRelease:live.text===HELPLINE_HTML,bytes:live.bytes,ms:live.ms,hash:live.hash},meta:[...live.text.matchAll(/<meta\b[^>]+>/g)].map(x=>x[0]),images:[...live.text.matchAll(/<img\b[^>]+>/g)].map(x=>x[0]),infrastructure:infrastructure.map(({text,...r})=>({...r,helplineMention:text?.includes('/national-autism-helpline'),content:r.url.endsWith('robots.txt')?text:undefined})),crawlerProbes:crawlers,crawlerScope:'User-Agent response probes from this environment, not authenticated crawler visits or log evidence.',links,homeLinksToHelpline:home.text.includes('href="/national-autism-helpline"')||home.text.includes('href="'+CANONICAL_URL+'"'),verifyLinksToHelpline:verify.text.includes('/national-autism-helpline'),retrievalState:'Web search tool fetched an older extract on 24 September 2026; compare live responses separately. No rank or AI answer citation claimed.'};
await fs.writeFile(new URL('live-audit.json',directory),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,meta:undefined,images:undefined,links:report.links.filter(x=>x.status!==200),linkCount:links.length},null,2));
