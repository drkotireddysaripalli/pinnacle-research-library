// Preparation only: existing release stages and exact-source CI still gate upload.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {build} from 'esbuild';
import {read,save,sha,hosts} from './release-managed-sitemaps.mjs';
import {routeCovered} from '../deployment/managed-route-policy.mjs';
const id=process.argv[2],key=process.argv[3];assert(/^[a-z0-9-]{8,80}$/.test(id||''));assert(/^[A-Za-z0-9-]{8,128}$/.test(key||''));
const priv='ask-private/'+id,out='outputs/'+id,rec=await read(out+'/release.json');assert.equal(rec.phase,'captured');assert(!rec.pending&&!rec.deployment&&!rec.candidateVersion);
const original=await read(priv+'/original.json'),before=await read(priv+'/before.json'),prior=await read(rec.baselineReceipt);
const configModule=original.items.find(m=>m.name==='managed-sitemap-config.mjs');assert(configModule);
const text=Buffer.from(configModule.base64,'base64').toString();assert(text.startsWith('export default '));const config=JSON.parse(text.slice(15).trim().replace(/;$/,''));
config.indexnowKeys=Object.fromEntries(hosts.map(h=>[h,key]));
await build({entryPoints:['deployment/managed-sitemap-runtime.mjs'],outfile:priv+'/managed-sitemap-runtime.mjs',bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,charset:'utf8'});
const candidate=structuredClone(original),replacements={'managed-sitemap-runtime.mjs':await fs.readFile(priv+'/managed-sitemap-runtime.mjs'),'managed-sitemap-config.mjs':Buffer.from('export default '+JSON.stringify(config)+';\n')};
for(const [name,bytes] of Object.entries(replacements)){const module=candidate.items.find(m=>m.name===name);assert(module);module.base64=bytes.toString('base64');}
assert.equal(candidate.items.length,original.items.length);assert.equal(candidate.entry,original.entry);
const additions=hosts.map(h=>h+'/'+key+'.txt').filter(pattern=>!routeCovered(before.routes,pattern));
// One-time owner operation. Retain existing exact routes and owners; establish
// managed discovery coverage so future daily shard growth needs no route edits.
for(const host of hosts){const exact=before.routes.find(r=>r.pattern===host+'/sitemap-*');if(exact)assert.equal(exact.script,'pinnacle-verify-route','Discovery namespace has another owner');if(!before.routes.some(r=>r.script==='pinnacle-verify-route'&&[host+'/*',host+'/sitemap-*'].includes(r.pattern)))additions.push(host+'/sitemap-*');}
await save(priv+'/candidate.json',candidate);await fs.copyFile(rec.baselineManifest,priv+'/manifest.json');await save(priv+'/runtime-config.json',config);
Object.assign(rec,{phase:'prepared',releaseId:prior.releaseId,sourceRelease:prior.sourceRelease,selectionSHA256:prior.selectionSHA256,selectedRelease:rec.previousRelease,fullUnion:rec.baselineDirectory,baseAssets:prior.totalAssets,totalAssets:prior.totalAssets,publicFiles:prior.publicFilesVerified,eligiblePages:prior.eligiblePages,oldModuleHashes:Object.fromEntries(original.items.map(m=>[m.name,sha(Buffer.from(m.base64,'base64'))])),candidateModuleHashes:Object.fromEntries(candidate.items.map(m=>[m.name,sha(Buffer.from(m.base64,'base64'))])),changedModules:Object.keys(replacements),retiredPublicPaths:config.retiredPublicPaths||[],plannedRouteAdditions:additions,indexnowKeys:config.indexnowKeys});
await save(out+'/release.json',rec);console.log(JSON.stringify({preparedOnly:true,unchangedPublicFiles:rec.publicFiles,unchangedAssets:rec.totalAssets,plannedKeyRoutes:additions}));
