// Pin only the already-published article corpus and accepted shell. No private
// customer, operational or held article record is introduced by this generator.
import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const sources={articles:'deployment/guru-recovery-20261009/data/articles.json',shell:'deployment/mirracles-library-20261008/data/shell.json'},records={},hashes={};
for(const[k,p]of Object.entries(sources)){const b=await fs.readFile(p);records[k]=JSON.parse(b);hashes[k]=createHash('sha256').update(b).digest('hex');}
assert.equal(records.articles.version,'guru-public-recovery-20261009');assert.equal(Object.keys(records.articles.records).length,491);assert(records.shell.head&&records.shell.header&&records.shell.footer);
await fs.writeFile('deployment/guru-source-assets.mjs','// Generated from the maintained published Guru corpus and common shell.\nconst records='+JSON.stringify(records)+';\nexport const guruSourceHashes='+JSON.stringify(hashes)+';\nexport function guruSourceJson(asset){return asset==="/guru-recovery-data/articles.json"?records.articles:asset==="/mirracles-library-data/shell.json"?records.shell:null;}\n');
console.log(JSON.stringify({publishedArticles:491,sourceHashes:hashes}));
