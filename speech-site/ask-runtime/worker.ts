import {handle} from '@astrojs/cloudflare/handler';
import legacy from '../../ask-service/worker/index.js';
import {answer,rpc} from '../src/lib/ask/repository';
import {institution} from '../src/lib/ask/overrides';
import {ASK} from '../src/lib/ask/content';
const xml=(s:any)=>String(s??'').replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));
const textHeaders={'content-type':'text/plain; charset=utf-8','cache-control':'public, max-age=300','x-content-type-options':'nosniff'};
const guide='# Ask Pinnacle\n\nPublic child-development questions and answers from Pinnacle Blooms Network, operated by Bharath Healthcare Laboratories Private Limited.\n\nHome: '+ASK+'\nBrowse: '+ASK+'/lens\nSources and retrieval: '+ASK+'/dataset\nSitemap: '+ASK+'/sitemap.xml\nMCP: https://ask-mcp.pinnacleblooms.org/mcp\n\nAnswer canonicals support .md and .json public representations. Use page-level robots, publication status, sources and dates. Public information is not individual diagnosis. This reading aid is not an AI submission or an endorsement.\n';
export default {async fetch(request:Request,env:any,ctx:ExecutionContext){
 const url=new URL(request.url);
 if(url.hostname==='ask.pinnacleblooms.org'){url.hostname='pinnacleblooms.org';url.pathname='/ask'+(url.pathname==='/'?'':url.pathname.startsWith('/ask')?url.pathname.slice(4):url.pathname);return Response.redirect(url.href,308);}
 if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{Allow:'GET, HEAD'}});
 if(url.pathname.startsWith('/ask/_assets/')||url.pathname.startsWith('/ask/_image'))return handle(request,env,ctx);
 const path=url.pathname.replace(/\/+$/,'');
 if(path!==url.pathname&&path.startsWith('/ask')){url.pathname=path;return Response.redirect(url.href,308);}
 if(path==='/ask/robots.txt')return new Response('User-agent: *\nAllow: /ask\nDisallow: /ask/search\nDisallow: /ask/te/search\nSitemap: '+ASK+'/sitemap.xml\n', {headers:textHeaders});
 if(['/ask/llms.txt','/ask/llms-full.txt'].includes(path))return new Response(guide+(path.endsWith('full.txt')?'\n## Route guide\n/ask/{answer-slug}: public answer, sources, related questions, text and JSON.\n/ask/{dimension}: topic directory.\n/ask/lens/{kind}/{value}: a real published collection.\n/ask/search?q=: private, non-indexable search.\n/ask/te: Telugu entry; published translations retain their own slug and canonical.\nUnknown routes return 404. Temporary content-service failures return 503.\n':''),{headers:textHeaders});
 try{
 if(path==='/ask/sitemap.xml'||/^\/ask\/sitemap-\d+\.xml$/.test(path)){
 const n=Number(path.match(/sitemap-(\d+)/)?.[1]||1);const data=await rpc(env,'ask_portal_sitemap',{p_page:n});
 const body=path.endsWith('/sitemap.xml')?'<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+Array.from({length:Math.ceil(data.total/10000)},(_,i)=>'<sitemap><loc>'+ASK+'/sitemap-'+(i+1)+'.xml</loc></sitemap>').join('')+'<sitemap><loc>'+ASK+'/sitemap-navigation.xml</loc></sitemap><sitemap><loc>'+ASK+'/sitemap-topics.xml</loc></sitemap></sitemapindex>':'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+data.items.map((a:any)=>'<url><loc>'+ASK+'/'+xml(a.slug)+'</loc>'+(a.modified?'<lastmod>'+xml(a.modified.split('T')[0])+'</lastmod>':'')+'</url>').join('')+'</urlset>';
 return new Response(body,{headers:{...textHeaders,'content-type':'application/xml; charset=utf-8'}});
 }
 if(path==='/ask/sitemap-topics.xml'){const items=await rpc(env,'ask_indexing_enabled')?await rpc(env,'ask_portal_topic_sitemap'):[];return new Response('<?xml version='+String.fromCharCode(34)+'1.0'+String.fromCharCode(34)+' encoding='+String.fromCharCode(34)+'UTF-8'+String.fromCharCode(34)+'?><urlset xmlns='+String.fromCharCode(34)+'http://www.sitemaps.org/schemas/sitemap/0.9'+String.fromCharCode(34)+'>'+items.map((a:any)=>'<url><loc>'+ASK+'/'+xml(a.slug)+'</loc></url>').join('')+'</urlset>',{headers:{...textHeaders,'content-type':'application/xml; charset=utf-8'}});}
 if(path==='/ask/sitemap-navigation.xml'){
 const enabled=await rpc(env,'ask_indexing_enabled');
 const paths=enabled?['','/lens','/conditions','/behaviours','/skills','/abilities','/domains','/ages','/life-skills','/assessments','/readiness','/therapies','/techniques','/people','/standards-icf','/standards-icd','/dataset','/what-is-pinnacle-blooms-network','/what-is-pinnacle-blooms-network-and-how-does-it-help-my-child']:[];
 return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(p=>'<url><loc>'+ASK+p+'</loc></url>').join('')+'</urlset>',{headers:{...textHeaders,'content-type':'application/xml; charset=utf-8'}});
 }
 const exportMatch=path.match(/^\/ask\/([\w-]+)\.(md|json)$/);
 if(exportMatch){const slug=exportMatch[1];const a=institution(slug)||await answer(env,slug,slug.endsWith('-te')?'te':'en');if(!a)return new Response('Answer not found',{status:404,headers:{...textHeaders,'x-robots-tag':'noindex'}});
 const body=exportMatch[2]==='json'?JSON.stringify(a):'# '+a.title+'\n\nCanonical: '+a.canonical+'\nPublisher: Pinnacle Blooms Network / Bharath Healthcare Laboratories Private Limited\n\n'+(a.summary||'')+'\n\n'+a.answer_md+'\n\n## Sources\n'+(a.authority_links||[]).map((s:any)=>'- '+(s.label||s.title||'Source')+': '+s.url).join('\n');
 return new Response(body,{headers:{...textHeaders,'content-type':exportMatch[2]==='json'?'application/json; charset=utf-8':'text/markdown; charset=utf-8','x-robots-tag':'noindex, follow','link':'<'+a.canonical+'>; rel="canonical"'}});
 }
 if(/^\/ask\/(?:og\/|f\/)/.test(path)||/\.(svg|png|woff2|js|xsl)$/.test(path))return legacy.fetch(request,env,ctx);
 const cacheable=!/^\/ask\/(?:te\/)?search$/.test(path)&&request.method==='GET'&&[...url.searchParams].every(([key,value])=>key==='page'&&/^[1-9][0-9]{0,3}$/.test(value));
 const cacheURL=new URL(url);const page=cacheURL.searchParams.get('page');cacheURL.search='';if(page)cacheURL.searchParams.set('page',page);cacheURL.searchParams.set('__ask_build','astro-20261003-v4');
 const cacheKey=new Request(cacheURL);const cache=(caches as any).default;
 if(cacheable){const saved=await cache.match(cacheKey);if(saved)return saved;}
 const response=await handle(request,env,ctx);const headers=new Headers(response.headers);headers.set('x-pinnacle-ask-release','astro-20261003');headers.set('x-content-type-options','nosniff');headers.set('referrer-policy','no-referrer');
 const body=await response.text();
 if(response.status===200&&headers.get('content-type')?.includes('text/html')&&!body.includes('</html>'))throw new Error('Incomplete HTML render');
 const output=new Response(request.method==='HEAD'?null:body,{status:response.status,headers});
 if(cacheable&&response.status===200&&!headers.has('set-cookie')&&/^public,/.test(headers.get('cache-control')||''))ctx.waitUntil(cache.put(cacheKey,output.clone()));
 return output;
 }catch(error){console.error('Ask request failed',error instanceof Error?error.message:'error');return new Response('Ask is temporarily unavailable. Please try again or call 9100 181 181.',{status:503,headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store','retry-after':'60','x-robots-tag':'noindex'}})}
}};
