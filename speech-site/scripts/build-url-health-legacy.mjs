import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {build,transform} from 'esbuild';import {execFileSync} from 'node:child_process';
const repo=path.resolve('..'),site=process.cwd(),git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
const baseline=await build({entryPoints:['deployment/legacy-social-metadata/entry.mjs'],bundle:true,format:'esm',write:false,plugins:[{name:'committed-baseline',setup(b){b.onLoad({filter:/\.mjs$/},async a=>({contents:execFileSync(git,['-C',repo,'show','41ff418b616f4770863b8a83dd57f208fd415e47:'+path.relative(repo,a.path).replaceAll('\\','/')],{encoding:'utf8',windowsHide:true,maxBuffer:32e6}),loader:'js'}));}}]});
const normalize=async s=>(await transform(s,{minifyWhitespace:true,format:'esm'})).code;
const live=execFileSync(git,['-C',repo,'show','41ff418b616f4770863b8a83dd57f208fd415e47:speech-site/deployment/legacy-recovery-entry.mjs'],{encoding:'utf8',windowsHide:true,maxBuffer:32e6}),normalLive=await normalize(live),normalBase=await normalize(baseline.outputFiles[0].text);
if(normalLive!==normalBase){await fs.writeFile('ask-private/url-health-20261009/baseline-compiled.mjs',baseline.outputFiles[0].text);let i=0;while(normalLive[i]===normalBase[i]&&i<normalLive.length)i++;console.log(JSON.stringify({baselineMatches:false,offset:i,live:normalLive.slice(i,i+160),source:normalBase.slice(i,i+160)}));process.exit(1);}
const candidate=await build({entryPoints:['deployment/legacy-social-metadata/entry.mjs'],bundle:true,format:'esm',write:false});
await fs.writeFile('deployment/legacy-recovery-entry.mjs',candidate.outputFiles[0].text);console.log('Committed legacy source matches current compiled runtime; rebuilt only declared changes.');
const captured=JSON.parse(await fs.readFile('ask-private/server-error-mobile-20261009/pinnacle-verify-route-modules.json','utf8'));
const coverageLive=Buffer.from(captured.find(m=>m.name==='legacy-template-coverage.mjs').base64,'base64').toString();
const helper=await build({stdin:{contents:"export {repairSidebarBreadcrumb} from './deployment/legacy-social-metadata/schema.mjs';",resolveDir:site},bundle:true,format:'esm',write:false});
const compiled=helper.outputFiles[0].text.replace(/\nexport \{[\s\S]*?\};\s*$/,'');
const anchor='async function repairLegacyGraph(text, requestUrl) {';
assert.equal(coverageLive.split(anchor).length,2);assert(!coverageLive.includes('repairSidebarBreadcrumb'));
const coverageCandidate=coverageLive.replace(anchor,compiled+'\n'+anchor+'\n  text = repairSidebarBreadcrumb(text, requestUrl); if (text === null) return null;');
await fs.writeFile('deployment/url-health-legacy-templates.mjs',coverageCandidate);
const helperRuntime=await build({entryPoints:['deployment/url-health-repair.mjs'],bundle:true,format:'esm',write:false});await fs.writeFile('deployment/url-health-runtime.mjs',helperRuntime.outputFiles[0].text);
console.log('Portal legacy bundle retained byte-for-byte outside the exact breadcrumb helper/call insertion.');
