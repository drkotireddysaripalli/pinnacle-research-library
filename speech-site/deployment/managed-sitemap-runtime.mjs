import {handleManagedSitemap,HOSTS} from '../../tooling/sitemap-manager/asset-handler.mjs';

export function withManagedSitemaps(original,config){
 return {...original,async fetch(request,env,ctx){
  const url=new URL(request.url);
  if(HOSTS.has(url.hostname)&&url.pathname==='/site-map'){
   const target=new URL(request.url);target.pathname='/site-map/';target.search='';
   return Response.redirect(target,308);
  }
  const managed=await handleManagedSitemap(request,env);
  if(managed){
   if(managed.status===200&&managed.headers.get('content-type')?.includes('text/html')){
    const h=new Headers(managed.headers),page=config.html[url.hostname+url.pathname.replace(/\/$/,'/index.html')];
    if(page?.csp)h.set('Content-Security-Policy',page.csp);
    h.set('Referrer-Policy','strict-origin-when-cross-origin');h.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');
    h.set('Link','<'+url.origin+url.pathname.replace(/\/$/,'/index.html')+'>; rel="canonical"');
    return new Response(managed.body,{status:managed.status,headers:h});
   }return managed;
  }
  if(HOSTS.has(url.hostname)&&['/robots.txt','/llms.txt'].includes(url.pathname)&&!url.search&&['GET','HEAD'].includes(request.method)){
   let base=config.roots[url.hostname+url.pathname]?.base||'';
   if(url.hostname==='www.pinnacleblooms.org'){
    const response=await original.fetch(request,env,ctx);
    if(response.status===200&&response.headers.get('content-type')?.includes('text/plain'))base=request.method==='HEAD'?base:await response.text();
   }
   const addition=config.roots[url.hostname+url.pathname]?.addition||'';
   const body=addition.trim()&&!base.includes(addition.trim())?base.trimEnd()+'\n\n'+addition.trim()+'\n':base;
   return new Response(request.method==='HEAD'?null:body,{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=300','X-Content-Type-Options':'nosniff'}});
  }
  const response=await original.fetch(request,env,ctx);
  // Only public static files may be loaded by the other owned sitemap hosts.
  // No API, identity, receipt, or private-response CORS policy changes.
  const origin=request.headers.get('Origin');let allowed=false;
  try{const u=new URL(origin);allowed=u.protocol==='https:'&&HOSTS.has(u.hostname)&&!u.port;}catch{}
  if(allowed&&['GET','HEAD'].includes(request.method)&&/^(?:\/pinnacle-pages-(?:fonts|assets|scripts|styles)\/|\/verify\/fonts\/)/.test(url.pathname)){
   const headers=new Headers(response.headers);headers.set('Access-Control-Allow-Origin',origin);headers.append('Vary','Origin');
   return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
  }
  return response;
 }};
}
