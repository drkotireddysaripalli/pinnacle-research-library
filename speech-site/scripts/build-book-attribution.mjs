// Release exactly these shared-script bytes without replacing the active asset bundle.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const scripts={};
for(const name of ['speech-measurement.js','book-commerce.js']){
 const text=await fs.readFile('public/pinnacle-pages-scripts/'+name,'utf8');
 scripts['/pinnacle-pages-scripts/'+name]={text,sha256:crypto.createHash('sha256').update(text).digest('hex')};
}
await fs.writeFile('deployment/book-attribution-assets.mjs','// Generated from public/pinnacle-pages-scripts by scripts/build-book-attribution.mjs.\nexport const attributionScripts='+JSON.stringify(scripts)+';\n');
console.log(JSON.stringify({generated:'book-attribution-assets.mjs',scripts:Object.keys(scripts).length}));
