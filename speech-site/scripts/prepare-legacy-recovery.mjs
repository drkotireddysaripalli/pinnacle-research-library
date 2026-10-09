// Replace only the compiled public mobile-recovery section of the captured
// live Worker. Prove the old section corresponds to the committed source first.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {build} from 'esbuild';
const site=path.resolve(import.meta.dirname,'..'),repo=path.dirname(site),priv=path.join(site,'ask-private/server-error-family-20261009');
const git='C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe';
const mods=JSON.parse(await fs.readFile(path.join(priv,'legacy-modules.json'),'utf8')),entry=mods.find(m=>m.name==='entry.mjs');assert(entry);
const live=Buffer.from(entry.base64,'base64').toString(),boundary=live.indexOf('\n// ',5);assert(boundary>0);const oldSection=live.slice(live.indexOf('\n')+1,boundary).trim();
const original=execFileSync(git,['-C',repo,'show','5751b1a6312c5d228be5a1d0ab755f26b9f941b8:speech-site/deployment/public-mobile-recovery.mjs'],{encoding:'utf8',windowsHide:true});
async function compile(source){const result=await build({stdin:{contents:source,sourcefile:'public-mobile-recovery.mjs',resolveDir:path.join(site,'deployment')},bundle:true,format:'esm',write:false});return result.outputFiles[0].text.replace(/^\/\/[^\n]*\n/,'').replace(/\nexport \{[\s\S]*?\};\s*$/,'').trim();}
// esbuild renamed the function-local canonical variable in the original full
// bundle to avoid a name collision; no strings or behavior differ.
assert.equal(oldSection.replace(/\bcanonical2\b/g,'canonical'),await compile(original),'Live mobile recovery section differs from its source baseline');
const updated=await compile(await fs.readFile(path.join(site,'deployment/public-mobile-recovery.mjs'),'utf8'));
const candidate=live.slice(0,live.indexOf('\n')+1)+updated+'\n'+live.slice(boundary);
assert(candidate.endsWith(live.slice(boundary)),'Unchanged legacy bundle tail must be byte-identical');
await fs.writeFile(path.join(priv,'legacy-entry.mjs'),candidate);console.log(JSON.stringify({legacyBytes:Buffer.byteLength(candidate),unchangedTailBytes:Buffer.byteLength(live.slice(boundary)),changedSection:'public-mobile-recovery only'}));
