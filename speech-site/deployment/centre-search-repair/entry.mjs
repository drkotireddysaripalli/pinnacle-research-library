import {handle as legacy} from './legacy-v11.mjs';
import {isKukatpallyRequest,transformKukatpally} from './kukatpally.mjs';
export async function handle(request,fetcher=fetch){
 if(!isKukatpallyRequest(request))return legacy(request,fetcher);
 const headers=new Headers(request.headers);for(const key of ['if-none-match','if-modified-since','content-length','transfer-encoding'])headers.delete(key);
 const publicRequest=new Request(request.url,{method:'GET',headers,redirect:request.redirect});
 const response=await transformKukatpally(publicRequest,await legacy(publicRequest,fetcher));
 return request.method==='HEAD'?new Response(null,{status:response.status,statusText:response.statusText,headers:response.headers}):response;
}
export default {fetch:request=>handle(request)};
