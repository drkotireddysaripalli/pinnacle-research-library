import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
await build({entryPoints:[fileURLToPath(new URL('../deployment/public-template-protection.mjs',import.meta.url))],bundle:true,format:'esm',outfile:fileURLToPath(new URL('../deployment/public-template-protection.runtime.mjs',import.meta.url))});
console.log(JSON.stringify({generated:'public-template-protection.runtime.mjs',analyticsChanges:false}));
