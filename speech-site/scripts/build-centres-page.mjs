// Compile only the directory, from the current common shell and source.
import fs from 'node:fs/promises';
import {build} from 'astro';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url), stage=new URL('ask-private/centres-build/',root);
await fs.mkdir(new URL('pages/',stage),{recursive:true});
await fs.writeFile(new URL('pages/centers.astro',stage),'---\nimport CentresPage from "../../../src/components/CentresPage.astro";\n---\n<CentresPage />\n');
const machine=spawnSync(process.env.PYTHON_EXECUTABLE||'python',['scripts/build-centers-machine-files.py'],{cwd:root,encoding:'utf8',windowsHide:true});
assert.equal(machine.status,0,machine.stderr);console.log(machine.stdout.trim());
process.env.PINNACLE_RELEASE='production';
await build({root,srcDir:fileURLToPath(stage),outDir:fileURLToPath(new URL('dist/',root)),site:'https://www.pinnacleblooms.org',output:'static',trailingSlash:'never',build:{assets:'pinnacle-pages-assets',format:'file'}});
// Retain reviewed social-image replacements for assets this scoped build emits.
const manifest=JSON.parse(await fs.readFile(new URL('og-release-20260930/manifest.json',root),'utf8'));
for(const entry of manifest.assets){const target=new URL('dist/'+entry.target,root);if(!(await fs.stat(target).catch(()=>null)))continue;const b=await fs.readFile(new URL('og-release-20260930/'+entry.replacement,root));assert.equal(createHash('sha256').update(b).digest('hex'),entry.sha256);await fs.writeFile(target,b);}
