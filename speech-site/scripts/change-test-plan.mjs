// Dependency-free selection. Unknown inputs retain the existing full gates.
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {execFileSync,spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
import {componentPlan,componentInputPrefixes} from './change-test-profiles.mjs';
import {assertLabelSourceDelta,assertGeneratedLabels} from './campaign-label-patch.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));export const root=path.resolve(here,'../..');
const portableGit=path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe');const git=process.env.PINNACLE_GIT||(process.platform==='win32'&&fs.existsSync(portableGit)?portableGit:'git');
const control=new Set(['speech-site/scripts/change-test-plan.mjs','speech-site/scripts/change-test-profiles.mjs','speech-site/scripts/test-change-test-plan.mjs','speech-site/scripts/test-enrolment.mjs','speech-site/scripts/test-enrolment-contract.mjs','speech-site/scripts/check-page.mjs','speech-site/scripts/check-contact-receipt-browser.mjs','speech-site/scripts/page-quality-contracts.mjs','speech-site/CHANGE-BASED-TESTING.md','.github/workflows/portal-quality.yml']);
const policy=new Set(['speech-site/deployment/protection-csp.mjs','speech-site/scripts/test-protection-csp.mjs','speech-site/src/lib/ad-call-csp.mjs','speech-site/scripts/test-public-ad-call.mjs']);
const testingTooling=new Set(['speech-site/scripts/testingbot-suite.mjs','speech-site/scripts/testingbot-daily.mjs','speech-site/scripts/testingbot-records.mjs','speech-site/scripts/testingbot-playwright.mjs','speech-site/scripts/test-testingbot-playwright.mjs','speech-site/scripts/test-testingbot-contract.mjs','speech-site/scripts/testingbot-provider-close.mjs','speech-site/scripts/test-testingbot-provider-close.mjs','speech-site/scripts/testingbot-native-policy.mjs','speech-site/scripts/test-testingbot-native-policy.mjs','speech-site/scripts/testingbot-android-reader.mjs','speech-site/scripts/test-testingbot-android-reader.mjs','speech-site/tests/testingbot/evidence-priorities.mjs','speech-site/tests/testingbot/centre-state.mjs','speech-site/scripts/test-testingbot-centre-state.mjs','speech-site/tests/testingbot/evidence-shell.mjs','speech-site/scripts/test-evidence-shell.mjs']);
const docs=f=>/^(?:[^/]+|speech-site\/[^/]+|(?:docs|speech-site\/(?:reviews|docs|team-kt-20261009))\/.+)\.md$/i.test(f);
export const commonCspRuntime=new Set(['speech-site/src/lib/ad-call-csp.mjs','speech-site/deployment/ad-call-csp.mjs',...['speech','book-attribution','first-conversation','seva'].map(name=>'speech-site/deployment/'+name+'-handler.mjs'),'helpline-site/handler-source.mjs','helpline-site/worker.mjs']);
const commonCspTools=new Set(['speech-site/scripts/test-public-ad-call.mjs','speech-site/scripts/verify-google-click-wire.mjs','speech-site/scripts/release-measurement-always-on-live.mjs']);
const commonCspControls=new Set(['speech-site/scripts/change-test-plan.mjs','speech-site/scripts/test-change-test-plan.mjs']);
const collectorOrigins=['https://analytics.google.com','https://stats.g.doubleclick.net'];
// Prove the actual committed delta. Filenames alone cannot classify a runtime
// change as policy-only: everything outside these connect-src additions stays exact.
export function commonCspDiffIsSafe(files,{readBefore,readAfter}){
 const runtime=files.filter(file=>commonCspRuntime.has(file));if(!runtime.length)return false;
 let changedRuntime=false;try{return runtime.every(file=>{
  const before=String(readBefore(file)),after=String(readAfter(file));if(before===after)return true;changedRuntime=true;
  const allowed=collectorOrigins.map(host=>file.startsWith('helpline-site/')?host+'/g/collect':host);
  const additions=(old,next)=>{const added=next.filter(value=>!old.includes(value));return added.length>0&&added.every(value=>allowed.includes(value))&&new Set(added).size===added.length&&JSON.stringify(next.filter(value=>!added.includes(value)))===JSON.stringify(old);};
  if(file.endsWith('/ad-call-csp.mjs')){
   const pattern=/next = augmentDirective\(next, "connect-src", (\[[\s\S]*?\])\);/g;
   const old=[...before.matchAll(pattern)],next=[...after.matchAll(pattern)];if(old.length!==1||next.length!==1)return false;
   const oldValues=JSON.parse(old[0][1]),nextValues=JSON.parse(next[0][1]);if(oldValues.includes("'none'")||!additions(oldValues,nextValues))return false;
   return after.slice(0,next[0].index)+next[0][0].replace(next[0][1],old[0][1])+after.slice(next[0].index+next[0][0].length)===before;
  }
  const pattern=/\bconnect-src [^";\r\n]*/g,old=[...before.matchAll(pattern)],next=[...after.matchAll(pattern)];if(!old.length||old.length!==next.length)return false;
  let restored=after,added=false;
  for(let index=next.length-1;index>=0;index--){
   if(old[index][0]===next[index][0])continue;
   const oldValues=old[index][0].split(/\s+/),nextValues=next[index][0].split(/\s+/);if(oldValues.includes("'none'")||!additions(oldValues,nextValues))return false;
   added=true;restored=restored.slice(0,next[index].index)+old[index][0]+restored.slice(next[index].index+next[index][0].length);
  }
  return added&&restored===before;
 })&&changedRuntime;}catch{return false;}
}
export function publicProtectionDiffIsSafe(files,{readBefore,readAfter}){
 try{return files.filter(file=>['speech-site/deployment/legacy-measurement.mjs','speech-site/deployment/protection-csp.mjs'].includes(file)).every(file=>{
  const before=readBefore(file).toString(),after=readAfter(file).toString();
  if(file.endsWith('/legacy-measurement.mjs'))return after.replace("import {repairPublicTemplateProtection} from './public-template-protection.mjs';\n",'').replace(' response=repairPublicTemplateProtection(request,response);\n','')===before;
  return after.replace(/export function publicProtectionTemplateRequest\(request\)\{[\s\S]*?\n\}\n/,'').replace(' const template=publicProtectionTemplateRequest(request);\n','').replace('||(template&&/no-transform/i.test(cache))','').replace('||template))', '))')===before;
 });}catch{return false;}
}
// This exception accepts only the founder-authorized three-property removal.
export function nativeAdSettingsDiffIsSafe(files,{readBefore,readAfter}){
 const source='speech-site/public/pinnacle-pages-scripts/speech-measurement.js',asset='speech-site/deployment/book-attribution-assets.mjs';
 const contact='speech-site/deployment/contact-receipt-assets.mjs';
 if(files.includes(contact)&&(files.includes(source)||files.includes(asset)))return false;
 if(files.includes(contact)&&!files.includes(source)&&!files.includes(asset))try{
  const before=String(readBefore(contact)),after=String(readAfter(contact)),pattern=/export const contactReceiptAssetSources=(\{[^\n]+\});/;
  const old=JSON.parse(before.match(pattern)?.[1]||'null'),next=JSON.parse(after.match(pattern)?.[1]||'null'),key='/pinnacle-pages-scripts/speech-measurement.js';
  if(!old||!next)return false;
  const original=old[key].body,body=original.replaceAll(",ad_personalization:'denied'",'').replace(',allow_google_signals:false,allow_ad_personalization_signals:false','');
  if(original.split(",ad_personalization:'denied'").length!==3||original.split(',allow_google_signals:false,allow_ad_personalization_signals:false').length!==2||body!==String(readAfter(source)))return false;
  old[key]={...old[key],body,sha256:hash(body)};
  return JSON.stringify(old)===JSON.stringify(next)&&before.replace(pattern,'export const contactReceiptAssetSources='+JSON.stringify(old)+';')===after;
 }catch{return false;}
 if(!files.includes(source)||!files.includes(asset))return false;
 try{
  const before=String(readBefore(source)),after=String(readAfter(source));
  if(before.split(",ad_personalization:'denied'").length!==3||before.split(',allow_google_signals:false,allow_ad_personalization_signals:false').length!==2)return false;
  if(after!==before.replaceAll(",ad_personalization:'denied'",'').replace(',allow_google_signals:false,allow_ad_personalization_signals:false',''))return false;
  const parse=value=>JSON.parse(String(value).match(/export const attributionScripts=(\{[^\n]+\});/)?.[1]||'null');
  const old=parse(readBefore(asset)),next=parse(readAfter(asset));if(!old||!next)return false;
  for(const key of ['/pinnacle-pages-scripts/speech-measurement.js','/books/resources/measurement-v1.js']){
   if(old[key]?.text!==before)return false;old[key]={...old[key],text:after,sha256:hash(after)};
  }
  const oldModule=String(readBefore(asset)),nextModule=String(readAfter(asset));
  return JSON.stringify(old)===JSON.stringify(next)&&oldModule.replace(/export const attributionScripts=(\{[^\n]+\});/,'export const attributionScripts='+JSON.stringify(old)+';')===nextModule;
 }catch{return false;}
}
export function campaignLabelsDiffIsSafe(files,{readBefore,readAfter}){
 const sourcePrefix='speech-site/public/pinnacle-pages-scripts/';
 try{
  const pairs=['speech-measurement.js','enrolment-source.mjs'].map(name=>[name,String(readBefore(sourcePrefix+name)),String(readAfter(sourcePrefix+name))]);
  if(!pairs.every(([name])=>files.includes(sourcePrefix+name)))return false;
  for(const [,before,after]of pairs)assertLabelSourceDelta(before,after);
  const book='speech-site/deployment/book-attribution-assets.mjs',contact='speech-site/deployment/contact-receipt-assets.mjs';
  if(!files.includes(book)||!files.includes(contact))return false;
  assertGeneratedLabels(readBefore(book),readAfter(book),'attributionScripts',['/pinnacle-pages-scripts/speech-measurement.js','/books/resources/measurement-v1.js'].map(key=>[key,pairs[0][1],pairs[0][2],'text']));
  assertGeneratedLabels(readBefore(contact),readAfter(contact),'contactReceiptAssetSources',pairs.map(([name,before,after])=>['/pinnacle-pages-scripts/'+name,before,after,'body']));
  return true;
 }catch{return false;}
}
export function selectPlan(files,{comparisonVerified=true,policyExecutionChanged=false,commonCspVerified=false,publicProtectionVerified=false,nativeAdSettingsVerified=false,campaignLabelsVerified=false,forceFull=false,hasDeletions=false}={}){
 const changed=[...new Set(files)].sort();let scope='full',reason='Unmapped/runtime/configuration change: keep the existing full portal gates.';
 const labelFiles=new Set(['speech-site/scripts/additive-receipt-recovery.mjs','speech-site/scripts/test-additive-receipt-recovery.mjs','speech-site/public/pinnacle-pages-scripts/speech-measurement.js','speech-site/public/pinnacle-pages-scripts/enrolment-source.mjs','speech-site/deployment/book-attribution-assets.mjs','speech-site/deployment/contact-receipt-assets.mjs','speech-site/scripts/campaign-label-patch.mjs','speech-site/scripts/test-campaign-label-patch.mjs','speech-site/scripts/release-public-template-protection.mjs','speech-site/scripts/change-test-plan.mjs','speech-site/scripts/test-change-test-plan.mjs','speech-site/scripts/test-measurement.mjs','speech-site/scripts/test-enrolment-receipt.mjs']);
 if(comparisonVerified&&!forceFull&&!hasDeletions&&campaignLabelsVerified&&changed.every(file=>labelFiles.has(file)))return {
  schemaVersion:2,scope:'runtime',reason:'Exact Unicode campaign metadata validation correction; click IDs and other receipt behavior preserved.',changed,comparisonVerified,components:['campaign-labels'],ask:false,portal:false,focused:true,productionDeployment:false,needsBrowser:false,timeIndependent:true,
  suites:['scripts/test-campaign-label-patch.mjs','scripts/test-additive-receipt-recovery.mjs','scripts/test-change-test-plan.mjs'],commands:[
   {label:'measurement-acceptance',args:['--test','--test-name-pattern=eligible public pages|existing Google tag|safe Google Ads UTMs|new typed Ads IDs|central call and WhatsApp|accepted enquiry|automatic protection|ordinary Unicode|campaign punctuation','scripts/test-measurement.mjs']},
   {label:'protection-acceptance',args:['--test','--test-name-pattern=first-party consumer installs|late SDK|eligible commercial routes','scripts/test-protection-consumer.mjs','scripts/test-cheq-protection.mjs']},
   {label:'receipt-labels',args:['--test','--test-name-pattern=receipt metadata retains|new typed campaign ID|receipt source is fixed','scripts/test-enrolment-receipt.mjs']},
   {label:'release-syntax',args:['--check','scripts/release-public-template-protection.mjs']}
  ],inputPrefixes:componentInputPrefixes,requiredReleaseEvidence:['Published collector and source-module bytes match; three captured portal modules changed only by exact metadata patches','Contained label/UTM/contact/protection checks; current private receiver deployment reconciled separately before claiming accepted production intake'],skipped:['Unchanged page build and device suites','Unchanged full receipt and return suites','Native account reconfiguration']
 };
 const nativeFiles=new Set(['speech-site/deployment/contact-receipt-assets.mjs','speech-site/public/pinnacle-pages-scripts/speech-measurement.js','speech-site/deployment/book-attribution-assets.mjs','speech-site/scripts/build-book-attribution.mjs','speech-site/scripts/test-measurement.mjs','speech-site/scripts/release-public-template-protection.mjs','speech-site/scripts/change-test-plan.mjs','speech-site/scripts/test-change-test-plan.mjs']);
 if(comparisonVerified&&!forceFull&&!hasDeletions&&nativeAdSettingsVerified&&changed.every(file=>nativeFiles.has(file)))return {
  schemaVersion:2,scope:'runtime',reason:'Exact three-property advertising override removal; all other shared measurement source and assets unchanged.',changed,comparisonVerified,components:['native-ad-settings'],ask:false,portal:false,focused:true,productionDeployment:false,needsBrowser:false,timeIndependent:true,
  suites:['scripts/test-change-test-plan.mjs'],commands:[{label:'native-ad-initialization',args:['--test','--test-name-pattern=eligible public pages|existing Google tag','scripts/test-measurement.mjs']},{label:'shared-release-syntax',args:['--check','scripts/release-public-template-protection.mjs']}],inputPrefixes:componentInputPrefixes,
  requiredReleaseEvidence:['Published shared script aliases match committed source; only generated shared script module replaced','Contained initialization of published bytes preserves storage flags, one page view and existing tag reuse; no external event sent'],
  skipped:['Unchanged Astro/Ask build','Unchanged receiving and attribution suites','Unchanged device/BVT allocation','Full site crawl']
 };
 const runtimeCsp=changed.filter(file=>commonCspRuntime.has(file));
 const cspOnly=changed.length&&changed.every(file=>commonCspRuntime.has(file)||commonCspTools.has(file)||commonCspControls.has(file)||docs(file));
 const cspTooling=!runtimeCsp.length&&changed.some(file=>commonCspTools.has(file));
 if(comparisonVerified&&!forceFull&&!hasDeletions&&cspOnly&&(runtimeCsp.length?commonCspVerified:cspTooling))return {
  schemaVersion:2,scope:'runtime',reason:runtimeCsp.length?'Verified exact additions of approved connect-src collection origins; page and collector code unchanged.':'Registered CSP verifier/selector tooling only; production source unchanged.',changed,comparisonVerified,commonCspRuntimeVerified:!!runtimeCsp.length,components:['common-csp'],ask:false,portal:false,focused:true,productionDeployment:false,needsBrowser:true,timeIndependent:true,
  suites:['scripts/test-public-ad-call.mjs','scripts/test-change-test-plan.mjs'],
  commands:['verify-google-click-wire','release-measurement-always-on-live'].map(name=>({label:name+'-syntax',args:['--check','scripts/'+name+'.mjs']})),inputPrefixes:[...componentInputPrefixes,'helpline-site/'],
  requiredReleaseEvidence:['Actual serving CSP/absent-policy semantics and primary Google SDK interception for four affected families via existing --csp-only verification','Module hashes, routes and bindings preserved; regenerated CSP/helpline/assembled workers','Reuse unchanged UI/dist/receipt/BVT only with matching source, dependency, configuration and acceptance fingerprints; never claim a fresh BVT from reuse'],
  skipped:['Unchanged Astro/Ask build','Unchanged full unit/browser registry','Unchanged device/BVT allocation','Full site recrawl']
 };
 if(comparisonVerified&&!forceFull&&!hasDeletions){
  if(changed.length===0){scope='none';reason='Verified Git comparison has no changed files.';}
  else if(changed.every(f=>control.has(f)||docs(f))&&(!changed.includes('.github/workflows/portal-quality.yml')||changed.includes('speech-site/scripts/test-change-test-plan.mjs'))){scope=changed.some(f=>control.has(f))?'control':'none';reason='Test-selector or documentation change; production source unchanged.';}
  else if(changed.some(f=>policy.has(f))&&changed.every(f=>policy.has(f)||control.has(f)||docs(f))&&!changed.includes('.github/workflows/portal-quality.yml')&&!policyExecutionChanged){scope='policy';reason='Scoped public response-policy change; assets, page markup and browser logic unchanged.';}
  else if(changed.some(f=>testingTooling.has(f))&&changed.every(f=>testingTooling.has(f)||control.has(f)||docs(f))&&!changed.includes('.github/workflows/portal-quality.yml')){scope='test-tooling';reason='TestingBot transport/runner only; production source is unchanged.';}
  else if(changed.every(f=>f.startsWith('speech-site/ask-runtime/')||f.startsWith('speech-site/ask-public/')||f.startsWith('speech-site/src/lib/ask/')||docs(f))){scope='ask';reason='Ask-owned source only; retain Ask auth/content/build gates.';}
 }
 const suites=scope==='test-tooling'?['scripts/test-testingbot-contract.mjs','scripts/test-testingbot-playwright.mjs','scripts/test-change-test-plan.mjs']:scope==='policy'?[...(changed.some(f=>/protection-csp\.mjs$/.test(f))?['scripts/test-protection-csp.mjs']:[]),...(changed.some(f=>/ad-call-csp\.mjs$|test-public-ad-call\.mjs$/.test(f))?['scripts/test-public-ad-call.mjs']:[]),...(changed.some(f=>control.has(f))?['scripts/test-change-test-plan.mjs']:[])]:scope==='control'?['scripts/test-change-test-plan.mjs']:[];
 const callPolicy=scope==='policy'&&suites.includes('scripts/test-public-ad-call.mjs');
 if(scope==='test-tooling')suites.push('scripts/test-testingbot-android-reader.mjs','scripts/test-testingbot-native-policy.mjs','scripts/test-testingbot-provider-close.mjs','scripts/test-testingbot-centre-state.mjs');
 const componentControls=new Set(['speech-site/scripts/change-test-plan.mjs','speech-site/scripts/change-test-profiles.mjs','speech-site/scripts/test-change-test-plan.mjs']);
 const scoped=scope==='full'&&comparisonVerified&&!forceFull&&!hasDeletions?componentPlan(changed.filter(f=>!docs(f)&&!componentControls.has(f)),{publicProtectionVerified}):null;
 if(scoped&&changed.some(f=>componentControls.has(f)))scoped.suites=[...new Set([...scoped.suites,'scripts/test-change-test-plan.mjs'])];
 return {schemaVersion:2,scope:callPolicy||scope==='test-tooling'?'runtime':scope,reason,changed,comparisonVerified,ask:scope==='ask'||scope==='full',portal:scope==='full'||scope==='ask',focused:suites.length>0,suites,requiredReleaseEvidence:scope==='test-tooling'?['Actual provider canary preserves named assertions, native interaction and cleanup','Affected case execution; physical/visual/network coverage remains explicit']:scope==='policy'?['Affected actual serving Worker GET/HEAD and CSP composition','Version/module hashes, routes and bindings; public readback','Browser case if nonce/hash/directive or execution behavior changes']:['full','ask'].includes(scope)?['Existing trusted build/BVT; changed contact and durable receipt behavior','Actual serving-owner deployment and public readback']:[],skipped:scope==='policy'||scope==='test-tooling'?['Astro/Ask rebuild','Unchanged full unit registry','Unchanged layout/device suites','Full site recrawl']:[],productionDeployment:false,...(callPolicy||scope==='test-tooling'?{inputPrefixes:callPolicy?[...componentInputPrefixes,'helpline-site/']:componentInputPrefixes,...(callPolicy?{needsBrowser:true}:{})}:{}),...scoped};
}
const hash=b=>createHash('sha256').update(b).digest('hex');
// The release coordinator may reuse a prior real BVT only after proving the
// complete intervening committed delta and every current focused command/log.
export function validateCommonCspReuse({files,hasDeletions=false,readBefore,readAfter,baseline,baselineReport,focused,testedCommit,readLog}){
 if(baseline?.phase!=='verified-live'||baseline.ci?.status!=='completed'||baseline.ci?.conclusion!=='success'||!baseline.commit||!baseline.ci.testedCommit||!baseline.ci.reportSha256||hash(baselineReport)!==baseline.ci.reportSha256)throw Error('A verified-live baseline with its intact real BVT report is required');
 const plan=selectPlan(files,{hasDeletions,commonCspVerified:commonCspDiffIsSafe(files,{readBefore,readAfter})});
 if(plan.components?.join(',')!=='common-csp'||plan.portal||plan.ask)throw Error('Baseline delta changes inputs outside the approved common CSP scope; retain full build/BVT gates');
 if(focused?.plan?.components?.join(',')!=='common-csp'||focused.plan.portal||focused.plan.ask||focused.plan.scope!=='runtime')throw Error('Current push CI did not run the common CSP profile');
 const required=[...plan.suites.map(s=>['--test',s]),...plan.commands.map(c=>c.args)];
 const declared=[...(focused.plan.suites||[]).map(s=>['--test',s]),...(focused.plan.commands||[]).map(c=>c.args)];
 const records=focused.results||[];
 if(required.some(command=>!declared.some(value=>JSON.stringify(value)===JSON.stringify(command)))||records.length!==declared.length)throw Error('Focused evidence is missing a required CSP command');
 for(const command of declared){
  const matches=records.filter(record=>JSON.stringify(record.command)===JSON.stringify(command));
  if(matches.length!==1)throw Error('Focused evidence has a missing or duplicate command');
  const record=matches[0],source=record.reused?record.requestedSource:record.source;
  if(source!==testedCommit||record.status!=='passed'||record.exitCode!==0||record.cacheable===false||!/^[a-f0-9]{64}$/.test(record.key)||hash(readLog(record.key+'.log'))!==record.logSHA256)throw Error('Focused evidence failed source, result or log-integrity verification');
 }
 return {kind:'verified-common-csp-reuse',baselineCommit:baseline.commit,baselineTestedCommit:baseline.ci.testedCommit,baselineRun:baseline.ci.databaseId,baselineReportSha256:baseline.ci.reportSha256,changed:files,semanticDeltaVerified:true,focusedCommands:records.length,freshBvt:false};
}
export function fingerprint({files,readFile,command,context}){return hash(JSON.stringify({files:[...new Set(files)].sort().map(f=>[f,hash(readFile(f))]),command,context}));}
export function reusable(receipt,{key,logExists,logSHA256}){return receipt?.status==='passed'&&receipt.cacheable!==false&&receipt.exitCode===0&&receipt.key===key&&logExists&&receipt.logSHA256===logSHA256;}
export function executionMismatch({head,current,dirty}){if(head!==current)return 'Check out the planned source before executing it';if(dirty)return 'Uncommitted inputs: a commit-only plan cannot certify this working tree; use a clean source lane or an explicitly scoped existing test command';return null;}
function g(args){return execFileSync(git,args,{cwd:root,encoding:'utf8',windowsHide:true}).trim();}
function relativeClosure(entries){const found=new Set();function visit(f){if(found.has(f))return;found.add(f);const text=fs.readFileSync(path.join(root,f),'utf8');for(const m of text.matchAll(/(?:from\s*|import\s*\()(['"])(\.[^'"]+)\1/g)){const next=path.posix.normalize(path.posix.join(path.posix.dirname(f),m[2]));if(!/\.(?:mjs|js|json)$/.test(next))throw Error('Unresolved test dependency: '+next);visit(next);}}for(const f of entries)visit(f);return [...found];}
export function retainFixtureArtifacts(dir,out,key){
 if(!/^[a-f0-9]{64}$/.test(key))throw Error('Invalid artifact evidence key');
 const proof=JSON.parse(fs.readFileSync(path.join(dir,'browser-proof.json'),'utf8'));
 if(!proof.executed||!Array.isArray(proof.results)||!proof.results.length||proof.results.some(x=>!x.passed)||proof.realIntakes!==0||proof.realCalls!==0||!proof.externalAnalyticsIntercepted)throw Error('Incomplete isolated browser receipt');
 const saved=[];for(const f of fs.readdirSync(dir,{recursive:true,withFileTypes:true}))if(f.isFile()){const file=path.join(f.parentPath||f.path,f.name),relative=path.relative(dir,file),target=path.join(out,'artifacts',key,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);saved.push({path:target,sha256:hash(fs.readFileSync(target))});}return saved;
}
export function runFocused(plan,{out=path.join(root,'speech-site/audits/change-testing')}={}){
 fs.mkdirSync(out,{recursive:true});const source=g(['rev-parse','HEAD']),results=[];
 const commands=[...plan.suites.map(suite=>({label:suite,args:['--test',suite]})),...(plan.commands||[])];
 const broad=plan.inputPrefixes?g(['ls-files','--',...plan.inputPrefixes]).split('\n').filter(Boolean):null;
 let pythonRuntime=null;if(broad&&plan.suites.includes('scripts/test-enrolment-receipt.mjs'))pythonRuntime=execFileSync(process.platform==='win32'?'C:/Python314/python.exe':'python3',['-c','import sys,sqlite3; print(sys.version); print(sqlite3.sqlite_version)'],{encoding:'utf8',windowsHide:true}).trim();
 for(const stage of commands){
  const command=stage.args,inputs=broad?[...broad]:relativeClosure(['speech-site/'+command.at(-1)]);for(const f of ['speech-site/package.json','speech-site/package-lock.json','build-window/.node-version','build-window/.npm-version','speech-site/scripts/change-test-plan.mjs','speech-site/scripts/change-test-profiles.mjs','speech-site/CHANGE-BASED-TESTING.md','.github/workflows/portal-quality.yml'])if(fs.existsSync(path.join(root,f)))inputs.push(f);
  const environment=Object.fromEntries(Object.entries(process.env).filter(([k])=>/^(?:PINNACLE_|PORTAL_|PAGE_|CANONICAL_|PYTHON|NODE_OPTIONS$|CI$|TZ$)/.test(k)));
  const context={schemaVersion:2,node:process.version,versions:process.versions,platform:process.platform,arch:process.arch,acceptance:plan.scope,buildSHA:plan.buildSHA||null,externalTransport:'none',environmentHash:hash(JSON.stringify(environment)),...(broad?{...(!plan.timeIndependent?{validationWindow:Math.floor(Date.now()/600000)}:{}),pythonRuntime}:{} )},key=fingerprint({files:inputs,readFile:f=>fs.readFileSync(path.join(root,f)),command,context}),cache=path.join(out,key+'.json'),log=path.join(out,key+'.log');
  let previous=null;try{previous=JSON.parse(fs.readFileSync(cache,'utf8'));}catch{}
  const artifactsValid=(previous?.artifacts||[]).every(x=>fs.existsSync(x.path)&&hash(fs.readFileSync(x.path))===x.sha256);
  if(artifactsValid&&reusable(previous,{key,logExists:fs.existsSync(log),logSHA256:fs.existsSync(log)?hash(fs.readFileSync(log)):null})){results.push({...previous,reused:true,reusedFromSource:previous.source,requestedSource:source});continue;}
  const fd=fs.openSync(log,'w'),started=Date.now();let result;try{result=spawnSync(process.execPath,command,{cwd:path.join(root,'speech-site'),stdio:['ignore',fd,fd],windowsHide:true,env:process.env});}finally{fs.closeSync(fd);}
  let artifacts=[],artifactError=null;if(result.status===0&&stage.artifactDir){try{artifacts=retainFixtureArtifacts(path.join(root,'speech-site',stage.artifactDir),out,key);}catch(e){artifactError=e.message;}}
  const afterKey=fingerprint({files:inputs,readFile:f=>fs.readFileSync(path.join(root,f)),command,context});
  const record={key,source,command,inputs,context,cacheable:afterKey===key,exitCode:result.status,status:result.status===0&&!result.error&&!artifactError?'passed':'failed',durationMs:Date.now()-started,log,logSHA256:hash(fs.readFileSync(log)),artifacts,artifactError,at:new Date().toISOString(),reused:false};fs.writeFileSync(cache,JSON.stringify(record,null,2)+'\n');results.push(record);
  if(record.status!=='passed'){fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({plan,results},null,2));throw Error('Affected check failed: '+stage.label+'; '+log);}
 }
 const result={plan,results,executed:results.filter(x=>!x.reused).length,reused:results.filter(x=>x.reused).length,remainingGates:plan.requiredReleaseEvidence};fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2)+'\n');return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const arg=name=>{const i=process.argv.indexOf('--'+name);return i<0?null:process.argv[i+1];};const base=arg('base'),head=arg('head')||'HEAD';let files=[],comparisonVerified=false,diagnostic=null,policyExecutionChanged=false,hasDeletions=false,commonCspVerified=false,publicProtectionVerified=false,nativeAdSettingsVerified=false,campaignLabelsVerified=false;
 try{if(!base)throw Error('An explicit verified base is required');g(['rev-parse','--verify',base+'^{commit}']);g(['rev-parse','--verify',head+'^{commit}']);files=g(['diff','--no-renames','--name-only',base,head]).split('\n').filter(Boolean);hasDeletions=!!g(['diff','--no-renames','--diff-filter=D','--name-only',base,head]);comparisonVerified=true;
  const committed=(ref,file)=>execFileSync(git,['show',ref+':'+file],{cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:64*1024*1024});
  commonCspVerified=commonCspDiffIsSafe(files,{readBefore:file=>committed(base,file),readAfter:file=>committed(head,file)});
  publicProtectionVerified=publicProtectionDiffIsSafe(files,{readBefore:file=>committed(base,file),readAfter:file=>committed(head,file)});
  nativeAdSettingsVerified=nativeAdSettingsDiffIsSafe(files,{readBefore:file=>committed(base,file),readAfter:file=>committed(head,file)});
  campaignLabelsVerified=campaignLabelsDiffIsSafe(files,{readBefore:file=>committed(base,file),readAfter:file=>committed(head,file)});
  if(files.includes('speech-site/deployment/protection-csp.mjs')){const diff=g(['diff','--unified=0',base,head,'--','speech-site/deployment/protection-csp.mjs']).split('\n').filter(x=>/^[+-](?![+-])/.test(x)).join('\n');policyExecutionChanged=/nonce|sha256|script-src|connect-src|unsafe-|default-src|new Response|\.fetch\(/.test(diff);}
  // Only this exact, reviewed image-host addition may reuse unchanged page
  // builds. Any other CSP implementation delta keeps full acceptance.
  if(files.includes('speech-site/src/lib/ad-call-csp.mjs')){const delta=g(['diff','--unified=0',base,head,'--','speech-site/src/lib/ad-call-csp.mjs']).split('\n').filter(x=>/^[+-](?![+-])/.test(x));policyExecutionChanged=policyExecutionChanged||delta.length!==1||delta[0]!=='+    "https://www.googletagmanager.com",';}
 }catch(e){diagnostic=e.message;}
 const plan={...selectPlan(files,{comparisonVerified,policyExecutionChanged,commonCspVerified,publicProtectionVerified,nativeAdSettingsVerified,campaignLabelsVerified,hasDeletions,forceFull:process.argv.includes('--full')}),base,head,diagnostic,tree:'committed comparison'};
 const out=arg('out')||path.join(root,'speech-site/audits/change-testing');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'plan.json'),JSON.stringify(plan,null,2)+'\n');
 if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,Object.entries({ask:plan.ask,portal:plan.portal,focused:plan.focused,scope:plan.scope,needs_browser:!!plan.needsBrowser,selection:JSON.stringify(plan)}).map(([k,v])=>k+'='+v+'\n').join(''));
 if(process.argv.includes('--run')&&plan.focused){const mismatch=executionMismatch({head:g(['rev-parse',head+'^{tree}']),current:g(['rev-parse','HEAD^{tree}']),dirty:!!g(['status','--porcelain','--untracked-files=normal'])});if(mismatch)throw Error(mismatch);}
 const result=process.argv.includes('--run')?runFocused(plan,{out}):null;
 console.log(JSON.stringify({scope:plan.scope,reason:plan.reason,changed:files.length,executed:result?.executed||0,reused:result?.reused||0,remainingGates:plan.requiredReleaseEvidence,evidence:path.join(out,'plan.json')}));
 if(process.argv.includes('--run')&&plan.portal)process.exitCode=2;
}
