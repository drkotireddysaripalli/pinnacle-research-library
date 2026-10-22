import test from 'node:test';import assert from 'node:assert/strict';
import {repairCourseTracking} from '../deployment/legacy-courses-tracking.mjs';
import {servePublicAdCall,PUBLIC_AD_CALL_PATH} from '../deployment/public-ad-call.mjs';
const url='https://www.pinnacleblooms.org/certified-courses';
const html='<html><head><link rel="canonical" href="https://d.pinnacleblooms.org/certified-courses" /></head><body>Keep course content</body></html>';
test('only the observed course canonical is repaired before existing GTM handoff',async()=>{
 let calls=0;const result=await repairCourseTracking(new Request(url),new Response(html,{headers:{'content-type':'text/html','etag':'old','x-kept':'yes'}}),async(req,res,options)=>{calls++;assert.equal(req.url,url);assert.equal(options.preserveGtm,true);return res;});
 assert.equal(calls,1);assert.equal(await result.text(),html.replace('https://d.','https://www.'));assert.equal(result.headers.get('etag'),null);assert.equal(result.headers.get('x-kept'),'yes');
});
test('other course variants and protected responses remain untouched',async()=>{
 for(const [request,response]of [[new Request(url+'/'),new Response(html,{headers:{'content-type':'text/html'}})],[new Request(url,{headers:{authorization:'test'}}),new Response(html,{headers:{'content-type':'text/html'}})],[new Request(url),new Response(html,{headers:{'content-type':'text/html','set-cookie':'test=1'}})],[new Request(url),new Response(html.replace('https://d.','https://unknown.'),{headers:{'content-type':'text/html'}})]])assert.equal(await repairCourseTracking(request,response,()=>{throw Error('must not migrate');}),response);
});
test('priority dispatch returns the redirect before an older packaged handler can respond',()=>{
 let originalCalls=0;const original=()=>{originalCalls++;return new Response('old packaged script');};
 const request=new Request('https://www.pinnacleblooms.org/pinnacle-pages-scripts/portal-ad-call-7f1663ac50806f5c.mjs');
 const response=servePublicAdCall(request)||original(request);
 assert.equal(originalCalls,0);assert.equal(response.status,308);assert.equal(response.headers.get('location'),PUBLIC_AD_CALL_PATH);assert.equal(response.headers.get('access-control-allow-origin'),'*');
});
