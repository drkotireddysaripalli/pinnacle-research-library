import{currentStaffPaths}from'./legacy-social-metadata/staff-records.mjs';
const origin='https://www.pinnacleblooms.org';
export function staffCanonicalIdentity(request){const u=new URL(request.url),id=u.pathname.match(/^\/staff\/[^/]+\/([1-9][0-9]*)\/?$/)?.[1],p=id&&currentStaffPaths[id];return u.origin===origin&&p===u.pathname?origin+p:null;}
export function repairStaffCanonical(request,response){
 const target=staffCanonicalIdentity(request);if(!target||request.method!=='GET'||request.headers.has('authorization')||request.headers.has('cookie')||request.headers.has('range')||response.status!==200||response.headers.has('set-cookie')||/no-transform/i.test(response.headers.get('cache-control')||'')||!/^text\/html\b/i.test(response.headers.get('content-type')||''))return response;
 const eligible=value=>{try{const u=new URL(value);return u.origin===origin&&!u.search&&!u.hash&&u.href.toLowerCase()===target.toLowerCase();}catch{return false;}};
 const h=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified','content-md5','digest'])h.delete(k);h.set('x-pinnacle-staff-canonical','published-path-20261012');
 return new HTMLRewriter().on('head link[rel="canonical"]',{element(e){if(eligible(e.getAttribute('href')))e.setAttribute('href',target);}}).on('head meta[property="og:url"]',{element(e){if(eligible(e.getAttribute('content')))e.setAttribute('content',target);}}).transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers:h}));
}
export function createStaffCanonicalWrapper(original){return {...original,async fetch(request,env,ctx){return repairStaffCanonical(request,await original.fetch(request,env,ctx));}};}
