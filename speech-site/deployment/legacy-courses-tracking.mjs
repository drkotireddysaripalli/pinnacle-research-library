// The observed origin variant carries a d.pinnacleblooms.org canonical. Correct
// that exact public identity before invoking the existing reviewed GTM handoff.
export async function repairCourseTracking(request,response,repair){
 const u=new URL(request.url);
 if(u.origin!=='https://www.pinnacleblooms.org'||u.pathname!=='/certified-courses'||request.method!=='GET'||request.headers.has('authorization')||request.headers.has('range')||response.status!==200||response.headers.has('set-cookie')||!/text\/html/i.test(response.headers.get('content-type')||'')||/private|no-transform/i.test(response.headers.get('cache-control')||''))return response;
 const html=await response.clone().text();if(html.length>2097152)return response;
 const pattern=/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=(["'])https:\/\/d\.pinnacleblooms\.org\/certified-courses\1[^>]*>/gi;
 if([...html.matchAll(pattern)].length!==1)return response;
 const fixed=html.replace(pattern,tag=>tag.replace('https://d.pinnacleblooms.org/certified-courses','https://www.pinnacleblooms.org/certified-courses'));
 const headers=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified','content-md5','digest'])headers.delete(k);
 headers.set('x-pinnacle-courses-tracking','canonical-and-existing-collector-20261022');
 return repair(request,new Response(fixed,{status:response.status,statusText:response.statusText,headers}),{preserveGtm:true});
}
