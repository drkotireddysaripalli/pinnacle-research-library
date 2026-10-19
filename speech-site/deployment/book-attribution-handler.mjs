import {attributionScripts} from './book-attribution-assets.mjs';
import {publicPolicyAssets,publicPolicyRoutes} from './public-policy-assets.mjs';
import {publicPolicyRuntimeAssets} from './public-policy-runtime-assets.mjs';
const acceptsMarkdown=value=>value.split(',').some(entry=>{const [type,...parameters]=entry.trim().split(';');if(type.toLowerCase()!=='text/markdown')return false;const quality=parameters.map(parameter=>parameter.trim()).find(parameter=>parameter.toLowerCase().startsWith('q='));return quality?Number(quality.slice(2))>0:true;});
const bytes=entry=>Uint8Array.from(atob(entry.body),character=>character.charCodeAt(0));
const policyCsp="default-src 'self'; img-src 'self' data: https://i.ytimg.com https://obs.aseasky.link; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://static.cloudflareinsights.com https://ob.aseasky.link https://obs.aseasky.link; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://obs.aseasky.link; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests";
export function serveBookAttribution(request){
 const u=new URL(request.url),route=publicPolicyRoutes[u.pathname];
 const policyKey=route?(acceptsMarkdown(request.headers.get('accept')||'')?route.markdown:route.html):u.pathname;
 const policyEntry=publicPolicyAssets[policyKey]||publicPolicyRuntimeAssets[policyKey],scriptEntry=attributionScripts[u.pathname],entry=policyEntry||scriptEntry;
 if(u.hostname!=='www.pinnacleblooms.org'||!entry)return null;
 const privateResponse=request.headers.has('cookie')||request.headers.has('authorization');
 const policy=!!policyEntry,kind=policyEntry?.kind;
 const headers=new Headers({'content-type':policyEntry?.contentType||'text/javascript; charset=utf-8','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','cache-control':privateResponse?'private, no-store':kind==='immutable'?'public, max-age=31536000, immutable':(kind==='html'||kind==='markdown')?'public, max-age=0, must-revalidate':'public, max-age=60, must-revalidate','etag':'"'+entry.sha256+'"',[policy?'x-pinnacle-policy-overlay':'x-pinnacle-script-release']:policy?'automatic-before-choice-20261019':'book-attribution-20261004'});
 if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{...Object.fromEntries(headers),allow:'GET, HEAD'}});
 if(!privateResponse&&request.headers.get('if-none-match')===headers.get('etag'))return new Response(null,{status:304,headers});
 if(policy){
  if(route||kind==='html'||kind==='markdown')headers.set('content-signal','search=yes, ai-input=yes');
  if(route)headers.set('vary','Accept');
  const canonical=route?u.pathname:policyEntry.canonical;
  if(canonical)headers.set('link','<https://www.pinnacleblooms.org'+canonical+'>; rel="canonical"');
  if(kind==='html'){headers.set('x-robots-tag','index, follow, max-image-preview:large');headers.set('content-security-policy',policyCsp);}
 }
 return new Response(request.method==='HEAD'?null:(policy?bytes(entry):entry.text),{headers});
}
