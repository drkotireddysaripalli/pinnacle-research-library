import {materialsPaths} from './materials-discovery-paths.mjs';
const origin='https://materials.pinnacleblooms.org',portal='https://www.pinnacleblooms.org';
const portalPaths=new Set(['/best-aba-therapy-center-india-proven-improvement-rate','/best-occupational-therapy-center-india-proven-improvement-rate','/age-restriction-policy','/endorsement-and-testimonial','/privacy-policy','/refund-policy','/terms-of-use']);
export function materialsDiscovery(request){
 const u=new URL(request.url);if(u.origin!==origin||!['GET','HEAD'].includes(request.method)||request.headers.has('authorization')||request.headers.has('range'))return null;
 let body,type;if(u.pathname==='/robots.txt'){type='text/plain';body='User-agent: *\nAllow: /\nDisallow: /*.desktop.html\nDisallow: /*.mobile.html\nSitemap: '+origin+'/sitemap.xml\n';}
 else if(u.pathname==='/sitemap.xml'){type='application/xml';body='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+materialsPaths.map(p=>'<url><loc>'+origin+p+'</loc></url>').join('')+'</urlset>';}
 else return null;return new Response(request.method==='HEAD'?null:body,{headers:{'content-type':type+'; charset=utf-8','cache-control':'public, max-age=300','x-content-type-options':'nosniff','x-pinnacle-materials-discovery':'20261012'}});
}
export function materialHref(value){
 if(value==='https://pinnacleblooms.org /speech-therapy#Cost-section')return portal+'/top-speech-therapy-center-india-proven-improvement-rate';
 let u;try{u=new URL(value,origin)}catch{return value;}if(u.origin===origin&&portalPaths.has(u.pathname))return portal+u.pathname+u.search+u.hash;return value;
}
export function repairMaterialsDiscovery(request,response){
 const u=new URL(request.url);if(u.origin!==origin||request.method!=='GET'||request.headers.has('authorization')||request.headers.has('range')||response.status!==200||!/^text\/html\b/i.test(response.headers.get('content-type')||''))return response;
 const h=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','content-md5','digest'])h.delete(k);h.set('x-pinnacle-materials-discovery','20261012');
 return new HTMLRewriter().on('a[href]',{element(e){const old=e.getAttribute('href'),next=materialHref(old);if(old!==next)e.setAttribute('href',next);}}).on('img',{element(e){let image;try{image=new URL(e.getAttribute('src')||'',origin)}catch{return;}if(['pinnacleblooms.org','www.pinnacleblooms.org', 'materials.pinnacleblooms.org'].includes(image.hostname)&&image.pathname==='/Assets/Materials/2484.jpg'){e.setAttribute('src',origin+image.pathname);for(const k of ['srcset','data-src','data-srcset'])e.removeAttribute(k);}}}).transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers:h}));
}
export function createMaterialsDiscoveryWrapper(original){return {...original,async fetch(request,env,ctx){return materialsDiscovery(request)||repairMaterialsDiscovery(request,await original.fetch(request,env,ctx));}};}
