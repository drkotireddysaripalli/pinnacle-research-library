// Guarded repair of the currently deployed public SPA. No API, authentication,
// report, payment or customer record response is transformed.
const MAIN='/static/js/main.c607521b.js',LOGIN='/static/js/3705.d6f7d9c1.chunk.js';
const hashes=new Map([[MAIN,'803443876acd536f39122f89f38fb758249dd6e9c9c04a69f1263493ecf8e4af'],[LOGIN,'859b21e830d42332e4a909d713e19b5e25b205dea1192cc8037d09c627de67a4']]);
const sha=async text=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(b=>b.toString(16).padStart(2,'0')).join('');
export function repairEmitterBundle(text){
 const start=text.indexOf('function Do('),second=text.indexOf('function bo(',start),end=text.indexOf('function ',second+12);
 if(start<0||second<start||end<second||!text.slice(start,second).includes('g.Ay.event({category:e,action:n,label:t})')||!text.slice(second,end).includes('token:'))throw Error('Current telemetry helper fingerprint changed');
 // Both original diagnostic helpers return undefined. Never pass application
 // names/messages/URLs/tokens to a measurement or third-party error collector.
 return text.slice(0,start)+'function Do(e,t,n,r,i){}function bo(e,t,n,r){}'+text.slice(end);
}
export function repairLoginBundle(text){
 const needle='src:"https://www.pinnacleblooms.org/images/b/sanjeevani-2.jpg",className:"img-responsive preLoad loaded",title:""';
 if(!text.includes(needle))throw Error('Current sign-in hero fingerprint changed');
 return text.replace(needle,needle+',width:600,height:500,fetchPriority:"high",style:{height:"auto"}');
}
export async function handle(request,originFetch=fetch){
 const u=new URL(request.url);if(u.origin!=='https://mirracle.pinnacleblooms.org'||!['GET','HEAD'].includes(request.method))return originFetch(request);
 const asset=u.pathname===MAIN||u.pathname===LOGIN;const shell=!asset&&!/^\/(?:api\/|ws|static\/|cdn-cgi\/)/.test(u.pathname);
 if(!shell&&!asset)return originFetch(request);
 const upstream=await originFetch(request);if(upstream.status!==200||!upstream.body||upstream.headers.has('set-cookie'))return upstream;
 const type=upstream.headers.get('content-type')||'';if(shell&&!type.includes('text/html'))return upstream;
 const text=await upstream.text();let output=text;const h=new Headers(upstream.headers);
 if(asset){if(await sha(text)!==hashes.get(u.pathname))return new Response(text,{status:200,headers:h});output=u.pathname===MAIN?repairEmitterBundle(text):repairLoginBundle(text);h.set('x-pinnacle-app-privacy','current-helper-20261007');}
 else {
  if(!text.includes(MAIN)||!text.includes('/static/css/main.af85e138.css'))return new Response(text,{status:200,headers:h});
  const base=new Response(text,{headers:h});output=await new HTMLRewriter().on('script',{element(e){const src=e.getAttribute('src')||'';if(/^https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js(?:\/|$)/.test(src))e.remove();else if(src===MAIN)e.setAttribute('src',MAIN+'?v=privacy-20261007');}}).on('head',{element(e){if(u.pathname==='/'||u.pathname==='/epass')e.append('<link rel="preconnect" href="https://www.pinnacleblooms.org"><link rel="preload" as="image" fetchpriority="high" href="https://www.pinnacleblooms.org/images/b/sanjeevani-2.jpg">',{html:true});}}).transform(base).text();
  // Cloudflare documents no-transform as preventing automatic beacon injection.
  const old=h.get('cache-control')||'no-store';h.set('cache-control',old.replace(/(?:^|,)\s*no-transform\b/g,'')+', no-transform');h.set('referrer-policy','no-referrer');h.set('x-pinnacle-app-privacy','no-private-referrer-20261007');
 }
 for(const k of ['content-encoding','content-length','etag','last-modified','content-md5','digest'])h.delete(k);
 return new Response(request.method==='HEAD'?null:output,{status:200,headers:h});
}
export default {fetch(request){return handle(request);}};
