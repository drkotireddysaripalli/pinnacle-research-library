import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {generatedHashes,inputFingerprint,makeSnapshots,requireCandidate} from './candidate.mjs';

function fixture(t) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'pinnacle-candidate-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const write=(p,text)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),text);};
  write('speech-site/src/page.astro','Original page');
  write('speech-site/deployment/public-ad-call.mjs','Original generated module');
  write('verify-site/content/source.md','Original evidence');
  execFileSync('git',['init','--quiet'],{cwd:root});
  execFileSync('git',['add','.'],{cwd:root});
  const results=path.join(root,'results');fs.mkdirSync(results);
  const before=generatedHashes(root);
  write('speech-site/deployment/public-ad-call.mjs','Rebuilt generated module');
  const generatedSnapshots=makeSnapshots(before,generatedHashes(root));
  const candidate={status:'passed',fingerprint:inputFingerprint(root,generatedSnapshots),generatedSnapshots};
  fs.writeFileSync(path.join(results,'candidate.json'),JSON.stringify(candidate));
  return {root,results,write};
}
test('verified candidate accepts unchanged inputs and rejects an unstaged source edit',t=>{
  const f=fixture(t);assert.equal(requireCandidate(f.root,f.results).status,'passed');
  f.write('speech-site/src/page.astro','Changed page');
  assert.throws(()=>requireCandidate(f.root,f.results),/inputs changed/);
});
test('new untracked source invalidates a previously built candidate',t=>{
  const f=fixture(t);f.write('speech-site/src/new-page.astro','New page');
  assert.throws(()=>requireCandidate(f.root,f.results),/inputs changed/);
});
test('both verified generated states are reusable; an unexpected generated edit is rejected',t=>{
  const f=fixture(t);f.write('speech-site/deployment/public-ad-call.mjs','Original generated module');
  assert.equal(requireCandidate(f.root,f.results).status,'passed');
  f.write('speech-site/deployment/public-ad-call.mjs','Unexpected module change');
  assert.throws(()=>requireCandidate(f.root,f.results),/inputs changed/);
});
test('changed evidence and an absent successful receipt prevent preview acceptance',t=>{
  const f=fixture(t);f.write('verify-site/content/source.md','Changed evidence');
  assert.throws(()=>requireCandidate(f.root,f.results),/inputs changed/);
  fs.unlinkSync(path.join(f.results,'candidate.json'));
  assert.throws(()=>requireCandidate(f.root,f.results),/No verified candidate/);
});
test('a declared generated file first created by a build does not become a new source input',t=>{
  const f=fixture(t),before=generatedHashes(f.root);
  const fingerprintBefore=inputFingerprint(f.root,makeSnapshots(before,before));
  f.write('speech-site/deployment/new-page-assets.mjs','New generated asset module');
  const snapshots=makeSnapshots(before,generatedHashes(f.root));
  assert.equal(inputFingerprint(f.root,snapshots),fingerprintBefore);
  f.write('speech-site/deployment/new-page-assets.mjs','Unexpected later edit');
  assert.notEqual(inputFingerprint(f.root,snapshots),fingerprintBefore);
});
