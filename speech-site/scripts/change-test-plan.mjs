// Dependency-free selection. Unknown inputs retain the existing full gates.
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {execFileSync,spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));export const root=path.resolve(here,'../..');
const portableGit=path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe');const git=process.env.PINNACLE_GIT||(process.platform==='win32'&&fs.existsSync(portableGit)?portableGit:'git');
const control=new Set(['speech-site/scripts/change-test-plan.mjs','speech-site/scripts/test-change-test-plan.mjs','speech-site/CHANGE-BASED-TESTING.md','.github/workflows/portal-quality.yml']);
const policy=new Set(['speech-site/deployment/protection-csp.mjs','speech-site/scripts/test-protection-csp.mjs']);
const docs=f=>/^(?:[^/]+|speech-site\/[^/]+|(?:docs|speech-site\/(?:reviews|docs|team-kt-20261009))\/.+)\.md$/i.test(f);
export function selectPlan(files,{comparisonVerified=true,policyExecutionChanged=false,forceFull=false}={}){
 const changed=[...new Set(files)].sort();let scope='full',reason='Unmapped/runtime/configuration change: keep the existing full portal gates.';
 if(comparisonVerified&&!forceFull){
  if(changed.length===0){scope='none';reason='Verified Git comparison has no changed files.';}
  else if(changed.every(f=>control.has(f)||docs(f))&&(!changed.includes('.github/workflows/portal-quality.yml')||changed.includes('speech-site/scripts/test-change-test-plan.mjs'))){scope=changed.some(f=>control.has(f))?'control':'none';reason='Test-selector or documentation change; production source unchanged.';}
  else if(changed.every(f=>policy.has(f)||docs(f))&&!policyExecutionChanged){scope='policy';reason='Scoped public response-policy change; assets, page markup and browser logic unchanged.';}
  else if(changed.every(f=>f.startsWith('speech-site/ask-runtime/')||f.startsWith('speech-site/ask-public/')||f.startsWith('speech-site/src/lib/ask/')||docs(f))){scope='ask';reason='Ask-owned source only; retain Ask auth/content/build gates.';}
 }
 const suites=scope==='policy'?['scripts/test-protection-csp.mjs']:scope==='control'?['scripts/test-change-test-plan.mjs']:[];
 return {schemaVersion:1,scope,reason,changed,comparisonVerified,ask:scope==='ask'||scope==='full',portal:scope==='full'||scope==='ask',focused:suites.length>0,suites,requiredReleaseEvidence:scope==='policy'?['Affected actual serving Worker GET/HEAD and CSP composition','Version/module hashes, routes and bindings; public readback','Browser case if nonce/hash/directive or execution behavior changes']:['full','ask'].includes(scope)?['Existing trusted build/BVT; changed contact and durable receipt behavior','Actual serving-owner deployment and public readback']:[],skipped:scope==='policy'?['Astro/Ask rebuild','Unchanged full unit registry','Unchanged layout/device suites','Full site recrawl']:[],productionDeployment:false};
}
const hash=b=>createHash('sha256').update(b).digest('hex');
export function fingerprint({files,readFile,command,context}){return hash(JSON.stringify({files:[...new Set(files)].sort().map(f=>[f,hash(readFile(f))]),command,context}));}
export function reusable(receipt,{key,logExists,logSHA256}){return receipt?.status==='passed'&&receipt.exitCode===0&&receipt.key===key&&logExists&&receipt.logSHA256===logSHA256;}
export function executionMismatch({head,current,dirty}){if(head!==current)return 'Check out the planned source before executing it';if(dirty)return 'Uncommitted inputs: a commit-only plan cannot certify this working tree; use a clean source lane or an explicitly scoped existing test command';return null;}
function g(args){return execFileSync(git,args,{cwd:root,encoding:'utf8',windowsHide:true}).trim();}
function relativeClosure(entries){const found=new Set();function visit(f){if(found.has(f))return;found.add(f);const text=fs.readFileSync(path.join(root,f),'utf8');for(const m of text.matchAll(/(?:from\s*|import\s*\()(['"])(\.[^'"]+)\1/g)){const next=path.posix.normalize(path.posix.join(path.posix.dirname(f),m[2]));if(!/\.(?:mjs|js|json)$/.test(next))throw Error('Unresolved test dependency: '+next);visit(next);}}for(const f of entries)visit(f);return [...found];}
export function runFocused(plan,{out=path.join(root,'speech-site/audits/change-testing')}={}){
 fs.mkdirSync(out,{recursive:true});const source=g(['rev-parse','HEAD']),results=[];
 for(const suite of plan.suites){
  const command=['--test',suite],inputs=relativeClosure(['speech-site/'+suite]);for(const f of ['speech-site/package.json','speech-site/package-lock.json','build-window/.node-version','build-window/.npm-version','speech-site/scripts/change-test-plan.mjs','speech-site/CHANGE-BASED-TESTING.md','.github/workflows/portal-quality.yml'])if(fs.existsSync(path.join(root,f)))inputs.push(f);
  const context={schemaVersion:1,node:process.version,versions:process.versions,platform:process.platform,arch:process.arch,acceptance:plan.scope,externalTransport:'none'},key=fingerprint({files:inputs,readFile:f=>fs.readFileSync(path.join(root,f)),command,context}),cache=path.join(out,key+'.json'),log=path.join(out,key+'.log');
  let previous=null;try{previous=JSON.parse(fs.readFileSync(cache,'utf8'));}catch{}
  if(reusable(previous,{key,logExists:fs.existsSync(log),logSHA256:fs.existsSync(log)?hash(fs.readFileSync(log)):null})){results.push({...previous,reused:true,reusedFromSource:previous.source,requestedSource:source});continue;}
  const fd=fs.openSync(log,'w'),started=Date.now();let result;try{result=spawnSync(process.execPath,command,{cwd:path.join(root,'speech-site'),stdio:['ignore',fd,fd],windowsHide:true,env:process.env});}finally{fs.closeSync(fd);}
  const record={key,source,command,inputs,context,exitCode:result.status,status:result.status===0&&!result.error?'passed':'failed',durationMs:Date.now()-started,log,logSHA256:hash(fs.readFileSync(log)),at:new Date().toISOString(),reused:false};fs.writeFileSync(cache,JSON.stringify(record,null,2)+'\n');results.push(record);
  if(record.status!=='passed'){fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({plan,results},null,2));throw Error('Affected check failed: '+suite+'; '+log);}
 }
 const result={plan,results,executed:results.filter(x=>!x.reused).length,reused:results.filter(x=>x.reused).length,remainingGates:plan.requiredReleaseEvidence};fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2)+'\n');return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const arg=name=>{const i=process.argv.indexOf('--'+name);return i<0?null:process.argv[i+1];};const base=arg('base'),head=arg('head')||'HEAD';let files=[],comparisonVerified=false,diagnostic=null,policyExecutionChanged=false;
 try{if(!base)throw Error('An explicit verified base is required');g(['rev-parse','--verify',base+'^{commit}']);g(['rev-parse','--verify',head+'^{commit}']);files=g(['diff','--no-renames','--name-only',base,head]).split('\n').filter(Boolean);comparisonVerified=true;
  if(files.includes('speech-site/deployment/protection-csp.mjs')){const diff=g(['diff','--unified=0',base,head,'--','speech-site/deployment/protection-csp.mjs']).split('\n').filter(x=>/^[+-](?![+-])/.test(x)).join('\n');policyExecutionChanged=/nonce|sha256|script-src|connect-src|unsafe-|default-src|new Response|\.fetch\(/.test(diff);}
 }catch(e){diagnostic=e.message;}
 const plan={...selectPlan(files,{comparisonVerified,policyExecutionChanged,forceFull:process.argv.includes('--full')}),base,head,diagnostic,tree:'committed comparison'};
 const out=arg('out')||path.join(root,'speech-site/audits/change-testing');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'plan.json'),JSON.stringify(plan,null,2)+'\n');
 if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,Object.entries({ask:plan.ask,portal:plan.portal,focused:plan.focused,scope:plan.scope}).map(([k,v])=>k+'='+v+'\n').join(''));
 if(process.argv.includes('--run')&&plan.focused){const mismatch=executionMismatch({head:g(['rev-parse',head+'^{tree}']),current:g(['rev-parse','HEAD^{tree}']),dirty:!!g(['status','--porcelain','--untracked-files=normal'])});if(mismatch)throw Error(mismatch);}
 const result=process.argv.includes('--run')?runFocused(plan,{out}):null;
 console.log(JSON.stringify({scope:plan.scope,reason:plan.reason,changed:files.length,executed:result?.executed||0,reused:result?.reused||0,remainingGates:plan.requiredReleaseEvidence,evidence:path.join(out,'plan.json')}));
 if(process.argv.includes('--run')&&['ask','full'].includes(plan.scope))process.exitCode=2;
}
