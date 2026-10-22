// Reuse the same parser in the two existing collectors; no extra tracker.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {normaliseReferrerOrigin,originOnlyAcquisition} from '../public/pinnacle-pages-scripts/enquiry-referrer.mjs';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const block='/* PINNACLE_REFERRER_ORIGIN_START */\n'+normaliseReferrerOrigin.toString()+'\n'+originOnlyAcquisition.toString()+'\n/* PINNACLE_REFERRER_ORIGIN_END */';
for(const relative of ['public/pinnacle-pages-scripts/speech-measurement.js','../helpline-site/phone-analytics.js']){
 const file=path.resolve(site,relative);let source=await fs.readFile(file,'utf8');
 const pattern=/\/\* PINNACLE_REFERRER_ORIGIN_START \*\/[\s\S]*?\/\* PINNACLE_REFERRER_ORIGIN_END \*\//g;
 const matches=source.match(pattern)||[];if(matches.length>1)throw Error('Multiple referrer blocks: '+relative);
 if(matches.length)source=source.replace(pattern,block);
 else{const at=source.indexOf('  let validationTraffic =');if(at<0)throw Error('Collector validation boundary changed: '+relative);source=source.slice(0,at)+block+'\n'+source.slice(at);}
 await fs.writeFile(file,source,'utf8');
}
