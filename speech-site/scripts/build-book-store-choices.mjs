import {build} from 'esbuild';
await build({entryPoints:['src/lib/book-store-choices.mjs'],bundle:true,platform:'browser',format:'esm',target:'es2022',minify:true,outfile:'deployment/book-store-choices.mjs'});
