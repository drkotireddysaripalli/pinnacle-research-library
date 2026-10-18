import test from'node:test';import assert from'node:assert/strict';
import{nativeBlockedHosts,nativeReaderBlacklist,nativeProbeTargets,nativeReaderProbe,assertNativeReaderProbe,assertNativeProbeDocument}from'./testingbot-native-policy.mjs';
test('native policy denies installed vendors and retains public site and catalogue',()=>{
 for(const host of['www.google-analytics.com','region1.google-analytics.com','www.googletagmanager.com','protect.pinnacleblooms.org','ob.aseasky.link'])assert(nativeBlockedHosts.includes(host));
 for(const host of['www.pinnacleblooms.org','pinnacleblooms.org','pinnacleblooms.myshopify.com','api.testingbot.com'])assert(!nativeBlockedHosts.includes(host));
 assert.equal(new Set(nativeBlockedHosts).size,nativeBlockedHosts.length);assert.equal(nativeReaderBlacklist.split(',').length,nativeBlockedHosts.length);
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
