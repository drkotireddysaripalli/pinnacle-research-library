import {libraryReturn} from '../src/lib/reader-source.mjs';
const hosts={'materials.pinnacleblooms.org':'materials','interventions.pinnacleblooms.org':'interventions'};
export function librarySignupMarkup(url){
 const u=new URL(url),section=hosts[u.hostname];if(!section)return null;
 const raw='/'+section+(u.pathname==='/'?'':u.pathname);
 const back=libraryReturn(raw)||'/'+section;
 const href='https://www.pinnacleblooms.org/ask/account?returnTo='+encodeURIComponent(back);
 // The legacy Materials spacer covers only its mobile header, not the desktop navigation row.
 const clearance=section==='materials'?'<style>[data-pinnacle-reader-signup]{margin-top:1px}@media(min-width:1024px){[data-pinnacle-reader-signup]{margin-top:calc(var(--header-height,64px) - var(--header-height-mobile,56px) + 44px)}}</style>':'';
 return '<aside data-pinnacle-reader-signup="'+section+'" aria-label="Pinnacle reader account" style="box-sizing:border-box;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;padding:14px 20px;background:#fff;color:#213653;border-bottom:1px solid #e5e7eb;font:600 16px/1.5 system-ui,sans-serif">'+clearance+'<span>One Pinnacle reader account for Ask, FAQs, videos and practical libraries.</span><a href="'+href+'" style="display:inline-flex;align-items:center;min-height:44px;padding:8px 18px;border:1px solid #8f2879;border-radius:10px;color:#842478;background:#fff;text-decoration:none">Continue with Google <span aria-hidden="true" style="margin-left:8px">&#8594;</span></a><a href="tel:+919100181181" style="color:#213653;text-underline-offset:3px">Call 9100 181 181</a></aside>';
}
export async function addLibraryRegistration(request,response){
 if(!['GET','HEAD'].includes(request.method)||response.status!==200||!/^text\/html(?:\s*;|$)/i.test(response.headers.get('content-type')||'')||request.headers.has('range'))return response;
 const markup=librarySignupMarkup(request.url);if(!markup)return response;
 const headers=new Headers(response.headers);
 for(const key of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest'])headers.delete(key);
 headers.set('x-pinnacle-reader-signup','20261025');
 if(request.method==='HEAD')return new Response(null,{status:response.status,headers});
 const html=await response.text();if(html.includes('data-pinnacle-reader-signup='))return new Response(html,{status:response.status,headers});
 if(!/<body\b[^>]*>/i.test(html))return new Response(html,{status:response.status,headers});
 const anchor=/<main\b[^>]*>/i.test(html)?/<main\b[^>]*>/i:/<body\b[^>]*>/i;
 return new Response(html.replace(anchor,tag=>tag+markup),{status:response.status,headers});
}
