import {retiredStaffIds,currentStaffPaths} from './staff-records.mjs';
const origin='https://www.pinnacleblooms.org';
export function staffRoute(request){
 const url=new URL(request.url);if(url.origin!==origin||!['GET','HEAD'].includes(request.method)||request.headers.has('authorization'))return null;
 const match=url.pathname.match(/^\/staff\/[^/]+\/([1-9][0-9]*)\/?$/);if(!match)return null;
 const id=Number(match[1]);
 if(retiredStaffIds.has(id))return new Response(request.method==='HEAD'?null:`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Profile no longer available | Pinnacle Blooms Network</title><meta name="robots" content="noindex, follow"><style>body{margin:0;background:white;color:#18305a;font:18px/1.7 system-ui,sans-serif}main{max-width:720px;margin:8vh auto;padding:24px}img{width:250px;max-width:100%;height:auto}h1{font-size:clamp(28px,5vw,40px);line-height:1.3}a{color:#8f2879;text-underline-offset:4px}nav{display:flex;flex-wrap:wrap;gap:20px;margin-top:28px}nav a{padding:12px;border:1px solid #d8c6df;border-radius:8px}</style></head><body><main><a href="/"><img src="/pinnacle-pages-assets/shop-20261002/pbn-logo.webp" alt="Pinnacle Blooms Network"></a><h1>This profile is no longer available.</h1><p>Find a published professional profile or speak with Pinnacle about the right support and centre for your child.</p><nav aria-label="Continue with Pinnacle"><a href="/staff">Browse professional profiles</a><a href="/centers">Find a centre</a><a href="tel:+919100181181">Call 9100 181 181</a></nav></main></body></html>`,{status:410,headers:{'content-type':'text/html; charset=utf-8','cache-control':'public, max-age=300','x-robots-tag':'noindex, follow','x-pinnacle-profile-status':'retired-20261005'}});
 const canonical=currentStaffPaths[match[1]];
 if(canonical&&url.pathname!==canonical){url.pathname=canonical;return new Response(null,{status:301,headers:{location:url.href,'cache-control':'public, max-age=300','x-pinnacle-profile-status':'canonical-20261005'}});}
 return null;
}
