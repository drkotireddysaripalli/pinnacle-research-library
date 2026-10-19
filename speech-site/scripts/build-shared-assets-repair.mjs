import fs from 'node:fs/promises';import {createHash} from 'node:crypto';import {transform} from 'esbuild';
const hash=b=>createHash('sha256').update(b).digest('hex');
const inputs={
 restored:{file:'portal-ad-call-14e25cf9a633d670.mjs',sha:'14e25cf9a633d670',old:'/pinnacle-pages-scripts/portal-ad-call-14e25cf9a633d670.mjs'},
 call:{file:'google-ads-call-consent.mjs',sha:null,old:'/pinnacle-pages-assets/google-ads-call-consent.FqeWzaS9.mjs'},
 legacy:{file:'newmirracleportal-v42.js',sha:'bf6fc446dd9840ab9b23518ca1ce94dd8b90af03851e161750cc9d2330dce0e8',old:'/bundles/newmirracleportal?v=42'}
};
const assets={},rewrites={},manifest={};
for(const [key,input] of Object.entries(inputs)){
 const bytes=await fs.readFile(key==='call'?new URL('../src/lib/google-ads-call-consent.mjs',import.meta.url):new URL('../deployment/shared-asset-sources/'+input.file,import.meta.url)),digest=hash(bytes);if(input.sha&&!digest.startsWith(input.sha))throw Error('Pinned input hash changed '+key);
 const original=bytes.toString('utf8');let code=original,target=input.old;
 if(key!=='restored'){
  // Preserve the Microsoft/jQuery and other original licence notices, including
  // ordinary comments that are not marked with esbuild's @license convention.
  const notices=[...original.matchAll(/\/\*[\s\S]*?\*\//g)].map(m=>m[0]).filter(s=>/licen[sc]e|copyright|NUGET/i.test(s));
  code=(await transform(original,{loader:'js',target:'es2018',minify:true,keepNames:true,legalComments:'none',banner:notices.join('\n')})).code;
  const stem=key==='call'?'google-ads-call-consent':'newmirracleportal';target='/pinnacle-pages-scripts/'+stem+'-'+hash(code).slice(0,16)+(key==='call'?'.mjs':'.js');rewrites[input.old]=target;
 }
 assets[target]={body:code,sha256:hash(code),integrity:'sha384-'+createHash('sha384').update(code).digest('base64')};
 manifest[key]={source:input.old,target,originalBytes:bytes.length,bytes:Buffer.byteLength(code),originalSHA256:digest,sha256:hash(code),licenceNoticesRetained:true};
}
await fs.writeFile(new URL('../deployment/shared-assets-repair-assets.mjs',import.meta.url),'// Generated deterministically from pinned public assets; original licence notices retained.\nexport const assets='+JSON.stringify(assets)+';\nexport const rewrites='+JSON.stringify(rewrites)+';\n');
await fs.writeFile(new URL('../deployment/shared-assets-repair-manifest.json',import.meta.url),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify(manifest));
