// Rebuild and verify the shared SEO repair modules from their maintained sources.
// This command is intentionally local and deterministic; provider recrawls remain
// separate evidence after the exact deployed revision is public.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {build} from 'esbuild';

const site=path.resolve(import.meta.dirname,'..');
process.chdir(site);
const node=process.execPath;
const generated=path.join(site,'deployment/mirracles-library.mjs');
const maintained=await fs.readFile(path.join(site,'deployment/mirracles-library-20261008/library.mjs'),'utf8');
const flat=maintained.replace("from './assets.mjs'","from './mirracles-library-assets.mjs'");
assert.notEqual(flat,maintained,'Mirracles asset import must be rewritten for the flat Worker module');
await fs.writeFile(generated,flat);

const runtime=await build({entryPoints:['deployment/url-health-repair.mjs'],bundle:true,format:'esm',write:false});
await fs.writeFile('deployment/url-health-runtime.mjs',runtime.outputFiles[0].text);

const tests=[
 'scripts/test-url-health-repair.mjs',
 'deployment/mirracles-library-20261008/library.test.mjs',
 'scripts/test-legacy-schema.mjs'
];
const result=spawnSync(node,['--test',...tests],{cwd:site,encoding:'utf8',windowsHide:true});
process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');
assert.equal(result.status,0,'Shared SEO repair tests failed');

const evidence={
 command:'node scripts/verify-seo-shared-repairs.mjs',
 completedAt:new Date().toISOString(),
 generated:['deployment/mirracles-library.mjs','deployment/url-health-runtime.mjs'],
 tests,
 exitCode:result.status
};
await fs.mkdir('outputs/seo-shared-repairs',{recursive:true});
await fs.writeFile('outputs/seo-shared-repairs/local-verification.json',JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify(evidence));
