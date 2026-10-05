import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const release=path.resolve(root,process.argv[2]||'release-current');
const stage=path.resolve(root,process.argv[3]||'.worker-upload-current');
function insideRoot(target){const relative=path.relative(root,target);return relative&&!relative.startsWith('..')&&!path.isAbsolute(relative);}
assert(insideRoot(release)&&insideRoot(stage),'Release and upload staging must stay inside the project.');
await fs.access(path.join(release,'index.html'));
await fs.access(path.join(release,'pinnacle-pages-html','enrolment.html'));
await fs.mkdir(stage,{recursive:false});

const modules=['pinnacle-route-v12.mjs','discovery-handler.mjs','speech-handler.mjs','speech-enquiry-handler.mjs','centre-facilities.mjs','enrolment-handler.mjs','shopify-physical-feed.mjs','first-conversation-handler.mjs','first-conversation-assets.mjs','first-conversation-links.mjs','book-attribution-handler.mjs','book-attribution-assets.mjs','seva-handler.mjs','seva-assets.mjs','therapy-reading.mjs','therapy-reading-content.mjs','book-edition-search.mjs','book-edition-search-content.mjs','readiness-assets.mjs','abilityscore-assets.mjs','everyday-assets.mjs','occupational-assets.mjs','pdk-assets.mjs','prognose-assets.mjs','therapeuticai-assets.mjs','aba-assets.mjs','fusion-assets.mjs','special-education-assets.mjs','about-assets.mjs','book-kindle-links.mjs','book-hardcover-links.mjs'];
for(const name of modules)await fs.copyFile(path.join(root,'deployment',name),path.join(stage,name));
let assets=path.relative(stage,release).replaceAll('\\','/');
if(!assets.startsWith('.'))assets='./'+assets;
const config={
  $schema:'https://raw.githubusercontent.com/cloudflare/workers-sdk/main/packages/wrangler/config-schema.json',
  name:'pinnacle-verify-route',
  account_id:'862998def1cd610fdb86b8e5c1d6ed4d',
  main:'./pinnacle-route-v12.mjs',
  compatibility_date:'2026-09-18',
  no_bundle:true,
  find_additional_modules:true,
  rules:[{type:'ESModule',globs:modules.slice(1),fallthrough:true}],
  workers_dev:false,
  assets:{directory:assets,binding:'ASSETS',html_handling:'none',not_found_handling:'none',run_worker_first:true},
  services:[
    {binding:'PINNACLE_LEGACY',service:'pbn-planetscale'},
    {binding:'PINNACLE_ASK',service:'pinnacle-ask',environment:'production'}
  ]
};
await fs.writeFile(path.join(stage,'wrangler.jsonc'),JSON.stringify(config,null,2)+'\n');
console.log(JSON.stringify({release:path.relative(root,release),stage:path.relative(root,stage),modules:modules.length,config:path.relative(root,path.join(stage,'wrangler.jsonc'))},null,2));
