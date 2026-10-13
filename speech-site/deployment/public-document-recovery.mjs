// Exact public documents migrated from failing legacy templates. No accounts,
// clinical records, assessment execution, payments or intake endpoints owned here.
export function withPublicDocumentRecovery(original,config){
 return {...original,async fetch(request,env,ctx){
  const u=new URL(request.url);
  if(u.pathname.startsWith('/_public_recovery/'))return new Response('Not found',{status:404,headers:{'cache-control':'no-store'}});
  const enabled=u.origin==='https://www.pinnacleblooms.org'&&['GET','HEAD'].includes(request.method)&&!request.headers.has('authorization')&&!request.headers.has('range');
  if(enabled&&config.assets.includes(u.pathname))return env.ASSETS.fetch(request);
  const page=enabled&&config.pages[u.pathname];
  if(!page)return original.fetch(request,env,ctx);
  if(!env.ASSETS)return new Response('Public document temporarily unavailable',{status:503,headers:{'cache-control':'no-store'}});
  const target=new URL('/_public_recovery'+u.pathname+'.html',u.origin),r=await env.ASSETS.fetch(new Request(target,{method:'GET'}));
  if(r.status!==200||!r.headers.get('content-type')?.includes('text/html'))return new Response('Public document temporarily unavailable',{status:503,headers:{'cache-control':'no-store'}});
  const headers=new Headers(r.headers);headers.delete('content-length');headers.set('content-type','text/html; charset=utf-8');headers.set('content-security-policy',page.csp);headers.set('x-robots-tag',page.robots);headers.set('cache-control','public, max-age=120');headers.set('link','<'+u.origin+u.pathname+'>; rel="canonical"');headers.set('x-content-type-options','nosniff');headers.set('referrer-policy','strict-origin-when-cross-origin');headers.set('x-pinnacle-public-recovery','legacy-null-template-20261013');
  if(request.method==='HEAD'){await r.body?.cancel();return new Response(null,{status:200,headers});}
  return new Response(r.body,{status:200,headers});
 }};
}
