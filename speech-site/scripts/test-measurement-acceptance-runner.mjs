import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {acceptanceInputDigest,createAcceptanceFileHasher,checkAcceptanceReuse,assertAcceptancePath} from './verify-measurement-always-on.mjs';

// Offline, isolated files only. Importing the runner cannot launch its CLI.
test('resume verifies source/config/acceptance and actual persisted evidence',async()=>{
 const workspace=await fs.mkdtemp(path.join(os.tmpdir(),'pinnacle-runner-'));
 try{
  const files=['source.mjs','config.json','acceptance.json','stage.log','evidence.json'];
  for(const file of files)await fs.writeFile(path.join(workspace,file),'original '+file+'\n');
  const hash=createAcceptanceFileHasher(workspace);
  const fingerprint=async()=>acceptanceInputDigest({command:'contained-fixture',runtime:{node:process.version,platform:process.platform},inputs:await Promise.all(files.slice(0,3).map(file=>hash(path.join(workspace,file),{required:true})))});
  const old={exitCode:0,inputFingerprint:await fingerprint(),log:await hash(path.join(workspace,'stage.log'),{required:true}),evidence:[await hash(path.join(workspace,'evidence.json'),{required:true})]};
  const check=async(schemaVersion=2,stage={name:'fixture'})=>checkAcceptanceReuse({schemaVersion,stage,old,inputFingerprint:await fingerprint(),verifyEvidence:async saved=>{const actual=await hash(path.join(workspace,saved.path));return !actual.missing&&actual.sha256===saved.sha256;}});
  assert.equal(await check(),null,'Unchanged stage must reuse');
  for(const file of files.slice(0,3)){
   await fs.writeFile(path.join(workspace,file),'changed '+file+'\n');
   assert.match(await check(),/input changed/,file+' must invalidate');
   await fs.writeFile(path.join(workspace,file),'original '+file+'\n');
   assert.equal(await check(),null,file+' restored unchanged');
  }
  for(const file of files.slice(3)){
   await fs.writeFile(path.join(workspace,file),'tampered '+file+'\n');assert.match(await check(),/evidence missing or changed/,file+' tamper must invalidate');
   await fs.unlink(path.join(workspace,file));assert.match(await check(),/evidence missing or changed/,file+' missing must invalidate');
   await fs.writeFile(path.join(workspace,file),'original '+file+'\n');assert.equal(await check(),null,file+' restored unchanged');
  }
  assert.match(await check(1),/Legacy receipt/);
  assert.match(await check(2,{name:'wire',reusable:false}),/unpinned remote/);
  old.exitCode=1;assert.match(await check(),/execution failed/);old.exitCode=0;
  old.evidence=[];assert.match(await check(),/no hashed log\/evidence/);
 }finally{await fs.rm(workspace,{recursive:true,force:true});}
});

test('source file and directory symlinks cannot escape the workspace',async()=>{
 const workspace=await fs.mkdtemp(path.join(os.tmpdir(),'pinnacle-runner-')),outside=await fs.mkdtemp(path.join(os.tmpdir(),'pinnacle-outside-'));
 try{
  await fs.writeFile(path.join(outside,'source.mjs'),'outside fixture');
  await fs.symlink(outside,path.join(workspace,'linked-root'),'dir');
  await fs.symlink(path.join(outside,'source.mjs'),path.join(workspace,'linked-file'));
  const hash=createAcceptanceFileHasher(workspace);
  await assert.rejects(assertAcceptancePath(path.join(workspace,'linked-root'),workspace),/escapes its workspace or is linked/);
  await assert.rejects(hash(path.join(workspace,'linked-root/source.mjs'),{required:true}),/escapes its workspace or is linked/);
  await assert.rejects(hash(path.join(workspace,'linked-file'),{required:true}),/escapes its workspace or is linked/);
 }finally{await fs.rm(workspace,{recursive:true,force:true});await fs.rm(outside,{recursive:true,force:true});}
});
