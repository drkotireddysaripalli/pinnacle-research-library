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
const escapeHostRegex=host=>host.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export const nativeTunnelVersion='5.0';
export const nativeTunnelFastFailRegexps=nativeBlockedHosts.map(host=>'^'+escapeHostRegex(host)+'$').join(',');
// The tunnel fast-fail rules and session blacklist retain hostname coverage.
// Chromium's standard CDP command installs the complete HTTP/HTTPS browser
// layer in two WebDriver calls before the non-instrumented control document.
export const nativeBlockedUrls=Object.freeze(nativeBlockedHosts.flatMap(host=>['http://'+host+'/*','https://'+host+'/*']));
export const nativeCdpEndpoint=config=>{
 if(config?.kind!=='desktop')return null;
 const browser=String(config.browserName||'').toLowerCase();
 if(browser==='chrome')return '/goog/cdp/execute';
 if(browser==='microsoftedge'||browser==='edge')return '/ms/cdp/execute';
 return null;
};
export const nativeInterceptionSupported=config=>nativeCdpEndpoint(config)!==null;
export const nativeCdpCommands=Object.freeze([
 Object.freeze({cmd:'Network.enable',params:Object.freeze({})}),
 Object.freeze({cmd:'Network.setBlockedURLs',params:Object.freeze({urls:nativeBlockedUrls})})
]);
export async function installNativeInterceptions(config,run){
 const endpoint=nativeCdpEndpoint(config);
 if(!endpoint)throw Error('Native CDP containment unsupported; no production page may be opened');
 if(typeof run!=='function')throw Error('Native CDP command unavailable; no production page may be opened');
 let installedCommands=0;
 for(const command of nativeCdpCommands){await run(endpoint,{cmd:command.cmd,params:command.params});installedCommands++;}
 if(installedCommands!==nativeCdpCommands.length)throw Error('Native CDP containment incomplete; no production page may be opened');
 return{endpoint,commands:installedCommands,rules:nativeBlockedUrls.length};
}
export const nativeProbeTargets=Object.freeze([
 Object.freeze({name:'public-control',url:'https://www.pinnacleblooms.org/robots.txt',expected:'reachable'}),
 Object.freeze({name:'analytics-denied',url:'https://www.google-analytics.com/robots.txt',expected:'blocked'}),
 Object.freeze({name:'tag-loader-denied',url:'https://www.googletagmanager.com/robots.txt',expected:'blocked'})
]);
export function assertNativeProbeDocument(document){
 if(document?.url!==nativeProbeTargets[0].url||!/^text\/plain(?:;|$)/i.test(document.contentType||'')||document.scripts!==0)throw Error('Native probe document is not the exact non-instrumented text resource; no production page may be opened');
 return true;
}
// Existing non-instrumented first-party text document only. Non-event GETs
// with no identifiers or cookies. Browsers require follow for no-cors mode.
export async function nativeReaderProbe(targets){
 return Promise.all(targets.map(async({name,url,expected})=>{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6000);let outcome;
  try{await fetch(url,{method:'GET',mode:'no-cors',credentials:'omit',cache:'no-store',redirect:'follow',signal:controller.signal});outcome='reachable';}
  catch(error){outcome=error?.name==='AbortError'?'timeout':'blocked';}
  finally{clearTimeout(timer);}
  return{name,expected,outcome,passed:outcome===expected};
 }));
}
export function assertNativeReaderProbe(results){
 if(!Array.isArray(results)||results.length!==nativeProbeTargets.length||results.some((r,i)=>r?.name!==nativeProbeTargets[i].name||r.expected!==nativeProbeTargets[i].expected||r.passed!==true||r.outcome!==r.expected))throw Error('Native reader containment unavailable; no production page may be opened');
 return true;
}
