// One shared transport correction for existing Materials HTML. Preserve the
// published descriptions; a missing photograph is explicitly unavailable.
const placeholder='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="#f3f4f6"/><text x="200" y="125" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#4b5563">Image unavailable</text></svg>');
export function materialImageTarget(value){
 if(typeof value!=='string'||!/^https?:\/\//i.test(value))return null;
 let u;try{u=new URL(value);}catch{return null;}
 if(!['pinnacleblooms.org','www.pinnacleblooms.org'].includes(u.hostname)||u.username||u.password||u.port||u.search||u.hash||!/^\/Assets\/Materials\/\d+\.(?:jpg|jpeg|png|webp)$/i.test(u.pathname))return null;
 if(u.pathname==='/Assets/Materials/309.jpg')return{unavailable:true,url:placeholder};
 return{unavailable:false,url:'https://www.pinnacleblooms.org'+u.pathname};
}
export function repairMaterialsMedia(request,response){
 const url=new URL(request.url);
 if(request.method!=='GET'||url.origin!=='https://materials.pinnacleblooms.org'||request.headers.has('authorization')||request.headers.has('range')||response.status!==200||!/^text\/html(?:\s*;|$)/i.test(response.headers.get('content-type')||'')||/no-transform/i.test(response.headers.get('cache-control')||''))return response;
 const rewriter=new HTMLRewriter().on('img',{element(el){
  const source=materialImageTarget(el.getAttribute('src'));
  if(source){el.setAttribute('src',source.url);if(source.unavailable){el.setAttribute('alt',((el.getAttribute('alt')||'Material').trim()+' — image unavailable'));el.setAttribute('data-pinnacle-media-state','unavailable');for(const attr of ['srcset','data-src','data-srcset'])el.removeAttribute(attr);return;}}
  for(const attr of ['data-src','srcset','data-srcset']){const value=el.getAttribute(attr);if(!value)continue;const changed=value.replace(/https?:\/\/[^\s,]+/g,v=>materialImageTarget(v)?.url||v);if(changed!==value)el.setAttribute(attr,changed);}
 }}).on('source',{element(el){const value=el.getAttribute('srcset');if(value)el.setAttribute('srcset',value.replace(/https?:\/\/[^\s,]+/g,v=>materialImageTarget(v)?.url||v));}});
 const headers=new Headers(response.headers);for(const name of ['content-length','content-encoding','etag','content-md5','digest'])headers.delete(name);
 headers.set('x-pinnacle-media-repair','materials-https-20261008');
 return rewriter.transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));
}
