import test from'node:test';import assert from'node:assert/strict';import{R2_SCOPES,R2_SCOPE_SHA256,isCoveragePageName,pageHash,validateCoverageChain}from'./r2-coverage-chain.mjs';
function fixture(scopes=R2_SCOPES){const identity=pageHash(JSON.stringify(scopes)),state={schemaVersion:2,scopeSetSHA256:identity,scopeCount:scopes.length,registrySHA256:'a'.repeat(64),startedAt:'2026-10-16T00:00:00Z',pass:2,scope:0,page:0,cursor:null,completedPages:2*scopes.length,complete:true,pageHashes:{}};const files={};for(let pass=0;pass<2;pass++)for(let scope=0;scope<scopes.length;scope++){const name=`pass-${pass}-scope-${scope}-page-0.json`,[bucket,prefix]=scopes[scope];files[name]=Buffer.from(JSON.stringify({pass,scope,page:0,bucket,prefix,scopeSetSHA256:identity,registrySHA256:state.registrySHA256,inputCursor:null,nextCursor:null,truncated:false,paginationEvidence:'short-terminal-page-without-cursor',rowsExamined:0,known:[],observedAt:'2026-10-16T00:01:00Z'}));state.pageHashes[name]=pageHash(files[name]);}return{state,files};}
test('two complete scope chains establish actual coverage, not just a pass counter',()=>{const f=fixture();assert.equal(validateCoverageChain(f.state,f.files).completePasses,2);});
test('restored valid-hash incomplete scope archive cannot infer deletion',()=>{const f=fixture();for(const name of Object.keys(f.files))if(!name.includes('scope-0-')){delete f.files[name];delete f.state.pageHashes[name];}assert.throws(()=>validateCoverageChain(f.state,f.files),/Noncontiguous|frontier|count/);});
test('missing terminal, cursor mismatch, identity mismatch and altered page hash all reject',()=>{for(const change of [p=>p.nextCursor='invented',p=>p.inputCursor='unexpected',p=>p.scope=4,p=>p.truncated=true]){const f=fixture(),name=Object.keys(f.files)[0],p=JSON.parse(f.files[name]);change(p);f.files[name]=Buffer.from(JSON.stringify(p));f.state.pageHashes[name]=pageHash(f.files[name]);assert.throws(()=>validateCoverageChain(f.state,f.files));}const f=fixture();f.files[Object.keys(f.files)[0]]=Buffer.from('{}');assert.throws(()=>validateCoverageChain(f.state,f.files),/hash/);});

import fs from'node:fs/promises';import os from'node:os';import path from'node:path';import{execFileSync}from'node:child_process';import{fileURLToPath,pathToFileURL}from'node:url';import{verifiedR2Source}from'./verified-r2-source.mjs';
test('fresh cached complete coverage rederives stale absent/delete outputs without any network',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'pinnacle-cache-fixture-'));
 try{
  const privateRoot=path.join(root,'ask-private'),cache=path.join(privateRoot,'fixture');await fs.mkdir(cache,{recursive:true});
  const[bucket,prefix]=R2_SCOPES[0],id=bucket+'/'+prefix+'present.jpg',approved={[id]:{etag:'present-etag',rights_status:'owned',public_uses:[{parent:'https://materials.pinnacleblooms.org/aac',selected:'https://images.pinnacleblooms.org/present.jpg',kind:'image'}]}};
  const bytes=Buffer.from(JSON.stringify(approved)),registrySHA=pageHash(bytes),now=new Date().toISOString(),f=fixture();Object.assign(f.state,{registrySHA256:registrySHA,startedAt:now,completedAt:now,totalQueries:10});
  for(const[name,raw]of Object.entries(f.files)){const page=JSON.parse(raw);page.registrySHA256=registrySHA;page.observedAt=now;if(page.scope===0){page.known=[{id,etag:'present-etag',size:20}];page.rowsExamined=1;}const encoded=Buffer.from(JSON.stringify(page));f.state.pageHashes[name]=pageHash(encoded);await fs.writeFile(path.join(cache,name),encoded);}
  const approvedFile=path.join(privateRoot,'approved.json');await fs.writeFile(approvedFile,bytes);await fs.writeFile(path.join(privateRoot,'public-publisher-config.json'),JSON.stringify({r2_associations:approvedFile}));await fs.writeFile(path.join(cache,'state.json'),JSON.stringify(f.state));
  const staleProof={scopeSetSHA256:R2_SCOPE_SHA256,scopeCount:R2_SCOPES.length,registrySHA256:registrySHA,approvedKeys:1,completePasses:2,matchedInFirstPass:0,matchedInSecondPass:0,confirmedAbsent:1,unstableHeld:0},staleDelta={changes:[{id,operation:'delete',confirmedAbsentInTwoCompletePasses:true}],holds:[]};
  await fs.writeFile(path.join(cache,'proof.json'),JSON.stringify(staleProof));await fs.writeFile(path.join(cache,'qualified-changes.json'),JSON.stringify(staleDelta));
  assert.equal(verifiedR2Source(staleProof,staleDelta,approved,registrySHA,now).changes[0].operation,'delete','Counterexample reproduces stale derived-output risk');
  const guard=path.join(root,'deny-network.mjs');await fs.writeFile(guard,"globalThis.fetch=()=>{throw Error('Unexpected network in cached completion')};");
  execFileSync(process.execPath,['--import',pathToFileURL(guard).href,fileURLToPath(new URL('./r2-approved-rotation.mjs',import.meta.url)),'--root','ask-private/fixture'],{cwd:root,encoding:'utf8'});
  const proof=JSON.parse(await fs.readFile(path.join(cache,'proof.json'))),delta=JSON.parse(await fs.readFile(path.join(cache,'qualified-changes.json'))),state=JSON.parse(await fs.readFile(path.join(cache,'state.json')));
  assert.equal(proof.queriesThisInvocation,0);assert.equal(proof.confirmedAbsent,0);assert.deepEqual(delta.changes,[]);assert.equal(state.completedAt,now);assert.equal(verifiedR2Source(proof,delta,approved,registrySHA,now).changes.length,0);
 }finally{assert.equal(path.dirname(path.resolve(root)),path.resolve(os.tmpdir()));assert(path.basename(root).startsWith('pinnacle-cache-fixture-'));await fs.rm(root,{recursive:true,force:true});}
});

test('exact selected media scopes preserve prior indices and dynamic page filename bounds',()=>{
 assert.equal(R2_SCOPES.length,8);assert.deepEqual(R2_SCOPES.slice(0,7),[['pbn-test','Assets/InterventionTechniques/'],['pbn-test','Assets/InterventionTechniquePdf/'],['pbn-test','Assets/Materials/'],['pbn-test','Ability/Assessments/'],['pinnacle-ask-og',''],['pbn-test','Ability/Questions/'],['pbn-test','Ability/Examples/']]);assert.deepEqual(R2_SCOPES[7],['pbn-test','Assets/IMAGEGALLERY/']);
 for(let scope=0;scope<R2_SCOPES.length;scope++)assert(isCoveragePageName(`pass-1-scope-${scope}-page-123.json`));
 for(const name of [`pass-0-scope-${R2_SCOPES.length}-page-0.json`,'pass-2-scope-0-page-0.json','pass-0-scope-07-page-0.json'])assert.throws(()=>isCoveragePageName(name),/filename\/scope/);
});
test('old five-scope, seven-scope or unidentified coverage cannot authorize current absence',()=>{
 for(const count of [5,7]){
 const old=fixture(R2_SCOPES.slice(0,count));assert.throws(()=>validateCoverageChain(old.state,old.files),/fresh observation cycle/);
 const proof={scopeSetSHA256:old.state.scopeSetSHA256,scopeCount:count,registrySHA256:'a'.repeat(64),approvedKeys:0,completePasses:2,matchedInFirstPass:0,matchedInSecondPass:0,confirmedAbsent:0,unstableHeld:0};assert.throws(()=>verifiedR2Source(proof,{changes:[],holds:[]},{},proof.registrySHA256,new Date().toISOString()),/scope set/);
 proof.scopeSetSHA256=R2_SCOPE_SHA256;assert.throws(()=>verifiedR2Source(proof,{changes:[],holds:[]},{},proof.registrySHA256,new Date().toISOString()),/scope count/);
 }
 const current=fixture();delete current.state.scopeSetSHA256;assert.throws(()=>validateCoverageChain(current.state,current.files),/fresh observation cycle/);
});
function restamp(f,when){f.state.startedAt=when;for(const[name,raw]of Object.entries(f.files)){const p=JSON.parse(raw);p.observedAt=when;f.files[name]=Buffer.from(JSON.stringify(p));f.state.pageHashes[name]=pageHash(f.files[name]);}return f;}
async function writeFixture(root,f){await fs.mkdir(root,{recursive:true});for(const[name,raw]of Object.entries(f.files))await fs.writeFile(path.join(root,name),raw);await fs.writeFile(path.join(root,'state.json'),JSON.stringify(f.state));}
test('all current eight scopes complete twice through real cached rotation and progress reader',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'pinnacle-eight-scopes-'));
 try{
  const privateRoot=path.join(root,'ask-private'),cache=path.join(privateRoot,'fixture'),approved={};
  for(const[bucket,prefix]of R2_SCOPES)approved[bucket+'/'+prefix+'present.jpg']={etag:'present-etag',rights_status:'owned',public_uses:[{parent:'https://www.pinnacleblooms.org/abs/reference-fixture',selected:'https://images.pinnacleblooms.org/'+prefix+'present.jpg',kind:'image'}]};
  const bytes=Buffer.from(JSON.stringify(approved)),registrySHA=pageHash(bytes),f=restamp(fixture(),new Date().toISOString());f.state.registrySHA256=registrySHA;
  for(const[name,raw]of Object.entries(f.files)){const p=JSON.parse(raw),[bucket,prefix]=R2_SCOPES[p.scope];p.registrySHA256=registrySHA;p.rowsExamined=1;p.known=[{id:bucket+'/'+prefix+'present.jpg',etag:'present-etag',size:20}];f.files[name]=Buffer.from(JSON.stringify(p));f.state.pageHashes[name]=pageHash(f.files[name]);}
  await writeFixture(cache,f);const approvedFile=path.join(privateRoot,'approved.json');await fs.writeFile(approvedFile,bytes);await fs.writeFile(path.join(privateRoot,'public-publisher-config.json'),JSON.stringify({r2_associations:approvedFile}));
  const guard=path.join(root,'deny-network.mjs');await fs.writeFile(guard,"globalThis.fetch=()=>{throw Error('Unexpected network in eight-scope completion')};");
  execFileSync(process.execPath,['--import',pathToFileURL(guard).href,fileURLToPath(new URL('./r2-approved-rotation.mjs',import.meta.url)),'--root','ask-private/fixture'],{cwd:root,encoding:'utf8'});
  const proof=JSON.parse(await fs.readFile(path.join(cache,'proof.json'))),delta=JSON.parse(await fs.readFile(path.join(cache,'qualified-changes.json')));
  assert.equal(proof.scopeCount,R2_SCOPES.length);assert.equal(proof.scopeSetSHA256,R2_SCOPE_SHA256);assert.equal(proof.completePasses,2);assert.equal(proof.metadataPages,2*R2_SCOPES.length);assert.equal(proof.matchedInFirstPass,R2_SCOPES.length);assert.equal(proof.matchedInSecondPass,R2_SCOPES.length);assert.equal(proof.confirmedAbsent,0);assert.equal(proof.queriesThisInvocation,0);assert.deepEqual(delta.changes,[]);verifiedR2Source(proof,delta,approved,registrySHA,new Date().toISOString());
  const read=JSON.parse(execFileSync(process.execPath,[fileURLToPath(new URL('./verify-r2-progress.mjs',import.meta.url)),cache,'--require-fresh-complete'],{encoding:'utf8'}));assert.equal(read.scopeCount,R2_SCOPES.length);assert.equal(read.validatedMetadataPages,2*R2_SCOPES.length);assert(read.freshness.fresh);
  const missing=fixture(),last=`pass-1-scope-${R2_SCOPES.length-1}-page-0.json`;delete missing.files[last];delete missing.state.pageHashes[last];assert.throws(()=>validateCoverageChain(missing.state,missing.files),/count|frontier/);
 }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('complete current-scope observations still fail stale publication acceptance',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'pinnacle-stale-scopes-'));
 try{await writeFixture(root,restamp(fixture(),new Date(Date.now()-25*3600000).toISOString()));assert.throws(()=>execFileSync(process.execPath,[fileURLToPath(new URL('./verify-r2-progress.mjs',import.meta.url)),root,'--require-fresh-complete'],{encoding:'utf8',stdio:'pipe'}),/not fresh/);}finally{await fs.rm(root,{recursive:true,force:true});}
});
test('eight-scope checkpoint crosses runners with identity bound before local replacement',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'pinnacle-scope-state-'));
 try{
  const cache=path.join(root,'sender','speech-site','ask-private','r2-approved-current');await writeFixture(cache,restamp(fixture(),new Date().toISOString()));
  const code=`import importlib.util,io,json,pathlib,sys
spec=importlib.util.spec_from_file_location('cloud_state',sys.argv[1]);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class MemoryState:
 def __init__(self):self.objects={}
 def put_object(self,**kw):self.objects[kw['Key']]=kw['Body']
 def get_object(self,**kw):return {'Body':io.BytesIO(self.objects[kw['Key']])}
s3=MemoryState();root=pathlib.Path(sys.argv[2]);m.rotation_store(root/'sender',s3);result=m.rotation_hydrate(root/'receiver',s3)
assert result['pages']==${2*R2_SCOPES.length} and result['complete'];dest=root/'receiver/speech-site/ask-private/r2-approved-current';assert (dest/'pass-1-scope-${R2_SCOPES.length-1}-page-0.json').exists()
before={p.name:p.read_bytes() for p in dest.iterdir()};pointer=json.loads(s3.objects['rotation/current.json']);assert pointer['scopeCount']==${R2_SCOPES.length}
pointer['scopeSetSHA256']='b'*64;s3.objects['rotation/current.json']=json.dumps(pointer).encode()
try:m.rotation_hydrate(root/'receiver',s3)
except ValueError as error:assert 'identity' in str(error)
else:raise AssertionError('Altered scope identity accepted')
assert before=={p.name:p.read_bytes() for p in dest.iterdir()}
`;
  execFileSync(process.env.PYTHON_EXECUTABLE||'python3',['-B','-c',code,fileURLToPath(new URL('./cloud-source-state.py',import.meta.url)),root],{encoding:'utf8',env:{...process.env,NODE_EXECUTABLE:process.execPath}});
 }finally{await fs.rm(root,{recursive:true,force:true});}
});
