import test from'node:test';import assert from'node:assert/strict';
import fs from'node:fs/promises';
import{nativeBlockedHosts,nativeReaderBlacklist,nativeTunnelVersion,nativeTunnelFastFailRegexps,nativeInterceptRules,nativeInterceptionSupported,installNativeInterceptions,nativeProbeTargets,nativeReaderProbe,assertNativeReaderProbe,assertNativeProbeDocument}from'./testingbot-native-policy.mjs';
test('native policy denies installed vendors and retains public site and catalogue',()=>{
 for(const host of['www.google-analytics.com','region1.google-analytics.com','www.googletagmanager.com','protect.pinnacleblooms.org','ob.aseasky.link'])assert(nativeBlockedHosts.includes(host));
 for(const host of['www.pinnacleblooms.org','pinnacleblooms.org','pinnacleblooms.myshopify.com','api.testingbot.com'])assert(!nativeBlockedHosts.includes(host));
 assert.equal(new Set(nativeBlockedHosts).size,nativeBlockedHosts.length);assert.equal(nativeReaderBlacklist.split(',').length,nativeBlockedHosts.length);
});
test('tunnel and browser interception rules cover every blocked host without widening host matches',async()=>{
 assert.equal(nativeTunnelVersion,'5.0');assert.equal(nativeTunnelFastFailRegexps.split(',').length,nativeBlockedHosts.length);
 for(const [index,host]of nativeBlockedHosts.entries()){const expression=nativeTunnelFastFailRegexps.split(',')[index];assert(new RegExp(expression).test(host));assert(!new RegExp(expression).test('prefix-'+host));}
 assert.equal(nativeInterceptRules.length,nativeBlockedHosts.length*2);assert.equal(new Set(nativeInterceptRules.map(r=>r.url)).size,nativeInterceptRules.length);
 for(const host of nativeBlockedHosts)for(const protocol of['http','https'])assert.deepEqual(nativeInterceptRules.find(r=>r.url===protocol+'://'+host+'/*'),{url:protocol+'://'+host+'/*',error:'BlockedByClient'});
 assert(nativeInterceptionSupported({kind:'desktop',browserName:'chrome'}));assert(nativeInterceptionSupported({kind:'desktop',browserName:'MicrosoftEdge'}));assert(!nativeInterceptionSupported({kind:'desktop',browserName:'firefox'}));assert(!nativeInterceptionSupported({kind:'physical',browserName:'chrome'}));
 const commands=[];assert.equal(await installNativeInterceptions(async(command,rule)=>commands.push({command,rule})),nativeInterceptRules.length);assert.equal(commands.length,nativeInterceptRules.length);assert(commands.every((entry,index)=>entry.command==='tb:intercept'&&entry.rule.url===nativeInterceptRules[index].url&&entry.rule.error==='BlockedByClient'));
 let attempted=0;await assert.rejects(()=>installNativeInterceptions(async()=>{if(++attempted===3)throw Error('provider rejection');}),/provider rejection/);assert.equal(attempted,3);
});
test('trusted exact-build workflow pins tunnel v5 fast-fail rules in parity with the native policy',async()=>{
 const workflow=await fs.readFile(new URL('../../.github/workflows/portal-quality.yml',import.meta.url),'utf8');
 assert(workflow.includes("tbVersion: '"+nativeTunnelVersion+"'"));assert(workflow.includes("fastFailRegexps: '"+nativeTunnelFastFailRegexps+"'"));
 const source=await fs.readFile(new URL('./testingbot-suite.mjs',import.meta.url),'utf8'),installAt=source.indexOf('installNativeInterceptions((command,rule)=>evaluate(command,rule))'),navigateAt=source.indexOf("await wd('/url','POST',{url:nativeProbeTargets[0].url})");
 assert(installAt>0&&navigateAt>installAt);assert(source.includes("caps['tb:options'].blacklist=nativeReaderBlacklist"));assert(source.indexOf('assertNativeReaderProbe(session.nativeContainment.probes)')>navigateAt);
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
