import {bookPolicyAssets} from './merchant-policy-content.mjs';
export const bookPolicyPath='/books/refund-and-delivery-policy';
const commercePath=p=>p==='/shop'||p.startsWith('/shop/')||p==='/books'||p.startsWith('/books/');
export function serveBookOrderPolicy(request){
  const url=new URL(request.url),entry=bookPolicyAssets[url.pathname];
  if(url.hostname!=='www.pinnacleblooms.org'||!entry)return null;
  const headers=new Headers({'content-type':entry.type,'x-content-type-options':'nosniff','cache-control':request.headers.has('cookie')||request.headers.has('authorization')?'private, no-store':'public, max-age=60, must-revalidate','etag':'"'+entry.sha256+'"','x-pinnacle-book-policy':'20261008'});
  if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{...Object.fromEntries(headers),allow:'GET, HEAD'}});
  if(!request.headers.has('cookie')&&!request.headers.has('authorization')&&request.headers.get('if-none-match')===headers.get('etag'))return new Response(null,{status:304,headers});
  return new Response(request.method==='HEAD'?null:Uint8Array.from(atob(entry.body),c=>c.charCodeAt(0)),{headers});
}
// Only the exact optional managed assessment Service loses its commerce Offer.
// Book Product/Offer nodes, unknown identities and visible assessment copy survive.
export function repairAssessmentSchema(text,canonical){
  // Pass through unsafe numeric tokens rather than round an unrelated identifier.
  const tokens=text.replace(/"(?:\\.|[^"\\])*"/g,'""').match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi)||[];
  if(tokens.some(token=>!Number.isFinite(Number(token))||(Number.isInteger(Number(token))&&!Number.isSafeInteger(Number(token)))))return text;
  let data;try{data=JSON.parse(text);}catch{return text;}
  if(!data||typeof data!=='object')return text;
  let changed=false;
  for(const node of Array.isArray(data['@graph'])?data['@graph']:[]){
    if(!node||typeof node!=='object'||node['@type']!=='Service'||node['@id']!==canonical+'#assessment'||node.brand?.['@id']!=='https://www.pinnacleblooms.org/verify/#pinnacle-brand'||node.offers?.['@type']!=='Offer'||node.offers?.itemOffered?.['@id']!==node['@id'])continue;
    if(typeof node.offers.url==='string')node.availableChannel={'@type':'ServiceChannel',serviceUrl:node.offers.url};
    delete node.offers;changed=true;
  }
  return changed?JSON.stringify(data).replace(/</g,'\\u003c'):text;
}
export function repairMerchantDiscovery(request,response){
  const u=new URL(request.url);
  if(u.hostname!=='www.pinnacleblooms.org'||request.method!=='GET'||response.status!==200||!response.headers.get('content-type')?.includes('text/html')||request.headers.has('authorization')||(!commercePath(u.pathname)&&(response.headers.has('set-cookie')||/private|no-store/i.test(response.headers.get('cache-control')||''))))return response;
  const headers=new Headers(response.headers);headers.delete('etag');headers.delete('last-modified');headers.delete('content-length');headers.set('x-pinnacle-merchant-source','20261008');
  response=new Response(response.body,{status:response.status,statusText:response.statusText,headers});
  if(commercePath(u.pathname)){
    return new HTMLRewriter().on('main a[href="/refund-policy"]',{element(e){e.setAttribute('href',bookPolicyPath);}}).transform(response);
  }
  let buffer='';
  return new HTMLRewriter().on('script[type="application/ld+json"]',{element(){buffer='';},text(t){buffer+=t.text;if(t.lastInTextNode){t.replace(repairAssessmentSchema(buffer,u.origin+u.pathname),{html:true});buffer='';}else t.remove();}}).transform(response);
}
