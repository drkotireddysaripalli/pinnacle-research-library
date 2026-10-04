import {handle as legacy} from './legacy-v11.mjs';
import {isKukatpallyRequest,transformKukatpally} from './kukatpally.mjs';
import {isLBNagarRequest,transformLBNagar} from './lbnagar.mjs';
import {isLabbipetRequest,transformLabbipet} from './labbipet.mjs';
export async function handle(request,fetcher=fetch){
 const transform=isKukatpallyRequest(request)?transformKukatpally:isLBNagarRequest(request)?transformLBNagar:isLabbipetRequest(request)?transformLabbipet:null;
 if(!transform)return legacy(request,fetcher);
 const headers=new Headers(request.headers);for(const key of ['if-none-match','if-modified-since','content-length','transfer-encoding'])headers.delete(key);
 const publicRequest=new Request(request.url,{method:'GET',headers,redirect:request.redirect});
 const response=await transform(publicRequest,await legacy(publicRequest,fetcher));
 return request.method==='HEAD'?new Response(null,{status:response.status,statusText:response.statusText,headers:response.headers}):response;
}
export default {fetch:request=>handle(request)};
