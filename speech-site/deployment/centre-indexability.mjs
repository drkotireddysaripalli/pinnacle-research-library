// Correct the preview head only on existing maintained public pages that
// already declare index/follow in the receiving handler's HTTP header. This
// changes neither operating status, advertising holds nor unknown profiles.
import policy from '../../tooling/sitemap-manager/discovery-policy.json' with {type:'json'};
import {centreSearchSnippet,centreSearchSnippetExperiment} from '../src/data/centre-search-snippets.mjs';
export const publishedCentreIndexabilityPaths=new Set(policy.indexable_centre_paths);
const held=new Set(policy.held_centre_paths||[]);
export function repairCentreIndexability(request,response){
 const u=new URL(request.url),robots=response.headers.get('x-robots-tag')||'';
 if(u.origin!=='https://www.pinnacleblooms.org'||!['GET','HEAD'].includes(request.method)||request.headers.has('authorization')||request.headers.has('range')||response.status!==200||!/^text\/html\b/i.test(response.headers.get('content-type')||'')||response.headers.has('set-cookie')||/no-transform/i.test(response.headers.get('cache-control')||'')||/search\s*=\s*no/i.test(response.headers.get('content-signal')||'')||request.headers.has('x-pinnacle-qa'))return response;
 if(held.has(u.pathname)){const h=new Headers(response.headers);h.set('x-robots-tag','noindex, follow');return new Response(response.body,{status:response.status,statusText:response.statusText,headers:h});}
 if(!publishedCentreIndexabilityPaths.has(u.pathname)||!/\bindex\b/i.test(robots)||/\bnoindex\b/i.test(robots))return response;
 const h=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified','content-md5','digest'])h.delete(k);h.set('x-pinnacle-centre-indexability','published-source-parity-20261015');
 if(request.method==='HEAD')return new Response(null,{status:response.status,statusText:response.statusText,headers:h});
 const rewriter=new HTMLRewriter().on('head meta[name="robots"]',{element(e){if(/^noindex\s*,\s*nofollow$/i.test(e.getAttribute('content')||''))e.setAttribute('content','index, follow, max-image-preview:large');}}).on('.preview-note',{element(e){e.remove();}});
 const snippet=centreSearchSnippet(u.pathname);
 if(snippet){
  h.set('x-pinnacle-centre-snippet',centreSearchSnippetExperiment);
  rewriter.on('head title',{element(e){e.setInnerContent(snippet.title);}});
  for(const selector of ['meta[name="description"]','meta[property="og:description"]','meta[name="twitter:description"]'])rewriter.on('head '+selector,{element(e){e.setAttribute('content',snippet.description);}});
  for(const selector of ['meta[property="og:title"]','meta[name="twitter:title"]'])rewriter.on('head '+selector,{element(e){e.setAttribute('content',snippet.title);}});
 }
 return rewriter.transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers:h}));
}
