import test from'node:test';import assert from'node:assert/strict';
import fs from'node:fs/promises';
import{nativeBlockedHosts,nativeBlockedUrls,nativeReaderBlacklist,nativeTunnelVersion,nativeTunnelFastFailRegexps,nativeCdpEndpoint,nativeCdpCommands,nativeInterceptionSupported,installNativeInterceptions,nativeProbeTargets,nativeReaderProbe,assertNativeReaderProbe,assertNativeProbeDocument}from'./testingbot-native-policy.mjs';
test('native policy denies installed vendors and retains public site and catalogue',()=>{
 for(const host of['www.google-analytics.com','region1.google-analytics.com','www.googletagmanager.com','protect.pinnacleblooms.org','ob.aseasky.link'])assert(nativeBlockedHosts.includes(host));
 for(const host of['www.pinnacleblooms.org','pinnacleblooms.org','pinnacleblooms.myshopify.com','api.testingbot.com'])assert(!nativeBlockedHosts.includes(host));
 assert.equal(new Set(nativeBlockedHosts).size,nativeBlockedHosts.length);assert.equal(nativeReaderBlacklist.split(',').length,nativeBlockedHosts.length);
});
test('tunnel, session and CDP browser layers cover every blocked host',async()=>{
 assert.equal(nativeTunnelVersion,'5.0');assert.equal(nativeTunnelFastFailRegexps.split(',').length,nativeBlockedHosts.length);
 for(const [index,host]of nativeBlockedHosts.entries()){const expression=nativeTunnelFastFailRegexps.split(',')[index];assert(new RegExp(expression).test(host));assert(!new RegExp(expression).test('prefix-'+host));}
 assert.deepEqual(nativeBlockedUrls,nativeBlockedHosts.flatMap(host=>['http://'+host+'/*','https://'+host+'/*']));assert.equal(new Set(nativeBlockedUrls).size,nativeBlockedHosts.length*2);
 for(const host of nativeBlockedHosts){assert(nativeBlockedUrls.includes('http://'+host+'/*'));assert(nativeBlockedUrls.includes('https://'+host+'/*'));}
 assert.deepEqual(nativeCdpCommands,[{cmd:'Network.enable',params:{}},{cmd:'Network.setBlockedURLs',params:{urls:nativeBlockedUrls}}]);
 assert.equal(nativeCdpEndpoint({kind:'desktop',browserName:'chrome'}),'/goog/cdp/execute');assert.equal(nativeCdpEndpoint({kind:'desktop',browserName:'MicrosoftEdge'}),'/ms/cdp/execute');assert.equal(nativeCdpEndpoint({kind:'desktop',browserName:'edge'}),'/ms/cdp/execute');assert.equal(nativeCdpEndpoint({kind:'desktop',browserName:'firefox'}),null);assert.equal(nativeCdpEndpoint({kind:'physical',browserName:'chrome'}),null);
 assert(nativeInterceptionSupported({kind:'desktop',browserName:'chrome'}));assert(nativeInterceptionSupported({kind:'desktop',browserName:'MicrosoftEdge'}));assert(!nativeInterceptionSupported({kind:'desktop',browserName:'firefox'}));assert(!nativeInterceptionSupported({kind:'physical',browserName:'chrome'}));
 const calls=[],installed=await installNativeInterceptions({kind:'desktop',browserName:'chrome'},async(endpoint,payload)=>calls.push({endpoint,payload}));
 assert.deepEqual(installed,{endpoint:'/goog/cdp/execute',commands:2,rules:nativeBlockedHosts.length*2});assert.deepEqual(calls,[{endpoint:'/goog/cdp/execute',payload:{cmd:'Network.enable',params:{}}},{endpoint:'/goog/cdp/execute',payload:{cmd:'Network.setBlockedURLs',params:{urls:nativeBlockedUrls}}}]);
 const edge=[];assert.deepEqual(await installNativeInterceptions({kind:'desktop',browserName:'MicrosoftEdge'},async(endpoint,payload)=>edge.push({endpoint,payload})),{endpoint:'/ms/cdp/execute',commands:2,rules:nativeBlockedHosts.length*2});assert(edge.every(call=>call.endpoint==='/ms/cdp/execute'));
 await assert.rejects(()=>installNativeInterceptions({kind:'desktop',browserName:'chrome'}),/command unavailable/);
 let unsupportedCalls=0;await assert.rejects(()=>installNativeInterceptions({kind:'desktop',browserName:'firefox'},async()=>unsupportedCalls++),/unsupported/);assert.equal(unsupportedCalls,0);
 for(const failureAt of[1,2]){let attempted=0;await assert.rejects(()=>installNativeInterceptions({kind:'desktop',browserName:'chrome'},async()=>{if(++attempted===failureAt)throw Error('provider rejection '+failureAt);}),new RegExp('provider rejection '+failureAt));assert.equal(attempted,failureAt);}
});
test('trusted exact-build workflow pins tunnel v5 fast-fail rules in parity with the native policy',async()=>{
 const workflow=await fs.readFile(new URL('../../.github/workflows/portal-quality.yml',import.meta.url),'utf8');
 assert(workflow.includes("tbVersion: '"+nativeTunnelVersion+"'"));assert(workflow.includes("fastFailRegexps: '"+nativeTunnelFastFailRegexps+"'"));
 const source=await fs.readFile(new URL('./testingbot-suite.mjs',import.meta.url),'utf8'),supportedAt=source.indexOf('if(interceptionSupported){'),installAt=source.indexOf("installNativeInterceptions(config,(endpoint,payload)=>wd(endpoint,'POST',payload))"),unsupportedAt=source.indexOf("status:interceptionSupported?'installing':'not-requested'"),navigateAt=source.indexOf("await wd('/url','POST',{url:nativeProbeTargets[0].url})"),pageAt=source.indexOf("await wd('/url','POST',{url:target})");
 assert(supportedAt>0&&installAt>supportedAt&&unsupportedAt>0&&navigateAt>installAt&&pageAt>navigateAt);assert(!source.includes('tb:intercept'));assert(source.includes("caps['tb:options'].blacklist=nativeReaderBlacklist"));assert(source.indexOf('assertNativeReaderProbe(session.nativeContainment.probes)')>navigateAt);assert(source.includes("requestedCommands:interceptionSupported?nativeCdpCommands.length:0"));assert(source.includes("requestedRules:interceptionSupported?nativeBlockedUrls.length:0"));
 const failureAt=source.indexOf('await save();throw error;',installAt),unsupportedProbePath=source.indexOf("session.nativeContainment.browserInterception.reason='No supported WebDriver CDP endpoint",installAt);
 assert(failureAt>installAt&&failureAt<navigateAt);assert(unsupportedProbePath>failureAt&&unsupportedProbePath<navigateAt);
});
test('preflight uses only non-event GET resources without credentials or query strings',async()=>{
 const saved=globalThis.fetch,seen=[];globalThis.fetch=async(url,options)=>{seen.push({url,options});if(new URL(url).hostname!=='www.pinnacleblooms.org')throw new TypeError('fixture connection refused');return {};};
 try{assertNativeReaderProbe(await nativeReaderProbe(nativeProbeTargets));assert.equal(seen.length,3);for(const r of seen){assert.equal(r.options.method,'GET');assert.equal(r.options.credentials,'omit');assert.equal(r.options.mode,'no-cors');assert.equal(r.options.redirect,'follow');assert.equal(new URL(r.url).search,'');assert(!/collect|conversion/.test(new URL(r.url).pathname));}}finally{globalThis.fetch=saved;}
});
test('unblocked vendor or failed public control stops before production',()=>{
 const pass=nativeProbeTargets.map(t=>({name:t.name,expected:t.expected,outcome:t.expected,passed:true}));
 for(let i=0;i<pass.length;i++){const r=structuredClone(pass);r[i].outcome=i?'reachable':'blocked';r[i].passed=false;assert.throws(()=>assertNativeReaderProbe(r),/no production page/);}
 assert.throws(()=>assertNativeReaderProbe([]));assert.throws(()=>assertNativeReaderProbe(pass.map(r=>({...r,outcome:'timeout',passed:false}))));
});
test('only the exact non-instrumented plain text probe document establishes first-party context',()=>{
 const good={url:nativeProbeTargets[0].url,contentType:'text/plain',scripts:0};assert(assertNativeProbeDocument(good));
 for(const change of[{url:'https://www.pinnacleblooms.org/'},{url:good.url+'?other=1'},{contentType:'text/html'},{scripts:1}])assert.throws(()=>assertNativeProbeDocument({...good,...change}),/no production page/);
});
