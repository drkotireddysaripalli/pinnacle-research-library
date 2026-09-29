// Exact public speech routes only. Returning null preserves the existing Worker/origin path.
export const SPEECH_CANONICAL='/top-speech-therapy-center-india-proven-improvement-rate';
const DOCUMENT='/speech-therapy/service-information';
const ENROLMENT_PREVIEW='/pinnacle-pages-preview/enrolment';
const GUIDES=['first-visit-guide','teacher-observation-guide'];
const MIME={'.mjs':'text/javascript; charset=utf-8','.vcf':'text/vcard; charset=utf-8','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
export async function serveSpeech(request,env,inventory){
 const u=new URL(request.url);
 const preview=u.pathname===ENROLMENT_PREVIEW;
 if(u.hostname==='www.pinnacleblooms.org'&&preview&&!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{allow:'GET, HEAD','cache-control':'no-store','x-robots-tag':'noindex, nofollow'}});
 if(u.hostname!=='www.pinnacleblooms.org'||!['GET','HEAD'].includes(request.method)||request.headers.has('authorization'))return null;
 const aliases=new Map([['/speech-therapy',SPEECH_CANONICAL],['/speech-therapy/',SPEECH_CANONICAL],[SPEECH_CANONICAL+'/',SPEECH_CANONICAL],[DOCUMENT+'/',DOCUMENT],[DOCUMENT+'.html',DOCUMENT]]);
 for(const guide of GUIDES)for(const suffix of ['/', '.html'])aliases.set('/speech-therapy/'+guide+suffix,'/speech-therapy/'+guide);
 if(aliases.has(u.pathname)){u.pathname=aliases.get(u.pathname);return new Response(null,{status:301,headers:{location:u.href,'cache-control':'public, max-age=300'}});}
 let key=u.pathname;
 if(preview)key='/pinnacle-pages-html/enrolment-preview.html';
 else if(key===SPEECH_CANONICAL)key='/pinnacle-pages-html/speech.html';
 else if(key===DOCUMENT)key='/pinnacle-pages-html/service-information.html';
 else if(GUIDES.some(g=>key==='/speech-therapy/'+g))key='/pinnacle-pages-html/'+key.split('/').pop()+'.html';
 else if(key==='/speech-therapy/sitemap.xml')key='/pinnacle-pages-data/speech-sitemap.xml';
 else if(key==='/speech-therapy/llms.txt')key='/pinnacle-pages-data/speech-llms.txt';
 else if(!/^\/pinnacle-pages-(?:assets|fonts|scripts|data)\//.test(key))return null;
 if(!Object.hasOwn(inventory,key))return null;
 const isHtml=key.endsWith('.html');
 if(isHtml&&!preview&&(request.headers.has('range')||/\bno-transform\b/i.test(request.headers.get('cache-control')||'')))return null;
 if(!env.ASSETS)return new Response('Temporarily unavailable',{status:503,headers:{'cache-control':'no-store'}});
 // Serve complete small assets; ignoring Range also prevents mixing bytes across releases.
 const source=await env.ASSETS.fetch(new Request('https://assets.local'+key,{method:request.method}));
 if(![200,206,304].includes(source.status))return new Response(request.method==='HEAD'?null:'Temporarily unavailable',{status:503,headers:{'cache-control':'no-store','retry-after':'30'}});
 const headers=new Headers(source.headers);
 for(const k of ['set-cookie','age','expires','content-encoding'])headers.delete(k);
 headers.set('content-type',MIME[key.slice(key.lastIndexOf('.'))]||'application/octet-stream');
 headers.set('x-content-type-options','nosniff');headers.set('referrer-policy','strict-origin-when-cross-origin');
 headers.set('x-pinnacle-speech-release','2026-09-29');
 // Preserve search and answer retrieval signals in Cloudflare Markdown conversion.
 if(isHtml)headers.set('content-signal','search=yes, ai-input=yes');
 headers.set('cache-control',key.startsWith('/pinnacle-pages-assets/')?'public, max-age=31536000, immutable':'public, max-age=60, must-revalidate');
 const etag='"speech-'+inventory[key]+'"';headers.set('etag',etag);
 if(isHtml){headers.set('x-robots-tag','index, follow, max-image-preview:large');headers.set('link','<https://www.pinnacleblooms.org'+u.pathname+'>; rel="canonical"');headers.set('content-security-policy',"default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests");}
 if(preview){headers.set('x-robots-tag','noindex, nofollow, nosnippet');headers.set('cache-control','no-store');headers.set('content-signal','search=no, ai-input=no');headers.set('referrer-policy','no-referrer');headers.set('content-security-policy',"default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'self'; upgrade-insecure-requests");}
 if(!preview&&request.headers.get('if-none-match')===etag){headers.delete('content-length');return new Response(null,{status:304,headers});}
 return new Response(request.method==='HEAD'?null:source.body,{status:source.status,headers});
}
