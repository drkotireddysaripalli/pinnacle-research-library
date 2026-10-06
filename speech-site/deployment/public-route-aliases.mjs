// Exact compatibility alias for the published capitalised Ask entry.
// Asset names, answer slugs, auth paths, request bodies and queries are not folded.
export function publicRouteAlias(request) {
 const u=new URL(request.url);
 if(!['GET','HEAD'].includes(request.method)||!['www.pinnacleblooms.org','pinnacleblooms.org'].includes(u.hostname)||!['/Ask','/Ask/'].includes(u.pathname)||request.headers.has('authorization')||request.headers.has('range'))return null;
 u.protocol='https:';u.hostname='pinnacleblooms.org';u.pathname='/ask';
 return new Response(null,{status:301,headers:{location:u.href,'cache-control':'public,max-age=300','x-pinnacle-route-repair':'ask-entry-20261006'}});
}
