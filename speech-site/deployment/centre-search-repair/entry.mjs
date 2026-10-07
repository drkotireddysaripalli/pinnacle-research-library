import {handle as legacy} from './legacy-v11.mjs';
import {isKukatpallyRequest,transformKukatpally} from './kukatpally.mjs';
import {isLBNagarRequest,transformLBNagar} from './lbnagar.mjs';
import {isLabbipetRequest,transformLabbipet} from './labbipet.mjs';
import {isAnnaNagarRequest,transformAnnaNagar} from './annanagar.mjs';
import {isChandaNagarRequest,transformChandaNagar} from './chandanagar.mjs';
import {addCentreMeasurement} from './centre-measurement.mjs';
import {isPaidCentreRequest,transformPaidCentre} from './paid-centre-entry.mjs';
export async function handle(request,fetcher=fetch){
 const transform=isChandaNagarRequest(request)?transformChandaNagar:isKukatpallyRequest(request)?transformKukatpally:isLBNagarRequest(request)?transformLBNagar:isLabbipetRequest(request)?transformLabbipet:isAnnaNagarRequest(request)?transformAnnaNagar:null;
 const paid=isPaidCentreRequest(request);
 if(!transform&&!paid)return legacy(request,fetcher);
 const headers=new Headers(request.headers);for(const key of ['if-none-match','if-modified-since','content-length','transfer-encoding'])headers.delete(key);
 const publicRequest=new Request(request.url,{method:'GET',headers,redirect:request.redirect});
 let response=await legacy(publicRequest,fetcher);
 if(transform)response=await transform(publicRequest,response);
 if(paid){try{response=await transformPaidCentre(publicRequest,response);}catch(error){console.warn('paid-centre-entry-unavailable',{name:error?.name||'Error'});}}
 response=await addCentreMeasurement(publicRequest,response);
 return request.method==='HEAD'?new Response(null,{status:response.status,statusText:response.statusText,headers:response.headers}):response;
}
export default {fetch:request=>handle(request)};
