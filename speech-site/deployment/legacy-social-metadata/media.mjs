// Exact missing public image sources verified 6 October 2026; no guessed portraits.
export const BRAND_IMAGE='https://www.pinnacleblooms.org/pinnacle-pages-assets/pinnacle-blooms-network-lockup.CUnZranx_Z2nTFgn.webp';
const missing=new Set(["/Assets/Materials/20707165343.jpg", "/Images/ProfileImages/12798111602.jpg", "/Images/ProfileImages/20552642664.jpg", "/Images/ProfileImages/20707155230.jpg", "/Images/ProfileImages/20708422583.jpg", "/Images/ProfileImages/20708623831.jpg", "/Images/ProfileImages/20708666496.jpg", "/Images/ProfileImages/20709822519.jpg", "/Images/ProfileImages/20710414688.jpg", "/Images/ProfileImages/3062523339.jpg", "/Images/ProfileImages/3062523460.jpg", "/Images/ProfileImages/3062523628.jpg", "/Images/ProfileImages/3062523633.jpg", "/Images/ProfileImages/3062523640.jpg", "/Images/ProfileImages/3062523874.jpg", "/Images/ProfileImages/3062525279.jpg", "/Images/ProfileImages/3062526597.jpg", "/Images/ProfileImages/3159708782.jpg", "/Images/ProfileImages/3178670904.jpg", "/Images/ProfileImages/3549649944.jpg"]);
// Freshly verified 8 October: this image route returns a 233 KB HTML fallback.
// Omit that unusable article image rather than relabel a logo as a medicine ball.
missing.add('/Assets/Materials/318.jpg');
// Remaining exact 9 October audit image failures, publicly rechecked as 404.
for(const p of ['/Assets/AbilityScore_Universal_0-1000_Child%20Development_Metric.jpg','/Assets/Materials/20707167545.jpg','/Assets/Materials/962.jpg','/Assets/OG/495.jpg','/images/therapysphere-room.jpg'])missing.add(p);
export function isMissingMedia(value){try{const u=new URL(value,'https://www.pinnacleblooms.org');return ['https://www.pinnacleblooms.org','https://pinnacleblooms.org'].includes(u.origin)&&missing.has(u.pathname);}catch{return false;}}
export function repairKnownBrokenMedia(response){
 const headers=new Headers(response.headers);for(const key of ['content-length','content-encoding','etag','last-modified','content-md5','digest'])headers.delete(key);
 headers.set('x-pinnacle-known-media','verified-missing-20261006');
 return new HTMLRewriter().on('img',{element(el){if(!isMissingMedia(el.getAttribute('src')))return;if(new URL(el.getAttribute('src'),'https://www.pinnacleblooms.org').pathname==='/Assets/Materials/318.jpg'){el.remove();return;}el.setAttribute('src',BRAND_IMAGE);el.setAttribute('alt','Pinnacle Blooms Network logo');el.setAttribute('data-pinnacle-brand-fallback','true');el.setAttribute('style',(el.getAttribute('style')||'')+';object-fit:contain;background:#fff;padding:12px;box-sizing:border-box;');for(const name of ['srcset','data-src','data-srcset'])el.removeAttribute(name);}})
 .on('meta',{element(el){if(['og:image','twitter:image'].includes(el.getAttribute('property')||el.getAttribute('name'))&&isMissingMedia(el.getAttribute('content')))el.setAttribute('content',BRAND_IMAGE);}})
 .transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));
}
