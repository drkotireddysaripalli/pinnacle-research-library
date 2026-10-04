import {resourceAssets} from './first-conversation-assets.mjs';
const canonical='https://www.pinnacleblooms.org/books/resources/first-conversation';
const path='/books/resources/first-conversation';
export function serveFirstConversation(request){
 const u=new URL(request.url);
 if(!['pinnacleblooms.org','www.pinnacleblooms.org'].includes(u.hostname))return null;
 const isPage=[path,path+'/',path+'.html'].includes(u.pathname);
 if(!isPage&&!Object.hasOwn(resourceAssets,u.pathname))return null;
 const privateResponse=request.headers.has('cookie')||request.headers.has('authorization');
 const headers=new Headers({'x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','cache-control':privateResponse?'private, no-store':'public, max-age=0, must-revalidate'});
 if(!['GET','HEAD'].includes(request.method)){headers.set('allow','GET, HEAD');return new Response(null,{status:405,headers});}
 if(u.hostname!=='www.pinnacleblooms.org'||(isPage&&u.pathname!==path)){u.hostname='www.pinnacleblooms.org';if(isPage)u.pathname=path;headers.set('location',u.href);return new Response(null,{status:301,headers});}
 const markdown=isPage&&/text\/markdown/i.test(request.headers.get('accept')||'')&&!/text\/html/i.test(request.headers.get('accept')||'');
 const entry=resourceAssets[markdown?path+'.md':u.pathname];
 headers.set('content-type',entry.type);headers.set('etag','"'+entry.sha256+'"');
 headers.set('x-pinnacle-resource','first_conversation_v1');
 if(isPage){headers.set('vary','Accept');headers.set('content-signal','search=yes, ai-input=yes');headers.set('x-robots-tag','index, follow, max-image-preview:large');}
 if(isPage||/\.pdf$|\.md$/.test(u.pathname))headers.set('link','<'+canonical+'>; rel="canonical"');
 if(u.pathname.endsWith('.pdf'))headers.set('content-disposition','inline; filename="Pinnacle-First-Conversation-v1.pdf"');
 if(entry.type.startsWith('text/html'))headers.set('content-security-policy',"default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://static.cloudflareinsights.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests");
 if(!privateResponse&&request.headers.get('if-none-match')===headers.get('etag'))return new Response(null,{status:304,headers});
 const bytes=Uint8Array.from(atob(entry.body),c=>c.charCodeAt(0));
 headers.set('content-length',String(bytes.byteLength));
 return new Response(request.method==='HEAD'?null:bytes,{status:200,headers});
}
