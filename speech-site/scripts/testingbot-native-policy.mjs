// Test-session settings only; never changes the production site.
export const nativeBlockedHosts=Object.freeze([
 'google-analytics.com','www.google-analytics.com','region1.google-analytics.com','region2.google-analytics.com',
 'googletagmanager.com','www.googletagmanager.com','analytics.google.com',
 'googleadservices.com','www.googleadservices.com','pagead2.googlesyndication.com',
 'googleads.g.doubleclick.net','stats.g.doubleclick.net','ad.doubleclick.net','td.doubleclick.net',
 'google.com','www.google.com','google.co.in','www.google.co.in',
 'clickguard.com','www.clickguard.com','cdn.clickguard.com','api.clickguard.com','scripts.clickguard.com',
 'protect.pinnacleblooms.org','ob.aseasky.link','www.clarity.ms','c.clarity.ms',
 'static.hotjar.com','script.hotjar.com','connect.facebook.net','www.facebook.com','api.whatsapp.com'
]);
export const nativeReaderBlacklist=nativeBlockedHosts.join(',');
export const nativeProbeTargets=Object.freeze([
 Object.freeze({name:'public-control',url:'https://www.pinnacleblooms.org/favicon.ico',expected:'reachable'}),
 Object.freeze({name:'analytics-denied',url:'https://www.google-analytics.com/robots.txt',expected:'blocked'}),
 Object.freeze({name:'tag-loader-denied',url:'https://www.googletagmanager.com/robots.txt',expected:'blocked'})
]);
// Initial blank document only. Non-event GETs with no identifiers or cookies.
export async function nativeReaderProbe(targets){
 return Promise.all(targets.map(async({name,url,expected})=>{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6000);let outcome;
  try{await fetch(url,{method:'GET',mode:'no-cors',credentials:'omit',cache:'no-store',redirect:'error',signal:controller.signal});outcome='reachable';}
  catch(error){outcome=error?.name==='AbortError'?'timeout':'blocked';}
  finally{clearTimeout(timer);}
  return{name,expected,outcome,passed:outcome===expected};
 }));
}
export function assertNativeReaderProbe(results){
 if(!Array.isArray(results)||results.length!==nativeProbeTargets.length||results.some((r,i)=>r?.name!==nativeProbeTargets[i].name||r.expected!==nativeProbeTargets[i].expected||r.passed!==true||r.outcome!==r.expected))throw Error('Native reader containment unavailable; no production page may be opened');
 return true;
}
