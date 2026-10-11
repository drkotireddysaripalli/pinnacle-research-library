import{build}from'esbuild';
import{fileURLToPath}from'node:url';
await build({entryPoints:[fileURLToPath(new URL('../deployment/legacy-measurement.mjs',import.meta.url))],bundle:true,format:'esm',outfile:fileURLToPath(new URL('../deployment/legacy-measurement.runtime.mjs',import.meta.url))});
console.log(JSON.stringify({blockingNetworkRequests:0,earlyContact:'fixed in-memory queue; no window.load delay'}));
