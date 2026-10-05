// Common navigation destination, matching src/data/portal-navigation.json.
// Apply to already-released HTML without rebuilding unrelated page bodies.
export function repairSharedNavigation(request,response){
 if(request.method!=='GET'||request.headers.has('authorization')||request.headers.has('range')||
 response.status!==200||!response.headers.get('content-type')?.includes('text/html')||
 response.headers.has('set-cookie')||/private|no-store|no-transform/i.test(response.headers.get('cache-control')||''))return response;
 const headers=new Headers(response.headers);
 for(const key of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest'])headers.delete(key);
 headers.set('x-pinnacle-navigation','canonical-ask-20261005');
 return new HTMLRewriter().on('a[href="https://pinnacleblooms.org/ask/"]',{element(el){el.setAttribute('href','https://pinnacleblooms.org/ask')}})
  .transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));
}
