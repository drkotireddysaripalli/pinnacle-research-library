// Refresh only the tiny QA-observation block in the two existing collectors.
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {normaliseValidationHints,readClientQaHints} from '../public/pinnacle-pages-scripts/enquiry-validation.mjs';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const block='/* PINNACLE_QA_PROVENANCE_START */\n'+normaliseValidationHints.toString()+'\n'+readClientQaHints.toString()+'\nreadClientQaHints();\n/* PINNACLE_QA_PROVENANCE_END */';
for(const relative of ['public/pinnacle-pages-scripts/speech-measurement.js','../helpline-site/phone-analytics.js']){
 const file=path.resolve(site,relative);let source=await fs.readFile(file,'utf8');
 const pattern=/\/\* PINNACLE_QA_PROVENANCE_START \*\/[\s\S]*?\/\* PINNACLE_QA_PROVENANCE_END \*\//g;
 const matches=source.match(pattern)||[];
 if(matches.length>1)throw Error('Multiple QA provenance blocks: '+relative);
 if(matches.length)source=source.replace(pattern,block);
 else{const at=source.indexOf('  let validationTraffic =');if(at<0)throw Error('Collector validation boundary changed: '+relative);source=source.slice(0,at)+block+'\n'+source.slice(at);}
 await fs.writeFile(file,source,'utf8');
}
