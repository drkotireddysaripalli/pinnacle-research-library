import {assets,rewrites} from './shared-assets-repair-assets.mjs';
const origin='https://www.pinnacleblooms.org';
export function serveSharedAssetRepair(request){
 const u=new URL(request.url);if(u.origin!==origin)return null;const asset=assets[u.pathname];if(!asset)return null;
 if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{allow:'GET, HEAD'}});
 const headers={'content-type':'text/javascript; charset=utf-8','cache-control':'public, max-age=31536000, immutable','x-content-type-options':'nosniff','etag':'"'+asset.sha256+'"','x-pinnacle-shared-asset':asset.sha256};
 if(request.headers.get('if-none-match')===headers.etag)return new Response(null,{status:304,headers});
 return new Response(request.method==='HEAD'?null:asset.body,{headers});
}
export function repairSharedAssetReferences(request,response){
 const u=new URL(request.url);if(u.origin!==origin||request.method!=='GET'||response.status!==200||!/^text\/html\b/i.test(response.headers.get('content-type')||'')||response.headers.has('x-pinnacle-shared-assets')||request.headers.has('authorization')||request.headers.has('range')||/\bno-transform\b/i.test(request.headers.get('cache-control')||''))return response;
 if(/\/(?:api|auth|login|logout|account|dashboard|payonline|checkout|cart|invoice|report|reports|children|private)(?:\/|$)/i.test(u.pathname))return response;
 const replace=(attribute)=>({element(e){const value=e.getAttribute(attribute);if(!value)return;let source;try{source=new URL(value,u.origin)}catch{return}if(source.origin!==origin)return;const target=rewrites[source.pathname+source.search];if(!target)return;e.setAttribute(attribute,target);if(e.hasAttribute('integrity'))e.setAttribute('integrity',assets[target].integrity);}});
 const headers=new Headers(response.headers);for(const key of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest','accept-ranges'])headers.delete(key);headers.set('x-pinnacle-shared-assets','20261012');
 // Preserve the existing cache/consent/CSP/cookie rules; only exact known script
 // references and matching preload hints change. Old resources remain intact.
 return new HTMLRewriter().on('script[src]',replace('src')).on('link[rel="modulepreload"][href]',replace('href')).on('link[rel="preload"][as="script"][href]',replace('href')).transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));
}
