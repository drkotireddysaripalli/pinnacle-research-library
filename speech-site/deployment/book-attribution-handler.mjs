import {attributionScripts} from './book-attribution-assets.mjs';
export function serveBookAttribution(request){
 const u=new URL(request.url),entry=attributionScripts[u.pathname];
 // Shared portal analytics must come from the current full asset union, not
 // the historical book release's bundled copy of this same public script.
 if(u.pathname==='/pinnacle-pages-scripts/speech-measurement.js')return null;
 if(u.hostname!=='www.pinnacleblooms.org'||!entry)return null;
 const privateResponse=request.headers.has('cookie')||request.headers.has('authorization');
 const headers=new Headers({'content-type':'text/javascript; charset=utf-8','x-content-type-options':'nosniff','cache-control':privateResponse?'private, no-store':'public, max-age=60, must-revalidate','etag':'"'+entry.sha256+'"','x-pinnacle-script-release':'book-attribution-20261004'});
 if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{...Object.fromEntries(headers),allow:'GET, HEAD'}});
 if(!privateResponse&&request.headers.get('if-none-match')===headers.get('etag'))return new Response(null,{status:304,headers});
 return new Response(request.method==='HEAD'?null:entry.text,{headers});
}
